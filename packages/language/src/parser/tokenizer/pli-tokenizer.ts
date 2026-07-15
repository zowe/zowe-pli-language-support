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
import { getEffectiveIncludeAlt } from "../../preprocessor/compiler-options/options-pli";
import {
  generateDoubleCharFunc,
  generateKeywords,
  generateSingleCharFunc,
  KeywordToken,
  TokenizeFunc,
  tokenizeIdentifier,
  tokenizeNumber,
  TokenizerContext,
  tokenizeSemicolon,
  tokenizeSlashWithComment,
  tokenizeString,
  tokenizeWhitespace,
  TwoCharToken,
} from "./shared";
import { NOT_CHARACTER } from "../../utils/const";

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

export let pliKeywords: Map<number, KeywordToken> = new Map();

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

export let pliFuncs: TokenizeFunc[] = [];
const defaultOr = "|";
const defaultNot = NOT_CHARACTER + "^";
let orSymbols = defaultOr;
let notSymbols = defaultNot;
let includeAlt: string | undefined = undefined;

export function updatePliTokenizer(compilerOptions: CompilerOptions): void {
  if (pliKeywords.size === 0) {
    pliKeywords = generateKeywords(tokens.keywordMap);
  }
  orSymbols = compilerOptions.or ?? defaultOr;
  notSymbols = compilerOptions.not ?? defaultNot;
  includeAlt = getEffectiveIncludeAlt(compilerOptions);
  pliFuncs = new Array(256);
  pliFuncs["/".charCodeAt(0)] = tokenizeSlashWithComment;
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

  const id = tokenizeIdentifier(pliKeywords);
  // Letters
  for (let i = 97; i <= 122; i++) {
    // a-z
    pliFuncs[i] = id;
  }
  for (let i = 65; i <= 90; i++) {
    // A-Z
    pliFuncs[i] = id;
  }
  pliFuncs["_".charCodeAt(0)] = id;
  pliFuncs["@".charCodeAt(0)] = id;
  pliFuncs["$".charCodeAt(0)] = id;
  pliFuncs["#".charCodeAt(0)] = id;

  for (const orSymbolChar of orSymbols.split("")) {
    pliFuncs[orSymbolChar.charCodeAt(0)] = tokenizeOrSymbol;
  }
  for (const notSymbolChar of notSymbols.split("")) {
    pliFuncs[notSymbolChar.charCodeAt(0)] = generateDoubleCharFunc(
      tokens.Not,
      TwoCharTokens["^"],
    );
  }
}
