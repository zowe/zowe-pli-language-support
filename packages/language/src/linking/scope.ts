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

export interface GetSymbolsOptions {
  searchOnlyImmediateScope?: boolean;
}

/**
 * The Scope class is used to store the symbol table for a given scope.
 * When getting a symbol, the scope will check its own symbol table first,
 * then the parent scope, and so on.
 */
export class Scope {
  private constructor(
    private readonly parent: Scope | null,
    public readonly symbolTable: SymbolTable,
  ) {}

  static createRoot() {
    return new Scope(null, new SymbolTable());
  }

  static createChild(parent: Scope) {
    return new Scope(parent, new SymbolTable());
  }

  getTypeSymbols(
    qualifiedName: readonly string[],
    options: GetSymbolsOptions = {},
  ): readonly QualifiedSyntaxNode[] {
    const immediateSymbols = this.symbolTable.getTypeSymbols(qualifiedName);

    if (options.searchOnlyImmediateScope) {
      return immediateSymbols ?? [];
    }

    return (
      immediateSymbols ??
      this.parent?.getTypeSymbols(qualifiedName, options) ??
      []
    );
  }

  getExplicitSymbols(
    qualifiedName: readonly string[],
    options: GetSymbolsOptions = {},
  ): readonly QualifiedSyntaxNode[] {
    const immediateSymbols =
      this.symbolTable?.getExplicitSymbols(qualifiedName);

    if (options.searchOnlyImmediateScope) {
      return immediateSymbols ?? [];
    }

    return (
      immediateSymbols ??
      this.parent?.getExplicitSymbols(qualifiedName, options) ??
      []
    );
  }

  getImplicitSymbols(
    qualifiedName: readonly string[],
    options: GetSymbolsOptions = {},
  ): readonly QualifiedSyntaxNode[] {
    const immediateSymbols =
      this.symbolTable?.getImplicitSymbols(qualifiedName);

    if (options.searchOnlyImmediateScope) {
      return immediateSymbols ?? [];
    }

    return (
      immediateSymbols ??
      this.parent?.getImplicitSymbols(qualifiedName, options) ??
      []
    );
  }

  allDistinctTypeSymbols(
    qualifiedName: string[],
    symbols: QualifiedSyntaxNode[] = [],
  ): QualifiedSyntaxNode[] {
    if (this.symbolTable) {
      symbols.push(...this.symbolTable.allDistinctTypeSymbols(qualifiedName));
    }
    if (this.parent) {
      this.parent.allDistinctTypeSymbols(qualifiedName, symbols);
    }
    return symbols;
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
  private uniqueScopes = new Set<Scope>();

  add(node: SyntaxNode, scope: Scope): void {
    this.scopes.set(node, scope);
    this.uniqueScopes.add(scope);
  }

  get(node: SyntaxNode): Scope | undefined {
    const existing = this.scopes.get(node);
    if (existing) {
      return existing;
    }
    // Get container node scope
    const parentNode = node.container;
    if (parentNode) {
      return this.get(parentNode);
    }
    return undefined;
  }

  clear(): void {
    this.scopes.clear();
    this.uniqueScopes.clear();
  }

  values(): IterableIterator<Scope> {
    return this.uniqueScopes.values();
  }
}
