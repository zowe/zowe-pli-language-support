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
import { ReferencesCache } from "./resolver";
import { getReference } from "./tokens";
import { DeclaredItemParser } from "./declared-item-parser";
import {
  QualificationStatus,
  QualifiedSyntaxNode,
} from "./qualified-syntax-node";
import { MultiMap } from "../utils/collections";
import { Scope, ScopeCache } from "./scope";

/**
 * Terminology:
 * - Redeclaration: A symbol that is declared with the same name in the same scope.
 * - Shadowing: A symbol that is declared with the same name in a nested scope.
 * - Ambiguous: A symbol that is declared with the same name in different branches of nested scopes.
 */

export class SymbolTable {
  private symbols: MultiMap<string, QualifiedSyntaxNode> = new MultiMap();

  addDeclarationStatement(
    declaration: DeclareStatement,
    acceptor: PliValidationAcceptor,
  ): void {
    const generator = new DeclaredItemParser(declaration.items, acceptor);

    generator.generate(this);
  }

  addSymbolDeclaration(name: string, node: QualifiedSyntaxNode): void {
    this.symbols.add(name, node);
  }

  allDistinctSymbols(qualifiedName: string[]): QualifiedSyntaxNode[] {
    const allSymbols: QualifiedSyntaxNode[] = [];
    const map = new Map<string, QualifiedSyntaxNode[]>();
    for (const [name, symbols] of this.symbols.entriesGroupedByKey()) {
      if (qualifiedName.length > 0) {
        for (const symbol of symbols) {
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
            if (!map.get(symbol.name)) {
              map.set(symbol.name, []);
            }
            map.get(name)!.push(symbol);
          }
          // Everything else indicates that the name could either not be found 
          // or the qualified name is longer than the chain of parents, 
          // which also indicates a matching failure.
        }
      } else {
        map.set(name, symbols);
      }
    }
    for (const symbols of map.values()) {
      if (symbols.length === 1) {
        // Symbol is unique, add it to the list.
        allSymbols.push(symbols[0]);
      }
    }
    return allSymbols;
  }

  // Return all qualified symbols
  getSymbols(
    qualifiedName: readonly string[],
  ): readonly QualifiedSyntaxNode[] | undefined {
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
      return fullQualification;
    } else if (partialQualification) {
      return partialQualification;
    } else {
      return undefined;
    }
  }

  clear(): void {
    this.symbols.clear();
  }
}

export function iterateSymbols(unit: CompilationUnit): Diagnostic[] {
  const { scopeCaches, references } = unit;

  // Set child containers for all nodes.
  recursivelySetContainer(unit.ast);

  const validationBuffer = new PliValidationBuffer();
  const acceptor = validationBuffer.getAcceptor();

  // Iterate over the PLI program creating the symbol table.
  // Todo: The root preprocessor scope should contain global preprocessor variables.
  const builtInPreprocessorSymbols = new SymbolTable();
  const preprocessorScope = new Scope(null, builtInPreprocessorSymbols);
  iterateSymbolTable(
    scopeCaches.preprocessor,
    references,
    acceptor,
    unit.preprocessorAst,
    preprocessorScope,
  );

  // Todo: The root scope should contain global PL1 standard library symbols.
  const builtInSymbols = new SymbolTable();
  const scope = new Scope(null, builtInSymbols);
  iterateSymbolTable(
    scopeCaches.regular,
    references,
    acceptor,
    unit.ast,
    scope,
  );

  return validationBuffer.getDiagnostics();
}

function recursivelySetContainer(node: SyntaxNode) {
  forEachNode(node, (child) => {
    child.container = node;
    recursivelySetContainer(child);
  });
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

  // We connect the current node to its scope for usage in the linking phase.
  scopeCache.add(node, parentScope);

  // Function to recursively iterate over the child nodes to build their symbol table.
  const iterateChild = (scope: Scope) => (child: SyntaxNode) =>
    iterateSymbolTable(scopeCache, referenceCache, acceptor, child, scope);

  // This switch statement handles the special case of a procedure statement.
  switch (node.kind) {
    case SyntaxKind.LabelPrefix:
    case SyntaxKind.OrdinalValue:
      parentScope.symbolTable.addSymbolDeclaration(
        node.name!,
        new QualifiedSyntaxNode(node.nameToken!, node),
      );
      break;
    case SyntaxKind.ProcedureStatement:
      // Create a new scope for the procedure statement.
      const scope = new Scope(parentScope);
      // A procedure statement's end node is a child node, but scope-wise, the end
      // node should be part of the parent scope of the procedure statement, to
      // properly link to the procedure's label.
      // We remove the end node from the procedure statement, to process it as a sibling node.
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
      parentScope.symbolTable.addDeclarationStatement(node, acceptor);
      break;
    default:
      forEachNode(node, iterateChild(parentScope));
  }
};
