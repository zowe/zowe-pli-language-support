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
  public uri: URI | undefined;

  constructor(input: string, uri: URI | undefined) {
    this.input = input;
    this.length = input.length;
    this.uri = uri;
  }
}

type TokenizeFunc = (context: TokenizerContext) => tokens.Token | undefined;

function tokenizeIdentifier(
  context: TokenizerContext,
): tokens.Token | undefined {
  const start = context.index;
  let hash = FNV_OFFSET_BASIS;
  let i = context.index;
  let char: string;
  let image = "";
  let originalImage = "";
  while (i < context.length) {
    char = context.input[i];
    if (!isIdChar(char)) {
      break;
    }
    let charCode = char.charCodeAt(0);
    if (charCode >= 97 && charCode <= 122) {
      // Lowercase character, must be uppercased
      charCode &= ~0x20;
    }
    image += String.fromCharCode(charCode);
    originalImage += char;
    hash ^= BigInt(charCode);
    hash *= FNV_PRIME;
    i++;
  }
  const previousToken = context.tokens[context.tokens.length - 1];
  // Specific handling for ExecFragment (likely EXEC SQL or EXEC CICS)
  if (
    previousToken?.tokenTypeIdx === tokens.EXEC.tokenTypeIdx &&
    ((hash === SQL.hash && image === SQL.image) ||
      (hash === CICS.hash && image === CICS.image))
  ) {
    while (i < context.length && context.input[i] !== ";") {
      i++;
      image += context.input[i];
    }
    context.index = i; // Keep the semicolon token
    return tokens.createTokenInstance(
      image,
      originalImage,
      tokens.ExecFragment,
      start,
      i - 1,
      context.uri,
    );
  }
  let tokenType = tokens.ID;
  const keyword = Keywords.get(hash);
  if (keyword && keyword.image === image) {
    tokenType = keyword.kind;
  }
  context.index = i;
  return tokens.createTokenInstance(
    image,
    originalImage,
    tokenType,
    start,
    i - 1,
    context.uri,
  );
}

const stringRegex = tokens.STRING_TERM.PATTERN as RegExp;
const numberRegex = tokens.NUMBER.PATTERN as RegExp;

function tokenizeRegex(tokenType: TokenType, regex: RegExp): TokenizeFunc {
  return function (context: TokenizerContext): tokens.Token | undefined {
    const start = context.index;
    regex.lastIndex = start;
    const match = regex.exec(context.input);
    if (match) {
      context.index = match.index + match[0].length;
      const image = context.input.substring(start, context.index);
      return tokens.createTokenInstance(
        image,
        image,
        tokenType,
        start,
        context.index - 1,
        context.uri,
      );
    } else {
      context.index++;
      return undefined;
    }
  };
}

const tokenizeString = tokenizeRegex(tokens.STRING_TERM, stringRegex);
const tokenizeNumber = tokenizeRegex(tokens.NUMBER, numberRegex);

function tokenizeOrSymbol(context: TokenizerContext): tokens.Token | undefined {
  const start = context.index;

  let nextChar = context.input[context.index + 1];
  if (orSymbols.includes(nextChar)) {
    nextChar = context.input[context.index + 2];
    if (nextChar === "=") {
      context.index += 3;
      const image = context.input.substring(start, context.index);
      return tokens.createTokenInstance(
        image,
        image,
        tokens.PipePipeEquals,
        start,
        context.index - 1,
        context.uri,
      );
    }
    context.index += 2;
    const image = context.input.substring(start, context.index);
    return tokens.createTokenInstance(
      image,
      image,
      tokens.PipePipe,
      start,
      context.index - 1,
      context.uri,
    );
  } else if (nextChar === "=") {
    context.index += 2;
    const image = context.input.substring(start, context.index);
    return tokens.createTokenInstance(
      image,
      image,
      tokens.PipeEquals,
      start,
      context.index - 1,
      context.uri,
    );
  }
  context.index++;
  const image = context.input.substring(start, context.index);
  return tokens.createTokenInstance(
    image,
    image,
    tokens.Pipe,
    start,
    start,
    context.uri,
  );
}

function tokenizeAsterisk(context: TokenizerContext): tokens.Token | undefined {
  const start = context.index;

  let nextChar = context.input[context.index + 1];
  if (nextChar === "*") {
    nextChar = context.input[context.index + 2];
    if (nextChar === "=") {
      context.index += 3;
      const image = context.input.substring(start, context.index);
      return tokens.createTokenInstance(
        image,
        image,
        tokens.StarStarEquals,
        start,
        context.index - 1,
        context.uri,
      );
    }
    context.index += 2;
    const image = context.input.substring(start, context.index);
    return tokens.createTokenInstance(
      image,
      image,
      tokens.StarStar,
      start,
      context.index - 1,
      context.uri,
    );
  }
  context.index++;
  const image = context.input.substring(start, context.index);
  return tokens.createTokenInstance(
    image,
    image,
    tokens.Star,
    start,
    context.index - 1,
    context.uri,
  );
}

function tokenizeSlash(context: TokenizerContext): tokens.Token | undefined {
  const start = context.index;

  if (context.index + 1 < context.length) {
    const nextChar = context.input[context.index + 1];

    if (nextChar === "*") {
      // Block comment
      let i = context.index + 2;
      while (i < context.length - 1) {
        if (context.input[i] === "*" && context.input[i + 1] === "/") {
          i += 2;
          break;
        }
        i++;
      }
      context.index = i;
      return undefined;
    } else if (nextChar === "/") {
      // Line comment
      let i = context.index + 2;
      while (i < context.length - 1) {
        i++;
        if (context.input[i] === "\n") {
          break;
        }
      }
      context.index = i;
      return undefined;
    } else if (nextChar === "=") {
      context.index += 2;
      const image = context.input.substring(start, context.index);
      return tokens.createTokenInstance(
        image,
        image,
        tokens.SlashEquals,
        start,
        context.index - 1,
        context.uri,
      );
    }
  }

  context.index++;
  const image = context.input.substring(start, context.index);
  return tokens.createTokenInstance(
    image,
    image,
    tokens.Slash,
    start,
    context.index - 1,
    context.uri,
  );
}

function generateDoubleCharFunc(
  tokenType: TokenType,
  others: TwoCharToken[],
): TokenizeFunc {
  return function (context: TokenizerContext): tokens.Token | undefined {
    const start = context.index;

    if (context.index + 1 < context.length) {
      const nextChar = context.input[context.index + 1];

      for (const follow of others) {
        if (nextChar === follow.char) {
          context.index += 2;
          const image = context.input.substring(start, context.index);
          return tokens.createTokenInstance(
            image,
            image,
            follow.tokenType,
            start,
            start + 1,
            context.uri,
          );
        }
      }
    }

    context.index++;
    const image = context.input.substring(start, context.index);
    return tokens.createTokenInstance(
      image,
      image,
      tokenType,
      start,
      start,
      context.uri,
    );
  };
}

function generateSingleCharFunc(tokenType: TokenType): TokenizeFunc {
  return function (context: TokenizerContext): tokens.Token | undefined {
    const start = context.index;
    context.index++;
    return tokens.createTokenInstance(
      context.char,
      context.char,
      tokenType,
      start,
      start,
      context.uri,
    );
  };
}

function tokenizeWhitespace(
  context: TokenizerContext,
): tokens.Token | undefined {
  do {
    context.index++;
  } while (isWhitespace(context.input[context.index]));
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
  const start = context.index;
  context.index += includeAlt.length;
  return tokens.createTokenInstance(
    includeAlt,
    includeAlt,
    tokens.INCLUDE_ALT,
    start,
    context.index - 1,
    context.uri,
  );
}

// Utility functions
function isIdChar(char: string): boolean {
  return /[0-9a-zA-Z_@#$]/.test(char);
}

function isWhitespace(char: string): boolean {
  return /\s/.test(char);
}

// Function map
const funcs = new Map<string, TokenizeFunc>();
const defaultOr = "|";
const defaultNot = "¬^";
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
  errors: TokenizationError[];
}

export interface TokenizationError {
  message: string;
  start: number;
  end: number;
}

export function tokenize(
  input: string,
  uri: URI | undefined,
): TokenizationResult {
  const context = new TokenizerContext(input, uri);
  const errors: TokenizationError[] = [];
  let previous: tokens.Token | undefined = undefined;

  while (context.index < context.length) {
    const char = input[context.index];
    context.char = char;

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
      errors.push({
        message: `Unrecognized character: ${char}`,
        start: context.index,
        end: context.index + 1,
      });
      context.index++;
    }
  }

  return {
    tokens: context.tokens,
    errors,
  };
}

initLexer(getDefaultCompilerOptions());
