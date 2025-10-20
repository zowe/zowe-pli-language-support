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

import { TokenType } from "chevrotain";
import { URI } from "../utils/uri";
import * as tokens from "./tokens";
import {
  CompilerOptions,
  getDefaultCompilerOptions,
} from "../preprocessor/compiler-options/options";
import { diagnostic, Diagnostic } from "../language-server/types";
import { PLICodes } from "../validation/pli-codes";
import { NOT_CHARACTER } from "../utils/const";

interface TwoCharToken {
  char: string;
  tokenType: TokenType;
}

// Note: *, **, *=, **=, /, /=, |, || and ||= are handled separately
const TwoCharTokens: Record<string, TwoCharToken[]> = {
  "=": [{ char: ">", tokenType: tokens.EqualsGreaterThan }],
  ">": [{ char: "=", tokenType: tokens.GreaterThanEquals }],
  "<": [
    { char: "=", tokenType: tokens.LessThanEquals },
    { char: ">", tokenType: tokens.LessThanGreaterThan },
  ],
  "&": [{ char: "=", tokenType: tokens.AmpersandEquals }],
  "^": [
    { char: "=", tokenType: tokens.NotEquals },
    { char: "<", tokenType: tokens.NotLessThan },
    { char: ">", tokenType: tokens.NotGreaterThan },
  ],
  "+": [{ char: "=", tokenType: tokens.PlusEquals }],
  "-": [
    { char: "=", tokenType: tokens.MinusEquals },
    { char: ">", tokenType: tokens.MinusGreaterThan },
  ],
};

interface KeywordToken {
  image: string;
  kind: TokenType;
}

// FNV Hash implementation
const FNV_OFFSET_BASIS = 0x00000100000001b3n;
const FNV_PRIME = 0xcbf29ce484222325n;

function fnvHash(str: string): bigint {
  let hash = FNV_OFFSET_BASIS;
  for (let i = 0; i < str.length; i++) {
    hash ^= BigInt(str.charCodeAt(i));
    hash *= FNV_PRIME;
  }
  return hash;
}

function generateKeywords(): Map<bigint, KeywordToken> {
  const keywords = new Map<bigint, KeywordToken>();
  for (const [image, kind] of tokens.keywordMap) {
    const hash = fnvHash(image);
    if (keywords.has(hash)) {
      const existing = keywords.get(hash)!;
      throw new Error(`FNV hash collision: ${image}, ${existing.image}`);
    }
    keywords.set(hash, { image, kind });
  }
  return keywords;
}

const Keywords = generateKeywords();
const SQL = {
  image: "SQL",
  hash: fnvHash("SQL"),
};
const CICS = {
  image: "CICS",
  hash: fnvHash("CICS"),
};

class TokenizerContext {
  public tokens: tokens.Token[] = [];
  public char: string = "";
  public input: string;
  public length: number;
  public index: number = 0;
  public line: number = 0;
  public column: number = 0;
  public uri: URI | undefined;

  private storedIndex: number = 0;
  private storedLine: number = 0;
  private storedColumn: number = 0;

  constructor(input: string, uri: URI | undefined) {
    this.input = input;
    this.length = input.length;
    this.uri = uri;
  }

  store() {
    this.storedIndex = this.index;
    this.storedLine = this.line;
    this.storedColumn = this.column;
  }

  advance(n: number, newLines: boolean): void {
    if (newLines) {
      const end = this.index + n;
      for (let i = this.index; i < end; i++) {
        if (this.input[i] === "\n") {
          this.line++;
          this.column = 0;
        } else {
          this.column++;
        }
      }
    } else {
      this.column += n;
    }
    this.index += n;
  }

  advanceWhitespace(): void {
    while (this.index < this.length) {
      const charCode = this.input.charCodeAt(this.index);
      if (isWhitespace(charCode)) {
        this.index++;
        if (charCode === lineFeed) {
          this.line++;
          this.column = 0;
        } else {
          this.column++;
        }
      } else {
        break;
      }
    }
  }

  createTokenInstance(tokenType: TokenType): tokens.Token {
    const image = this.input.substring(this.storedIndex, this.index);
    return tokens.createTokenInstance(
      image,
      image,
      tokenType,
      this.storedIndex,
      this.storedLine,
      this.storedColumn,
      this.index - 1,
      this.line,
      this.column - 1,
      this.uri,
    );
  }

  createTokenInstanceWithImage(
    image: string,
    originalImage: string,
    tokenType: TokenType,
  ): tokens.Token {
    return tokens.createTokenInstance(
      image,
      originalImage,
      tokenType,
      this.storedIndex,
      this.storedLine,
      this.storedColumn,
      this.index - 1,
      this.line,
      this.column - 1,
      this.uri,
    );
  }
}

type TokenizeFunc = (context: TokenizerContext) => tokens.Token | undefined;

function tokenizeIdentifier(
  context: TokenizerContext,
): tokens.Token | undefined {
  const start = context.index;
  let hash = FNV_OFFSET_BASIS;
  let i = context.index;
  let charCode: number;
  while (i < context.length) {
    charCode = context.input.charCodeAt(i);
    if (!isIdChar(charCode)) {
      break;
    }
    if (charCode >= 97 && charCode <= 122) {
      // Lowercase character, must be uppercased
      charCode &= ~0x20;
    }
    hash ^= BigInt(charCode);
    hash *= FNV_PRIME;
    i++;
  }
  const originalImage = context.input.substring(start, i);
  const image = originalImage.toUpperCase();
  const previousToken = context.tokens[context.tokens.length - 1];
  // Specific handling for ExecFragment (likely EXEC SQL or EXEC CICS)
  if (
    previousToken?.tokenTypeIdx === tokens.EXEC.tokenTypeIdx &&
    ((hash === SQL.hash && image === SQL.image) ||
      (hash === CICS.hash && image === CICS.image))
  ) {
    while (i < context.length && context.input[i] !== ";") {
      i++;
    }
    context.advance(i - start, true);
    return context.createTokenInstance(tokens.ExecFragment);
  }
  let tokenType = tokens.ID;
  const keyword = Keywords.get(hash);
  if (keyword && keyword.image === image) {
    tokenType = keyword.kind;
  }
  context.advance(i - start, false);
  return context.createTokenInstanceWithImage(image, originalImage, tokenType);
}

const stringRegex = tokens.STRING_TERM.PATTERN as RegExp;
const numberRegex = tokens.NUMBER.PATTERN as RegExp;

function tokenizeRegex(tokenType: TokenType, regex: RegExp): TokenizeFunc {
  return function (context: TokenizerContext): tokens.Token | undefined {
    const start = context.index;
    regex.lastIndex = start;
    const match = regex.exec(context.input);
    if (match) {
      context.advance(match[0].length, false);
      return context.createTokenInstance(tokenType);
    } else {
      return undefined;
    }
  };
}

const tokenizeString = tokenizeRegex(tokens.STRING_TERM, stringRegex);
const tokenizeNumber = tokenizeRegex(tokens.NUMBER, numberRegex);

function tokenizeOrSymbol(context: TokenizerContext): tokens.Token | undefined {
  context.store();
  let nextChar = context.input[context.index + 1];
  if (orSymbols.includes(nextChar)) {
    nextChar = context.input[context.index + 2];
    if (nextChar === "=") {
      context.advance(3, false);
      return context.createTokenInstance(tokens.PipePipeEquals);
    }
    context.advance(2, false);
    return context.createTokenInstance(tokens.PipePipe);
  } else if (nextChar === "=") {
    context.advance(2, false);
    return context.createTokenInstance(tokens.PipeEquals);
  }
  context.index++;
  context.advance(1, false);
  return context.createTokenInstance(tokens.Pipe);
}

function tokenizeAsterisk(context: TokenizerContext): tokens.Token | undefined {
  let nextChar = context.input[context.index + 1];
  if (nextChar === "*") {
    nextChar = context.input[context.index + 2];
    if (nextChar === "=") {
      context.advance(3, false);
      return context.createTokenInstance(tokens.StarStarEquals);
    }
    context.advance(2, false);
    return context.createTokenInstance(tokens.StarStar);
  }
  context.advance(1, false);
  return context.createTokenInstance(tokens.Star);
}

function tokenizeSlash(context: TokenizerContext): tokens.Token | undefined {
  if (context.index + 1 < context.length) {
    const nextChar = context.input[context.index + 1];

    if (nextChar === "*") {
      // Block comment
      let line = context.line;
      let column = context.column + 2;
      let i = context.index + 2;
      while (i < context.length - 1) {
        if (context.input[i] === "*" && context.input[i + 1] === "/") {
          i += 2;
          column += 2;
          break;
        } else if (context.input[i] === "\n") {
          line++;
          column = 0;
        } else {
          column++;
        }
        i++;
      }
      context.index = i;
      context.line = line;
      context.column = column;
      return undefined;
    } else if (nextChar === "/") {
      // Line comment
      let i = context.index + 2;
      while (i < context.length - 1) {
        i++;
        if (context.input[i] === "\n") {
          // Skip the newline character as well
          i++;
          context.column = 0;
          context.line++;
          break;
        }
      }
      context.index = i;
      return undefined;
    } else if (nextChar === "=") {
      context.advance(2, false);
      return context.createTokenInstance(tokens.SlashEquals);
    }
  }

  context.advance(1, false);
  return context.createTokenInstance(tokens.Slash);
}

function generateDoubleCharFunc(
  tokenType: TokenType,
  others: TwoCharToken[],
): TokenizeFunc {
  return function (context: TokenizerContext): tokens.Token | undefined {
    if (context.index + 1 < context.length) {
      const nextChar = context.input[context.index + 1];

      for (const follow of others) {
        if (nextChar === follow.char) {
          context.advance(2, false);
          return context.createTokenInstance(follow.tokenType);
        }
      }
    }
    context.advance(1, false);
    return context.createTokenInstance(tokenType);
  };
}

function generateSingleCharFunc(tokenType: TokenType): TokenizeFunc {
  return function (context: TokenizerContext): tokens.Token | undefined {
    context.advance(1, false);
    return context.createTokenInstance(tokenType);
  };
}

function tokenizeWhitespace(
  context: TokenizerContext,
): tokens.Token | undefined {
  context.advanceWhitespace();
  return undefined;
}

function tokenizeIncludeAlt(
  context: TokenizerContext,
): tokens.Token | undefined {
  if (!includeAlt) {
    return undefined;
  }
  for (let i = 0; i < includeAlt.length; i++) {
    let charCode = context.input.charCodeAt(context.index + i);
    if (charCode >= 97 && charCode <= 122) {
      // Lowercase character, must be uppercased
      charCode &= ~0x20;
    }
    if (charCode !== includeAlt.charCodeAt(i)) {
      return undefined;
    }
  }
  context.advance(includeAlt.length, false);
  return context.createTokenInstanceWithImage(
    includeAlt,
    includeAlt,
    tokens.INCLUDE_ALT,
  );
}

// Utility functions
function isIdChar(char: number): boolean {
  return (
    // A-Z
    (char >= 65 && char <= 90) ||
    // a-z
    (char >= 97 && char <= 122) ||
    // 0-9
    (char >= 48 && char <= 57) ||
    // _
    char === 95 ||
    // @
    char === 64 ||
    // $
    char === 36 ||
    // #
    char === 35
  );
}

const space = " ".charCodeAt(0);
const tab = "\t".charCodeAt(0);
const lineFeed = "\n".charCodeAt(0);
const carriageReturn = "\r".charCodeAt(0);
const formFeed = "\f".charCodeAt(0);
const verticalTab = "\v".charCodeAt(0);

function isWhitespace(char: number): boolean {
  return (
    char === space ||
    char === tab ||
    char === lineFeed ||
    char === carriageReturn ||
    char === formFeed ||
    char === verticalTab
  );
}

// Function map
const funcs = new Map<string, TokenizeFunc>();
const defaultOr = "|";
const defaultNot = NOT_CHARACTER + "^";
let orSymbols = defaultOr;
let notSymbols = defaultNot;
let includeAlt: string | undefined = undefined;

export function initLexer(compilerOptions: CompilerOptions): void {
  orSymbols = compilerOptions.or ?? defaultOr;
  notSymbols = compilerOptions.not ?? defaultNot;
  includeAlt = compilerOptions.pp?.ppInclude?.value;
  funcs.clear();
  funcs.set("/", tokenizeSlash);
  funcs.set('"', tokenizeString);
  funcs.set("'", tokenizeString);
  funcs.set("*", tokenizeAsterisk);
  funcs.set("=", generateDoubleCharFunc(tokens.Equals, TwoCharTokens["="]));
  funcs.set("+", generateDoubleCharFunc(tokens.Plus, TwoCharTokens["+"]));
  funcs.set("-", generateDoubleCharFunc(tokens.Minus, TwoCharTokens["-"]));
  funcs.set("&", generateDoubleCharFunc(tokens.Ampersand, TwoCharTokens["&"]));
  funcs.set("<", generateDoubleCharFunc(tokens.LessThan, TwoCharTokens["<"]));
  funcs.set(
    ">",
    generateDoubleCharFunc(tokens.GreaterThan, TwoCharTokens[">"]),
  );
  funcs.set("(", generateSingleCharFunc(tokens.OpenParen));
  funcs.set(")", generateSingleCharFunc(tokens.CloseParen));
  funcs.set(";", generateSingleCharFunc(tokens.Semicolon));
  funcs.set(":", generateSingleCharFunc(tokens.Colon));
  funcs.set(",", generateSingleCharFunc(tokens.Comma));
  funcs.set("%", generateSingleCharFunc(tokens.Percent));
  funcs.set(".", generateSingleCharFunc(tokens.Dot));

  // Whitespace characters
  funcs.set(" ", tokenizeWhitespace);
  funcs.set("\t", tokenizeWhitespace);
  funcs.set("\r", tokenizeWhitespace);
  funcs.set("\n", tokenizeWhitespace);
  funcs.set("\f", tokenizeWhitespace);
  funcs.set("\v", tokenizeWhitespace);

  // Numbers
  for (let i = 0; i <= 9; i++) {
    funcs.set(i.toString(), tokenizeNumber);
  }

  // Letters
  for (let i = 97; i <= 122; i++) {
    // a-z
    funcs.set(String.fromCharCode(i), tokenizeIdentifier);
  }
  for (let i = 65; i <= 90; i++) {
    // A-Z
    funcs.set(String.fromCharCode(i), tokenizeIdentifier);
  }
  funcs.set("_", tokenizeIdentifier);
  funcs.set("@", tokenizeIdentifier);
  funcs.set("$", tokenizeIdentifier);
  funcs.set("#", tokenizeIdentifier);

  for (const orSymbolChar of orSymbols.split("")) {
    funcs.set(orSymbolChar, tokenizeOrSymbol);
  }
  for (const notSymbolChar of notSymbols.split("")) {
    funcs.set(
      notSymbolChar,
      generateDoubleCharFunc(tokens.Not, TwoCharTokens["^"]),
    );
  }
}

export interface TokenizationResult {
  tokens: tokens.Token[];
  diagnostics: Diagnostic[];
}

export function tokenize(
  input: string,
  uri: URI | undefined,
): TokenizationResult {
  const context = new TokenizerContext(input, uri);
  const diagnostics: Diagnostic[] = [];
  let previous: tokens.Token | undefined = undefined;

  while (context.index < context.length) {
    const char = input[context.index];
    context.char = char;
    context.store();

    // VERY special case for include alt
    const includeAltToken = tokenizeIncludeAlt(context);
    if (includeAltToken) {
      context.tokens.push(includeAltToken);
      previous = includeAltToken;
      continue;
    }

    const fn = funcs.get(char);
    if (fn) {
      const token = fn(context);
      if (token !== undefined) {
        if (previous && previous.endOffset + 1 === token.startOffset) {
          previous.immediateFollow = true;
        }
        context.tokens.push(token);
        previous = token;
      }
    } else {
      if (uri) {
        const issue = diagnostic(
          PLICodes.Error.IBM3550I.severity,
          PLICodes.Error.IBM3550I.message(char),
          {
            start: context.index,
            end: context.index + 1,
          },
          uri.toString(),
        );
        issue.code = PLICodes.Error.IBM3550I.fullCode;
        diagnostics.push(issue);
      }
      context.index++;
    }
  }

  return {
    tokens: context.tokens,
    diagnostics: diagnostics,
  };
}

initLexer(getDefaultCompilerOptions());
