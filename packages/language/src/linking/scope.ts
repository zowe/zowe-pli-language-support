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
import { CompilationUnit } from "../workspace/compilation-unit";
import { QualifiedSyntaxNode } from "./qualified-syntax-node";
import { SymbolTable } from "./symbol-table";

/**
 * The Scope class is used to store the symbol table for a given scope.
 * When getting a symbol, the scope will check its own symbol table first,
 * then the parent scope, and so on.
 */
export class Scope {
  private constructor(
    private readonly unit: CompilationUnit,
    private readonly parent: Scope | null,
    public readonly symbolTable: SymbolTable,
  ) {}

  static createRoot(unit: CompilationUnit) {
    return new Scope(unit, null, new SymbolTable(unit));
  }

  static createChild(parent: Scope) {
    return new Scope(parent.unit, parent, new SymbolTable(parent.unit));
  }

  getExplicitSymbols(
    qualifiedName: readonly string[],
  ): readonly QualifiedSyntaxNode[] {
    return (
      this.symbolTable?.getExplicitSymbols(qualifiedName) ??
      this.parent?.getExplicitSymbols(qualifiedName) ??
      []
    );
  }

  getImplicitSymbols(
    qualifiedName: readonly string[],
  ): readonly QualifiedSyntaxNode[] {
    return (
      this.symbolTable?.getImplicitSymbols(qualifiedName) ??
      this.parent?.getImplicitSymbols(qualifiedName) ??
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
  private uniqueScopes = new Set<Scope>();

  add(node: SyntaxNode, scope: Scope): void {
    this.scopes.set(node, scope);
    this.uniqueScopes.add(scope);
  }

  get(node: SyntaxNode): Scope | undefined {
    return this.scopes.get(node);
  }

  clear(): void {
    this.scopes.clear();
    this.uniqueScopes.clear();
  }

  values(): Scope[] {
    return Array.from(this.uniqueScopes);
  }
}
