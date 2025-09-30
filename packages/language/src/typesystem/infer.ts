import * as ast from "../syntax-tree/ast";
import { TypesDescriptions } from "./descriptions";
import {
  ArithmeticOperator,
  CompilerOptionRules,
  createArithmeticOperationTable,
} from "./arithmetic-operations";
import { assertUnreachable } from "../utils/common";
import { CompilationUnit } from "../workspace/compilation-unit";
import { DefaultTypeBuilder } from "./type-builder";

export interface TypeInferer {
  inferExpressionType(node: ast.Expression, compilationUnit: CompilationUnit): TypesDescriptions.Any | undefined;
  inferDeclarationType(node: ast.DeclaredItem, compilationUnit: CompilationUnit): TypesDescriptions.Any | undefined;
}

export class DefaultTypeInferer implements TypeInferer {
  private inferArithmeticOperation: ({
    op,
    lhs,
    rhs,
  }: {
    op: ArithmeticOperator;
    lhs: TypesDescriptions.Arithmetic;
    rhs: TypesDescriptions.Arithmetic;
  }) => TypesDescriptions.Any;

  constructor(rules: CompilerOptionRules = CompilerOptionRules.ANS) {
    this.inferArithmeticOperation = createArithmeticOperationTable(rules);
  }

  inferDeclarationType(
    node: ast.DeclaredItem,
    compilationUnit: CompilationUnit,
  ): TypesDescriptions.Any | undefined {
    return compilationUnit.services.typeCache.get(node, () => {
      const typeBuilder = new DefaultTypeBuilder();
      node.attributes.forEach(attr => typeBuilder.addAttribute(attr));
      const { type, diagnostics } = typeBuilder.build();
      compilationUnit.diagnostics.typeSystem.push(...diagnostics);
      return type ?? TypesDescriptions.Unknown();
    });
  }

  inferExpressionType(node: ast.Expression, compilationUnit: CompilationUnit): TypesDescriptions.Any {
    return compilationUnit.services.typeCache.get(node, () => {
      switch (node.kind) {
        case ast.SyntaxKind.BinaryExpression:
          return this.inferBinaryExpression(node, compilationUnit);
        case ast.SyntaxKind.UnaryExpression:
          return this.inferUnaryExpression(node, compilationUnit);
        case ast.SyntaxKind.Literal:
          return this.inferLiteral(node, compilationUnit);
        case ast.SyntaxKind.LocatorCall:
          return this.inferLocatorCall(node, compilationUnit);
        case ast.SyntaxKind.Parenthesis:
          return node.value ? this.inferExpressionType(node.value!, compilationUnit) : TypesDescriptions.Unknown();
        default:
          assertUnreachable(node);
      }
    });
  }

  private inferLocatorCall(node: ast.LocatorCall, compilationUnit: CompilationUnit) {
    /** @todo */
    return TypesDescriptions.Unknown();
  }

  private inferLiteral(node: ast.Literal, compilationUnit: CompilationUnit) {
    /** @todo */
    return TypesDescriptions.Unknown();
  }

  private inferUnaryExpression(node: ast.UnaryExpression, compilationUnit: CompilationUnit) {
    switch (node.op) {
      case "+":
      case "-":
        /** @todo what about negating vs. sign of the type */
        return this.inferExpressionType(node.expr!, compilationUnit);
      case "^":
      case null:
        /** @todo */
        return TypesDescriptions.Unknown();
      default:
        assertUnreachable(node.op);
    }
  }

  private inferBinaryExpression(node: ast.BinaryExpression, compilationUnit: CompilationUnit): TypesDescriptions.Any {
    switch (node.op) {
      case "+":
      case "-":
      case "*":
      case "/":
      case "**": {
        //@see https://www.ibm.com/docs/en/epfz/6.1?topic=operations-results-arithmetic
        const op = node.op;
        const lhs = this.inferExpressionType(node.left!, compilationUnit);
        const rhs = this.inferExpressionType(node.right!, compilationUnit);
        if (
          !lhs ||
          !rhs ||
          !TypesDescriptions.isArithmetic(lhs) ||
          !TypesDescriptions.isArithmetic(rhs)
        ) {
          /** @todo also take care of this branch */
          return TypesDescriptions.Unknown();
        }
        return this.inferArithmeticOperation({ op, lhs, rhs });
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
        return TypesDescriptions.Unknown();
      default:
        assertUnreachable(node.op);
    }
  }
}
