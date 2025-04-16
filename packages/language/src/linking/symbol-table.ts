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

import {
  DeclaredItem,
  DeclareStatement,
  ProcedureStatement,
  SyntaxKind,
  SyntaxNode,
} from "../syntax-tree/ast";
import { forEachNode } from "../syntax-tree/ast-iterator";
// import { debugMapAst } from "../syntax-tree/debug";
import { CompilationUnit } from "../workspace/compilation-unit";
import { ReferencesCache } from "./resolver";
import {
  getLabelSymbol,
  getReference,
  getVariableNodeNames,
  getVariableSymbol,
} from "./tokens";

/**
 * Terminology:
 * - Redeclaration: A symbol that is declared with the same name in the same scope.
 * - Shadowing: A symbol that is declared with the same name in a nested scope.
 * - Ambiguous: A symbol that is declared with the same name in different branches of scopes.
 */

class SymbolizedSyntaxNodes {
  private value: SyntaxNode;
  // Contains all explicit redeclarations
  private redeclarations: SyntaxNode[] = [];
  // Contains all implicit symbols (from nested structured declarations)
  private implicitSymbols: SyntaxNode[] = [];

  constructor(value: SyntaxNode) {
    this.value = value;
  }

  addDeclaration(node: SyntaxNode): void {
    this.redeclarations.push(node);
  }

  addImplicitDeclaration(node: SyntaxNode): void {
    this.implicitSymbols.push(node);
  }

  getValue(): SyntaxNode {
    return this.value;
  }
}

class QualifiedDeclarationGenerator {
  private items: DeclaredItem[];

  constructor(items: DeclaredItem[]) {
    this.items = items;
  }

  private peek(): DeclaredItem | undefined {
    return this.items[0];
  }

  private pop(): DeclaredItem | undefined {
    return this.items.shift();
  }

  private getSymbolTable(table: SymbolTable, parentLevel: number) {
    // Consume many items on the same level.
    while (true) {
      const item = this.peek();
      if (!item) {
        break;
      }

      // When level is not set, we assume 1 the PL1 compiler seem to do.
      const level = item.level ?? 1;
      if (level <= parentLevel) {
        break;
      }

      // Consume the item from the list, we're committed to parsing this item.
      this.pop();

      table.recursivelyAddSymbolDeclarations(item);

      const childTable = new SymbolTable(table);
      this.getSymbolTable(childTable, level);

      const names = getVariableNodeNames(item);
      for (const name of names) {
        table.qualifiedSymbols.set(name, childTable);
      }
    }
  }

  generate(table: SymbolTable) {
    // Use 0 as a default level to start the generation.
    // TODO: Maybe make this `null`, as this is technically a hack.
    return this.getSymbolTable(table, 0);
  }
}

export class SymbolTable {
  private symbols: Map<string, SymbolizedSyntaxNodes> = new Map();

  // A map of qualified symbols to their symbol tables.
  public qualifiedSymbols: Map<string, SymbolTable> = new Map();
  private parent: SymbolTable | null;

  constructor(parent: SymbolTable | null = null) {
    this.parent = parent;
  }

  getParent(): SymbolTable | null {
    return this.parent;
  }

  recursivelyAddSymbolDeclarations(node: SyntaxNode): void {
    const symbol = getVariableSymbol(node);
    if (symbol) {
      this.addSymbolDeclaration(symbol, node);
    }

    forEachNode(node, (child) => {
      this.recursivelyAddSymbolDeclarations(child);
    });
  }

  addDeclarationStatement(declaration: DeclareStatement): void {
    new QualifiedDeclarationGenerator(declaration.items).generate(this);
  }

  addSymbolDeclaration(name: string, node: SyntaxNode): void {
    const symbol = this.symbols.get(name);
    if (symbol) {
      symbol.addDeclaration(node);
    } else {
      this.symbols.set(name, new SymbolizedSyntaxNodes(node));
    }
  }

  // Todo: return/use all redeclarations for validation
  getSymbol(name: string): SymbolizedSyntaxNodes | undefined {
    return this.symbols.get(name);
  }

  getQualifiedSymbolTable(name: string): SymbolTable | undefined {
    return this.qualifiedSymbols.get(name);
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

  getSymbol(name: string): SymbolizedSyntaxNodes | undefined {
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

  // debugMapAst(compilationUnit.ast);

  // const t1 = performance.now();

  // Iterate over the PLI program.
  recursivelySetContainer(compilationUnit.ast);
  iterate(compilationUnit.ast, scopeCache, scope, references);

  // console.log(`Time taken: ${performance.now() - t1} milliseconds`);
}

function recursivelySetContainer(node: SyntaxNode) {
  forEachNode(node, (child) => {
    child.container = node;
    recursivelySetContainer(child);
  });
}

// This function iterates over the syntax tree and builds the symbol table.
function iterate(
  node: SyntaxNode,
  scopeCache: ScopeCache,
  parentScope: Scope,
  references: ReferencesCache,
) {
  // Add the label symbol to the symbol table in the current scope.
  const symbol = getLabelSymbol(node);
  if (symbol) {
    parentScope.symbolTable.addSymbolDeclaration(symbol, node);
  }

  // We connect the current node to its scope for usage in the linking phase.
  scopeCache.add(node, parentScope);

  // Are we entering a containing node? Then we should create a new scope for all our children.
  const scope = shouldNodeCreateNewScope(node)
    ? new Scope(parentScope)
    : parentScope;

  // Function to recursively iterate over the child nodes to build their symbol table.
  const iterateChild = (scope: Scope) => (child: SyntaxNode) => {
    iterate(child, scopeCache, scope, references);
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
      forEachNode(procedure, iterateChild(scope));
      if (node.end) {
        iterateChild(parentScope)(node.end);
        node.end.container = node;
      }
      break;
    case SyntaxKind.DeclareStatement:
      scope.symbolTable.addDeclarationStatement(node);
      break;
    case SyntaxKind.MemberCall:
      references.addMemberCall(node);
      break;
    default:
      const ref = getReference(node);
      if (ref) {
        references.add(ref);
      }

      forEachNode(node, iterateChild(scope));
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
