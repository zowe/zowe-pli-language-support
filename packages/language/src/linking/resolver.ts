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
import { Location, tokenToRange } from "../language-server/types";
import { TokenPayload } from "../parser/abstract-parser";
import { Reference, SyntaxKind, SyntaxNode } from "../syntax-tree/ast";
import { binaryTokenSearch } from "../utils/search";
import {
  getNameToken,
  getReference,
  isNameToken,
  isReferenceToken,
} from "./tokens";
import { URI } from "../utils/uri";
import { CompilationUnit } from "../workspace/compilation-unit";

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

export function resolveReference<T extends SyntaxNode>(
  unit: CompilationUnit,
  reference: Reference<T> | null,
): T | undefined {
  if (reference === null || reference.node === null) {
    return undefined;
  }

  if (reference.node !== undefined) {
    return reference.node;
  }

  const qualifiedName = getQualifiedName(reference);

  const scope = unit.scopeCaches.get(reference.owner);
  if (!scope) {
    return undefined;
  }

  const symbols = scope.getSymbols(qualifiedName);
  const symbol = symbols[0];
  if (!symbol) {
    reference.node = null;
    return undefined;
  }

  if (symbols.length > 1) {
    // TODO: Diagnostic error about ambiguity on `symbols` locations
  }

  reference.node = symbol as T;
  unit.references.addInverse(reference);
  return symbol as T;
}

export function resolveReferences(unit: CompilationUnit): void {
  for (const reference of unit.references.allReferences()) {
    resolveReference(unit, reference);
  }
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
