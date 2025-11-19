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

import { generateTokenErrorName, ParserState } from "./parser-state";
import * as ast from "../syntax-tree/ast";
import {
  constructBinaryExpression,
  IntermediateBinaryExpression,
} from "./abstract-parser";
import { CstNodeKind } from "../syntax-tree/cst";
import * as t from "./tokens";
import { performAssignmentLookahead } from "./parser";
import { TokenType } from "chevrotain";
import {
  diagnostic,
  diagnosticFromCode,
  Severity,
} from "../language-server/types";
import { PLICodes } from "../validation/pli-codes";

const tokenEndSet = new Set(t.PPSignifier.map((tok) => tok.tokenTypeIdx!));

export function consumeTokenStatement(state: ParserState): ast.Statement {
  const tokenStatement = ast.createTokenStatement();
  const start = state.index;
  let currentToken: t.Token | undefined = state.token;
  while (currentToken) {
    if (
      // Check if we have consumed any tokens and reached a token that can end the statement
      (state.index > start && tokenEndSet.has(currentToken.tokenTypeIdx)) ||
      // We cap a single token statement to 100_000 tokens to avoid stack overflows
      state.index - start >= 100_000
    ) {
      break;
    }
    currentToken = state.tokens[++state.index];
  }
  tokenStatement.tokens = state.tokens.slice(start, state.index);
  const statement = ast.createStatement();
  statement.value = tokenStatement;
  return statement;
}

export function statement(state: ParserState): ast.Statement | null;
export function statement(
  state: ParserState,
  withEnd: true,
  endPercent: boolean,
): ast.Statement | ast.EndStatement | null;
export function statement(
  state: ParserState,
  withEnd?: true,
  endPercent?: boolean,
): ast.Statement | ast.EndStatement | null {
  let end = withEnd ?? false;
  let endP = endPercent ?? false;
  if (!state.isInProcedure()) {
    if (state.tryConsume(undefined, CstNodeKind.Percentage, t.Percent)) {
      return commonStatement(state, end, endP);
    } else {
      return consumeTokenStatement(state);
    }
  } else {
    //state.isInProcedure()
    return commonStatement(state, end, endP);
  }
}

function labels(state: ParserState): ast.LabelPrefix[] {
  const labels: ast.LabelPrefix[] = [];
  while (state.canConsume(t.ID, t.Colon)) {
    const label = ast.createLabelPrefix();
    const labelToken = state.consume(label, CstNodeKind.LabelPrefix_Name, t.ID);
    label.name = labelToken?.image ?? null;
    label.nameToken = labelToken;
    state.consume(label, CstNodeKind.LabelPrefix_Colon, t.Colon);
    labels.push(label);
  }
  return labels;
}

/**
 * @param state
 * @param withEnd Whether the `END` statement is allowed
 * @param endPercent Whether the `END` statement must be prefixed with a `%` (even in a procedure)
 * @returns
 */
export function commonStatement(
  state: ParserState,
  withEnd: boolean,
  endPercent: boolean,
): ast.Statement | ast.EndStatement | null {
  const statement = ast.createStatement();
  let startPercent: t.Token | null = null;
  if (state.isInProcedure()) {
    // In some cases, we enter this function with the current token being a `%`
    // This might be due to errors in the input, or if we are parsing a procedure end statement
    // After parsing the "unit" below, we will check if we have a `%END` statement
    // Only then will we actually know whether this token is invalid
    startPercent = state.tryConsume(
      statement,
      CstNodeKind.Percentage,
      t.Percent,
    );
  }
  const stmtLabels = labels(state);
  statement.labels = stmtLabels;
  let unit: ast.Unit | null = null;
  let endStmt: ast.EndStatement | null = null;
  if (performAssignmentLookahead((la) => state.peek(la))) {
    unit = assignmentStatement(state);
  } else if (state.isInProcedure()) {
    switch (state.token?.tokenTypeIdx) {
      case t.ANSWER.tokenTypeIdx:
        unit = answerStatement(state);
        break;
      case t.CALL.tokenTypeIdx:
        unit = callStatement(state);
        break;
      case t.DECLARE.tokenTypeIdx:
        unit = declareStatement(state);
        break;
      case t.DO.tokenTypeIdx:
        unit = doStatement(state);
        break;
      case t.END.tokenTypeIdx:
        if (withEnd) {
          endStmt = endStatement(state, stmtLabels);
        }
        break;
      case t.GO.tokenTypeIdx:
      case t.GOTO.tokenTypeIdx:
        unit = goToStatement(state);
        break;
      case t.IF.tokenTypeIdx:
        unit = ifStatement(state);
        break;
      case t.ITERATE.tokenTypeIdx:
        unit = iterateStatement(state);
        break;
      case t.LEAVE.tokenTypeIdx:
        unit = leaveStatement(state);
        break;
      case t.NOTE.tokenTypeIdx:
        unit = noteStatement(state);
        break;
      case t.RETURN.tokenTypeIdx:
        unit = returnStatement(state);
        break;
      case t.SELECT.tokenTypeIdx:
        unit = selectStatement(state);
        break;
      case t.Semicolon.tokenTypeIdx:
        unit = nullStatement(state);
        break;
    }
  } else {
    switch (state.token?.tokenTypeIdx) {
      case t.ACTIVATE.tokenTypeIdx:
        unit = activateStatement(state);
        break;
      case t.DEACTIVATE.tokenTypeIdx:
        unit = deactivateStatement(state);
        break;
      case t.DECLARE.tokenTypeIdx:
        unit = declareStatement(state);
        break;
      case t.END.tokenTypeIdx:
        if (withEnd) {
          endStmt = endStatement(state, stmtLabels);
        }
        break;
      case t.PAGE.tokenTypeIdx:
        unit = pageDirective(state);
        break;
      case t.POP.tokenTypeIdx:
        unit = popDirective(state);
        break;
      case t.PUSH.tokenTypeIdx:
        unit = pushDirective(state);
        break;
      case t.PRINT.tokenTypeIdx:
        unit = printDirective(state);
        break;
      case t.NOPRINT.tokenTypeIdx:
        unit = noprintDirective(state);
        break;
      case t.DO.tokenTypeIdx:
        unit = doStatement(state);
        break;
      case t.GOTO.tokenTypeIdx:
      case t.GO.tokenTypeIdx:
        unit = goToStatement(state);
        break;
      case t.LEAVE.tokenTypeIdx:
        unit = leaveStatement(state);
        break;
      case t.IF.tokenTypeIdx:
        unit = ifStatement(state);
        break;
      case t.INCLUDE.tokenTypeIdx:
        unit = includeStatement(state);
        break;
      case t.INSCAN.tokenTypeIdx:
        unit = inscanStatement(state);
        break;
      case t.ITERATE.tokenTypeIdx:
        unit = iterateStatement(state);
        break;
      case t.NOTE.tokenTypeIdx:
        unit = noteStatement(state);
        break;
      case t.PROCEDURE.tokenTypeIdx:
        try {
          state.enterProcedure();
          unit = procedureStatement(state);
        } finally {
          state.leaveProcedure();
        }
        break;
      case t.RETURN.tokenTypeIdx:
        unit = returnStatement(state);
        break;
      case t.REPLACE.tokenTypeIdx:
        unit = replaceStatement(state);
        break;
      case t.SELECT.tokenTypeIdx:
        unit = selectStatement(state);
        break;
      case t.Semicolon.tokenTypeIdx:
        unit = nullStatement(state);
        break;
      case t.SKIP.tokenTypeIdx:
        unit = skipStatement(state);
        break;
    }
  }
  // Recover at the end of a statement, noop if not in error case
  state.recover();
  if (endStmt) {
    if (!endPercent && startPercent) {
      // We have a starting percent, but don't require it for the %END statement
      state.diagnostics.push(
        diagnosticFromCode(PLICodes.Severe.IBM3762I, startPercent),
      );
    }
    return endStmt;
  }
  if (!unit) {
    state.diagnostics.push(
      diagnostic(
        Severity.E,
        `Unexpected token '${state.token?.image}', expected statement.`,
        state.token || state.last,
      ),
    );
  } else if (startPercent) {
    // We have a starting percent, but didn't parse a %END statement, this is always an error
    state.diagnostics.push(
      diagnosticFromCode(PLICodes.Severe.IBM3762I, startPercent),
    );
  }

  statement.value = unit;
  return statement;
}

function callStatement(state: ParserState): ast.CallStatement {
  const statement = ast.createCallStatement();
  state.consume(statement, CstNodeKind.CallStatement_CALL, t.CALL);
  const nameToken = state.consume(
    statement,
    CstNodeKind.ProcedureCall_ProcedureRef,
    t.ID,
  );
  statement.call = ast.createProcedureCall();
  if (nameToken) {
    statement.call.procedure = ast.createReference(
      statement,
      nameToken,
      ast.ReferenceType.Variable,
    );
  }
  state.consume(
    statement,
    CstNodeKind.ProcedureCallArgs_OpenParen,
    t.OpenParen,
  );
  if (!state.canConsume(t.CloseParen)) {
    statement.call.args1 = ast.createProcedureCallArgs();
    do {
      const argument = expression(state);
      if (argument) {
        statement.call.args1.list.push(argument);
      }
    } while (
      state.tryConsume(statement, CstNodeKind.ProcedureCallArgs_Comma, t.Comma)
    );
  }
  state.consume(
    statement,
    CstNodeKind.ProcedureCallArgs_CloseParen,
    t.CloseParen,
  );
  state.consume(statement, CstNodeKind.CallStatement_Semicolon, t.Semicolon);
  return statement;
}

function procedureStatement(state: ParserState): ast.ProcedureStatement {
  const statement = ast.createProcedureStatement();
  state.consume(
    statement,
    CstNodeKind.ProcedureStatement_PROCEDURE,
    t.PROCEDURE,
  );
  if (
    state.tryConsume(
      statement,
      CstNodeKind.ProcedureStatement_OpenParenParams,
      t.OpenParen,
    )
  ) {
    if (state.canConsume(t.ID)) {
      do {
        const parameter = ast.createProcedureParameter();
        const nameToken = state.consume(
          parameter,
          CstNodeKind.ProcedureParameter_Id,
          t.ID,
        );
        if (nameToken) {
          parameter.ref = ast.createReference(
            parameter,
            nameToken,
            ast.ReferenceType.Variable,
          );
          statement.parameters.push(parameter);
        }
      } while (
        state.tryConsume(
          statement,
          CstNodeKind.ProcedureStatement_Comma,
          t.Comma,
        )
      );
    }
    state.consume(
      statement,
      CstNodeKind.ProcedureStatement_CloseParenParams,
      t.CloseParen,
    );
  }
  statement.statement = Boolean(
    state.tryConsume(
      statement,
      CstNodeKind.ProcedureStatement_STATEMENT,
      t.STATEMENT,
    ),
  );
  const returnsOption = ast.createReturnsOption();
  if (
    state.tryConsume(
      returnsOption,
      CstNodeKind.ReturnsOption_RETURNS,
      t.RETURNS,
    )
  ) {
    state.consume(
      returnsOption,
      CstNodeKind.ReturnsOption_OpenParen,
      t.OpenParen,
    );
    let returnType: string | undefined = undefined;
    const dataAttribute = ast.createComputationDataAttribute();
    if (
      state.tryConsume(
        dataAttribute,
        CstNodeKind.DefaultAttribute_Value,
        t.CHARACTER,
      )
    ) {
      returnType = "CHARACTER";
    } else if (
      state.tryConsume(
        dataAttribute,
        CstNodeKind.DefaultAttribute_Value,
        t.FIXED,
      )
    ) {
      returnType = "FIXED";
    }
    if (returnType) {
      dataAttribute.type = returnType as ast.DefaultAttribute;
      dataAttribute.typeToken = state.last ?? null;
      returnsOption.returnAttributes.push(dataAttribute);
    }
    state.consume(
      returnsOption,
      CstNodeKind.ReturnsOption_CloseParen,
      t.CloseParen,
    );
    statement.options.push(returnsOption);
  }
  state.consume(
    statement,
    CstNodeKind.ProcedureStatement_Semicolon0,
    t.Semicolon,
  );
  const body = statements(state, true);
  statement.statements = body.statements;
  statement.end = body.end;
  return statement;
}

function answerStatement(state: ParserState): ast.AnswerStatement {
  const statement = ast.createAnswerStatement();
  state.consume(statement, CstNodeKind.AnswerStatement_ANSWER, t.ANSWER);
  if (
    state.tryConsume(
      statement,
      CstNodeKind.AnswerStatement_OpenParen,
      t.OpenParen,
    )
  ) {
    statement.expression = expression(state);
    state.consume(
      statement,
      CstNodeKind.AnswerStatement_CloseParen,
      t.CloseParen,
    );
  }
  if (state.tryConsume(statement, CstNodeKind.AnswerStatement_PAGE, t.PAGE)) {
    statement.skip = { type: ast.SkipModeType.Page };
  } else if (state.canConsume(t.SKIP)) {
    const skipToken = state.consume(
      statement,
      CstNodeKind.AnswerStatement_SKIP,
      t.SKIP,
    );
    statement.skipToken = skipToken;
    if (
      state.tryConsume(
        statement,
        CstNodeKind.AnswerStatement_SKIP_OpenParen,
        t.OpenParen,
      )
    ) {
      const count = expression(state);
      statement.skip = { type: ast.SkipModeType.Skip, count };
      state.consume(
        statement,
        CstNodeKind.AnswerStatement_SKIP_CloseParen,
        t.CloseParen,
      );
    } else {
      statement.skip = { type: ast.SkipModeType.Skip, count: null };
    }
  }
  if (state.canConsume(t.COLUMN)) {
    const columnToken = state.consume(
      statement,
      CstNodeKind.AnswerStatement_COLUMN,
      t.COLUMN,
    );
    statement.columnToken = columnToken;
    state.consume(
      statement,
      CstNodeKind.AnswerStatement_COLUMN_OpenParen,
      t.OpenParen,
    );
    statement.column = expression(state);
    state.consume(
      statement,
      CstNodeKind.AnswerStatement_COLUMN_CloseParen,
      t.CloseParen,
    );
  }
  if (state.canConsume(t.MARGINS)) {
    statement.marginsToken = state.consume(
      statement,
      CstNodeKind.AnswerStatement_MARGINS,
      t.MARGINS,
    );
    if (
      state.tryConsume(
        statement,
        CstNodeKind.AnswerStatement_MARGINS_OpenParen,
        t.OpenParen,
      )
    ) {
      statement.margins = { left: expression(state), right: null };
      if (
        state.tryConsume(
          statement,
          CstNodeKind.AnswerStatement_MARGINS_Comma,
          t.Comma,
        )
      ) {
        statement.margins.right = expression(state);
      }
      state.consume(
        statement,
        CstNodeKind.AnswerStatement_MARGINS_CloseParen,
        t.CloseParen,
      );
    } else {
      statement.margins = null;
    }
  }
  const scans: [CstNodeKind, TokenType, ast.ScanMode][] = [
    [CstNodeKind.AnswerStatement_NOSCAN, t.NOSCAN, "NOSCAN"],
    [CstNodeKind.AnswerStatement_SCAN, t.SCAN, "SCAN"],
    [CstNodeKind.AnswerStatement_RESCAN, t.RESCAN, "RESCAN"],
  ];
  for (const [cstNodeKind, tokenType, scanType] of scans) {
    if (state.tryConsume(statement, cstNodeKind, tokenType)) {
      statement.scanMode = scanType;
      break;
    }
  }
  state.consume(statement, CstNodeKind.AnswerStatement_Semicolon, t.Semicolon);
  return statement;
}

function returnStatement(state: ParserState): ast.ReturnStatement {
  const statement = ast.createReturnStatement();
  state.consume(statement, CstNodeKind.ReturnStatement_RETURN, t.RETURN);
  state.consume(statement, CstNodeKind.ReturnStatement_OpenParen, t.OpenParen);
  statement.expression = expression(state);
  state.consume(
    statement,
    CstNodeKind.ReturnStatement_CloseParen,
    t.CloseParen,
  );
  state.consume(statement, CstNodeKind.ReturnStatement_Semicolon, t.Semicolon);
  return statement;
}

function iterateStatement(state: ParserState): ast.IterateStatement {
  const statement = ast.createIterateStatement();
  state.consume(statement, CstNodeKind.IterateStatement_ITERATE, t.ITERATE);
  if (state.canConsume(t.ID)) {
    statement.label = labelReference(state);
  }
  state.consume(statement, CstNodeKind.IterateStatement_Semicolon, t.Semicolon);
  return statement;
}

function leaveStatement(state: ParserState): ast.LeaveStatement {
  const statement = ast.createLeaveStatement();
  state.consume(statement, CstNodeKind.LeaveStatement_LEAVE, t.LEAVE);
  if (state.canConsume(t.ID)) {
    statement.label = labelReference(state);
  }
  state.consume(statement, CstNodeKind.LeaveStatement_Semicolon, t.Semicolon);
  return statement;
}

function goToStatement(state: ParserState): ast.GoToStatement {
  const statement = ast.createGoToStatement();
  // First, attempt to consume the GOTO keyword
  if (!state.tryConsume(statement, CstNodeKind.GoToStatement_GOTO, t.GOTO)) {
    // Otherwise, consume the GO and TO keywords
    state.consume(statement, CstNodeKind.GoToStatement_GO, t.GO);
    state.consume(statement, CstNodeKind.GoToStatement_TO, t.TO);
  }
  statement.label = labelReference(state);
  state.consume(statement, CstNodeKind.GoToStatement_Semicolon, t.Semicolon);
  return statement;
}

function labelReference(state: ParserState): ast.LabelReference {
  const reference = ast.createLabelReference();
  const label = state.consume(
    reference,
    CstNodeKind.LabelReference_LabelRef,
    t.ID,
  );
  reference.label = ast.createReference(
    reference,
    label,
    ast.ReferenceType.Variable,
  );
  return reference;
}

function includeStatement(state: ParserState): ast.IncludeDirective {
  const directive = ast.createIncludeDirective();
  const includeToken = state.consume(
    directive,
    CstNodeKind.IncludeDirective_INCLUDE,
    t.INCLUDE,
  );
  directive.token = includeToken;
  directive.idempotent = isXInstruction(includeToken);
  let parseError = false;
  while (true) {
    let item: ast.IncludeItemFile | ast.IncludeItemMember | undefined =
      undefined;
    // collect all ID tokens that can contribute to a ddname
    const idTokens: t.Token[] = [];
    let nextIdToken: t.Token | null = null;
    while (
      (nextIdToken = state.tryConsume(
        item,
        CstNodeKind.IncludeItem_FileID,
        t.ID,
      ))
    ) {
      idTokens.push(nextIdToken);
      if (!state.tryConsume(item, CstNodeKind.IncludeItem_Dot, t.Dot)) {
        break;
      }
    }

    if (idTokens.length > 1) {
      // ddname which requires a parenthesized member portion
      item = ast.createIncludeItemMember();
      for (const idToken of idTokens) {
        idToken.element = item;
      }

      state.consume(item, CstNodeKind.IncludeItem_OpenParen, t.OpenParen);

      const memberToken = state.consume(
        item,
        CstNodeKind.IncludeItem_MemberID,
        t.ID,
      );

      state.consume(item, CstNodeKind.IncludeItem_CloseParen, t.CloseParen);
      // joint ddname
      item.ddname = idTokens.map((t) => t.image).join(".");
      item.ddnameTokens = idTokens; // <-- TODO use these tokens to report chained diagnostics, do I already do this?

      item.memberName = memberToken?.image ?? null;
      item.token = memberToken;
    } else if (idTokens.length === 1) {
      item = ast.createIncludeItemMember();
      for (const idToken of idTokens) {
        idToken.element = item;
      }

      // either ddname w/ member, or raw member
      const ddnameOrMember = idTokens[0].image;

      // check to see if we have an opening parenthesis for a following member
      // making this a ddname + member
      const openParenToken = state.tryConsume(
        item,
        CstNodeKind.IncludeItem_OpenParen,
        t.OpenParen,
      );

      if (openParenToken) {
        // ddname(member) case
        const memberToken = state.consume(
          item,
          CstNodeKind.IncludeItem_MemberID,
          t.ID,
        );

        state.consume(item, CstNodeKind.IncludeItem_CloseParen, t.CloseParen);

        item.ddname = ddnameOrMember;
        item.ddnameTokens = idTokens;

        item.memberName = memberToken?.image ?? null;
        item.token = memberToken;
      } else {
        // member include case
        item.memberName = ddnameOrMember;
        item.token = nextIdToken;
      }
    } else {
      item = ast.createIncludeItemFile();
      for (const idToken of idTokens) {
        idToken.element = item;
      }

      // direct file include, not a member (from string)
      const stringToken = state.tryConsume(
        item,
        CstNodeKind.IncludeItem_FileString,
        t.STRING_TERM,
      );
      if (stringToken) {
        const fileName = unpackCharacterValue(stringToken.image);
        item.fileName = fileName;
        item.token = stringToken;
      } else {
        // At least one include item is required
        // If none is found, we will report an error at the end of the statement
        parseError = directive.items.length === 0;
        break;
      }
    }
    directive.items.push(item);
    // Optional comma
    state.tryConsume(directive, CstNodeKind.IncludeDirective_Comma, t.Comma);
  }
  const semicolon = state.consume(
    directive,
    CstNodeKind.IncludeDirective_Semicolon,
    t.Semicolon,
    PLICodes.Severe.IBM1618I,
  );
  if (parseError && !state.inError) {
    state.diagnostics.push(
      diagnosticFromCode(PLICodes.Severe.IBM1620I, semicolon || includeToken),
    );
  }
  return directive;
}

export function includeAltStatement(
  state: ParserState,
): ast.IncludeAltDirective {
  // See https://www.ibm.com/docs/en/pli-for-aix/3.1.0?topic=preprocessors-include-preprocessor
  const directive = ast.createIncludeAltDirective();
  state.consume(
    directive,
    CstNodeKind.IncludeAltDirective_INCLUDE_ALT,
    t.INCLUDE_ALT,
  );
  const item = ast.createIncludeItemFile();
  const token = state.consume(item, CstNodeKind.IncludeItem_FileID, t.ID);
  const fileName = token?.image ?? null;
  item.fileName = fileName;
  item.token = token;
  directive.items.push(item);
  // Spec says the semicolon is optional
  state.tryConsume(
    directive,
    CstNodeKind.IncludeAltDirective_Semicolon,
    t.Semicolon,
  );
  return directive;
}

function inscanStatement(state: ParserState): ast.InscanDirective {
  const directive = ast.createInscanDirective();
  const token = state.consume(
    directive,
    CstNodeKind.InscanDirective_INSCAN,
    t.INSCAN,
  );
  directive.token = token;
  directive.item = parseReferenceItem(state, true);
  directive.idempotent = isXInstruction(token);
  state.consume(directive, CstNodeKind.InscanDirective_Semicolon, t.Semicolon);
  return directive;
}

function endStatement(
  state: ParserState,
  existingLabels?: ast.LabelPrefix[],
): ast.EndStatement {
  const statement = ast.createEndStatement();
  // Assign existing labels if provided
  // Otherwise, parse new labels
  statement.labels = existingLabels ?? labels(state);
  state.consume(statement, CstNodeKind.EndStatement_END, t.END);
  if (state.canConsume(t.ID)) {
    const label = ast.createLabelReference();
    statement.label = label;
    const labelToken = state.consume(
      label,
      CstNodeKind.LabelReference_LabelRef,
      t.ID,
    );
    label.label = ast.createReference(
      label,
      labelToken,
      ast.ReferenceType.Variable,
    );
  }
  state.consume(statement, CstNodeKind.EndStatement_Semicolon, t.Semicolon);
  return statement;
}

function doStatement(state: ParserState): ast.DoStatement {
  const statement = ast.createDoStatement();
  state.consume(statement, CstNodeKind.DoStatement_DO, t.DO);

  if (state.canConsume(t.SKIP)) {
    // skip command
    state.consume(statement, CstNodeKind.DoStatement_SKIP, t.SKIP);
    state.consume(statement, CstNodeKind.DoStatement_Semicolon0, t.Semicolon);
    statement.skip = true;
    const body = statements(state);
    statement.end = body.end;
    return statement;
  } else if (state.canConsume(t.WHILE)) {
    //type-2-do-while-first
    const type2 = doWhile(state);
    state.consume(statement, CstNodeKind.DoStatement_Semicolon0, t.Semicolon);
    const body = statements(state);
    statement.doType2 = type2;
    statement.statements = body.statements;
    statement.end = body.end;
  } else if (state.canConsume(t.UNTIL)) {
    //type-2-do-until-first
    const type2 = doUntil(state);
    state.consume(statement, CstNodeKind.DoStatement_Semicolon0, t.Semicolon);
    const body = statements(state);
    statement.doType2 = type2;
    statement.statements = body.statements;
    statement.end = body.end;
  } else if (
    state.tryConsume(statement, CstNodeKind.DoStatement_LOOP, t.LOOP)
  ) {
    //type-4 loops
    statement.doType4 = true;
    state.consume(statement, CstNodeKind.DoStatement_Semicolon0, t.Semicolon);
    const body = statements(state);
    statement.statements = body.statements;
    statement.end = body.end;
  } else if (state.canConsume(t.ID)) {
    // type-3-do
    const type3 = doType3(state);
    state.consume(statement, CstNodeKind.DoStatement_Semicolon0, t.Semicolon);
    const body = statements(state);
    statement.doType3 = type3;
    statement.statements = body.statements;
    statement.end = body.end;
  } else if (
    state.tryConsume(statement, CstNodeKind.DoStatement_Semicolon0, t.Semicolon)
  ) {
    //type-1-do
    const body = statements(state);
    statement.statements = body.statements;
    statement.end = body.end;
  } else {
    state.error();
  }
  return statement;
}

function doWhile(state: ParserState): ast.DoWhile {
  const statement = ast.createDoWhile();
  state.consume(statement, CstNodeKind.DoWhile_WHILE, t.WHILE);
  state.consume(statement, CstNodeKind.DoWhile_OpenParenWhile, t.OpenParen);
  statement.while = expression(state);
  state.consume(statement, CstNodeKind.DoWhile_CloseParenWhile, t.CloseParen);
  if (state.tryConsume(statement, CstNodeKind.DoWhile_UNTIL, t.UNTIL)) {
    state.consume(statement, CstNodeKind.DoWhile_OpenParenUntil, t.OpenParen);
    statement.until = expression(state);
    state.consume(statement, CstNodeKind.DoWhile_CloseParenUntil, t.CloseParen);
  }
  return statement;
}

function doUntil(state: ParserState): ast.DoUntil {
  const statement = ast.createDoUntil();
  state.consume(statement, CstNodeKind.DoUntil_UNTIL, t.UNTIL);
  state.consume(statement, CstNodeKind.DoUntil_OpenParenUntil, t.OpenParen);
  statement.until = expression(state);
  state.consume(statement, CstNodeKind.DoUntil_CloseParenUntil, t.CloseParen);
  if (state.tryConsume(statement, CstNodeKind.DoUntil_WHILE, t.WHILE)) {
    state.consume(statement, CstNodeKind.DoUntil_OpenParenWhile, t.OpenParen);
    statement.while = expression(state);
    state.consume(statement, CstNodeKind.DoWhile_CloseParenWhile, t.CloseParen);
  }
  return statement;
}

function doType3(state: ParserState): ast.DoType3 {
  const doType3 = ast.createDoType3();
  doType3.variable = memberCall(state, true);

  // Consume the "=" token
  state.consume(doType3, CstNodeKind.DoType3_Equals, t.Equals);

  // Parse one or more DoSpecifications separated by commas using a do-while loop
  do {
    doType3.specifications.push(doSpecification(state));
  } while (state.tryConsume(doType3, CstNodeKind.DoType3_Comma, t.Comma));

  return doType3;
}

function doSpecification(state: ParserState): ast.DoSpecification {
  const specification = ast.createDoSpecification();

  // Parse the initial expression
  specification.expression = expression(state);

  // Check for optional clauses
  if (state.tryConsume(specification, CstNodeKind.DoSpecification_TO0, t.TO)) {
    specification.to = expression(state);
    // Optional BY clause after TO
    if (
      state.tryConsume(specification, CstNodeKind.DoSpecification_BY0, t.BY)
    ) {
      specification.by = expression(state);
    }
  } else if (
    state.tryConsume(specification, CstNodeKind.DoSpecification_BY1, t.BY)
  ) {
    specification.by = expression(state);
    // Optional TO clause after BY
    if (
      state.tryConsume(specification, CstNodeKind.DoSpecification_TO1, t.TO)
    ) {
      specification.to = expression(state);
    }
  } else if (
    state.tryConsume(
      specification,
      CstNodeKind.DoSpecification_UPTHRU,
      t.UPTHRU,
    )
  ) {
    specification.upthru = expression(state);
  } else if (
    state.tryConsume(
      specification,
      CstNodeKind.DoSpecification_DOWNTHRU,
      t.DOWNTHRU,
    )
  ) {
    specification.downthru = expression(state);
  } else if (
    state.tryConsume(
      specification,
      CstNodeKind.DoSpecification_REPEAT,
      t.REPEAT,
    )
  ) {
    specification.repeat = expression(state);
  }

  // Check for optional WHILE or UNTIL clause
  if (state.canConsume(t.WHILE)) {
    specification.whileOrUntil = doWhile(state);
  } else if (state.canConsume(t.UNTIL)) {
    specification.whileOrUntil = doUntil(state);
  }

  return specification;
}

interface StatementList {
  statements: ast.Statement[];
  end: ast.EndStatement | null;
}

function statements(state: ParserState, endWithPercent = false): StatementList {
  const statements: ast.Statement[] = [];
  let end: ast.EndStatement | null = null;
  while (!state.eof) {
    const startIndex = state.index;
    const stmt = statement(state, true, endWithPercent);
    if (stmt) {
      if (stmt.kind === ast.SyntaxKind.EndStatement) {
        end = stmt;
        break;
      } else {
        statements.push(stmt);
      }
    }
    if (state.index === startIndex) {
      // No progress made, avoid infinite loop
      state.index++;
    }
  }
  return {
    statements,
    end,
  };
}

function selectStatement(state: ParserState): ast.SelectStatement {
  const statement = ast.createSelectStatement();
  statement.selectToken = state.consume(
    statement,
    CstNodeKind.SelectStatement_SELECT,
    t.SELECT,
  );
  if (
    state.tryConsume(
      statement,
      CstNodeKind.SelectStatement_OpenParen,
      t.OpenParen,
    )
  ) {
    statement.on = expression(state);
    state.consume(
      statement,
      CstNodeKind.SelectStatement_CloseParen,
      t.CloseParen,
    );
  }
  state.consume(statement, CstNodeKind.SelectStatement_Semicolon0, t.Semicolon);
  while (state.canConsumeKeyword(t.WHEN)) {
    statement.cases.push(whenStatement(state));
  }
  if (state.canConsumeKeyword(t.OTHERWISE)) {
    statement.cases.push(otherwiseStatement(state));
  }
  // END statement is preceded by a percent
  state.consume(statement, CstNodeKind.Percentage, t.Percent);
  statement.end = endStatement(state);
  return statement;
}

function whenStatement(state: ParserState): ast.WhenStatement {
  const when = ast.createWhenStatement();
  state.consumeKeyword(when, CstNodeKind.WhenStatement_WHEN, t.WHEN);
  state.consume(when, CstNodeKind.WhenStatement_OpenParen, t.OpenParen);
  let exp = expression(state);
  if (exp) {
    when.conditions.push(exp);
  }
  while (state.tryConsume(when, CstNodeKind.WhenStatement_Comma, t.Comma)) {
    exp = expression(state);
    if (exp) {
      when.conditions.push(exp);
    }
  }
  state.consume(when, CstNodeKind.WhenStatement_CloseParen, t.CloseParen);
  const rangeStart = state.token?.startOffset;
  when.unit = statement(state);
  if (rangeStart != undefined && state.last) {
    when.range = {
      start: rangeStart,
      end: state.last.endOffset + 1,
    };
  }
  return when;
}

function otherwiseStatement(state: ParserState): ast.OtherwiseStatement {
  const otherwise = ast.createOtherwiseStatement();
  state.consumeKeyword(
    otherwise,
    CstNodeKind.OtherwiseStatement_OTHERWISE,
    t.OTHERWISE,
  );
  const rangeStart = state.token?.startOffset;
  otherwise.unit = statement(state);
  if (rangeStart != undefined && state.last) {
    otherwise.range = {
      start: rangeStart,
      end: state.last.endOffset + 1,
    };
  }
  return otherwise;
}

function nullStatement(state: ParserState): ast.NullStatement {
  const statement = ast.createNullStatement();
  state.consume(statement, CstNodeKind.NullStatement_Semicolon, t.Semicolon);
  return statement;
}

function ifStatement(state: ParserState): ast.IfStatement {
  const ifStatement = ast.createIfStatement();
  state.consume(ifStatement, CstNodeKind.IfStatement_IF, t.IF);
  ifStatement.expression = expression(state);
  state.consumeKeyword(ifStatement, CstNodeKind.IfStatement_THEN, t.THEN);
  const unitRangeStart = state.token?.startOffset;
  ifStatement.unit = statement(state);
  if (unitRangeStart != undefined && state.last) {
    ifStatement.unitRange = {
      start: unitRangeStart,
      end: state.last.endOffset + 1,
    };
  }
  if (state.canConsumeKeyword(t.ELSE)) {
    state.consumeKeyword(ifStatement, CstNodeKind.IfStatement_ELSE, t.ELSE);
    const elseRangeStart = state.token?.startOffset;
    ifStatement.else = statement(state);
    if (elseRangeStart != undefined && state.last) {
      ifStatement.elseRange = {
        start: elseRangeStart,
        end: state.last.endOffset + 1,
      };
    }
  }
  return ifStatement;
}

function deactivateStatement(state: ParserState): ast.DeactivateStatement {
  const statement = ast.createDeactivateStatement();
  state.consume(
    statement,
    CstNodeKind.DeactivateStatement_DEACTIVATE,
    t.DEACTIVATE,
  );
  statement.references.push(parseReferenceItem(state, false));
  while (
    state.tryConsume(statement, CstNodeKind.DeactivateStatement_Comma, t.Comma)
  ) {
    statement.references.push(parseReferenceItem(state, false));
  }
  state.consume(
    statement,
    CstNodeKind.DeactivateStatement_Semicolon,
    t.Semicolon,
  );
  return statement;
}

function activateStatement(state: ParserState): ast.ActivateStatement {
  const statement = ast.createActivateStatement();
  state.consume(statement, CstNodeKind.ActivateStatement_ACTIVATE, t.ACTIVATE);
  statement.items.push(parseActivateItem(state));
  while (
    state.tryConsume(statement, CstNodeKind.ActivateStatement_Comma, t.Comma)
  ) {
    statement.items.push(parseActivateItem(state));
  }
  state.consume(
    statement,
    CstNodeKind.ActivateStatement_Semicolon,
    t.Semicolon,
  );
  return statement;
}

function parseActivateItem(state: ParserState): ast.ActivateItem {
  const item = ast.createActivateItem();
  item.reference = parseReferenceItem(state, false);
  item.scanMode = tryScanMode(state);
  return item;
}

function parseReferenceItem(
  state: ParserState,
  withDimensions: boolean,
): ast.ReferenceItem {
  const reference = ast.createReferenceItem();
  const variable = state.consume(
    reference,
    CstNodeKind.ReferenceItem_Ref,
    t.ID,
  );
  reference.ref = ast.createReference(
    reference,
    variable,
    ast.ReferenceType.Variable,
  );
  if (withDimensions && state.canConsume(t.OpenParen)) {
    reference.dimensions = dimensions(state);
  }
  return reference;
}

function tryScanMode(state: ParserState): ast.ScanMode | null {
  let scanMode: ast.ScanMode | null = null;
  switch (state.token?.tokenTypeIdx) {
    case t.SCAN.tokenTypeIdx:
    case t.NORESCAN.tokenTypeIdx:
      scanMode = "SCAN";
      state.index++;
      break;
    case t.RESCAN.tokenTypeIdx:
      scanMode = "RESCAN";
      state.index++;
      break;
    case t.NOSCAN.tokenTypeIdx:
      scanMode = "NOSCAN";
      state.index++;
      break;
  }
  return scanMode;
}

/**
 * Note: Even though the SKIP statement is documented in the language manual,
 * the compiler does not seem to support it.
 * Therefore, we parse it, but don't actually generate any instructions for it.
 */
function skipStatement(state: ParserState): ast.SkipDirective {
  const statement = ast.createSkipDirective();
  state.consume(statement, CstNodeKind.SkipDirective_SKIP, t.SKIP);
  let lineCount: number = 1;
  if (
    state.tryConsume(
      statement,
      CstNodeKind.SkipDirective_OpenParen,
      t.OpenParen,
    )
  ) {
    const token = state.consume(
      statement,
      CstNodeKind.NumberLiteral_ValueNumber,
      t.NUMBER,
    );
    if (token) {
      lineCount = parseInt(token.image, 10);
      statement.lineCount = lineCount;
    }
    state.consume(
      statement,
      CstNodeKind.SkipDirective_CloseParen,
      t.CloseParen,
    );
  }
  state.consume(statement, CstNodeKind.SkipDirective_Semicolon, t.Semicolon);
  return statement;
}

function popDirective(state: ParserState): ast.PopDirective {
  const directive = ast.createPopDirective();
  state.consume(directive, CstNodeKind.PopDirective_POP, t.POP);
  state.consume(directive, CstNodeKind.PopDirective_Semicolon, t.Semicolon);
  return directive;
}

function pushDirective(state: ParserState): ast.PushDirective {
  const directive = ast.createPushDirective();
  state.consume(directive, CstNodeKind.PushDirective_PUSH, t.PUSH);
  state.consume(directive, CstNodeKind.PushDirective_Semicolon, t.Semicolon);
  return directive;
}

function pageDirective(state: ParserState): ast.PageDirective {
  const directive = ast.createPageDirective();
  state.consume(directive, CstNodeKind.PageDirective_PAGE, t.PAGE);
  state.consume(directive, CstNodeKind.PageDirective_Semicolon, t.Semicolon);
  return directive;
}

function printDirective(state: ParserState): ast.PrintDirective {
  const directive = ast.createPrintDirective();
  state.consume(directive, CstNodeKind.PrintDirective_PRINT, t.PRINT);
  state.consume(directive, CstNodeKind.PrintDirective_Semicolon, t.Semicolon);
  return directive;
}

function noprintDirective(state: ParserState): ast.NoPrintDirective {
  const directive = ast.createNoPrintDirective();
  state.consume(directive, CstNodeKind.NoPrintDirective_NOPRINT, t.NOPRINT);
  state.consume(directive, CstNodeKind.NoPrintDirective_Semicolon, t.Semicolon);
  return directive;
}

function assignmentStatement(state: ParserState): ast.AssignmentStatement {
  const assignment = ast.createAssignmentStatement();
  assignment.refs.push(locatorCall(state, true));
  // TODO: add support for more assignment operators (+=, -=, etc)
  state.consume(assignment, CstNodeKind.AssignmentStatement_Operator, t.Equals);
  assignment.operator = "=";
  const right = expression(state);
  assignment.expression = right;
  state.consume(
    assignment,
    CstNodeKind.AssignmentStatement_Semicolon,
    t.Semicolon,
  );
  return assignment;
}

function locatorCall(
  state: ParserState,
  withDimensions: boolean,
): ast.LocatorCall {
  const locatorCall = ast.createLocatorCall();
  locatorCall.element = memberCall(state, withDimensions);
  return locatorCall;
}

function memberCall(
  state: ParserState,
  withDimensions: boolean,
): ast.MemberCall {
  const memberCall = ast.createMemberCall();
  memberCall.element = parseReferenceItem(state, withDimensions);
  return memberCall;
}

function noteStatement(state: ParserState): ast.NoteDirective {
  const note = ast.createNoteDirective();
  note.noteToken = state.consume(
    note,
    CstNodeKind.NoteDirective_PercentNOTE,
    t.NOTE,
  );
  state.consume(note, CstNodeKind.NoteDirective_OpenParen, t.OpenParen);
  note.message = expression(state);
  if (state.tryConsume(note, CstNodeKind.NoteDirective_Comma, t.Comma)) {
    note.code = expression(state);
  }
  state.consume(note, CstNodeKind.NoteDirective_CloseParen, t.CloseParen);
  state.consume(note, CstNodeKind.NoteDirective_Semicolon, t.Semicolon);
  return note;
}

function replaceStatement(state: ParserState): ast.ReplaceStatement {
  const statement = ast.createReplaceStatement();
  state.consume(statement, CstNodeKind.ReplaceStatement_REPLACE, t.REPLACE);
  const token = state.consume(statement, CstNodeKind.ReplaceStatement_Id, t.ID);
  if (token) {
    statement.name = token.image;
    statement.nameToken = token;
  }

  if (!state.tryConsume(statement, CstNodeKind.ReplaceStatement_BY, t.BY)) {
    // If BY is not found, we expect a WITH
    if (
      !state.tryConsume(statement, CstNodeKind.ReplaceStatement_WITH, t.WITH)
    ) {
      state.error(
        `"Expected 'BY' or 'WITH' after identifier, but found '${generateTokenErrorName(state.token)}'.`,
      );
    }
  }

  if (state.canConsume(t.STRING_TERM)) {
    statement.literal = stringLiteral(state);
  } else if (state.canConsume(t.NUMBER)) {
    statement.literal = numberLiteral(state);
  } else {
    const currentToken = state.token || state.last;
    state.error(
      `"Expected a string or number literal, but found '${currentToken?.image}'.`,
      currentToken,
    );
  }
  state.consume(statement, CstNodeKind.ReplaceStatement_Semicolon, t.Semicolon);
  return statement;
}

function declareStatement(state: ParserState): ast.DeclareStatement {
  const statement = ast.createDeclareStatement();
  // Only one declared item is allowed in a preprocessor declare statement
  const declaredItem = ast.createDeclaredItem();
  statement.items.push(declaredItem);
  state.consume(statement, CstNodeKind.DeclareStatement_DECLARE, t.DECLARE);
  do {
    if (
      state.tryConsume(
        declaredItem,
        CstNodeKind.DeclaredItem_OpenParen,
        t.OpenParen,
      )
    ) {
      do {
        declaredItem.elements.push(declaredVariable(state));
      } while (
        state.tryConsume(declaredItem, CstNodeKind.DeclaredItem_Comma, t.Comma)
      );
      state.consume(
        declaredItem,
        CstNodeKind.DeclaredItem_CloseParen,
        t.CloseParen,
      );
    } else {
      declaredItem.elements.push(declaredVariable(state));
    }
    const attrs = attributes(state);
    declaredItem.attributes = attrs;
  } while (
    state.tryConsume(statement, CstNodeKind.DeclareStatement_Comma, t.Comma)
  );
  state.consume(statement, CstNodeKind.DeclareStatement_Semicolon, t.Semicolon);
  return statement;
}

function declaredVariable(state: ParserState): ast.DeclaredVariable {
  const declaredVariable = ast.createDeclaredVariable();
  const variable = state.consume(
    declaredVariable,
    CstNodeKind.DeclaredVariable_Name,
    t.ID,
  );
  if (variable) {
    declaredVariable.name = variable.image;
    declaredVariable.nameToken = variable;
  }
  return declaredVariable;
}

function dimensions(state: ParserState): ast.Dimensions {
  const dimensions = ast.createDimensions();
  dimensions.token = state.consume(
    dimensions,
    CstNodeKind.Dimensions_OpenParen,
    t.OpenParen,
  );
  if (
    state.tryConsume(
      dimensions,
      CstNodeKind.Dimensions_CloseParen,
      t.CloseParen,
    )
  ) {
    // Return early if we found a close parenthesis immediately after open
    return dimensions;
  }
  dimensions.dimensions.push(parseBound(state));
  while (state.tryConsume(dimensions, CstNodeKind.Dimensions_Comma, t.Comma)) {
    dimensions.dimensions.push(parseBound(state));
  }
  state.consume(dimensions, CstNodeKind.Dimensions_CloseParen, t.CloseParen);
  return dimensions;
}

function parseBound(state: ParserState): ast.DimensionBound {
  const bound = ast.createDimensionBound();
  const leftBound = ast.createBound();
  const left = parseExpressionWildcard(
    leftBound,
    CstNodeKind.Bound_Star,
    state,
  );
  leftBound.expression = left;
  if (state.tryConsume(bound, CstNodeKind.DimensionBound_Colon, t.Colon)) {
    const rightBound = ast.createBound();
    const right = parseExpressionWildcard(
      rightBound,
      CstNodeKind.Bound_Star,
      state,
    );
    rightBound.expression = right;
    bound.lower = leftBound;
    bound.upper = rightBound;
  } else {
    bound.upper = leftBound;
  }
  return bound;
}

function parseExpressionWildcard(
  element: ast.SyntaxNode,
  kind: CstNodeKind,
  state: ParserState,
): ast.Wildcard<ast.Expression> | null {
  if (state.tryConsume(element, kind, t.Star)) {
    return "*";
  } else {
    return expression(state);
  }
}

function attributes(state: ParserState): ast.DeclarationAttribute[] {
  const attributes: ast.DeclarationAttribute[] = [];
  while (!state.eof) {
    if (state.canConsume(t.DefaultAttribute)) {
      const dataAttribute = ast.createComputationDataAttribute();
      const attributeToken = state.consume(
        dataAttribute,
        CstNodeKind.DefaultAttribute_Value,
        t.DefaultAttribute,
      );
      if (attributeToken) {
        dataAttribute.type = attributeToken.image as ast.DefaultAttribute;
        dataAttribute.typeToken = attributeToken;
        attributes.push(dataAttribute);
      }
    } else if (state.canConsume(t.OpenParen)) {
      const dim = dimensions(state);
      const dimensionAttribute = ast.createDimensionsDataAttribute();
      dimensionAttribute.dimensions = dim;
      attributes.push(dimensionAttribute);
    } else if (state.canConsume(t.ENTRY)) {
      // TODO: This is not the full entry attribute syntax
      // This is just to provide support for the common case of "ENTRY" on declarations
      const entryAttribute = ast.createEntryAttribute();
      entryAttribute.entryToken = state.consume(
        entryAttribute,
        CstNodeKind.EntryAttribute_ENTRY,
        t.ENTRY,
      );
      attributes.push(entryAttribute);
    } else {
      break;
    }
  }
  return attributes;
}

function expression(state: ParserState): ast.Expression | null {
  return parseBinary(state);
}

function parseBinary(state: ParserState): ast.Expression | null {
  const infixOperatorItem: IntermediateBinaryExpression = {
    infix: true,
    items: [],
    operators: [],
  };
  infixOperatorItem.items.push(primary(state));
  while (true) {
    const operator = state.tryConsume(
      infixOperatorItem as any,
      CstNodeKind.BinaryExpression_Operator,
      t.BinaryOperator,
    );
    if (!operator) {
      break;
    }

    const item = primary(state);
    infixOperatorItem.items.push(item);
    infixOperatorItem.operators.push(operator);
  }
  return constructBinaryExpression(infixOperatorItem);
}

function primary(state: ParserState): ast.Expression | null {
  if (state.canConsume(t.NUMBER)) {
    return numberLiteral(state);
  } else if (state.canConsume(t.STRING_TERM)) {
    return stringLiteral(state);
  } else if (state.canConsume(t.ID)) {
    return locatorCall(state, true);
  } else if (state.canConsume(t.OpenParen)) {
    state.consume(
      undefined,
      CstNodeKind.ParenthesizedExpression_OpenParen,
      t.OpenParen,
    );
    const expr = expression(state);
    state.consume(
      undefined,
      CstNodeKind.ParenthesizedExpression_CloseParen,
      t.CloseParen,
    );
    return expr;
  }
  state.error();
  return null;
}

function numberLiteral(state: ParserState): ast.Literal {
  const literal = ast.createLiteral();
  const numberLiteral = ast.createNumberLiteral();
  literal.value = numberLiteral;
  const number = state.consume(
    numberLiteral,
    CstNodeKind.NumberLiteral_ValueNumber,
    t.NUMBER,
  );
  if (number) {
    numberLiteral.value = number.image;
  }
  return literal;
}

function stringLiteral(state: ParserState): ast.Literal {
  const literal = ast.createLiteral();
  const stringLiteral = ast.createStringLiteral();
  literal.value = stringLiteral;
  const stringToken = state.consume(
    stringLiteral,
    CstNodeKind.StringLiteral_ValueString,
    t.STRING_TERM,
  );
  if (stringToken) {
    const content = unpackCharacterValue(stringToken.image);
    stringLiteral.value = content;
  }
  return literal;
}

function unpackCharacterValue(literal: string): string {
  return literal.substring(1, literal.length - 1).replace(/""/g, '"');
}

const XCharCodeLower = "x".charCodeAt(0);
const XCharCode = "X".charCodeAt(0);

function isXInstruction(token: t.Token | null | undefined): boolean {
  if (!token) {
    return false;
  }
  const char0 = token.image.charCodeAt(0);
  return char0 === XCharCodeLower || char0 === XCharCode;
}
