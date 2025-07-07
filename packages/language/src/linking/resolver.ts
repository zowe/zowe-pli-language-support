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

import { Diagnostic, Location, tokenToRange } from "../language-server/types";
import { TokenPayload, Token } from "../parser/tokens";
import {
  MemberCall,
  ProcedureParameter,
  Reference,
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
import { PliValidationBuffer } from "../validation/validator";
import { QualifiedSyntaxNode } from "./qualified-syntax-node";
import { LinkerErrorReporter } from "./error";
import { Scope } from "./scope";
import { getSymbolName } from "./util";

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
  private list: Reference[] = [];
  private reverseMap = new Map<SyntaxNode, Reference[]>();

  clear(): void {
    this.list = [];
    this.reverseMap.clear();
  }

  add(reference: Reference): void {
    this.list.push(reference);
  }

  addAll(references: Reference[]): void {
    this.list.push(...references);
  }

  addInverse(reference: Reference): void {
    if (reference.node) {
      let list = this.reverseMap.get(reference.node);
      if (!list) {
        list = [];
        this.reverseMap.set(reference.node, list);
      }
      list.push(reference);
    }
  }

  findReferences(node: SyntaxNode): Reference[] {
    return this.reverseMap.get(node) || [];
  }

  allReferences(): Reference[] {
    return this.list;
  }

  allReverseReferences(): Map<SyntaxNode, Reference[]> {
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
) {
  // The names are not matching, this is a partial qualification.
  if (getSymbolName(unit, reference.text) !== resolved.name) {
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

  // There are more qualified names to resolve, continue up the chain.
  if (memberCall.previous?.element?.ref && resolved.parent) {
    assignReference(unit, memberCall.previous.element.ref, resolved.parent);
  }
}

function assignReference(
  unit: CompilationUnit,
  reference: Reference<SyntaxNode>,
  resolved: QualifiedSyntaxNode,
) {
  // Special handling for member calls and qualification.
  // We want to assign the resolved references to the entire chain of references.
  if (reference.owner.container?.kind === SyntaxKind.MemberCall) {
    const memberCall = reference.owner.container;
    assignQualifiedReference(unit, reference, memberCall, resolved);

    return;
  }

  reference.node = resolved.node;
}

const isProcedureParameterReference = (
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
): QualifiedSyntaxNode[] {
  const getFullName = () => qualifiedName.toReversed().join(".");

  const explicitlyDeclaredSymbols = scope
    .getExplicitSymbols(qualifiedName, {
      /**
       * If the symbol is a procedure parameter, it is only permitted to
       * link against a symbol in the immediate procedure scope.
       */
      searchOnlyImmediateScope: isProcedureParameterReference(reference),
    })
    .filter((symbol) => !symbol.isRedeclared); // Don't resolve reference to redeclared symbols.

  const isAmbiguous = explicitlyDeclaredSymbols.length > 1;
  if (isAmbiguous) {
    reporter.reportAmbiguousReference(reference, getFullName());
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

  // We take the first symbol, even if there are multiple matching.
  // Ideally, we'd want to reference all matching symbols, but the AST currently only supports a single reference per symbol.
  const symbol = matchingSymbols[0];
  if (!symbol) {
    reference.node = null;
    return;
  }

  // Assign the resolved symbol to the reference.
  // This function handles assigning references to member calls.
  assignReference(unit, reference, symbol);
}

export function resolveReferences(unit: CompilationUnit): Diagnostic[] {
  const validationBuffer = new PliValidationBuffer();
  const reporter = new LinkerErrorReporter(
    unit,
    validationBuffer.getAcceptor(),
  );

  for (const reference of unit.referencesCache.allReferences()) {
    resolveReference(unit, reference, reporter);
    // Add the reference to the reverse map so we can use it for LSP services
    unit.referencesCache.addInverse(reference);
  }

  return validationBuffer.getDiagnostics();
}

export function findTokenElementReference(
  token: Token,
): SyntaxNode | undefined {
  const payload = token.payload as TokenPayload;
  let element = payload.element;

  if (isReferenceToken(payload.kind) && payload.element) {
    // Find the reference beloging to the token
    const ref = getReference(payload.element);
    if (ref?.node) {
      element = ref.node;
    } else {
      return undefined;
    }
  } else if (!isNameToken(payload.kind)) {
    // Not a reference or a name token
    return undefined;
  }

  return element;
}

export function findElementReferences(
  unit: CompilationUnit,
  element: SyntaxNode,
): Reference<SyntaxNode>[] {
  return unit.referencesCache.findReferences(element);
}

export function getReferenceLocations(
  unit: CompilationUnit,
  uri: URI,
  offset: number,
): Location[] {
  const token = binaryTokenSearch(
    unit.tokens.fileTokens[uri.toString()] ?? [],
    offset,
  );
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
  if (nameToken?.payload.uri) {
    locations.push({
      uri: nameToken.payload.uri.toString(),
      range: tokenToRange(nameToken),
    });
  }

  for (const ref of reverseReferences) {
    if (ref.token.payload.uri) {
      locations.push({
        uri: ref.token.payload.uri.toString(),
        range: tokenToRange(ref.token),
      });
    }
  }

  return locations;
}
