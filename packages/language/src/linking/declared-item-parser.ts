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

import { Severity, tokenToRange, tokenToUri } from "../language-server/types";
import { DeclaredItem, SyntaxKind, SyntaxNode } from "../syntax-tree/ast";
import { PliValidationAcceptor } from "../validation/validator";
import * as PLICodes from "../validation/messages/pli-codes";
import { SymbolTable } from "./symbol-table";
import { QualifiedSyntaxNode } from "./qualified-syntax-node";
import { MultiMap } from "../utils/collections";
import { getNameToken } from "./tokens";
import { IToken } from "chevrotain";

/**
 * A wildcard item is not a name token, but we need the get the token to index it.
 */
function getDeclaredItemToken(node: SyntaxNode): IToken | undefined {
  if (node.kind === SyntaxKind.WildcardItem) {
    return node.token ?? undefined;
  }

  return getNameToken(node);
}

/**
 * Handles "parsing" the hierarchy of a list of `DeclaredItem`s.
 *
 * This is done by reversing the following declarations:
 *
 * ```pli
 * DCL 1 A1,
 *       2 B,
 *         3 K,
 *       2 C,
 *         3 K;
 * ```
 *
 * Into this kind of linked list data structure:
 *
 * ```
 * K -> B -> A1
 * B -> A1
 * K -> C -> A1
 * C -> A1
 * ```
 */
export class DeclaredItemParser {
  private items: DeclaredItem[];
  private accept: PliValidationAcceptor;

  constructor(items: readonly DeclaredItem[], accept: PliValidationAcceptor) {
    this.items = items.slice(); // Explicitly make a copy of the items, to use `.shift()` in `this.pop()`
    this.accept = accept;
  }

  private peek(): DeclaredItem | undefined {
    return this.items[0];
  }

  private pop(): DeclaredItem | undefined {
    return this.items.shift();
  }

  private unshift(...items: DeclaredItem[]): void {
    this.items.unshift(...items);
  }

  private getLevel(item: DeclaredItem): number {
    // TODO: When creating a structured declaration, throw a IBM1364I E if level is not set.
    let level = item.level;

    // Unwrap factorized declarations in an attempt to find the level.
    while (level === null && item.container?.kind === SyntaxKind.DeclaredItem) {
      item = item.container;
      level = item.level;
    }

    if (level === null) {
      // When level is not set, we assume 1 like the PL1 compiler seems to do.
      level = 1;
    }

    // TODO: get max level from compilation unit? If e.g. compilation flags can change this.
    if (level > 255) {
      level = 255;

      this.accept(Severity.E, PLICodes.Error.IBM1363I.message, {
        code: PLICodes.Error.IBM1363I.fullCode,
        range: tokenToRange(item.levelToken!),
        uri: tokenToUri(item.levelToken!) ?? "",
      });
    }

    return level;
  }

  private _generate(
    table: SymbolTable,
    parent: QualifiedSyntaxNode | null,
    parentLevel: number,
  ): void {
    // Keep track of all nodes we've seen on the current level, for redeclaration detection.
    const nodes = new MultiMap<string, QualifiedSyntaxNode>();

    // Consume many items on the same level.
    while (true) {
      const item = this.peek();
      if (!item) {
        break;
      }

      const level = this.getLevel(item);
      // The item we're looking at is not a part of the current scope, let's exit.
      if (level <= parentLevel) {
        break;
      }

      // This item is part of the current scope, let's consume it.
      this.pop();

      // In the case of factorized variables, a single
      // DeclaredItem can contain multiple names. e.g.:
      // ```
      // DCL 1 A,
      //       2 (B,C,D),
      //          3 E;
      // ```
      // Appears to be handled like this in the PL/I compiler:
      // ```
      //   DCL 1 A,
      //         2 B,
      //         2 C,
      //         2 D,
      //           3 E;
      // ```
      const factorized: DeclaredItem[] = [];

      for (const child of item.elements) {
        if (child.kind === SyntaxKind.DeclaredItem) {
          // We have a factorized variable declaration at hand here.
          // Note that we need to push them to a separate list first, so they don't end up in reverse order
          factorized.push(child);
        } else {
          const token = getDeclaredItemToken(child);
          if (!token) {
            continue;
          }

          const name = token.image;

          // A wildcard item is not a name, so we don't need to check for redeclarations.
          if (child.kind !== SyntaxKind.WildcardItem) {
            // TODO: Replace name by asterix, somehow ...
            const isRedeclared = nodes.get(name).length > 0;
            if (isRedeclared) {
              this.accept(Severity.E, PLICodes.Error.IBM1308I.message(name), {
                code: PLICodes.Error.IBM1308I.fullCode,
                range: tokenToRange(token),
                uri: tokenToUri(token) ?? "",
              });
            }
          }

          // Otherwise, we can add the node to the symbol table.
          const node = new QualifiedSyntaxNode(token, child, parent, level);

          nodes.add(name, node);
          table.addSymbolDeclaration(name, node);
          this._generate(table, node, level);
        }
      }

      // Unshift the factorized variables to the top of the stack, so we can process them immediately
      this.unshift(...factorized);
    }
  }

  generate(table: SymbolTable): void {
    // Use 0 as a default level to start the generation.
    // TODO: Maybe make this `null` to represent the root scope.
    this._generate(table, null, 0);
  }
}
