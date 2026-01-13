import * as ast from "../syntax-tree/ast";
import { DiagnosticCategory } from "../validation/diagnostics-store";
import { CompilationUnit } from "../workspace/compilation-unit";
import { computeDimensions } from "./computed-attributes";
import { BuilderDeclareItem, DataType, TypeDescriptions } from "./descriptions";
import { DefaultPrimitiveTypeBuilder } from "./primitive-type-builder";

export interface CompositeTypeBuilder {
  flattenDeclareStatement(
    declareStatement: ast.DeclareStatement | ast.DefineStructureStatement,
  ): BuilderDeclareItem[];
  isCompositeDeclaredItem(declaredItem: BuilderDeclareItem): boolean;
  handleCompositeDeclaredItem(
    declaredItem: BuilderDeclareItem,
  ): TypeDescriptions.Composite;
  handlePrimitiveDeclaredItem(
    declaredItem: BuilderDeclareItem,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any;
}

export class DefaultCompositeTypeBuilder implements CompositeTypeBuilder {
  handleCompositeDeclaredItem(
    declaredItem: BuilderDeclareItem,
  ): TypeDescriptions.Composite {
    const dimensionsAttr = declaredItem.attributes.find(
      (attr) => attr.kind === ast.SyntaxKind.DimensionsDataAttribute,
    ) as ast.DimensionsDataAttribute | undefined;
    const dimension =
      dimensionsAttr && dimensionsAttr.dimensions
        ? computeDimensions(dimensionsAttr.dimensions)
        : undefined;
    const hasUnion = declaredItem.attributes.some(
      (attr) =>
        attr.kind === ast.SyntaxKind.ComputationDataAttribute &&
        attr.type === ast.DefaultAttribute.UNION,
    );
    return TypeDescriptions.Composite(hasUnion ? DataType.Union : DataType.Structure,{
      level: declaredItem.level,
      dimension,
      variableNode: declaredItem.node,
    });
  }
  handlePrimitiveDeclaredItem(
    declaredItem: BuilderDeclareItem,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any {
    const builder = new DefaultPrimitiveTypeBuilder(
      declaredItem.nameToken,
      compilationUnit,
    );
    for (const attr of declaredItem.attributes) {
      builder.addAttribute(attr);
    }
    const { type, diagnostics } = builder.build();
    compilationUnit.diagnostics.addAll(
      DiagnosticCategory.TypeSystem,
      diagnostics,
    );
    return type;
  }
  isCompositeDeclaredItem(declaredItem: BuilderDeclareItem): boolean {
    const CompositeAttributeKinds: ast.DefaultAttribute[] = [
      //TODO add more composite types if needed
      ast.DefaultAttribute.UNION,
      ast.DefaultAttribute.DIMACROSS,
    ];
    function isOnlyCompositeAttribute(attr: ast.DeclarationAttribute): boolean {
      if (
        attr.kind === ast.SyntaxKind.ComputationDataAttribute &&
        attr.type !== null &&
        attr.typeToken !== null
      ) {
        return CompositeAttributeKinds.includes(attr.type);
      }
      return attr.kind === ast.SyntaxKind.DimensionsDataAttribute;
    }
    return (
      declaredItem.level !== undefined &&
      (declaredItem.attributes.length === 0 ||
        declaredItem.attributes.every(isOnlyCompositeAttribute))
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
