import { SyntaxNode } from "../syntax-tree/ast";
import { TypesDescriptions } from "./descriptions";

export interface TypeCache {
    get(
        node: SyntaxNode,
        getter: () => TypesDescriptions.Any,
    ): TypesDescriptions.Any;
  reset(): void;
}

export class DefaultTypeCache implements TypeCache{
  private cache = new Map<SyntaxNode, TypesDescriptions.Any>();

  reset() {
    this.cache.clear();
  }

  get(
    node: SyntaxNode,
    getter: () => TypesDescriptions.Any,
  ): TypesDescriptions.Any {
    if (this.cache.has(node)) {
      return this.cache.get(node)!;
    }
    const description = getter();
    this.cache.set(node, description);
    return description;
  }
}