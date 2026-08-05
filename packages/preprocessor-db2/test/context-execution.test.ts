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
import { RecordingPreprocessorContext, SemanticsKind } from "preprocessor-api";
import { Db2SqlPreprocessor } from "../src/engine/preprocessor";

/**
 * Conformance tests for the context entry point (`execute(context)`) - the whole contract
 * an embedding host sees. The statement suites in this package cover the grammar itself
 * through the engine's `parse`.
 */
describe("DB2 execute(context)", () => {
  const preprocessor = new Db2SqlPreprocessor();

  test("re-embeds host variables in the replacement and records the full token list in host coordinates", async () => {
    const text = "DCL HV1 FIXED;\nEXEC SQL SELECT 1 INTO :HV1 FROM T;";
    const context = new RecordingPreprocessorContext(text);
    await preprocessor.execute(context);

    expect(context.diagnostics).toHaveLength(0);
    expect(context.edits).toHaveLength(1);
    const [edit] = context.edits;
    expect(text.slice(edit.range.start, edit.range.end)).toBe(
      "EXEC SQL SELECT 1 INTO :HV1 FROM T;",
    );
    // The host variable appears verbatim in the replacement, in token order - the contract
    // the host's embedded-image search relies on.
    expect(edit.text).toContain("HV1");
    expect(edit.text.endsWith("END;")).toBe(true);
    const hostVariable = edit.tokens.find(
      (t) => t.semanticsKind === SemanticsKind.Identifier,
    );
    // Host coordinates: the token points at `HV1` after the colon in the source text.
    expect(hostVariable?.image).toBe("HV1");
    expect(hostVariable?.startOffset).toBe(text.indexOf(":HV1") + 1);
  });

  test("an EXEC SQL INCLUDE resolves through the context and records the member token", async () => {
    const text = "EXEC SQL INCLUDE COPY1;";
    const context = new RecordingPreprocessorContext(text);
    await preprocessor.execute(context);

    // The recorder reports every include as unresolved; the attempt is still recorded
    // with the statement's range, which is how the host links the AST node.
    expect(context.includes).toEqual([
      { name: "COPY1", range: { start: 0, end: text.length } },
    ]);
    expect(context.edits).toHaveLength(1);
    const [edit] = context.edits;
    expect(edit.text).toBe("");
    const member = edit.tokens.find(
      (t) => t.semanticsKind === SemanticsKind.Identifier,
    );
    expect(member?.image).toBe("COPY1");
    expect(member?.startOffset).toBe(text.indexOf("COPY1"));
  });

  test("an unterminated statement is parsed and diagnosed but not replaced - only annotated", async () => {
    const text = "EXEC SQL SELECT 1 INTO :HV1 FROM T";
    const context = new RecordingPreprocessorContext(text);
    await preprocessor.execute(context);

    expect(context.edits).toHaveLength(1);
    const [edit] = context.edits;
    expect(edit.range).toEqual({ start: 0, end: 0 });
    expect(edit.text).toBe("");
    expect(edit.tokens.some((t) => t.image === "HV1")).toBe(true);
    // No include resolution and no text change for broken statements.
    expect(context.includes).toHaveLength(0);
  });
});
