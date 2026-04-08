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
  generateDoubleCharFunc,
  generateKeywords,
  generateSingleCharFunc,
  KeywordToken,
  TokenizeFunc,
  tokenizeIdentifier,
  tokenizeNumber,
  TokenizerContext,
  tokenizeSemicolon,
  tokenizeString,
  tokenizeWhitespace,
} from "./shared";
import * as sqlTokens from "../tokens/sql-tokens";
import * as pliTokens from "../tokens/pli-tokens";
import { Token } from "../tokens/shared";

export let sqlFuncs: TokenizeFunc[] = [];
export let sqlKeywords: Map<bigint, KeywordToken> = new Map();

export function updateSqlTokenizer(): void {
  if (sqlKeywords.size === 0) {
    sqlKeywords = generateKeywords(sqlTokens.keywordMap);
  }

  sqlFuncs = new Array(256);
  sqlFuncs["-".charCodeAt(0)] = tokenizeMinusWithComment;
  sqlFuncs["/".charCodeAt(0)] = generateSingleCharFunc(pliTokens.Slash);
  sqlFuncs["*".charCodeAt(0)] = generateSingleCharFunc(pliTokens.Star);
  sqlFuncs["+".charCodeAt(0)] = generateSingleCharFunc(pliTokens.Plus);
  sqlFuncs['"'.charCodeAt(0)] = tokenizeString;
  sqlFuncs["'".charCodeAt(0)] = tokenizeString;
  sqlFuncs["(".charCodeAt(0)] = generateSingleCharFunc(pliTokens.OpenParen);
  sqlFuncs[")".charCodeAt(0)] = generateSingleCharFunc(pliTokens.CloseParen);
  sqlFuncs[":".charCodeAt(0)] = generateSingleCharFunc(pliTokens.Colon);
  sqlFuncs[";".charCodeAt(0)] = tokenizeSemicolon;
  sqlFuncs[",".charCodeAt(0)] = generateSingleCharFunc(pliTokens.Comma);
  sqlFuncs[".".charCodeAt(0)] = generateSingleCharFunc(pliTokens.Dot);
  sqlFuncs["=".charCodeAt(0)] = generateSingleCharFunc(pliTokens.Equals);
  sqlFuncs["$".charCodeAt(0)] = generateSingleCharFunc(sqlTokens.Dollar);
  sqlFuncs["?".charCodeAt(0)] = generateSingleCharFunc(sqlTokens.QuestionMark);
  sqlFuncs["[".charCodeAt(0)] = generateSingleCharFunc(sqlTokens.LBracket);
  sqlFuncs["]".charCodeAt(0)] = generateSingleCharFunc(sqlTokens.RBracket);
  sqlFuncs["<".charCodeAt(0)] = generateDoubleCharFunc(pliTokens.LessThan, [
    { char: "=", tokenType: pliTokens.LessThanEquals },
    { char: ">", tokenType: pliTokens.LessThanGreaterThan },
  ]);
  sqlFuncs[">".charCodeAt(0)] = generateDoubleCharFunc(pliTokens.GreaterThan, [
    { char: "=", tokenType: pliTokens.GreaterThanEquals },
  ]);
  sqlFuncs["^".charCodeAt(0)] = generateDoubleCharFunc(undefined, [
    { char: "=", tokenType: pliTokens.NotEquals },
    { char: "<", tokenType: pliTokens.NotLessThan },
    { char: ">", tokenType: pliTokens.NotGreaterThan },
  ]);
  sqlFuncs["|".charCodeAt(0)] = generateDoubleCharFunc(undefined, [
    { char: "|", tokenType: pliTokens.PipePipe },
    { char: "=", tokenType: pliTokens.NotEquals },
    { char: "<", tokenType: pliTokens.NotLessThan },
    { char: ">", tokenType: pliTokens.NotGreaterThan },
  ]);
  // Whitespace characters
  sqlFuncs[" ".charCodeAt(0)] = tokenizeWhitespace;
  sqlFuncs["\t".charCodeAt(0)] = tokenizeWhitespace;
  sqlFuncs["\r".charCodeAt(0)] = tokenizeWhitespace;
  sqlFuncs["\n".charCodeAt(0)] = tokenizeWhitespace;
  sqlFuncs["\f".charCodeAt(0)] = tokenizeWhitespace;
  sqlFuncs["\v".charCodeAt(0)] = tokenizeWhitespace;

  // Numbers
  for (let i = 0; i <= 9; i++) {
    sqlFuncs[i.toString().charCodeAt(0)] = tokenizeNumber;
  }

  const id = tokenizeIdentifier(sqlKeywords);
  // Letters
  for (let i = 97; i <= 122; i++) {
    // a-z
    sqlFuncs[i] = id;
  }
  for (let i = 65; i <= 90; i++) {
    // A-Z
    sqlFuncs[i] = id;
  }

  sqlFuncs["_".charCodeAt(0)] = id;

  const sid = sqlId(id);
  // Special literals (like hexnumbers, graphicchar, etc) have id-like start chars, but are actually strings
  for (const char of ["x", "b", "u", "g"]) {
    sqlFuncs[char.toUpperCase().charCodeAt(0)] = sid;
    sqlFuncs[char.toLowerCase().charCodeAt(0)] = sid;
  }
}

function tokenizeMinusWithComment(
  context: TokenizerContext,
): Token | undefined {
  // We already know that the first character is a "-", so we can check if the next character is also a "-"
  const nextChar = context.input[context.index + 1];
  if (nextChar === "-") {
    // Single-line comment
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
    context.comments.push(context.createTokenInstance(pliTokens.SL_COMMENT));
    return undefined;
  } else {
    // Regular minus token
    context.advance(1, false);
    return context.createTokenInstance(pliTokens.Minus);
  }
}

function sqlId(id: TokenizeFunc): TokenizeFunc {
  return function (context: TokenizerContext): Token | undefined {
    const startChar = context.char.toLowerCase();
    if (startChar === "x") {
      // Hexadecimal string literal
      const nextChar = context.input[context.index + 1];
      if (nextChar === "'" || nextChar === '"') {
        // Consume the "x"
        context.advance(1, false);
        return tokenizeString(context);
      }
    } else if (startChar === "b" || startChar === "u" || startChar === "g") {
      // binary, unicode or graphic string literal
      const nextChar = context.input[context.index + 1];
      if (nextChar === "x" || nextChar === "X") {
        const stringChar = context.input[context.index + 2];
        if (stringChar === "'" || stringChar === '"') {
          // Consume the "b"/"u"/"g" and the "x"
          context.advance(2, false);
          return tokenizeString(context);
        }
      }
    }
    return id(context);
  };
}
