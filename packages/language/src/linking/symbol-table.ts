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

import { SyntaxKind, SyntaxNode } from "../syntax-tree/ast";
import { forEachNode } from "../syntax-tree/ast-iterator";
import { CompilationUnit } from "../workspace/compilation-unit";
import { ReferencesCache } from "./resolver";
import { getReference, getSymbol } from "./tokens";

export class SymbolTable {
  private symbols: Map<string, SyntaxNode> = new Map();

  addSymbol(name: string, node: SyntaxNode): void {
    this.symbols.set(name, node);
  }

  addVariableSymbol(name: string, node: SyntaxNode): void {
    this.symbols.set(name, node);
  }

  addLabelSymbol(name: string, node: SyntaxNode): void {
    this.symbols.set(name, node);
  }

  getSymbol(name: string): SyntaxNode | undefined {
    return this.symbols.get(name);
  }

  hasSymbol(name: string): boolean {
    return this.symbols.has(name);
  }

  clear(): void {
    this.symbols.clear();
  }
}

// The Scope class is used to store the symbol table for a given scope.
// When getting a symbol, the scope will check its own symbol table first,
// then the parent scope, and so on.
export class Scope {
  private _symbolTable: SymbolTable | null;
  private parent: Scope | null;

  constructor(
    parent: Scope | null,
    symbolTable: SymbolTable = new SymbolTable(),
  ) {
    this.parent = parent;
    this._symbolTable = symbolTable;
  }

  getSymbol(name: string): SyntaxNode | undefined {
    return (
      this._symbolTable?.getSymbol(name) ??
      this.parent?.getSymbol(name) ??
      undefined
    );
  }

  // This is a lazy getter for the symbol table to
  // prevent unnecessary memory allocation for scopes
  // that do not have a symbol table.
  get symbolTable(): SymbolTable {
    if (!this._symbolTable) {
      this._symbolTable = new SymbolTable();
    }

    return this._symbolTable;
  }
}

// The scope cache is used to relate a syntax node to its scope.
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
}

export function iterateSymbols(compilationUnit: CompilationUnit): void {
  const { scopeCache, references } = compilationUnit;

  // Todo: The root scope should contain global PL1 standard library symbols.
  const builtInSymbols = new SymbolTable();
  const scope = new Scope(null, builtInSymbols);

  iterate(compilationUnit.ast, scopeCache, scope, references);
}

// This function iterates over the syntax tree and builds the symbol table.
function iterate(
  node: SyntaxNode,
  scopeCache: ScopeCache,
  parentScope: Scope,
  references: ReferencesCache,
): Scope {
  // While we're here, let's also add the reference to our cache
  const ref = getReference(node);
  if (ref) {
    references.add(ref);
  }

  // Maybe create a new scope for this node,
  // if it is a containing node. Otherwise,
  // use the parent scope.
  let scope = getNewScope(node, parentScope);
  scopeCache.add(node, scope);

  // If this node is declaring a symbol, we
  // register it to the symbol table in the
  // current scope.
  const symbol = getSymbol(node);
  if (symbol) {
    // If the symbol already exists in the current scope,
    // we forcibly create a new scope to allow for redeclarations.
    if (scope.symbolTable.hasSymbol(symbol)) {
      scope = new Scope(parentScope);
    }

    scope.symbolTable.addSymbol(symbol, node);
  }

  forEachNode(node, (child) => {
    // Set the parent node on our first iteration through the file
    child.container = node;

    // Iterate over the child node. The child node may contain
    // redeclared symbols, which requires that we create a new
    // scope. That's why we overwrite the scope variable for
    // each iteration.
    scope = iterate(child, scopeCache, scope, references);
  });

  return scope;
}

// This function may return a new scope if the parent
// is a containing node (i.e. creating a new scope).
function getNewScope(parent: SyntaxNode, scope: Scope): Scope {
  switch (parent.kind) {
    case SyntaxKind.PliProgram:
    case SyntaxKind.ProcedureStatement:
      return new Scope(scope);
    default:
      return scope;
  }
}
