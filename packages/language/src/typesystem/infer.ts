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

import * as ast from "../syntax-tree/ast";
import { DataType, TypeDescriptions } from "./descriptions";
import {
  ArithmeticOperator,
  CompilerOptionRules,
  createArithmeticOperationTable,
} from "./arithmetic-operations";
import { assertUnreachable } from "../utils/common";
import { CompilationUnit } from "../workspace/compilation-unit";
import { DefaultTypeBuilder } from "./type-builder";
import { Token } from "../parser/tokens";

export interface TypeInferer {
  inferType(
    node: ast.SyntaxNode,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any;
  // inferExpressionType(
  //   node: ast.Expression,
  //   compilationUnit: CompilationUnit,
  // ): TypeDescriptions.Any;
  // inferDeclarationType(
  //   node: ast.DeclaredItem,
  //   compilationUnit: CompilationUnit,
  // ): Map<ast.SyntaxNode, TypeDescriptions.Any>;
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

  inferType(
    node: ast.SyntaxNode,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any {
    if (
      node.kind === ast.SyntaxKind.DeclaredVariable &&
      node.container?.kind === ast.SyntaxKind.DeclaredItem
    ) {
      const types = this.inferDeclarationType(node.container, compilationUnit);
      return types.get(node) ?? TypeDescriptions.Unknown();
    } else if (node.kind === ast.SyntaxKind.DeclaredItem) {
      const types = this.inferDeclarationType(node, compilationUnit);
      return types.get(node) ?? TypeDescriptions.Unknown();
    } else {
      //TODO other kinds of nodes
    }
    return TypeDescriptions.Unknown();
  }

  private getTypeOfElement(
    nameTokens: Token[],
    node: ast.DeclaredItem,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any | undefined {
    const typeBuilder = new DefaultTypeBuilder(nameTokens);
    while (
      node.attributes.length === 0 &&
      node.container?.kind === ast.SyntaxKind.DeclaredItem
    ) {
      node = node.container;
    }
    node.attributes.forEach((attr) => typeBuilder.addAttribute(attr));
    const { type, diagnostics } = typeBuilder.build();
    if (type.type !== DataType.Unknown) {
      compilationUnit.diagnostics.typeSystem.push(...diagnostics);
    }
    return type;
  }

  private inferDeclaredItemElement(
    element: ast.DeclaredItemElement,
    parent: ast.DeclaredItem,
    compilationUnit: CompilationUnit,
  ): Map<ast.SyntaxNode, TypeDescriptions.Any> {
    if (element.kind === ast.SyntaxKind.DeclaredVariable) {
      if (element.nameToken) {
        const type = this.getTypeOfElement(
          [element.nameToken],
          parent,
          compilationUnit,
        );
        return type ? new Map([[element, type]]) : new Map();
      }
    } else if (element.kind === ast.SyntaxKind.WildcardItem) {
      if (element.token) {
        const type = this.getTypeOfElement(
          [element.token],
          parent,
          compilationUnit,
        );
        return type ? new Map([[element, type]]) : new Map();
      }
    } else if (element.kind === ast.SyntaxKind.DeclaredItem) {
      return this.inferDeclarationType(element, compilationUnit);
    }
    return new Map();
  }

  private inferDeclarationType(
    node: ast.DeclaredItem,
    compilationUnit: CompilationUnit,
  ): Map<ast.SyntaxNode, TypeDescriptions.Any> {
    const result = new Map<ast.SyntaxNode, TypeDescriptions.Any>();
    for (const element of node.elements) {
      const typesByElement = this.inferDeclaredItemElement(
        element,
        node,
        compilationUnit,
      );
      for (const [element, type] of typesByElement) {
        result.set(element, type);
      }
    }
    for (const [element, type] of result.entries()) {
      compilationUnit.services.typeCache.set(element, type);
    }
    return result;
  }

  private inferExpressionType(
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
