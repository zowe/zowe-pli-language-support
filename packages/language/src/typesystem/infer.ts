import * as ast from "../syntax-tree/ast";
import { TypesDescriptions } from "./descriptions";
import { ArithmeticOperator, CompilerOptionRules, createArithmeticOperationTable } from "./arithmetic-operations";
import { assertUnreachable } from "../utils/common";

export interface PliTypeInferer {
    inferExpressionType(node: ast.Expression): TypesDescriptions.Any | undefined;
    inferDeclarationType(node: ast.DeclaredItem): TypesDescriptions.Any | undefined;
}

export class DefaultPliTypeInferer implements PliTypeInferer {
    private inferArithmeticOperation: ({ op, lhs, rhs }: { op: ArithmeticOperator; lhs: TypesDescriptions.Arithmetic; rhs: TypesDescriptions.Arithmetic; }) => TypesDescriptions.Any | undefined;
    constructor() {
        /** @todo pass in the compiler flag RULES(X), where X = 'ans' or 'ibm' */
        this.inferArithmeticOperation = createArithmeticOperationTable(CompilerOptionRules.ANS);
    }
    
    inferDeclarationType(node: ast.DeclaredItem): TypesDescriptions.Any | undefined {
        node.attributes
        return undefined;
    }

    inferExpressionType(node: ast.Expression): TypesDescriptions.Any | undefined {
        switch (node.kind) {
            case ast.SyntaxKind.BinaryExpression:
                return this.inferBinaryExpression(node);
            case ast.SyntaxKind.UnaryExpression:
                return this.inferUnaryExpression(node);
            case ast.SyntaxKind.Literal:
                return this.inferLiteral(node);
            case ast.SyntaxKind.LocatorCall:
                return this.inferLocatorCall(node);
            case ast.SyntaxKind.Parenthesis:
                return node.value ? this.inferExpressionType(node.value!) : undefined;
            default:
                assertUnreachable(node);
        }
    }

    private inferLocatorCall(node: ast.LocatorCall) {
        /** @todo */
        //node.previous -> node.element
        return undefined;
    }

    private inferLiteral(node: ast.Literal) {
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
    }

    private inferUnaryExpression(node: ast.UnaryExpression) {
        switch (node.op) {
            case "+":
            case "-":
                /** @todo what about negating vs. sign of the type */
                return this.inferExpressionType(node.expr!);
            case "^":
            case null:
                /** @todo */
                return undefined;
            default:
                assertUnreachable(node.op);
        }
    }

    private inferBinaryExpression(node: ast.BinaryExpression): TypesDescriptions.Any | undefined {
        switch (node.op) {
            case "+":
            case "-":
            case "*":
            case "/":
            case "**": {
                //@see https://www.ibm.com/docs/en/epfz/6.1?topic=operations-results-arithmetic
                const op = node.op;
                const lhs = this.inferExpressionType(node.left!);
                const rhs = this.inferExpressionType(node.right!);
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
                assertUnreachable(node.op);
        }
    }
}

