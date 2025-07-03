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
import { CompilationUnit } from "../workspace/compilation-unit";
import { getSymbolName } from "./util";

/**
 * Always take full qualification over partial qualification.
 */
export enum QualificationStatus {
  NoQualification,
  FullQualification,
  PartialQualification,
}

export class QualifiedSyntaxNode {
  public parent: QualifiedSyntaxNode | null = null;
  public level: number = 1;
  /**
   * Whether the node is an implicit declaration.
   */
  public isImplicit: boolean = false;
  /**
   * Whether the node is redeclared.
   *
   * Will be assigned to a value by the linker after the symbol table has been built.
   */
  public isRedeclared: boolean | undefined = undefined;

  private constructor(
    public readonly token: Token,
    public readonly node: SyntaxNode,
    private readonly unit: CompilationUnit,
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
    unit: CompilationUnit,
    token: Token,
    node: SyntaxNode,
    parent: QualifiedSyntaxNode | null = null,
    level: number = 1,
  ): QualifiedSyntaxNode {
    return new QualifiedSyntaxNode(token, node, unit, {
      parent,
      level,
    });
  }

  /**
   * A qualified syntax node that is implicitly declared. E.g.: `A = 123;` or the 'B' in `A, B = 123;`
   */
  static createImplicit(
    unit: CompilationUnit,
    token: Token,
    node: SyntaxNode,
  ): QualifiedSyntaxNode {
    return new QualifiedSyntaxNode(token, node, unit, {
      isImplicit: true,
    });
  }

  /**
   * The name of the node after compilation option case transformations.
   */
  get name(): string {
    return getSymbolName(this.unit, this.rawName);
  }

  /**
   * The raw name of the node, before compilation option case transformations.
   */
  get rawName(): string {
    return this.token?.image ?? "";
  }

  getParent(): QualifiedSyntaxNode | null {
    return this.parent;
  }

  private getSymbolName(name: string) {
    return getSymbolName(this.unit, name);
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
  getQualificationStatus(_qualifiers: readonly string[]): QualificationStatus {
    const qualifiers = _qualifiers.map(this.getSymbolName.bind(this));
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
