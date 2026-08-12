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

import { Diagnostic } from "../language-server/types";
import { Token } from "../parser/tokens";
import { rightmostIndexLE } from "../utils/search";
import { URI } from "../utils/uri";
import { MappedToken, Segment, SourceMap } from "./source-map";

export interface AnnotateResult {
  tokens: Token[];
  diagnostics: Diagnostic[];
}

/**
 * After running all preprocessor phases, the final composed text is lexed once to produce `finalTokens`.
 * Each token is then remapped back to its original source position via `sourceMap`, and any
 * `MappedToken` metadata recorded during the preprocessor phases is re-attached to the token.
 */
export function annotateTokens(
  finalTokens: Token[],
  finalDiagnostics: Diagnostic[],
  sourceMap: SourceMap,
  entryUri: URI,
): AnnotateResult {
  const tokens: Token[] = [];
  const diagnostics = finalDiagnostics.map((d) =>
    remapDiagnostic(d, sourceMap, entryUri),
  );
  // Tokens of the same file must share the exact same `URI` object - some consumers
  // (e.g. `stringify.ts#extractDeclaration`) compare by reference. Segments assign `.uri`
  // independently per span, so without interning two tokens from the same included file
  // could carry different (if string-equal) `URI` objects.
  const uriCache = new Map<string, URI>();
  const internUri = (uri: URI | undefined): URI => {
    const target = uri ?? entryUri;
    const key = target.toString();
    const cached = uriCache.get(key);
    if (cached) {
      return cached;
    }
    uriCache.set(key, target);
    return target;
  };

  for (const token of finalTokens) {
    const segment = sourceMap.segmentAt(token.startOffset);
    if (!segment) {
      tokens.push(token);
      continue;
    }

    const genOffset = token.startOffset;
    const genEndOffset = token.endOffset;
    const [origStart, origEnd] = mapTokenRange(token, segment, sourceMap);
    token.startOffset = origStart;
    token.endOffset = origEnd;
    token.uri = internUri(segment.uri);
    if (!segment.verbatim) {
      // Generated text: every token in the span collapses to the directive's start
      // offset, so keep it out of position-based LSP registration (see `Token.synthetic`).
      token.synthetic = true;
    }

    const mapped = findMappedToken(segment, genOffset);
    if (mapped) {
      // Span comparisons only hold when this re-lexed token exactly matches the recorded
      // one - if `immediateFollow` merged it with a neighbor during re-lexing, neither the
      // original image nor the original token object still applies.
      const exactSpan =
        genOffset === mapped.startOffset && genEndOffset === mapped.endOffset;
      if (exactSpan && mapped.sourceToken) {
        tokens.push(mapped.sourceToken);
        continue;
      }
      if (exactSpan) {
        token.image = mapped.originalImage;
        token.originalImage = mapped.originalImage;
      }
      if (mapped.refTarget) {
        token.element = mapped.refTarget;
        token.kind = mapped.refKind;
      }
    }
    tokens.push(token);
  }

  return { tokens, diagnostics };
}

/**
 * Picks out a phase's own consumed-directive tokens - the ones its internal parse attached
 * `.kind`/`.element` to (`%IF`/`%DCL`/`EXEC`/`DFHRESP`/... keyword and name tokens) - and
 * remaps their positions from this phase's input-text space to the original source, via
 * this phase's own `PhaseInput.sourceMap`. See `PhaseResult.directiveTokens`.
 */
export function extractDirectiveTokens(
  tokens: Token[],
  sourceMap: SourceMap,
): Token[] {
  const result: Token[] = [];
  // Keep one `URI` instance per logical file - see the interning note in `annotateTokens`.
  const uriCache = new Map<string, URI>();
  for (const token of tokens) {
    if (token.kind === undefined) {
      continue;
    }
    const start = sourceMap.mapToOriginal(token.startOffset);
    const end = sourceMap.mapToOriginal(token.endOffset);
    if (!start || !end) {
      continue;
    }
    token.startOffset = start.offset;
    token.endOffset = end.offset;
    if (start.uri) {
      const key = start.uri.toString();
      const cached = uriCache.get(key);
      if (cached) {
        token.uri = cached;
      } else {
        token.uri = start.uri;
        uriCache.set(key, start.uri);
      }
    } else {
      token.uri = start.uri;
    }
    result.push(token);
  }
  return result;
}

/** Maps a token's `[startOffset, endOffset]` (generated space) to original-source space. */
function mapTokenRange(
  token: Token,
  startSegment: Segment,
  sourceMap: SourceMap,
): [number, number] {
  const origStart = mapOffsetWithinSegment(startSegment, token.startOffset);
  if (token.endOffset < startSegment.genEnd) {
    // Common case: the whole token lives in one segment - avoid a second binary search.
    const origEnd = startSegment.verbatim
      ? mapOffsetWithinSegment(startSegment, token.endOffset)
      : origStart;
    return [origStart, origEnd];
  }
  // Rare: the token straddles a segment boundary (e.g. right at a phase edit's edge).
  const endMapped = sourceMap.mapToOriginal(token.endOffset);
  return [origStart, endMapped ? endMapped.offset : origStart];
}

function mapOffsetWithinSegment(segment: Segment, genOffset: number): number {
  return segment.verbatim
    ? segment.origStart + (genOffset - segment.genStart)
    : segment.origStart;
}

const mappedTokenStart = (token: MappedToken) => token.startOffset;

/**
 * Finds the `MappedToken` (generated-text-global offsets) covering `genOffset`. Binary
 * search - a foreign segment can carry one `MappedToken` per token of a whole included
 * file.
 */
function findMappedToken(
  segment: Segment,
  genOffset: number,
): MappedToken | undefined {
  const tokens = segment.tokens;
  if (!tokens) {
    return undefined;
  }
  const index = rightmostIndexLE(tokens, genOffset, mappedTokenStart);
  if (index === -1) {
    return undefined;
  }
  const mapped = tokens[index];
  return genOffset <= mapped.endOffset ? mapped : undefined;
}

/** Remaps a diagnostic raised against the final composed text back to its original position. */
function remapDiagnostic(
  diagnostic: Diagnostic,
  sourceMap: SourceMap,
  entryUri: URI,
): Diagnostic {
  if (!diagnostic.range) {
    return diagnostic;
  }
  const start = sourceMap.mapToOriginal(diagnostic.range.start);
  const end = sourceMap.mapExclusiveEnd(
    diagnostic.range.start,
    diagnostic.range.end,
  );
  if (!start || !end) {
    return diagnostic;
  }
  return {
    ...diagnostic,
    uri: (start.uri ?? entryUri).toString(),
    range: { start: start.offset, end: end.offset },
  };
}
