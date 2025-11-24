import { Expression, SyntaxKind } from "../syntax-tree/ast";
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
      if (expression.expr && expression.op) {
        const operand = evaluateExpression(expression.expr);
        switch (expression.op) {
          case "+":
          case "-":
            if (operand.type.type === DataType.Arithmetic) {
              const value = operand.value as number;
              return {
                type: operand.type,
                value: expression.op === "+" ? +value : -value,
              };
            }
            break;
          case "^":
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
                kind: StringKind.Character,
                format: StringFormat.NonVarying,
                length: literal.value.length,
              }),
              value: literal.value,
            };
          case SyntaxKind.NumberLiteral:
            return {
              type: TypeDescriptions.Arithmetic({}),
              value: parseInt(literal.value),
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
