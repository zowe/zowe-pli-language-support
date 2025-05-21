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

import { SyntaxNode } from "../syntax-tree/ast";
import { QualifiedSyntaxNode } from "./qualified-syntax-node";
import { SymbolTable } from "./symbol-table";

/**
 * The Scope class is used to store the symbol table for a given scope.
 * When getting a symbol, the scope will check its own symbol table first,
 * then the parent scope, and so on.
 */
export class Scope {
  public symbolTable: SymbolTable;
  private parent: Scope | null;

  constructor(parent: Scope | null, symbolTable: SymbolTable | null = null) {
    this.parent = parent;
    this.symbolTable = symbolTable ?? new SymbolTable();
  }

  getSymbols(qualifiedName: readonly string[]): readonly QualifiedSyntaxNode[] {
    return (
      this.symbolTable?.getSymbols(qualifiedName) ??
      this.parent?.getSymbols(qualifiedName) ??
      []
    );
  }

  allDistinctSymbols(
    qualifiedName: string[],
    symbols: QualifiedSyntaxNode[] = [],
  ): QualifiedSyntaxNode[] {
    if (this.symbolTable) {
      symbols.push(...this.symbolTable.allDistinctSymbols(qualifiedName));
    }
    if (this.parent) {
      this.parent.allDistinctSymbols(qualifiedName, symbols);
    }
    return symbols;
  }
}

export class ScopeCacheGroups {
  regular = new ScopeCache();
  preprocessor = new ScopeCache();

  clear(): void {
    this.regular.clear();
    this.preprocessor.clear();
  }

  get(node: SyntaxNode): Scope | undefined {
    return this.regular.get(node) ?? this.preprocessor.get(node);
  }
}

/**
 * The scope cache is used to relate a syntax node to its scope.
 */
export class ScopeCache {
  private scopes: Map<SyntaxNode, Scope> = new Map();

  add(node: SyntaxNode, scope: Scope): void {
    this.scopes.set(node, scope);
  }

  get(node: SyntaxNode): Scope | undefined {
    return this.scopes.get(node);
  }

  clear(): void {
    this.scopes.clear();
  }

  values(): Scope[] {
    return Array.from(this.scopes.values());
  }
}
