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
  DeclaredVariable,
  DeclareStatement,
  DefineAliasStatement,
  DefineOrdinalStatement,
  DefineStructureStatement,
  getContainer,
  Package,
  ProcedureParameter,
  ProcedureStatement,
  Reference,
  SyntaxKind,
  SyntaxNode,
  TypeExtendingAttribute,
} from "../syntax-tree/ast";
import { forEachNode } from "../syntax-tree/ast-iterator";
import { groupBy } from "../utils/common";
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
import { LinkerErrorReporter } from "./error";
import { DiagnosticCategory } from "../validation/diagnostics-store";
import { getFirstStructureVariable } from "../syntax-tree/ast-utils";

/**
 * Terminology:
 * - Redeclaration: A symbol that is declared with the same name in the same scope.
 * - Shadowing: A symbol that is declared with the same name in a nested scope.
 * - Ambiguous: A symbol that is declared with the same name in different branches of nested scopes.
 */

export class SymbolTable {
  symbols: MultiMap<string, QualifiedSyntaxNode> = new MultiMap();
  typeSymbols: MultiMap<string, QualifiedSyntaxNode> = new MultiMap();
  nodeLookup: Map<SyntaxNode, QualifiedSyntaxNode> = new Map();
  existingNodes = new Set<string>();

  addImplicitDeclaration(
    text: string,
    token: Token,
    node: SyntaxNode,
    _reporter: LinkerErrorReporter,
  ) {
    this.addSymbolDeclaration(
      text,
      QualifiedSyntaxNode.createImplicit(token, node),
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
    const parsedEntries = DeclaredItemParser.parse(declaration.items, reporter);
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
      QualifiedSyntaxNode.createExplicit(reference.token, reference.owner),
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
      QualifiedSyntaxNode.createExplicit(nameToken, node),
    );
  }

  addStructureDefinition(
    node: DefineStructureStatement,
    reporter: LinkerErrorReporter,
  ) {
    const firstItem = getFirstStructureVariable(node);
    if (!firstItem || !firstItem.name || !firstItem.nameToken) {
      return;
    }
    this.addTypeDeclaration(
      firstItem.name,
      QualifiedSyntaxNode.createExplicit(firstItem.nameToken, firstItem),
    );
  }

  addAliasDefinition(
    node: DefineAliasStatement,
    reporter: LinkerErrorReporter,
  ) {
    if (!node.name || !node.nameToken) {
      return;
    }
    this.addTypeDeclaration(
      node.name,
      QualifiedSyntaxNode.createExplicit(node.nameToken, node),
    );
  }

  addOrdinalDefinition(
    node: DefineOrdinalStatement,
    reporter: LinkerErrorReporter,
  ) {
    const { name, nameToken } = node;
    if (name && nameToken) {
      this.addTypeDeclaration(
        name,
        QualifiedSyntaxNode.createExplicit(nameToken, node),
      );
    }
    if (node.ordinalValues) {
      for (const ordinalValue of node.ordinalValues.members) {
        const { name: ovName, nameToken: ovNameToken } = ordinalValue;
        if (ovName && ovNameToken) {
          this.addSymbolDeclaration(
            ovName,
            QualifiedSyntaxNode.createExplicit(ovNameToken, ordinalValue),
          );
        }
      }
    }
  }

  addTypeDeclaration(name: string, node: QualifiedSyntaxNode): void {
    this.typeSymbols.add(name, node);
    this.nodeLookup.set(node.node, node);
  }

  addSymbolDeclaration(name: string, node: QualifiedSyntaxNode): void {
    // The id of a qualified node is unique per path in the AST
    // Meaning that we cannot accidentally add the same logical node twice
    // This is required to avoid issues during reiteration of symbols
    // Mainly for LIKE and TYPE attributes
    const id = node.getId();
    if (this.existingNodes.has(id)) {
      return;
    }
    this.existingNodes.add(id);
    this.symbols.add(name, node);
    this.nodeLookup.set(node.node, node);
  }

  allDistinctSymbols(qualifiedName: string[]): QualifiedSyntaxNode[] {
    return this.distinctMapSymbols(this.symbols, qualifiedName);
  }

  allDistinctTypeSymbols(qualifiedName: string[]): QualifiedSyntaxNode[] {
    return this.distinctMapSymbols(this.typeSymbols, qualifiedName);
  }

  private distinctMapSymbols(
    symbolMap: MultiMap<string, QualifiedSyntaxNode>,
    qualifiedName: string[],
  ): QualifiedSyntaxNode[] {
    const map = new Map<string, QualifiedSyntaxNode[]>();
    for (const [name, symbols] of symbolMap.entriesGroupedByKey()) {
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

  getTypeSymbols(
    qualifiedName: readonly string[],
  ): readonly QualifiedSyntaxNode[] | undefined {
    const [name] = qualifiedName;
    if (!name) {
      return undefined;
    }
    const symbols = this.typeSymbols.get(name);
    return getQualifiedSymbols(qualifiedName, symbols);
  }

  getExplicitSymbols(
    qualifiedName: readonly string[],
  ): readonly QualifiedSyntaxNode[] | undefined {
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
    qualifiedName: readonly string[],
  ): readonly QualifiedSyntaxNode[] | undefined {
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

function redeclarationPriority(kind: SyntaxKind): number {
  if (kind === SyntaxKind.LabelPrefix) {
    return 1;
  } else {
    return 0;
  }
}

/**
 * Assigns the `isRedeclared` property to all symbols that are redeclared.
 *
 * Caution: side effect of this function is that the `isRedeclared` property is set on all symbols.
 */
function assignRedeclaredSymbols(scopeCache: ScopeCache) {
  for (const scope of scopeCache.values()) {
    for (const [, symbols] of scope.symbolTable.symbols.entriesGroupedByKey()) {
      const filteredSymbols = symbols.filter(
        (symbol) =>
          !symbol.isImplicit && // We don't want to check implicit declarations for redeclarations.
          symbol.level === 1 && // Get the symbols that are at the first level of scope.
          symbol.node.kind !== SyntaxKind.WildcardItem, // Wildcard items are not checked for redeclarations.
      );

      const isColliding = checkRedeclaration(filteredSymbols);
      for (const symbol of filteredSymbols) {
        symbol.isRedeclared = isColliding;
      }

      // During a collision, we determine which symbols should be
      // marked as redeclared. In the case of a colliding label prefix
      // and variable declaration, the label prefix should always
      // take precedence (i.e, be marked as not redeclared).
      if (isColliding) {
        let item = filteredSymbols[0];
        let itemPrio = redeclarationPriority(item.node.kind);
        for (let i = 1; i < filteredSymbols.length; i++) {
          const symbol = filteredSymbols[i];
          const prio = redeclarationPriority(symbol.node.kind);
          if (prio > itemPrio) {
            item = symbol;
            itemPrio = prio;
          }
        }
        item.isRedeclared = false;
      }
    }
  }
}

/**
 * Checks whether the given symbols are conflicting declarations.
 * Has special handling for forward declarations of procedures using the ENTRY attribute.
 * These are not considered redeclarations, even though they have the same name and are in the same scope,
 * because they are semantically connected.
 */
export function checkRedeclaration(symbols: QualifiedSyntaxNode[]): boolean {
  if (symbols.length < 2) {
    // No redeclaration if there is only one symbol
    return false;
  } else if (symbols.length > 2) {
    // More than 2 symbols with the same name is always a redeclaration
    return true;
  } else {
    // In case of 2 symbols with the same name, we have to check whether:
    // 1. One of them is a procedure
    // 2. The other one is a forward declaration of that procedure using the ENTRY attribute
    const declaredVariable = symbols.find(
      (symbol) => symbol.node.kind === SyntaxKind.DeclaredVariable,
    );
    if (!declaredVariable) {
      // No variable found
      return true;
    }
    const entryProcedure = symbols.find(
      (symbol) =>
        symbol.node.kind === SyntaxKind.LabelPrefix &&
        symbol.node.container?.kind === SyntaxKind.Statement &&
        symbol.node.container?.value?.kind === SyntaxKind.ProcedureStatement,
    );
    if (!entryProcedure) {
      // No entry procedure found
      return true;
    }
    const variable = declaredVariable.node as DeclaredVariable;
    let item = variable.container;
    while (item?.kind === SyntaxKind.DeclaredItem) {
      for (const attribute of item.attributes) {
        if (attribute.kind === SyntaxKind.EntryAttribute) {
          // We found an entry attribute for the variable
          // Therefore, this variable is a forward declaration
          // Show no redeclaration error
          return false;
        }
      }
      item = item.container;
    }
    return true;
  }
}

export function reiterateSymbols(
  unit: CompilationUnit,
  symbols: Iterable<SyntaxNode>,
): void {
  const reporter = new LinkerErrorReporter(
    unit,
    unit.diagnostics.getAcceptor(DiagnosticCategory.SymbolTable),
  );
  const context: IterateSymbolTableContext = {
    unit,
    referencesCache: unit.referencesCache,
    scopeCache: unit.scopeCaches.regular,
    statementOrderCache: unit.statementOrderCache,
    reporter,
  };
  for (const node of symbols) {
    const scope = unit.scopeCaches.regular.get(node);
    if (!scope) {
      // Something went wrong, skip this node.
      console.debug("No scope found for node during reiteration");
      continue;
    }
    // Second iteration over the node to handle newly added symbols.
    // The node should already be present in the scope cache.
    // Duplicate symbols will be filtered out by the symbol table.
    handleNode(node, scope, context);
  }
}

/**
 * Iterate over the PLI program creating the symbol table.
 * @param unit The compilation unit to iterate over.
 * @returns The diagnostics of the validation.
 */
export function iterateSymbols(unit: CompilationUnit): void {
  const { scopeCaches, referencesCache, statementOrderCache } = unit;

  // Set child containers for all nodes.
  recursivelySetContainer(unit.ast);
  const reporter = new LinkerErrorReporter(
    unit,
    unit.diagnostics.getAcceptor(DiagnosticCategory.SymbolTable),
  );

  const preprocessorScope = Scope.createChild(unit.rootPreprocessorScope);
  scopeCaches.preprocessor.add(unit.preprocessorAst, preprocessorScope);

  iterateSymbolTable(
    unit.preprocessorAst,
    preprocessorScope,
    {
      unit,
      reporter,
      scopeCache: scopeCaches.preprocessor,
      referencesCache,
      statementOrderCache,
    },
    false,
  );
  // TODO: Active this when we have some tests
  // assignRedeclaredSymbols(scopeCaches.preprocessor);

  // Generate a new scope
  // Otherwise we will add symbols to the root scope (which contains builtins)
  const regularScope = Scope.createChild(unit.rootScope);
  scopeCaches.regular.add(unit.ast, regularScope);

  iterateSymbolTable(
    unit.ast,
    regularScope,
    {
      unit,
      reporter,
      scopeCache: scopeCaches.regular,
      referencesCache,
      statementOrderCache,
    },
    false,
  );
  assignRedeclaredSymbols(scopeCaches.regular);
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

  context.scopeCache.add(node, scope);

  forEachNode(newNode, (child) =>
    iterateSymbolTable(child, scope, context, false),
  );
  if (node.end) {
    // Iterate the end node with a separate scope
    iterateSymbolTable(node.end, parentScope, context, false);
    // Also add the parent scope to the end node
    context.scopeCache.add(node.end, parentScope);
  }
}

type IterateSymbolTableContext = {
  unit: CompilationUnit;
  scopeCache: ScopeCache;
  referencesCache: ReferencesCache;
  reporter: LinkerErrorReporter;
  statementOrderCache: StatementOrderCache;
};

function iterateSymbolTable(
  node: SyntaxNode,
  parentScope: Scope,
  context: IterateSymbolTableContext,
  prioRef: boolean,
): void {
  if (
    !prioRef &&
    (node.kind === SyntaxKind.LikeAttribute ||
      node.kind === SyntaxKind.TypeAttribute)
  ) {
    prioRef = true;
  }
  const ref = getReference(node);

  if (ref !== undefined) {
    // Reset the reference node to undefined to allow re-resolution.
    // This is necessary because cached AST nodes may have references
    // that were resolved in a previous lifecycle run.
    ref.node = undefined;

    if (prioRef) {
      context.referencesCache.priorityAdd(ref);
    } else {
      context.referencesCache.add(ref);
    }
  }

  const continueRunning = handleNode(node, parentScope, context);
  if (continueRunning) {
    forEachNode(node, (child) =>
      iterateSymbolTable(child, parentScope, context, prioRef),
    );
  }
}

/**
 * Handle a syntax node during symbol table iteration.
 * @returns Whether to continue iterating child nodes.
 */
function handleNode(
  node: SyntaxNode,
  parentScope: Scope,
  context: IterateSymbolTableContext,
): boolean {
  // This switch statement handles special cases for certain syntax nodes.
  switch (node.kind) {
    // We handle procedure and package statements separately, to properly scope the end node.
    case SyntaxKind.ProcedureStatement:
    case SyntaxKind.Package:
      handleProcedureStatement(node, parentScope, context);
      // handleProcedureStatement contains its own iteration logic, so we stop further processing here.
      return false;
    case SyntaxKind.ReplaceStatement:
      if (node.name && node.nameToken) {
        parentScope.symbolTable.addSymbolDeclaration(
          node.name,
          QualifiedSyntaxNode.createExplicit(node.nameToken, node),
        );
      }
      break;
    // E.g. `DEFINE STRUCTURE 1 A, 2 B, 3 C;`
    case SyntaxKind.DefineStructureStatement:
      parentScope.symbolTable.addStructureDefinition(node, context.reporter);
      break;
    // E.g. `DEFINE ALIAS Name char(32) varying;`
    // `DCL MyName TYPE Name;`
    case SyntaxKind.DefineAliasStatement:
      parentScope.symbolTable.addAliasDefinition(node, context.reporter);
      break;
    // E.g. `DEFINE ORDINAL SUBJECTS(MATH, LITERATURE, SCIENCE);`
    case SyntaxKind.DefineOrdinalStatement:
      parentScope.symbolTable.addOrdinalDefinition(node, context.reporter);
      break;
    // E.g. `MY_PROC: PROCEDURE;` or `MY_LABEL(1): PUT("HELLO");`
    case SyntaxKind.LabelPrefix: {
      const labelRef = node.item?.ref;
      if (labelRef) {
        const statement = node.container;
        if (
          statement?.kind === SyntaxKind.Statement &&
          statement.value?.kind === SyntaxKind.EntryStatement
        ) {
          const procedureStatement = getContainer(
            statement,
            SyntaxKind.ProcedureStatement,
          );
          if (procedureStatement?.container) {
            // Labels of ENTRY statements declare entry points of a new procedure.
            // Like the parent procedure itself, they are visible in the
            // scope that contains the procedure, not just inside of it.
            parentScope =
              context.scopeCache.get(procedureStatement.container) ??
              parentScope;
          }
        }
        if (node.item!.dimensions.length > 0) {
          // A dimensioned label prefix implicitly declares the label array.
          // An explicit `DCL ... LABEL` declaration takes precedence during resolution.
          parentScope.symbolTable.addImplicitDeclaration(
            labelRef.text,
            labelRef.token,
            node,
            context.reporter,
          );
        } else {
          parentScope.symbolTable.addLabelStatement(
            node,
            labelRef.text,
            labelRef.token,
            context.reporter,
          );
        }
      }
      break;
    }
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
      // Only add the implicit declaration in case it points to a non-nested variable
      const ref = node.variable?.element?.ref;
      if (!node.variable?.previous && ref) {
        parentScope.symbolTable.addImplicitDeclarationByReference(
          ref,
          context.reporter,
        );
      }
      break;
    // E.g. `A, B = 1;`
    case SyntaxKind.AssignmentStatement:
      for (const nodeRef of node.refs) {
        const ref = nodeRef.element?.element?.ref;
        if (ref) {
          parentScope.symbolTable.addImplicitDeclarationByReference(
            ref,
            context.reporter,
          );
        }
      }
      break;
    // Any statement is added to the statement order cache
    // to keep track of the order of statements.
    case SyntaxKind.Statement:
      context.statementOrderCache.add(node);
      break;
  }
  return true;
}

export function getPriorityReferenceElement(
  reference: Reference,
): TypeExtendingAttribute | null {
  // Figure out whether this reference is part of a "LIKE"/"TYPE" attribute
  let container: SyntaxNode | null = reference.owner;
  while (container) {
    if (
      container.kind === SyntaxKind.LikeAttribute ||
      container.kind === SyntaxKind.TypeAttribute
    ) {
      return container;
    } else if (
      container.kind === SyntaxKind.ReferenceItem ||
      container.kind === SyntaxKind.MemberCall ||
      container.kind === SyntaxKind.LocatorCall
    ) {
      container = container.container;
    } else {
      break;
    }
  }
  return null;
}
