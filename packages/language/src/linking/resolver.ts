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

import { Reference, SyntaxNode } from "../syntax-tree/ast";
import { SourceFile } from "../workspace/source-file";

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

export function resolveReference<T extends SyntaxNode>(
  sourceFile: SourceFile,
  reference: Reference<T> | null,
): T | undefined {
  if (reference === null || reference.node === null) {
    return undefined;
  }
  if (reference.node === undefined) {
    const symbol = sourceFile.symbols.getSymbol(
      reference.owner,
      reference.text,
    );
    if (symbol) {
      reference.node = symbol as T;
      sourceFile.references.addInverse(reference);
      return symbol as T;
    } else {
      reference.node = null;
      return undefined;
    }
  }
  return reference.node;
}

export function resolveReferences(sourceFile: SourceFile): void {
  for (const reference of sourceFile.references.allReferences()) {
    resolveReference(sourceFile, reference);
  }
}
