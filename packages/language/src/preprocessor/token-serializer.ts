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
 * Converts a preprocessor phase's final `Token[]` (the MACRO interpreter's internal,
 * deliberately token-based representation) into the `{text, sourceMap}` shape the rest of
 * the pipeline passes between phases. Tokens fall into three categories:
 *
 * - **Same-file verbatim** (`token.uri` matches `phaseUri`): consecutive tokens are
 *   sliced directly out of `phaseText` as one segment - but only while the gap between
 *   them is whitespace-only (a statement that expanded to nothing leaves a non-whitespace
 *   gap that must not be re-included).
 * - **Foreign** (`token.uri` set but different, e.g. `%INCLUDE`d): real positions in
 *   another file, so there's no `phaseText` to slice. Runs are reconstructed from
 *   `token.image` with exact-length space padding for gaps, preserving the file's offset
 *   stride, and become `foreign` verbatim segments.
 * - **Generated** (`token.uri` undefined, e.g. macro-substituted values): no real
 *   position at all; the run is resynthesized from `token.image` and anchored to the
 *   nearest preceding same-file position.
 *
 * Segment boundaries get a single separating space (or newline, per `startsNewLine`)
 * unless `immediateFollow` says there was no gap - so re-lexing the joined text can never
 * merge two distinct tokens. Foreign and generated spans carry one `MappedToken` per
 * contributing token, so cross-references and exact casing survive the final re-lex.
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
    // No output text at all: keep a zero-length segment so offset 0 still resolves.
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
 * Rebuilds a run of tokens from a single foreign file, padding gaps with exactly as many
 * characters as that file's own text had there (spaces - only the offsets matter
 * downstream; a leading newline when `startsNewLine` is set keeps rough line structure).
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
    // Separate from the next token unless `immediateFollow` says there was no gap, so
    // re-lexing can't merge two distinct tokens.
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
