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

import { Token } from "../parser/tokens";
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
  public readonly parent: QualifiedSyntaxNode | null;
  public readonly level: number;
  /**
   * Whether the node is an implicit declaration.
   */
  public readonly isImplicit: boolean;
  /**
   * Whether the node is redeclared.
   *
   * Will be assigned to a value by the linker after the symbol table has been built.
   */
  public isRedeclared: boolean | undefined = undefined;

  private constructor(
    public readonly token: Token,
    public readonly node: SyntaxNode,
    options: {
      parent?: QualifiedSyntaxNode | null;
      level?: number;
      isImplicit?: boolean;
    } = {},
  ) {
    this.parent = options.parent ?? null;
    this.level = options.level ?? 1;
    this.isImplicit = options.isImplicit ?? false;
  }

  /**
   * A qualified syntax node that is explicitly declared. E.g.: `DCL 1 A;` or the 'B' in `DCL 1 A, 2 B;`
   */
  static createExplicit(
    token: Token,
    node: SyntaxNode,
    parent: QualifiedSyntaxNode | null = null,
    level: number = 1,
  ): QualifiedSyntaxNode {
    return new QualifiedSyntaxNode(token, node, {
      parent,
      level,
    });
  }

  /**
   * A qualified syntax node that is implicitly declared. E.g.: `A = 123;` or the 'B' in `A, B = 123;`
   */
  static createImplicit(token: Token, node: SyntaxNode): QualifiedSyntaxNode {
    return new QualifiedSyntaxNode(token, node, {
      isImplicit: true,
    });
  }

  /**
   * The name of the node after compilation option case transformations.
   */
  get name(): string {
    return this.token.image;
  }

  /**
   * The raw name of the node, before compilation option case transformations.
   */
  get rawName(): string {
    return this.token.originalImage;
  }

  getParent(): QualifiedSyntaxNode | null {
    return this.parent;
  }

  getId(): string {
    // FYI: We used to cache this ID - but it's actually only used once per node, so caching is not necessary.
    let id = this.isImplicit
      ? // Ensure that implicit and explicit declarations get different IDs
        // Some declarations (mainly parameters) are first implicitly declared
        // and then augmented to be explicit declarations
        "implicit"
      : "";
    let current: QualifiedSyntaxNode | null = this;
    while (current) {
      // The ID of the token uniquely identifies the node in the source code
      // It can sometimes be undefined, still push something to avoid collisions
      id += "_" + (current.token.id ?? "NaN");
      current = current.parent;
    }
    return id;
  }

  /**
   * By walking the qualification chain, we can determine the qualification status of the current node.
   *
   * Example:
   *
   * ```pli
   * DCL 1 A, 2 B, 3 C;
   * PUT (A.B.C); // `C` has `FullQualification`
   * PUT (A.C);   // `C` has `PartialQualification`
   * ```
   */
  getQualificationStatus(
    rawQualifiers: readonly string[],
  ): QualificationStatus {
    const qualifiers = rawQualifiers;
    const [qualifier] = qualifiers;

    if (!qualifier) {
      return QualificationStatus.NoQualification;
    }

    // If the current name matches the qualifier, we can remove it from the list.
    const nameMatches = this.name === qualifier;
    const nextQualifiers = nameMatches ? qualifiers.slice(1) : qualifiers;

    // If there are no qualifiers left, we can determine the qualification status.
    const noQualifiersLeft = nextQualifiers.length <= 0;
    if (noQualifiersLeft) {
      // If there is no parent, the current node is the root node.
      const isRootNode = !this.parent;
      if (isRootNode) {
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
    const parentStatus = this.parent.getQualificationStatus(nextQualifiers);
    switch (parentStatus) {
      // If the parent is fully qualified, but our name didn't match, we are partially qualified.
      case QualificationStatus.FullQualification:
        return nameMatches
          ? QualificationStatus.FullQualification
          : QualificationStatus.PartialQualification;
      default:
        return parentStatus;
    }
  }
}
