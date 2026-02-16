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
import { Expression, SyntaxKind, UnaryOperator } from "../syntax-tree/ast";
import {
  DataType,
  StringFormat,
  StringKind,
  TypeDescriptions,
  Value,
} from "./descriptions";

/** helper function to evaluate constant expressions */
export function evaluateExpression(expression: Expression): Value {
  switch (expression.kind) {
    case SyntaxKind.UnaryExpression: {
      if (expression.expr && expression.op !== null) {
        const operand = evaluateExpression(expression.expr);
        switch (expression.op) {
          case UnaryOperator.Plus:
          case UnaryOperator.Minus:
            if (operand.type.type === DataType.Arithmetic) {
              const value = operand.value as number;
              return {
                type: operand.type,
                value: expression.op === UnaryOperator.Plus ? +value : -value,
              };
            }
            break;
          case UnaryOperator.Not:
            //TODO handle bitwise not
            break;
        }
      }
      return {
        type: TypeDescriptions.Unknown(),
        value: "",
      };
    }
    case SyntaxKind.Literal: {
      const literal = expression.value;
      if (literal && literal.value) {
        switch (literal.kind) {
          case SyntaxKind.StringLiteral:
            return {
              type: TypeDescriptions.String({
                stringBits: {
                  kind: StringKind.Character,
                  length: literal.value.length,
                },
                format: StringFormat.NonVarying,
              }),
              value: literal.value,
            };
          case SyntaxKind.NumberLiteral:
            return {
              type: TypeDescriptions.Arithmetic({}),
              value: parseFloat(literal.value),
            };
        }
      }
      break;
    }
  }

  return {
    type: TypeDescriptions.Unknown(),
    value: "",
  };
}
