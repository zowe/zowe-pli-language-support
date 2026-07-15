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

import * as ast from "../syntax-tree/ast";
import { CstNodeKind } from "../syntax-tree/cst";
import type { Token } from "../parser/tokens";
import { rightmostIndexLE } from "../utils/search";
import { URI } from "../utils/uri";

/**
 * Metadata attached to a span of *generated* text produced by a `replace`/`insert` edit
 * (see {@link Segment}). Carries only offsets - no line/column, see the module doc.
 */
export interface MappedToken {
  /**
   * The identifier name this span represents, if any (e.g. an `EXEC CICS LINK(name)`
   * argument). Only set on `execHostVariable` spans - matched against the engine's
   * classified sub-tokens (see `preprocessor-context.ts`'s `createEdit`).
   */
  name?: string;
  /** Offset within the generated text this segment produces. */
  startOffset: number;
  endOffset: number;
  /**
   * The exact text this span was synthesized with - restored onto the final re-lexed token
   * in place of whatever that re-lex's own case-folding produced. Needed because the final
   * lex is one call over the whole file with one `caseUpper` setting, but a span's casing
   * may already have been deliberately decided (e.g. `RESCAN(ASIS)` keeps macro-substituted
   * text exactly as typed, overriding the file's normal upper-casing).
   */
  originalImage: string;
  /** Resolved cross-reference target, if this span should link somewhere (e.g. a `DCL`). */
  refTarget?: ast.SyntaxNode;
  /** `Token.kind` to restore alongside `refTarget` - `getReferenceTarget`-style lookups key off both. */
  refKind?: CstNodeKind;
  /**
   * Whether this span is an `EXEC` host-variable reference, so the final annotate pass
   * inserts a synthetic `EXEC_VARIABLE_MARKER` token in front of it (the real parser
   * requires that marker; see `parser.ts`'s `execVariableReference` rule).
   */
  execHostVariable?: boolean;
  /**
   * The already-positioned token object this span was serialized from, when one exists.
   * The annotate pass emits this exact object instead of the re-lexed token, so the real
   * parser attaches `.kind`/`.element` to a token that (a) carries real original offsets
   * and (b) is the *same object* other registrations hold - which is what position-based
   * go-to-definition, find-references, and semantic tokens need. Two producers:
   *
   * - foreign (`%INCLUDE`d) runs: the included file's own token, the object `runInclude`
   *   registered with `files.set` for that file (see `token-serializer.ts`);
   * - `execHostVariable` spans: the classified sub-token for the host variable (see
   *   `exec-phase.ts`'s `collectExecMetadata`); emitted after the marker token.
   */
  sourceToken?: Token;
}

/**
 * One contiguous span of a `SourceMap`. Spans are non-overlapping and cover the whole
 * generated text, sorted ascending by `genStart` - the invariant that makes binary search
 * over that field correct. (`origStart` is *not* globally sorted: a `foreign` segment's
 * offsets live in a different file's coordinate space entirely.)
 *
 * - `verbatim` segments are a straight offset-for-offset copy of the input: no `tokens`
 *   needed, position mapping is `origStart + (offset - genStart)`.
 * - Non-verbatim segments come from a `replace`/`insert` edit: the whole generated span
 *   maps back to the *original* directive's range as one block (there is no 1:1 mapping
 *   inside a replacement), and may carry `tokens` describing sub-spans of interest within
 *   the generated text (e.g. an argument identifier for go-to-definition).
 * - `foreign` marks a segment (verbatim *or* non-verbatim) whose `origStart`/`origEnd` are
 *   *not* positions in this map's own "before this phase ran" space at all, but real offsets
 *   into a different file entirely - either a `%INCLUDE`d file's own tokens (reconstructed by
 *   `token-serializer.ts`'s foreign-run handling, always verbatim), or a spliced-in nested
 *   `PreprocessorContext` result (`PreprocessorContext.insertContext`, which may itself carry
 *   non-verbatim edits from the included file's own EXEC replacements). `compose` must never
 *   subdivide or re-anchor a foreign segment through `first` - unlike same-file text, there is
 *   no relationship between its offsets and `first`'s generated space to resolve.
 */
export interface Segment {
  origStart: number;
  origEnd: number;
  genStart: number;
  genEnd: number;
  uri?: URI;
  verbatim: boolean;
  foreign?: boolean;
  tokens?: MappedToken[];
}

export interface OriginalPosition {
  uri: URI | undefined;
  offset: number;
}

/**
 * Translates `tokens`' offsets from *local* (0-based within whatever generated text they
 * describe) to their final position in the generated text, by adding `genStart` (the start
 * of the segment they belong to). Shared by every producer of `Segment.tokens`
 * (`PreprocessorContext.build()`, `serializeTokens()`) so local-offset bookkeeping only
 * needs to be correct once.
 */
export function translateLocalTokens(
  tokens: MappedToken[] | undefined,
  genStart: number,
): MappedToken[] | undefined {
  if (!tokens) {
    return undefined;
  }
  return tokens.map((token) => ({
    ...token,
    startOffset: genStart + token.startOffset,
    endOffset: genStart + token.endOffset,
  }));
}

const segmentGenStart = (segment: Segment) => segment.genStart;

/**
 * A bidirectional, offset-based map between an original source text and the text produced
 * by a preprocessor phase (or the composition of several phases). Backs `PreprocessorContext`
 * and the final annotate-pass in `PliLexer`.
 *
 * Performance: this type sits on the tokenize hot path (multiple 100k-LOC files), so lookups
 * are binary search (`O(log segments)`) and `compose` is a merge that re-positions into
 * `first` by binary search per `second` segment
 * (`O(secondSegments * log firstSegments + overlaps)`); mapped-token metadata is located by
 * binary search too, so no operation scans a segment's whole token list - cost is only ever
 * proportional to the tokens actually carried over.
 */
export class SourceMap {
  private constructor(private readonly segments: readonly Segment[]) {}

  /**
   * The map's own segments, in `genStart` order. Exposed so a `PreprocessorContext` can
   * splice another context's already-built map into its own (`insertContext`), shifting
   * these segments by the splice offset and marking them `foreign`.
   */
  getSegments(): readonly Segment[] {
    return this.segments;
  }

  /**
   * A map for text that has not been touched by any preprocessor: every offset maps to
   * itself. Used to seed the pipeline before the first phase runs.
   */
  static identity(text: string, uri?: URI): SourceMap {
    const length = text.length;
    return new SourceMap([
      {
        origStart: 0,
        origEnd: length,
        genStart: 0,
        genEnd: length,
        uri,
        verbatim: true,
      },
    ]);
  }

  /**
   * Builds a map from already-assembled segments (e.g. from `PreprocessorContext.build()`).
   * Callers must supply segments sorted and contiguous per the {@link Segment} invariant.
   */
  static fromSegments(segments: Segment[]): SourceMap {
    return new SourceMap(segments);
  }

  /**
   * Returns the segment covering the given offset in the *generated* text, or `undefined`
   * if the offset is out of range (`< 0` or past the end of the generated text).
   */
  segmentAt(genOffset: number): Segment | undefined {
    if (genOffset < 0 || this.segments.length === 0) {
      return undefined;
    }
    const total = this.segments[this.segments.length - 1].genEnd;
    if (genOffset > total) {
      return undefined;
    }
    const index = rightmostIndexLE(this.segments, genOffset, segmentGenStart);
    return index === -1 ? undefined : this.segments[index];
  }

  /**
   * Maps an offset in the generated text back to its original source position.
   * For non-verbatim segments this resolves to the start of the original directive's
   * range (the whole replacement is one block - there is no finer-grained mapping).
   */
  mapToOriginal(genOffset: number): OriginalPosition | undefined {
    const segment = this.segmentAt(genOffset);
    if (!segment) {
      return undefined;
    }
    const offset = segment.verbatim
      ? segment.origStart + (genOffset - segment.genStart)
      : segment.origStart;
    return { uri: segment.uri, offset };
  }

  /**
   * Maps an EXCLUSIVE end offset (one past a range's last character, as diagnostic ranges
   * use) back to the original source. Mapping such an offset with {@link mapToOriginal}
   * directly is wrong at segment boundaries: `segmentAt` resolves an offset through the
   * segment *starting* there, so an end landing exactly on a boundary resolves through the
   * *next* segment - possibly a foreign (`%INCLUDE`) one in a different file - yielding
   * cross-file or inverted ranges. Instead this maps the range's last covered character
   * (`end - 1`) and re-adds the 1; zero-length ranges (`end <= start`) fall back to
   * mapping `start` itself.
   */
  mapExclusiveEnd(start: number, end: number): OriginalPosition | undefined {
    if (end <= start) {
      return this.mapToOriginal(start);
    }
    const mapped = this.mapToOriginal(end - 1);
    return mapped ? { uri: mapped.uri, offset: mapped.offset + 1 } : undefined;
  }

  /**
   * Composes two maps: `first` maps `text -> A`, `second` maps `A -> B`; the result maps
   * `text -> B`. This is how per-phase maps accumulate into one map from the original
   * document to the final preprocessed text.
   *
   * Implemented as a merge over `second`'s segments (in `A`/generated-of-first space),
   * each positioned into `first` by binary search - `second`'s verbatim segments are NOT
   * guaranteed to advance monotonically through `A` (a `%DO` re-emission rewinds; see
   * `serializeTokens`): verbatim spans are subdivided against `first`'s segment boundaries so untouched
   * source keeps precise, offset-accurate positions across any number of phases; non-verbatim
   * (replaced/inserted) spans stay atomic blocks, per the `Segment` contract - only their
   * anchor is resolved through `first`.
   */
  static compose(first: SourceMap, second: SourceMap): SourceMap {
    const composed: Segment[] = [];
    const firstSegments = first.segments;

    for (const secondSegment of second.segments) {
      if (secondSegment.foreign) {
        // Already real, final positions in another file - nothing to resolve through
        // `first`, and `first`'s space is not advanced (this segment didn't come from it).
        // Applies whether or not the segment is itself verbatim: a spliced-in nested
        // context's own non-verbatim edits are just as "foreign" as its verbatim text.
        composed.push({ ...secondSegment });
        continue;
      }
      if (!secondSegment.verbatim) {
        composed.push(composeNonVerbatimSegment(first, secondSegment));
        continue;
      }

      let a = secondSegment.origStart;
      // Position into `first` independently per `second` segment (binary search, the same
      // helper `segmentAt` uses) instead of carrying a monotonic cursor across segments:
      // `serializeTokens` legitimately emits verbatim segments whose `origStart` REWINDS
      // (a `%DO` loop or backward `%GOTO` re-emits the same source tokens once per
      // iteration), and a forward-only cursor would resolve those through the wrong
      // segment (negative delta) or silently drop them once `first`'s segments were
      // consumed. Within one `second` segment `a` only increases, so the local index
      // below still advances linearly.
      let firstIndex = rightmostIndexLE(firstSegments, a, segmentGenStart);
      if (firstIndex === -1) {
        // `a` lies before `first`'s first segment - outside `first`'s generated space,
        // nothing to resolve through (mirrors running past the last segment below).
        continue;
      }

      while (a < secondSegment.origEnd) {
        const fs = firstSegments[firstIndex];
        if (!fs) {
          break;
        }
        if (fs.genEnd <= a) {
          firstIndex++;
          continue;
        }
        const overlapEnd = Math.min(fs.genEnd, secondSegment.origEnd);
        const len = overlapEnd - a;
        const genStart = secondSegment.genStart + (a - secondSegment.origStart);
        // `fs.tokens` are in `first`'s generated space (= `second`'s original space); the
        // composed map's generated space is `second`'s, so re-base them by the overlap's
        // shift - and keep only the ones inside this overlap, since `fs` may be split
        // across several `second` segments. Dropping them here would lose foreign-run
        // metadata (`sourceToken`/`refTarget`) as soon as a later phase's map composes
        // over an earlier one's.
        const tokens = sliceMappedTokens(
          fs.tokens,
          a,
          overlapEnd,
          genStart - a,
        );
        if (fs.verbatim) {
          const origStart = fs.origStart + (a - fs.genStart);
          composed.push({
            genStart,
            genEnd: genStart + len,
            origStart,
            origEnd: origStart + len,
            uri: fs.uri,
            verbatim: true,
            foreign: fs.foreign,
            tokens,
          });
        } else {
          composed.push({
            genStart,
            genEnd: genStart + len,
            origStart: fs.origStart,
            origEnd: fs.origEnd,
            uri: fs.uri,
            verbatim: false,
            tokens,
          });
        }
        a = overlapEnd;
        if (a >= fs.genEnd) {
          firstIndex++;
        }
      }
    }

    return new SourceMap(composed);
  }
}

const mappedTokenStartOffset = (token: MappedToken) => token.startOffset;

/**
 * Returns the `tokens` whose span lies within `[start, end)` (in the space the tokens are
 * currently expressed in), shifted by `delta` into the composed map's generated space.
 * Tokens straddling either edge of the range are dropped (a token split across two
 * composed segments matches neither exactly, so its metadata could never be re-attached).
 * Returns `undefined` when nothing falls inside the range, so segments without metadata
 * stay allocation-free.
 *
 * Binary search over the (startOffset-sorted) tokens rather than a full filter: a foreign
 * segment carries one `MappedToken` per token of an entire included file, so filtering per
 * overlap would make composing K slices of it O(N*K).
 */
function sliceMappedTokens(
  tokens: MappedToken[] | undefined,
  start: number,
  end: number,
  delta: number,
): MappedToken[] | undefined {
  if (!tokens || tokens.length === 0) {
    return undefined;
  }
  // First index whose startOffset is >= start (see `rightmostIndexLE`'s dual).
  let index = rightmostIndexLE(tokens, start - 1, mappedTokenStartOffset) + 1;
  let inRange: MappedToken[] | undefined;
  for (; index < tokens.length; index++) {
    const token = tokens[index];
    if (token.startOffset >= end) {
      break;
    }
    if (token.endOffset >= end) {
      // Straddles the slice's end - dropped, per the contract above.
      continue;
    }
    if (!inRange) {
      inRange = [];
    }
    inRange.push(
      delta === 0
        ? token
        : {
            ...token,
            startOffset: token.startOffset + delta,
            endOffset: token.endOffset + delta,
          },
    );
  }
  return inRange;
}

/**
 * Resolves a non-verbatim `second`-space segment's anchor through `first`, producing one
 * atomic composed segment (see {@link SourceMap.compose}).
 */
function composeNonVerbatimSegment(
  first: SourceMap,
  secondSegment: Segment,
): Segment {
  const startAnchor = first.mapToOriginal(secondSegment.origStart);
  const lastOffset = Math.max(
    secondSegment.origStart,
    secondSegment.origEnd - 1,
  );
  const endAnchor = first.mapToOriginal(lastOffset);
  const origStart = startAnchor?.offset ?? secondSegment.origStart;
  const fallbackLength = secondSegment.origEnd - secondSegment.origStart;
  const origEnd = endAnchor
    ? Math.max(origStart, endAnchor.offset + 1)
    : origStart + fallbackLength;
  return {
    genStart: secondSegment.genStart,
    genEnd: secondSegment.genEnd,
    origStart,
    origEnd,
    uri: startAnchor?.uri,
    verbatim: false,
    tokens: secondSegment.tokens,
  };
}
