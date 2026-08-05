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
import { annotateTokens } from "../../src/preprocessor/token-annotator";
import { SourceMap, Segment } from "../../src/preprocessor/source-map";
import { createTokenInstance, ID } from "../../src/parser/tokens";
import { UriUtils } from "../../src/utils/uri";
import * as ast from "../../src/syntax-tree/ast";
import { CstNodeKind } from "../../src/syntax-tree/cst";
import { Severity } from "../../src/language-server/types";

const uri = UriUtils.toUri("memory:///annotator-test.pli");

function finalToken(image: string, startOffset: number) {
  return createTokenInstance(
    image,
    image,
    ID,
    startOffset,
    startOffset + image.length - 1,
    uri,
  );
}

describe("annotateTokens - offset remapping", () => {
  test("rewrites verbatim tokens to their original positions and uri", () => {
    const sourceMap = SourceMap.identity("PUT LIST(A)", uri);
    const tokens = [finalToken("PUT", 0), finalToken("LIST", 4)];
    const { tokens: annotated } = annotateTokens(tokens, [], sourceMap, uri);
    expect(annotated.map((t) => [t.image, t.startOffset])).toEqual([
      ["PUT", 0],
      ["LIST", 4],
    ]);
  });

  test("anchors a token inside a non-verbatim block to the block's original start", () => {
    const segments: Segment[] = [
      {
        origStart: 0,
        origEnd: 3,
        genStart: 0,
        genEnd: 3,
        uri,
        verbatim: false,
      },
    ];
    const sourceMap = SourceMap.fromSegments(segments);
    const { tokens } = annotateTokens(
      [finalToken("DO", 0)],
      [],
      sourceMap,
      uri,
    );
    expect(tokens[0].startOffset).toBe(0);
    expect(tokens[0].endOffset).toBe(0);
  });
});

describe("annotateTokens - cross-reference restoration", () => {
  test("re-attaches refTarget/refKind onto the exact-matching final token", () => {
    const targetNode =
      ast.createDeclareStatement() as unknown as ast.SyntaxNode;
    const segments: Segment[] = [
      {
        origStart: 3,
        origEnd: 3,
        genStart: 0,
        genEnd: 5,
        uri,
        verbatim: false,
        tokens: [
          {
            name: "MYVAR",
            startOffset: 0,
            endOffset: 4,
            originalImage: "MYVAR",
            refTarget: targetNode,
            refKind: CstNodeKind.ReferenceItem_Ref,
          },
        ],
      },
    ];
    const sourceMap = SourceMap.fromSegments(segments);
    const { tokens } = annotateTokens(
      [finalToken("MYVAR", 0)],
      [],
      sourceMap,
      uri,
    );
    expect(tokens[0].element).toBe(targetNode);
    expect(tokens[0].kind).toBe(CstNodeKind.ReferenceItem_Ref);
  });
});

describe("annotateTokens - originalImage restoration (RESCAN(ASIS) casing)", () => {
  test("restores the exact casing the interpreter decided, overriding the final re-lex's case-folding", () => {
    // The final re-lex force-uppercased "zwei" to "ZWEI" (its own caseUpper default) - but
    // this span came from a RESCAN(ASIS) substitution that must keep the original casing.
    const segments: Segment[] = [
      {
        origStart: 3,
        origEnd: 3,
        genStart: 0,
        genEnd: 4,
        uri,
        verbatim: false,
        tokens: [
          {
            startOffset: 0,
            endOffset: 3,
            originalImage: "zwei",
          },
        ],
      },
    ];
    const sourceMap = SourceMap.fromSegments(segments);
    const { tokens } = annotateTokens(
      [finalToken("ZWEI", 0)],
      [],
      sourceMap,
      uri,
    );
    expect(tokens[0].image).toBe("zwei");
    expect(tokens[0].originalImage).toBe("zwei");
  });

  test("does not restore casing when the final token's span doesn't exactly match (merged by immediateFollow)", () => {
    const segments: Segment[] = [
      {
        origStart: 3,
        origEnd: 3,
        genStart: 0,
        genEnd: 4,
        uri,
        verbatim: false,
        tokens: [
          {
            startOffset: 0,
            endOffset: 3,
            originalImage: "zwei",
          },
        ],
      },
    ];
    const sourceMap = SourceMap.fromSegments(segments);
    // The final re-lex merged this span with trailing text into one bigger token
    // (e.g. "ZWEIREST") - its span no longer exactly matches the recorded MappedToken.
    const { tokens } = annotateTokens(
      [finalToken("ZWEIREST", 0)],
      [],
      sourceMap,
      uri,
    );
    expect(tokens[0].image).toBe("ZWEIREST");
  });
});

describe("annotateTokens - diagnostic remapping", () => {
  test("remaps a diagnostic's range and uri back to the original source", () => {
    const segments: Segment[] = [
      {
        origStart: 10,
        origEnd: 20,
        genStart: 0,
        genEnd: 10,
        uri,
        verbatim: true,
      },
    ];
    const sourceMap = SourceMap.fromSegments(segments);
    const { diagnostics } = annotateTokens(
      [],
      [
        {
          severity: Severity.E,
          message: "test",
          range: { start: 2, end: 5 },
        },
      ],
      sourceMap,
      uri,
    );
    expect(diagnostics[0].range).toEqual({ start: 12, end: 15 });
    expect(diagnostics[0].uri).toBe(uri.toString());
  });

  test("an exclusive range end exactly on a boundary next to a foreign (%INCLUDE) segment stays in the start's file", () => {
    const includedUri = UriUtils.toUri("memory:///included.pli");
    const segments: Segment[] = [
      {
        origStart: 0,
        origEnd: 10,
        genStart: 0,
        genEnd: 10,
        uri,
        verbatim: true,
      },
      {
        origStart: 100,
        origEnd: 110,
        genStart: 10,
        genEnd: 20,
        uri: includedUri,
        verbatim: true,
        foreign: true,
      },
    ];
    const sourceMap = SourceMap.fromSegments(segments);
    // The diagnostic covers gen offsets [2, 10) - entirely inside the first (same-file)
    // segment. Its EXCLUSIVE end (10) sits exactly on the boundary; mapping it directly
    // would resolve through the foreign segment (offset 100 in included.pli), producing a
    // cross-file, wildly inverted range.
    const { diagnostics } = annotateTokens(
      [],
      [
        {
          severity: Severity.E,
          message: "boundary",
          range: { start: 2, end: 10 },
        },
      ],
      sourceMap,
      uri,
    );
    expect(diagnostics[0].uri).toBe(uri.toString());
    expect(diagnostics[0].range).toEqual({ start: 2, end: 10 });
  });

  test("a zero-length range on a boundary maps via its start", () => {
    const includedUri = UriUtils.toUri("memory:///included.pli");
    const segments: Segment[] = [
      {
        origStart: 0,
        origEnd: 10,
        genStart: 0,
        genEnd: 10,
        uri,
        verbatim: true,
      },
      {
        origStart: 100,
        origEnd: 110,
        genStart: 10,
        genEnd: 20,
        uri: includedUri,
        verbatim: true,
        foreign: true,
      },
    ];
    const sourceMap = SourceMap.fromSegments(segments);
    const { diagnostics } = annotateTokens(
      [],
      [
        {
          severity: Severity.E,
          message: "empty",
          range: { start: 4, end: 4 },
        },
      ],
      sourceMap,
      uri,
    );
    expect(diagnostics[0].range).toEqual({ start: 4, end: 4 });
    expect(diagnostics[0].uri).toBe(uri.toString());
  });
});

describe("annotateTokens - token straddling a segment boundary", () => {
  test("maps the end through its own segment (second-lookup fallback), not the start's", () => {
    // Two verbatim segments that are adjacent in generated space but far apart in the
    // original: a token re-lexed across the seam gets its start from segment 1 and its
    // end from segment 2.
    const segments: Segment[] = [
      { origStart: 0, origEnd: 4, genStart: 0, genEnd: 4, uri, verbatim: true },
      {
        origStart: 20,
        origEnd: 24,
        genStart: 4,
        genEnd: 8,
        uri,
        verbatim: true,
      },
    ];
    const sourceMap = SourceMap.fromSegments(segments);
    const { tokens } = annotateTokens(
      [finalToken("ABCDEF", 0)], // spans gen offsets 0..5, straddling the boundary at 4
      [],
      sourceMap,
      uri,
    );
    expect(tokens[0].startOffset).toBe(0);
    expect(tokens[0].endOffset).toBe(21); // 20 + (5 - 4)
    expect(tokens[0].uri).toBe(uri);
  });
});
