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

import { tokenMatcher } from "chevrotain";
import { ParserState } from "./parser-state";
import * as tokens from "./tokens";

const assignmentIndicators = tokens.combine(
  tokens.AssignmentOperator,
  tokens.Dot,
  tokens.MinusGreaterThan,
  tokens.EqualsGreaterThan,
  tokens.Comma,
);

function indicatesAssignment(token: tokens.Token): boolean {
  return assignmentIndicators[token.tokenTypeIdx] === true;
}

const expressionTokens = tokens.combine(
  tokens.ID,
  tokens.BinaryOperator,
  tokens.UnaryOperator,
  tokens.AssignmentOperator,
  tokens.STRING_TERM,
  tokens.NUMBER,
  tokens.Comma,
  tokens.Dot,
  tokens.MinusGreaterThan,
  tokens.EqualsGreaterThan,
);

export function performAssignmentLookahead(state: ParserState): boolean {
  if (performIfLookahead(state)) {
    // IF ... THEN detected, not an assignment
    // We need this check first since IF can be followed by an expression that makes it look like an assignment
    // e.g. IF (2 + 3) = 5 THEN; ...
    return false;
  }

  let i = 1;
  let token = state.peek(i++);
  // First token of an assigment needs to be an ID
  if (!token || !tokenMatcher(token, tokens.ID)) {
    return false;
  }
  token = state.peek(i++);
  if (token && indicatesAssignment(token)) {
    // We have found a match immediately with the assignment operator (or a dot for member assignment, or a comma for multiple assignment)
    return true;
  } else if (!token || !tokenMatcher(token, tokens.OpenParen)) {
    // Otherwise expect an open parenthesis next
    return false;
  }

  // The compiler will not use more than 160 tokens to perform the lookahead
  const max = 160;
  let parenthesis = 1;
  while (i < max) {
    const token = state.peek(i++);
    if (!token) {
      return false;
    }
    if (parenthesis === 0) {
      // If we close the outermost parenthesis, expect an assignment indicator next
      return indicatesAssignment(token);
    }
    if (tokenMatcher(token, tokens.OpenParen)) {
      parenthesis++;
    } else if (tokenMatcher(token, tokens.CloseParen)) {
      parenthesis--;
    } else if (tokenMatcher(token, tokens.Semicolon)) {
      // Semicolon indicates the end of the statement
      return false;
    } else {
      if (!expressionTokens[token.tokenTypeIdx]) {
        // Non-expression token found, stop lookahead
        return false;
      }
      // Continue with the next token, the current token is a valid expression token
    }
  }
  // If we reach this point, the lookahead was not successful
  return false;
}

/**
 * Checks whether the tokens starting at lookahead position `index` form a
 * label prefix: `ID [ ( ...balanced... ) ]* :`
 * Dimensions are allowed since labels can reference declared label arrays,
 * e.g. `DCL L(2) LABEL; L(1): PUT("HELLO");`
 *
 * @returns the lookahead index directly after the colon, or undefined if no label prefix is present
 */
export function skipLabelPrefixLookahead(
  state: ParserState,
  index: number,
): number | undefined {
  // The compiler will not use more than 160 tokens to perform the lookahead
  const max = index + 160;
  let token = state.peek(index);
  if (!token || !tokenMatcher(token, tokens.ID)) {
    return undefined;
  }
  let i = index + 1;
  token = state.peek(i);
  // Skip any number of balanced parenthesis groups (label array dimensions)
  while (token && tokenMatcher(token, tokens.OpenParen)) {
    let parenthesis = 1;
    i++;
    while (parenthesis > 0) {
      if (i >= max) {
        return undefined;
      }
      const inner = state.peek(i++);
      if (!inner || tokenMatcher(inner, tokens.Semicolon)) {
        return undefined;
      }
      if (tokenMatcher(inner, tokens.OpenParen)) {
        parenthesis++;
      } else if (tokenMatcher(inner, tokens.CloseParen)) {
        parenthesis--;
      }
    }
    token = state.peek(i);
  }
  if (token && tokenMatcher(token, tokens.Colon)) {
    return i + 1;
  }
  return undefined;
}

export function performLabelPrefixLookahead(state: ParserState): boolean {
  return skipLabelPrefixLookahead(state, 1) !== undefined;
}

function performIfLookahead(state: ParserState): boolean {
  let i = 1;
  let token = state.peek(i++);
  // First token needs to be IF
  if (!token || !tokenMatcher(token, tokens.IF)) {
    return false;
  }
  // Then we need to search for THEN before reaching the end of the statement
  let parenthesis = 0;
  const max = 160;
  while (i < max) {
    token = state.peek(i++);
    if (!token) {
      return false;
    }
    // THEN found outside of parentheses after IF and another token
    if (i > 2 && parenthesis === 0 && tokenMatcher(token, tokens.THEN)) {
      return true;
    } else if (tokenMatcher(token, tokens.OpenParen)) {
      parenthesis++;
    } else if (tokenMatcher(token, tokens.CloseParen)) {
      parenthesis--;
    } else if (tokenMatcher(token, tokens.Semicolon)) {
      // Semicolon indicates the end of the statement
      return false;
    }
  }
  // If we reach this point, the lookahead was not successful
  return false;
}

/**
 * Simple check for whether an END statement is present in the lookahead.
 * Use this when you just need to know if an END is coming.
 *
 * @returns true if an END statement is found, false otherwise
 */
export function hasEndStatementLookahead(state: ParserState): boolean {
  return performEndStatementLookahead(state).endStatement !== false;
}

export interface EndStatementLookahead {
  /**
   * Information about the END statement:
   * - `false` if no END statement found
   * - `true` if unlabeled END found (e.g., "END;")
   * - `string` if labeled END found (e.g., "END FOO;" returns "FOO")
   */
  endStatement: boolean | string;
  /**
   * The lookahead index of the END token, if found.
   * Undefined if no END statement was found.
   */
  endTokenIndex?: number;
}

/**
 * Performs lookahead to detect END statement and its optional label.
 * Skips any label prefixes (e.g., "FOO: END") before the END keyword.
 *
 * @returns Object containing END statement information and token position
 */
export function performEndStatementLookahead(
  state: ParserState,
): EndStatementLookahead {
  const lookahead = (la: number) => state.peek(la);
  let index: number = 1;
  let token: tokens.Token | undefined = undefined;

  while ((token = lookahead(index)) && !tokenMatcher(token, tokens.END)) {
    const next = skipLabelPrefixLookahead(state, index);
    if (next === undefined) {
      return { endStatement: false };
    }
    index = next;
  }

  if (!token || !tokenMatcher(token, tokens.END)) {
    return { endStatement: false };
  }

  // To verify that the end is actually an END statement and not part of an expression,
  // we check for the semicolon, potentially preceded by an ID label.
  let nextToken = lookahead(index + 1);
  if (!nextToken) {
    return { endStatement: false };
  }

  if (tokenMatcher(nextToken, tokens.Semicolon)) {
    return { endStatement: true, endTokenIndex: index };
  }

  if (!tokenMatcher(nextToken, tokens.ID)) {
    return { endStatement: false };
  }

  const semicolonToken = lookahead(index + 2);
  if (!semicolonToken || !tokenMatcher(semicolonToken, tokens.Semicolon)) {
    return { endStatement: false };
  }

  return { endStatement: nextToken.image, endTokenIndex: index };
}
