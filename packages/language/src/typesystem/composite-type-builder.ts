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
import { Token } from "../parser/tokens";
import * as ast from "../syntax-tree/ast";
import { DiagnosticCategory } from "../validation/diagnostics-store";
import { CompilationUnit } from "../workspace/compilation-unit";
import {
  AttributeCollectorResult,
  DefaultTypeAttributeCollector,
} from "./attribute-witnesses";
import {
  AttributeKind,
  BuilderDeclareItem,
  DataType,
  TypeDescriptions,
} from "./descriptions";
import { DefaultPrimitiveTypeBuilder } from "./primitive-type-builder";

export interface CompositeTypeBuilder {
  flattenDeclareStatement(
    declareStatement: ast.DeclareStatement | ast.DefineStructureStatement,
  ): BuilderDeclareItem[];
  collectAttributes(
    nameToken: Token,
    attributes: ast.DeclarationAttribute[],
    inPreprocessor: boolean,
  ): AttributeCollectorResult;
  isCompositeDeclaredItem(
    declaredItem: BuilderDeclareItem,
    attributes: AttributeCollectorResult,
  ): boolean;
  handleCompositeDeclaredItem(
    declaredItem: BuilderDeclareItem,
    attributes: AttributeCollectorResult,
  ): TypeDescriptions.Composite;
  handlePrimitiveDeclaredItem(
    nameToken: Token,
    attributes: AttributeCollectorResult,
  ): TypeDescriptions.Any;
}

export class DefaultCompositeTypeBuilder implements CompositeTypeBuilder {
  constructor(private unit: CompilationUnit) {}
  handleCompositeDeclaredItem(
    declaredItem: BuilderDeclareItem,
    attributes: AttributeCollectorResult,
  ): TypeDescriptions.Composite {
    const hasUnion = declaredItem.attributes.some(
      (attr) =>
        attr.kind === ast.SyntaxKind.ComputationDataAttribute &&
        attr.type === ast.DefaultAttribute.UNION,
    );
    return TypeDescriptions.createComposite({
      type: hasUnion ? DataType.Union : DataType.Structure,
      witnesses: attributes.witnesses,
      level: declaredItem.level ?? 1,
      variableNode: declaredItem.node,
    });
  }
  handlePrimitiveDeclaredItem(
    nameToken: Token,
    attributes: AttributeCollectorResult,
  ): TypeDescriptions.Any {
    const builder = new DefaultPrimitiveTypeBuilder(
      nameToken,
      attributes,
      this.unit,
    );
    const { type, diagnostics } = builder.build();
    this.unit.diagnostics.addAll(DiagnosticCategory.TypeSystem, diagnostics);
    return type;
  }
  collectAttributes(
    nameToken: Token,
    attributes: ast.DeclarationAttribute[],
    inPreprocessor: boolean,
  ): AttributeCollectorResult {
    const collector = new DefaultTypeAttributeCollector(
      nameToken,
      this.unit,
      inPreprocessor,
    );
    for (const attr of attributes) {
      collector.addAttribute(attr);
    }
    return collector.build();
  }
  isCompositeDeclaredItem(
    declaredItem: BuilderDeclareItem,
    attributes: AttributeCollectorResult,
  ): boolean {
    //required for "generic" parameters only coming from builtin functions
    const isDataTypeGeneric =
      attributes.witnesses.witnesses[AttributeKind.DataTypeIsGeneric]?.value;
    if (isDataTypeGeneric) {
      const dataType =
        attributes.witnesses.witnesses[AttributeKind.DataType]?.value;
      return dataType === DataType.Structure || dataType === DataType.Union;
    }
    const validCompositeAttributeKinds: AttributeKind[] = [
      AttributeKind.Dimension,
      AttributeKind.Alignment,
      AttributeKind.Storage,
    ];
    return (
      declaredItem.level !== undefined &&
      attributes.witnesses.order.every((kind) =>
        validCompositeAttributeKinds.includes(kind),
      )
    );
  }
  flattenDeclareStatement(
    declareStatement: ast.DeclareStatement | ast.DefineStructureStatement,
  ): BuilderDeclareItem[] {
    return declareStatement.items.flatMap((item) =>
      this.flattenDeclaredItem(item),
    );
  }
  private flattenDeclaredItem(
    declaredItem: ast.DeclaredItem,
  ): BuilderDeclareItem[] {
    const items: BuilderDeclareItem[] = [];
    for (const element of declaredItem.elements) {
      if (element.kind === ast.SyntaxKind.DeclaredItem) {
        for (const item of this.flattenDeclaredItem(element)) {
          items.push({
            ...item,
            level: declaredItem.level ?? undefined,
            attributes: [...item.attributes, ...declaredItem.attributes],
          });
        }
      } else if (element.kind === ast.SyntaxKind.DeclaredVariable) {
        items.push({
          name: element.name!,
          nameToken: element.nameToken!,
          node: element,
          level: declaredItem.level ?? undefined,
          attributes: [...declaredItem.attributes],
        });
      } else {
        //element.kind === ast.SyntaxKind.Wildcard
        //TODO handle wildcard
      }
    }
    return items;
  }
}
