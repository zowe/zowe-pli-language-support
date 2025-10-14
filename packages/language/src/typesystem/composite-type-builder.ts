import {
  DefaultAttributeEnum,
  DefaultAttributeToEnum,
} from "../parser/token-mappings";
import { Token } from "../parser/tokens";
import { assertType } from "../preprocessor/util";
import * as ast from "../syntax-tree/ast";
import { CompilationUnit } from "../workspace/compilation-unit";
import { TypeDescriptions } from "./descriptions";
import { DefaultPrimitiveTypeBuilder } from "./primitive-type-builder";

export interface BuilderDeclareItem {
  name: string;
  nameToken: Token;
  node: ast.SyntaxNode;
  attributes: ast.DeclarationAttribute[];
  level?: number;
}

export interface CompositeTypeBuilder {
  flattenDeclareStatement(
    declareStatement: ast.DeclareStatement,
  ): BuilderDeclareItem[];
  isCompositeDeclaredItem(declaredItem: BuilderDeclareItem): boolean;
  handleCompositeDeclaredItem(
    declaredItem: BuilderDeclareItem,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Structure;
  handlePrimitiveDeclaredItem(
    declaredItem: BuilderDeclareItem,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any;
}

export class DefaultCompositeTypeBuilder implements CompositeTypeBuilder {
  handleCompositeDeclaredItem(
    declaredItem: BuilderDeclareItem,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Structure {
    //TODO handle UNION and other composite types
    return TypeDescriptions.Structure({
      level: declaredItem.level!,
      members: {},
    });
  }
  handlePrimitiveDeclaredItem(
    declaredItem: BuilderDeclareItem,
    compilationUnit: CompilationUnit,
  ): TypeDescriptions.Any {
    const builder = new DefaultPrimitiveTypeBuilder(declaredItem.nameToken);
    for (const attr of declaredItem.attributes) {
      builder.addAttribute(attr);
    }
    const { type, diagnostics } = builder.build();
    compilationUnit.diagnostics.typeSystem.push(...diagnostics);
    return type;
  }
  isCompositeDeclaredItem(declaredItem: BuilderDeclareItem): boolean {
    const CompositeAttributeKinds: DefaultAttributeEnum[] = [
      //TODO add more composite types if needed
      DefaultAttributeEnum.UNION,
      DefaultAttributeEnum.STRUCTURE,
    ];
    function isOnlyCompositeAttribute(attr: ast.DeclarationAttribute): boolean {
      if (attr.kind === ast.SyntaxKind.ComputationDataAttribute) {
        assertType<number>(attr.typeToken?.tokenTypeIdx);
        const typeAsEnum = DefaultAttributeToEnum[attr.typeToken.tokenTypeIdx];
        return CompositeAttributeKinds.includes(typeAsEnum);
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
