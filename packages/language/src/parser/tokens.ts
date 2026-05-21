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

import { Lexer } from "chevrotain";
import { combinations, ID } from "./tokens/shared";
import * as pli from "./tokens/pli-tokens";

export * from "./tokens/shared";
export * from "./tokens/pli-tokens";

/**
 * Characters which start a preprocessor directive.
 * Used as start/stop points for the token statement
 */
export const PPSignifier = [
  pli.Percent,
  pli.INCLUDE_ALT,
  pli.SQL,
  pli.DFHRESP,
  pli.EXEC,
];

export const terminals = [
  pli.WS,
  ID,
  pli.NUMBER,
  pli.STRING_TERM,
  pli.ML_COMMENT,
  pli.SL_COMMENT,
];

export const operators = [
  pli.INCLUDE_ALT,
  pli.PipePipeEquals,
  pli.StarStarEquals,
  pli.PlusEquals,
  pli.MinusEquals,
  pli.StarEquals,
  pli.SlashEquals,
  pli.PipeEquals,
  pli.AmpersandEquals,
  pli.NotEquals,
  pli.LessThanGreaterThan,
  pli.NotLessThan,
  pli.LessThanEquals,
  pli.GreaterThanEquals,
  pli.NotGreaterThan,
  pli.PipePipe,
  pli.StarStar,
  pli.MinusGreaterThan,
  pli.EqualsGreaterThan,
  pli.Semicolon,
  pli.OpenParen,
  pli.CloseParen,
  pli.Colon,
  pli.Comma,
  pli.Star,
  pli.Equals,
  pli.Pipe,
  pli.Not,
  pli.Ampersand,
  pli.LessThan,
  pli.GreaterThan,
  pli.Plus,
  pli.Minus,
  pli.Slash,
  pli.Dot,
  pli.Percent,
];

export const all = [
  pli.WS,
  ...combinations,
  ...pli.keywords,
  ...operators,
  ID,
  pli.NUMBER,
  pli.STRING_TERM,
  pli.ML_COMMENT,
  pli.SL_COMMENT,
];

export const LexerInstance = new Lexer(all);
