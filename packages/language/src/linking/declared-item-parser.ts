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
import { DeclaredItem } from "../syntax-tree/ast";
import { PliValidationAcceptor } from "../validation/validator";
import * as PLICodes from "../validation/messages/pli-codes";
import { SymbolTable } from "./symbol-table";
import { QualifiedSyntaxNode } from "./qualified-syntax-node";
import { MultiMap } from "../utils/collections";
import { forEachNode } from "../syntax-tree/ast-iterator";
import { getNameToken } from "./tokens";

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

  private getLevel(item: DeclaredItem): number {
    // When level is not set, we assume 1 like the PL1 compiler seems to do.
    // TODO: When creating a structured declaration, throw a IBM1364I E if level is not set.
    let level = item.level ?? 1;

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
  ) {
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
      // DeclaredItem can contain multiple names.
      // TODO: Unroll factorized declarations, e.g.:
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
      forEachNode(item, (child) => {
        const nameToken = getNameToken(child);
        if (!nameToken) {
          return;
        }

        const name = nameToken.image;

        // TODO: Replace name by asterix, somehow ...
        const isRedeclared = nodes.get(name).length > 0;
        if (isRedeclared) {
          this.accept(Severity.E, PLICodes.Error.IBM1308I.message(name), {
            code: PLICodes.Error.IBM1308I.fullCode,
            range: tokenToRange(nameToken),
            uri: tokenToUri(nameToken) ?? "",
          });
        }

        // Otherwise, we can add the node to the symbol table.
        const node = new QualifiedSyntaxNode(nameToken, child, parent, level);

        nodes.add(name, node);
        table.addSymbolDeclaration(name, node);
        this._generate(table, node, level);

        // const isRootLevel = level === 1;

        // if (nodes.get(name).length > 0) {
        //   // If we've already seen this name on the current level, we have a redeclaration.
        //   this.reportRedeclarationError(nameToken, level);
        // } else if (isRootLevel && table.getRootDeclarations(name).length > 0) {
        //   // If we've already seen this name in the root scope, we have a redeclaration.
        //   this.reportRedeclarationError(nameToken, level);
        // } else {
        //   // Otherwise, we can add the node to the symbol table.
        //   const node = new QualifiedSyntaxNode(name, child, {
        //     parent,
        //     level,
        //   });

        //   nodes.add(name, node);
        //   table.addSymbolDeclaration(name, node);
        //   this._generate(table, node, level);
        // }
      });
    }
  }

  generate(table: SymbolTable) {
    // Use 0 as a default level to start the generation.
    // TODO: Maybe make this `null` to represent the root scope.
    this._generate(table, null, 0);
  }
}
