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

import { createToken, Lexer } from "chevrotain";

const Id = tokenType("id", /[a-z_][a-z_0-9]*/iy);

export function tokenType(name: string, pattern: string | RegExp) {
  return createToken({
    name,
    pattern,
  });
}

export const PreprocessorTokens = {
  Procedure: tokenType("procedure", /PROC(EDURE)?/iy),
  Statement: tokenType("statement", /STATEMENT/iy),
  Returns: tokenType("returns", /RETURNS/iy),
  Return: tokenType("return", /RETURN/iy),
  Leave: tokenType("leave", /LEAVE/iy),
  By: tokenType("by", /BY/iy),
  Iterate: tokenType("iterate", /ITERATE/iy),
  Activate: tokenType("activate", /ACT(IVATE)?/iy),
  If: tokenType("if", /IF/iy),
  Go: tokenType("go", /GO/iy),
  To: tokenType("to", /TO/iy),
  Loop: tokenType("loop", /LOOP|FOREVER/iy),
  While: tokenType("while", /WHILE/iy),
  Until: tokenType("until", /UNTIL/iy),
  Do: tokenType("do", /DO/iy),
  End: tokenType("end", /END/iy),
  Then: tokenType("then", /THEN/iy),
  Else: tokenType("else", /ELSE/iy),
  Deactivate: tokenType("deactivate", /DEACT(IVATE)?/iy),
  Declare: tokenType("declare", /DCL|DECLARE/iy),
  Builtin: tokenType("builtin", /BUILTIN/iy),
  Entry: tokenType("builtin", /ENTRY/iy),
  Character: tokenType("character", /CHAR(ACTER)?/iy),
  Include: tokenType("include", /INCLUDE/iy),
  Internal: tokenType("internal", /INT(ERNAL)?/iy),
  External: tokenType("external", /EXT(ERNAL)?/iy),
  Directive: tokenType("directive", /PAGE|PRINT|NOPRINT|PUSH|POP/iy),
  Skip: tokenType("skip", /SKIP/iy),
  Scan: tokenType("scan", /SCAN/iy),
  Rescan: tokenType("rescan", /RESCAN/iy),
  Noscan: tokenType("noscan", /NOSCAN/iy),
  Fixed: tokenType("fixed", /FIXED/iy),
  LParen: tokenType("lparen", /\(/iy),
  RParen: tokenType("rparen", /\)/iy),
  Semicolon: tokenType("semicolon", /;/iy),
  Colon: tokenType("colon", /:/iy),
  Comma: tokenType("comma", /,/iy),
  Percentage: tokenType("percentage", /%/iy),
  Plus: tokenType("plus", /\+/iy),
  Minus: tokenType("minus", /\-/iy),
  Divide: tokenType("divide", /\//iy),
  Power: tokenType("pow", /\*\*/iy),
  Multiply: tokenType("multiply", /\*/iy),
  Concat: tokenType("concat", /\|\|/iy),
  Or: tokenType("or", /\|/iy),
  And: tokenType("and", /\&/iy),
  Eq: tokenType("eq", /=/iy),
  Neq: tokenType("neq", /<>/iy),
  LE: tokenType("le", /<=/iy),
  GE: tokenType("ge", />=/iy),
  GT: tokenType("gt", />/iy),
  LT: tokenType("lt", /</iy),
  //This token regexp was taken from the PL/1 Langium grammar
  //TODO need a way to sync them...
  String: tokenType(
    "string",
    /("(""|\\.|[^"\\])*"|'(''|\\.|[^'\\])*')([xX]|[aA]|[eE]|[xX][uU]|[xX][nN]|[bB]4|[bB]3|[bB][xX]|[bB]|[gG][xX]|[gG]|[uU][xX]|[wW][xX]|[xX]|[iI])*/y,
  ),
  Id,
  Number: tokenType("number", /[0-9]+/iy),
};

// We need this to augment the token types with the tokenTypeIdx
new Lexer(Object.values(PreprocessorTokens), {
  skipValidations: true,
});

export const AllPreprocessorTokens = Object.values(PreprocessorTokens);
