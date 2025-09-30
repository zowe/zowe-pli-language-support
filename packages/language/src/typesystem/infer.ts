import * as ast from "../syntax-tree/ast";
import { TypeDescriptions } from "./descriptions";
import {
  ArithmeticOperator,
  CompilerOptionRules,
  createArithmeticOperationTable,
} from "./arithmetic-operations";
import { assertUnreachable } from "../utils/common";
import { CompilationUnit } from "../workspace/compilation-unit";
import { DefaultTypeBuilder } from "./type-builder";

export interface TypeInferer {
  inferExpressionType(
    node: ast.Expression,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any;
  inferDeclarationType(
    node: ast.DeclaredItem,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any;
}

export class DefaultTypeInferer implements TypeInferer {
  private inferArithmeticOperation: ({
    op,
    lhs,
    rhs,
  }: {
    op: ArithmeticOperator;
    lhs: TypeDescriptions.Arithmetic;
    rhs: TypeDescriptions.Arithmetic;
  }) => TypeDescriptions.Any;

  constructor(rules: CompilerOptionRules = CompilerOptionRules.ANS) {
    this.inferArithmeticOperation = createArithmeticOperationTable(rules);
  }

  inferDeclarationType(
    node: ast.DeclaredItem,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any {
    function getNameToken(element: ast.DeclaredItemElement) {
      if (element.kind === ast.SyntaxKind.DeclaredVariable) {
        return element.nameToken;
      } else if (element.kind === ast.SyntaxKind.WildcardItem) {
        return element.token;
      } else if (element.kind === ast.SyntaxKind.DeclaredItem) {
        return getNameToken(element.elements[0]);
      }
      assertUnreachable(element);
    }
    return compilationUnit.services.typeCache.get(node, () => {
      const element = node.elements[0];
      const typeBuilder = new DefaultTypeBuilder(getNameToken(element));
      node.attributes.forEach((attr) => typeBuilder.addAttribute(attr));
      const { type, diagnostics } = typeBuilder.build();
      compilationUnit.diagnostics.typeSystem.push(...diagnostics);
      return type ?? TypeDescriptions.Unknown();
    });
  }

  inferExpressionType(
    node: ast.Expression,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any {
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
          return node.value
            ? this.inferExpressionType(node.value!, compilationUnit)
            : TypeDescriptions.Unknown();
        default:
          assertUnreachable(node);
      }
    });
  }

  private inferLocatorCall(
    node: ast.LocatorCall,
    compilationUnit: CompilationUnit,
  ) {
    /** @todo */
    return TypeDescriptions.Unknown();
  }

  private inferLiteral(node: ast.Literal, compilationUnit: CompilationUnit) {
    /** @todo */
    return TypeDescriptions.Unknown();
  }

  private inferUnaryExpression(
    node: ast.UnaryExpression,
    compilationUnit: CompilationUnit,
  ) {
    switch (node.op) {
      case "+":
      case "-":
        /** @todo what about negating vs. sign of the type */
        return this.inferExpressionType(node.expr!, compilationUnit);
      case "^":
      case null:
        /** @todo */
        return TypeDescriptions.Unknown();
      default:
        assertUnreachable(node.op);
    }
  }

  private inferBinaryExpression(
    node: ast.BinaryExpression,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any {
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
          !TypeDescriptions.isArithmetic(lhs) ||
          !TypeDescriptions.isArithmetic(rhs)
        ) {
          /** @todo also take care of this branch */
          return TypeDescriptions.Unknown();
        }
        return this.inferArithmeticOperation({ op, lhs, rhs });
      }
      case "<":
      case "<=":
      case "<>":
      case "=":
      case ">":
      case ">=": {
        return TypeDescriptions.Boolean;
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
        return TypeDescriptions.Unknown();
      default:
        assertUnreachable(node.op);
    }
  }
}
