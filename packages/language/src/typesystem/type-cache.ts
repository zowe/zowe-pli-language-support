import { SyntaxNode } from "../syntax-tree/ast";
import { TypeDescriptions } from "./descriptions";

export interface TypeCache {
  get(
    node: SyntaxNode,
    getter: () => TypeDescriptions.Any,
  ): TypeDescriptions.Any;
  clear(): void;
}

export class DefaultTypeCache implements TypeCache {
  private cache = new Map<SyntaxNode, TypeDescriptions.Any>();

  clear() {
    this.cache.clear();
  }

  get(
    node: SyntaxNode,
    getter: () => TypeDescriptions.Any,
  ): TypeDescriptions.Any {
    if (this.cache.has(node)) {
      return this.cache.get(node)!;
    }
    const description = getter();
    this.cache.set(node, description);
    return description;
  }
}
