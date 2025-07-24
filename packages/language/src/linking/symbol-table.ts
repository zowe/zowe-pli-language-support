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
  Package,
  ProcedureParameter,
  ProcedureStatement,
  Reference,
  SyntaxKind,
  SyntaxNode,
} from "../syntax-tree/ast";
import { forEachNode } from "../syntax-tree/ast-iterator";
import { groupBy } from "../utils/common";
import { ValidationBuffer } from "../validation/validator";
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
import { LinkerErrorReporter } from "./error";

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

  addImplicitDeclaration(
    text: string,
    token: Token,
    node: SyntaxNode,
    _reporter: LinkerErrorReporter,
  ) {
    this.addSymbolDeclaration(
      text,
      QualifiedSyntaxNode.createImplicit(this.unit, token, node),
    );
  }

  addImplicitDeclarationByReference(
    ref: Reference,
    _reporter: LinkerErrorReporter,
  ): void {
    this.addImplicitDeclaration(ref.text, ref.token, ref.owner, _reporter);
  }

  addExplicitDeclarationStatement(
    declaration: DeclareStatement,
    reporter: LinkerErrorReporter,
  ): void {
    const parsedEntries = DeclaredItemParser.parse(
      this.unit,
      declaration.items,
      reporter,
    );
    for (const [name, node] of parsedEntries.entries()) {
      this.addSymbolDeclaration(name, node);
    }
  }

  /**
   * Adds an explicit declaration of a procedure parameter to the symbol table.
   *
   * This is used to dynamically create explicit declarations for implicitly declared
   * procedure parameters who, to ensure that symbol resolutions inside this procedure scope
   * will always link to this parameter symbol.
   *
   * @param reference - The reference to the procedure parameter.
   */
  addProcedureParameter(reference: Reference<ProcedureParameter>) {
    this.addSymbolDeclaration(
      reference.text,
      QualifiedSyntaxNode.createExplicit(
        this.unit,
        reference.token,
        reference.owner,
      ),
    );
  }

  addLabelStatement(
    node: SyntaxNode,
    name: string | null,
    nameToken: Token | null,
    _reporter: LinkerErrorReporter,
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

  allDistinctSymbols(rawQualifiedName: string[]): QualifiedSyntaxNode[] {
    const qualifiedName = rawQualifiedName.map(this.getSymbolName.bind(this));

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
    rawQualifiedName: readonly string[],
  ): readonly QualifiedSyntaxNode[] | undefined {
    const qualifiedName = rawQualifiedName.map(this.getSymbolName.bind(this));
    const [name] = qualifiedName;
    if (!name) {
      return undefined;
    }

    const symbols = this.symbols
      .get(name)
      .filter((symbol) => !symbol.isImplicit);

    return getQualifiedSymbols(qualifiedName, symbols);
  }

  getImplicitSymbols(
    rawQualifiedName: readonly string[],
  ): readonly QualifiedSyntaxNode[] | undefined {
    const qualifiedName = rawQualifiedName.map(this.getSymbolName.bind(this));
    const [name] = qualifiedName;
    if (!name) {
      return undefined;
    }

    const symbols = this.symbols
      .get(name)
      .filter((symbol) => symbol.isImplicit);

    return getQualifiedSymbols(qualifiedName, symbols);
  }
}

// Return all qualified symbols
function getQualifiedSymbols(
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

const RedeclarationPriority = [SyntaxKind.LabelPrefix];

/**
 * Assigns the `isRedeclared` property to all symbols that are redeclared.
 *
 * Caution: side effect of this function is that the `isRedeclared` property is set on all symbols.
 */
function assignRedeclaredSymbols(scopeCache: ScopeCache) {
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

  const validationBuffer = new ValidationBuffer();
  const reporter = new LinkerErrorReporter(
    unit,
    validationBuffer.getAcceptor(),
  );

  const preprocessorScope = Scope.createChild(unit.rootPreprocessorScope);

  iterateSymbolTable(unit.preprocessorAst, preprocessorScope, {
    unit,
    reporter,
    scopeCache: scopeCaches.preprocessor,
    referencesCache,
    statementOrderCache,
  });
  // TODO: Active this when we have some tests
  // assignRedeclaredSymbols(scopeCaches.preprocessor);

  // Generate a new scope
  // Otherwise we will add symbols to the root scope (which contains builtins)
  const regularScope = Scope.createChild(unit.rootScope);

  iterateSymbolTable(unit.ast, regularScope, {
    unit,
    reporter,
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

/**
 * Procedure and package statements' end node are child nodes, but scope-wise, an end node
 * should be part of the parent scope of the procedure statement, to properly link to the label.
 * We remove the end node from the procedure statement, to process it as a sibling node.
 */
function handleProcedureStatement(
  node: ProcedureStatement | Package,
  parentScope: Scope,
  context: IterateSymbolTableContext,
) {
  const scope = Scope.createChild(parentScope);
  const newNode: ProcedureStatement | Package = {
    ...node,
    end: null,
  };

  forEachNode(newNode, (child) => iterateSymbolTable(child, scope, context));
  if (node.end) {
    iterateSymbolTable(node.end, parentScope, context);
  }
}

type IterateSymbolTableContext = {
  unit: CompilationUnit;
  scopeCache: ScopeCache;
  referencesCache: ReferencesCache;
  reporter: LinkerErrorReporter;
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

  // This switch statement handles special cases for certain syntax nodes.
  switch (node.kind) {
    // We handle procedure and package statements separately, to properly scope the end node.
    case SyntaxKind.ProcedureStatement:
    case SyntaxKind.Package:
      handleProcedureStatement(node, parentScope, context);
      // Early return to avoid below `forEachNode`.
      return;
    // E.g. `MY_PROC: PROCEDURE;`
    case SyntaxKind.LabelPrefix:
    case SyntaxKind.OrdinalValue:
      parentScope.symbolTable.addLabelStatement(
        node,
        node.name,
        node.nameToken,
        context.reporter,
      );
      break;
    // E.g. `DCL A FIXED;`
    case SyntaxKind.DeclareStatement:
      parentScope.symbolTable.addExplicitDeclarationStatement(
        node,
        context.reporter,
      );
      break;
    case SyntaxKind.ProcedureParameter:
      if (node.ref) {
        parentScope.symbolTable.addImplicitDeclarationByReference(
          node.ref,
          context.reporter,
        );
      }
      break;
    // E.g. `DO I = 1 TO 300 BY 100; END DO;`
    case SyntaxKind.DoType3:
      if (node.variable?.ref) {
        parentScope.symbolTable.addImplicitDeclarationByReference(
          node.variable.ref,
          context.reporter,
        );
      }
      break;
    // E.g. `A, B = 1;`
    case SyntaxKind.AssignmentStatement:
      const refs = node.refs
        .map((ref) => ref.element?.element?.ref)
        .filter(nonNull);
      for (const ref of refs) {
        parentScope.symbolTable.addImplicitDeclarationByReference(
          ref,
          context.reporter,
        );
      }
      break;
    // Any statement is added to the statement order cache
    // to keep track of the order of statements.
    case SyntaxKind.Statement:
      context.statementOrderCache.add(node);
      break;
  }

  forEachNode(node, (child) => iterateSymbolTable(child, parentScope, context));
};
