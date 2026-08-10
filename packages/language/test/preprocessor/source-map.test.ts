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
import { Segment, SourceMap } from "../../src/preprocessor/source-map";
import { UriUtils } from "../../src/utils/uri";

const uriA = UriUtils.toUri("memory:///a.pli");

describe("SourceMap.identity", () => {
  test("maps every offset to itself", () => {
    const text = "0123456789";
    const map = SourceMap.identity(text, uriA);
    for (let i = 0; i < text.length; i++) {
      expect(map.mapToOriginal(i)).toEqual({ uri: uriA, offset: i });
    }
  });

  test("handles the empty text degenerate case", () => {
    const map = SourceMap.identity("", uriA);
    expect(map.mapToOriginal(0)).toEqual({ uri: uriA, offset: 0 });
  });

  test("rejects offsets outside [0, length]", () => {
    const map = SourceMap.identity("abc", uriA);
    expect(map.mapToOriginal(-1)).toBeUndefined();
    expect(map.mapToOriginal(4)).toBeUndefined(); // length is 3, valid offsets are 0..3
    expect(map.mapToOriginal(3)).toEqual({ uri: uriA, offset: 3 }); // exact end boundary is valid
  });

  test("segmentAt on an empty map returns undefined", () => {
    const map = SourceMap.fromSegments([]);
    expect(map.segmentAt(0)).toBeUndefined();
    expect(map.mapToOriginal(0)).toBeUndefined();
  });
});

describe("SourceMap.fromSegments - mixed verbatim/replaced segments", () => {
  // Simulates "FOO %A BAZ" where "%A" (offsets 4-5 in the original) was replaced by the
  // 6-character expansion "HELLO!" (offsets 4-9 in the generated text), carrying one
  // MappedToken for the identifier it expanded.
  const mappedToken = {
    name: "A",
    startOffset: 4,
    endOffset: 9,
    originalImage: "HELLO!",
  };
  const segments: Segment[] = [
    {
      origStart: 0,
      origEnd: 4,
      genStart: 0,
      genEnd: 4,
      uri: uriA,
      verbatim: true,
    },
    {
      origStart: 4,
      origEnd: 6,
      genStart: 4,
      genEnd: 10,
      uri: uriA,
      verbatim: false,
      tokens: [mappedToken],
    },
    {
      origStart: 6,
      origEnd: 10,
      genStart: 10,
      genEnd: 14,
      uri: uriA,
      verbatim: true,
    },
  ];
  const map = SourceMap.fromSegments(segments);

  test("verbatim prefix maps 1:1", () => {
    for (let i = 0; i < 4; i++) {
      expect(map.mapToOriginal(i)).toEqual({ uri: uriA, offset: i });
    }
  });

  test("any offset inside the replaced block maps to the block's original start", () => {
    for (let i = 4; i < 10; i++) {
      expect(map.mapToOriginal(i)).toEqual({ uri: uriA, offset: 4 });
    }
  });

  test("segmentAt exposes the MappedToken metadata for the replaced block", () => {
    const segment = map.segmentAt(7);
    expect(segment?.verbatim).toBe(false);
    expect(segment?.tokens).toEqual([mappedToken]);
  });

  test("verbatim suffix maps 1:1, offset by the block's length change", () => {
    expect(map.mapToOriginal(10)).toEqual({ uri: uriA, offset: 6 });
    expect(map.mapToOriginal(13)).toEqual({ uri: uriA, offset: 9 });
  });

  test("out-of-range offsets return undefined", () => {
    expect(map.mapToOriginal(-1)).toBeUndefined();
    expect(map.mapToOriginal(15)).toBeUndefined();
  });

  test("the exact end-of-generated-text offset resolves through the last segment", () => {
    // Only the identity map's end bound was covered before; on a multi-segment map the
    // exclusive end offset (14 here) must resolve through the LAST segment, not fall off.
    expect(map.segmentAt(14)).toBe(segments[2]);
    expect(map.mapToOriginal(14)).toEqual({ uri: uriA, offset: 10 });
  });
});

describe("SourceMap.compose", () => {
  test("composing two identities yields an identity", () => {
    const text = "PUT LIST(A);";
    const composed = SourceMap.compose(
      SourceMap.identity(text, uriA),
      SourceMap.identity(text, uriA),
    );
    for (let i = 0; i < text.length; i++) {
      expect(composed.mapToOriginal(i)).toEqual({ uri: uriA, offset: i });
    }
  });

  test("second phase identity: an edit from the first phase survives composition unchanged", () => {
    // first: text -> A, replaces offsets 4-5 ("%A") with "HELLO!" at genOffsets 4-9.
    const first = SourceMap.fromSegments([
      {
        origStart: 0,
        origEnd: 4,
        genStart: 0,
        genEnd: 4,
        uri: uriA,
        verbatim: true,
      },
      {
        origStart: 4,
        origEnd: 6,
        genStart: 4,
        genEnd: 10,
        uri: uriA,
        verbatim: false,
        tokens: [
          {
            name: "A",
            startOffset: 4,
            endOffset: 9,
            originalImage: "HELLO!",
          },
        ],
      },
      {
        origStart: 6,
        origEnd: 10,
        genStart: 10,
        genEnd: 14,
        uri: uriA,
        verbatim: true,
      },
    ]);
    // second: A -> A, untouched (identity over the 14-character generated text).
    const second = SourceMap.identity("FOO HELLO! BAZ".slice(0, 14), uriA);
    const composed = SourceMap.compose(first, second);

    expect(composed.mapToOriginal(0)).toEqual({ uri: uriA, offset: 0 });
    expect(composed.mapToOriginal(7)).toEqual({ uri: uriA, offset: 4 }); // inside the block
    expect(composed.segmentAt(7)?.tokens?.[0].name).toBe("A");
    expect(composed.mapToOriginal(13)).toEqual({ uri: uriA, offset: 9 });
  });

  test("first phase identity: an edit introduced by the second phase resolves through an untouched first phase", () => {
    const text = "EXEC SQL X;";
    const first = SourceMap.identity(text, uriA);
    // second: A -> B, replaces offsets 5-9 ("SQL X") with "DO; END;"
    const second = SourceMap.fromSegments([
      { origStart: 0, origEnd: 5, genStart: 0, genEnd: 5, verbatim: true },
      {
        origStart: 5,
        origEnd: 10,
        genStart: 5,
        genEnd: 13,
        verbatim: false,
        tokens: [
          {
            name: "X",
            startOffset: 8,
            endOffset: 8,
            originalImage: "X",
          },
        ],
      },
      { origStart: 10, origEnd: 11, genStart: 13, genEnd: 14, verbatim: true },
    ]);
    const composed = SourceMap.compose(first, second);

    expect(composed.mapToOriginal(0)).toEqual({ uri: uriA, offset: 0 });
    // Anywhere inside the "DO; END;" block resolves back to where "SQL X" started.
    expect(composed.mapToOriginal(9)).toEqual({ uri: uriA, offset: 5 });
    expect(composed.segmentAt(9)?.tokens?.[0].name).toBe("X");
    expect(composed.mapToOriginal(13)).toEqual({ uri: uriA, offset: 10 });
  });

  test("both phases edit different spans: untouched stretches stay pixel-accurate across both", () => {
    // first: text -> A. Replaces "%A" (offsets 2-3) with "XX" (same length, still an edit).
    const first = SourceMap.fromSegments([
      {
        origStart: 0,
        origEnd: 2,
        genStart: 0,
        genEnd: 2,
        uri: uriA,
        verbatim: true,
      },
      {
        origStart: 2,
        origEnd: 4,
        genStart: 2,
        genEnd: 4,
        uri: uriA,
        verbatim: false,
      },
      {
        origStart: 4,
        origEnd: 10,
        genStart: 4,
        genEnd: 10,
        uri: uriA,
        verbatim: true,
      },
    ]);
    // second: A -> B. Replaces "EXEC" (genOffsets 6-9 in A) with "DO;" (3 chars) in B.
    const second = SourceMap.fromSegments([
      { origStart: 0, origEnd: 6, genStart: 0, genEnd: 6, verbatim: true },
      { origStart: 6, origEnd: 10, genStart: 6, genEnd: 9, verbatim: false },
    ]);
    const composed = SourceMap.compose(first, second);

    // B-offsets 0-1 are untouched by either phase -> map straight through.
    expect(composed.mapToOriginal(0)).toEqual({ uri: uriA, offset: 0 });
    expect(composed.mapToOriginal(1)).toEqual({ uri: uriA, offset: 1 });
    // B-offsets 2-3 fall inside the first phase's block -> anchors to offset 2.
    expect(composed.mapToOriginal(2)).toEqual({ uri: uriA, offset: 2 });
    expect(composed.mapToOriginal(3)).toEqual({ uri: uriA, offset: 2 });
    // B-offsets 4-5 are untouched (between the two edits) -> map straight through.
    expect(composed.mapToOriginal(4)).toEqual({ uri: uriA, offset: 4 });
    expect(composed.mapToOriginal(5)).toEqual({ uri: uriA, offset: 5 });
    // B-offsets 6-8 fall inside the second phase's block -> anchors to offset 6.
    expect(composed.mapToOriginal(6)).toEqual({ uri: uriA, offset: 6 });
    expect(composed.mapToOriginal(8)).toEqual({ uri: uriA, offset: 6 });
  });

  test("zero-length insertions compose without producing a degenerate loop", () => {
    const first = SourceMap.identity("AB", uriA);
    // second inserts "X" at offset 1 (a zero-width original span).
    const second = SourceMap.fromSegments([
      { origStart: 0, origEnd: 1, genStart: 0, genEnd: 1, verbatim: true },
      { origStart: 1, origEnd: 1, genStart: 1, genEnd: 2, verbatim: false },
      { origStart: 1, origEnd: 2, genStart: 2, genEnd: 3, verbatim: true },
    ]);
    const composed = SourceMap.compose(first, second);
    expect(composed.mapToOriginal(0)).toEqual({ uri: uriA, offset: 0 });
    expect(composed.mapToOriginal(1)).toEqual({ uri: uriA, offset: 1 }); // the inserted "X"
    expect(composed.mapToOriginal(2)).toEqual({ uri: uriA, offset: 1 });
  });

  test("associativity: compose(compose(m1, m2), m3) agrees with compose(m1, compose(m2, m3))", () => {
    const m1 = SourceMap.fromSegments([
      {
        origStart: 0,
        origEnd: 3,
        genStart: 0,
        genEnd: 3,
        uri: uriA,
        verbatim: true,
      },
      {
        origStart: 3,
        origEnd: 5,
        genStart: 3,
        genEnd: 7,
        uri: uriA,
        verbatim: false,
      },
      {
        origStart: 5,
        origEnd: 8,
        genStart: 7,
        genEnd: 10,
        uri: uriA,
        verbatim: true,
      },
    ]);
    const m2 = SourceMap.fromSegments([
      { origStart: 0, origEnd: 4, genStart: 0, genEnd: 4, verbatim: true },
      { origStart: 4, origEnd: 6, genStart: 4, genEnd: 5, verbatim: false },
      { origStart: 6, origEnd: 10, genStart: 5, genEnd: 9, verbatim: true },
    ]);
    const m3 = SourceMap.fromSegments([
      { origStart: 0, origEnd: 2, genStart: 0, genEnd: 2, verbatim: true },
      { origStart: 2, origEnd: 3, genStart: 2, genEnd: 6, verbatim: false },
      { origStart: 3, origEnd: 9, genStart: 6, genEnd: 12, verbatim: true },
    ]);

    const leftAssoc = SourceMap.compose(SourceMap.compose(m1, m2), m3);
    const rightAssoc = SourceMap.compose(m1, SourceMap.compose(m2, m3));

    for (let i = 0; i < 12; i++) {
      expect(leftAssoc.mapToOriginal(i)).toEqual(rightAssoc.mapToOriginal(i));
    }
  });

  test("a foreign verbatim segment survives composition atomically, not resolved through first", () => {
    // A foreign segment's origStart/origEnd are real offsets in *another* file (e.g.
    // content pulled in via `%INCLUDE`/`EXEC SQL INCLUDE`), not positions in `first`'s
    // generated space. Composing it like an ordinary verbatim span - subdividing and
    // re-anchoring through `first` - would corrupt its uri and offsets, and silently
    // drop the rest of the segment if `first` ran out of segments early.
    const uriForeign = UriUtils.toUri("memory:///foreign.pli");
    // first (text -> A): identity over a short host file, far shorter than the foreign
    // segment's own offsets - if compose mistakenly treated the foreign segment's
    // origStart/origEnd as positions in `first`'s space, it would run off the end of
    // `first`'s segments.
    const first = SourceMap.identity("XXXX", uriA); // length 4
    // second (A -> B): one foreign segment, offsets 100-200 in `foreign.pli`'s own space -
    // values that don't even fit within `first`'s 4-character space.
    const second = SourceMap.fromSegments([
      {
        origStart: 100,
        origEnd: 200,
        genStart: 0,
        genEnd: 100,
        uri: uriForeign,
        verbatim: true,
        foreign: true,
      },
    ]);
    const composed = SourceMap.compose(first, second);

    expect(composed.mapToOriginal(0)).toEqual({ uri: uriForeign, offset: 100 });
    expect(composed.mapToOriginal(50)).toEqual({
      uri: uriForeign,
      offset: 150,
    });
    expect(composed.mapToOriginal(99)).toEqual({
      uri: uriForeign,
      offset: 199,
    });
    // The whole foreign span survived - none of it was dropped.
    expect(composed.segmentAt(99)?.genEnd).toBe(100);
  });

  test("a foreign segment's foreign flag survives a further compose (three-phase pipeline)", () => {
    const uriForeign = UriUtils.toUri("memory:///foreign.pli");
    const macroMap = SourceMap.identity("XXXX", uriA);
    const sqlMap = SourceMap.fromSegments([
      {
        origStart: 0,
        origEnd: 4,
        genStart: 0,
        genEnd: 4,
        uri: uriA,
        verbatim: true,
      },
      {
        origStart: 10,
        origEnd: 20,
        genStart: 4,
        genEnd: 14,
        uri: uriForeign,
        verbatim: true,
        foreign: true,
      },
    ]);
    const afterSql = SourceMap.compose(macroMap, sqlMap);
    // A third phase (e.g. CICS) that treats everything - including the foreign span it has
    // no idea originated elsewhere - as one big same-file verbatim run over its own input.
    const cicsMap = SourceMap.identity("Y".repeat(14));
    const afterCics = SourceMap.compose(afterSql, cicsMap);

    expect(afterCics.mapToOriginal(0)).toEqual({ uri: uriA, offset: 0 });
    expect(afterCics.mapToOriginal(4)).toEqual({ uri: uriForeign, offset: 10 });
    expect(afterCics.mapToOriginal(13)).toEqual({
      uri: uriForeign,
      offset: 19,
    });
  });

  test("second-map verbatim segments with a REWOUND origStart (%DO re-emission) compose correctly over a non-identity first", () => {
    // `serializeTokens` legitimately produces verbatim segments whose origStart rewinds:
    // a `%DO` loop (or backward `%GOTO`) re-emits the same source tokens once per
    // iteration, each iteration starting a fresh verbatim segment at an EARLIER origStart.
    // A forward-only cursor over `first` either resolved those with a negative delta or
    // dropped them entirely once `first`'s segments were consumed.
    //
    // first (text -> A): non-identity, three segments; A is 14 chars.
    const first = SourceMap.fromSegments([
      {
        origStart: 0,
        origEnd: 4,
        genStart: 0,
        genEnd: 4,
        uri: uriA,
        verbatim: true,
      },
      {
        origStart: 4,
        origEnd: 6,
        genStart: 4,
        genEnd: 8,
        uri: uriA,
        verbatim: false,
      },
      {
        origStart: 6,
        origEnd: 12,
        genStart: 8,
        genEnd: 14,
        uri: uriA,
        verbatim: true,
      },
    ]);
    // second (A -> B): iteration 1 passes all of A through; iteration 2 re-emits the
    // tail (rewinding to A-offset 8); a further re-emission rewinds all the way back to
    // A-offset 2 - before `first`'s edit, spanning multiple `first` segments.
    const second = SourceMap.fromSegments([
      { origStart: 0, origEnd: 14, genStart: 0, genEnd: 14, verbatim: true },
      { origStart: 8, origEnd: 14, genStart: 14, genEnd: 20, verbatim: true },
      { origStart: 2, origEnd: 8, genStart: 20, genEnd: 26, verbatim: true },
    ]);
    const composed = SourceMap.compose(first, second);

    // Iteration 1: straight through.
    expect(composed.mapToOriginal(0)).toEqual({ uri: uriA, offset: 0 });
    expect(composed.mapToOriginal(9)).toEqual({ uri: uriA, offset: 7 });
    // Iteration 2: the rewound tail resolves to the SAME original offsets as iteration 1.
    expect(composed.mapToOriginal(14)).toEqual({ uri: uriA, offset: 6 });
    expect(composed.mapToOriginal(19)).toEqual({ uri: uriA, offset: 11 });
    // Rewind across first's boundaries: the verbatim prefix maps 1:1, then the
    // non-verbatim block anchors to its original start - exactly as in iteration 1.
    expect(composed.mapToOriginal(20)).toEqual({ uri: uriA, offset: 2 });
    expect(composed.mapToOriginal(21)).toEqual({ uri: uriA, offset: 3 });
    expect(composed.mapToOriginal(22)).toEqual({ uri: uriA, offset: 4 });
    expect(composed.mapToOriginal(25)).toEqual({ uri: uriA, offset: 4 });
    // No gen-space range was silently dropped.
    for (let i = 0; i < 26; i++) {
      expect(composed.mapToOriginal(i)).toBeDefined();
    }
  });

  test("a second-map segment referencing offsets before first's initial segment is dropped, not crashed on", () => {
    // first's generated space starts at 5 - offsets 0..4 don't exist in it.
    const first = SourceMap.fromSegments([
      {
        origStart: 0,
        origEnd: 4,
        genStart: 5,
        genEnd: 9,
        uri: uriA,
        verbatim: true,
      },
    ]);
    const second = SourceMap.fromSegments([
      // Entirely before first's space - unresolvable, same treatment as running past
      // first's end.
      { origStart: 0, origEnd: 3, genStart: 0, genEnd: 3, verbatim: true },
      // Inside first's space - must still resolve correctly afterwards.
      { origStart: 5, origEnd: 9, genStart: 3, genEnd: 7, verbatim: true },
    ]);
    const composed = SourceMap.compose(first, second);

    expect(composed.mapToOriginal(0)).toBeUndefined();
    expect(composed.mapToOriginal(3)).toEqual({ uri: uriA, offset: 0 });
    expect(composed.mapToOriginal(6)).toEqual({ uri: uriA, offset: 3 });
  });

  test("uri always denotes the original-side file, resolved through first even for verbatim second-phase spans", () => {
    // first (text -> A): a non-verbatim block anchored at text-offset 3 in file A (e.g. a
    // macro expansion), producing 8 characters of intermediate text A.
    const first = SourceMap.fromSegments([
      {
        origStart: 0,
        origEnd: 3,
        genStart: 0,
        genEnd: 3,
        uri: uriA,
        verbatim: true,
      },
      {
        origStart: 3,
        origEnd: 3,
        genStart: 3,
        genEnd: 11,
        uri: uriA,
        verbatim: false,
      },
    ]);
    // second (A -> B): a later phase that passes everything through unchanged.
    const second = SourceMap.identity("X".repeat(11));
    const composed = SourceMap.compose(first, second);

    expect(composed.mapToOriginal(0)).toEqual({ uri: uriA, offset: 0 });
    // The block's uri (uriA) survives being passed through a verbatim later phase, even
    // though `second` itself never mentions uriA anywhere.
    expect(composed.mapToOriginal(5)).toEqual({ uri: uriA, offset: 3 });
  });
});

describe("SourceMap at scale", () => {
  test("binary search remains correct across many segments", () => {
    const segmentCount = 10_000;
    const segments: Segment[] = [];
    let offset = 0;
    for (let i = 0; i < segmentCount; i++) {
      const verbatim = i % 2 === 0;
      const len = verbatim ? 5 : 3;
      segments.push({
        origStart: offset,
        origEnd: offset + len,
        genStart: offset,
        genEnd: offset + len,
        uri: uriA,
        verbatim,
      });
      offset += len;
    }
    const map = SourceMap.fromSegments(segments);

    // Check every 7th offset against the expected value computed straight from the
    // segment list - a binary search landing on any wrong segment fails here.
    const expectedAt = (genOffset: number) => {
      const segment = segments.find(
        (s) => s.genStart <= genOffset && genOffset < s.genEnd,
      )!;
      return segment.verbatim
        ? segment.origStart + (genOffset - segment.genStart)
        : segment.origStart;
    };
    for (let i = 0; i < offset; i += 7) {
      expect(map.mapToOriginal(i)).toEqual({
        uri: uriA,
        offset: expectedAt(i),
      });
    }
    expect(map.mapToOriginal(offset)).toBeDefined(); // exact end boundary
    expect(map.mapToOriginal(offset + 1)).toBeUndefined(); // one past the end
  });
});
