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
  collectAttributes(declaredItem: BuilderDeclareItem): AttributeCollectorResult;
  isCompositeDeclaredItem(
    declaredItem: BuilderDeclareItem,
    attributes: AttributeCollectorResult,
  ): boolean;
  handleCompositeDeclaredItem(
    declaredItem: BuilderDeclareItem,
    attributes: AttributeCollectorResult,
  ): TypeDescriptions.Composite;
  handlePrimitiveDeclaredItem(
    declaredItem: BuilderDeclareItem,
    attributes: AttributeCollectorResult,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any;
}

export class DefaultCompositeTypeBuilder implements CompositeTypeBuilder {
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
      level: declaredItem.level,
      variableNode: declaredItem.node,
    });
  }
  handlePrimitiveDeclaredItem(
    declaredItem: BuilderDeclareItem,
    attributes: AttributeCollectorResult,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any {
    const builder = new DefaultPrimitiveTypeBuilder(
      declaredItem.nameToken,
      attributes,
      compilationUnit,
    );
    const { type, diagnostics } = builder.build();
    compilationUnit.diagnostics.addAll(
      DiagnosticCategory.TypeSystem,
      diagnostics,
    );
    return type;
  }
  collectAttributes(
    declaredItem: BuilderDeclareItem,
  ): AttributeCollectorResult {
    const collector = new DefaultTypeAttributeCollector(declaredItem.nameToken);
    for (const attr of declaredItem.attributes) {
      collector.addAttribute(attr);
    }
    return collector.build();
  }
  isCompositeDeclaredItem(
    declaredItem: BuilderDeclareItem,
    attributes: AttributeCollectorResult,
  ): boolean {
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
            level: declaredItem.level ?? 1,
            attributes: [...item.attributes, ...declaredItem.attributes],
          });
        }
      } else if (element.kind === ast.SyntaxKind.DeclaredVariable) {
        items.push({
          name: element.name!,
          nameToken: element.nameToken!,
          node: element,
          level: declaredItem.level ?? 1,
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
