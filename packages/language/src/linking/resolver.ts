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

import { IToken } from "chevrotain";
import {
  Diagnostic,
  Location,
  Severity,
  tokenToRange,
} from "../language-server/types";
import { TokenPayload } from "../parser/abstract-parser";
import {
  MemberCall,
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
import {
  PliValidationAcceptor,
  PliValidationBuffer,
} from "../validation/validator";
import * as PLICodes from "../validation/messages/pli-codes";
import { QualifiedSyntaxNode } from "./qualified-syntax-node";

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
  reference: Reference,
  memberCall: MemberCall,
  resolved: QualifiedSyntaxNode,
) {
  // The names are not matching, this is a partial qualification.
  if (reference.text !== resolved.name) {
    if (!resolved.parent) {
      throw new Error(
        "Resolved parent is null, should not happen. There is probably a mistake in the symbol table.",
      );
    }

    // Try to match the resolved symbol with a reference further up the chain.
    assignReference(reference, resolved.parent);
    return;
  }

  reference.node = resolved.node;

  // There are more qualified names to resolve, continue up the chain.
  if (memberCall.previous?.element?.ref && resolved.parent) {
    assignReference(memberCall.previous.element.ref, resolved.parent);
  }
}

function assignReference(
  reference: Reference<SyntaxNode>,
  resolved: QualifiedSyntaxNode,
) {
  // Special handling for member calls and qualification.
  // We want to assign the resolved references to the entire chain of references.
  if (reference.owner.container?.kind === SyntaxKind.MemberCall) {
    const memberCall = reference.owner.container;
    assignQualifiedReference(reference, memberCall, resolved);

    return;
  }

  reference.node = resolved.node;
}

function resolveReference(
  unit: CompilationUnit,
  reference: Reference,
  acceptor: PliValidationAcceptor,
) {
  if (reference.node === null || reference.node !== undefined) {
    return;
  }

  const qualifiedName = getQualifiedName(reference);

  const scope = unit.scopeCaches.get(reference.owner);
  if (!scope) {
    return;
  }

  const symbols = scope.getSymbols(qualifiedName);

  const isAmbiguous = symbols.length > 1;
  if (isAmbiguous) {
    const fullName = qualifiedName.toReversed().join(".");
    // TODO: Currently only emitting on the last member call symbol (`reference.token`)
    // We want to underline the entire qualified name.
    acceptor(Severity.S, PLICodes.Severe.IBM1881I.message(fullName), {
      code: PLICodes.Severe.IBM1881I.fullCode,
      range: tokenToRange(reference.token),
      uri: reference.token.payload?.uri?.toString() ?? "",
    });
  }

  // We take the first symbol, even if there are multiple matching.
  // Ideally, we'd want to reference all matching symbols, but the AST currently only supports a single reference per symbol.
  const symbol = symbols[0];
  if (!symbol) {
    reference.node = null;
    return;
  }

  // Assign the resolved symbol to the reference.
  // This function handles assigning references to member calls.
  assignReference(reference, symbol);

  // Add the inverse reference to the cache.
  unit.references.addInverse(reference);
}

export function resolveReferences(unit: CompilationUnit): Diagnostic[] {
  const validationBuffer = new PliValidationBuffer();
  const acceptor = validationBuffer.getAcceptor();

  for (const reference of unit.references.allReferences()) {
    resolveReference(unit, reference, acceptor);
  }

  return validationBuffer.getDiagnostics();
}

export function findTokenElementReference(
  token: IToken,
): SyntaxNode | undefined {
  const payload = token.payload as TokenPayload;
  let element = payload.element;

  if (isReferenceToken(payload.kind)) {
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
  return unit.references.findReferences(element);
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
  if (nameToken?.payload?.uri) {
    locations.push({
      uri: nameToken.payload.uri.toString(),
      range: tokenToRange(nameToken),
    });
  }

  for (const ref of reverseReferences) {
    if (ref.token.payload?.uri) {
      locations.push({
        uri: ref.token.payload.uri.toString(),
        range: tokenToRange(ref.token),
      });
    }
  }

  return locations;
}
