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

export function performEndStatementLookahead(state: ParserState): boolean {
  const lookahead = (la: number) => state.peek(la);
  let index: number = 1;
  let token: tokens.Token | undefined = undefined;
  while ((token = lookahead(index)) && !tokenMatcher(token, tokens.END)) {
    const idToken = lookahead(index);
    const colonToken = lookahead(index + 1);
    if (!idToken || !colonToken) {
      return false;
    }
    if (
      !tokenMatcher(idToken, tokens.ID) ||
      !tokenMatcher(colonToken, tokens.Colon)
    ) {
      return false;
    }
    index += 2;
  }
  return token !== undefined && tokenMatcher(token, tokens.END);
}
