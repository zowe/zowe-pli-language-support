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
import { MemberCall, SyntaxKind, SyntaxNode } from "../../syntax-tree/ast";
import { CstNodeKind } from "../../syntax-tree/cst";

export enum FollowKind {
  CstNode,
  LocalReference,
  QualifiedReference,
}

export interface FollowCstNode {
  kind: FollowKind.CstNode;
  type: CstNodeKind;
}

export interface FollowLocalReference {
  kind: FollowKind.LocalReference;
}

export interface FollowQualifiedReference {
  kind: FollowKind.QualifiedReference;
  previous: MemberCall;
}

export type FollowElement =
  | FollowCstNode
  | FollowLocalReference
  | FollowQualifiedReference;

export function getFollowElements(
  context: SyntaxNode | undefined,
  token: IToken,
): FollowElement[] {
  const elements: FollowElement[] = [];
  const kind = token.payload?.kind as CstNodeKind | undefined;
  switch (kind) {
    case CstNodeKind.AssignmentStatement_Operator:
    case CstNodeKind.BinaryExpression_Operator:
    case CstNodeKind.UnaryExpression_Operator:
    case CstNodeKind.InitialAttribute_OpenParenDirect:
    // TODO: Percentage can be followed by all the preprocessor directives
    case CstNodeKind.Percentage:
      elements.push({
        kind: FollowKind.LocalReference,
      });
      break;
    case CstNodeKind.MemberCall_Dot:
      if (context?.kind === SyntaxKind.MemberCall) {
        const parent = context.previous;
        if (parent) {
          elements.push({
            kind: FollowKind.QualifiedReference,
            previous: parent,
          });
        }
      }
      break;
  }
  return elements;
}

export function provideEntryPointFollowElements(): FollowElement[] {
  return [];
}
