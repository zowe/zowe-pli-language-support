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
import { CVDA_VALUES, RESP_VALUES } from "../src/engine/cics-values";

/**
 * The translator's host-side work beyond `EXEC CICS` statements: `DFHRESP`/`DFHVALUE`
 * substitution and the per-procedure `DFH*` runtime declarations, through
 * `execute(context)` against the recording context.
 */
describe("CICS built-ins", () => {
  const preprocessor = new CICSPreprocessor(HostLanguageType.PLI);

  async function run(text: string): Promise<RecordingPreprocessorContext> {
    const context = new RecordingPreprocessorContext(text);
    await preprocessor.execute(context);
    return context;
  }

  function declarations(context: RecordingPreprocessorContext): number[] {
    return context.edits
      .filter((e) => e.range.start === e.range.end && e.text !== "")
      .map((e) => e.range.start);
  }

  test("the value tables carry the documented numbers", () => {
    expect(RESP_VALUES.NORMAL).toBe(0);
    expect(RESP_VALUES.NOTFND).toBe(13);
    expect(RESP_VALUES.DUPREC).toBe(14);
    expect(RESP_VALUES.DISABLED).toBe(84);
    expect(CVDA_VALUES.ENABLED).toBe(23);
    // The same name means something else in each namespace.
    expect(CVDA_VALUES.DISABLED).toBe(24);
    expect(CVDA_VALUES.NORMAL).toBe(1016);
    expect(Object.keys(RESP_VALUES).length).toBeGreaterThan(100);
    expect(Object.keys(CVDA_VALUES).length).toBeGreaterThan(1000);
  });

  test.each([
    ["DFHRESP(NORMAL)", "0"],
    ["DFHRESP(NOTFND)", "13"],
    ["dfhresp(duprec)", "14"],
    ["DFHRESP ( QIDERR )", "44"],
    ["DFHVALUE(ENABLED)", "23"],
    ["DFHVALUE(DISABLED)", "24"],
    ["DFHVALUE(CLOSEREQUEST)", "22"],
  ])("%s becomes %s", async (clause, value) => {
    const text = `IF X = ${clause} THEN Y = 1;`;
    const context = await run(text);
    expect(context.diagnostics).toEqual([]);
    expect(context.edits).toHaveLength(1);
    const [edit] = context.edits;
    expect(text.slice(edit.range.start, edit.range.end)).toBe(clause);
    expect(edit.text).toBe(value);
    expect(edit.tokens.map((t) => [t.image, t.semanticsKind])).toEqual([
      [clause.slice(0, clause.indexOf("(")).trim(), SemanticsKind.Keyword],
      [clause.slice(clause.indexOf("(") + 1, -1).trim(), SemanticsKind.Keyword],
    ]);
  });

  test("an unknown name is diagnosed on the name and the clause removed", async () => {
    const text = "X = DFHRESP(BOGUS); Y = DFHVALUE(BOGUS);";
    const context = await run(text);
    expect(context.edits.map((e) => e.text)).toEqual(["", ""]);
    expect(context.diagnostics).toHaveLength(2);
    expect(context.diagnostics[0]).toMatchObject({
      severity: Severity.Severe,
      code: "unknown.response.condition",
      range: { start: text.indexOf("BOGUS"), end: text.indexOf("BOGUS") + 5 },
    });
    expect(context.diagnostics[1].code).toBe("unknown.cvda");
  });

  test.each([
    "DFHRESP",
    "DFHRESP(NORMAL",
    "DFHRESP NORMAL)",
    "MYDFHRESP(NORMAL)",
  ])("%s is ordinary host text", async (text) => {
    const context = await run(text);
    expect(context.edits).toEqual([]);
    expect(context.diagnostics).toEqual([]);
  });

  test("built-ins inside EXEC statements or string literals are left to those", async () => {
    const text =
      "EXEC CICS WRITEQ TS QUEUE('A;B') FROM(DFHRESP(NORMAL));\n" +
      "EXEC SQL SELECT DFHVALUE(ENABLED) FROM T;\n" +
      "S = 'DFHRESP(NORMAL)';";
    const context = await run(text);
    expect(context.edits.map((e) => e.text)).toEqual(["DO; END;"]);
    expect(context.edits[0].range.end).toBe(text.indexOf("\n"));
  });

  test("the DFH* declarations are inserted once per procedure using EXEC CICS", async () => {
    const text =
      "A: PROC;\n  EXEC CICS ABEND;\n  EXEC CICS RETURN;\n  B: PROC;\n    EXEC CICS RETURN;\n  END;\nEND;";
    const context = await run(text);
    expect(declarations(context)).toEqual([
      text.indexOf("A: PROC;") + "A: PROC;".length,
      text.indexOf("B: PROC;") + "B: PROC;".length,
    ]);
    const block = context.edits.find((e) => e.text.includes("DFHEIBLK"))!;
    expect(block.text).toContain("EIBRESP  FIXED BIN(31)");
    expect(block.tokens).toEqual([]);
  });

  test("DFHRESP alone does not declare anything, and neither does EXEC CICS outside a procedure", async () => {
    const context = await run("X = DFHRESP(NORMAL);\nEXEC CICS RETURN;");
    expect(declarations(context)).toEqual([]);
  });

  test("a procedure header that never closes gets no declarations", async () => {
    const context = await run("A: PROC\n  EXEC CICS RETURN");
    expect(context.edits.map((e) => e.text)).toEqual([""]);
    expect(declarations(context)).toEqual([]);
  });
});
