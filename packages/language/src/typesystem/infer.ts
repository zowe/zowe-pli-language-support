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
import { BuilderDeclareItem } from "./descriptions";
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
        return this.lookupByAstNode(types, node);
      } else if (node.kind === ast.SyntaxKind.DeclaredItem) {
        const types = this.inferDeclaredItem(node, compilationUnit);
        return this.lookupByAstNode(types, node);
      } else {
        //TODO other kinds of nodes
      }
      return TypeDescriptions.Unknown();
    });
  }

  private lookupByAstNode(
    types: Map<BuilderDeclareItem, TypeDescriptions.Any>,
    node: ast.SyntaxNode,
  ): TypeDescriptions.Any {
    for (const [item, type] of types) {
      if (item.node === node) {
        return type;
      }
    }
    return TypeDescriptions.Unknown();
  }

  private inferDeclareStatement(
    node: ast.DeclareStatement,
    compilationUnit: CompilationUnit,
  ): Map<BuilderDeclareItem, TypeDescriptions.Any> {
    const builder = new DefaultCompositeTypeBuilder();
    const items = builder.flattenDeclareStatement(node);
    const topLevelMembers = new Map<BuilderDeclareItem, TypeDescriptions.Any>();
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
          topLevelMembers.set(item, structureType);
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
            structureAddMember(parent, item, structureType);
            structureParents.push(structureType);
          } else {
            if (structureParents.length > 0) {
              structureParents.pop();
            }
            if (structureParents.length > 0) {
              const parent = structureParents[structureParents.length - 1];
              structureAddMember(parent, item, structureType);
            } else {
              topLevelMembers.set(item, structureType);
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
          topLevelMembers.set(item, primitiveType);
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
            structureAddMember(parent, item, primitiveType);
          } else {
            if (structureParents.length > 0) {
              const parent = structureParents[structureParents.length - 1];
              structureAddMember(parent, item, primitiveType);
            } else {
              topLevelMembers.set(item, primitiveType);
            }
          }
        }
      }
    }
    // TODO: Reenable once we ensure that we don't show any false positives
    // this.traverseMembers(
    //   topLevelMembers,
    //   (t) => TypeDescriptions.isStructure(t),
    //   (t, item, isTopLevel) => {
    //     if (t.members && Object.keys(t.members).length === 0) {
    //       compilationUnit.diagnostics.add(
    //         DiagnosticCategory.TypeSystem,
    //         diagnosticFromCode(
    //           isTopLevel ? Error.IBM1482I : Error.IBM1483I,
    //           item.nameToken,
    //           item.name,
    //         ),
    //       );
    //     }
    //   },
    // );
    return topLevelMembers;

    function structureAddMember(
      structureType: TypeDescriptions.Structure,
      item: BuilderDeclareItem,
      memberType: TypeDescriptions.Any,
    ) {
      structureType.members[item.name] = memberType;
      structureType.membersMetadata[item.name] = item;
    }
  }

  private traverseMembers<T extends TypeDescriptions.Any>(
    members: Map<BuilderDeclareItem, TypeDescriptions.Any>,
    predicate: (type: TypeDescriptions.Any) => type is T,
    callback: (type: T, item: BuilderDeclareItem, isTopLevel: boolean) => void,
    isTopLevel = true,
  ): void {
    members.forEach((type, item) => {
      if (predicate(type)) {
        callback(type, item, isTopLevel);
      }
      if (TypeDescriptions.isStructure(type)) {
        const subMembers = new Map<BuilderDeclareItem, TypeDescriptions.Any>(
          Object.entries(type.members).map(([name, subType]) => {
            const subItem = type.membersMetadata[name];
            return [subItem, subType] as const;
          }),
        );
        this.traverseMembers(subMembers, predicate, callback, false);
      }
    });
  }

  private inferDeclaredItem(
    node: ast.DeclaredItem,
    compilationUnit: CompilationUnit,
  ): Map<BuilderDeclareItem, TypeDescriptions.Any> {
    let parent: ast.SyntaxNode | null = node;
    while (parent && parent.kind !== ast.SyntaxKind.DeclareStatement) {
      parent = parent.container;
    }
    return parent
      ? this.inferDeclareStatement(parent, compilationUnit)
      : new Map();
  }
}
