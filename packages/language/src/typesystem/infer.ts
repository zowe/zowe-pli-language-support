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
import { StringFormat, StringKind, TypeDescriptions } from "./descriptions";
import { CompilationUnit } from "../workspace/compilation-unit";
import { DefaultCompositeTypeBuilder } from "./composite-type-builder";
import { BuilderDeclareItem } from "./descriptions";
import { assertType } from "../preprocessor/util";
import { DefaultPrimitiveTypeBuilder } from "./primitive-type-builder";
import { DiagnosticCategory } from "../validation/diagnostics-store";
import { DefaultTypeAttributeCollector } from "./attribute-witnesses";
import { Token } from "../parser/tokens";
import { assertUnreachable } from "../utils/common";

export interface TypeInferer {
  inferType(node: ast.SyntaxNode, unit: CompilationUnit): TypeDescriptions.Any;
  isAssignable(
    source: TypeDescriptions.Any,
    target: TypeDescriptions.Any,
    unit: CompilationUnit,
  ): boolean;
}

const expressionKinds = new Set<ast.SyntaxKind>([
  ast.SyntaxKind.BinaryExpression,
  ast.SyntaxKind.UnaryExpression,
  ast.SyntaxKind.Parenthesis,
  ast.SyntaxKind.WildcardItem,
  ast.SyntaxKind.NumberLiteral,
  ast.SyntaxKind.StringLiteral,
  ast.SyntaxKind.RepeatedExpression,
  ast.SyntaxKind.LocatorCall,
  ast.SyntaxKind.MemberCall,
]);

export class DefaultTypeInferer implements TypeInferer {
  inferType(
    node: ast.SyntaxNode,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any {
    return compilationUnit.services.typeCache.get(node, () => {
      if (expressionKinds.has(node.kind)) {
        return this.inferExpressionType(
          node as ast.Expression,
          compilationUnit,
        );
      } else if (
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
      } else if (node.kind === ast.SyntaxKind.ReturnsOption) {
        return this.inferReturnsOptionType(node, compilationUnit);
      } else if (
        node.kind === ast.SyntaxKind.EntryParameterDescription ||
        node.kind === ast.SyntaxKind.EntryUnionDescription
      ) {
        const parentNode = node.container as ast.EntryAttribute;
        if (parentNode?.entryToken) {
          return this.inferEntryParameterType(
            parentNode.entryToken,
            node,
            compilationUnit,
          );
        }
      } else if (
        node.kind === ast.SyntaxKind.ProcedureParameter &&
        node.ref?.node
      ) {
        return this.inferType(node.ref.node, compilationUnit);
      }
      return TypeDescriptions.Unknown();
    });
  }

  private inferExpressionType(
    expression: ast.Expression | ast.MemberCall,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any {
    switch (expression.kind) {
      case ast.SyntaxKind.MemberCall: {
        //collect chain of members (from bottom to top)
        const chainOfMembers: ast.DeclaredVariable[] = [];
        let topMostLocatorCall = expression;
        while (topMostLocatorCall.previous) {
          if (
            !topMostLocatorCall.element ||
            !topMostLocatorCall.element.ref ||
            !topMostLocatorCall.element.ref.node
          ) {
            return TypeDescriptions.Unknown();
          }
          if (
            topMostLocatorCall.element.ref.node.kind !==
            ast.SyntaxKind.DeclaredVariable
          ) {
            return TypeDescriptions.Unknown();
          }
          chainOfMembers.unshift(topMostLocatorCall.element.ref.node);
          topMostLocatorCall = topMostLocatorCall.previous;
        }
        if (
          !topMostLocatorCall.element?.ref?.node ||
          topMostLocatorCall.element.ref.node.kind !==
            ast.SyntaxKind.DeclaredVariable
        ) {
          return TypeDescriptions.Unknown();
        }
        //get member types (from top to bottom)
        let lastLevel = 1;
        const topMostType = this.inferType(
          topMostLocatorCall.element.ref.node,
          compilationUnit,
        );
        const outerTypes: [
          ast.DeclaredVariable,
          TypeDescriptions.Any,
          number,
        ][] = [[topMostLocatorCall.element.ref.node, topMostType, 1]];
        let currentComposite = topMostType;
        let levelIsGenerated = false;
        for (const member of chainOfMembers) {
          if (!TypeDescriptions.isComposite(currentComposite)) {
            return TypeDescriptions.Unknown();
          }
          if (member.kind !== ast.SyntaxKind.DeclaredVariable) {
            return TypeDescriptions.Unknown();
          }
          const memberType = currentComposite.members.get(member);
          if (!memberType) {
            return TypeDescriptions.Unknown();
          }
          const metadata = currentComposite.membersMetadata.get(member)!;
          levelIsGenerated ||= metadata.attributes.some(
            (attr) =>
              attr.kind === ast.SyntaxKind.LikeAttribute ||
              attr.kind === ast.SyntaxKind.TypeAttribute,
          );
          const level = levelIsGenerated ? lastLevel + 1 : metadata.level!;
          outerTypes.unshift([member, memberType, level]);
          currentComposite = memberType;
          lastLevel = level;
        }
        if (
          !expression.element?.ref?.node ||
          expression.element.ref.node.kind !== ast.SyntaxKind.DeclaredVariable
        ) {
          return TypeDescriptions.Unknown();
        }
        const [_, bottomMostType, bottomMostLevel] = outerTypes[0];
        const outerComposites = outerTypes.slice(1) as [
          ast.DeclaredVariable,
          TypeDescriptions.Composite,
          number,
        ][];

        //construct final type (bottom to top)
        let lastMemberLevel = bottomMostLevel;
        let resultType: TypeDescriptions.Any = bottomMostType;
        for (const [variableNode, compositeType, level] of outerComposites) {
          const members = new Map<ast.DeclaredVariable, TypeDescriptions.Any>();
          const membersMetadata = new Map<
            ast.DeclaredVariable,
            BuilderDeclareItem
          >();
          compositeType.members.forEach((memberType, memberVar) => {
            let metadata = compositeType.membersMetadata.get(memberVar);
            if (memberVar === resultType.variableNode) {
              memberType = resultType;
              metadata = {
                ...metadata,
                level: lastMemberLevel,
                node: memberVar,
              } as BuilderDeclareItem;
            }
            members.set(memberVar, memberType);
            if (metadata) {
              membersMetadata.set(memberVar, metadata);
            }
          });
          const outerType = {
            ...compositeType,
            parentType: undefined,
            variableNode,
            level,
            members,
            membersMetadata,
          };
          resultType.parentType = outerType;
          resultType = outerType;
          lastMemberLevel = level;
        }
        return bottomMostType;
      }
      case ast.SyntaxKind.LocatorCall:
        if (expression.element?.element?.ref?.node) {
          return this.inferType(
            expression.element.element.ref.node,
            compilationUnit,
          );
        }
        return TypeDescriptions.Unknown();
      case ast.SyntaxKind.Parenthesis: {
        if (expression.expressions.length === 0) {
          return TypeDescriptions.Unknown();
        }
        // Infer type of the first expression inside the parenthesis
        return this.inferType(expression.expressions[0], compilationUnit);
      }
      case ast.SyntaxKind.NumberLiteral: {
        const initial = ast.createInitialAttribute();
        initial.expressions.push(expression);
        return TypeDescriptions.Arithmetic({
          initial,
        });
      }
      case ast.SyntaxKind.StringLiteral: {
        const initial = ast.createInitialAttribute();
        initial.expressions.push(expression);
        const value = expression.value || "";
        return TypeDescriptions.String({
          format: StringFormat.NonVarying,
          initial,
          stringBits: {
            //TODO handle other string kinds
            kind: value.endsWith("wx")
              ? StringKind.WideChar
              : StringKind.Character,
            //TODO set corrrect string length
            length: value.length,
          },
        });
      }
      case ast.SyntaxKind.UnaryExpression:
        if (expression.expr) {
          return this.inferExpressionType(expression.expr, compilationUnit);
        }
        return TypeDescriptions.Unknown();
      case ast.SyntaxKind.BinaryExpression:
        //TODO implement
        return TypeDescriptions.Unknown();
      case ast.SyntaxKind.RepeatedExpression:
        if (expression.expression) {
          return this.inferExpressionType(
            expression.expression,
            compilationUnit,
          );
        }
        return TypeDescriptions.Unknown();
      case ast.SyntaxKind.WildcardItem:
        //TODO: this is in most cases invalid, but not everywhere
        return TypeDescriptions.Unknown();
      default:
        assertUnreachable(expression);
    }
  }

  private inferReturnsOptionType(
    node: ast.ReturnsOption,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any {
    if (!node.returnsToken) {
      return TypeDescriptions.Unknown();
    }
    const builder = new DefaultCompositeTypeBuilder(compilationUnit);
    const attributes = builder.collectAttributes(
      node.returnsToken,
      node.returnAttributes,
      ast.isPreprocessorNode(compilationUnit, node),
    );
    compilationUnit.diagnostics.addAll(
      DiagnosticCategory.TypeSystem,
      attributes.diagnostics,
    );
    return builder.handlePrimitiveDeclaredItem(node.returnsToken, attributes);
  }

  private inferEntryParameterType(
    nameToken: Token,
    node: ast.EntryParameterDescription | ast.EntryUnionDescription,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any {
    const builder = new DefaultCompositeTypeBuilder(compilationUnit);
    const attributes = builder.collectAttributes(
      nameToken,
      node.attributes,
      ast.isPreprocessorNode(compilationUnit, node),
    );
    compilationUnit.diagnostics.addAll(
      DiagnosticCategory.TypeSystem,
      attributes.diagnostics,
    );
    return builder.handlePrimitiveDeclaredItem(nameToken, attributes);
  }

  private inferOrdinalType(
    node: ast.DefineOrdinalStatement,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any {
    if (!node.nameToken) {
      return TypeDescriptions.Unknown();
    }
    const collector = new DefaultTypeAttributeCollector(
      node.nameToken,
      compilationUnit,
      false,
    );
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
      const literal = ast.createNumberLiteral();
      literal.value = node.precision;
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
    const collector = new DefaultTypeAttributeCollector(
      node.nameToken,
      compilationUnit,
      false,
    );
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
    let previousItemLevel: number | undefined = undefined;
    for (const item of items) {
      const attributes = builder.collectAttributes(
        item.nameToken,
        item.attributes,
        ast.isPreprocessorNode(compilationUnit, node),
      );
      compilationUnit.diagnostics.addAll(
        DiagnosticCategory.TypeSystem,
        attributes.diagnostics,
      );
      const type = builder.isCompositeDeclaredItem(item, attributes)
        ? builder.handleCompositeDeclaredItem(item, attributes)
        : builder.handlePrimitiveDeclaredItem(item.nameToken, attributes);
      compilationUnit.services.typeCache.set(item.node, type);
      if (previousItemLevel === undefined || item.level === undefined) {
        topLevelMembers.set(item, type);
      } else {
        while (
          compositeParents.length > 0 &&
          compositeParents[compositeParents.length - 1].level >= item.level
        ) {
          compositeParents.pop();
        }
        if (compositeParents.length > 0) {
          compositeAddMember(
            compositeParents[compositeParents.length - 1],
            item,
            type,
          );
        } else {
          topLevelMembers.set(item, type);
        }
      }
      if (TypeDescriptions.isComposite(type)) {
        compositeParents.push(type);
      }
      previousItemLevel = item.level;
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

  isAssignable(
    source: TypeDescriptions.Any,
    target: TypeDescriptions.Any,
    _unit: CompilationUnit,
  ): boolean {
    //TODO respect isDataTypeGeneric flag and other attributes that can influence assignability
    if (source.type === target.type) {
      return true;
    }
    if (
      TypeDescriptions.isArithmetic(source) &&
      TypeDescriptions.isString(target)
    ) {
      return true;
    }
    if (
      TypeDescriptions.isString(source) &&
      TypeDescriptions.isArithmetic(target)
    ) {
      if (!source.initial || source.initial.expressions.length === 0) {
        return true;
      }
      const value = this.extractLiteralValue(source.initial.expressions[0]);
      if (value !== undefined) {
        return !isNaN(Number(value)) && value.trim() !== "";
      }
      return true;
    }
    return true;
  }

  private extractLiteralValue(
    expression: ast.Expression | undefined | null,
  ): string | undefined {
    if (
      expression &&
      expression.kind === ast.SyntaxKind.StringLiteral &&
      typeof expression.value === "string"
    ) {
      const literalValue = expression.value;
      const firstLetter = literalValue[0];
      if (firstLetter === '"' || firstLetter === "'") {
        const closeingQuoteIndex = literalValue.lastIndexOf(firstLetter);
        if (closeingQuoteIndex > 0) {
          return literalValue.substring(1, closeingQuoteIndex);
        }
      }
      return literalValue;
    }
    return undefined;
  }
}
