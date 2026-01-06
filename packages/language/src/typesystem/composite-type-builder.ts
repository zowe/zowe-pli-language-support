import * as ast from "../syntax-tree/ast";
import { DiagnosticCategory } from "../validation/diagnostics-store";
import { CompilationUnit } from "../workspace/compilation-unit";
import { BuilderDeclareItem, TypeDescriptions } from "./descriptions";
import { DefaultPrimitiveTypeBuilder } from "./primitive-type-builder";

export interface CompositeTypeBuilder {
  flattenDeclareStatement(
    declareStatement: ast.DeclareStatement,
  ): BuilderDeclareItem[];
  isCompositeDeclaredItem(declaredItem: BuilderDeclareItem): boolean;
  handleCompositeDeclaredItem(
    declaredItem: BuilderDeclareItem,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Structure | TypeDescriptions.Union;
  handlePrimitiveDeclaredItem(
    declaredItem: BuilderDeclareItem,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any;
}

export class DefaultCompositeTypeBuilder implements CompositeTypeBuilder {
  handleCompositeDeclaredItem(
    declaredItem: BuilderDeclareItem,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Structure | TypeDescriptions.Union {
    if(declaredItem.attributes.some(attr => 
      attr.kind === ast.SyntaxKind.ComputationDataAttribute &&
      attr.type === ast.DefaultAttribute.UNION
    )) {
      return TypeDescriptions.Union({
        level: declaredItem.level!,
        members: {},
        membersMetadata: {},
      });      
    }
    return TypeDescriptions.Structure({
      level: declaredItem.level!,
      members: {},
      membersMetadata: {},
    });
  }
  handlePrimitiveDeclaredItem(
    declaredItem: BuilderDeclareItem,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any {
    const builder = new DefaultPrimitiveTypeBuilder(declaredItem.nameToken, compilationUnit);
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
      return false;
    }
    return (
      declaredItem.level !== undefined &&
      (declaredItem.attributes.length === 0 ||
        declaredItem.attributes.every(isOnlyCompositeAttribute))
    );
  }
  flattenDeclareStatement(
    declareStatement: ast.DeclareStatement,
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
