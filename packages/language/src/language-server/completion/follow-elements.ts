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
          types: AllStatementStartKeywordsArray,
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
  CstNodeKind.EnvironmentAttributeItem_Comma,
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
    // Happens on '(' in `PUT()`
    case CstNodeKind.Dimensions_OpenParen:
    // Happens on '(' in `PUT(f)`
    case CstNodeKind.DataSpecificationOptions_OpenParenList:
    // Happens on ',' in `PUT(A, )`
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
    case CstNodeKind.TypeAttribute_TYPE:
    case CstNodeKind.TypeAttribute_OpenParen:
      return [
        {
          kind: FollowKind.TypeReference,
        },
      ];
    case CstNodeKind.LikeAttribute_LIKE:
      return [
        {
          kind: FollowKind.LocalReference,
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

  if (expressionFollowKinds.has(token.kind)) {
    return [
      {
        kind: FollowKind.LocalReference,
      },
    ];
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
