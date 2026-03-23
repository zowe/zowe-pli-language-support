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

import * as tokens from "../tokens";
import { CompilerOptions } from "../../preprocessor/compiler-options/options";
import {
  FNV_OFFSET_BASIS,
  FNV_PRIME,
  generateDoubleCharFunc,
  generateKeywords,
  generateSingleCharFunc,
  isIdChar,
  KeywordToken,
  TokenizeFunc,
  TokenizerContext,
  tokenizeRegex,
  TokenizerMode,
  tokenizeWhitespace,
  TwoCharToken,
} from "./shared";
import { NOT_CHARACTER } from "../../utils/const";
import { diagnosticFromCode } from "../../language-server/types";
import { PLICodes } from "../../validation/pli-codes";

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
  "(": [{ char: ":", tokenType: tokens.OpenParenColon }],
  ":": [{ char: ")", tokenType: tokens.CloseParenColon }],
};

let Keywords: Map<bigint, KeywordToken> = new Map();

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
    if (context.caseUpper && charCode >= 97 && charCode <= 122) {
      // Lowercase character, must be uppercased
      charCode &= ~0x20;
    }
    hash ^= BigInt(charCode);
    hash *= FNV_PRIME;
    i++;
  }
  const originalImage = context.input.substring(start, i);
  const image = context.caseUpper ? originalImage.toUpperCase() : originalImage;
  const previousToken = context.tokens[context.tokens.length - 1];
  // Specific handling for EXEC (likely EXEC SQL or EXEC CICS)
  if (previousToken?.tokenTypeIdx === tokens.EXEC.tokenTypeIdx) {
    if (image === "SQL") {
      context.advance(3, false);
      context.switchMode(TokenizerMode.SQL);
      return context.createTokenInstance(tokens.SQL);
    } else if (image === "CICS") {
      context.advance(4, false);
      context.switchMode(TokenizerMode.CICS);
      return context.createTokenInstance(tokens.CICS);
    }
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

function tokenizeString(context: TokenizerContext): tokens.Token | undefined {
  const result = tokenizeStringInternal(context);
  if (result) {
    return result;
  }
  // Unterminated string, consume until the end of the line
  const start = context.index;
  let i = context.index;
  while (i < context.length) {
    const char = context.input[i];
    if (char === "\n") {
      break;
    }
    i++;
  }
  context.advance(i - start, false);
  // Generate the token for the error diagnostic
  const token = context.createTokenInstance(tokens.STRING_TERM);
  context.diagnostics.push(diagnosticFromCode(PLICodes.Severe.IBM3961I, token));
  // But return undefined to indicate no valid token was created
  return undefined;
}

const tokenizeStringInternal = tokenizeRegex(tokens.STRING_TERM, stringRegex);
const tokenizeNumber = tokenizeRegex(tokens.NUMBER, numberRegex);

function tokenizeOrSymbol(context: TokenizerContext): tokens.Token | undefined {
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
  } else if (nextChar === "=") {
    context.advance(2, false);
    return context.createTokenInstance(tokens.StarEquals);
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
      while (i < context.length) {
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
      context.comments.push(context.createTokenInstance(tokens.ML_COMMENT));
      return undefined;
    } else if (nextChar === "/") {
      // Line comment
      let i = context.index + 2;
      while (i < context.length) {
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
      context.comments.push(context.createTokenInstance(tokens.SL_COMMENT));
      return undefined;
    } else if (nextChar === "=") {
      context.advance(2, false);
      return context.createTokenInstance(tokens.SlashEquals);
    }
  }

  context.advance(1, false);
  return context.createTokenInstance(tokens.Slash);
}

export function tokenizeIncludeAlt(
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

export function tokenizeSemicolon(
  context: TokenizerContext,
): tokens.Token | undefined {
  context.advance(1, false);
  if (context.mode !== TokenizerMode.Default) {
    // Reset to default mode on semicolon, as it acts as a delimiter for all EXEC statements
    context.switchMode(TokenizerMode.Default);
  }
  return context.createTokenInstance(tokens.Semicolon);
}

export let pliFuncs: TokenizeFunc[] = [];
const defaultOr = "|";
const defaultNot = NOT_CHARACTER + "^";
let orSymbols = defaultOr;
let notSymbols = defaultNot;
let includeAlt: string | undefined = undefined;

export function updatePliTokenizer(compilerOptions: CompilerOptions): void {
  orSymbols = compilerOptions.or ?? defaultOr;
  notSymbols = compilerOptions.not ?? defaultNot;
  includeAlt = compilerOptions.pp?.ppInclude?.value;
  pliFuncs = new Array(256);
  pliFuncs["/".charCodeAt(0)] = tokenizeSlash;
  pliFuncs['"'.charCodeAt(0)] = tokenizeString;
  pliFuncs["'".charCodeAt(0)] = tokenizeString;
  pliFuncs["*".charCodeAt(0)] = tokenizeAsterisk;
  pliFuncs["=".charCodeAt(0)] = generateDoubleCharFunc(
    tokens.Equals,
    TwoCharTokens["="],
  );
  pliFuncs["+".charCodeAt(0)] = generateDoubleCharFunc(
    tokens.Plus,
    TwoCharTokens["+"],
  );
  pliFuncs["-".charCodeAt(0)] = generateDoubleCharFunc(
    tokens.Minus,
    TwoCharTokens["-"],
  );
  pliFuncs["&".charCodeAt(0)] = generateDoubleCharFunc(
    tokens.Ampersand,
    TwoCharTokens["&"],
  );
  pliFuncs["<".charCodeAt(0)] = generateDoubleCharFunc(
    tokens.LessThan,
    TwoCharTokens["<"],
  );
  pliFuncs[">".charCodeAt(0)] = generateDoubleCharFunc(
    tokens.GreaterThan,
    TwoCharTokens[">"],
  );
  pliFuncs["(".charCodeAt(0)] = generateDoubleCharFunc(
    tokens.OpenParen,
    TwoCharTokens["("],
  );
  pliFuncs[")".charCodeAt(0)] = generateSingleCharFunc(tokens.CloseParen);
  pliFuncs[";".charCodeAt(0)] = tokenizeSemicolon;
  pliFuncs[":".charCodeAt(0)] = generateDoubleCharFunc(
    tokens.Colon,
    TwoCharTokens[":"],
  );
  pliFuncs[",".charCodeAt(0)] = generateSingleCharFunc(tokens.Comma);
  pliFuncs["%".charCodeAt(0)] = generateSingleCharFunc(tokens.Percent);
  pliFuncs[".".charCodeAt(0)] = generateSingleCharFunc(tokens.Dot);
  // Whitespace characters
  pliFuncs[" ".charCodeAt(0)] = tokenizeWhitespace;
  pliFuncs["\t".charCodeAt(0)] = tokenizeWhitespace;
  pliFuncs["\r".charCodeAt(0)] = tokenizeWhitespace;
  pliFuncs["\n".charCodeAt(0)] = tokenizeWhitespace;
  pliFuncs["\f".charCodeAt(0)] = tokenizeWhitespace;
  pliFuncs["\v".charCodeAt(0)] = tokenizeWhitespace;

  // Numbers
  for (let i = 0; i <= 9; i++) {
    pliFuncs[i.toString().charCodeAt(0)] = tokenizeNumber;
  }

  // Letters
  for (let i = 97; i <= 122; i++) {
    // a-z
    pliFuncs[i] = tokenizeIdentifier;
  }
  for (let i = 65; i <= 90; i++) {
    // A-Z
    pliFuncs[i] = tokenizeIdentifier;
  }
  pliFuncs["_".charCodeAt(0)] = tokenizeIdentifier;
  pliFuncs["@".charCodeAt(0)] = tokenizeIdentifier;
  pliFuncs["$".charCodeAt(0)] = tokenizeIdentifier;
  pliFuncs["#".charCodeAt(0)] = tokenizeIdentifier;

  for (const orSymbolChar of orSymbols.split("")) {
    pliFuncs[orSymbolChar.charCodeAt(0)] = tokenizeOrSymbol;
  }
  for (const notSymbolChar of notSymbols.split("")) {
    pliFuncs[notSymbolChar.charCodeAt(0)] = generateDoubleCharFunc(
      tokens.Not,
      TwoCharTokens["^"],
    );
  }

  if (Keywords.size === 0) {
    Keywords = generateKeywords(tokens.keywordMap);
  }
}
