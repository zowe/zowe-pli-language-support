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
  RecordedEdit,
  RecordingPreprocessorContext,
  SemanticsKind,
  Severity,
} from "preprocessor-api";
import { Db2SqlPreprocessor } from "../src/engine/preprocessor";

/**
 * `SQL TYPE IS ...` attribute rewriting and the per-procedure `SQL_LOB*` declaration
 * blocks, through `execute(context)` against the recording context.
 */
describe("DB2 SQL TYPE IS", () => {
  const preprocessor = new Db2SqlPreprocessor();

  async function run(
    text: string,
    includeTexts?: Record<string, string>,
  ): Promise<RecordingPreprocessorContext> {
    const context = new RecordingPreprocessorContext(
      text,
      "file:///main.pli",
      "file:///main.pli",
      includeTexts,
    );
    await preprocessor.execute(context);
    return context;
  }

  /** The edit replacing the clause at `text.indexOf(clause)`. */
  function clauseEdit(
    context: RecordingPreprocessorContext,
    clause: string,
  ): RecordedEdit {
    const start = context.text.indexOf(clause);
    const edit = context.edits.find((e) => e.range.start === start);
    expect(edit, clause).toBeDefined();
    return edit!;
  }

  /** The zero-width insertions (declaration blocks), by offset. */
  function insertions(
    context: RecordingPreprocessorContext,
  ): { offset: number; text: string }[] {
    return context.edits
      .filter((e) => e.range.start === e.range.end && e.text !== "")
      .map((e) => ({ offset: e.range.start, text: e.text }));
  }

  test.each([
    ["SQL TYPE IS BLOB_LOCATOR", "FIXED BIN(31)"],
    ["SQL TYPE IS CLOB_LOCATOR", "FIXED BIN(31)"],
    ["SQL TYPE IS TABLE LIKE EMP AS LOCATOR", "FIXED BIN(31)"],
    ["SQL TYPE IS RESULT_SET_LOCATOR VARYING", "FIXED BIN(31)"],
    ["SQL TYPE IS ROWID", "CHAR(40) VARYING"],
    ["SQL TYPE IS BINARY(10)", "CHAR(10) NONVARYING"],
    ["SQL TYPE IS BIN(10)", "CHAR(10) NONVARYING"],
    ["SQL TYPE IS BINARY VARYING(10)", "CHAR(10) VARYING"],
    ["SQL TYPE IS VARBINARY(2K)", "CHAR(2048) VARYING"],
    ["SQL TYPE IS XML AS BLOB_FILE", "LIKE SQL_LOB_FILE"],
    ["sql type is clob(1k)", "LIKE SQL_LOB1024"],
    ["SQL TYPE IS DBCLOB(1M)", "LIKE SQL_LOB1048576"],
    ["SQL TYPE IS BINARY LARGE OBJECT(1G)", "LIKE SQL_LOB1073741824"],
    ["SQL TYPE IS CHARACTER LARGE OBJECT(5)", "LIKE SQL_LOB5"],
    ["SQL TYPE IS XML AS CLOB(5)", "LIKE SQL_LOB5"],
  ])("%s becomes %s", async (clause, replacement) => {
    const context = await run(`TEST: PROC;\n  DCL X ${clause};\nEND;`);
    expect(context.diagnostics).toEqual([]);
    const edit = clauseEdit(context, clause);
    expect(context.text.slice(edit.range.start, edit.range.end)).toBe(clause);
    expect(edit.text).toBe(replacement);
  });

  test("records every consumed keyword and number as classified tokens", async () => {
    const clause = "SQL TYPE IS CLOB(1K)";
    const context = await run(`TEST: PROC;\n  DCL X ${clause};\nEND;`);
    const edit = clauseEdit(context, clause);
    expect(edit.tokens.map((t) => [t.image, t.semanticsKind])).toEqual([
      ["SQL", SemanticsKind.Keyword],
      ["TYPE", SemanticsKind.Keyword],
      ["IS", SemanticsKind.Keyword],
      ["CLOB", SemanticsKind.Keyword],
      ["1", SemanticsKind.Number],
      ["K", SemanticsKind.Keyword],
    ]);
    expect(edit.tokens[3].range.start).toBe(context.text.indexOf("CLOB"));
  });

  test("inserts the LOB declaration block once per size right after the procedure's semicolon", async () => {
    const text =
      "TEST: PROC;\n  DCL A SQL TYPE IS BLOB(10);\n  DCL B SQL TYPE IS CLOB(10);\n  DCL C SQL TYPE IS CLOB(1K);\nEND;";
    const context = await run(text);
    const [block] = insertions(context);
    expect(insertions(context)).toHaveLength(1);
    expect(block.offset).toBe(text.indexOf(";") + 1);
    // One block per distinct size, in reverse encounter order.
    expect(block.text.indexOf("SQL_LOB1024 BASED")).toBeLessThan(
      block.text.indexOf("SQL_LOB10 BASED"),
    );
    expect(block.text.match(/SQL_LOB10 BASED/g)).toHaveLength(1);
  });

  test("inserts the LOB FILE declaration block once", async () => {
    const text =
      "TEST: PROC;\n  DCL A SQL TYPE IS BLOB_FILE;\n  DCL B SQL TYPE IS CLOB_FILE;\nEND;";
    const context = await run(text);
    const blocks = insertions(context);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].text.match(/SQL_LOB_FILE BASED/g)).toHaveLength(1);
    expect(blocks[0].text).toContain("SQL_FILE_APPEND");
  });

  test("a LOB clause outside any procedure is dropped and declares nothing", async () => {
    const context = await run("DCL A SQL TYPE IS BLOB(10);");
    expect(clauseEdit(context, "SQL TYPE IS BLOB(10)").text).toBe("");
    expect(insertions(context)).toEqual([]);
  });

  test("a procedure whose header never closes gets no declarations", async () => {
    const context = await run("TEST: PROC\n  DCL A SQL TYPE IS BLOB(10)");
    expect(clauseEdit(context, "SQL TYPE IS BLOB(10)").text).toBe("");
    expect(insertions(context)).toEqual([]);
  });

  test("nested procedures get their own blocks", async () => {
    const text =
      "A: PROC;\n  DCL X SQL TYPE IS BLOB(1);\n  B: PROC;\n    DCL Y SQL TYPE IS BLOB(2);\n  END;\nEND;";
    const context = await run(text);
    expect(insertions(context).map((i) => i.offset)).toEqual([
      text.indexOf("A: PROC;") + "A: PROC;".length,
      text.indexOf("B: PROC;") + "B: PROC;".length,
    ]);
  });

  test("a copybook's LOB clause declares against the including file's procedure", async () => {
    const copybook = "DCL C SQL TYPE IS CLOB(2K);";
    const text = "TEST: PROC;\n  EXEC SQL INCLUDE DCLEMP;\nEND;";
    const context = await run(text, { DCLEMP: copybook });
    const nested = context.includes[0].context!;
    expect(nested.edits.map((e) => e.text)).toEqual(["LIKE SQL_LOB2048"]);
    expect(insertions(nested)).toEqual([]);
    const [block] = insertions(context);
    expect(block.offset).toBe(text.indexOf(";") + 1);
    expect(block.text).toContain("SQL_LOB2048 BASED");
  });

  test("a clause inside an EXEC SQL statement body is not touched", async () => {
    const text =
      "TEST: PROC;\n  EXEC SQL DECLARE C CURSOR FOR SELECT SQL TYPE IS ROWID FROM T;\nEND;";
    const context = await run(text);
    expect(context.edits.map((e) => e.text)).toEqual(["DO; END;"]);
  });

  test("a clause inside a string literal is not touched", async () => {
    const context = await run("X = 'SQL TYPE IS ROWID';");
    expect(context.edits).toEqual([]);
  });

  test.each([
    ["SQL TYPE IS XML BLOB(1)", "BLOB", "IBM3782IS"],
    ["SQL TYPE IS XML AS DECIMAL", "DECIMAL", "IBM3783IS"],
    ["SQL TYPE IS XML AS ROWID", "ROWID", "IBM3783IS"],
    ["SQL TYPE IS TABLE EMP", "EMP", "IBM3784IS"],
    ["SQL TYPE IS TABLE LIKE (EMP)", "(", "IBM3785IS"],
    ["SQL TYPE IS TABLE LIKE EMP LOCATOR", "LOCATOR", "IBM3786IS"],
    ["SQL TYPE IS TABLE LIKE EMP AS X", "X", "IBM3787IS"],
    ["SQL TYPE IS DECIMAL", "DECIMAL", "IBM3788IS"],
    ["SQL TYPE IS BINARY 10)", "10", "IBM3754IS"],
    ["SQL TYPE IS BINARY()", ")", "IBM3755IS"],
    ["SQL TYPE IS BINARY(10 X", "X", "IBM3756IS"],
    ["SQL TYPE IS XML AS CLOB 10)", "10", "IBM3757IS"],
    ["SQL TYPE IS XML AS CLOB()", ")", "IBM3758IS"],
    ["SQL TYPE IS XML AS CLOB(10 ZZ", "ZZ", "IBM3759IS"],
  ])("%s raises %s", async (clause, at, code) => {
    const context = await run(`TEST: PROC;\n  DCL X ${clause};\nEND;`);
    // Like the PL/I parser, parsing resumes at the next fitting token, so a later
    // mismatch may add a second diagnostic - the first one is the interesting one.
    const [diagnostic] = context.diagnostics;
    expect(diagnostic.code).toBe(code);
    expect(diagnostic.severity).toBe(Severity.Severe);
    const atOffset = context.text.indexOf(at, context.text.indexOf(clause));
    expect(diagnostic.range).toEqual({
      start: atOffset,
      end: atOffset + at.length,
    });
  });

  test("the IBM message names the type", async () => {
    const context = await run("DCL X SQL TYPE IS BINARY VARYING 10);");
    expect(context.diagnostics[0].message).toBe(
      "SQL TYPE IS BINARY VARYING must be followed by an opening left parenthesis.",
    );
  });

  test("an unrecognized type name blanks only the consumed prefix and leaves the name", async () => {
    const clause = "SQL TYPE IS XML AS BLOB_LOCATOR";
    const context = await run(`TEST: PROC;\n  DCL X ${clause};\nEND;`);
    const edit = clauseEdit(context, "SQL TYPE IS");
    expect(context.text.slice(edit.range.start, edit.range.end)).toBe(
      "SQL TYPE IS XML AS",
    );
    expect(edit.text).toBe("");
  });

  test("a diagnosed clause that still resolves keeps its replacement over the consumed extent", async () => {
    // The `AS` is missing but `BLOB(1)` is recognized: like the PL/I parser, parsing
    // resumes at the next fitting token.
    const context = await run(
      "TEST: PROC;\n  DCL X SQL TYPE IS XML BLOB(1);\nEND;",
    );
    const edit = clauseEdit(context, "SQL TYPE IS");
    expect(context.text.slice(edit.range.start, edit.range.end)).toBe(
      "SQL TYPE IS XML BLOB(1)",
    );
    expect(edit.text).toBe("LIKE SQL_LOB1");
  });

  test("a generic syntax error is severe and anchored on the unexpected token", async () => {
    const context = await run("DCL X SQL TYPE IS BINARY LARGE THING(1);");
    expect(context.diagnostics).toHaveLength(1);
    expect(context.diagnostics[0]).toMatchObject({
      code: "syntax",
      severity: Severity.Severe,
      message: "Unexpected token 'THING'.",
    });
  });

  test("a clause cut off at end of file is diagnosed at the last token", async () => {
    const context = await run("DCL X SQL TYPE IS BINARY(");
    expect(context.diagnostics).toHaveLength(1);
    expect(context.diagnostics[0].code).toBe("IBM3755IS");
  });
});
