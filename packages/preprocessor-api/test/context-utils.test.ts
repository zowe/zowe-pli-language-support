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
  buildExecReplacement,
  Delimiters,
  rebaseDiagnostic,
  rebaseToken,
  scanExecFragments,
} from "../src/context-utils";
import { ExecFragment, Severity, Token, SemanticsKind } from "../src/types";

const SQL: Delimiters = { quotes: ["'", '"'], lineComments: ["--"] };
const CICS: Delimiters = {
  quotes: ["'", '"'],
  lineComments: ["*>", ">>", "//"],
  blockComments: [{ start: "/*", end: "*/" }],
};

describe("scanExecFragments", () => {
  test("finds a plain statement", () => {
    const text = "DCL X; EXEC SQL SELECT 1 FROM T; DCL Y;";
    const fragments = scanExecFragments(text, "SQL", SQL);
    expect(fragments).toHaveLength(1);
    expect(fragments[0].bodyText).toBe("SELECT 1 FROM T");
    expect(text.slice(fragments[0].range.start, fragments[0].range.end)).toBe(
      "EXEC SQL SELECT 1 FROM T;",
    );
  });

  test("finds multiple statements in one text", () => {
    const text = "EXEC SQL A;\nEXEC SQL B;";
    const fragments = scanExecFragments(text, "SQL", SQL);
    expect(fragments.map((f) => f.bodyText)).toEqual(["A", "B"]);
  });

  test("ignores statements with a different prefix", () => {
    const text = "EXEC CICS LINK(X); EXEC SQL SELECT 1;";
    expect(scanExecFragments(text, "SQL", SQL).map((f) => f.bodyText)).toEqual([
      "SELECT 1",
    ]);
    expect(
      scanExecFragments(text, "CICS", CICS).map((f) => f.bodyText),
    ).toEqual(["LINK(X)"]);
  });

  test("a semicolon inside a single-quoted string doesn't end the statement", () => {
    const text = "EXEC SQL INSERT INTO T VALUES('a;b');";
    const fragments = scanExecFragments(text, "SQL", SQL);
    expect(fragments).toHaveLength(1);
    expect(fragments[0].bodyText).toBe("INSERT INTO T VALUES('a;b')");
  });

  test("a semicolon inside a double-quoted string doesn't end the statement", () => {
    const text = 'EXEC SQL SELECT "a;b" FROM T;';
    const fragments = scanExecFragments(text, "SQL", SQL);
    expect(fragments[0].bodyText).toBe('SELECT "a;b" FROM T');
  });

  test("a doubled quote is an escaped quote, not the end of the string", () => {
    const text = "EXEC SQL INSERT INTO T VALUES('it''s;fine');";
    const fragments = scanExecFragments(text, "SQL", SQL);
    expect(fragments[0].bodyText).toBe("INSERT INTO T VALUES('it''s;fine')");
  });

  test("a semicolon inside a line comment doesn't end the statement", () => {
    const text = "EXEC SQL SELECT 1 -- comment; still comment\nFROM T;";
    const fragments = scanExecFragments(text, "SQL", SQL);
    expect(fragments[0].bodyText).toBe(
      "SELECT 1 -- comment; still comment\nFROM T",
    );
  });

  test("a semicolon inside a multi-line block comment doesn't end the statement (CICS)", () => {
    const text = "EXEC CICS /* a;\nb; */ LINK(X);";
    const fragments = scanExecFragments(text, "CICS", CICS);
    expect(fragments[0].bodyText).toBe("/* a;\nb; */ LINK(X)");
  });

  test("an EXEC mention inside a comment within a statement body is not a nested statement", () => {
    const text =
      "EXEC SQL SELECT 1 -- EXEC SQL nope;\nFROM T; EXEC SQL SELECT 2;";
    expect(scanExecFragments(text, "SQL", SQL).map((f) => f.bodyText)).toEqual([
      "SELECT 1 -- EXEC SQL nope;\nFROM T",
      "SELECT 2",
    ]);
  });

  test("the embedded language's line-comment marker is not a comment in host text", () => {
    // `--` is ordinary PL/I outside EXEC statements (`A--B` subtracts a negated value) -
    // it must not swallow the rest of the line, including a following EXEC statement.
    const text = "X = A--B; EXEC SQL COMMIT;";
    const fragments = scanExecFragments(text, "SQL", SQL);
    expect(fragments).toHaveLength(1);
    expect(fragments[0].bodyText).toBe("COMMIT");
  });

  test("an unterminated string doesn't hang the scan and the statement still resolves via the next real semicolon", () => {
    const text = "EXEC SQL SELECT 'unterminated\nFROM T;";
    const fragments = scanExecFragments(text, "SQL", SQL);
    expect(fragments).toHaveLength(1);
    expect(fragments[0].bodyText).toBe("SELECT 'unterminated\nFROM T");
  });

  test("a statement that never closes yields an unterminated fragment running to EOF", () => {
    const text = "EXEC SQL SELECT 1 FROM T";
    const fragments = scanExecFragments(text, "SQL", SQL);
    expect(fragments).toHaveLength(1);
    expect(fragments[0]).toMatchObject({
      bodyText: "SELECT 1 FROM T",
      terminated: false,
      range: { start: 0, end: text.length },
    });
  });

  test("terminated statements are marked as such", () => {
    const fragments = scanExecFragments("EXEC SQL COMMIT;", "SQL", SQL);
    expect(fragments[0].terminated).toBe(true);
  });

  test("an unterminated statement after a terminated one is still the scan's last fragment", () => {
    const text = "EXEC SQL A; EXEC SQL SELECT 1 FROM T";
    const fragments = scanExecFragments(text, "SQL", SQL);
    expect(fragments.map((f) => f.bodyText)).toEqual(["A", "SELECT 1 FROM T"]);
    expect(fragments.map((f) => f.terminated)).toEqual([true, false]);
  });

  test("is case-insensitive on both EXEC and the prefix", () => {
    const text = "exec Sql select 1;";
    const fragments = scanExecFragments(text, "SQL", SQL);
    expect(fragments[0].bodyText).toBe("select 1");
  });

  test("an empty statement body (EXEC SQL;) is still a fragment", () => {
    // The host tokenizer consumes `EXEC SQL;` as an EXEC statement, so the scan must
    // recognize it too - otherwise the raw text would leak to the final parse.
    const text = "DCL X; EXEC SQL; DCL Y;";
    const fragments = scanExecFragments(text, "SQL", SQL);
    expect(fragments).toHaveLength(1);
    expect(fragments[0]).toMatchObject({
      bodyText: "",
      terminated: true,
    });
    expect(text.slice(fragments[0].range.start, fragments[0].range.end)).toBe(
      "EXEC SQL;",
    );
  });

  test("EXEC SQL at EOF is an unterminated fragment with an empty body", () => {
    const text = "EXEC SQL";
    const fragments = scanExecFragments(text, "SQL", SQL);
    expect(fragments).toHaveLength(1);
    expect(fragments[0]).toMatchObject({
      bodyText: "",
      terminated: false,
      range: { start: 0, end: text.length },
    });
  });

  test("the extent covers the full statement when the body contains a quoted semicolon", () => {
    const text = "EXEC SQL SELECT ';' FROM T;";
    const fragments = scanExecFragments(text, "SQL", SQL);
    expect(fragments).toHaveLength(1);
    expect(fragments[0].bodyText).toBe("SELECT ';' FROM T");
    expect(text.slice(fragments[0].range.start, fragments[0].range.end)).toBe(
      text,
    );
  });

  test("an EXEC mention inside a host string literal is not a statement", () => {
    const text = "S = 'EXEC SQL X;'; EXEC SQL COMMIT;";
    const fragments = scanExecFragments(text, "SQL", SQL);
    expect(fragments).toHaveLength(1);
    expect(fragments[0].bodyText).toBe("COMMIT");
  });

  test("a body string containing ';EXEC SQL' does not start a phantom second fragment", () => {
    const text = "EXEC SQL INSERT INTO T VALUES(';EXEC SQL DROP TABLE T;');";
    const fragments = scanExecFragments(text, "SQL", SQL);
    expect(fragments).toHaveLength(1);
    expect(fragments[0].bodyText).toBe(
      "INSERT INTO T VALUES(';EXEC SQL DROP TABLE T;')",
    );
  });
});

describe("rebaseDiagnostic", () => {
  test("shifts offsets by the fragment's body offset and keeps everything else", () => {
    const fragment: ExecFragment = {
      range: { start: 10, end: 40 },
      bodyText: "SELECT 1",
      bodyOffset: 19,
      terminated: true,
    };
    const rebased = rebaseDiagnostic(
      {
        severity: Severity.Error,
        message: "bad",
        code: "X1",
        startOffset: 3,
        endOffset: 7,
      },
      fragment,
    );
    expect(rebased).toEqual({
      severity: Severity.Error,
      message: "bad",
      code: "X1",
      startOffset: 22,
      endOffset: 26,
    });
  });
});

describe("rebaseToken", () => {
  test("shifts offsets by the fragment's body offset and keeps everything else", () => {
    const fragment: ExecFragment = {
      range: { start: 10, end: 40 },
      bodyText: "SELECT :HV",
      bodyOffset: 19,
      terminated: true,
    };
    const rebased = rebaseToken(
      {
        image: "HV",
        semanticsKind: SemanticsKind.Identifier,
        startOffset: 8,
        endOffset: 9,
      },
      fragment,
    );
    expect(rebased).toEqual({
      image: "HV",
      semanticsKind: SemanticsKind.Identifier,
      startOffset: 27,
      endOffset: 28,
    });
  });
});

describe("buildExecReplacement", () => {
  const token = (
    image: string,
    semanticsKind: SemanticsKind,
    startOffset: number,
  ): Token => ({
    image,
    semanticsKind,
    startOffset,
    endOffset: startOffset + image.length - 1,
  });

  test("re-embeds only identifier tokens, space-separated, before DO; END;", () => {
    const text = buildExecReplacement([
      token("VAR1", SemanticsKind.Identifier, 5),
      token("SELECT", SemanticsKind.Keyword, 12),
      token("VAR2", SemanticsKind.Identifier, 20),
    ]);
    // Identifiers appear verbatim, in token order - the contract the host's embedded-image
    // search relies on (see `PreprocessorContext.replace`).
    expect(text).toBe("VAR1 VAR2 DO; END;");
  });

  test("no identifier tokens yields just DO; END;", () => {
    const text = buildExecReplacement([
      token("SELECT", SemanticsKind.Keyword, 0),
    ]);
    expect(text).toBe("DO; END;");
  });
});
