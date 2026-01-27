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
import {
  getContainer,
  isPreprocessorNode,
  MemberCall,
  SyntaxKind,
  SyntaxNode,
} from "../../syntax-tree/ast";
import { CstNodeKind } from "../../syntax-tree/cst";
import { CompletionKeywords, kw } from "./keywords";
import * as tokens from "../../parser/tokens";
import { SimpleCompletionItem } from "../types";
import { CompilationUnit } from "../../workspace/compilation-unit";

const DataSpecificationCompletionKeywordsArray =
  CompletionKeywords.DeclarationKeyword.values();
const StatementStartCompletionKeywordsArray =
  CompletionKeywords.StatementStart.values();
const StatementStartPreprocessorCompletionKeywordsArray =
  CompletionKeywords.StatementStartPreprocessor.values();
const StatementStartPreprocessorWithPercentCompletionKeywordsArray =
  CompletionKeywords.StatementStartPreprocessorWithPercent.values();
const AllStatementStartKeywordsArray = [
  ...StatementStartCompletionKeywordsArray,
  ...StatementStartPreprocessorWithPercentCompletionKeywordsArray,
];

export enum FollowKind {
  CstNode,
  LocalReference,
  QualifiedReference,
}

export interface FollowCstNode {
  kind: FollowKind.CstNode;
  items: SimpleCompletionItem[];
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

const expressionFollowKinds = new Set([
  // Within expressions
  CstNodeKind.BinaryExpression_Operator,
  CstNodeKind.UnaryExpression_Operator,
  CstNodeKind.AssignmentStatement_Operator,

  // After '(' in various places
  CstNodeKind.Dimensions_OpenParen,
  CstNodeKind.PutStatement_OpenParen,
  CstNodeKind.InitialAttribute_OpenParenDirect,
  CstNodeKind.ReturnStatement_OpenParen,
  CstNodeKind.DoWhile_OpenParenWhile,
  CstNodeKind.DoWhile_OpenParenUntil,
  CstNodeKind.DoUntil_OpenParenUntil,
  CstNodeKind.DoUntil_OpenParenWhile,
  CstNodeKind.EntryStatement_OpenParenEnv,
  CstNodeKind.AssertStatement_OpenParen0,
  CstNodeKind.AssertStatement_OpenParen1,
  CstNodeKind.AttachStatement_OpenParenTStack,
  CstNodeKind.OrdinalValue_OpenParen,
  CstNodeKind.DelayStatement_OpenParen,
  CstNodeKind.DeleteStatement_OpenParenKey,
  CstNodeKind.DisplayStatement_OpenParenExpression,
  CstNodeKind.FetchEntry_OpenParenTitle,
  CstNodeKind.FormatListItemLevel_OpenParen,
  CstNodeKind.AFormatItem_OpenParen,
  CstNodeKind.BFormatItem_OpenParen,
  CstNodeKind.FFormatItem_OpenParen,
  CstNodeKind.EFormatItem_OpenParen,
  CstNodeKind.ColumnFormatItem_OpenParen,
  CstNodeKind.GFormatItem_OpenParen,
  CstNodeKind.LineFormatItem_OpenParen,
  CstNodeKind.SkipFormatItem_OpenParen,
  CstNodeKind.XFormatItem_OpenParen,
  CstNodeKind.GetStatement_OpenParen,
  CstNodeKind.GetFile_OpenParen,
  CstNodeKind.GetSkip_OpenParen,
  CstNodeKind.LocateStatementOption_OpenParen,
  CstNodeKind.OpenOption_OpenParen,
  CstNodeKind.PutItem_OpenParen,
  CstNodeKind.ReadStatementFile_OpenParen,
  CstNodeKind.RewriteStatementFile_OpenParen,
  CstNodeKind.SelectStatement_OpenParen,
  CstNodeKind.WhenStatement_OpenParen,
  CstNodeKind.WriteStatementFile_OpenParen,
  CstNodeKind.InitialAttribute_OpenParenInitAcross,
  CstNodeKind.InitAcrossExpression_OpenParen,
  CstNodeKind.DefinedAttribute_OpenParenPos,
  CstNodeKind.ValueAttribute_OpenParen,
  CstNodeKind.ValueListAttribute_OpenParen,
  CstNodeKind.ValueRangeAttribute_OpenParen,
  CstNodeKind.EnvironmentAttributeItem_OpenParen,
  CstNodeKind.EntryAttribute_OpenParenEnv,
  CstNodeKind.ParenthesizedExpression_OpenParen,
  CstNodeKind.ProcedureCallArgs_OpenParen,
  CstNodeKind.DataSpecificationOptions_OpenParenList,

  // After ',' in various places
  CstNodeKind.AssertStatement_Comma0,
  CstNodeKind.DefaultStatement_Comma,
  CstNodeKind.FFormatItem_CommaFractional,
  CstNodeKind.FFormatItem_CommaScalingFactor,
  CstNodeKind.EFormatItem_Comma0,
  CstNodeKind.EFormatItem_Comma1,
  CstNodeKind.WhenStatement_Comma,
  CstNodeKind.InitialAttribute_CommaInitAcross,
  CstNodeKind.InitAcrossExpression_Comma,
  CstNodeKind.EnvironmentOptionItem_Comma,
  CstNodeKind.DataSpecificationDataList_Comma,

  // After specific keywords
  CstNodeKind.ActivateStatement_ACTIVATE,
  CstNodeKind.DeactivateStatement_DEACTIVATE,
  CstNodeKind.InscanDirective_INSCAN,
  CstNodeKind.AssertStatement_TEXT,
  CstNodeKind.AssignmentStatement_DIMACROSS,
  CstNodeKind.DefaultStatement_DEFAULT,
  CstNodeKind.DoSpecification_TO0,
  CstNodeKind.DoSpecification_BY0,
  CstNodeKind.DoSpecification_BY1,
  CstNodeKind.DoSpecification_TO1,
  CstNodeKind.DoSpecification_UPTHRU,
  CstNodeKind.DoSpecification_DOWNTHRU,
  CstNodeKind.DoSpecification_REPEAT,
  CstNodeKind.IfStatement_IF,
]);

export function getFollowElements(
  unit: CompilationUnit,
  context: SyntaxNode | undefined,
  token: Token,
): FollowElement[] {
  // TODO: add more entry points for the completion of expressions
  switch (token.kind) {
    case undefined:
      return getFollowElementsForUnknownToken(token);
    case CstNodeKind.BinaryExpression_Operator:
      return [
        {
          kind: FollowKind.LocalReference,
        },
      ];
    // We are inside a declaration, e.g.:
    // `DCL A <|1>;`
    case CstNodeKind.DeclaredVariable_Name:
      return [
        {
          kind: FollowKind.CstNode,
          items: DataSpecificationCompletionKeywordsArray,
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
    // We are at the start of a new statement
    case CstNodeKind.LabelPrefix_Colon:
      return provideEntryPointFollowElements(unit, context);
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
          items: StatementStartPreprocessorCompletionKeywordsArray,
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
    case CstNodeKind.PutStatement_PUT:
      return [
        {
          kind: FollowKind.CstNode,
          items: [kw("STRING")],
        },
      ];
  }

  if (expressionFollowKinds.has(token.kind)) {
    return [
      {
        kind: FollowKind.LocalReference,
      },
    ];
  }

  return [];
}

export function provideEntryPointFollowElements(
  unit: CompilationUnit,
  context?: SyntaxNode,
): FollowElement[] {
  const allKeywords: FollowElement = {
    kind: FollowKind.CstNode,
    items: AllStatementStartKeywordsArray,
  };
  if (!context) {
    return [allKeywords];
  }
  if (isPreprocessorNode(unit, context)) {
    const isProc = context.kind === SyntaxKind.ProcedureStatement;
    const procItem = isProc
      ? context
      : getContainer(context, SyntaxKind.ProcedureStatement);
    if (procItem) {
      return [
        {
          kind: FollowKind.CstNode,
          items:
            CompletionKeywords.StatementStartPreprocessorInProcedure.values(),
        },
        {
          kind: FollowKind.LocalReference,
        },
      ];
    } else {
      return [
        {
          kind: FollowKind.CstNode,
          items: CompletionKeywords.StatementStartPreprocessor.values(),
        },
        {
          kind: FollowKind.LocalReference,
        },
      ];
    }
  } else {
    return [
      allKeywords,
      {
        kind: FollowKind.LocalReference,
      },
    ];
  }
}
