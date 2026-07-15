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
import {
  RecordingPreprocessorContext,
  SemanticsKind,
  Severity,
} from "preprocessor-api";
import { CICSPreprocessor } from "../src/engine/preprocessor";
import { HostLanguageType } from "../src/engine/host-languages";

/**
 * Conformance tests for the context entry point (`execute(context)`) - the whole contract
 * an embedding host sees. The per-command suites in this package cover the grammar itself
 * through the engine's `parse`.
 */
describe("CICS execute(context)", () => {
  const preprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  test("replaces each EXEC CICS statement and records its full classified token list in host coordinates", async () => {
    const text = "DCL X FIXED;\nEXEC CICS ABEND ABCODE(12);\nX = 1;";
    const context = new RecordingPreprocessorContext(text);
    await preprocessor.execute(context);

    expect(context.diagnostics).toHaveLength(0);
    expect(context.edits).toHaveLength(1);
    const [edit] = context.edits;
    expect(text.slice(edit.range.start, edit.range.end)).toBe(
      "EXEC CICS ABEND ABCODE(12);",
    );
    expect(edit.text.endsWith("DO; END;")).toBe(true);
    // Full classification, not just identifiers - offsets absolute into `context.text`.
    const abend = edit.tokens.find((t) => t.image === "ABEND");
    expect(abend?.semanticsKind).toBe(SemanticsKind.Keyword);
    expect(abend?.startOffset).toBe(text.indexOf("ABEND"));
    expect(text.slice(abend!.startOffset, abend!.endOffset + 1)).toBe("ABEND");
  });

  test("rebases diagnostics into host coordinates", async () => {
    const text = "EXEC CICS ABEND BLA;";
    const context = new RecordingPreprocessorContext(text);
    await preprocessor.execute(context);

    expect(context.diagnostics).toHaveLength(1);
    expect(context.diagnostics[0].severity).toBe(Severity.Error);
    expect(context.diagnostics[0].startOffset).toBe(text.indexOf("BLA"));
  });

  test("an unterminated statement is parsed and diagnosed but not replaced - only annotated", async () => {
    const text = "EXEC CICS ABEND BLA";
    const context = new RecordingPreprocessorContext(text);
    await preprocessor.execute(context);

    expect(context.diagnostics.length).toBeGreaterThan(0);
    expect(context.edits).toHaveLength(1);
    const [edit] = context.edits;
    // Zero-width, empty-text annotation edit: the raw statement stays in the text.
    expect(edit.range).toEqual({ start: 0, end: 0 });
    expect(edit.text).toBe("");
    expect(edit.tokens.some((t) => t.image === "ABEND")).toBe(true);
  });
});
