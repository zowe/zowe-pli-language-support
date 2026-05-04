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
  BinaryOperator,
  Expression,
  SyntaxKind,
  type BinaryExpression,
} from "../syntax-tree/ast";
import { Token } from "./tokens";

/**
 * Represents an intermediate binary expression used during parsing.
 */
export interface IntermediateBinaryExpression {
  /**
   * The items (operands) in the binary expression.
   */
  items: (Expression | null)[];

  /**
   * The operators in the binary expression.
   */
  operators: BinaryOperator[];

  /**
   * The tokens corresponding to the operators in the binary expression.
   */
  operatorTokens: Token[];

  /**
   * Indicates that this is an infix expression.
   */
  infix: true;
}

/**
 * Builds a precedence map from precedence groups
 */
function buildPrecendenceMap(
  precedenceGroups: BinaryOperator[][],
): Map<BinaryOperator, number> {
  const map = new Map<BinaryOperator, number>();
  for (let i = 0; i < precedenceGroups.length; i++) {
    const group = precedenceGroups[i];
    for (const op of group) {
      map.set(op, i);
    }
  }
  return map;
}

const binaryPrecedence = buildPrecendenceMap([
  // Priority 1, **
  [BinaryOperator.StarStar],
  // Priority 2, *, /
  [BinaryOperator.Star, BinaryOperator.Slash],
  // Priority 3, +, -
  [BinaryOperator.Plus, BinaryOperator.Minus],
  // Priority 4, ||, !!
  [BinaryOperator.PipePipe],
  // Priority 5, '<', '¬<', '<=', '=', '¬=', '^=', '<>', '>=', '>', '¬>'
  [
    BinaryOperator.LessThan,
    BinaryOperator.NotLessThan,
    BinaryOperator.LessThanEquals,
    BinaryOperator.Equals,
    BinaryOperator.NotEquals,
    BinaryOperator.GreaterThanEquals,
    BinaryOperator.GreaterThan,
    BinaryOperator.NotGreaterThan,
  ],
  // Priority 6, &
  [BinaryOperator.Ampersand],
  // Priority 7, |, ¬ or ^
  [BinaryOperator.Pipe, BinaryOperator.Not],
]);

const rightAssociativeOperators = new Set<BinaryOperator>([
  BinaryOperator.StarStar,
]);

/**
 * Constructs a binary expression from an intermediate representation,
 * used when popping infix exprs from the stack,
 * so we get the whole thing together
 */
export function constructBinaryExpression(
  obj: IntermediateBinaryExpression,
): Expression | null {
  // If there are no items, that means we have parsed an "empty" expression
  // Simply return null in this case
  if (obj.items.length === 0) {
    return null;
  }
  if (obj.items.length === 1 && obj.operators.length === 0) {
    // Captured just a single, non-binary expression
    // Simply return the expression as is.
    // Note that in some cases there might only be one item, but still more than 0 operators
    // This usually indicates a parser error, but we still need to handle it gracefully
    return obj.items[0];
  }
  // Find the operator with the lowest precedence (highest value in precedence map)
  let lowestPrecedenceIdx = 0;
  let lowestPrecedenceValue = -1;

  for (let i = 0; i < obj.operators.length; i++) {
    const operator = obj.operators[i];
    const precedenceValue = binaryPrecedence.get(operator) ?? Infinity;
    const isRightAssociative = rightAssociativeOperators.has(operator);

    // Pick right-to-left/left-to-right based on operator associativity.
    const shouldUpdate = isRightAssociative
      ? precedenceValue > lowestPrecedenceValue
      : precedenceValue >= lowestPrecedenceValue;

    if (shouldUpdate) {
      lowestPrecedenceValue = precedenceValue;
      lowestPrecedenceIdx = i;
    }
  }

  // Split the expression at the lowest precedence operator
  const leftOperators = obj.operators.slice(0, lowestPrecedenceIdx);
  const rightOperators = obj.operators.slice(lowestPrecedenceIdx + 1);

  const leftParts = obj.items.slice(0, lowestPrecedenceIdx + 1);
  const rightParts = obj.items.slice(lowestPrecedenceIdx + 1);

  // Create sub-expressions
  const leftInfix: IntermediateBinaryExpression = {
    infix: true,
    items: leftParts,
    operators: leftOperators,
    operatorTokens: obj.operatorTokens.slice(0, lowestPrecedenceIdx),
  };
  const rightInfix: IntermediateBinaryExpression = {
    infix: true,
    items: rightParts,
    operators: rightOperators,
    operatorTokens: obj.operatorTokens.slice(lowestPrecedenceIdx + 1),
  };

  // Recursively build the left and right subtrees
  const leftTree = constructBinaryExpression(leftInfix);
  const rightTree = constructBinaryExpression(rightInfix);

  const op = obj.operators[lowestPrecedenceIdx];
  const opToken = obj.operatorTokens[lowestPrecedenceIdx];

  // Create the final binary expression
  const result: BinaryExpression = {
    kind: SyntaxKind.BinaryExpression,
    container: null,
    left: leftTree,
    op,
    opToken,
    right: rightTree,
  };

  opToken.element = result;

  return result;
}
