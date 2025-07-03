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

import { Diagnostic } from "../language-server/types";
import {
  DeclareStatement,
  ProcedureStatement,
  ReferenceItem,
  SyntaxKind,
  SyntaxNode,
} from "../syntax-tree/ast";
import { forEachNode } from "../syntax-tree/ast-iterator";
import { groupBy } from "../utils/common";
import {
  PliValidationAcceptor,
  PliValidationBuffer,
} from "../validation/validator";
import { CompilationUnit } from "../workspace/compilation-unit";
import { ReferencesCache, StatementOrderCache } from "./resolver";
import { getReference } from "./tokens";
import { DeclaredItemParser } from "./declared-item-parser";
import {
  QualificationStatus,
  QualifiedSyntaxNode,
} from "./qualified-syntax-node";
import { MultiMap } from "../utils/collections";
import { Scope, ScopeCache } from "./scope";
import { Token } from "../parser/tokens";
import { getSymbolName } from "./util";

function nonNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Terminology:
 * - Redeclaration: A symbol that is declared with the same name in the same scope.
 * - Shadowing: A symbol that is declared with the same name in a nested scope.
 * - Ambiguous: A symbol that is declared with the same name in different branches of nested scopes.
 */

export class SymbolTable {
  symbols: MultiMap<string, QualifiedSyntaxNode> = new MultiMap();
  nodeLookup: Map<SyntaxNode, QualifiedSyntaxNode> = new Map();

  constructor(private readonly unit: CompilationUnit) {}

  private getSymbolName(name: string) {
    return getSymbolName(this.unit, name);
  }

  addImplicitDeclarationStatement(
    refs: ReferenceItem[],
    _acceptor: PliValidationAcceptor,
  ): void {
    const candidates = refs.map(({ ref }) => ref).filter(nonNull);

    for (const candidate of candidates) {
      this.addSymbolDeclaration(
        candidate.text,
        QualifiedSyntaxNode.createImplicit(
          this.unit,
          candidate.token,
          candidate.owner,
        ),
      );
    }
  }

  addExplicitDeclarationStatement(
    declaration: DeclareStatement,
    acceptor: PliValidationAcceptor,
  ): void {
    const parsedEntries = DeclaredItemParser.parse(
      this.unit,
      declaration.items,
      acceptor,
    );
    for (const [name, node] of parsedEntries.entries()) {
      this.addSymbolDeclaration(name, node);
    }
  }

  addLabelStatement(
    node: SyntaxNode,
    name: string | null,
    nameToken: Token | null,
    _acceptor: PliValidationAcceptor,
  ) {
    if (!name || !nameToken) {
      return;
    }

    this.addSymbolDeclaration(
      name,
      QualifiedSyntaxNode.createExplicit(this.unit, nameToken, node),
    );
  }

  addSymbolDeclaration(name: string, node: QualifiedSyntaxNode): void {
    this.symbols.add(this.getSymbolName(name), node);
    this.nodeLookup.set(node.node, node);
  }

  allDistinctSymbols(_qualifiedName: string[]): QualifiedSyntaxNode[] {
    const qualifiedName = _qualifiedName.map(this.getSymbolName.bind(this));

    const map = new Map<string, QualifiedSyntaxNode[]>();
    for (const [name, symbols] of this.symbols.entriesGroupedByKey()) {
      if (qualifiedName.length > 0) {
        for (const symbol of symbols) {
          const symbolName = symbol.name;
          let parent = symbol.getParent();
          let i = 0;
          // Iterate over the qualified name and the parent chain in one loop
          while (parent && i < qualifiedName.length) {
            const name = qualifiedName[i];
            if (parent.name === name) {
              i++;
            }
            parent = parent.getParent();
          }
          if (i === qualifiedName.length) {
            // The full qualified name has been used to find the symbol
            if (!map.get(symbolName)) {
              map.set(symbolName, []);
            }
            map.get(symbolName)!.push(symbol);
          }
          // Everything else indicates that the name could either not be found
          // or the qualified name is longer than the chain of parents,
          // which also indicates a matching failure.
        }
      } else {
        map.set(name, symbols);
      }
    }

    const uniqueSymbols = Array.from(map.values())
      .map((symbols) => symbols.filter((symbol) => !symbol.isImplicit))
      .filter((symbols) => symbols.length === 1);

    return uniqueSymbols.flat();
  }

  getExplicitSymbols(
    _qualifiedName: readonly string[],
  ): readonly QualifiedSyntaxNode[] | undefined {
    const qualifiedName = _qualifiedName.map(this.getSymbolName.bind(this));
    const [name] = qualifiedName;
    if (!name) {
      return undefined;
    }

    const symbols = this.symbols
      .get(name)
      .filter((symbol) => !symbol.isImplicit);

    return this.getQualifiedSymbols(qualifiedName, symbols);
  }

  getImplicitSymbols(
    _qualifiedName: readonly string[],
  ): readonly QualifiedSyntaxNode[] | undefined {
    const qualifiedName = _qualifiedName.map(this.getSymbolName.bind(this));
    const [name] = qualifiedName;
    if (!name) {
      return undefined;
    }

    const symbols = this.symbols
      .get(name)
      .filter((symbol) => symbol.isImplicit);

    return this.getQualifiedSymbols(qualifiedName, symbols);
  }

  // Return all qualified symbols
  private getQualifiedSymbols(
    qualifiedName: readonly string[],
    symbols: readonly QualifiedSyntaxNode[],
  ): readonly QualifiedSyntaxNode[] | undefined {
    const qualifiedSymbols = groupBy(symbols, (symbol) =>
      symbol.getQualificationStatus(qualifiedName),
    );

    const fullQualification =
      qualifiedSymbols[QualificationStatus.FullQualification];
    const partialQualification =
      qualifiedSymbols[QualificationStatus.PartialQualification];

    if (fullQualification) {
      return fullQualification;
    } else if (partialQualification) {
      return partialQualification;
    } else {
      return undefined;
    }
  }
}

const RedeclarationPriority = [SyntaxKind.LabelPrefix];

/**
 * Assigns the `isRedeclared` property to all symbols that are redeclared.
 *
 * Caution: side effect of this function is that the `isRedeclared` property is set on all symbols.
 */
export function assignRedeclaredSymbols(scopeCache: ScopeCache) {
  for (const scope of scopeCache.values()) {
    const symbolsGroups = Array.from(
      scope.symbolTable.symbols.entriesGroupedByKey(),
      ([, symbols]) =>
        symbols
          .filter((symbol) => !symbol.isImplicit) // We don't want to check implicit declarations for redeclarations.
          .filter((symbol) => symbol.level === 1) // Get the symbols that are at the first level of scope.
          .filter((symbol) => symbol.node.kind !== SyntaxKind.WildcardItem), // Wildcard items are not checked for redeclarations.
    );

    for (const symbols of symbolsGroups) {
      // A group of symbols is colliding if it contains more than one symbol.
      const isColliding = symbols.length > 1;
      for (const symbol of symbols) {
        symbol.isRedeclared = isColliding;
      }

      // During a collision, we determine which symbols should be
      // marked as redeclared. In the case of a colliding label prefix
      // and variable declaration, the label prefix should always
      // take precedence (i.e, be marked as not redeclared).
      if (isColliding) {
        const [first] = symbols.toSorted(
          (a, b) =>
            RedeclarationPriority.indexOf(b.node.kind) -
            RedeclarationPriority.indexOf(a.node.kind),
        );

        first.isRedeclared = false;
      }
    }
  }
}

/**
 * Iterate over the PLI program creating the symbol table.
 * @param unit - The compilation unit to iterate over.
 * @returns The diagnostics of the validation.
 */
export function iterateSymbols(unit: CompilationUnit): Diagnostic[] {
  const { scopeCaches, referencesCache, statementOrderCache } = unit;

  // Set child containers for all nodes.
  recursivelySetContainer(unit.ast);

  const validationBuffer = new PliValidationBuffer();
  const acceptor = validationBuffer.getAcceptor();

  const preprocessorScope = new Scope(unit, unit.rootPreprocessorScope);

  iterateSymbolTable(unit.preprocessorAst, preprocessorScope, {
    unit,
    acceptor,
    scopeCache: scopeCaches.preprocessor,
    referencesCache,
    statementOrderCache,
  });
  // TODO: Active this when we have some tests
  // assignRedeclaredSymbols(scopeCaches.preprocessor);

  // Generate a new scope
  // Otherwise we will add symbols to the root scope (which contains builtins)
  const regularScope = new Scope(unit, unit.rootScope);

  iterateSymbolTable(unit.ast, regularScope, {
    unit,
    acceptor,
    scopeCache: scopeCaches.regular,
    referencesCache,
    statementOrderCache,
  });
  assignRedeclaredSymbols(scopeCaches.regular);

  return validationBuffer.getDiagnostics();
}

export function recursivelySetContainer(node: SyntaxNode) {
  forEachNode(node, (child) => {
    child.container = node;
    recursivelySetContainer(child);
  });
}

type IterateSymbolTableContext = {
  unit: CompilationUnit;
  scopeCache: ScopeCache;
  referencesCache: ReferencesCache;
  acceptor: PliValidationAcceptor;
  statementOrderCache: StatementOrderCache;
};

const iterateSymbolTable = (
  node: SyntaxNode,
  parentScope: Scope,
  context: IterateSymbolTableContext,
) => {
  const ref = getReference(node);
  if (ref) {
    context.referencesCache.add(ref);
  }

  // We connect the current node to its scope for usage in the linking phase.
  context.scopeCache.add(node, parentScope);

  /**
   * A procedure statement's end node is a child node, but scope-wise, the end
   * node should be part of the parent scope of the procedure statement, to
   * properly link to the procedure's label.
   * We remove the end node from the procedure statement, to process it as a sibling node.
   */
  if (node.kind === SyntaxKind.ProcedureStatement) {
    // Create a new scope for the procedure statement.
    const scope = new Scope(context.unit, parentScope);
    const procedure: ProcedureStatement = {
      ...node,
      end: null,
    };

    forEachNode(procedure, (child) =>
      iterateSymbolTable(child, scope, context),
    );
    if (node.end) {
      iterateSymbolTable(node.end, parentScope, context);
    }

    // Early return to avoid below switch statement.
    return;
  }

  // This switch statement handles special cases for certain syntax nodes.
  switch (node.kind) {
    // E.g. `MY_PROC: PROCEDURE;`
    case SyntaxKind.LabelPrefix:
    case SyntaxKind.OrdinalValue:
      parentScope.symbolTable.addLabelStatement(
        node,
        node.name,
        node.nameToken,
        context.acceptor,
      );
      break;
    // E.g. `DCL A FIXED;`
    case SyntaxKind.DeclareStatement:
      parentScope.symbolTable.addExplicitDeclarationStatement(
        node,
        context.acceptor,
      );
      break;
    // E.g. `DO I = 1 TO 300 BY 100; END DO;`
    case SyntaxKind.DoType3:
      parentScope.symbolTable.addImplicitDeclarationStatement(
        [node.variable].filter(nonNull),
        context.acceptor,
      );
      break;
    // E.g. `A = 1;`
    case SyntaxKind.AssignmentStatement:
      parentScope.symbolTable.addImplicitDeclarationStatement(
        node.refs.map((ref) => ref.element?.element).filter(nonNull),
        context.acceptor,
      );
      break;
    // Any statement is added to the statement order cache
    // to keep track of the order of statements.
    case SyntaxKind.Statement:
      context.statementOrderCache.add(node);
      break;
  }

  forEachNode(node, (child) => iterateSymbolTable(child, parentScope, context));
};
