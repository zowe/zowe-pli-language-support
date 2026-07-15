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

import { afterEach, describe, expect, test } from "vitest";
import * as api from "preprocessor-api";
import {
  NestedContextInfo,
  PreprocessorContext,
} from "../../src/preprocessor/preprocessor-context";
import {
  CompilationUnit,
  createCompilationUnit,
} from "../../src/workspace/compilation-unit";
import {
  createTestWorkspace,
  defaultTestWorkspace,
  setDefaultTestWorkspace,
} from "../test-workspace";
import { UriUtils } from "../../src/utils/uri";
import { Severity } from "../../src/language-server/types";
import { VirtualFileSystemProvider } from "../../src/workspace/file-system-provider";
import { makeProcessGroup, makeProgramConfig } from "../config-fixtures";

const uri = UriUtils.toUri("memory:///context-test.pli");

/** Builds a context backed by a real (but library-less) CompilationUnit. */
async function createContext(text: string): Promise<PreprocessorContext> {
  const unit = await createCompilationUnit(uri, defaultTestWorkspace());
  return new PreprocessorContext(uri, text, unit, uri);
}

const workspaceUri = UriUtils.toUri("/workspace");
const mainUri = UriUtils.toUri("/workspace/main.pli");

/**
 * Builds a CompilationUnit whose workspace has a virtual `cpy` lib populated with the
 * given files (absolute paths), so `resolveInclude` can actually resolve names.
 */
async function setupIncludeWorkspace(
  files: Record<string, string>,
): Promise<CompilationUnit> {
  const vfs = new VirtualFileSystemProvider();
  const workspace = createTestWorkspace(vfs);
  setDefaultTestWorkspace(workspace);
  for (const [path, content] of Object.entries(files)) {
    await vfs.writeFile(UriUtils.toUri(path), content);
  }
  await workspace.config.init(workspaceUri);
  await workspace.config.setProcessGroupConfigs([
    makeProcessGroup({
      name: "default",
      libs: ["cpy"],
      includeExtensions: [".pli"],
    }),
  ]);
  workspace.config.setProgramConfigs(workspaceUri, [
    makeProgramConfig({ program: "*.pli", pgroup: "default" }),
  ]);
  return createCompilationUnit(mainUri, workspace);
}

afterEach(() => {
  setDefaultTestWorkspace(undefined);
});

describe("PreprocessorContext.build - no edits", () => {
  test("returns the input text verbatim with an identity-like source map", async () => {
    const context = await createContext("EXEC SQL X;");
    const { text, sourceMap } = context.build();
    expect(text).toBe("EXEC SQL X;");
    expect(sourceMap.mapToOriginal(0)).toEqual({ uri, offset: 0 });
    expect(sourceMap.mapToOriginal(10)).toEqual({ uri, offset: 10 });
  });

  test("handles empty input without producing an unusable map", async () => {
    const context = await createContext("");
    const { text, sourceMap } = context.build();
    expect(text).toBe("");
    expect(sourceMap.mapToOriginal(0)).toEqual({ uri, offset: 0 });
  });
});

describe("PreprocessorContext.build - replace", () => {
  test("a single replace splices the new text in and keeps the surrounding text verbatim", async () => {
    const context = await createContext("EXEC SQL X;");
    // Replace "SQL X" (offsets 5-9) with "DO; END;"
    context.replace({ start: 5, end: 10 }, "DO; END;");
    const { text, sourceMap } = context.build();

    expect(text).toBe("EXEC DO; END;;");
    expect(sourceMap.mapToOriginal(0)).toEqual({ uri, offset: 0 }); // "E" of EXEC, untouched
    expect(sourceMap.mapToOriginal(4)).toEqual({ uri, offset: 4 }); // space before the block
    expect(sourceMap.mapToOriginal(9)).toEqual({ uri, offset: 5 }); // inside "DO; END;"
    expect(sourceMap.mapToOriginal(13)).toEqual({ uri, offset: 10 }); // trailing ";"
  });

  test("local token offsets are translated to their final position in the generated text", async () => {
    const context = await createContext("EXEC SQL X;");
    context.replace({ start: 5, end: 10 }, "DO; END;", [
      {
        name: "X",
        // "X" sits at local offset 8 within the *original* text ("SQL X"), not the
        // replacement - use a token local to the replacement text ("DO; END;") instead,
        // e.g. pretend the call site wants to flag offsets 4-7 ("END;") within it.
        startOffset: 4,
        endOffset: 7,
        originalImage: "END;",
      },
    ]);
    const { sourceMap } = context.build();
    const segment = sourceMap.segmentAt(9); // "EXEC " (5 chars) + local offset 4 = 9
    expect(segment?.tokens?.[0]).toMatchObject({
      name: "X",
      startOffset: 9,
      endOffset: 12,
    });
  });

  test("multiple non-adjacent replaces compose correctly regardless of call order", async () => {
    const context = await createContext("AA%1BBB%2CC");
    // Call out of document order on purpose - build() must sort by offset.
    context.replace({ start: 7, end: 9 }, "TWO");
    context.replace({ start: 2, end: 4 }, "ONE");
    const { text, sourceMap } = context.build();

    expect(text).toBe("AAONEBBBTWOCC");
    expect(sourceMap.mapToOriginal(0)).toEqual({ uri, offset: 0 });
    expect(sourceMap.mapToOriginal(5)).toEqual({ uri, offset: 4 }); // "B" right after ONE
    expect(sourceMap.mapToOriginal(11)).toEqual({ uri, offset: 9 }); // "C" right after TWO
  });

  test("an overlapping edit is dropped with a diagnostic instead of throwing", async () => {
    const context = await createContext("ABCDEFGH");
    context.replace({ start: 2, end: 5 }, "X");
    context.insert(3, "Y"); // falls inside the previous replace's range
    // Edits come from external preprocessor plugins - a throw here would kill
    // tokenization of the whole document, so build() must degrade instead.
    const { text, diagnostics } = context.build();
    expect(text).toBe("ABXFGH");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe(Severity.E);
    expect(diagnostics[0].message).toMatch(/overlapping/i);
    expect(diagnostics[0].uri).toBe(uri.toString());
    expect(diagnostics[0].range).toEqual({ start: 3, end: 3 });
  });

  test("an overlapping replace is dropped while the accepted edits still apply", async () => {
    const context = await createContext("ABCDEFGH");
    context.replace({ start: 2, end: 5 }, "X");
    context.replace({ start: 4, end: 6 }, "Y"); // overlaps the tail of the first replace
    const { text, diagnostics } = context.build();
    expect(text).toBe("ABXFGH");
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].range).toEqual({ start: 4, end: 6 });
  });
});

describe("PreprocessorContext.build - insert", () => {
  test("a zero-width insert splices text in without consuming any original characters", async () => {
    const context = await createContext("AB");
    context.insert(1, "X");
    const { text, sourceMap } = context.build();

    expect(text).toBe("AXB");
    expect(sourceMap.mapToOriginal(0)).toEqual({ uri, offset: 0 }); // A
    expect(sourceMap.mapToOriginal(1)).toEqual({ uri, offset: 1 }); // the inserted X
    expect(sourceMap.mapToOriginal(2)).toEqual({ uri, offset: 1 }); // B
  });

  test("two inserts at the same offset stack in call order", async () => {
    const context = await createContext("AB");
    context.insert(1, "X");
    context.insert(1, "Y");
    const { text } = context.build();
    expect(text).toBe("AXYB");
  });

  test("an insert immediately after a replace is not treated as an overlap", async () => {
    const context = await createContext("ABCD");
    context.replace({ start: 1, end: 3 }, "X"); // replaces "BC"
    context.insert(3, "Y"); // right after the replaced range, at "D"
    const { text } = context.build();
    expect(text).toBe("AXYD");
  });

  test("an insert at a replaced range's start sorts before the replace, regardless of recording order", async () => {
    const context = await createContext("ABCD");
    // Recorded replace-first - the zero-width insert must still land before the
    // consumed range instead of tripping the overlap guard.
    context.replace({ start: 1, end: 3 }, "X");
    context.insert(1, "Y");
    const { text } = context.build();
    expect(text).toBe("AYXD");
  });
});

describe("PreprocessorContext.pushDiagnostic", () => {
  test("diagnostics pushed before build() surface in the result", async () => {
    const context = await createContext("EXEC SQL X;");
    context.pushDiagnostic({
      severity: Severity.E,
      message: "test diagnostic",
    });
    const { diagnostics } = context.build();
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].message).toBe("test diagnostic");
  });

  test("an api-shaped diagnostic gets this context's uri and an exclusive end offset", async () => {
    const context = await createContext("EXEC SQL X;");
    context.pushDiagnostic({
      severity: api.Severity.Error,
      message: "api diagnostic",
      code: "X1",
      startOffset: 9,
      endOffset: 9, // ANTLR-style inclusive `stop` - a single-character token
    });
    const { diagnostics } = context.build();
    // Without a uri and a non-empty range, DiagnosticsStore would silently drop it.
    expect(diagnostics[0].uri).toBe(uri.toString());
    expect(diagnostics[0].range).toEqual({ start: 9, end: 10 });
  });
});

describe("PreprocessorContext.resolveInclude", () => {
  test("an unresolvable include (no process group/program config) returns undefined and a diagnostic, rather than throwing", async () => {
    const context = await createContext("EXEC SQL INCLUDE MISSING;");
    const included = await context.resolveInclude("MISSING");
    expect(included).toBeUndefined();

    const { diagnostics } = context.build();
    expect(diagnostics.length).toBeGreaterThan(0);
  });

  test("the unresolved-include diagnostic is anchored to the include statement when a range is given", async () => {
    const context = await createContext("EXEC SQL INCLUDE MISSING;");
    const included = await context.resolveInclude("MISSING", {
      start: 0,
      end: 25,
    });
    expect(included).toBeUndefined();

    const { diagnostics } = context.build();
    // Without uri + range, DiagnosticsStore drops the diagnostic and the user never
    // sees the failed include.
    expect(diagnostics[0].uri).toBe(uri.toString());
    expect(diagnostics[0].range).toEqual({ start: 0, end: 25 });
  });
});

describe("PreprocessorContext.resolveInclude - include cycles", () => {
  test("a self-include is rejected like a failed resolution instead of recursing", async () => {
    const unit = await setupIncludeWorkspace({
      "/workspace/cpy/self.pli": "EXEC SQL INCLUDE self;",
    });
    // Mimics what exec-phase's onProcess does: re-scan every nested context and act on
    // its own include statements. Without the ancestor-chain guard this recurses
    // without bound (nested context -> onProcess -> resolveInclude -> ...).
    let processCount = 0;
    const onProcess = async (ctx: PreprocessorContext) => {
      processCount++;
      const inner = await ctx.resolveInclude("self", {
        start: 0,
        end: ctx.text.length,
      });
      if (inner) {
        ctx.insertContext(0, inner);
      }
    };
    const context = new PreprocessorContext(
      mainUri,
      "EXEC SQL INCLUDE self;",
      unit,
      mainUri,
      onProcess,
    );
    const included = await context.resolveInclude("self", {
      start: 0,
      end: 22,
    });
    // The first include of the file is legal - only the file's include of *itself*
    // (an ancestor) is blocked.
    expect(included).toBeDefined();
    expect(processCount).toBe(1);
    const { diagnostics } = included!.build();
    // Mirrors the macro %INCLUDE path: a recursive include raises the same
    // diagnostic as an unresolvable one.
    expect(diagnostics.some((d) => d.code?.includes("IBM1848"))).toBe(true);
    // The recursive attempt is recorded as unresolved.
    expect(included!.getIncludeAttempts()).toHaveLength(1);
    expect(included!.getIncludeAttempts()[0].uri).toBeUndefined();
  });

  test("a mutual A->B->A cycle is blocked at the closing edge", async () => {
    const unit = await setupIncludeWorkspace({
      "/workspace/cpy/a.pli": "EXEC SQL INCLUDE b;",
      "/workspace/cpy/b.pli": "EXEC SQL INCLUDE a;",
    });
    const main = new PreprocessorContext(
      mainUri,
      "EXEC SQL INCLUDE a;",
      unit,
      mainUri,
    );
    const a = await main.resolveInclude("a", { start: 0, end: 19 });
    expect(a).toBeDefined();
    const b = await a!.resolveInclude("b", { start: 0, end: 19 });
    expect(b).toBeDefined();
    // b including a again closes the cycle - a is an ancestor of b.
    const aAgain = await b!.resolveInclude("a", { start: 0, end: 19 });
    expect(aAgain).toBeUndefined();
    const { diagnostics } = b!.build();
    expect(diagnostics.some((d) => d.code?.includes("IBM1848"))).toBe(true);
  });

  test("including the same file twice sequentially (siblings) stays legal", async () => {
    const unit = await setupIncludeWorkspace({
      "/workspace/cpy/lib.pli": "DCL X FIXED;",
    });
    const main = new PreprocessorContext(
      mainUri,
      "EXEC SQL INCLUDE lib;\nEXEC SQL INCLUDE lib;",
      unit,
      mainUri,
    );
    const first = await main.resolveInclude("lib", { start: 0, end: 21 });
    const second = await main.resolveInclude("lib", { start: 22, end: 43 });
    // A *sibling* re-include is not a cycle - only ancestor repeats are.
    expect(first).toBeDefined();
    expect(second).toBeDefined();
    expect(main.build().diagnostics).toHaveLength(0);
  });
});

describe("PreprocessorContext.resolveInclude - success path", () => {
  test("onProcess receives the nested context info and prepareText is applied", async () => {
    const unit = await setupIncludeWorkspace({
      "/workspace/cpy/lib.pli": "dcl x;",
    });
    let processedContext: PreprocessorContext | undefined;
    let nestedInfo: NestedContextInfo | undefined;
    const onProcess = async (
      ctx: PreprocessorContext,
      nested?: NestedContextInfo,
    ) => {
      processedContext = ctx;
      nestedInfo = nested;
    };
    const prepareText = (text: string) => text.toUpperCase();
    const main = new PreprocessorContext(
      mainUri,
      "EXEC SQL INCLUDE lib;",
      unit,
      mainUri,
      onProcess,
      prepareText,
    );
    const included = await main.resolveInclude("lib", { start: 0, end: 21 });
    expect(included).toBeDefined();
    expect(processedContext).toBe(included);
    expect(nestedInfo?.parent).toBe(main);
    expect(nestedInfo?.includeRange).toEqual({ start: 0, end: 21 });
    // The document is the *raw* file; the context text went through prepareText.
    expect(nestedInfo?.document?.getText()).toBe("dcl x;");
    expect(included!.text).toBe("DCL X;");
    // Attempt recorded with the resolved uri.
    expect(main.getIncludeAttempts()[0].uri?.toString()).toContain("lib.pli");
  });
});

describe("PreprocessorContext.insertContext", () => {
  test("rejects api contexts that were not returned by resolveInclude", async () => {
    const context = await createContext("AB");
    const foreign: api.PreprocessorContext = {
      text: "",
      pushDiagnostic() {},
      replace() {},
      async resolveInclude() {
        return undefined;
      },
      insertContext() {},
    };
    expect(() => context.insertContext(0, foreign)).toThrow(
      /insertContext only accepts contexts returned by resolveInclude/,
    );
  });

  test("splices the nested build result in as a zero-width edit and surfaces its diagnostics", async () => {
    const unit = await setupIncludeWorkspace({
      "/workspace/cpy/lib.pli": "DCL X;",
    });
    const main = new PreprocessorContext(mainUri, "AB", unit, mainUri);
    const included = await main.resolveInclude("lib");
    expect(included).toBeDefined();
    included!.pushDiagnostic({ severity: Severity.W, message: "nested diag" });
    main.insertContext(1, included!);
    const { text, diagnostics, sourceMap } = main.build();
    // Zero-width: no original character of "AB" is consumed.
    expect(text).toBe("ADCL X;B");
    expect(diagnostics.some((d) => d.message === "nested diag")).toBe(true);
    // The spliced span keeps the *included* file's own positions (foreign segment).
    const mapped = sourceMap.mapToOriginal(1);
    expect(mapped?.uri?.toString()).toContain("lib.pli");
    expect(mapped?.offset).toBe(0);
  });
});

describe("findEmbeddedImage - PL/I identifier boundaries", () => {
  function apiIdentifier(image: string): api.Token {
    return {
      image,
      semanticsKind: api.SemanticsKind.Identifier,
      startOffset: 0,
      endOffset: image.length - 1,
    };
  }

  test("image VAR does not match inside VAR#X / VAR@Y / VAR$Z", async () => {
    // `#`, `@` and `$` are PL/I identifier characters - `VAR` inside `VAR#X` is a
    // different identifier, not an embedded occurrence of `VAR`.
    for (const text of ["SET A = VAR#X", "SET A = VAR@Y", "SET A = VAR$Z"]) {
      const context = await createContext("EXEC SQL X;");
      context.replace({ start: 0, end: 11 }, text, [apiIdentifier("VAR")]);
      expect(context.getEdits()[0].identifierPairs).toBeUndefined();
    }
  });

  test("image VAR matches when delimited by space, semicolon, or end of text", async () => {
    const cases: [string, number][] = [
      ["VAR#X VAR ;", 6], // skips the VAR#X prefix, lands on the standalone VAR
      ["X VAR;", 2],
      ["X VAR", 2], // end of text is a boundary
    ];
    for (const [text, expectedOffset] of cases) {
      const context = await createContext("EXEC SQL X;");
      context.replace({ start: 0, end: 11 }, text, [apiIdentifier("VAR")]);
      const pairs = context.getEdits()[0].identifierPairs;
      expect(pairs, text).toHaveLength(1);
      expect(pairs![0].mapped.startOffset, text).toBe(expectedOffset);
      expect(pairs![0].mapped.execHostVariable).toBe(true);
    }
  });
});
