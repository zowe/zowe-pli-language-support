import * as ast from "../syntax-tree/ast";
import { TypesDescriptions } from "./descriptions";
import { ArithmeticOperator, createArithmeticOperationTable } from "./arithmetic-operations";
import { assertUnreachable } from "../utils/common";

export interface PliTypeInferer {
    inferType(node: ast.Expression): TypesDescriptions.Any | undefined;
}

export class DefaultPliTypeInferer implements PliTypeInferer {
    private inferArithmeticOperation: ({ op, lhs, rhs }: { op: ArithmeticOperator; lhs: TypesDescriptions.Arithmetic; rhs: TypesDescriptions.Arithmetic; }) => TypesDescriptions.Any | undefined;
    constructor() {
        /** @todo pass in the compiler flag RULES(X), where X = 'ans' or 'ibm' */
        this.inferArithmeticOperation = createArithmeticOperationTable('ans');
    }
    inferType(node: ast.Expression): TypesDescriptions.Any | undefined {
        switch (node.kind) {
            case ast.SyntaxKind.BinaryExpression:
                switch (node.op) {
                    case "+":
                    case "-":
                    case "*":
                    case "/":
                    case "**": {
                        //@see https://www.ibm.com/docs/en/epfz/6.1?topic=operations-results-arithmetic
                        const op = node.op;
                        const lhs = this.inferType(node.left!);
                        const rhs = this.inferType(node.right!);
                        if (!lhs || !rhs || !TypesDescriptions.isArithmetic(lhs) || !TypesDescriptions.isArithmetic(rhs)) {
                            /** @todo also take care of this branch */
                            return undefined;
                        }
                        return this.inferArithmeticOperation({ op, lhs, rhs })
                    }
                    case "<":
                    case "<=":
                    case "<>":
                    case "=":
                    case ">":
                    case ">=": {
                        return TypesDescriptions.Boolean;
                    }
                    case "^":
                    case "&":
                    case "^=":
                    case "|":
                    case "||":
                    case "^<":
                    case "^>":
                    case null:
                        /** @todo */
                        return undefined;
                    default:
                        assertUnreachable(node)
                }
            case ast.SyntaxKind.UnaryExpression:
                switch (node.op) {
                    case "+":
                    case "-":
                        /** @todo what about negating vs. sign of the type */
                        return this.inferType(node.expr!);
                    case "^":
                    case null:
                        /** @todo */
                        return undefined;
                    default:
                        assertUnreachable(node)
                }
            case ast.SyntaxKind.Literal:
                if (!node.value) {
                    /** @todo */
                    return undefined;
                } else if (node.value.kind === ast.SyntaxKind.StringLiteral) {
                    /** @todo */
                    return undefined;
                } else if (node.value.kind === ast.SyntaxKind.NumberLiteral) {
                    /** @todo */
                    return undefined;
                } else {
                    assertUnreachable(node.value);
                }
            case ast.SyntaxKind.LocatorCall: {
                //node.previous -> node.element
                /** @todo */
                return undefined;
            }
            case ast.SyntaxKind.Parenthesis: {
                return this.inferType(node.value!);
            }
            default:
                assertUnreachable(node);
        }
    }
}

