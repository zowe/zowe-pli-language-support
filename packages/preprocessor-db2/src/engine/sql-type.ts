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

import {
  Diagnostic,
  Range,
  SemanticsKind,
  Severity,
  Token,
} from "preprocessor-api";

/**
 * The `SQL TYPE IS ...` attribute the DB2 precompiler rewrites in PL/I declarations, as a
 * `scanHostText` anchor (the walk adds the leading identifier boundary).
 */
export const SQL_TYPE_ANCHOR = /SQL\s+TYPE\s+IS(?![A-Za-z0-9_#@$])/;

/** Declarations `SQL TYPE IS ... LOB FILE` needs once per procedure. */
export const SQL_LOB_FILE_DECLS = `
    DCL
      1 SQL_LOB_FILE BASED,
        2 SQL_LOB_FILE_NAME_LEN FIXED BIN(31),
        2 SQL_LOB_FILE_DATA_LEN FIXED BIN(31),
        2 SQL_LOB_FILE_OPTIONS FIXED BIN(31),
        2 SQL_LOB_FILE_NAME CHAR(256);

    DCL SQL_FILE_READ      FIXED BIN(31) VALUE(2);
    DCL SQL_FILE_CREATE    FIXED BIN(31) VALUE(8);
    DCL SQL_FILE_OVERWRITE FIXED BIN(31) VALUE(16);
    DCL SQL_FILE_APPEND    FIXED BIN(31) VALUE(32);
  `;

/**
 * Declarations `SQL TYPE IS ... LOB(n)` needs once per procedure and LOB size. Extracted by running
 * PL/I code through the real SQL preprocessor.
 */
export const sqlLobDecls = (length: number) => `
    DCL
      1 SQL_LOB${length} BASED,
        2 SQL_LOB_LEN FIXED BIN(31),
        2 SQL_LOB_BUF(10) CHAR(1);
  `;

/** What the clause resolved to - the PL/I attribute it becomes is decided by the caller. */
export type SqlTypeBody =
  /** `BLOB_LOCATOR`/`TABLE LIKE ... AS LOCATOR`/`RESULT_SET_LOCATOR VARYING`. */
  | { kind: "locator" }
  | { kind: "rowid" }
  | { kind: "binary"; varying: boolean; length: number }
  | { kind: "lobFile" }
  | { kind: "lob"; length: number };

export interface SqlTypeClause {
  /** Offset right after the last consumed token - the clause's replacement extent ends here. */
  end: number;
  /** Every consumed keyword/number, classified. */
  tokens: Token[];
  diagnostics: Diagnostic[];
  /** `null` when the type name was not recognized (already diagnosed). */
  body: SqlTypeBody | null;
}

interface ClauseToken {
  image: string;
  upper: string;
  range: Range;
  kind: "word" | "number" | "punct";
}

/**
 * The IBM messages the real precompiler raises for a malformed clause.
 */
const MESSAGES = {
  IBM3754I: (typename: string) =>
    `SQL TYPE IS ${typename} must be followed by an opening left parenthesis.`,
  IBM3755I: (typename: string) =>
    `SQL TYPE IS ${typename} must have an integer specifying its length after the opening left parenthesis.`,
  IBM3756I: (typename: string) =>
    `SQL TYPE IS ${typename} must have a closing right parenthesis after the integer specifying its length.`,
  IBM3757I: (typename: string) =>
    `SQL TYPE IS XML AS ${typename} must be followed by an opening left parenthesis.`,
  IBM3758I: (typename: string) =>
    `SQL TYPE IS XML AS ${typename} must have an integer specifying its length after the opening left parenthesis.`,
  IBM3759I: (typename: string) =>
    `SQL TYPE IS XML AS ${typename} must have a closing right parenthesis after the integer specifying its length.`,
  IBM3782I: () => "SQL TYPE IS XML must be followed by the keyword AS.",
  IBM3783I: () => "SQL TYPE IS XML AS must be followed by a valid type name.",
  IBM3784I: () => "SQL TYPE IS TABLE must be followed by the keyword LIKE.",
  IBM3785I: () => "SQL TYPE IS TABLE LIKE must be followed by a table name.",
  IBM3786I: () =>
    "SQL TYPE IS TABLE LIKE must be followed by the keyword AS after the table name.",
  IBM3787I: () =>
    "SQL TYPE IS TABLE must be followed by the keyword LOCATOR after the table name and the AS keyword.",
  IBM3788I: () => "SQL TYPE IS must be followed by a valid type name.",
} as const;

type MessageCode = keyof typeof MESSAGES;

const LOB = new Set(["BLOB", "CLOB", "DBCLOB"]);
const LOB_LOCATOR = new Set(["BLOB_LOCATOR", "CLOB_LOCATOR", "DBCLOB_LOCATOR"]);
const LOB_FILE = new Set(["BLOB_FILE", "CLOB_FILE", "DBCLOB_FILE"]);
const BINARY = new Set(["BINARY", "BIN"]);
const CHARACTER = new Set(["CHARACTER", "CHAR"]);
const VARYING = new Set(["VARYING", "VAR"]);
const SIZE_UNITS: Record<string, number> = {
  K: 1024,
  M: 1024 ** 2,
  G: 1024 ** 3,
};

const WHITESPACE = /\s*/y;
const WORD = /[A-Za-z_#@$][A-Za-z0-9_#@$]*/y;
const NUMBER = /\d+/y;

/**
 * Parses the `SQL TYPE IS ...` clause starting at `offset` (which must be where the
 * anchor matched).
 */
export function parseSqlTypeClause(
  text: string,
  offset: number,
): SqlTypeClause {
  const parser = new ClauseParser(text, offset);
  return parser.parse();
}

class ClauseParser {
  private readonly lookahead: ClauseToken[] = [];
  private position: number;
  private last: ClauseToken | undefined;
  private inError = false;
  private readonly tokens: Token[] = [];
  private readonly diagnostics: Diagnostic[] = [];

  constructor(
    private readonly text: string,
    offset: number,
  ) {
    this.position = offset;
  }

  parse(): SqlTypeClause {
    // The anchor guarantees these three.
    this.consume();
    this.consume();
    this.consume();
    let isXml = false;
    if (this.is(0, "XML")) {
      this.consume();
      this.expect((t) => t.upper === "AS", "IBM3782I");
      isXml = true;
    }
    const body = this.parseBody(isXml);
    return {
      end: this.last!.range.end,
      tokens: this.tokens,
      diagnostics: this.diagnostics,
      body,
    };
  }

  private parseBody(isXml: boolean): SqlTypeBody | null {
    const word = this.peek(0)?.upper ?? "";
    const isLargeNext = this.is(1, "LARGE");
    if (LOB.has(word)) {
      const typename = this.consume()!.upper;
      return { kind: "lob", length: this.parseSize(isXml, typename) };
    }
    if (word === "VARBINARY" || (BINARY.has(word) && !isLargeNext)) {
      return this.parseBinary(isXml);
    }
    if (BINARY.has(word) || CHARACTER.has(word)) {
      const typename = CHARACTER.has(word) ? "CLOB" : "BLOB";
      this.consume();
      this.expect((t) => t.upper === "LARGE");
      this.expect((t) => t.upper === "OBJECT");
      return { kind: "lob", length: this.parseSize(isXml, typename) };
    }
    if (!isXml && LOB_LOCATOR.has(word)) {
      this.consume();
      return { kind: "locator" };
    }
    if (LOB_FILE.has(word)) {
      this.consume();
      return { kind: "lobFile" };
    }
    if (!isXml && word === "ROWID") {
      this.consume();
      return { kind: "rowid" };
    }
    if (!isXml && word === "TABLE") {
      this.consume();
      this.expect((t) => t.upper === "LIKE", "IBM3784I");
      this.expect((t) => t.kind === "word", "IBM3785I");
      this.expect((t) => t.upper === "AS", "IBM3786I");
      this.expect((t) => t.upper === "LOCATOR", "IBM3787I");
      return { kind: "locator" };
    }
    if (!isXml && word === "RESULT_SET_LOCATOR") {
      this.consume();
      this.expect((t) => VARYING.has(t.upper));
      return { kind: "locator" };
    }
    this.report(isXml ? "IBM3783I" : "IBM3788I", this.peek(0));
    return null;
  }

  private parseBinary(isXml: boolean): SqlTypeBody {
    let varying: boolean;
    let typename: string;
    if (BINARY.has(this.peek(0)!.upper)) {
      this.consume();
      if (this.peek(0) && VARYING.has(this.peek(0)!.upper)) {
        this.consume();
        varying = true;
        typename = "BINARY VARYING";
      } else {
        varying = false;
        typename = "BINARY";
      }
    } else {
      this.consume();
      varying = true;
      typename = "VARBINARY";
    }
    return { kind: "binary", varying, length: this.parseSize(isXml, typename) };
  }

  /** `( n [K|M|G] )` - a missing length counts as 0, like the PL/I parser's `null`. */
  private parseSize(isXml: boolean, typename: string): number {
    this.expect(
      (t) => t.image === "(",
      isXml ? "IBM3757I" : "IBM3754I",
      typename,
    );
    const length = this.expect(
      (t) => t.kind === "number",
      isXml ? "IBM3758I" : "IBM3755I",
      typename,
    );
    let value = length ? parseInt(length.image, 10) : 0;
    const unit = this.peek(0)?.upper;
    if (unit !== undefined && unit in SIZE_UNITS) {
      this.consume();
      value *= SIZE_UNITS[unit];
    }
    this.expect(
      (t) => t.image === ")",
      isXml ? "IBM3759I" : "IBM3756I",
      typename,
    );
    return value;
  }

  private is(ahead: number, upper: string): boolean {
    return this.peek(ahead)?.upper === upper;
  }

  /**
   * Consumes the next token when `predicate` accepts it, or diagnoses it once, like the PL/I
   * parser.
   */
  private expect(
    predicate: (token: ClauseToken) => boolean,
    code?: MessageCode,
    typename?: string,
  ): ClauseToken | undefined {
    const token = this.peek(0);
    if (token && predicate(token)) {
      return this.consume();
    }
    if (!this.inError) {
      if (code) {
        this.report(code, token, typename);
      } else {
        this.push({
          message: `Unexpected ${token ? `token '${token.image}'` : "end of file"}.`,
          code: "syntax",
          severity: Severity.Severe,
          range: (token ?? this.last)?.range ?? { start: 0, end: 0 },
        });
      }
    }
    this.inError = true;
    return undefined;
  }

  private report(
    code: MessageCode,
    token: ClauseToken | undefined,
    typename = "",
  ): void {
    if (this.inError) {
      return;
    }
    this.push({
      message: MESSAGES[code](typename),
      code: `${code}S`,
      severity: Severity.Severe,
      range: (token ?? this.last)?.range ?? { start: 0, end: 0 },
    });
    this.inError = true;
  }

  private push(diagnostic: Diagnostic): void {
    this.diagnostics.push(diagnostic);
  }

  private consume(): ClauseToken | undefined {
    const token = this.peek(0);
    if (!token) {
      return undefined;
    }
    this.lookahead.shift();
    this.last = token;
    this.inError = false;
    if (token.kind !== "punct") {
      this.tokens.push({
        image: token.image,
        range: token.range,
        semanticsKind:
          token.kind === "number"
            ? SemanticsKind.Number
            : SemanticsKind.Keyword,
      });
    }
    return token;
  }

  private peek(ahead: number): ClauseToken | undefined {
    while (this.lookahead.length <= ahead) {
      const token = this.lex();
      if (!token) {
        return undefined;
      }
      this.lookahead.push(token);
    }
    return this.lookahead[ahead];
  }

  private lex(): ClauseToken | undefined {
    WHITESPACE.lastIndex = this.position;
    WHITESPACE.exec(this.text);
    const start = WHITESPACE.lastIndex;
    if (start >= this.text.length) {
      return undefined;
    }
    let kind: ClauseToken["kind"];
    let end: number;
    WORD.lastIndex = start;
    NUMBER.lastIndex = start;
    if (WORD.exec(this.text)) {
      kind = "word";
      end = WORD.lastIndex;
    } else if (NUMBER.exec(this.text)) {
      kind = "number";
      end = NUMBER.lastIndex;
    } else {
      kind = "punct";
      end = start + 1;
    }
    this.position = end;
    const image = this.text.slice(start, end);
    return { image, upper: image.toUpperCase(), range: { start, end }, kind };
  }
}
