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
  Delimiters,
  rebaseDiagnostic,
  rebaseToken,
  scanExecFragments,
  scanHostText,
} from "../src/context-utils";
import { ExecFragment, Severity, SemanticsKind } from "../src/types";

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

  test("EXEC glued to a PL/I identifier character is an identifier, not a statement", () => {
    // `$`, `#` and `@` are identifier characters in PL/I - the host tokenizer lexes
    // `$EXEC` as one identifier, so the scan must not see a statement there either.
    expect(scanExecFragments("$EXEC SQL X; #EXEC SQL Y;", "SQL", SQL)).toEqual(
      [],
    );
  });

  test("an own-prefix statement inside another preprocessor's statement is not a fragment", () => {
    // The host tokenizer consumes any `EXEC <word> ...;` as one opaque token.
    const text = "EXEC CICS X EXEC SQL Y; EXEC SQL Z;";
    expect(scanExecFragments(text, "SQL", SQL).map((f) => f.bodyText)).toEqual([
      "Z",
    ]);
  });
});

describe("scanHostText", () => {
  const anchor = /DFHRESP\s*\(\s*(\w+)\s*\)/;

  test("records secondary anchors between statements, never inside any EXEC statement", () => {
    const text =
      "X = DFHRESP(NORMAL); EXEC CICS Y FROM(DFHRESP(NORMAL)); EXEC SQL Z DFHRESP(NOTFND); DFHRESP(NOTFND);";
    const scan = scanHostText(text, "CICS", CICS, anchor);
    expect(scan.anchors).toEqual([
      text.indexOf("DFHRESP(NORMAL)"),
      text.lastIndexOf("DFHRESP(NOTFND)"),
    ]);
    expect(scan.fragments.map((f) => f.bodyText)).toEqual([
      "Y FROM(DFHRESP(NORMAL))",
    ]);
  });

  test("anchors inside host string literals are ignored", () => {
    const text = "S = 'DFHRESP(NORMAL)'; X = DFHRESP(NORMAL);";
    const scan = scanHostText(text, "CICS", CICS, anchor);
    expect(scan.anchors).toEqual([text.lastIndexOf("DFHRESP")]);
  });

  test("anchors are matched case-insensitively and at identifier boundaries only", () => {
    const text = "X = dfhresp(normal); Y = MYDFHRESP(NORMAL);";
    const scan = scanHostText(text, "CICS", CICS, anchor);
    expect(scan.anchors).toEqual([text.indexOf("dfhresp")]);
  });

  test("a walk without an anchor still yields fragments", () => {
    const text = "A: PROC; EXEC SQL X; END;";
    const scan = scanHostText(text, "SQL", SQL);
    expect(scan.anchors).toEqual([]);
    expect(scan.fragments).toHaveLength(1);
  });

  test("an EXEC mention inside a multi-line host string is not a statement", () => {
    // The host lexer's strings span lines - only the embedded grammars end them at a
    // line break.
    const text = "X = 'a\nEXEC SQL NOPE;\nb'; EXEC SQL COMMIT;";
    const scan = scanHostText(text, "SQL", SQL);
    expect(scan.fragments.map((f) => f.bodyText)).toEqual(["COMMIT"]);
  });

  test("anchors inside multi-line host strings are ignored", () => {
    const text = "S = 'a\nDFHRESP(NORMAL)\nb'; X = DFHRESP(NORMAL);";
    const scan = scanHostText(text, "CICS", CICS, anchor);
    expect(scan.anchors).toEqual([text.lastIndexOf("DFHRESP")]);
  });

  test("a host string never closed covers the rest of its opening line only", () => {
    // Like the host lexer, which refuses to lex an unterminated string and continues on
    // the next line - the statement below must still be found.
    const text = "X = 'oops;\nEXEC SQL COMMIT;";
    const scan = scanHostText(text, "SQL", SQL);
    expect(scan.fragments.map((f) => f.bodyText)).toEqual(["COMMIT"]);
  });

  test("a backslash escape does not end a multi-line host string", () => {
    const text = "X = 'a\\'b\nc'; EXEC SQL COMMIT;";
    const scan = scanHostText(text, "SQL", SQL);
    expect(scan.fragments.map((f) => f.bodyText)).toEqual(["COMMIT"]);
  });

  test("a foreign unterminated statement swallows the rest of the text", () => {
    const text = "EXEC CICS X EXEC SQL Y;";
    const scan = scanHostText(text, "SQL", SQL);
    expect(scan.fragments).toEqual([]);
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
        range: { start: 3, end: 7 },
      },
      fragment,
    );
    expect(rebased).toEqual({
      severity: Severity.Error,
      message: "bad",
      code: "X1",
      range: { start: 22, end: 26 },
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
        range: { start: 8, end: 10 },
      },
      fragment,
    );
    expect(rebased).toEqual({
      image: "HV",
      semanticsKind: SemanticsKind.Identifier,
      range: { start: 27, end: 29 },
    });
  });
});
