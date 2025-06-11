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

import * as tokens from "../parser/tokens";

export const PreprocessorTokens = {
  Procedure: tokens.PROCEDURE,
  Statement: tokens.STATEMENT,
  Returns: tokens.RETURNS,
  Return: tokens.RETURN,
  Leave: tokens.LEAVE,
  By: tokens.BY,
  Iterate: tokens.ITERATE,
  Activate: tokens.ACTIVATE,
  If: tokens.IF,
  Goto: tokens.GOTO,
  Go: tokens.GO,
  To: tokens.TO,
  Loop: tokens.LOOP,
  While: tokens.WHILE,
  Until: tokens.UNTIL,
  Do: tokens.DO,
  End: tokens.END,
  Then: tokens.THEN,
  Else: tokens.ELSE,
  Deactivate: tokens.DEACTIVATE,
  Declare: tokens.DECLARE,
  Builtin: tokens.BUILTIN,
  Entry: tokens.ENTRY,
  Character: tokens.CHARACTER,
  Include: tokens.INCLUDE,
  Internal: tokens.INTERNAL,
  External: tokens.EXTERNAL,
  Page: tokens.PAGE,
  Print: tokens.PRINT,
  NoPrint: tokens.NOPRINT,
  Push: tokens.PUSH,
  Pop: tokens.POP,
  Skip: tokens.SKIP,
  Scan: tokens.SCAN,
  Rescan: tokens.RESCAN,
  Noscan: tokens.NOSCAN,
  Fixed: tokens.FIXED,
  LParen: tokens.OpenParen,
  RParen: tokens.CloseParen,
  Semicolon: tokens.Semicolon,
  Colon: tokens.Colon,
  Comma: tokens.Comma,
  Percentage: tokens.Percent,
  Plus: tokens.Plus,
  Minus: tokens.Minus,
  Divide: tokens.Slash,
  Power: tokens.StarStar,
  Multiply: tokens.Star,
  Concat: tokens.PipePipe,
  Or: tokens.Pipe,
  And: tokens.Ampersand,
  Eq: tokens.Equals,
  // Default not equals token is <>
  Neq: tokens.LessThanGreaterThan,
  // We have a second "not equals" token ^=, that can be adjusted via compiler options
  Neq2: tokens.NotEquals,
  LE: tokens.LessThanEquals,
  GE: tokens.GreaterThanEquals,
  GT: tokens.GreaterThan,
  LT: tokens.LessThan,
  String: tokens.STRING_TERM,
  Id: tokens.ID,
  Number: tokens.NUMBER,
};

export const PreprocessorBinaryTokens = [
  PreprocessorTokens.Power,
  PreprocessorTokens.Multiply,
  PreprocessorTokens.Divide,
  PreprocessorTokens.Plus,
  PreprocessorTokens.Minus,
  PreprocessorTokens.Concat,
  PreprocessorTokens.LT,
  PreprocessorTokens.LE,
  PreprocessorTokens.GT,
  PreprocessorTokens.GE,
  PreprocessorTokens.Eq,
  PreprocessorTokens.Neq,
  PreprocessorTokens.Neq2,
  PreprocessorTokens.And,
  PreprocessorTokens.Or,
];

export const AllPreprocessorTokens = Object.values(PreprocessorTokens);
