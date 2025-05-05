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
  Diagnostic,
  DiagnosticInfo,
  Severity,
  tokenToRange,
  tokenToUri,
} from "../language-server/types";
import {
  DeclaredItem,
  DeclareStatement,
  ProcedureStatement,
  SyntaxKind,
  SyntaxNode,
} from "../syntax-tree/ast";
import { forEachNode } from "../syntax-tree/ast-iterator";
import { groupBy } from "../utils/common";
import { PliValidationAcceptor } from "../validation/validator";
import { CompilationUnit } from "../workspace/compilation-unit";
import { ReferencesCache } from "./resolver";
import { getLabelSymbol, getReference, getVariableSymbol } from "./tokens";
import * as PLICodes from "../validation/messages/pli-codes";

/**
 * Terminology:
 * - Redeclaration: A symbol that is declared with the same name in the same scope.
 * - Shadowing: A symbol that is declared with the same name in a nested scope.
 * - Ambiguous: A symbol that is declared with the same name in different branches of nested scopes.
 */

/**
 * ```
 * DCL 1 A1,
 *       2 B,
 *         3 K,
 *       2 C,
 *         3 K;
 * ```
 *
 * Into:
 *
 * ```
 * K -> B -> A1
 * B -> A1
 * K -> C -> A1
 * C -> A1
 * ```
 */

/**
 * Always take full qualification over partial qualification.
 */
enum QualificationStatus {
  NoQualification,
  FullQualification,
  PartialQualification,
}

class QualifiedSyntaxNode {
  node: SyntaxNode;
  name: string;
  parent: QualifiedSyntaxNode | null;

  constructor(
    name: string,
    node: SyntaxNode,
    parent: QualifiedSyntaxNode | null = null,
  ) {
    this.node = node;
    this.name = name;
    this.parent = parent;
  }

  getParent(): QualifiedSyntaxNode | null {
    return this.parent;
  }

  getQualificationStatus(qualifiers: string[]): QualificationStatus {
    const qualifier = qualifiers[0];
    if (!qualifier) {
      return QualificationStatus.NoQualification;
    }

    let nextQualifiers =
      this.name === qualifier ? qualifiers.slice(1) : qualifiers;

    if (nextQualifiers.length <= 0) {
      if (!this.parent) {
        return QualificationStatus.FullQualification;
      } else {
        return QualificationStatus.PartialQualification;
      }
    }

    if (this.parent) {
      return this.parent.getQualificationStatus(nextQualifiers);
    }

    return QualificationStatus.NoQualification;
  }
}

class SymbolTableDeclaredItemGenerator {
  private items: DeclaredItem[];
  private acceptor: PliValidationAcceptor;

  constructor(items: DeclaredItem[], acceptor: PliValidationAcceptor) {
    this.items = items.slice(); // Explicitly make a copy of the items, to use `.shift()` in `this.pop()`
    this.acceptor = acceptor;
  }

  private peek(): DeclaredItem | undefined {
    return this.items[0];
  }

  private pop(): DeclaredItem | undefined {
    return this.items.shift();
  }

  private _generate(
    table: SymbolTable,
    parent: QualifiedSyntaxNode | null,
    parentLevel: number,
  ) {
    // Consume many items on the same level.
    while (true) {
      const item = this.peek();
      if (!item) {
        break;
      }

      // When level is not set, we assume 1 like the PL1 compiler seems to do.
      let level = item.level ?? 1;
      // The item we're looking at is not a part of the current scope, let's exit.
      if (level <= parentLevel) {
        break;
      }

      // TODO: get max level from compilation unit? If e.g. compilation flags can change this.
      if (level > 255) {
        level = 255;

        this.acceptor(Severity.E, PLICodes.Error.IBM1363I.message, {
          code: PLICodes.Error.IBM1363I.fullCode,
          range: tokenToRange(item.levelToken!),
          uri: tokenToUri(item.levelToken!) ?? "",
        });
      }

      // This item is part of the current scope, let's consume it.
      this.pop();

      // In the case of factorized variables, a single
      // DeclaredItem can contain multiple names.
      // TODO: Should we allow this? The PL/I compiler simply ignores
      // factorized variables in structured declarations.
      forEachNode(item, (child) => {
        const name = getVariableSymbol(child);
        if (name) {
          const node = new QualifiedSyntaxNode(name, child, parent);
          table.addSymbolDeclaration(name, node);
          this._generate(table, node, level);
        }
      });
    }
  }

  generate(table: SymbolTable) {
    // Use 0 as a default level to start the generation.
    // TODO: Maybe make this `null` to represent the root scope.
    this._generate(table, null, 0);
  }
}

export class SymbolTable {
  private symbols: Map<string, QualifiedSyntaxNode[]> = new Map();

  addDeclarationStatement(
    declaration: DeclareStatement,
    acceptor: PliValidationAcceptor,
  ): void {
    const generator = new SymbolTableDeclaredItemGenerator(
      declaration.items,
      acceptor,
    );

    generator.generate(this);
  }

  addSymbolDeclaration(name: string, node: QualifiedSyntaxNode): void {
    const symbols = this.symbols.get(name);
    if (symbols) {
      symbols.push(node);
    } else {
      this.symbols.set(name, [node]);
    }
  }

  // Return all qualified symbols
  getSymbols(qualifiedName: string[]): SyntaxNode[] | undefined {
    const [name] = qualifiedName;
    if (!name) {
      return undefined;
    }

    const symbols = this.symbols.get(name);
    if (!symbols) {
      return undefined;
    }

    const qualifiedSymbols = groupBy(symbols, (symbol) =>
      symbol.getQualificationStatus(qualifiedName),
    );

    const fullQualification =
      qualifiedSymbols[QualificationStatus.FullQualification];
    const partialQualification =
      qualifiedSymbols[QualificationStatus.PartialQualification];

    if (fullQualification) {
      return fullQualification.map((symbol) => symbol.node);
    } else if (partialQualification) {
      return partialQualification.map((symbol) => symbol.node);
    } else {
      return undefined;
    }
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

  getSymbols(qualifiedName: string[]): SyntaxNode[] {
    return (
      this._symbolTable?.getSymbols(qualifiedName) ??
      this.parent?.getSymbols(qualifiedName) ??
      []
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

export function iterateSymbols(unit: CompilationUnit): void {
  const { scopeCaches, references } = unit;

  // Todo: The root scope should contain global PL1 standard library symbols.
  const builtInSymbols = new SymbolTable();
  const scope = new Scope(null, builtInSymbols);

  // Set child containers for all nodes.
  recursivelySetContainer(unit.ast);

  // Todo: generic interface with `validator.ts`.
  const diagnostics: Diagnostic[] = [];
  const acceptor: PliValidationAcceptor = (
    severity: Severity,
    message: string,
    d: DiagnosticInfo,
  ) => {
    diagnostics.push({
      severity,
      message,
      ...d,
    });
  };

  // Iterate over the PLI program creating the symbol table.
  iterateSymbolTable(
    scopeCaches.preprocessor,
    references,
    acceptor,
    unit.preprocessorAst,
    scope,
  );

  iterateSymbolTable(
    scopeCaches.regular,
    references,
    acceptor,
    unit.ast,
    scope,
  );

  unit.diagnostics.symbolTable = diagnostics;
}

function recursivelySetContainer(node: SyntaxNode) {
  forEachNode(node, (child) => {
    child.container = node;
    recursivelySetContainer(child);
  });
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

const iterateSymbolTable = (
  scopeCache: ScopeCache,
  referenceCache: ReferencesCache,
  acceptor: PliValidationAcceptor,
  node: SyntaxNode,
  parentScope: Scope,
) => {
  const ref = getReference(node);
  if (ref) {
    referenceCache.add(ref);
  }

  // Add the label symbol to the symbol table in the current scope.
  const symbol = getLabelSymbol(node);
  if (symbol) {
    parentScope.symbolTable.addSymbolDeclaration(
      symbol,
      new QualifiedSyntaxNode(symbol, node),
    );
  }

  // We connect the current node to its scope for usage in the linking phase.
  scopeCache.add(node, parentScope);

  // Are we entering a containing node? Then we should create a new scope for all our children.
  const scope = shouldNodeCreateNewScope(node)
    ? new Scope(parentScope)
    : parentScope;

  // Function to recursively iterate over the child nodes to build their symbol table.
  const iterateChild = (scope: Scope) => (child: SyntaxNode) =>
    iterateSymbolTable(scopeCache, referenceCache, acceptor, child, scope);

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
      }
      break;
    case SyntaxKind.DeclareStatement:
      scope.symbolTable.addDeclarationStatement(node, acceptor);
      break;
    default:
      forEachNode(node, iterateChild(scope));
  }
};
