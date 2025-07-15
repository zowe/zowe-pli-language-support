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
  Alternative,
  Assertion,
  Atom,
  Disjunction,
  RegExpParser,
  RegExpPattern,
} from "@chevrotain/regexp-to-ast";

let regExpAstCache: { [regex: string]: RegExpPattern } = {};
const regExpParser = new RegExpParser();

// this should be moved to regexp-to-ast
export type ASTNode =
  | RegExpPattern
  | Disjunction
  | Alternative
  | Assertion
  | Atom;

export function getRegExpAst(regExp: RegExp): RegExpPattern {
  const regExpStr = regExp.toString();
  if (regExpAstCache.hasOwnProperty(regExpStr)) {
    return regExpAstCache[regExpStr];
  } else {
    const regExpAst = regExpParser.pattern(regExpStr);
    regExpAstCache[regExpStr] = regExpAst;
    return regExpAst;
  }
}

export function clearRegExpParserCache() {
  regExpAstCache = {};
}
