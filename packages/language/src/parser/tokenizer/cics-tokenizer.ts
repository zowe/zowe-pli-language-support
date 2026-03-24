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
  generateKeywords,
  generateSingleCharFunc,
  KeywordToken,
  TokenizeFunc,
  tokenizeIdentifier,
  tokenizeNumber,
  tokenizeSemicolon,
  tokenizeSlash,
  tokenizeString,
  tokenizeWhitespace,
} from "./shared";
import * as cicsTokens from "../tokens/cics-tokens.generated";
import * as pliTokens from "../tokens/pli-tokens";

export let cicsFuncs: TokenizeFunc[] = [];
export let cicsKeywords: Map<bigint, KeywordToken> = new Map();

export function updateCicsTokenizer(): void {
  cicsFuncs = new Array(256);
  cicsFuncs["/".charCodeAt(0)] = tokenizeSlash;
  cicsFuncs['"'.charCodeAt(0)] = tokenizeString;
  cicsFuncs["'".charCodeAt(0)] = tokenizeString;
  cicsFuncs["(".charCodeAt(0)] = generateSingleCharFunc(pliTokens.OpenParen);
  cicsFuncs[")".charCodeAt(0)] = generateSingleCharFunc(pliTokens.CloseParen);
  cicsFuncs[";".charCodeAt(0)] = tokenizeSemicolon;
  cicsFuncs[",".charCodeAt(0)] = generateSingleCharFunc(pliTokens.Comma);
  //cicsFuncs["%".charCodeAt(0)] = generateSingleCharFunc(pliTokens.Percent);
  //cicsFuncs[".".charCodeAt(0)] = generateSingleCharFunc(pliTokens.Dot);
  // Whitespace characters
  cicsFuncs[" ".charCodeAt(0)] = tokenizeWhitespace;
  cicsFuncs["\t".charCodeAt(0)] = tokenizeWhitespace;
  cicsFuncs["\r".charCodeAt(0)] = tokenizeWhitespace;
  cicsFuncs["\n".charCodeAt(0)] = tokenizeWhitespace;
  cicsFuncs["\f".charCodeAt(0)] = tokenizeWhitespace;
  cicsFuncs["\v".charCodeAt(0)] = tokenizeWhitespace;

  // Numbers
  for (let i = 0; i <= 9; i++) {
    cicsFuncs[i.toString().charCodeAt(0)] = tokenizeNumber;
  }

  // Letters
  for (let i = 97; i <= 122; i++) {
    // a-z
    cicsFuncs[i] = tokenizeIdentifier;
  }
  for (let i = 65; i <= 90; i++) {
    // A-Z
    cicsFuncs[i] = tokenizeIdentifier;
  }

  //TODO verify if these are valid identifier characters in CICS, and if so, add them back
  // cicsFuncs["_".charCodeAt(0)] = tokenizeIdentifier;
  // cicsFuncs["@".charCodeAt(0)] = tokenizeIdentifier;
  // cicsFuncs["$".charCodeAt(0)] = tokenizeIdentifier;
  // cicsFuncs["#".charCodeAt(0)] = tokenizeIdentifier;

  if (cicsKeywords.size === 0) {
    cicsKeywords = generateKeywords(cicsTokens.keywordMap);
  }
}
