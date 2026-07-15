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

import {
  generateTokenErrorName,
  ParserState,
  RecoveryResult,
} from "./parser-state";
import * as ast from "../syntax-tree/ast";
import {
  constructBinaryExpression,
  IntermediateBinaryExpression,
} from "./binary-expressions";
import { CstNodeKind } from "../syntax-tree/cst";
import * as t from "./tokens";
import { tokenMatcher, TokenType } from "chevrotain";
import {
  diagnostic,
  diagnosticFromCode,
  Range,
  Severity,
  tokenToRange,
} from "../language-server/types";
import { PLICodes } from "../validation/pli-codes";
import { performAssignmentLookahead } from "./parser-lookahead";
import { ExpressionParameter } from "./parser-types";
import { TextDocument } from "vscode-languageserver-textdocument";

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

export function statement(
  state: ParserState,
  textDocument: TextDocument,
): Promise<ast.Statement | null>;
export function statement(
  state: ParserState,
  textDocument: TextDocument,
  withEnd: true,
  endPercent: boolean,
): Promise<ast.Statement | ast.EndStatement | null>;
export async function statement(
  state: ParserState,
  textDocument: TextDocument,
  withEnd?: true,
  endPercent?: boolean,
): Promise<ast.Statement | ast.EndStatement | null> {
  let end = withEnd ?? false;
  let endP = endPercent ?? false;
  if (!state.isInProcedure()) {
    if (state.tryConsume(undefined, CstNodeKind.Percentage, t.Percent)) {
      return await commonStatement(state, textDocument, {
        withEnd: end,
        endPercent: endP,
        startPercent: false, // Percent token already consumed
        labels: true,
      });
    } else {
      // Anything that isn't a `%` statement (including `EXEC SQL`/`EXEC CICS`) passes
      // through as plain tokens - the SQL/CICS phases process EXEC statements themselves.
      return consumeTokenStatement(state);
    }
  } else {
    //state.isInProcedure()
    return await commonStatement(state, textDocument, {
      withEnd: end,
      endPercent: endP,
      startPercent: false, // Inside of a procedure, percent not required
      labels: true,
    });
  }
}

function labels(state: ParserState): ast.LabelPrefix[] {
  const labels: ast.LabelPrefix[] = [];
  // Preprocessor labels never carry dimensions (macro label arrays are not
  // a supported construct), so a plain `ID :` lookahead is sufficient here.
  while (state.canConsume(t.ID, t.Colon)) {
    const label = ast.createLabelPrefix();
    label.item = parseReferenceItem(state, false);
    state.consume(label, CstNodeKind.LabelPrefix_Colon, t.Colon);
    labels.push(label);
  }
  return labels;
}

interface StatementParseOptions {
  /**
   * Whether or not the `END` statement is allowed
   */
  withEnd: boolean;
  /**
   * Whether or not the `END` statement must be prefixed with a `%` (even in a procedure)
   */
  endPercent: boolean;
  /**
   * Whether or not the statement is allowed to start with an optional `%` token.
   */
  startPercent: boolean;
  /**
   * Whether or not the statement is allowed to have labels.
   */
  labels: boolean;
}

export function commonStatement(
  state: ParserState,
  textDocument: TextDocument,
  options: StatementParseOptions & { withEnd: false },
): Promise<ast.Statement | null>;
export function commonStatement(
  state: ParserState,
  textDocument: TextDocument,
  options: StatementParseOptions,
): Promise<ast.Statement | ast.EndStatement | null>;
export async function commonStatement(
  state: ParserState,
  textDocument: TextDocument,
  options: StatementParseOptions,
): Promise<ast.Statement | ast.EndStatement | null> {
  const statement = ast.createStatement();
  statement.startToken = state.token ?? null;

  let startPercent: t.Token | null = null;
  if (state.isInProcedure() || options.startPercent) {
    // In some cases, we enter this function with the current token being a `%`
    // This might be due to:
    // 1. Errors in the input
    // 2. If we are parsing a procedure end statement
    // 3. If we are parsing a statement inside of a IF or SELECT statement
    //    These are not required to have a `%` prefix, but can have one anyway
    // After parsing the "unit" below, we will check if we have a `%END` statement
    // Only then will we actually know whether this token is invalid
    startPercent = state.tryConsume(
      statement,
      CstNodeKind.Percentage,
      t.Percent,
    );
  }
  let stmtLabels: ast.LabelPrefix[] = [];
  if (options.labels) {
    stmtLabels = labels(state);
    statement.labels = stmtLabels;
  }
  let unit: ast.Unit | null = null;
  let endStmt: ast.EndStatement | null = null;
  if (performAssignmentLookahead(state)) {
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
        unit = await doStatement(state, textDocument);
        break;
      case t.END.tokenTypeIdx:
        if (options.withEnd) {
          endStmt = endStatement(state, stmtLabels);
        }
        break;
      case t.GO.tokenTypeIdx:
      case t.GOTO.tokenTypeIdx:
        unit = goToStatement(state);
        break;
      case t.IF.tokenTypeIdx:
        unit = await ifStatement(state, textDocument);
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
        unit = await selectStatement(state, textDocument);
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
        if (options.withEnd) {
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
        unit = await doStatement(state, textDocument);
        break;
      case t.GOTO.tokenTypeIdx:
      case t.GO.tokenTypeIdx:
        unit = goToStatement(state);
        break;
      case t.LEAVE.tokenTypeIdx:
        unit = leaveStatement(state);
        break;
      case t.IF.tokenTypeIdx:
        unit = await ifStatement(state, textDocument);
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
          unit = await procedureStatement(state, textDocument);
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
        unit = await selectStatement(state, textDocument);
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
  state.recover(() => performRecovery(state));
  if (endStmt) {
    if (!options.endPercent && startPercent) {
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
  } else if (startPercent && !options.startPercent) {
    // We have a starting percent, but didn't parse a %END statement
    // This is an error if we don't allow starting percents
    state.diagnostics.push(
      diagnosticFromCode(PLICodes.Severe.IBM3762I, startPercent),
    );
  }

  statement.value = unit;

  statement.endToken = state.last ?? null;
  return statement;
}

function performRecovery(state: ParserState): RecoveryResult {
  // If the preprocessor parser encounters an error, it should attempt to:
  // 1. Find a semicolon at the current line, and skip that token
  // 2. Find a percent sign at the current line, and stop
  // 3. If neither is found, skip to the next line
  //
  // `state.recover()` always advances one token at a time, so `currentToken.startsNewLine`
  // (true iff a line break occurs right before it) is equivalent to comparing its line
  // against the line recovery started on: recovery stops as soon as any token in the chain
  // crosses a line break, and until then every token on the starting line has
  // `startsNewLine === false`.
  const currentToken = state.token;
  if (!currentToken) {
    return RecoveryResult.Continue;
  }
  if (currentToken.startsNewLine) {
    return RecoveryResult.Recover;
  } else if (tokenMatcher(currentToken, t.Percent)) {
    return RecoveryResult.Recover;
  } else if (tokenMatcher(currentToken, t.Semicolon)) {
    return RecoveryResult.RecoverNext;
  }
  return RecoveryResult.Continue;
}

function callStatement(state: ParserState): ast.CallStatement {
  const statement = ast.createCallStatement();
  state.consume(statement, CstNodeKind.CallStatement_CALL, t.CALL);
  statement.call = locatorCall(state, true);
  state.consume(statement, CstNodeKind.CallStatement_Semicolon, t.Semicolon);
  return statement;
}

async function procedureStatement(
  state: ParserState,
  textDocument: TextDocument,
): Promise<ast.ProcedureStatement> {
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
    let returnType: number | undefined = undefined;
    const dataAttribute = ast.createComputationDataAttribute();
    if (
      state.tryConsume(
        dataAttribute,
        CstNodeKind.DefaultAttribute_Value,
        t.CHARACTER,
      )
    ) {
      returnType = t.CHARACTER.tokenTypeIdx;
    } else if (
      state.tryConsume(
        dataAttribute,
        CstNodeKind.DefaultAttribute_Value,
        t.FIXED,
      )
    ) {
      returnType = t.FIXED.tokenTypeIdx;
    }
    if (returnType !== undefined) {
      dataAttribute.type = t.DefaultAttribute.mapToEnumLiteral(returnType);
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
    CstNodeKind.ProcedureStatement_Semicolon,
    t.Semicolon,
  );
  const body = await statements(state, textDocument, true);
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
    [CstNodeKind.AnswerStatement_NOSCAN, t.NOSCAN, ast.ScanMode.NOSCAN],
    [CstNodeKind.AnswerStatement_SCAN, t.SCAN, ast.ScanMode.SCAN],
    [CstNodeKind.AnswerStatement_RESCAN, t.RESCAN, ast.ScanMode.RESCAN],
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
  reference.label = memberCall(state, true);
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
  let range: Range | null = null;
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
      range = {
        start: idTokens[0].startOffset,
        end: NaN,
      };
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

      const endToken = state.consume(
        item,
        CstNodeKind.IncludeItem_CloseParen,
        t.CloseParen,
      );
      if (endToken && range) {
        range.end = endToken.endOffset + 1;
      }
      // joint ddname
      item.ddname = idTokens.map((t) => t.image).join(".");
      item.ddnameTokens = idTokens; // <-- TODO use these tokens to report chained diagnostics, do I already do this?

      item.memberName = memberToken?.image ?? null;
      item.token = memberToken;
    } else if (idTokens.length === 1) {
      item = ast.createIncludeItemMember();
      const idToken = idTokens[0];
      idToken.element = item;
      range = tokenToRange(idToken);

      // either ddname w/ member, or raw member
      const ddnameOrMember = idToken.image;

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
    } else if (
      state.tryConsume(item, CstNodeKind.IncludeItem_OpenParen, t.OpenParen)
    ) {
      // DISCREPANCY: The compiler also accepts (ID) here (with parenthesis)
      item = ast.createIncludeItemMember();
      const memberToken = state.consume(
        item,
        CstNodeKind.IncludeItem_MemberID,
        t.ID,
      );
      if (memberToken) {
        range = tokenToRange(memberToken);
        item.memberName = memberToken?.image ?? null;
        item.token = memberToken;
      } else {
        parseError = true;
      }
      state.consume(item, CstNodeKind.IncludeItem_CloseParen, t.CloseParen);
      if (parseError) {
        break;
      }
    } else {
      item = ast.createIncludeItemFile();
      // direct file include, not a member (from string)
      const stringToken = state.tryConsume(
        item,
        CstNodeKind.IncludeItem_FileString,
        t.STRING_TERM,
      );
      if (stringToken) {
        range = tokenToRange(stringToken);
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
    item.range = range;
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
  statement.endToken = state.consume(
    statement,
    CstNodeKind.EndStatement_END,
    t.END,
  );
  if (state.canConsume(t.ID)) {
    const label = ast.createLabelReference();
    statement.label = label;
    label.label = memberCall(state, false);
  }
  statement.semicolon = state.consume(
    statement,
    CstNodeKind.EndStatement_Semicolon,
    t.Semicolon,
  );
  return statement;
}

async function doStatement(
  state: ParserState,
  textDocument: TextDocument,
): Promise<ast.DoStatement> {
  const statement = ast.createDoStatement();
  state.consume(statement, CstNodeKind.DoStatement_DO, t.DO);

  if (state.canConsume(t.SKIP)) {
    // skip command
    state.consume(statement, CstNodeKind.DoStatement_SKIP, t.SKIP);
    state.consume(statement, CstNodeKind.DoStatement_Semicolon, t.Semicolon);
    statement.skip = true;
    const body = await statements(state, textDocument);
    statement.end = body.end;
    return statement;
  } else if (state.canConsume(t.WHILE)) {
    //type-2-do-while-first
    const type2 = doWhile(state);
    state.consume(statement, CstNodeKind.DoStatement_Semicolon, t.Semicolon);
    const body = await statements(state, textDocument);
    statement.doType2 = type2;
    statement.statements = body.statements;
    statement.end = body.end;
  } else if (state.canConsume(t.UNTIL)) {
    //type-2-do-until-first
    const type2 = doUntil(state);
    state.consume(statement, CstNodeKind.DoStatement_Semicolon, t.Semicolon);
    const body = await statements(state, textDocument);
    statement.doType2 = type2;
    statement.statements = body.statements;
    statement.end = body.end;
  } else if (
    state.tryConsume(statement, CstNodeKind.DoStatement_LOOP, t.LOOP)
  ) {
    //type-4 loops
    statement.doType4 = true;
    state.consume(statement, CstNodeKind.DoStatement_Semicolon, t.Semicolon);
    const body = await statements(state, textDocument);
    statement.statements = body.statements;
    statement.end = body.end;
  } else if (state.canConsume(t.ID)) {
    // type-3-do
    const type3 = doType3(state);
    state.consume(statement, CstNodeKind.DoStatement_Semicolon, t.Semicolon);
    const body = await statements(state, textDocument);
    statement.doType3 = type3;
    statement.statements = body.statements;
    statement.end = body.end;
  } else if (
    state.tryConsume(statement, CstNodeKind.DoStatement_Semicolon, t.Semicolon)
  ) {
    //type-1-do
    const body = await statements(state, textDocument);
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

async function statements(
  state: ParserState,
  textDocument: TextDocument,
  endWithPercent = false,
): Promise<StatementList> {
  const statements: ast.Statement[] = [];
  let end: ast.EndStatement | null = null;
  while (!state.eof) {
    const startIndex = state.index;
    const stmt = await statement(state, textDocument, true, endWithPercent);
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

async function selectStatement(
  state: ParserState,
  textDocument: TextDocument,
): Promise<ast.SelectStatement> {
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
  state.consume(statement, CstNodeKind.SelectStatement_Semicolon, t.Semicolon);
  while (state.canPercentConsume(t.WHEN)) {
    statement.cases.push(await whenStatement(state, textDocument));
  }
  if (state.canPercentConsume(t.OTHERWISE)) {
    statement.cases.push(await otherwiseStatement(state, textDocument));
  }
  if (!state.isInProcedure()) {
    // END statement is preceded by a percent
    state.consume(statement, CstNodeKind.Percentage, t.Percent);
  }
  statement.end = endStatement(state);
  return statement;
}

async function whenStatement(
  state: ParserState,
  textDocument: TextDocument,
): Promise<ast.WhenStatement> {
  const when = ast.createWhenStatement();
  state.percentConsume(when, CstNodeKind.WhenStatement_WHEN, t.WHEN);
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
  when.unit = await statementAfterCase(state, textDocument);
  if (rangeStart != undefined && state.last) {
    when.range = {
      start: rangeStart,
      end: state.last.endOffset + 1,
    };
  }
  return when;
}

async function otherwiseStatement(
  state: ParserState,
  textDocument: TextDocument,
): Promise<ast.OtherwiseStatement> {
  const otherwise = ast.createOtherwiseStatement();
  state.percentConsume(
    otherwise,
    CstNodeKind.OtherwiseStatement_OTHERWISE,
    t.OTHERWISE,
  );
  const rangeStart = state.token?.startOffset;
  otherwise.unit = await statementAfterCase(state, textDocument);
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

async function ifStatement(
  state: ParserState,
  textDocument: TextDocument,
): Promise<ast.IfStatement> {
  const ifStatement = ast.createIfStatement();
  state.consume(ifStatement, CstNodeKind.IfStatement_IF, t.IF);
  ifStatement.expression = expression(state);
  if (state.isInProcedure()) {
    // Inside of procedure: % before THEN is an error
    state.percentConsume(ifStatement, CstNodeKind.IfStatement_THEN, t.THEN);
  } else {
    // Outside of procedure: % before THEN is optional!
    // NOTE: The language reference requires a % here, but the compiler does not enforce it
    state.tryConsume(ifStatement, CstNodeKind.Percentage, t.Percent);
    state.consume(ifStatement, CstNodeKind.IfStatement_THEN, t.THEN);
  }
  const unitRangeStart = state.token?.startOffset;
  ifStatement.unit = await statementAfterCase(state, textDocument);
  if (unitRangeStart != undefined && state.last) {
    ifStatement.unitRange = {
      start: unitRangeStart,
      end: state.last.endOffset + 1,
    };
  }
  if (state.canPercentConsume(t.ELSE)) {
    state.percentConsume(ifStatement, CstNodeKind.IfStatement_ELSE, t.ELSE);
    const elseRangeStart = state.token?.startOffset;
    ifStatement.else = await statementAfterCase(state, textDocument);
    if (elseRangeStart != undefined && state.last) {
      ifStatement.elseRange = {
        start: elseRangeStart,
        end: state.last.endOffset + 1,
      };
    }
  }
  return ifStatement;
}

// Statement used after IF, WHEN and OTHERWISE clauses
// Has special semantics that uses an optional starting percent and prohibits labels
async function statementAfterCase(
  state: ParserState,
  textDocument: TextDocument,
): Promise<ast.Statement | null> {
  return await commonStatement(state, textDocument, {
    withEnd: false,
    endPercent: false,
    startPercent: true, // Can optionally start with a percent
    labels: false, // Labels are not allowed here
  });
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
  if (withDimensions) {
    while (state.canConsume(t.OpenParen)) {
      reference.dimensions.push(dimensions(state));
    }
  }
  return reference;
}

function tryScanMode(state: ParserState): ast.ScanMode | null {
  let scanMode: ast.ScanMode | null = null;
  switch (state.token?.tokenTypeIdx) {
    case t.SCAN.tokenTypeIdx:
    case t.NORESCAN.tokenTypeIdx:
      scanMode = ast.ScanMode.SCAN;
      state.index++;
      break;
    case t.RESCAN.tokenTypeIdx:
      scanMode = ast.ScanMode.RESCAN;
      state.index++;
      break;
    case t.NOSCAN.tokenTypeIdx:
      scanMode = ast.ScanMode.NOSCAN;
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
  statement.token = state.consume(
    statement,
    CstNodeKind.SkipDirective_SKIP,
    t.SKIP,
  );
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
  const operatorToken = state.consume(
    assignment,
    CstNodeKind.AssignmentStatement_Operator,
    t.AssignmentOperator,
  );
  if (operatorToken) {
    assignment.operator = t.AssignmentOperator.mapToEnumLiteral(
      operatorToken.tokenTypeIdx,
    );
  }
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
  state.consume(statement, CstNodeKind.DeclareStatement_DECLARE, t.DECLARE);
  do {
    statement.items.push(declaredItem(state));
  } while (
    state.tryConsume(statement, CstNodeKind.DeclareStatement_Comma, t.Comma)
  );
  state.consume(statement, CstNodeKind.DeclareStatement_Semicolon, t.Semicolon);
  return statement;
}

function declaredItem(state: ParserState): ast.DeclaredItem {
  const item = ast.createDeclaredItem();
  if (state.tryConsume(item, CstNodeKind.DeclaredItem_OpenParen, t.OpenParen)) {
    do {
      item.elements.push(declaredItem(state));
    } while (state.tryConsume(item, CstNodeKind.DeclaredItem_Comma, t.Comma));
    state.consume(item, CstNodeKind.DeclaredItem_CloseParen, t.CloseParen);
  } else {
    item.elements.push(declaredVariable(state));
  }
  const attrs = attributes(state);
  item.attributes = attrs;
  return item;
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
  let startToken = dimensions.token;
  let endtoken: t.Token | null = null;
  dimensions.dimensions.push(parseBound(state));
  while (
    (endtoken = state.tryConsume(
      dimensions,
      CstNodeKind.Dimensions_Comma,
      t.Comma,
    ))
  ) {
    applyToLastBound();
    startToken = endtoken;
    dimensions.dimensions.push(parseBound(state));
  }
  endtoken = state.consume(
    dimensions,
    CstNodeKind.Dimensions_CloseParen,
    t.CloseParen,
  );
  applyToLastBound();
  return dimensions;

  function applyToLastBound() {
    const last = dimensions.dimensions[dimensions.dimensions.length - 1];
    if (last) {
      last.startToken = startToken;
      last.endToken = endtoken;
    }
  }
}

function parseBound(state: ParserState): ast.DimensionBound {
  const bound = ast.createDimensionBound();
  const leftBound = ast.createBound();
  const left = expression(state);
  leftBound.expression = left;
  if (state.tryConsume(bound, CstNodeKind.DimensionBound_Colon, t.Colon)) {
    const rightBound = ast.createBound();
    const right = expression(state);
    rightBound.expression = right;
    bound.lower = leftBound;
    bound.upper = rightBound;
  } else {
    bound.upper = leftBound;
  }
  return bound;
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
        dataAttribute.type = t.DefaultAttribute.mapToEnumLiteral(
          attributeToken.tokenTypeIdx,
        );
        dataAttribute.typeToken = attributeToken;
        attributes.push(dataAttribute);

        if (state.canConsume(t.OpenParen)) {
          dataAttribute.dimensions = dimensions(state);
        }
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
    } else if (state.canConsume(t.INITIAL)) {
      const initialAttribute = ast.createInitialAttribute();
      initialAttribute.initial = state.consume(
        initialAttribute,
        CstNodeKind.InitialAttribute_INITIAL,
        t.INITIAL,
      );
      state.consume(
        initialAttribute,
        CstNodeKind.InitialAttribute_OpenParen,
        t.OpenParen,
      );
      const firstExpr = expression(state, {
        multiple: true,
        init: true,
      });
      if (firstExpr) {
        initialAttribute.expressions.push(firstExpr);
      }
      while (
        state.tryConsume(
          initialAttribute,
          CstNodeKind.InitialAttribute_Comma,
          t.Comma,
        )
      ) {
        const expr = expression(state, {
          multiple: true,
          init: true,
        });
        if (expr) {
          initialAttribute.expressions.push(expr);
        }
      }
      state.consume(
        initialAttribute,
        CstNodeKind.InitialAttribute_CloseParen,
        t.CloseParen,
      );
      attributes.push(initialAttribute);
    } else {
      break;
    }
  }
  return attributes;
}

function expression(
  state: ParserState,
  params?: ExpressionParameter,
): ast.Expression | null {
  return parseBinary(state, params ?? {});
}

function parseBinary(
  state: ParserState,
  params: ExpressionParameter,
): ast.Expression | null {
  const infixOperatorItem: IntermediateBinaryExpression = {
    infix: true,
    items: [],
    operators: [],
    operatorTokens: [],
  };
  infixOperatorItem.items.push(primary(state, params));
  while (true) {
    const operatorToken = state.tryConsume(
      infixOperatorItem as any,
      CstNodeKind.BinaryExpression_Operator,
      t.BinaryOperator,
    );
    if (!operatorToken) {
      break;
    }

    const item = primary(state, params);
    infixOperatorItem.items.push(item);
    infixOperatorItem.operators.push(
      t.BinaryOperator.mapToEnumLiteral(operatorToken.tokenTypeIdx),
    );
    infixOperatorItem.operatorTokens.push(operatorToken);
  }
  return constructBinaryExpression(infixOperatorItem);
}

function primary(
  state: ParserState,
  params: ExpressionParameter,
): ast.Expression | null {
  if (state.canConsume(t.NUMBER)) {
    return numberLiteral(state);
  } else if (state.canConsume(t.STRING_TERM)) {
    return stringLiteral(state);
  } else if (state.canConsume(t.ID)) {
    return locatorCall(state, true);
  } else if (state.canConsume(t.OpenParen)) {
    return parenthesis(state, params);
  } else if (state.canConsume(t.UnaryOperator)) {
    return unaryExpression(state);
  } else if (state.canConsume(t.Star)) {
    return wildcard(state);
  }
  state.error();
  return null;
}

function canConsumeExpression(state: ParserState): boolean {
  if (
    state.canConsume(t.NUMBER) ||
    state.canConsume(t.STRING_TERM) ||
    state.canConsume(t.ID) ||
    state.canConsume(t.OpenParen) ||
    state.canConsume(t.UnaryOperator)
  ) {
    return true;
  }
  if (state.canConsume(t.Star)) {
    // Can only be a wildcard expression if the next token after is not another expression token
    const nextToken = state.peek(2);
    if (!nextToken) {
      return true;
    }
    return !(
      tokenMatcher(nextToken, t.NUMBER) ||
      tokenMatcher(nextToken, t.STRING_TERM) ||
      tokenMatcher(nextToken, t.ID) ||
      tokenMatcher(nextToken, t.OpenParen) ||
      tokenMatcher(nextToken, t.UnaryOperator)
    );
  }
  return false;
}

function wildcard(state: ParserState): ast.WildcardItem {
  const wildcard = ast.createWildcardItem();
  wildcard.token = state.consume(
    wildcard,
    CstNodeKind.WildcardItem_Asterisk,
    t.Star,
  );
  return wildcard;
}

function parenthesis(
  state: ParserState,
  params: ExpressionParameter,
): ast.Parenthesis | ast.RepeatedExpression {
  const element = ast.createParenthesis();
  state.consume(
    undefined,
    CstNodeKind.ParenthesizedExpression_OpenParen,
    t.OpenParen,
  );
  const expr = expression(state, params);
  if (expr) {
    element.expressions.push(expr);
  }
  while (
    params.multiple &&
    state.tryConsume(
      element,
      CstNodeKind.ParenthesizedExpression_Comma,
      t.Comma,
    )
  ) {
    const nextExpr = expression(state, params);
    if (nextExpr) {
      element.expressions.push(nextExpr);
    }
  }
  state.consume(
    undefined,
    CstNodeKind.ParenthesizedExpression_CloseParen,
    t.CloseParen,
  );

  // See documentation of RepeatedExpression for details on this syntax
  if (params.init && canConsumeExpression(state)) {
    const repeated = parseBinary(state, params);
    if (repeated !== null) {
      const repeatedExpr = ast.createRepeatedExpression();
      repeatedExpr.count = element;
      repeatedExpr.expression = repeated;
      return repeatedExpr;
    }
  }

  return element;
}

function unaryExpression(state: ParserState): ast.Expression | null {
  const unaryExpression = ast.createUnaryExpression();
  const operatorToken = state.consume(
    unaryExpression,
    CstNodeKind.UnaryExpression_Operator,
    t.UnaryOperator,
  );
  if (operatorToken) {
    unaryExpression.op = t.UnaryOperator.mapToEnumLiteral(
      operatorToken.tokenTypeIdx,
    );
  }
  unaryExpression.expr = primary(state, {});
  return unaryExpression;
}

function numberLiteral(state: ParserState): ast.NumberLiteral {
  const numberLiteral = ast.createNumberLiteral();
  const number = state.consume(
    numberLiteral,
    CstNodeKind.NumberLiteral_ValueNumber,
    t.NUMBER,
  );
  if (number) {
    numberLiteral.value = number.image;
  }
  return numberLiteral;
}

function stringLiteral(state: ParserState): ast.StringLiteral {
  const stringLiteral = ast.createStringLiteral();
  const stringToken = state.consume(
    stringLiteral,
    CstNodeKind.StringLiteral_ValueString,
    t.STRING_TERM,
  );
  if (stringToken) {
    const content = unpackCharacterValue(stringToken.image);
    stringLiteral.value = content;
  }
  return stringLiteral;
}

function unpackCharacterValue(literal: string): string {
  const type = literal.charAt(0);
  const content = literal.substring(1, literal.length - 1);
  if (type === "'") {
    return content.replace(/''/g, "'");
  } else {
    return content.replace(/""/g, '"');
  }
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
