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

import { describe, expect, test } from "vitest";
import { createTokenInstance, ID, Token } from "../../src/parser/tokens";
import { SourceMap } from "../../src/preprocessor/source-map";
import { serializeTokens } from "../../src/preprocessor/token-serializer";
import { UriUtils } from "../../src/utils/uri";
import * as ast from "../../src/syntax-tree/ast";

const uri = UriUtils.toUri("memory:///serializer-test.pli");
const otherUri = UriUtils.toUri("memory:///other.pli");

/** A verbatim token: real uri, real offsets into `phaseText`. */
function sourceToken(
  image: string,
  startOffset: number,
  immediateFollow = false,
): Token {
  const token = createTokenInstance(
    image,
    image,
    ID,
    startOffset,
    startOffset + image.length - 1,
    uri,
  );
  token.immediateFollow = immediateFollow;
  return token;
}

/** A generated token: no real uri, meaningless self-relative offsets (as `lex()` produces). */
function generatedToken(
  image: string,
  immediateFollow = false,
  element?: ast.SyntaxNode,
): Token {
  const token = createTokenInstance(
    image,
    image,
    ID,
    0,
    image.length - 1,
    undefined,
  );
  token.immediateFollow = immediateFollow;
  token.element = element;
  return token;
}

describe("serializeTokens - empty output", () => {
  test("zero tokens (e.g. a null %; statement) still produces a resolvable map", () => {
    const { text, sourceMap } = serializeTokens([], uri, " %;");
    expect(text).toBe("");
    expect(sourceMap.mapToOriginal(0)).toEqual({ uri, offset: 0 });
  });
});

describe("serializeTokens - all verbatim", () => {
  test("slices the exact phase text for a contiguous run of real tokens", () => {
    const phaseText = "PUT LIST(A);";
    const tokens = [sourceToken("PUT", 0), sourceToken("LIST", 4)];
    const { text, sourceMap } = serializeTokens(tokens, uri, phaseText);
    expect(text).toBe("PUT LIST");
    expect(sourceMap.mapToOriginal(0)).toEqual({ uri, offset: 0 });
    expect(sourceMap.mapToOriginal(4)).toEqual({ uri, offset: 4 });
  });
});

describe("serializeTokens - all generated", () => {
  test("joins images with a single space unless immediateFollow", () => {
    const tokens = [
      generatedToken("HELLO", true),
      generatedToken("WORLD", false),
    ];
    const { text } = serializeTokens(tokens, uri, "");
    // HELLO immediateFollow=true -> no space before WORLD.
    expect(text).toBe("HELLOWORLD");
  });

  test("inserts exactly one space between tokens that are not immediateFollow", () => {
    const tokens = [generatedToken("A", false), generatedToken("B", false)];
    const { text } = serializeTokens(tokens, uri, "");
    expect(text).toBe("A B");
  });

  test("does not add a trailing space after the last token in a run", () => {
    const tokens = [generatedToken("A", false)];
    const { text } = serializeTokens(tokens, uri, "");
    expect(text).toBe("A");
  });

  test("carries refTarget through for tokens with a synthetic reference", () => {
    const targetNode =
      ast.createDeclareStatement() as unknown as ast.SyntaxNode;
    const tokens = [generatedToken("MYVAR", false, targetNode)];
    const { text, sourceMap } = serializeTokens(tokens, uri, "");
    expect(text).toBe("MYVAR");
    const segment = sourceMap.segmentAt(0);
    expect(segment?.tokens?.[0]).toMatchObject({
      refTarget: targetNode,
    });
  });
});

describe("serializeTokens - mixed verbatim and generated", () => {
  test("verbatim runs stay verbatim; generated runs anchor to the nearest verbatim boundary", () => {
    // "FOO %A BAZ" where "%A" (source offsets 4-5) expanded to "HELLO". Neither "FOO" nor
    // the generated "HELLO" is immediateFollow, so a separator is inserted at each
    // boundary - exactly reproducing the fact that there was real whitespace in the source.
    const phaseText = "FOO %A BAZ";
    const tokens = [
      sourceToken("FOO", 0),
      generatedToken("HELLO"),
      sourceToken("BAZ", 7),
    ];
    const { text, sourceMap } = serializeTokens(tokens, uri, phaseText);
    expect(text).toBe("FOO HELLO BAZ");

    // "FOO" is untouched, verbatim.
    expect(sourceMap.mapToOriginal(0)).toEqual({ uri, offset: 0 });
    expect(sourceMap.segmentAt(0)?.verbatim).toBe(true);

    // The generated "HELLO" block anchors to the end of the preceding verbatim run.
    const helloOffset = text.indexOf("HELLO");
    const generatedSegment = sourceMap.segmentAt(helloOffset);
    expect(generatedSegment?.verbatim).toBe(false);
    expect(generatedSegment?.origStart).toBe(3); // end of "FOO" (offset 0..2, so 3)

    // "BAZ" resumes as its own verbatim segment, at its real source offset.
    const bazOffset = text.indexOf("BAZ");
    expect(sourceMap.mapToOriginal(bazOffset)).toEqual({ uri, offset: 7 });
  });

  test("immediateFollow suppresses the boundary separator between a verbatim run and generated text", () => {
    // "FOO%A" (no space) - "FOO" is immediateFollow, so nothing separates it from "HELLO".
    const tokens = [
      sourceToken("FOO", 0, true),
      generatedToken("HELLO", true),
      sourceToken("BAZ", 5, true),
    ];
    const { text } = serializeTokens(tokens, uri, "FOO%ABAZ");
    expect(text).toBe("FOOHELLOBAZ");
  });

  test("a gap left by a statement that expanded to nothing is not resurrected", () => {
    // "A; %; B" where "%;" (a null macro statement) contributed zero tokens - the gap
    // between "A;" and "B" in the source is not just whitespace (it contains "%;"), so it
    // must not be sliced verbatim; a single separator replaces it instead.
    const phaseText = "A; %; B";
    const tokens = [
      sourceToken("A", 0),
      sourceToken(";", 1),
      sourceToken("B", 6),
    ];
    const { text, sourceMap } = serializeTokens(tokens, uri, phaseText);
    expect(text).not.toContain("%");
    expect(text).toBe("A; B");
    expect(sourceMap.mapToOriginal(text.indexOf("B"))).toEqual({
      uri,
      offset: 6,
    });
  });
});

describe("serializeTokens - foreign-file tokens (e.g. %INCLUDE)", () => {
  test("a foreign token keeps its own uri and its own precise offset, not the phase's", () => {
    // A real bug: foreign tokens used to be treated like generated text, misattributing
    // them to the including file at a single anchor point instead of their own position.
    const foreign = createTokenInstance("INC", "INC", ID, 5, 7, otherUri);
    const tokens = [sourceToken("FOO", 0, true), foreign];
    const { text, sourceMap } = serializeTokens(tokens, uri, "FOO");
    const genOffset = text.indexOf("INC");
    const segment = sourceMap.segmentAt(genOffset);
    expect(segment?.verbatim).toBe(true);
    expect(segment?.uri?.toString()).toBe(otherUri.toString());
    expect(sourceMap.mapToOriginal(genOffset)).toEqual({
      uri: otherUri,
      offset: 5,
    });
    // The middle and last character of "INC" map precisely too (not just the start).
    expect(sourceMap.mapToOriginal(genOffset + 2)).toEqual({
      uri: otherUri,
      offset: 7,
    });
  });

  test("merges consecutive tokens from the same foreign file, padding any gap to preserve exact offsets", () => {
    // Two tokens from `otherUri` with a 2-character gap between them (offsets 5-7 "INC",
    // then a gap, then offsets 10-12 "LUD").
    const first = createTokenInstance("INC", "INC", ID, 5, 7, otherUri);
    const second = createTokenInstance("LUD", "LUD", ID, 10, 12, otherUri);
    const tokens = [first, second];
    const { text, sourceMap } = serializeTokens(tokens, uri, "");
    expect(text).toBe("INC  LUD"); // 2-space padding preserves the real gap length
    expect(sourceMap.mapToOriginal(0)).toEqual({ uri: otherUri, offset: 5 });
    expect(sourceMap.mapToOriginal(5)).toEqual({ uri: otherUri, offset: 10 });
    expect(sourceMap.mapToOriginal(7)).toEqual({ uri: otherUri, offset: 12 });
    // Exactly one segment covers the whole merged run.
    expect(sourceMap.segmentAt(0)).toBe(sourceMap.segmentAt(7));
  });

  test("does not merge tokens from two different foreign files", () => {
    const thirdUri = UriUtils.toUri("memory:///third.pli");
    const first = createTokenInstance("A", "A", ID, 0, 0, otherUri);
    first.immediateFollow = true; // no separator between them, for a clean boundary check
    const second = createTokenInstance("B", "B", ID, 0, 0, thirdUri);
    const tokens = [first, second];
    const { text, sourceMap } = serializeTokens(tokens, uri, "");
    expect(text).toBe("AB");
    expect(sourceMap.segmentAt(0)?.uri?.toString()).toBe(otherUri.toString());
    expect(sourceMap.segmentAt(1)?.uri?.toString()).toBe(thirdUri.toString());
  });

  test("preserves a foreign token's synthetic reference and exact casing", () => {
    const targetNode =
      ast.createDeclareStatement() as unknown as ast.SyntaxNode;
    const foreign = createTokenInstance("myvar", "myvar", ID, 0, 4, otherUri);
    foreign.element = targetNode;
    const { sourceMap } = serializeTokens([foreign], uri, "");
    const segment = sourceMap.segmentAt(0);
    expect(segment?.tokens?.[0]).toMatchObject({
      refTarget: targetNode,
      originalImage: "myvar",
    });
  });
});

describe("serializeTokens - loop re-emission (%DO)", () => {
  test("re-emitting the same source token objects yields verbatim segments with rewound origStart that compose correctly", () => {
    const phaseText = "ABC DEF";
    const abc = sourceToken("ABC", 0);
    const def = sourceToken("DEF", 4);
    // A %DO loop emits its body's tokens once per iteration - the SAME token objects,
    // with the same source offsets, appear twice in the stream.
    const { text, sourceMap } = serializeTokens(
      [abc, def, abc, def],
      uri,
      phaseText,
    );
    expect(text).toBe("ABC DEF ABC DEF");

    // Two verbatim segments over the same source span - the second one's origStart
    // REWINDS below the first one's origEnd, starting a fresh re-emission.
    const verbatimSegments = sourceMap
      .getSegments()
      .filter((segment) => segment.verbatim);
    expect(verbatimSegments).toHaveLength(2);
    expect(verbatimSegments[0]).toMatchObject({
      origStart: 0,
      origEnd: 7,
      genStart: 0,
      genEnd: 7,
    });
    expect(verbatimSegments[1]).toMatchObject({
      origStart: 0,
      origEnd: 7,
      genStart: 8,
      genEnd: 15,
    });
    expect(sourceMap.mapToOriginal(8)).toEqual({ uri, offset: 0 });

    // Round-trips through compose over a NON-identity first map (the real pipeline
    // shape, e.g. PP(MACRO MACRO): an earlier phase produced "ABC DEF" from
    // "ABC %E DEF" by consuming "%E ") - the rewound segment must not be resolved
    // with a forward-only cursor or dropped.
    const first = SourceMap.fromSegments([
      { origStart: 0, origEnd: 4, genStart: 0, genEnd: 4, uri, verbatim: true },
      {
        origStart: 7,
        origEnd: 10,
        genStart: 4,
        genEnd: 7,
        uri,
        verbatim: true,
      },
    ]);
    const composed = SourceMap.compose(first, sourceMap);
    // Iteration 1.
    expect(composed.mapToOriginal(0)).toEqual({ uri, offset: 0 });
    expect(composed.mapToOriginal(4)).toEqual({ uri, offset: 7 });
    // Iteration 2 - the rewound emission resolves to the same original offsets.
    expect(composed.mapToOriginal(8)).toEqual({ uri, offset: 0 });
    expect(composed.mapToOriginal(12)).toEqual({ uri, offset: 7 });
    expect(composed.mapToOriginal(14)).toEqual({ uri, offset: 9 });
    // No gen-space range was silently dropped.
    for (let i = 0; i < text.length; i++) {
      expect(composed.mapToOriginal(i)).toBeDefined();
    }
  });
});
