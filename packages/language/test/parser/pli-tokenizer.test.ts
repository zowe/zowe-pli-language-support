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
import { scanExecFragments } from "preprocessor-api";
import { tokenize } from "../../src/parser/tokenizer";
import * as tokens from "../../src/parser/tokens";

function tokenByImage(text: string, image: string): tokens.Token {
  const result = tokenize(text, undefined);
  const token = result.tokens.find((t) => t.image === image);
  expect(token, `expected a token with image '${image}'`).toBeDefined();
  return token!;
}

function execFragment(text: string): tokens.Token {
  const result = tokenize(text, undefined);
  const fragment = result.tokens.find(
    (t) => t.tokenTypeIdx === tokens.ExecFragment.tokenTypeIdx,
  );
  expect(fragment, "expected an ExecFragment token").toBeDefined();
  return fragment!;
}

describe("startsNewLine", () => {
  test("first token of the file without a leading line break", () => {
    // No line break precedes the first token (there is no previous token at all).
    expect(tokenByImage("A;", "A").startsNewLine).toBe(false);
  });

  test("first token of the file after a leading line break", () => {
    expect(tokenByImage("\nA;", "A").startsNewLine).toBe(true);
  });

  test("token after a line-leading block comment is marked as starting a new line", () => {
    // The line break between `A;` and `B` must survive the comment in between:
    // `performRecovery` (preprocessor-parser) relies on it on the `%INCLUDE` path,
    // which tokenizes without comment stripping.
    const result = tokenize("A;\n/* comment */ B;", undefined);
    const b = result.tokens.find((t) => t.image === "B")!;
    expect(b.startsNewLine).toBe(true);
    // The comment token itself takes the pre-comment newline state.
    expect(result.comments).toHaveLength(1);
    expect(result.comments[0].startsNewLine).toBe(true);
  });

  test("token after an inline same-line block comment does not start a new line", () => {
    const result = tokenize("A; /* comment */ B;", undefined);
    const b = result.tokens.find((t) => t.image === "B")!;
    expect(b.startsNewLine).toBe(false);
    expect(result.comments[0].startsNewLine).toBe(false);
  });

  test("a newline inside a block comment carries forward to the next token", () => {
    const result = tokenize("A; /* multi\nline */ B;", undefined);
    const b = result.tokens.find((t) => t.image === "B")!;
    expect(b.startsNewLine).toBe(true);
    // The comment itself started on the same line as `A;`.
    expect(result.comments[0].startsNewLine).toBe(false);
  });

  test("token after a line-leading line comment is marked as starting a new line", () => {
    const result = tokenize("A;\n// comment\nB;", undefined);
    const b = result.tokens.find((t) => t.image === "B")!;
    expect(b.startsNewLine).toBe(true);
  });

  test("multi-line ExecFragment takes the pre-fragment newline state", () => {
    // The fragment is separated from `EXEC` by a single space - no line break -
    // even though the fragment image itself spans multiple lines.
    const text = "A;\nEXEC SQL SELECT 1\n  FROM T;\nB;";
    const result = tokenize(text, undefined);
    const exec = result.tokens.find(
      (t) => t.tokenTypeIdx === tokens.EXEC.tokenTypeIdx,
    )!;
    const fragment = result.tokens.find(
      (t) => t.tokenTypeIdx === tokens.ExecFragment.tokenTypeIdx,
    )!;
    expect(exec.startsNewLine).toBe(true);
    expect(fragment.image).toBe("SQL SELECT 1\n  FROM T");
    expect(fragment.startsNewLine).toBe(false);
  });

  test("newlines inside an ExecFragment do not leak to the following token", () => {
    const text = "EXEC SQL SELECT 1\n  FROM T; B;";
    const result = tokenize(text, undefined);
    const fragmentIndex = result.tokens.findIndex(
      (t) => t.tokenTypeIdx === tokens.ExecFragment.tokenTypeIdx,
    );
    // The `;` terminating the EXEC statement follows the fragment on the same line.
    const semicolon = result.tokens[fragmentIndex + 1];
    expect(semicolon.image).toBe(";");
    expect(semicolon.startsNewLine).toBe(false);
    const b = result.tokens.find((t) => t.image === "B")!;
    expect(b.startsNewLine).toBe(false);
  });
});

describe("ExecFragment extent", () => {
  test("a semicolon inside a quoted string does not end the fragment", () => {
    const fragment = execFragment("EXEC SQL SELECT ';' FROM T;");
    expect(fragment.image).toBe("SQL SELECT ';' FROM T");
  });

  test("a doubled quote is an escaped quote, not the end of the string", () => {
    const fragment = execFragment(
      "EXEC SQL INSERT INTO T VALUES('it''s;fine');",
    );
    expect(fragment.image).toBe("SQL INSERT INTO T VALUES('it''s;fine')");
  });

  test("a body string containing ';EXEC SQL' does not produce a phantom second EXEC statement", () => {
    const text = "EXEC SQL INSERT INTO T VALUES(';EXEC SQL DROP TABLE T;');";
    const result = tokenize(text, undefined);
    const execTokens = result.tokens.filter(
      (t) => t.tokenTypeIdx === tokens.EXEC.tokenTypeIdx,
    );
    const fragments = result.tokens.filter(
      (t) => t.tokenTypeIdx === tokens.ExecFragment.tokenTypeIdx,
    );
    expect(execTokens).toHaveLength(1);
    expect(fragments).toHaveLength(1);
    expect(fragments[0].image).toBe(
      "SQL INSERT INTO T VALUES(';EXEC SQL DROP TABLE T;')",
    );
  });

  test("an empty statement body (EXEC SQL;) still yields a fragment", () => {
    const result = tokenize("EXEC SQL;", undefined);
    expect(result.tokens.map((t) => [t.tokenType.name, t.image])).toStrictEqual(
      [
        ["EXEC", "EXEC"],
        ["ExecFragment", "SQL"],
        [";", ";"],
      ],
    );
  });

  test("EXEC SQL at EOF yields a fragment covering the prefix", () => {
    const fragment = execFragment("EXEC SQL");
    expect(fragment.image).toBe("SQL");
  });

  test("the tokenizer extent matches the authoritative scanExecFragments extent", () => {
    // `exec-phase`'s `findFragmentEdit` matches the preprocessor's replacement edit
    // (computed by `scanExecFragments`) against the ExecFragment token's offsets, so
    // the two scans must agree on the statement extent - in particular for bodies
    // containing quoted semicolons or unterminated strings.
    const delimiters = { quotes: ["'", '"'], lineComments: ["--"] };
    const cases = [
      "EXEC SQL SELECT ';' FROM T;",
      'EXEC SQL SELECT ";" FROM T;',
      "EXEC SQL INSERT INTO T VALUES('it''s;fine');",
      "EXEC SQL INSERT INTO T VALUES(';EXEC SQL X;');",
      "EXEC SQL SELECT 'unterminated\nFROM T;",
      "EXEC SQL COMMIT;",
      "EXEC SQL;",
    ];
    for (const text of cases) {
      const result = tokenize(text, undefined);
      const fragment = result.tokens.find(
        (t) => t.tokenTypeIdx === tokens.ExecFragment.tokenTypeIdx,
      )!;
      const scanned = scanExecFragments(text, "SQL", delimiters);
      expect(scanned, text).toHaveLength(1);
      // The scanned range ends right after the terminating `;`; the fragment token
      // ends right before it (the `;` is its own token on the tokenizer side).
      expect(fragment.endOffset + 1, text).toBe(scanned[0].range.end - 1);
      expect(text[fragment.endOffset + 1], text).toBe(";");
    }
  });
});
