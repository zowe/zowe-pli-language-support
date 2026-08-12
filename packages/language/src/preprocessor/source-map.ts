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
  /**
   * INCLUSIVE end offset (the last covered character), matching the lexer's
   * `Token.endOffset` convention - unlike `Segment`'s exclusive `origEnd`/`genEnd`.
   */
  endOffset: number;
  /**
   * The exact text this span was synthesized with - restored onto the final re-lexed
   * token, since a span's casing may already have been decided (e.g. `RESCAN(ASIS)`)
   * while the final lex applies one `caseUpper` setting to the whole file.
   */
  originalImage: string;
  /** Resolved cross-reference target, if this span should link somewhere (e.g. a `DCL`). */
  refTarget?: ast.SyntaxNode;
  /** `Token.kind` to restore alongside `refTarget` - `getReferenceTarget`-style lookups key off both. */
  refKind?: CstNodeKind;
  /**
   * The already-positioned token object this span was serialized from, when one exists
   * (an included file's registered token, or an `execHostVariable` sub-token). The
   * annotate pass emits this exact object instead of the re-lexed token, so the parser
   * annotates the same object other registrations hold - which is what position-based
   * go-to-definition, find-references, and semantic tokens need.
   */
  sourceToken?: Token;
}

/**
 * One contiguous span of a `SourceMap`. Spans are non-overlapping, cover the whole
 * generated text, and are sorted ascending by `genStart` (enabling binary search).
 *
 * - `verbatim`: a straight copy of the input, mapped `origStart + (offset - genStart)`.
 * - Non-verbatim: a `replace`/`insert` edit; the whole span maps back to the directive's
 *   range as one block, optionally with `tokens` describing sub-spans of interest.
 * - `foreign`: `origStart`/`origEnd` are real offsets into a *different* file (an
 *   `%INCLUDE`d file's tokens or a spliced-in nested context). `compose` must never
 *   subdivide or re-anchor a foreign segment through `first` - its offsets have no
 *   relationship to `first`'s generated space.
 */
export interface Segment {
  origStart: number;
  /** EXCLUSIVE (one past the last covered original offset, like `String.slice`). */
  origEnd: number;
  genStart: number;
  /** EXCLUSIVE (one past the last covered generated offset, like `String.slice`). */
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
 * Translates `tokens`' offsets from local (0-based within their generated span) to their
 * final position in the generated text. Shared by every producer of `Segment.tokens`.
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
 * and the final annotate-pass in `PliLexer`. Sits on the tokenize hot path, so all lookups
 * are binary search - never linear in segment or token count.
 */
export class SourceMap {
  private constructor(private readonly segments: readonly Segment[]) {}

  /**
   * The map's own segments, in `genStart` order. Exposed for
   * `PreprocessorContext.insertContext`'s splicing.
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
   * Maps an EXCLUSIVE end offset (as diagnostic ranges use) back to the original source.
   * Mapping it with {@link mapToOriginal} directly would resolve an end landing exactly on
   * a segment boundary through the *next* segment - possibly one in a different file - so
   * this maps the last covered character (`end - 1`) and re-adds the 1.
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
   * document to the final preprocessed text. Verbatim spans are subdivided against
   * `first`'s segment boundaries so untouched source keeps offset-accurate positions
   * across any number of phases; non-verbatim spans stay atomic blocks, with only their
   * anchor resolved through `first`.
   */
  static compose(first: SourceMap, second: SourceMap): SourceMap {
    const composed: Segment[] = [];
    const firstSegments = first.segments;

    for (const secondSegment of second.segments) {
      if (secondSegment.foreign) {
        // Already real, final positions in another file - nothing to resolve through
        // `first` (see the `Segment` doc).
        composed.push({ ...secondSegment });
        continue;
      }
      if (!secondSegment.verbatim) {
        composed.push(composeNonVerbatimSegment(first, secondSegment));
        continue;
      }

      // Cursor through the `second` segment's original span - offsets in `first`'s
      // generated space.
      let origOffset = secondSegment.origStart;
      // Position into `first` by binary search per `second` segment, NOT with a monotonic
      // cursor across segments: `serializeTokens` legitimately emits verbatim segments
      // whose `origStart` rewinds (a `%DO` loop re-emits the same source tokens once per
      // iteration), which a forward-only cursor would resolve through the wrong segment.
      let firstIndex = rightmostIndexLE(
        firstSegments,
        origOffset,
        segmentGenStart,
      );
      if (firstIndex === -1) {
        // Before `first`'s first segment - outside its generated space.
        continue;
      }

      while (origOffset < secondSegment.origEnd) {
        const firstSegment = firstSegments[firstIndex];
        if (!firstSegment) {
          break;
        }
        if (firstSegment.genEnd <= origOffset) {
          firstIndex++;
          continue;
        }
        const overlapEnd = Math.min(firstSegment.genEnd, secondSegment.origEnd);
        const len = overlapEnd - origOffset;
        const genStart =
          secondSegment.genStart + (origOffset - secondSegment.origStart);
        // Re-base `firstSegment.tokens` into the composed map's generated space, keeping
        // only the ones inside this overlap (`firstSegment` may be split across several
        // `second` segments).
        const tokens = sliceMappedTokens(
          firstSegment.tokens,
          origOffset,
          overlapEnd,
          genStart - origOffset,
        );
        if (firstSegment.verbatim) {
          const origStart =
            firstSegment.origStart + (origOffset - firstSegment.genStart);
          composed.push({
            genStart,
            genEnd: genStart + len,
            origStart,
            origEnd: origStart + len,
            uri: firstSegment.uri,
            verbatim: true,
            foreign: firstSegment.foreign,
            tokens,
          });
        } else {
          composed.push({
            genStart,
            genEnd: genStart + len,
            origStart: firstSegment.origStart,
            origEnd: firstSegment.origEnd,
            uri: firstSegment.uri,
            verbatim: false,
            tokens,
          });
        }
        origOffset = overlapEnd;
        if (origOffset >= firstSegment.genEnd) {
          firstIndex++;
        }
      }
    }

    return new SourceMap(composed);
  }
}

const mappedTokenStartOffset = (token: MappedToken) => token.startOffset;

/**
 * Returns the `tokens` whose span lies within `[start, end)`, shifted by `delta` into the
 * composed map's generated space. Tokens straddling either edge are dropped (split
 * metadata could never be re-attached). Located by binary search - a foreign segment can
 * carry one `MappedToken` per token of an entire included file.
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
      // Straddles the slice's end - dropped.
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
