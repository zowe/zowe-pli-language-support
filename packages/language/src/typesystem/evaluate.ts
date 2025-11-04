import { Expression, SyntaxKind } from "../syntax-tree/ast";
import { StringFormat, StringKind, TypeDescriptions, Value } from "./descriptions";

/** helper function to evaluate constant expressions */
export function evaluateExpression(expression: Expression): Value {
    switch (expression.kind) {
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