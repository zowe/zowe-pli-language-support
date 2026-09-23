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
 * Metadata attached to a span of generated text produced by a `replace`/`insert` edit.
 */
export interface MappedToken {
  /**
   * The token image this span represents, if any.
   */
  name?: string;
  /** Offset within the generated text this segment produces. */
  startOffset: number;
  /**
   * INCLUSIVE end offset (the last covered character), matching `Token.endOffset`.
   */
  endOffset: number;
  /**
   * The exact text this span was synthesized with, restored onto the final re-lexed token.
   */
  originalImage: string;
  /** Resolved cross-reference target, if this span should link somewhere (e.g. a `DCL`). */
  refTarget?: ast.SyntaxNode;
  /** `Token.kind` to restore alongside `refTarget` - `getReferenceTarget`-style lookups key off both. */
  refKind?: CstNodeKind;
  /**
   * The already-positioned token object this span was serialized from, when one exists. The
   * annotate pass emits this exact object instead of the re-lexed token.
   */
  sourceToken?: Token;
}

/**
 * One contiguous span of a `SourceMap`. Spans are non-overlapping, cover the whole generated text,
 * and are sorted ascending by `genStart`. `foreign` spans carry offsets into a different file.
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
 * Translates `tokens`' offsets from local (0-based within their generated span) to their final
 * position in the generated text.
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
 * A bidirectional, offset-based map between an original source text and the text produced by a
 * preprocessor phase. All lookups are binary search.
 */
export class SourceMap {
  private constructor(private readonly segments: readonly Segment[]) {}

  /**
   * The map's own segments, in `genStart` order.
   */
  getSegments(): readonly Segment[] {
    return this.segments;
  }

  /**
   * A map for text that has not been touched by any preprocessor: every offset maps to itself.
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
   * Builds a map from already-assembled segments, which must be sorted and contiguous.
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
   * Maps an offset in the generated text back to its original source position. Non-verbatim
   * segments resolve to the start of the original directive's range.
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
   * Maps an EXCLUSIVE end offset back to the original source by mapping the last covered character
   * (`end - 1`) and re-adding the 1.
   */
  mapExclusiveEnd(start: number, end: number): OriginalPosition | undefined {
    if (end <= start) {
      return this.mapToOriginal(start);
    }
    const mapped = this.mapToOriginal(end - 1);
    return mapped ? { uri: mapped.uri, offset: mapped.offset + 1 } : undefined;
  }

  /**
   * Composes two maps: `first` maps `text -> A`, `second` maps `A -> B`;
   * the result maps `text -> B`.
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
      // Position into `first` by binary search per `second` segment: `serializeTokens` legitimately
      // emits verbatim segments whose `origStart` rewinds.
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
 * Returns the `tokens` whose span lies within `[start, end)`, shifted by `delta`. Tokens straddling
 * either edge are dropped.
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
