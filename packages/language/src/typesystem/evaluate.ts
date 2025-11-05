import { assert } from "console";
import { Expression, SyntaxKind } from "../syntax-tree/ast";
import { DataType, StringFormat, StringKind, TypeDescriptions, Value } from "./descriptions";
import { assertType } from "../preprocessor/util";

/** helper function to evaluate constant expressions */
export function evaluateExpression(expression: Expression): Value {
    switch (expression.kind) {
        case SyntaxKind.UnaryExpression: {
            if(expression.expr && expression.op) {
                const operand = evaluateExpression(expression.expr);
                switch(expression.op) {
                    case '+':
                    case '-':
                        assertType<DataType.Arithmetic>(operand.type);
                        return {
                            type: operand.type,
                            value: expression.op === '+' ? +(operand.value as number) : -(operand.value as number),
                        };
                    case '^':
                        //TODO handle bitwise not
                        break;
                }
            }
            return {
                type: TypeDescriptions.Unknown(),
                value: ""
            };
        }
        case SyntaxKind.Literal: {
            const literal = expression.value;
            switch (literal?.kind) {
                case SyntaxKind.StringLiteral:
                    return {
                        type: TypeDescriptions.String({
                            kind: StringKind.Character,
                            format: StringFormat.NonVarying,
                            length: literal.value!.length,
                        }),
                        value: literal.value!,
                    };
                case SyntaxKind.NumberLiteral:
                    return {
                        type: TypeDescriptions.Arithmetic({}),
                        value: parseInt(literal.value!), 
                    };
            }
            break;
        }
    }

    return {
        type: TypeDescriptions.Unknown(),
        value: ""
    }
}