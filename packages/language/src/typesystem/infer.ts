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
import { DefaultPrimitiveTypeBuilder } from "./primitive-type-builder";
import { DiagnosticCategory } from "../validation/diagnostics-store";
import { DefaultTypeAttributeCollector } from "./attribute-witnesses";

export interface TypeInferer {
  inferType(node: ast.SyntaxNode, unit: CompilationUnit): TypeDescriptions.Any;
}

export class DefaultTypeInferer implements TypeInferer {
  inferType(
    node: ast.SyntaxNode,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any {
    return compilationUnit.services.typeCache.get(node, () => {
      if (
        node.kind === ast.SyntaxKind.DeclareStatement ||
        node.kind === ast.SyntaxKind.DefineStructureStatement
      ) {
        this.inferDeclareStatement(node, compilationUnit);
      } else if (node.kind === ast.SyntaxKind.DeclaredVariable) {
        assertType<ast.DeclaredItem>(node.container);
        this.inferDeclaredItem(node.container, compilationUnit);
        return compilationUnit.services.typeCache.get(node);
      } else if (node.kind === ast.SyntaxKind.DeclaredItem) {
        this.inferDeclaredItem(node, compilationUnit);
      } else if (node.kind === ast.SyntaxKind.DefineAliasStatement) {
        return this.inferAliasType(node, compilationUnit);
      } else if (node.kind === ast.SyntaxKind.DefineOrdinalStatement) {
        return this.inferOrdinalType(node, compilationUnit);
      } else if(node.kind === ast.SyntaxKind.ReturnsOption) {
        return this.inferReturnsOptionType(node, compilationUnit);
      } else if(node.kind === ast.SyntaxKind.EntryParameterDescription || node.kind === ast.SyntaxKind.EntryUnionDescription) {
        return this.inferEntryParameterType(node, compilationUnit);
      }
      return TypeDescriptions.Unknown();
    });
  }
  
  private inferReturnsOptionType(node: ast.ReturnsOption, compilationUnit: CompilationUnit): TypeDescriptions.Any {
    return TypeDescriptions.Unknown();
  }

  private inferEntryParameterType(node: ast.EntryParameterDescription | ast.EntryUnionDescription, compilationUnit: CompilationUnit): TypeDescriptions.Any {
    return TypeDescriptions.Unknown();
  }

  private inferOrdinalType(
    node: ast.DefineOrdinalStatement,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any {
    if (!node.nameToken) {
      return TypeDescriptions.Unknown();
    }
    const collector = new DefaultTypeAttributeCollector(node.nameToken, compilationUnit);
    {
      const fixedAttribute = ast.createComputationDataAttribute();
      fixedAttribute.typeToken = node.nameToken;
      fixedAttribute.type = ast.DefaultAttribute.FIXED;
      collector.addAttribute(fixedAttribute);
    }
    {
      const binaryAttribute = ast.createComputationDataAttribute();
      binaryAttribute.typeToken = node.nameToken;
      binaryAttribute.type = ast.DefaultAttribute.BINARY;
      collector.addAttribute(binaryAttribute);
    }
    if (node.attributes.includes(ast.DefineOrdinalAttribute.SIGNED)) {
      const attr = ast.createComputationDataAttribute();
      attr.type = ast.DefaultAttribute.SIGNED;
      collector.addAttribute(attr);
    }
    if (node.attributes.includes(ast.DefineOrdinalAttribute.UNSIGNED)) {
      const attr = ast.createComputationDataAttribute();
      attr.type = ast.DefaultAttribute.UNSIGNED;
      collector.addAttribute(attr);
    }
    if (node.attributes.includes(ast.DefineOrdinalAttribute.PRECISION)) {
      const attr = ast.createComputationDataAttribute();
      attr.type = ast.DefaultAttribute.PRECISION;
      attr.dimensions = ast.createDimensions();
      const bound = ast.createDimensionBound();
      bound.lower = ast.createBound();
      bound.upper = ast.createBound();
      const literal = ast.createLiteral();
      const value = ast.createNumberLiteral();
      literal.value = value;
      value.value = node.precision;
      bound.upper.expression = literal;
      attr.dimensions.dimensions = [bound];
      collector.addAttribute(attr);
    }
    const builder = new DefaultPrimitiveTypeBuilder(
      node.nameToken,
      collector.build(),
      compilationUnit,
    );
    const { type, diagnostics } = builder.build();
    compilationUnit.diagnostics.addAll(
      DiagnosticCategory.TypeSystem,
      diagnostics,
    );
    return type;
  }

  private inferAliasType(
    node: ast.DefineAliasStatement,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any {
    if (!node.nameToken) {
      return TypeDescriptions.Unknown();
    }
    const collector = new DefaultTypeAttributeCollector(node.nameToken, compilationUnit);
    node.attributes.forEach((attribute) => {
      collector.addAttribute(attribute);
    });
    const builder = new DefaultPrimitiveTypeBuilder(
      node.nameToken,
      collector.build(),
      compilationUnit,
    );
    const { type, diagnostics } = builder.build();
    compilationUnit.diagnostics.addAll(
      DiagnosticCategory.TypeSystem,
      diagnostics,
    );
    return type;
  }

  private inferDeclareStatement(
    node: ast.DeclareStatement | ast.DefineStructureStatement,
    compilationUnit: CompilationUnit,
  ): void {
    const builder = new DefaultCompositeTypeBuilder(compilationUnit);
    const items = builder.flattenDeclareStatement(node);
    const topLevelMembers = new Map<BuilderDeclareItem, TypeDescriptions.Any>();
    const compositeParents: TypeDescriptions.Composite[] = [];
    let previousLevel: number | undefined = undefined;
    for (const item of items) {
      const attributes = builder.collectAttributes(item);
      compilationUnit.diagnostics.addAll(
        DiagnosticCategory.TypeSystem,
        attributes.diagnostics,
      );
      if (builder.isCompositeDeclaredItem(item, attributes)) {
        const compositeType = builder.handleCompositeDeclaredItem(
          item,
          attributes,
        );
        compilationUnit.services.typeCache.set(item.node, compositeType);
        if (previousLevel === undefined) {
          topLevelMembers.set(item, compositeType);
          compositeParents.push(compositeType);
        } else {
          while (previousLevel && compositeType.level < previousLevel) {
            compositeParents.pop();
            previousLevel =
              compositeParents.length > 0
                ? compositeParents[compositeParents.length - 1].level
                : undefined;
          }
          if (previousLevel && compositeType.level > previousLevel) {
            const parent = compositeParents[compositeParents.length - 1];
            compositeAddMember(parent, item, compositeType);
            compositeParents.push(compositeType);
          } else {
            if (compositeParents.length > 0) {
              compositeParents.pop();
            }
            if (compositeParents.length > 0) {
              const parent = compositeParents[compositeParents.length - 1];
              compositeAddMember(parent, item, compositeType);
            } else {
              topLevelMembers.set(item, compositeType);
            }
            compositeParents.push(compositeType);
          }
        }
        previousLevel = compositeType.level;
      } else {
        const primitiveType = builder.handlePrimitiveDeclaredItem(
          item,
          attributes,
          compilationUnit,
        );
        compilationUnit.services.typeCache.set(item.node, primitiveType);
        if (item.level === undefined) {
          topLevelMembers.set(item, primitiveType);
        } else {
          while (previousLevel && item.level < previousLevel) {
            compositeParents.pop();
            previousLevel =
              compositeParents.length > 0
                ? compositeParents[compositeParents.length - 1].level
                : undefined;
          }
          if (previousLevel && item.level > previousLevel) {
            const parent = compositeParents[compositeParents.length - 1];
            compositeAddMember(parent, item, primitiveType);
          } else {
            if (compositeParents.length > 0) {
              const parent = compositeParents[compositeParents.length - 1];
              compositeAddMember(parent, item, primitiveType);
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

    function compositeAddMember(
      compositeType: TypeDescriptions.Composite,
      item: BuilderDeclareItem,
      memberType: TypeDescriptions.Any,
    ) {
      compositeType.members.set(item.node, memberType);
      compositeType.membersMetadata.set(item.node, item);
      memberType.parentType = compositeType;
      memberType.variableNode = item.node;
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
      if (TypeDescriptions.isComposite(type)) {
        const subMembers = new Map<BuilderDeclareItem, TypeDescriptions.Any>(
          type.members
            .keys()
            .map(
              (key) =>
                [
                  type.membersMetadata.get(key)!,
                  type.members.get(key)!,
                ] as const,
            ),
        );
        this.traverseMembers(subMembers, predicate, callback, false);
      }
    });
  }

  private inferDeclaredItem(
    node: ast.DeclaredItem,
    compilationUnit: CompilationUnit,
  ): void {
    let parent: ast.SyntaxNode | null = node;
    while (
      parent &&
      ![
        ast.SyntaxKind.DeclareStatement,
        ast.SyntaxKind.DefineStructureStatement,
      ].includes(parent.kind)
    ) {
      parent = parent.container;
    }
    if (parent) {
      assertType<ast.DeclareStatement | ast.DefineStructureStatement>(parent);
      this.inferType(parent, compilationUnit);
    }
  }
}
