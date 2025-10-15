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
import { TypeDescriptions } from "./descriptions";
import { CompilationUnit } from "../workspace/compilation-unit";
import { DefaultCompositeTypeBuilder } from "./composite-type-builder";
import { assertType } from "../preprocessor/util";

export interface TypeInferer {
  inferType(node: ast.SyntaxNode, unit: CompilationUnit): TypeDescriptions.Any;
}

export class DefaultTypeInferer implements TypeInferer {
  inferType(
    node: ast.SyntaxNode,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any {
    return compilationUnit.services.typeCache.get(node, () => {
      if (node.kind === ast.SyntaxKind.DeclareStatement) {
        this.inferDeclareStatement(node, compilationUnit);
        return TypeDescriptions.Unknown();
      } else if (node.kind === ast.SyntaxKind.DeclaredVariable) {
        assertType<ast.DeclaredItem>(node.container);
        const types = this.inferDeclaredItem(node.container, compilationUnit);
        return types.get(node) ?? TypeDescriptions.Unknown();
      } else if (node.kind === ast.SyntaxKind.DeclaredItem) {
        const types = this.inferDeclaredItem(node, compilationUnit);
        return types.get(node) ?? TypeDescriptions.Unknown();
      } else {
        //TODO other kinds of nodes
      }
      return TypeDescriptions.Unknown();
    });
  }

  private inferDeclareStatement(
    node: ast.DeclareStatement,
    compilationUnit: CompilationUnit,
  ) {
    const builder = new DefaultCompositeTypeBuilder();
    const items = builder.flattenDeclareStatement(node);
    const topLevelMembers = new Map<ast.SyntaxNode, TypeDescriptions.Any>();
    const structureParents: TypeDescriptions.Structure[] = [];
    let previousLevel: number | undefined = undefined;
    for (const item of items) {
      if (builder.isCompositeDeclaredItem(item)) {
        const structureType = builder.handleCompositeDeclaredItem(
          item,
          compilationUnit,
        );
        compilationUnit.services.typeCache.set(item.node, structureType);
        if (previousLevel === undefined) {
          topLevelMembers.set(item.node, structureType);
          structureParents.push(structureType);
        } else {
          while (previousLevel && structureType.level < previousLevel) {
            structureParents.pop();
            previousLevel =
              structureParents.length > 0
                ? structureParents[structureParents.length - 1].level
                : undefined;
          }
          if (previousLevel && structureType.level > previousLevel) {
            const parent = structureParents[structureParents.length - 1];
            parent.members[item.name] = structureType;
            structureParents.push(structureType);
          } else {
            if (structureParents.length > 0) {
              structureParents.pop();
            }
            if (structureParents.length > 0) {
              const parent = structureParents[structureParents.length - 1];
              parent.members[item.name] = structureType;
            } else {
              topLevelMembers.set(item.node, structureType);
            }
            structureParents.push(structureType);
          }
        }
        previousLevel = structureType.level;
      } else {
        const primitiveType = builder.handlePrimitiveDeclaredItem(
          item,
          compilationUnit,
        );
        compilationUnit.services.typeCache.set(item.node, primitiveType);
        if (item.level === undefined) {
          topLevelMembers.set(item.node, primitiveType);
        } else {
          while (previousLevel && item.level < previousLevel) {
            structureParents.pop();
            previousLevel =
              structureParents.length > 0
                ? structureParents[structureParents.length - 1].level
                : undefined;
          }
          if (previousLevel && item.level > previousLevel) {
            const parent = structureParents[structureParents.length - 1];
            parent.members[item.name] = primitiveType;
          } else {
            if (structureParents.length > 0) {
              const parent = structureParents[structureParents.length - 1];
              parent.members[item.name] = primitiveType;
            } else {
              topLevelMembers.set(item.node, primitiveType);
            }
          }
        }
      }
    }
    return topLevelMembers;
  }

  private inferDeclaredItem(
    node: ast.DeclaredItem,
    compilationUnit: CompilationUnit,
  ) {
    let parent: ast.SyntaxNode | null = node;
    while (parent && parent.kind !== ast.SyntaxKind.DeclareStatement) {
      parent = parent.container;
    }
    return parent
      ? this.inferDeclareStatement(parent, compilationUnit)
      : new Map();
  }
}
