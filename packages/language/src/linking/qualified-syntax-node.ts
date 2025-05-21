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

import type { IToken } from "chevrotain";
import type { SyntaxNode } from "../syntax-tree/ast";

/**
 * Always take full qualification over partial qualification.
 */
export enum QualificationStatus {
  NoQualification,
  FullQualification,
  PartialQualification,
}

export class QualifiedSyntaxNode {
  node: SyntaxNode;
  parent: QualifiedSyntaxNode | null;
  level: number;
  nameToken: IToken;

  /**
   * The symbol is redeclared in the same scope.
   * For example:
   *
   * ```pli
   * // Case 1
   * DCL A;
   * DCL A;
   *
   * // Case 2
   * DCL A, A;
   *
   * // Case 3
   * A: PROCEDURE;
   * A: PROCEDURE;
   *
   * // Case 4
   * DCL 1 A,
   *       2 B,
   *       2 B;
   * ```
   */
  // isRedeclared: boolean;

  constructor(
    nameToken: IToken,
    node: SyntaxNode,
    parent: QualifiedSyntaxNode | null = null,
    level: number = 1,
  ) {
    this.nameToken = nameToken;
    this.node = node;
    this.parent = parent;
    this.level = level;
  }

  get name(): string {
    return this.nameToken.image;
  }

  getParent(): QualifiedSyntaxNode | null {
    return this.parent;
  }

  /**
   * By walking the qualification chain, we can determine the qualification status of the current node.
   *
   * Example:
   *
   * ```
   * DCL 1 A, 2 B, 3 C;
   * PUT (A.B.C); // `C` has `FullQualification`
   * PUT (A.C);   // `C` has `PartialQualification`
   * ```
   */
  getQualificationStatus(qualifiers: readonly string[]): QualificationStatus {
    const qualifier = qualifiers[0];
    if (!qualifier) {
      return QualificationStatus.NoQualification;
    }

    // If the current node is the same as the qualifier, we can remove it from the list.
    const nextQualifiers =
      this.name === qualifier ? qualifiers.slice(1) : qualifiers;

    // If there are no qualifiers left, we can determine the qualification status.
    if (nextQualifiers.length <= 0) {
      if (!this.parent) {
        // If there is no parent, the current node is the root node.
        return QualificationStatus.FullQualification;
      } else {
        // If there are parents left, the current node is partially qualified.
        return QualificationStatus.PartialQualification;
      }
    }

    // We have qualifiers left, but no parent. This does not qualify.
    if (!this.parent) {
      return QualificationStatus.NoQualification;
    }

    // We have qualifiers left, and a parent. We continue the search.
    return this.parent.getQualificationStatus(nextQualifiers);
  }
}
