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
  DeclaredItem,
  DeclaredItemElement,
  DeclaredVariable,
  SyntaxKind,
  SyntaxNode,
  WildcardItem,
} from "../syntax-tree/ast";
import { PliValidationAcceptor } from "../validation/validator";
import { SymbolTable } from "./symbol-table";
import { QualifiedSyntaxNode } from "./qualified-syntax-node";
import { MultiMap } from "../utils/collections";
import { getNameToken } from "./tokens";
import { LinkerErrorReporter } from "./error";
import { Token } from "../parser/tokens";

type UnrolledItem = {
  kind: SyntaxKind;
  level: number | null;
  levelToken: Token | null;
  node: DeclaredVariable | WildcardItem;
  container: SyntaxNode;
};

/**
 * Finds the level and level token for a given node.
 *
 * In the case of a factorized declaration, we walk up the hierarchy until we find the
 * level token in a parent node.
 *
 * @param node - The node to find the level token for.
 * @returns The level and level token for the given node, or `null` if no level is set.
 */
function findLevel(node: SyntaxNode): [number, Token] | null {
  if (
    node.kind === SyntaxKind.DeclaredItem &&
    node.level !== null &&
    node.levelToken !== null
  ) {
    return [node.level, node.levelToken];
  }

  if (node.container) {
    return findLevel(node.container);
  }

  return null;
}

/**
 * A wildcard item is not a name token, but we need the get the token to index it.
 */
function getDeclaredItemToken(node: SyntaxNode): Token | undefined {
  if (node.kind === SyntaxKind.WildcardItem) {
    return node.token ?? undefined;
  }

  return getNameToken(node);
}

/**
 * Unrolls factorized declarations.
 *
 * In the case of factorized variables, a single
 * DeclaredItem can contain multiple names. e.g.:
 * ```
 * DCL 1 A,
 *       2 (B,C,D),
 *          3 E;
 * ```
 * Appears to be handled like this in the PL/I compiler:
 * ```
 *   DCL 1 A,
 *         2 B,
 *         2 C,
 *         2 D,
 *           3 E;
 * ```
 */
function unrollFactorized(
  rolledItems: readonly DeclaredItemElement[],
  parent: DeclaredItem | null = null,
): UnrolledItem[] {
  const items = rolledItems.slice(); // Explicitly make a copy of the items, to use `.shift()`
  const variables: UnrolledItem[] = [];

  /**
   * We iterate over the items and unroll `DeclaredItem`s.
   *
   * Since a factorized variable may use both the local and the parent level, e.g.:
   * ```
   * DCL 1 A, 2 (B);
   * DCL 1 A, (2 B);
   * ```
   *
   * We walk up the parent container chain to find the first available level token.
   *
   * TODO: Should error out when there are conflicting levels, e.g.:
   * ```
   * DCL 1 A, 2 (3 B); // -> Error: IBM1376I
   * ```
   */
  for (const item of items) {
    if (item.kind === SyntaxKind.DeclaredItem) {
      variables.push(...unrollFactorized(item.elements, item));
    } else {
      // All non-`DeclaredItem`s should have a parent. This is a sanity check.
      if (parent === null) {
        continue;
      }

      const [level, levelToken] = findLevel(item) ?? [null, null];

      variables.push({
        kind: item.kind,
        level,
        levelToken,
        node: item,
        container: parent,
      });
    }
  }

  return variables;
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
  private items: UnrolledItem[];
  private reporter: LinkerErrorReporter;

  private constructor(
    items: readonly DeclaredItem[],
    accept: PliValidationAcceptor,
  ) {
    this.items = unrollFactorized(items);
    this.reporter = new LinkerErrorReporter(accept);
  }

  static parseAndAddToTable(
    table: SymbolTable,
    items: readonly DeclaredItem[],
    accept: PliValidationAcceptor,
  ): void {
    // Use 0 as a default level to start the generation.
    // TODO: Maybe make this `null` to represent the root scope.
    new DeclaredItemParser(items, accept).generate(table, null, 0);
  }

  private peek(): UnrolledItem | undefined {
    return this.items[0];
  }

  private pop(): UnrolledItem | undefined {
    return this.items.shift();
  }

  private getLevel(item: UnrolledItem): number {
    // TODO: When creating a structured declaration, throw a IBM1364I E if level is not set.
    const level = item.level;

    // When level is not set, we assume 1 like the PL/I compiler seems to do.
    if (level === null) {
      return 1;
    }

    // TODO: get max level from compilation unit? If e.g. compilation flags can change this.
    if (level > 255) {
      this.reporter.reportLevelError(item.levelToken!);

      return 255;
    }

    return level;
  }

  private generate(
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
      const token = getDeclaredItemToken(item.node);
      if (!token) {
        continue;
      }

      const name = token.image;

      // Check for redeclarations: A wildcard item is not a name, so we don't need to check for redeclarations.
      // Lazy `isRedeclared` function
      const isRedeclared = () => nodes.get(name).length > 0;
      if (
        item.kind !== SyntaxKind.WildcardItem &&
        item.level !== null &&
        isRedeclared()
      ) {
        // TODO: Replace name by asterix, somehow ...
        this.reporter.reportRedeclaration(token);
      }

      // Otherwise, we can add the node to the symbol table.
      const node = new QualifiedSyntaxNode(token, item.node, parent, level);

      nodes.add(name, node);
      table.addSymbolDeclaration(name, node);
      this.generate(table, node, level);
    }
  }
}
