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
  CommentRange,
  commentRangesToTokens,
  stripComments,
} from "../../src/preprocessor/comment-stripper";
import { ML_COMMENT, SL_COMMENT } from "../../src/parser/tokens";
import { URI } from "../../src/utils/uri";

/**
 * Asserts `stripComments(input)` reports exactly `expectedComments`, and that blanking is
 * correct offset-by-offset: every character inside a comment range becomes a space (except
 * a real `\n`/`\r`, which is preserved), and every character outside all comment ranges is
 * untouched. Avoids hand-counting expected whitespace in test literals.
 */
function expectBlanked(input: string, expectedComments: CommentRange[]): void {
  const { text, comments } = stripComments(input);
  expect(comments).toEqual(expectedComments);
  expect(text.length).toBe(input.length);
  for (let i = 0; i < input.length; i++) {
    const inComment = expectedComments.some(
      (c) => i >= c.startOffset && i <= c.endOffset,
    );
    if (!inComment || input[i] === "\n" || input[i] === "\r") {
      expect(text[i]).toBe(input[i]);
    } else {
      expect(text[i]).toBe(" ");
    }
  }
}

describe("stripComments - no comments", () => {
  test("leaves plain code untouched", () => {
    expectBlanked("DCL A FIXED BIN(31);\nPUT LIST(A);\n", []);
  });

  test("handles empty input", () => {
    expectBlanked("", []);
  });
});

describe("stripComments - length preservation", () => {
  const cases = [
    "// a line comment\nDCL A;",
    "/* a block\ncomment */DCL A;",
    "A/*x*/B",
    "DCL A CHAR; /* unterminated",
    "'string with '' escaped quote' // trailing comment",
  ];

  test.each(cases)("output length equals input length: %s", (input) => {
    const { text } = stripComments(input);
    expect(text.length).toBe(input.length);
  });
});

describe("stripComments - line comments", () => {
  test("blanks a // comment but keeps the trailing newline", () => {
    const input = "A;// comment\nB;";
    const start = input.indexOf("//");
    const end = input.indexOf("\n") - 1;
    expectBlanked(input, [{ startOffset: start, endOffset: end }]);
  });

  test("a // comment at EOF with no trailing newline", () => {
    const input = "A;// comment";
    const start = input.indexOf("//");
    expectBlanked(input, [{ startOffset: start, endOffset: input.length - 1 }]);
  });

  test("excludes a CRLF line ending from the comment range", () => {
    const input = "A;// comment\r\nB;";
    const start = input.indexOf("//");
    const end = input.indexOf("\r") - 1;
    expectBlanked(input, [{ startOffset: start, endOffset: end }]);
  });
});

describe("stripComments - block comments", () => {
  test("blanks a single-line block comment", () => {
    const input = "A/*comment*/B";
    const start = input.indexOf("/*");
    const end = input.indexOf("*/") + 1;
    expectBlanked(input, [{ startOffset: start, endOffset: end }]);
  });

  test("multi-line block comment: every character is blanked except newlines", () => {
    const input = "A/*line1\nline2*/B";
    const { text } = stripComments(input);
    const lines = text.split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe("A       "); // "A" + 7 blanked chars ("/*line1")
    expect(lines[1]).toMatch(/^\s*B$/); // blanked "line2*/" followed by "B"
  });

  test("an unterminated block comment extends to end of file without crashing", () => {
    const input = "A/*never closes";
    const start = input.indexOf("/*");
    expectBlanked(input, [{ startOffset: start, endOffset: input.length - 1 }]);
  });

  test("only the first */ closes the comment (no nesting)", () => {
    const input = "/* a /* nested */ looking */ X";
    const { comments } = stripComments(input);
    // The comment ends at the *first* "*/", right after "nested".
    expect(
      input.slice(comments[0].startOffset, comments[0].endOffset + 1),
    ).toBe("/* a /* nested */");
  });
});

describe("stripComments - string literals are skipped whole", () => {
  test("a comment-looking sequence inside a single-quoted string is not stripped", () => {
    expectBlanked("A = '/* not a comment */';", []);
  });

  test("a comment-looking sequence inside a double-quoted string is not stripped", () => {
    expectBlanked('A = "// not a comment";', []);
  });

  test("a doubled-quote escape inside a string does not end the string early", () => {
    const input = "A = 'can''t /* this either */'; // but this is a comment";
    const start = input.indexOf("// but");
    expectBlanked(input, [{ startOffset: start, endOffset: input.length - 1 }]);
  });
});

describe("stripComments - unterminated string literals", () => {
  test("a /* after an unterminated string on the same line is not treated as a comment", () => {
    // The quote never closes: the rest of the line counts as string content, so the
    // `/*` inside it must survive; scanning resumes normally on the next line.
    const input = "A = 'unterminated /* not a comment\nB;// real comment";
    const start = input.indexOf("// real");
    expectBlanked(input, [{ startOffset: start, endOffset: input.length - 1 }]);
  });

  test("a // after an unterminated string on the same line is not treated as a comment", () => {
    const input = "A = 'unterminated // still string\nB;";
    expectBlanked(input, []);
  });

  test("an unterminated string as the last character does not loop or crash", () => {
    expectBlanked("A = '", []);
  });
});

describe("commentRangesToTokens", () => {
  test("line comments are typed SL_COMMENT, block comments ML_COMMENT", () => {
    const input = "A;/* block */\nB;// line";
    const { comments } = stripComments(input);
    const tokens = commentRangesToTokens(
      comments,
      input,
      URI.parse("file:///comment-stripper.test.pli"),
    );
    expect(tokens).toHaveLength(2);
    expect(tokens[0].tokenType).toBe(ML_COMMENT);
    expect(tokens[0].image).toBe("/* block */");
    expect(tokens[1].tokenType).toBe(SL_COMMENT);
    expect(tokens[1].image).toBe("// line");
  });
});
