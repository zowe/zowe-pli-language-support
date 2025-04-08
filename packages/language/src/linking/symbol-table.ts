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

import { ProcedureStatement, SyntaxKind, SyntaxNode } from "../syntax-tree/ast";
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

  constructor(parent: Scope | null, symbolTable: SymbolTable | null = null) {
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

  // Iterate over the PLI program.
  // The returned scope should be the "exported" scope of the file,
  // if that should ever become relevant.
  iterate(compilationUnit.ast, scopeCache, scope, references);
}

// This function iterates over the syntax tree and builds the symbol table.
function iterate(
  node: SyntaxNode,
  scopeCache: ScopeCache,
  parentScope: Scope,
  references: ReferencesCache,
) {
  // While we're here, let's also add the reference to our cache
  const ref = getReference(node);
  if (ref) {
    references.add(ref);
  }

  // If we are declaring a local variable, we create a
  // new scope to prevent usage of this symbol before it is declared.
  // This also makes it possible to redeclare the same variable name.
  // Labels are global in a scope, so we don't need
  // to create a new scope for them.
  if (node.kind === SyntaxKind.DeclaredVariable) {
    parentScope = new Scope(parentScope);
  }

  /**
   * TODO: Figure out how to label shadowing is supposed to work in PLI.
   */

  // Add the symbol to the symbol table in the current scope.
  const symbol = getSymbol(node);
  if (symbol) {
    parentScope.symbolTable.addSymbol(symbol, node);
  }

  // We connect the current node to its scope for usage in the
  // linking phase.
  scopeCache.add(node, parentScope);

  // Are we entering a containing node? Then we should create a new scope
  // for all our children.
  let shouldCreateNewScope = shouldNodeCreateNewScope(node);
  let scope = parentScope;
  if (shouldCreateNewScope) {
    scope = new Scope(parentScope);
  }

  // Function to recursively iterate over the child nodes
  // to build their symbol table.
  // CAUTION: This function has two side effects:
  // * it sets the container property on the child node.
  // * it may overwrite the scope variable if a child node returns a new scope.
  // This is done to enable redeclarations of local variables.
  const iterateChild = (child: SyntaxNode) => {
    // Set the parent node on our first iteration through the file
    child.container = node;

    // Iterate over the child node. The child node may return
    // a new scope, which siblings should have access to.
    scope = iterate(child, scopeCache, scope, references);
  };

  // This switch statement handles the special case of a procedure statement.
  switch (node.kind) {
    // A procedure statement's end node is a child node, but scope-wise, the end
    // node should be part of the parent scope of the procedure statement, to
    // properly link to the procedure's label.
    case SyntaxKind.ProcedureStatement:
      // Remove the end node from the procedure statement,
      // to process it as a sibling node.
      const procedure: ProcedureStatement = {
        ...node,
        end: null,
      };
      forEachNode(procedure, iterateChild);
      if (node.end) {
        iterate(node.end, scopeCache, parentScope, references);
        node.end.container = node;
      }
      break;
    default:
      forEachNode(node, iterateChild);
  }

  if (shouldCreateNewScope) {
    // If this node has created a new sub-scope, we don't
    // return this to the parent node.
    return parentScope;
  } else {
    // If this node has not created a new sub-scope, we return
    // the current scope, which MAY be a sub-scope of the parent scope.
    // This is done to enable redeclarations of local variables.
    return scope;
  }
}

// This function determines if a node should create a new scope.
function shouldNodeCreateNewScope(parent: SyntaxNode): boolean {
  switch (parent.kind) {
    case SyntaxKind.ProcedureStatement:
      return true;
    default:
      return false;
  }
}
