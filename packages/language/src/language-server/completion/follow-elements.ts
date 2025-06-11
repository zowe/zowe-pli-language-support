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
import { CompletionKeywords, PreprocessorCompletionKeywords } from "./keywords";

const CompletionKeywordsArray = new Array(...CompletionKeywords.keys());
const PreprocessorCompletionKeywordsArray = new Array(
  ...PreprocessorCompletionKeywords.keys(),
);
const AllKeywordsArray = [
  ...CompletionKeywordsArray,
  ...PreprocessorCompletionKeywordsArray,
];

export enum FollowKind {
  CstNode,
  LocalReference,
  QualifiedReference,
}

export interface FollowCstNode {
  kind: FollowKind.CstNode;
  types: CstNodeKind[];
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
    // TODO: add more entry points for the completion of expressions
    case CstNodeKind.DeactivateStatement_Semicolon:
    case CstNodeKind.ActivateStatement_Semicolon:
    case CstNodeKind.ProcedureStatement_Semicolon0:
    case CstNodeKind.ProcedureStatement_Semicolon1:
    case CstNodeKind.EntryStatement_Semicolon:
    case CstNodeKind.AllocateStatement_Semicolon:
    case CstNodeKind.AssignmentStatement_Semicolon:
    case CstNodeKind.AttachStatement_Semicolon:
    case CstNodeKind.BeginStatement_Semicolon0:
    case CstNodeKind.BeginStatement_Semicolon1:
    case CstNodeKind.CallStatement_Semicolon:
    case CstNodeKind.CancelThreadStatement_Semicolon:
    case CstNodeKind.CloseStatement_Semicolon:
    case CstNodeKind.DefaultStatement_Semicolon:
    case CstNodeKind.DefineAliasStatement_Semicolon:
    case CstNodeKind.DefineOrdinalStatement_Semicolon:
    case CstNodeKind.DefineStructureStatement_Semicolon:
    case CstNodeKind.DelayStatement_Semicolon:
    case CstNodeKind.DeleteStatement_Semicolon:
    case CstNodeKind.DetachStatement_Semicolon:
    case CstNodeKind.DisplayStatement_Semicolon:
    case CstNodeKind.DoStatement_Semicolon0:
    case CstNodeKind.DoStatement_Semicolon1:
    case CstNodeKind.ExecStatement_Semicolon:
    case CstNodeKind.ExitStatement_Semicolon:
    case CstNodeKind.FetchStatement_Semicolon:
    case CstNodeKind.FlushStatement_Semicolon:
    case CstNodeKind.FormatStatement_Semicolon:
    case CstNodeKind.FreeStatement_Semicolon:
    case CstNodeKind.GetStatement_Semicolon:
    case CstNodeKind.GoToStatement_Semicolon:
    case CstNodeKind.IterateStatement_Semicolon:
    case CstNodeKind.LeaveStatement_Semicolon:
    case CstNodeKind.LocateStatement_Semicolon:
    case CstNodeKind.NullStatement_Semicolon:
    case CstNodeKind.OnStatement_Semicolon:
    case CstNodeKind.OpenStatement_Semicolon:
    case CstNodeKind.PutStatement_Semicolon:
    case CstNodeKind.QualifyStatement_Semicolon0:
    case CstNodeKind.QualifyStatement_Semicolon1:
    case CstNodeKind.ReadStatement_Semicolon:
    case CstNodeKind.ReinitStatement_Semicolon:
    case CstNodeKind.ReleaseStatement_Semicolon:
    case CstNodeKind.ResignalStatement_Semicolon:
    case CstNodeKind.ReturnStatement_Semicolon:
    case CstNodeKind.RevertStatement_Semicolon:
    case CstNodeKind.RewriteStatement_Semicolon:
    case CstNodeKind.SelectStatement_Semicolon0:
    case CstNodeKind.SelectStatement_Semicolon1:
    case CstNodeKind.SignalStatement_Semicolon:
    case CstNodeKind.StopStatement_Semicolon:
    case CstNodeKind.WaitStatement_Semicolon:
    case CstNodeKind.WriteStatement_Semicolon:
    case CstNodeKind.DeclareStatement_Semicolon:
      elements.push({
        kind: FollowKind.CstNode,
        types: AllKeywordsArray,
      });
      break;
    case CstNodeKind.AssignmentStatement_Operator:
    case CstNodeKind.BinaryExpression_Operator:
    case CstNodeKind.UnaryExpression_Operator:
    case CstNodeKind.InitialAttribute_OpenParenDirect:
      elements.push({
        kind: FollowKind.LocalReference,
      });
      break;
    case CstNodeKind.Percentage:
      elements.push(
        {
          kind: FollowKind.LocalReference,
        },
        {
          kind: FollowKind.CstNode,
          types: PreprocessorCompletionKeywordsArray,
        },
      );
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
  /**
   * TODO @didrikmunther: What follow elements are available for an empty program?
   */
  return [
    {
      kind: FollowKind.CstNode,
      types: AllKeywordsArray,
    },
  ];
}
