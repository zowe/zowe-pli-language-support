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

import { Token } from "../../parser/tokens";
import { MemberCall, SyntaxKind, SyntaxNode } from "../../syntax-tree/ast";
import { CstNodeKind } from "../../syntax-tree/cst";
import {
  StatementStartCompletionKeywords,
  StatementStartPreprocessorCompletionKeywords,
} from "./keywords";
import * as tokens from "../../parser/tokens";

const StatementStartCompletionKeywordsArray = new Array(
  ...StatementStartCompletionKeywords.keys(),
);
const StatementStartPreprocessorCompletionKeywordsArray = new Array(
  ...StatementStartPreprocessorCompletionKeywords.keys(),
);
const AllStatementStartKeywordsArray = [
  ...StatementStartCompletionKeywordsArray,
  ...StatementStartPreprocessorCompletionKeywordsArray,
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

const binaryTokens = [
  tokens.StarStar,
  tokens.Star,
  tokens.Slash,
  tokens.Plus,
  tokens.Minus,
  tokens.PipePipe,
  tokens.LessThan,
  tokens.NotLessThan,
  tokens.LessThanEquals,
  tokens.Equals,
  tokens.NotEquals,
  tokens.LessThanGreaterThan,
  tokens.GreaterThanEquals,
  tokens.GreaterThan,
  tokens.NotGreaterThan,
  tokens.Ampersand,
  tokens.Pipe,
  tokens.Not,
].map((token) => token.name);

function getFollowElementsForUnknownToken(token: Token): FollowElement[] {
  switch (token.tokenType.name) {
    // We probably are in an assignment statement
    case "=":
    // We probably are in a parenthesis expression
    case "(":
    // We probably are in a parenthesis expression, after a comma
    case ",":
      return [
        {
          kind: FollowKind.LocalReference,
        },
      ];
  }

  if (binaryTokens.includes(token.tokenType.name)) {
    return [
      {
        kind: FollowKind.LocalReference,
      },
    ];
  }

  return [];
}

export function getFollowElements(
  context: SyntaxNode | undefined,
  token: Token,
): FollowElement[] {
  // TODO: add more entry points for the completion of expressions
  switch (token.payload.kind) {
    case undefined:
      return getFollowElementsForUnknownToken(token);
    case CstNodeKind.BinaryExpression_Operator:
      return [
        {
          kind: FollowKind.LocalReference,
        },
      ];
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
      return [
        {
          kind: FollowKind.CstNode,
          types: AllStatementStartKeywordsArray,
        },
        {
          kind: FollowKind.LocalReference,
        },
      ];
    case CstNodeKind.ConditionPrefix_OpenParen:
    case CstNodeKind.Exports_OpenParen:
    case CstNodeKind.Reserves_OpenParen:
    case CstNodeKind.Options_OpenParen:
    case CstNodeKind.LinkageOptionsItem_OpenParen:
    case CstNodeKind.CMPATOptionsItem_OpenParen:
    case CstNodeKind.NoMapOptionsItem_OpenParen:
    case CstNodeKind.AllocateLocationReferenceIn_OpenParen:
    case CstNodeKind.AllocateLocationReferenceSet_OpenParen:
    case CstNodeKind.CancelThreadStatement_OpenParen:
    case CstNodeKind.CloseStatement_OpenParen:
    case CstNodeKind.CloseStatement_OpenParen:
    case CstNodeKind.OrdinalValue_OpenParen:
    case CstNodeKind.DelayStatement_OpenParen:
    case CstNodeKind.DetachStatement_OpenParen:
    case CstNodeKind.FlushStatement_OpenParen:
    case CstNodeKind.FormatStatement_OpenParen:
    case CstNodeKind.FormatListItem_OpenParen:
    case CstNodeKind.FormatListItemLevel_OpenParen:
    case CstNodeKind.AFormatItem_OpenParen:
    case CstNodeKind.BFormatItem_OpenParen:
    case CstNodeKind.CFormatItem_OpenParen:
    case CstNodeKind.FFormatItem_OpenParen:
    case CstNodeKind.EFormatItem_OpenParen:
    case CstNodeKind.ColumnFormatItem_OpenParen:
    case CstNodeKind.GFormatItem_OpenParen:
    case CstNodeKind.LineFormatItem_OpenParen:
    case CstNodeKind.RFormatItem_OpenParen:
    case CstNodeKind.SkipFormatItem_OpenParen:
    case CstNodeKind.XFormatItem_OpenParen:
    case CstNodeKind.GetStatement_OpenParen:
    case CstNodeKind.GetFile_OpenParen:
    case CstNodeKind.GetCopy_OpenParen:
    case CstNodeKind.GetSkip_OpenParen:
    case CstNodeKind.GenericAttribute_OpenParen:
    case CstNodeKind.GenericReference_OpenParen:
    case CstNodeKind.IncludeItem_OpenParen:
    case CstNodeKind.LineDirective_OpenParen:
    case CstNodeKind.LocateStatementOption_OpenParen:
    case CstNodeKind.LocateStatementSet_OpenParen:
    case CstNodeKind.NoteDirective_OpenParen:
    case CstNodeKind.NamedCondition_OpenParen:
    case CstNodeKind.FileReferenceCondition_OpenParen:
    case CstNodeKind.OpenOption_OpenParen:
    case CstNodeKind.CompilerOption_OpenParen:
    case CstNodeKind.PutStatement_OpenParen:
    case CstNodeKind.PutItem_OpenParen:
    case CstNodeKind.ReadStatementFile_OpenParen:
    case CstNodeKind.ReturnStatement_OpenParen:
    case CstNodeKind.RewriteStatementFile_OpenParen:
    case CstNodeKind.SelectStatement_OpenParen:
    case CstNodeKind.WhenStatement_OpenParen:
    case CstNodeKind.SkipDirective_OpenParen:
    case CstNodeKind.WaitStatement_OpenParen:
    case CstNodeKind.WriteStatementFile_OpenParen:
    case CstNodeKind.InitAcrossExpression_OpenParen:
    case CstNodeKind.InitialAttributeSpecification_OpenParen:
    case CstNodeKind.InitialAttributeSpecificationIterationValue_OpenParen:
    case CstNodeKind.DeclaredItem_OpenParen:
    case CstNodeKind.DateAttribute_OpenParen:
    case CstNodeKind.TypeAttribute_OpenParen:
    case CstNodeKind.OrdinalTypeAttribute_OpenParen:
    case CstNodeKind.ReturnsAttribute_OpenParen:
    case CstNodeKind.DefaultValueAttribute_OpenParen:
    case CstNodeKind.ValueAttribute_OpenParen:
    case CstNodeKind.ValueListAttribute_OpenParen:
    case CstNodeKind.ValueRangeAttribute_OpenParen:
    case CstNodeKind.Dimensions_OpenParen:
    case CstNodeKind.Bound_OpenParen:
    case CstNodeKind.EnvironmentAttribute_OpenParen:
    case CstNodeKind.EnvironmentAttributeItem_OpenParen:
    case CstNodeKind.ReturnsOption_OpenParen:
    case CstNodeKind.ParenthesizedExpression_OpenParen:
    case CstNodeKind.ProcedureCallArgs_OpenParen:
    // Happens on '(' in `PUT(f)`;
    case CstNodeKind.DataSpecificationOptions_OpenParenList:
    // Happens on ',' in `PUT(A, B<|1>)`;
    case CstNodeKind.DataSpecificationDataList_Comma:
      return [
        {
          kind: FollowKind.LocalReference,
        },
      ];
    case CstNodeKind.AssignmentStatement_Operator:
    case CstNodeKind.BinaryExpression_Operator:
    case CstNodeKind.UnaryExpression_Operator:
    case CstNodeKind.InitialAttribute_OpenParenDirect:
      return [
        {
          kind: FollowKind.LocalReference,
        },
      ];
    case CstNodeKind.Percentage:
      return [
        {
          kind: FollowKind.LocalReference,
        },
        {
          kind: FollowKind.CstNode,
          types: StatementStartPreprocessorCompletionKeywordsArray,
        },
      ];
    case CstNodeKind.MemberCall_Dot:
      if (context?.kind === SyntaxKind.MemberCall) {
        const parent = context.previous;
        if (parent) {
          return [
            {
              kind: FollowKind.QualifiedReference,
              previous: parent,
            },
          ];
        }
      }
      break;
  }

  return [];
}

export function provideEntryPointFollowElements(): FollowElement[] {
  /**
   * TODO @didrikmunther: What follow elements are available for an empty program?
   */
  return [
    {
      kind: FollowKind.CstNode,
      types: AllStatementStartKeywordsArray,
    },
  ];
}
