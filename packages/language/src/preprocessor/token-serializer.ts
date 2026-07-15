/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

import { Token } from "../parser/tokens";
import { URI } from "../utils/uri";
import {
  MappedToken,
  Segment,
  SourceMap,
  translateLocalTokens,
} from "./source-map";

export interface SerializedTokens {
  text: string;
  sourceMap: SourceMap;
}

const WHITESPACE_ONLY = /^\s*$/;

/**
 * Converts a preprocessor phase's final `Token[]` (the MACRO interpreter's own internal
 * representation, deliberately kept token-based) into the `{text, sourceMap}` shape the
 * rest of the pipeline passes between phases.
 *
 * Tokens fall into three categories:
 *
 * - **Same-file verbatim** (`token.uri` matches `phaseUri`): untouched source. Consecutive
 *   such tokens are sliced directly out of `phaseText` as one segment *only* when the gap
 *   between them is whitespace-only - i.e. nothing was removed there (a statement that
 *   expanded to nothing, e.g. a null `%;`, leaves a gap in `tokens` that is *not* just
 *   whitespace in `phaseText`, and must not be blindly re-included).
 * - **Foreign** (`token.uri` is set but does not match `phaseUri`, e.g. pulled in via
 *   `%INCLUDE`): still a real, correctly-positioned token, just not from this phase's own
 *   input text - so there's no `phaseText` to slice. Consecutive tokens from the *same*
 *   foreign file are still merged into one `verbatim: true` segment, reconstructed from
 *   `token.image` with exact-length space padding for any gap (padding preserves the
 *   original offset stride without needing that file's text - the padding's *content*
 *   never matters, only that re-lexing can't merge two distinct tokens). Anchoring these to
 *   a single point in the current file, as a `generated` span would, was a real bug: it
 *   misattributed every include-derived identifier to the wrong file and offset.
 * - **Generated** (`token.uri` is `undefined`, e.g. `lex()` on a macro-substituted value):
 *   there is no real position at all, so the whole contiguous run is resynthesized from
 *   `token.image` and anchored to the nearest preceding same-file position.
 *
 * Every segment-to-segment boundary (verbatim-to-verbatim split, verbatim-to-generated,
 * generated-to-verbatim, generated-to-generated, ...) inserts a single separating space -
 * or a newline when the following token's `startsNewLine` says it began a line in its
 * source, keeping the output roughly line-structured for human consumption (the
 * preprocessed text view) - unless the preceding token's `immediateFollow` says there was
 * truly no gap in the source -
 * that flag is exactly the signal the interpreter already tracks for its own rescan/merge
 * logic, so reusing it here guarantees re-lexing the joined text can never accidentally merge
 * two distinct tokens into one. A separator that isn't part of any real span becomes its own
 * tiny non-verbatim segment (never a bare, unmapped character), preserving the invariant that
 * segments cover the whole generated text contiguously.
 *
 * Every non-verbatim-by-slicing span (foreign and generated alike) carries a `MappedToken`
 * per contributing token, so cross-references (`token.element`) and exact casing
 * (`originalImage`, needed since e.g. `RESCAN(ASIS)` deliberately keeps macro-substituted
 * text as typed, overriding the final re-lex's own case-folding) survive that final re-lex.
 *
 * Linear in the number of tokens: one pass, building the output text with a single
 * array-join (never repeated concatenation), per the pipeline's performance requirements.
 */
export function serializeTokens(
  tokens: Token[],
  phaseUri: URI,
  phaseText: string,
): SerializedTokens {
  const phaseUriString = phaseUri.toString();
  const isSameFile = (token: Token) =>
    token.uri !== undefined && token.uri.toString() === phaseUriString;

  const segments: Segment[] = [];
  const chunks: string[] = [];
  let genCursor = 0;
  let anchor = 0;
  // The last token that actually contributed text to the output, so the *next* segment
  // knows whether a separator is needed at the boundary (its own `immediateFollow`).
  let previous: Token | undefined;

  function pushSeparatorIfNeeded(next: Token): void {
    if (previous && !previous.immediateFollow) {
      chunks.push(next.startsNewLine ? "\n" : " ");
      segments.push({
        origStart: anchor,
        origEnd: anchor,
        genStart: genCursor,
        genEnd: genCursor + 1,
        uri: phaseUri,
        verbatim: false,
      });
      genCursor += 1;
    }
  }

  let index = 0;
  while (index < tokens.length) {
    const token = tokens[index];

    if (isSameFile(token)) {
      const runStart = index;
      index++;
      while (
        index < tokens.length &&
        isSameFile(tokens[index]) &&
        // A loop (`%DO`) emits the same source tokens once per iteration, so a run only
        // continues while offsets strictly advance - a token at or before the previous
        // one's end starts a fresh re-emission of the same text, not a longer slice.
        tokens[index].startOffset > tokens[index - 1].endOffset &&
        isWhitespaceGap(
          phaseText,
          tokens[index - 1].endOffset + 1,
          tokens[index].startOffset,
        )
      ) {
        index++;
      }
      const origStart = tokens[runStart].startOffset;
      const origEnd = tokens[index - 1].endOffset + 1;
      const text = phaseText.slice(origStart, origEnd);

      pushSeparatorIfNeeded(tokens[runStart]);
      chunks.push(text);
      segments.push({
        origStart,
        origEnd,
        genStart: genCursor,
        genEnd: genCursor + text.length,
        uri: phaseUri,
        verbatim: true,
      });
      genCursor += text.length;
      anchor = origEnd;
      previous = tokens[index - 1];
      continue;
    }

    if (token.uri !== undefined) {
      const runStart = index;
      const runUri = token.uri;
      let last = token;
      index++;
      while (
        index < tokens.length &&
        sameUri(tokens[index].uri, runUri) &&
        tokens[index].startOffset > last.endOffset
      ) {
        last = tokens[index];
        index++;
      }
      const { text, mappedTokens } = synthesizeForeignRun(
        tokens,
        runStart,
        index,
      );

      pushSeparatorIfNeeded(tokens[runStart]);
      chunks.push(text);
      segments.push({
        origStart: tokens[runStart].startOffset,
        origEnd: last.endOffset + 1,
        genStart: genCursor,
        genEnd: genCursor + text.length,
        uri: runUri,
        verbatim: true,
        foreign: true,
        tokens: translateLocalTokens(mappedTokens, genCursor),
      });
      genCursor += text.length;
      previous = last;
      continue;
    }

    const runStart = index;
    while (index < tokens.length && tokens[index].uri === undefined) {
      index++;
    }
    const { text, mappedTokens, lastContributor } = synthesizeRun(
      tokens,
      runStart,
      index,
    );
    if (text.length > 0) {
      pushSeparatorIfNeeded(tokens[runStart]);
      chunks.push(text);
      segments.push({
        origStart: anchor,
        origEnd: anchor,
        genStart: genCursor,
        genEnd: genCursor + text.length,
        uri: phaseUri,
        verbatim: false,
        tokens: translateLocalTokens(mappedTokens, genCursor),
      });
      genCursor += text.length;
      previous = lastContributor;
    }
  }

  if (segments.length === 0) {
    // Degenerate case: this phase's tokens produced no output text at all (e.g. a null
    // `%;` statement, or a whole file's worth of macro directives expanding to nothing).
    // Keep a zero-length segment so offset 0 still resolves, matching
    // SourceMap.identity("")'s and PreprocessorContext.build()'s handling of empty output.
    segments.push({
      origStart: 0,
      origEnd: 0,
      genStart: 0,
      genEnd: 0,
      uri: phaseUri,
      verbatim: true,
    });
  }

  return { text: chunks.join(""), sourceMap: SourceMap.fromSegments(segments) };
}

function sameUri(a: URI | undefined, b: URI | undefined): boolean {
  return a !== undefined && b !== undefined && a.toString() === b.toString();
}

/** Whether `text[start, end)` (a gap between two verbatim tokens) is empty or whitespace-only. */
function isWhitespaceGap(text: string, start: number, end: number): boolean {
  return WHITESPACE_ONLY.test(text.slice(start, end));
}

/**
 * Rebuilds a run of tokens from a single foreign file, padding any gap between two tokens
 * with exactly as many characters as that file's own text had there. The padding's *content*
 * is never inspected by anything downstream (only offsets are), so generic spaces are enough
 * to keep the offset stride correct without needing that file's real text - but a token
 * whose `startsNewLine` flag is set gets a leading newline in its padding, so the rebuilt
 * text keeps the file's rough line structure (with the remaining spaces as indentation).
 */
function synthesizeForeignRun(
  tokens: Token[],
  start: number,
  end: number,
): { text: string; mappedTokens: MappedToken[] } {
  const chunks: string[] = [];
  const mappedTokens: MappedToken[] = [];
  let cursor = tokens[start].startOffset;
  let localCursor = 0;

  for (let i = start; i < end; i++) {
    const token = tokens[i];
    if (token.startOffset > cursor) {
      const gap = token.startOffset - cursor;
      chunks.push(
        token.startsNewLine ? "\n" + " ".repeat(gap - 1) : " ".repeat(gap),
      );
      localCursor += gap;
    }
    const image = token.image;
    chunks.push(image);
    mappedTokens.push({
      startOffset: localCursor,
      endOffset: localCursor + image.length - 1,
      originalImage: image,
      refTarget: token.element,
      refKind: token.kind,
      // The annotate pass emits this exact object instead of the re-lexed token, so the
      // real parser's `.kind`/`.element` attachments land on the same object `runInclude`
      // registered for the included file - see `MappedToken.sourceToken`.
      sourceToken: token,
    });
    localCursor += image.length;
    cursor = token.endOffset + 1;
  }

  return { text: chunks.join(""), mappedTokens };
}

function synthesizeRun(
  tokens: Token[],
  start: number,
  end: number,
): {
  text: string;
  mappedTokens: MappedToken[];
  lastContributor: Token | undefined;
} {
  const chunks: string[] = [];
  const mappedTokens: MappedToken[] = [];
  let cursor = 0;
  let lastContributor: Token | undefined;

  for (let i = start; i < end; i++) {
    const token = tokens[i];
    const image = token.image;
    if (image.length > 0) {
      const tokenStart = cursor;
      chunks.push(image);
      cursor += image.length;
      mappedTokens.push({
        startOffset: tokenStart,
        endOffset: cursor - 1,
        originalImage: image,
        refTarget: token.element,
        refKind: token.kind,
      });
      lastContributor = token;
    }
    // The next real token in this run immediately follows this one's source characters
    // unless `immediateFollow` says otherwise - preserve that as a single separating space
    // (or newline, mirroring the next token's `startsNewLine`) so re-lexing the joined
    // text can't accidentally merge two distinct tokens into one.
    const next = nextContentToken(tokens, i + 1, end);
    if (!token.immediateFollow && next) {
      chunks.push(next.startsNewLine ? "\n" : " ");
      cursor += 1;
    }
  }

  return { text: chunks.join(""), mappedTokens, lastContributor };
}

/** The next token after `from` (up to `end`) that contributes visible text, if any. */
function nextContentToken(
  tokens: Token[],
  from: number,
  end: number,
): Token | undefined {
  for (let i = from; i < end; i++) {
    if (tokens[i].image.length > 0) {
      return tokens[i];
    }
  }
  return undefined;
}
