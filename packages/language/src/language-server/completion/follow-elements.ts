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
import { tokenMatcher } from "chevrotain";
import { SimpleCompletionItem } from "../types";
import { CompilationUnit } from "../../workspace/compilation-unit";

const DataSpecificationCompletionKeywordsArray =
  CompletionKeywords.DeclarationKeyword.valuesArray();
const StatementStartCompletionKeywordsArray =
  CompletionKeywords.StatementStart.valuesArray();
const StatementStartPreprocessorCompletionKeywordsArray =
  CompletionKeywords.StatementStartPreprocessor.valuesArray();
const StatementStartPreprocessorWithPercentCompletionKeywordsArray =
  CompletionKeywords.StatementStartPreprocessorWithPercent.valuesArray();
const AllStatementStartKeywordsArray = [
  ...StatementStartCompletionKeywordsArray,
  ...StatementStartPreprocessorWithPercentCompletionKeywordsArray,
];

export enum FollowKind {
  CstNode,
  LocalReference,
  QualifiedReference,
  TypeReference,
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

export interface FollowTypeReference {
  kind: FollowKind.TypeReference;
}

export type FollowElement =
  | FollowCstNode
  | FollowLocalReference
  | FollowQualifiedReference
  | FollowTypeReference;

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
    case ";":
      // On semicolon, we can always start a new statement or reference (assignment)
      return [
        {
          kind: FollowKind.CstNode,
          items: AllStatementStartKeywordsArray,
        },
        {
          kind: FollowKind.LocalReference,
        },
      ];
  }

  if (
    tokenMatcher(token, tokens.BinaryOperator) ||
    tokenMatcher(token, tokens.UnaryOperator) ||
    tokenMatcher(token, tokens.AssignmentOperator)
  ) {
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
  CstNodeKind.InitialAttribute_OpenParen,
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
  CstNodeKind.InitAcrossAttribute_OpenParen,
  CstNodeKind.InitAcrossList_OpenParen,
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
  CstNodeKind.InitAcrossAttribute_Comma,
  CstNodeKind.InitAcrossList_Comma,
  CstNodeKind.EnvironmentOptionItem_Comma,
  CstNodeKind.DataSpecificationDataList_Comma,
  CstNodeKind.ParenthesizedExpression_Comma,

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
  CstNodeKind.LikeAttribute_LIKE,
]);

const semicolonFollowKinds = new Set([
  CstNodeKind.DeactivateStatement_Semicolon,
  CstNodeKind.ActivateStatement_Semicolon,
  CstNodeKind.ProcedureStatement_Semicolon,
  CstNodeKind.EntryStatement_Semicolon,
  CstNodeKind.AllocateStatement_Semicolon,
  CstNodeKind.AssignmentStatement_Semicolon,
  CstNodeKind.AttachStatement_Semicolon,
  CstNodeKind.BeginStatement_Semicolon,
  CstNodeKind.CallStatement_Semicolon,
  CstNodeKind.CancelThreadStatement_Semicolon,
  CstNodeKind.CloseStatement_Semicolon,
  CstNodeKind.DefaultStatement_Semicolon,
  CstNodeKind.DefineAliasStatement_Semicolon,
  CstNodeKind.DefineOrdinalStatement_Semicolon,
  CstNodeKind.DefineStructureStatement_Semicolon,
  CstNodeKind.DelayStatement_Semicolon,
  CstNodeKind.DeleteStatement_Semicolon,
  CstNodeKind.DetachStatement_Semicolon,
  CstNodeKind.DisplayStatement_Semicolon,
  CstNodeKind.DoStatement_Semicolon,
  CstNodeKind.EndStatement_Semicolon,
  CstNodeKind.ExecStatement_Semicolon,
  CstNodeKind.ExitStatement_Semicolon,
  CstNodeKind.FetchStatement_Semicolon,
  CstNodeKind.FlushStatement_Semicolon,
  CstNodeKind.FormatStatement_Semicolon,
  CstNodeKind.FreeStatement_Semicolon,
  CstNodeKind.GetStatement_Semicolon,
  CstNodeKind.GoToStatement_Semicolon,
  CstNodeKind.IterateStatement_Semicolon,
  CstNodeKind.LeaveStatement_Semicolon,
  CstNodeKind.LocateStatement_Semicolon,
  CstNodeKind.NullStatement_Semicolon,
  CstNodeKind.OnStatement_Semicolon,
  CstNodeKind.OpenStatement_Semicolon,
  CstNodeKind.Package_Semicolon,
  CstNodeKind.PutStatement_Semicolon,
  CstNodeKind.QualifyStatement_Semicolon,
  CstNodeKind.ReadStatement_Semicolon,
  CstNodeKind.ReinitStatement_Semicolon,
  CstNodeKind.ReleaseStatement_Semicolon,
  CstNodeKind.ResignalStatement_Semicolon,
  CstNodeKind.ReturnStatement_Semicolon,
  CstNodeKind.RevertStatement_Semicolon,
  CstNodeKind.RewriteStatement_Semicolon,
  CstNodeKind.SelectStatement_Semicolon,
  CstNodeKind.SignalStatement_Semicolon,
  CstNodeKind.StopStatement_Semicolon,
  CstNodeKind.WaitStatement_Semicolon,
  CstNodeKind.WriteStatement_Semicolon,
  CstNodeKind.DeclareStatement_Semicolon,
]);

export function getFollowElements(
  unit: CompilationUnit,
  context: SyntaxNode | undefined,
  token: Token,
): FollowElement[] {
  // TODO: add more entry points for the completion of expressions
  switch (token.kind) {
    case CstNodeKind.LabelPrefix_Colon:
      return provideEntryPointFollowElements(unit, context);
    case CstNodeKind.BinaryExpression_Operator:
    case CstNodeKind.UnaryExpression_Operator:
      return [
        {
          kind: FollowKind.LocalReference,
        },
      ];
    case CstNodeKind.TypeReference_StartColon:
      return [
        {
          kind: FollowKind.TypeReference,
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
    // After the 'TYPE' or 'TYPE(' in a type attribute
    case CstNodeKind.TypeAttribute_TYPE:
    case CstNodeKind.TypeAttribute_OpenParen:
    // After '(:' in a type function call
    case CstNodeKind.Dimensions_OpenParenColon:
      return [
        {
          kind: FollowKind.TypeReference,
        },
      ];
    case CstNodeKind.PutStatement_PUT:
      return [
        {
          kind: FollowKind.CstNode,
          items: [kw("STRING")],
        },
      ];
  }

  if (token.kind !== undefined) {
    if (expressionFollowKinds.has(token.kind)) {
      return [
        {
          kind: FollowKind.LocalReference,
        },
      ];
    } else if (semicolonFollowKinds.has(token.kind)) {
      // After a semicolon, we usually can start a new statement
      // However, the exact keywords proposed are dependent on the context
      // e.g. whether we are in a preprocessor procedure or not.
      return provideEntryPointFollowElements(unit, context);
    }
  }

  return getFollowElementsForUnknownToken(token);
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
            CompletionKeywords.StatementStartPreprocessorInProcedure.valuesArray(),
        },
        {
          kind: FollowKind.LocalReference,
        },
      ];
    } else {
      return [
        {
          kind: FollowKind.CstNode,
          items: CompletionKeywords.StatementStartPreprocessor.valuesArray(),
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
