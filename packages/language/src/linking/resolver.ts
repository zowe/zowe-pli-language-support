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

import { Location, tokenToRange } from "../language-server/types";
import { Token } from "../parser/tokens";
import {
  DeclaredItem,
  getContainer,
  iterateReferenceNodes,
  MemberCall,
  ProcedureParameter,
  Reference,
  ReferenceType,
  SyntaxKind,
  SyntaxNode,
} from "../syntax-tree/ast";
import { binaryTokenSearch } from "../utils/search";
import {
  getNameToken,
  getReference,
  isNameToken,
  isReferenceToken,
} from "./tokens";
import { URI } from "../utils/uri";
import { CompilationUnit } from "../workspace/compilation-unit";
import { QualifiedSyntaxNode } from "./qualified-syntax-node";
import { LinkerErrorReporter } from "./error";
import { Scope } from "./scope";
import {
  checkRedeclaration,
  getPriorityReferenceElement,
  reiterateSymbols,
} from "./symbol-table";
import { DiagnosticCategory } from "../validation/diagnostics-store";
import { MultiMap } from "../utils/collections";
import { CstNodeKind } from "../syntax-tree/cst";
import { SemanticTokenTypes } from "../language-server/semantic-tokens";

function getParentStatement(node: SyntaxNode): SyntaxNode {
  if (node.container?.kind === SyntaxKind.Statement) {
    return node.container;
  }

  if (node.container === null) {
    /**
     * The requested node does not have a parent statement.
     *
     * This normally should not happen, as every node (except for the root program) has a parent statement.
     */
    throw new Error("Node has no parent statement");
  }

  return getParentStatement(node.container);
}

/**
 * Keep track of the order of statements.
 *
 * This is used to determine if a node is before another node in the statement order, e.g. for unset variable warnings.
 */
export class StatementOrderCache {
  private id: number = 0;
  private map = new Map<SyntaxNode, number>();

  add(node: SyntaxNode) {
    this.map.set(node, this.id++);
  }

  get(node: SyntaxNode) {
    return this.map.get(node);
  }

  clear(): void {
    this.id = 0;
    this.map.clear();
  }

  /**
   * Returns true if `a` is before `b` in the statement order.
   *
   * @param a - The first node.
   * @param b - The second node.
   * @returns True if `a` is before `b` in the statement order.
   * @throws If either node is not found in the cache.
   */
  isBefore(a: SyntaxNode, b: SyntaxNode) {
    const aId = this.get(getParentStatement(a));
    if (aId === undefined) {
      throw new Error("Node not found in statement order cache");
    }

    const bId = this.get(getParentStatement(b));
    if (bId === undefined) {
      throw new Error("Node not found in statement order cache");
    }

    return aId < bId;
  }
}

export class ReferencesCache {
  /**
   * See {@link resolveReferences} for more information on priority references.
   */
  private priorityList: Reference[] = [];
  private list: Reference[] = [];
  private reverseMap = new MultiMap<SyntaxNode, Reference>();

  clear(): void {
    this.priorityList = [];
    this.list = [];
    this.reverseMap.clear();
  }

  add(reference: Reference): void {
    this.list.push(reference);
  }

  priorityAdd(reference: Reference): void {
    this.priorityList.push(reference);
  }

  addAll(references: Reference[]): void {
    this.list.push(...references);
  }

  addInverse(reference: Reference): void {
    for (const node of iterateReferenceNodes(reference)) {
      this.reverseMap.add(node, reference);
    }
  }

  findReferences(node: SyntaxNode): readonly Reference[] {
    return this.reverseMap.get(node);
  }

  priorityReferences(): Reference[] {
    return this.priorityList;
  }

  normalReferences(): Reference[] {
    return this.list;
  }

  *allReferences(): Iterable<Reference> {
    yield* this.priorityList;
    yield* this.list;
  }

  allReverseReferences(): MultiMap<SyntaxNode, Reference> {
    return this.reverseMap;
  }
}

// Returns the qualified name in reverse order, e.g. "A.B.C" -> ["C", "B", "A"]
export function getQualifiedName(reference: Reference): string[] {
  if (reference.owner.container?.kind === SyntaxKind.MemberCall) {
    const memberCall = reference.owner.container;
    if (memberCall.previous?.element?.ref) {
      const names = getQualifiedName(memberCall.previous.element.ref);
      names.unshift(reference.text);

      return names;
    }
  }

  return [reference.text];
}

/**
 * We've resolved a qualified name, now qualify the entire chain of references.
 * Note: This function assumes that the resolved syntax node and member call are correct,
 * it does not validate the qualified name in any way. This is done in the `SymbolTable` step.
 *
 * Example:
 *
 * ```
 * DCL 1 A1, 2 B, 3 K, 4 C;
 * DCL 1 A2, 2 B, 3 K, 4 C;
 * PUT (A2.B.C); // Symbol `B` should qualify correctly to line 2, and not line 1
 * ```
 */
function assignQualifiedReference(
  unit: CompilationUnit,
  reference: Reference,
  memberCall: MemberCall,
  resolved: QualifiedSyntaxNode,
  matchingSymbols?: readonly QualifiedSyntaxNode[],
) {
  // The names are not matching, this is a partial qualification.
  if (reference.text !== resolved.name) {
    if (!resolved.parent) {
      throw new Error(
        "Resolved parent is null, should not happen. There is probably a mistake in the symbol table.",
      );
    }

    // Try to match the resolved symbol with a reference further up the chain.
    assignReference(unit, reference, resolved.parent);
    return;
  }

  reference.node = resolved.node;
  if (matchingSymbols) {
    reference.nodes = matchingSymbols.map((symbol) => symbol.node);
  }

  // There are more qualified names to resolve, continue up the chain.
  if (memberCall.previous?.element?.ref && resolved.parent) {
    assignReference(unit, memberCall.previous.element.ref, resolved.parent);
  }
}

function assignReference(
  unit: CompilationUnit,
  reference: Reference<SyntaxNode>,
  resolved: QualifiedSyntaxNode,
  matchingSymbols?: readonly QualifiedSyntaxNode[],
) {
  // Special handling for member calls and qualification.
  // We want to assign the resolved references to the entire chain of references.
  if (reference.owner.container?.kind === SyntaxKind.MemberCall) {
    const memberCall = reference.owner.container;
    assignQualifiedReference(
      unit,
      reference,
      memberCall,
      resolved,
      matchingSymbols,
    );
  } else {
    reference.node = resolved.node;
    if (matchingSymbols) {
      reference.nodes = matchingSymbols.map((symbol) => symbol.node);
    }
  }
}

export const isProcedureParameterReference = (
  reference: Reference,
): reference is Reference<ProcedureParameter> =>
  reference.owner.kind === SyntaxKind.ProcedureParameter;

/**
 * Get the matching symbols for a reference given a qualified name.
 *
 * Will return explicitly declared symbols if they exist, otherwise it will return implicit symbols.
 *
 * Side effect: If the reference is ambiguous, the reporter will be used to report the error.
 *
 * @param scope The scope to search in.
 * @param qualifiedName The qualified name to search for.
 * @param token The token to report the error on.
 * @param reporter The reporter to use for errors.
 * @returns The matching symbols.
 */
function getMatchingSymbols(
  unit: CompilationUnit,
  scope: Scope,
  qualifiedName: string[],
  reference: Reference,
  reporter: LinkerErrorReporter,
): readonly QualifiedSyntaxNode[] {
  if (reference.type === ReferenceType.Type) {
    return scope.getTypeSymbols(qualifiedName);
  } else if (reference.type === ReferenceType.TypeOrVariable) {
    // First try to get type symbols
    const typeSymbols = scope.getTypeSymbols(qualifiedName);
    if (typeSymbols.length > 0) {
      return typeSymbols;
    }
    // Else continue to variable symbols
  }

  const getFullName = () => qualifiedName.toReversed().join(".");

  let explicitlyDeclaredSymbols = scope
    .getExplicitSymbols(qualifiedName, {
      /**
       * If the symbol is a procedure parameter, it is only permitted to
       * link against a symbol in the immediate procedure scope.
       */
      searchOnlyImmediateScope: isProcedureParameterReference(reference),
    })
    .filter((symbol) => !symbol.isRedeclared); // Don't resolve reference to redeclared symbols.

  if (reference.owner) {
    const rootComposite = tryExtractRootStructureIfBasedMember(reference.owner);
    if (rootComposite) {
      explicitlyDeclaredSymbols = explicitlyDeclaredSymbols.filter((symbol) =>
        isMemberOfComposite(symbol.node, rootComposite),
      );
    }
  }

  const isAmbiguous = checkRedeclaration(explicitlyDeclaredSymbols);
  if (isAmbiguous) {
    reporter.reportAmbiguousReference(
      reference,
      getFullName(),
      explicitlyDeclaredSymbols,
    );
  }

  if (explicitlyDeclaredSymbols.length > 0) {
    return explicitlyDeclaredSymbols;
  }

  const implicitSymbols = scope.getImplicitSymbols(qualifiedName);
  if (implicitSymbols.length <= 0) {
    return [];
  }

  /**
   * We don't have any explicitly matching symbols, but we have implicit symbols.
   * During the 'NOLAXDCL' compiler flag, we want to emit a warning on the implicit symbols.
   * The mainframe will actually emit an E: IBM1373I compilation error on the _last_ usage of an implicitly declared symbol.
   * See https://github.com/zowe/zowe-pli-language-support/pull/216
   *
   * Another solution was proposed, where we emit the error on the first implicit declaration instead, leading to better developer experience.
   */

  const firstImplicitSymbol = implicitSymbols[0];
  reporter.reportImplicitDeclaration(firstImplicitSymbol);

  if (
    unit.statementOrderCache.isBefore(reference.owner, firstImplicitSymbol.node)
  ) {
    // If the node is before the first implicit symbol, we report a potential unset variable.
    reporter.reportPotentialUnsetVariable(reference.token, getFullName());
  }

  /**
   * We're currently looking at the implicit declaration of a procedure parameter,
   * meaning that there is no explicit declaration for this parameter inside this procedure.
   *
   * In order to make sure that all references to this parameter actually link to the parameter location,
   * we add a "fake" explicit declaration at this location dynamically. This ensures that symbol resolutions
   * inside this procedure scope will always link to this parameter symbol.
   */
  if (isProcedureParameterReference(reference)) {
    scope.symbolTable.addProcedureParameter(reference);
  }

  return [firstImplicitSymbol];
}

function getRelevantSymbol(
  reference: Reference,
  nodes: readonly QualifiedSyntaxNode[],
): QualifiedSyntaxNode | undefined {
  if (nodes.length < 2) {
    return nodes[0];
  }
  if (
    reference.owner.kind === SyntaxKind.LabelReference &&
    reference.owner.container?.kind === SyntaxKind.EndStatement
  ) {
    // In case of a label reference in an END statement
    // We want to link to the label declaration
    // and not to any potential variable with the same name (like a forward declaration)
    for (const node of nodes) {
      if (node.node.kind === SyntaxKind.LabelPrefix) {
        return node;
      }
    }
  }

  return nodes[0];
}

function resolveReference(
  unit: CompilationUnit,
  reference: Reference,
  reporter: LinkerErrorReporter,
) {
  if (reference.node === null || reference.node !== undefined) {
    return;
  }

  const scope = unit.scopeCaches.get(reference.owner);
  if (!scope) {
    return;
  }

  const qualifiedName = getQualifiedName(reference);
  const matchingSymbols = getMatchingSymbols(
    unit,
    scope,
    qualifiedName,
    reference,
    reporter,
  );

  const symbol = getRelevantSymbol(reference, matchingSymbols);
  if (!symbol) {
    reference.node = null;
    return;
  }

  // Assign the resolved symbol to the reference.
  // This function handles assigning references to member calls.
  assignReference(unit, reference, symbol, matchingSymbols);
}

export function resolveReferences(unit: CompilationUnit): void {
  const reporter = new LinkerErrorReporter(
    unit,
    unit.diagnostics.getAcceptor(DiagnosticCategory.Linking),
  );

  // Some references need to be resolved first for all the other references to resolve correctly.
  // These are usually references in TYPE and LIKE attributes
  // Since these influence the symbol table and scoping of other symbols,
  // we need to also restart the symbol table generation.
  const nodesToReprocess = new Set<SyntaxNode>();
  for (const prioReference of unit.referencesCache.priorityReferences()) {
    resolveReference(unit, prioReference, reporter);
    unit.referencesCache.addInverse(prioReference);
    const node = getNodeToReprocess(prioReference);
    if (node) {
      nodesToReprocess.add(node);
    }
  }

  // Starts a second pass of symbol table generation
  // Does not generate new symbol tables/scopes, but reuses existing ones
  // Only processes the nodes that need to be reprocessed
  reiterateSymbols(unit, nodesToReprocess);

  // The symbol table is now completely built, we can resolve all other references.
  for (const normalReference of unit.referencesCache.normalReferences()) {
    resolveReference(unit, normalReference, reporter);
    // Add the reference to the reverse map so we can use it for LSP services
    unit.referencesCache.addInverse(normalReference);
  }
}

function getNodeToReprocess(reference: Reference): SyntaxNode | undefined {
  const priorityElement = getPriorityReferenceElement(reference);
  return (
    getContainer(priorityElement, SyntaxKind.DeclareStatement) ?? undefined
  );
}

export function findTokenElementReference(
  token: Token,
): SyntaxNode | undefined {
  let element = token.element;

  if (isReferenceToken(token.kind) && token.element) {
    // Find the reference belonging to the token
    const ref = getReference(token.element);
    if (ref?.node) {
      element = ref.node;
    } else {
      return undefined;
    }
  } else if (!isNameToken(token.kind)) {
    // Not a reference or a name token
    return undefined;
  }

  return element;
}

export function findElementReferences(
  unit: CompilationUnit,
  element: SyntaxNode,
): readonly Reference<SyntaxNode>[] {
  return unit.referencesCache.findReferences(element);
}

export function getReferenceLocations(
  unit: CompilationUnit,
  uri: URI,
  offset: number,
): Location[] {
  let token = getTokenAt(unit, uri, offset);

  if (!token) {
    return [];
  }

  const element = findTokenElementReference(token);
  if (!element) {
    return [];
  }

  const locations: Location[] = [];
  const reverseReferences = findElementReferences(unit, element);

  const nameToken = getNameToken(element);
  if (nameToken?.uri) {
    locations.push({
      uri: nameToken.uri.toString(),
      range: tokenToRange(nameToken),
    });
  }

  for (const ref of reverseReferences) {
    if (ref.token.uri) {
      locations.push({
        uri: ref.token.uri.toString(),
        range: tokenToRange(ref.token),
      });
    }
  }

  return locations;
}

export function getTokenAt(unit: CompilationUnit, uri: URI, offset: number) {
  let token = binaryTokenSearch(
    unit.services.files.getTokens(uri) ?? [],
    offset,
  );

  if (token && token.kind === CstNodeKind.ExecStatement_ExecFragment) {
    const element = token.element;
    if (element && element.kind === SyntaxKind.ExecStatement) {
      const hostVariableReferences = element.dialectTokens
        .filter((t) => t.semanticType === SemanticTokenTypes.variable)
        .map(({ token }) => token);
      token = binaryTokenSearch(hostVariableReferences, offset);
    }
  }
  return token;
}

function getRootCompositeNode(node: SyntaxNode): DeclaredItem | null {
  let declaredItem = getContainer(node, SyntaxKind.DeclaredItem);
  if (declaredItem && declaredItem.level !== 1) {
    const parentDeclaration = getContainer(
      declaredItem,
      SyntaxKind.DeclareStatement,
    )!;
    let index = parentDeclaration.items.indexOf(declaredItem);
    if (index === -1) {
      return null;
    }
    let previousItem: DeclaredItem = declaredItem;
    do {
      index--;
    } while (
      index > -1 &&
      (previousItem = parentDeclaration.items[index]) &&
      typeof previousItem.level === "number" &&
      previousItem.level > 1
    );
    if (typeof previousItem.level === "number" && previousItem.level === 1) {
      declaredItem = previousItem;
    }
  }
  if (declaredItem?.level !== 1) {
    return null;
  }
  return declaredItem;
}

function tryExtractRootStructureIfBasedMember(
  node: SyntaxNode,
): DeclaredItem | null {
  const referNode = getContainer(node, SyntaxKind.Bound);
  if (referNode?.refer?.element?.element !== node) {
    return null;
  }
  return getRootCompositeNode(referNode);
}

function isMemberOfComposite(node: SyntaxNode, rootComposite: DeclaredItem) {
  return getRootCompositeNode(node) === rootComposite;
}
