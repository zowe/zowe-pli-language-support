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
  PreprocessorBinaryTokens,
  PreprocessorTokens,
} from "./pli-preprocessor-tokens";
import { PreprocessorParserState } from "./pli-preprocessor-parser-state";
import { PreprocessorDiagnostic } from "./preprocessor-diagnostic";
import * as ast from "../syntax-tree/ast";
import {
  constructBinaryExpression,
  IntermediateBinaryExpression,
} from "../parser/abstract-parser";
import { CstNodeKind } from "../syntax-tree/cst";
import { Token } from "../parser/tokens";
import { performAssignmentLookahead } from "../parser/parser";
import { tokenMatcher } from "chevrotain";
import { recursivelySetContainer } from "../linking/symbol-table";
import { diagnostic, Diagnostic, Severity } from "../language-server/types";

export type PreprocessorParserResult = {
  statements: ast.Statement[];
  diagnostics: Diagnostic[];
  tokens: Token[];
};

export function preprocessorParse(
  state: PreprocessorParserState,
): PreprocessorParserResult {
  const statements: ast.Statement[] = [];
  const diagnostics: Diagnostic[] = [];
  while (!state.eof) {
    try {
      if (state.canConsume(PreprocessorTokens.Percentage)) {
        // Parse a preprocessor statement
        const stmt = statement(state);
        statements.push(stmt);
      } else if (state.canConsume(PreprocessorTokens.IncludeAlt)) {
        // Parse the "include-alt" statement
        // This is the only preprocessor statement that does not start with a percentage token
        const includeAlt = includeAltStatement(state);
        const stmt = ast.createStatement();
        stmt.value = includeAlt;
        statements.push(stmt);
      } else {
        // Otherwise construct a token statement
        statements.push(consumeTokenStatement(state));
      }
    } catch (error) {
      if (error instanceof PreprocessorDiagnostic) {
        diagnostics.push(
          diagnostic(error.severity, error.message, error.token),
        );
      } else {
        throw error;
      }
    }
  }
  for (const statement of statements) {
    recursivelySetContainer(statement);
  }
  return {
    statements,
    diagnostics,
    tokens: state.tokens,
  };
}

function consumeTokenStatement(state: PreprocessorParserState): ast.Statement {
  const tokenStatement = ast.createTokenStatement();
  const start = state.index;
  // We can assume that the first token is always a non-% token
  // Otherwise we wouldn't be able to get here in the first place
  let currentToken: Token | undefined = state.current;
  while (currentToken) {
    if (
      tokenMatcher(currentToken, PreprocessorTokens.Percentage) ||
      tokenMatcher(currentToken, PreprocessorTokens.IncludeAlt) ||
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

function statement(state: PreprocessorParserState): ast.Statement {
  if (!state.isInProcedure()) {
    if (
      state.tryConsume(
        undefined,
        CstNodeKind.Percentage,
        PreprocessorTokens.Percentage,
      )
    ) {
      return commonStatement(state);
    } else {
      return consumeTokenStatement(state);
    }
  } else {
    //state.isInProcedure()
    return commonStatement(state);
  }
}

function commonStatement(state: PreprocessorParserState): ast.Statement {
  const statement = ast.createStatement();
  while (state.canConsume(PreprocessorTokens.Id, PreprocessorTokens.Colon)) {
    const label = ast.createLabelPrefix();
    const labelToken = state.consume(
      label,
      CstNodeKind.LabelPrefix_Name,
      PreprocessorTokens.Id,
    );
    label.name = labelToken.image;
    label.nameToken = labelToken;
    state.consume(
      label,
      CstNodeKind.LabelPrefix_Colon,
      PreprocessorTokens.Colon,
    );
    statement.labels.push(label);
  }
  let unit: ast.Unit | undefined = undefined;
  if (performAssignmentLookahead((la) => state.lookahead(la))) {
    unit = assignmentStatement(state);
  } else if (state.isInProcedure()) {
    // TODO: Handle missing preprocessor procedure statements: ANSWER, CALL, NOTE, SELECT
    switch (state.current?.tokenTypeIdx) {
      case PreprocessorTokens.Declare.tokenTypeIdx:
        unit = declareStatement(state);
        break;
      case PreprocessorTokens.Do.tokenTypeIdx:
        unit = doStatement(state);
        break;
      case PreprocessorTokens.Go.tokenTypeIdx:
      case PreprocessorTokens.Goto.tokenTypeIdx:
        unit = goToStatement(state);
        break;
      case PreprocessorTokens.If.tokenTypeIdx:
        unit = ifStatement(state);
        break;
      case PreprocessorTokens.Leave.tokenTypeIdx:
        unit = leaveStatement(state);
        break;
      case PreprocessorTokens.Iterate.tokenTypeIdx:
        unit = iterateStatement(state);
        break;
      case PreprocessorTokens.Return.tokenTypeIdx:
        unit = returnStatement(state);
        break;
      case PreprocessorTokens.Semicolon.tokenTypeIdx:
        unit = nullStatement(state);
        break;
      case PreprocessorTokens.Note.tokenTypeIdx:
        unit = noteStatement(state);
        break;
    }
  } else {
    // TODO: Handle missing preprocessor statements: NOTE, REPLACE, SELECT
    switch (state.current?.tokenTypeIdx) {
      case PreprocessorTokens.Semicolon.tokenTypeIdx:
        unit = nullStatement(state);
        break;
      case PreprocessorTokens.Activate.tokenTypeIdx:
        unit = activateStatement(state);
        break;
      case PreprocessorTokens.Deactivate.tokenTypeIdx:
        unit = deactivateStatement(state);
        break;
      case PreprocessorTokens.Declare.tokenTypeIdx:
        unit = declareStatement(state);
        break;
      case PreprocessorTokens.Page.tokenTypeIdx:
        unit = pageDirective(state);
        break;
      case PreprocessorTokens.Pop.tokenTypeIdx:
        unit = popDirective(state);
        break;
      case PreprocessorTokens.Push.tokenTypeIdx:
        unit = pushDirective(state);
        break;
      case PreprocessorTokens.Print.tokenTypeIdx:
        unit = printDirective(state);
        break;
      case PreprocessorTokens.NoPrint.tokenTypeIdx:
        unit = noprintDirective(state);
        break;
      case PreprocessorTokens.Skip.tokenTypeIdx:
        unit = skipStatement(state);
        break;
      case PreprocessorTokens.Include.tokenTypeIdx:
        unit = includeStatement(state);
        break;
      case PreprocessorTokens.Inscan.tokenTypeIdx:
        unit = inscanStatement(state);
        break;
      case PreprocessorTokens.If.tokenTypeIdx:
        unit = ifStatement(state);
        break;
      case PreprocessorTokens.Do.tokenTypeIdx:
        unit = doStatement(state);
        break;
      case PreprocessorTokens.Goto.tokenTypeIdx:
      case PreprocessorTokens.Go.tokenTypeIdx:
        unit = goToStatement(state);
        break;
      case PreprocessorTokens.Leave.tokenTypeIdx:
        unit = leaveStatement(state);
        break;
      case PreprocessorTokens.Iterate.tokenTypeIdx:
        unit = iterateStatement(state);
        break;
      case PreprocessorTokens.Procedure.tokenTypeIdx:
        try {
          state.pushProcedure();
          unit = procedureStatement(state);
        } finally {
          state.popProcedure();
        }
        break;
      case PreprocessorTokens.Return.tokenTypeIdx:
        unit = returnStatement(state);
        break;
      case PreprocessorTokens.Note.tokenTypeIdx:
        unit = noteStatement(state);
        break;
    }
  }

  if (unit === undefined) {
    const currentToken = state.current || state.last;
    throw new PreprocessorDiagnostic({
      message: "Unexpected token '" + currentToken?.image + "'.",
      token: currentToken,
      severity: Severity.S,
    });
  }
  // TODO: We can move this into validation!
  // if (labels.length === 0 && unit?.kind === ast.SyntaxKind.ProcedureStatement) {
  //   throw new PreprocessorError(
  //     "Procedure must have a label.",
  //     state.current!,
  //     state.uri.toString(),
  //   );
  // }
  statement.value = unit;
  return statement;
}

function procedureStatement(
  state: PreprocessorParserState,
): ast.ProcedureStatement {
  const statement = ast.createProcedureStatement();
  state.consume(
    statement,
    CstNodeKind.ProcedureStatement_PROCEDURE,
    PreprocessorTokens.Procedure,
  );
  if (
    state.tryConsume(
      statement,
      CstNodeKind.ProcedureStatement_OpenParenParams,
      PreprocessorTokens.LParen,
    )
  ) {
    if (state.canConsume(PreprocessorTokens.Id)) {
      do {
        const parameter = ast.createProcedureParameter();
        const nameToken = state.consume(
          parameter,
          CstNodeKind.ProcedureParameter_Id,
          PreprocessorTokens.Id,
        );
        parameter.ref = ast.createReference(parameter, nameToken);
        statement.parameters.push(parameter);
      } while (
        state.tryConsume(
          statement,
          CstNodeKind.ProcedureStatement_Comma,
          PreprocessorTokens.Comma,
        )
      );
    }
    state.consume(
      statement,
      CstNodeKind.ProcedureStatement_CloseParenParams,
      PreprocessorTokens.RParen,
    );
  }
  statement.statement = state.tryConsume(
    statement,
    CstNodeKind.ProcedureStatement_STATEMENT,
    PreprocessorTokens.Statement,
  );
  const returnsOption = ast.createReturnsOption();
  if (
    state.tryConsume(
      returnsOption,
      CstNodeKind.ReturnsOption_RETURNS,
      PreprocessorTokens.Returns,
    )
  ) {
    state.consume(
      returnsOption,
      CstNodeKind.ReturnsOption_OpenParen,
      PreprocessorTokens.LParen,
    );
    let returnType: string | undefined = undefined;
    const dataAttribute = ast.createComputationDataAttribute();
    if (
      state.tryConsume(
        dataAttribute,
        CstNodeKind.DefaultAttribute_Value,
        PreprocessorTokens.Character,
      )
    ) {
      returnType = "CHARACTER";
    } else if (
      state.tryConsume(
        dataAttribute,
        CstNodeKind.DefaultAttribute_Value,
        PreprocessorTokens.Fixed,
      )
    ) {
      returnType = "FIXED";
    }
    if (returnType) {
      dataAttribute.type = returnType as ast.DefaultAttribute;
      returnsOption.returnAttributes.push(dataAttribute);
    }
    state.consume(
      returnsOption,
      CstNodeKind.ReturnsOption_CloseParen,
      PreprocessorTokens.RParen,
    );
    statement.options.push(returnsOption);
  }
  state.consume(
    statement,
    CstNodeKind.ProcedureStatement_Semicolon0,
    PreprocessorTokens.Semicolon,
  );
  const body = statements(state);
  statement.statements = body;
  // Manually consume the percentage sign before the end
  state.consume(
    statement,
    CstNodeKind.Percentage,
    PreprocessorTokens.Percentage,
  );
  state.consume(
    statement,
    CstNodeKind.ProcedureStatement_PROCEDURE_END,
    PreprocessorTokens.End,
  );
  state.consume(
    statement,
    CstNodeKind.ProcedureStatement_Semicolon1,
    PreprocessorTokens.Semicolon,
  );
  return statement;
}

function returnStatement(state: PreprocessorParserState): ast.ReturnStatement {
  const statement = ast.createReturnStatement();
  state.consume(
    statement,
    CstNodeKind.ReturnStatement_RETURN,
    PreprocessorTokens.Return,
  );
  state.consume(
    statement,
    CstNodeKind.ReturnStatement_OpenParen,
    PreprocessorTokens.LParen,
  );
  statement.expression = expression(state);
  state.consume(
    statement,
    CstNodeKind.ReturnStatement_CloseParen,
    PreprocessorTokens.RParen,
  );
  state.consume(
    statement,
    CstNodeKind.ReturnStatement_Semicolon,
    PreprocessorTokens.Semicolon,
  );
  return statement;
}

function iterateStatement(
  state: PreprocessorParserState,
): ast.IterateStatement {
  const statement = ast.createIterateStatement();
  state.consume(
    statement,
    CstNodeKind.IterateStatement_ITERATE,
    PreprocessorTokens.Iterate,
  );
  if (state.canConsume(PreprocessorTokens.Id)) {
    statement.label = labelReference(state);
  }
  state.consume(
    statement,
    CstNodeKind.IterateStatement_Semicolon,
    PreprocessorTokens.Semicolon,
  );
  return statement;
}

function leaveStatement(state: PreprocessorParserState): ast.LeaveStatement {
  const statement = ast.createLeaveStatement();
  state.consume(
    statement,
    CstNodeKind.LeaveStatement_LEAVE,
    PreprocessorTokens.Leave,
  );
  if (state.canConsume(PreprocessorTokens.Id)) {
    statement.label = labelReference(state);
  }
  state.consume(
    statement,
    CstNodeKind.LeaveStatement_Semicolon,
    PreprocessorTokens.Semicolon,
  );
  return statement;
}

function goToStatement(state: PreprocessorParserState): ast.GoToStatement {
  const statement = ast.createGoToStatement();
  // First, attempt to consume the GOTO keyword
  if (
    !state.tryConsume(
      statement,
      CstNodeKind.GoToStatement_GOTO,
      PreprocessorTokens.Goto,
    )
  ) {
    // Otherwise, consume the GO and TO keywords
    state.consume(
      statement,
      CstNodeKind.GoToStatement_GO,
      PreprocessorTokens.Go,
    );
    state.consume(
      statement,
      CstNodeKind.GoToStatement_TO,
      PreprocessorTokens.To,
    );
  }
  statement.label = labelReference(state);
  state.consume(
    statement,
    CstNodeKind.GoToStatement_Semicolon,
    PreprocessorTokens.Semicolon,
  );
  return statement;
}

function labelReference(state: PreprocessorParserState): ast.LabelReference {
  const reference = ast.createLabelReference();
  const label = state.consume(
    reference,
    CstNodeKind.LabelReference_LabelRef,
    PreprocessorTokens.Id,
  );
  reference.label = ast.createReference(reference, label, true);
  return reference;
}

function includeStatement(
  state: PreprocessorParserState,
): ast.IncludeDirective {
  const directive = ast.createIncludeDirective();
  const token = state.consume(
    directive,
    CstNodeKind.IncludeDirective_INCLUDE,
    PreprocessorTokens.Include,
  );
  directive.token = token;
  directive.idempotent = isXInstruction(token);
  while (true) {
    const item = ast.createIncludeItem();
    if (state.canConsume(PreprocessorTokens.Id)) {
      // member include
      const token = state.consume(
        item,
        CstNodeKind.IncludeItem_FileID,
        PreprocessorTokens.Id,
      );
      const fileName = token.image;
      item.fileName = fileName;
      item.token = token;
    } else if (state.canConsume(PreprocessorTokens.String)) {
      // literal file include (relative, absolute, or lib sourced)
      const token = state.consume(
        item,
        CstNodeKind.IncludeItem_FileString,
        PreprocessorTokens.String,
      );
      const file = token.image;
      const fileName = file.substring(1, file.length - 1);
      item.fileName = fileName;
      item.string = true;
      item.token = token;
    } else {
      break;
    }
    directive.items.push(item);
    // Optional comma
    state.tryConsume(
      directive,
      CstNodeKind.IncludeDirective_Comma,
      PreprocessorTokens.Comma,
    );
  }
  state.consume(
    directive,
    CstNodeKind.IncludeDirective_Semicolon,
    PreprocessorTokens.Semicolon,
  );
  return directive;
}

function includeAltStatement(
  state: PreprocessorParserState,
): ast.IncludeAltDirective {
  // See https://www.ibm.com/docs/en/pli-for-aix/3.1.0?topic=preprocessors-include-preprocessor
  const directive = ast.createIncludeAltDirective();
  state.consume(
    directive,
    CstNodeKind.IncludeAltDirective_INCLUDE_ALT,
    PreprocessorTokens.IncludeAlt,
  );
  const item = ast.createIncludeItem();
  const token = state.consume(
    item,
    CstNodeKind.IncludeItem_FileID,
    PreprocessorTokens.Id,
  );
  const fileName = token.image;
  item.fileName = fileName;
  item.token = token;
  directive.items.push(item);
  // Spec says the semicolon is optional
  state.tryConsume(
    directive,
    CstNodeKind.IncludeAltDirective_Semicolon,
    PreprocessorTokens.Semicolon,
  );
  return directive;
}

function inscanStatement(state: PreprocessorParserState): ast.InscanDirective {
  const directive = ast.createInscanDirective();
  const token = state.consume(
    directive,
    CstNodeKind.InscanDirective_INSCAN,
    PreprocessorTokens.Inscan,
  );
  directive.token = token;
  directive.item = parseReferenceItem(state, true);
  directive.idempotent = isXInstruction(token);
  state.consume(
    directive,
    CstNodeKind.InscanDirective_Semicolon,
    PreprocessorTokens.Semicolon,
  );
  return directive;
}

function endStatement(state: PreprocessorParserState): ast.EndStatement {
  const statement = ast.createEndStatement();

  state.consumeKeyword(
    statement,
    CstNodeKind.EndStatement_END,
    PreprocessorTokens.End,
  );

  return statement;
}

function doStatement(state: PreprocessorParserState): ast.DoStatement {
  const statement = ast.createDoStatement();
  state.consume(statement, CstNodeKind.DoStatement_DO, PreprocessorTokens.Do);

  if (state.canConsume(PreprocessorTokens.Skip)) {
    // skip command
    state.consume(
      statement,
      CstNodeKind.DoStatement_SKIP,
      PreprocessorTokens.Skip,
    );
    state.consume(
      statement,
      CstNodeKind.DoStatement_Semicolon0,
      PreprocessorTokens.Semicolon,
    );
    statements(state);
    statement.skip = true;
    statement.end = endStatement(state);
    state.consume(
      statement,
      CstNodeKind.DoStatement_Semicolon1,
      PreprocessorTokens.Semicolon,
    );
    return statement;
  } else if (state.canConsume(PreprocessorTokens.While)) {
    //type-2-do-while-first
    const type2 = doWhile(state);
    state.consume(
      statement,
      CstNodeKind.DoStatement_Semicolon0,
      PreprocessorTokens.Semicolon,
    );
    const body = statements(state);
    statement.doType2 = type2;
    statement.statements = body;
    statement.end = endStatement(state);
    state.consume(
      statement,
      CstNodeKind.DoStatement_Semicolon1,
      PreprocessorTokens.Semicolon,
    );
    return statement;
  } else if (state.canConsume(PreprocessorTokens.Until)) {
    //type-2-do-until-first
    const type2 = doUntil(state);
    state.consume(
      statement,
      CstNodeKind.DoStatement_Semicolon0,
      PreprocessorTokens.Semicolon,
    );
    const body = statements(state);
    statement.doType2 = type2;
    statement.statements = body;
    statement.end = endStatement(state);
    state.consume(
      statement,
      CstNodeKind.DoStatement_Semicolon1,
      PreprocessorTokens.Semicolon,
    );
    return statement;
  } else if (
    state.tryConsume(
      statement,
      CstNodeKind.DoStatement_LOOP,
      PreprocessorTokens.Loop,
    )
  ) {
    //type-4 loops
    statement.doType4 = true;
    state.consume(
      statement,
      CstNodeKind.DoStatement_Semicolon0,
      PreprocessorTokens.Semicolon,
    );
    const body = statements(state);
    statement.statements = body;
    statement.end = endStatement(state);
    state.consume(
      statement,
      CstNodeKind.DoStatement_Semicolon1,
      PreprocessorTokens.Semicolon,
    );
    return statement;
  } else if (state.canConsume(PreprocessorTokens.Id)) {
    // type-3-do
    const type3 = doType3(state);
    state.consume(
      statement,
      CstNodeKind.DoStatement_Semicolon0,
      PreprocessorTokens.Semicolon,
    );
    const body = statements(state);
    statement.doType3 = type3;
    statement.statements = body;
    statement.end = endStatement(state);
    state.consume(
      statement,
      CstNodeKind.DoStatement_Semicolon1,
      PreprocessorTokens.Semicolon,
    );
    return statement;
  } else if (
    state.tryConsume(
      statement,
      CstNodeKind.DoStatement_Semicolon0,
      PreprocessorTokens.Semicolon,
    )
  ) {
    //type-1-do
    const stmts = statements(state);
    statement.statements = stmts;
    statement.end = endStatement(state);
    state.consume(
      statement,
      CstNodeKind.DoStatement_Semicolon1,
      PreprocessorTokens.Semicolon,
    );
    return statement;
  }
  const currentToken = state.current || state.last;
  throw new PreprocessorDiagnostic({
    message: "Unexpected token '" + currentToken?.image + "'.",
    token: currentToken,
    severity: Severity.S,
  });
}

function doWhile(state: PreprocessorParserState): ast.DoWhile {
  const statement = ast.createDoWhile();
  state.consume(statement, CstNodeKind.DoWhile_WHILE, PreprocessorTokens.While);
  state.consume(
    statement,
    CstNodeKind.DoWhile_OpenParenWhile,
    PreprocessorTokens.LParen,
  );
  statement.while = expression(state);
  state.consume(
    statement,
    CstNodeKind.DoWhile_CloseParenWhile,
    PreprocessorTokens.RParen,
  );
  if (
    state.tryConsume(
      statement,
      CstNodeKind.DoWhile_UNTIL,
      PreprocessorTokens.Until,
    )
  ) {
    state.consume(
      statement,
      CstNodeKind.DoWhile_OpenParenUntil,
      PreprocessorTokens.LParen,
    );
    statement.until = expression(state);
    state.consume(
      statement,
      CstNodeKind.DoWhile_CloseParenUntil,
      PreprocessorTokens.RParen,
    );
  }
  return statement;
}

function doUntil(state: PreprocessorParserState): ast.DoUntil {
  const statement = ast.createDoUntil();
  state.consume(statement, CstNodeKind.DoUntil_UNTIL, PreprocessorTokens.Until);
  state.consume(
    statement,
    CstNodeKind.DoUntil_OpenParenUntil,
    PreprocessorTokens.LParen,
  );
  statement.until = expression(state);
  state.consume(
    statement,
    CstNodeKind.DoUntil_CloseParenUntil,
    PreprocessorTokens.RParen,
  );
  if (
    state.tryConsume(
      statement,
      CstNodeKind.DoUntil_WHILE,
      PreprocessorTokens.While,
    )
  ) {
    state.consume(
      statement,
      CstNodeKind.DoUntil_OpenParenWhile,
      PreprocessorTokens.LParen,
    );
    statement.while = expression(state);
    state.consume(
      statement,
      CstNodeKind.DoWhile_CloseParenWhile,
      PreprocessorTokens.RParen,
    );
  }
  return statement;
}

function doType3(state: PreprocessorParserState): ast.DoType3 {
  const doType3 = ast.createDoType3();
  doType3.variable = memberCall(state, true);

  // Consume the "=" token
  state.consume(doType3, CstNodeKind.DoType3_Equals, PreprocessorTokens.Eq);

  // Parse one or more DoSpecifications separated by commas using a do-while loop
  do {
    doType3.specifications.push(doSpecification(state));
  } while (
    state.tryConsume(
      doType3,
      CstNodeKind.DoType3_Comma,
      PreprocessorTokens.Comma,
    )
  );

  return doType3;
}

function doSpecification(state: PreprocessorParserState): ast.DoSpecification {
  const specification = ast.createDoSpecification();

  // Parse the initial expression
  specification.expression = expression(state);

  // Check for optional clauses
  if (
    state.tryConsume(
      specification,
      CstNodeKind.DoSpecification_TO0,
      PreprocessorTokens.To,
    )
  ) {
    specification.to = expression(state);
    // Optional BY clause after TO
    if (
      state.tryConsume(
        specification,
        CstNodeKind.DoSpecification_BY0,
        PreprocessorTokens.By,
      )
    ) {
      specification.by = expression(state);
    }
  } else if (
    state.tryConsume(
      specification,
      CstNodeKind.DoSpecification_BY1,
      PreprocessorTokens.By,
    )
  ) {
    specification.by = expression(state);
    // Optional TO clause after BY
    if (
      state.tryConsume(
        specification,
        CstNodeKind.DoSpecification_TO1,
        PreprocessorTokens.To,
      )
    ) {
      specification.to = expression(state);
    }
  } else if (
    state.tryConsume(
      specification,
      CstNodeKind.DoSpecification_UPTHRU,
      PreprocessorTokens.Upthru,
    )
  ) {
    specification.upthru = expression(state);
  } else if (
    state.tryConsume(
      specification,
      CstNodeKind.DoSpecification_DOWNTHRU,
      PreprocessorTokens.Downthru,
    )
  ) {
    specification.downthru = expression(state);
  } else if (
    state.tryConsume(
      specification,
      CstNodeKind.DoSpecification_REPEAT,
      PreprocessorTokens.Repeat,
    )
  ) {
    specification.repeat = expression(state);
  }

  // Check for optional WHILE or UNTIL clause
  if (state.canConsume(PreprocessorTokens.While)) {
    specification.whileOrUntil = doWhile(state);
  } else if (state.canConsume(PreprocessorTokens.Until)) {
    specification.whileOrUntil = doUntil(state);
  }

  return specification;
}

function statements(state: PreprocessorParserState): ast.Statement[] {
  const statements: ast.Statement[] = [];
  while (!state.eof && !state.canConsumeKeyword(PreprocessorTokens.End)) {
    if (
      state.isInProcedure() &&
      state.canConsume(PreprocessorTokens.Percentage, PreprocessorTokens.End)
    ) {
      // Even though the %END; statement is technically part of the procedure, it still has a % prefix.
      // We need special handling for it here. End statements list if we encounter it.
      break;
    }
    const stmt = statement(state);
    statements.push(stmt);
  }
  return statements;
}

function nullStatement(state: PreprocessorParserState): ast.NullStatement {
  const statement = ast.createNullStatement();
  state.consume(
    statement,
    CstNodeKind.NullStatement_Semicolon,
    PreprocessorTokens.Semicolon,
  );
  return statement;
}

function ifStatement(state: PreprocessorParserState): ast.IfStatement {
  const ifStatement = ast.createIfStatement();
  state.consume(ifStatement, CstNodeKind.IfStatement_IF, PreprocessorTokens.If);
  ifStatement.expression = expression(state);
  state.consumeKeyword(
    ifStatement,
    CstNodeKind.IfStatement_THEN,
    PreprocessorTokens.Then,
  );
  ifStatement.unitRange = {
    start: state.current!.startOffset,
    end: NaN,
  };
  ifStatement.unit = statement(state);
  ifStatement.unitRange.end = state.last!.endOffset + 1;
  if (state.canConsumeKeyword(PreprocessorTokens.Else)) {
    state.consumeKeyword(
      ifStatement,
      CstNodeKind.IfStatement_ELSE,
      PreprocessorTokens.Else,
    );
    ifStatement.elseRange = {
      start: state.current!.startOffset,
      end: NaN,
    };
    ifStatement.else = statement(state);
    ifStatement.elseRange.end = state.last!.endOffset + 1;
  }
  return ifStatement;
}

function deactivateStatement(
  state: PreprocessorParserState,
): ast.DeactivateStatement {
  const statement = ast.createDeactivateStatement();
  state.consume(
    statement,
    CstNodeKind.DeactivateStatement_DEACTIVATE,
    PreprocessorTokens.Deactivate,
  );
  statement.references.push(parseReferenceItem(state, false));
  while (
    state.tryConsume(
      statement,
      CstNodeKind.DeactivateStatement_Comma,
      PreprocessorTokens.Comma,
    )
  ) {
    statement.references.push(parseReferenceItem(state, false));
  }
  state.consume(
    statement,
    CstNodeKind.DeactivateStatement_Semicolon,
    PreprocessorTokens.Semicolon,
  );
  return statement;
}

function activateStatement(
  state: PreprocessorParserState,
): ast.ActivateStatement {
  const statement = ast.createActivateStatement();
  state.consume(
    statement,
    CstNodeKind.ActivateStatement_ACTIVATE,
    PreprocessorTokens.Activate,
  );
  statement.items.push(parseActivateItem(state));
  while (
    state.tryConsume(
      statement,
      CstNodeKind.ActivateStatement_Comma,
      PreprocessorTokens.Comma,
    )
  ) {
    statement.items.push(parseActivateItem(state));
  }
  state.consume(
    statement,
    CstNodeKind.ActivateStatement_Semicolon,
    PreprocessorTokens.Semicolon,
  );
  return statement;
}

function parseActivateItem(state: PreprocessorParserState): ast.ActivateItem {
  const item = ast.createActivateItem();
  item.reference = parseReferenceItem(state, false);
  item.scanMode = tryScanMode(state);
  return item;
}

function parseReferenceItem(
  state: PreprocessorParserState,
  withDimensions: boolean,
): ast.ReferenceItem {
  const reference = ast.createReferenceItem();
  const variable = state.consume(
    reference,
    CstNodeKind.ReferenceItem_Ref,
    PreprocessorTokens.Id,
  );
  reference.ref = ast.createReference(reference, variable, true);
  variable.kind = CstNodeKind.ReferenceItem_Ref;
  variable.element = reference;
  if (withDimensions && state.canConsume(PreprocessorTokens.LParen)) {
    reference.dimensions = dimensions(state);
  }
  return reference;
}

function tryScanMode(state: PreprocessorParserState): ast.ScanMode | null {
  let scanMode: ast.ScanMode | null = null;
  switch (state.current!.tokenTypeIdx) {
    case PreprocessorTokens.Scan.tokenTypeIdx:
    case PreprocessorTokens.Norescan.tokenTypeIdx:
      scanMode = "SCAN";
      state.index++;
      break;
    case PreprocessorTokens.Rescan.tokenTypeIdx:
      scanMode = "RESCAN";
      state.index++;
      break;
    case PreprocessorTokens.Noscan.tokenTypeIdx:
      scanMode = "NOSCAN";
      state.index++;
      break;
  }
  return scanMode;
}

function skipStatement(state: PreprocessorParserState): ast.SkipDirective {
  const statement = ast.createSkipDirective();
  state.consume(
    statement,
    CstNodeKind.SkipDirective_SKIP,
    PreprocessorTokens.Skip,
  );
  let lineCount: number = 1;
  if (
    state.tryConsume(
      statement,
      CstNodeKind.SkipDirective_OpenParen,
      PreprocessorTokens.LParen,
    )
  ) {
    state.consume(
      statement,
      CstNodeKind.NumberLiteral_ValueNumber,
      PreprocessorTokens.Number,
    );
    lineCount = parseInt(state.last!.image, 10);
    statement.lineCount = lineCount;
    state.consume(
      statement,
      CstNodeKind.SkipDirective_CloseParen,
      PreprocessorTokens.RParen,
    );
  }
  state.consume(
    statement,
    CstNodeKind.SkipDirective_Semicolon,
    PreprocessorTokens.Semicolon,
  );
  state.advanceLines(lineCount);
  return statement;
}

function popDirective(state: PreprocessorParserState): ast.PopDirective {
  const directive = ast.createPopDirective();
  state.consume(
    directive,
    CstNodeKind.PopDirective_POP,
    PreprocessorTokens.Pop,
  );
  state.consume(
    directive,
    CstNodeKind.PopDirective_Semicolon,
    PreprocessorTokens.Semicolon,
  );
  return directive;
}

function pushDirective(state: PreprocessorParserState): ast.PushDirective {
  const directive = ast.createPushDirective();
  state.consume(
    directive,
    CstNodeKind.PushDirective_PUSH,
    PreprocessorTokens.Push,
  );
  state.consume(
    directive,
    CstNodeKind.PushDirective_Semicolon,
    PreprocessorTokens.Semicolon,
  );
  return directive;
}

function pageDirective(state: PreprocessorParserState): ast.PageDirective {
  const directive = ast.createPageDirective();
  state.consume(
    directive,
    CstNodeKind.PageDirective_PAGE,
    PreprocessorTokens.Page,
  );
  state.consume(
    directive,
    CstNodeKind.PageDirective_Semicolon,
    PreprocessorTokens.Semicolon,
  );
  return directive;
}

function printDirective(state: PreprocessorParserState): ast.PrintDirective {
  const directive = ast.createPrintDirective();
  state.consume(
    directive,
    CstNodeKind.PrintDirective_PRINT,
    PreprocessorTokens.Print,
  );
  state.consume(
    directive,
    CstNodeKind.PrintDirective_Semicolon,
    PreprocessorTokens.Semicolon,
  );
  return directive;
}

function noprintDirective(
  state: PreprocessorParserState,
): ast.NoPrintDirective {
  const directive = ast.createNoPrintDirective();
  state.consume(
    directive,
    CstNodeKind.NoPrintDirective_NOPRINT,
    PreprocessorTokens.NoPrint,
  );
  state.consume(
    directive,
    CstNodeKind.NoPrintDirective_Semicolon,
    PreprocessorTokens.Semicolon,
  );
  return directive;
}

function assignmentStatement(
  state: PreprocessorParserState,
): ast.AssignmentStatement {
  const assignment = ast.createAssignmentStatement();
  assignment.refs.push(locatorCall(state, true));
  // TODO: add support for more assignment operators (+=, -=, etc)
  state.consume(
    assignment,
    CstNodeKind.AssignmentStatement_Operator,
    PreprocessorTokens.Eq,
  );
  assignment.operator = "=";
  const right = expression(state);
  assignment.expression = right;
  state.consume(
    assignment,
    CstNodeKind.AssignmentStatement_Semicolon,
    PreprocessorTokens.Semicolon,
  );
  return assignment;
}

function locatorCall(
  state: PreprocessorParserState,
  withDimensions: boolean,
): ast.LocatorCall {
  const locatorCall = ast.createLocatorCall();
  locatorCall.element = memberCall(state, withDimensions);
  return locatorCall;
}

function memberCall(
  state: PreprocessorParserState,
  withDimensions: boolean,
): ast.MemberCall {
  const memberCall = ast.createMemberCall();
  memberCall.element = parseReferenceItem(state, withDimensions);
  return memberCall;
}

function noteStatement(state: PreprocessorParserState): ast.NoteDirective {
  const note = ast.createNoteDirective();
  const noteToken = state.consume(
    note,
    CstNodeKind.NoteDirective_PercentNOTE,
    PreprocessorTokens.Note,
  );
  note.noteToken = noteToken || null; // noteToken could be synthetic
  state.consume(
    note,
    CstNodeKind.NoteDirective_OpenParen,
    PreprocessorTokens.LParen,
  );
  note.message = expression(state);
  if (
    state.tryConsume(
      note,
      CstNodeKind.NoteDirective_Comma,
      PreprocessorTokens.Comma,
    )
  ) {
    note.code = expression(state);
  }
  state.consume(
    note,
    CstNodeKind.NoteDirective_CloseParen,
    PreprocessorTokens.RParen,
  );
  state.consume(
    note,
    CstNodeKind.NoteDirective_Semicolon,
    PreprocessorTokens.Semicolon,
  );
  return note;
}

function declareStatement(
  state: PreprocessorParserState,
): ast.DeclareStatement {
  const statement = ast.createDeclareStatement();
  // Only one declared item is allowed in a preprocessor declare statement
  const declaredItem = ast.createDeclaredItem();
  statement.items.push(declaredItem);
  state.consume(
    statement,
    CstNodeKind.DeclareStatement_DECLARE,
    PreprocessorTokens.Declare,
  );
  do {
    if (
      state.tryConsume(
        declaredItem,
        CstNodeKind.DeclaredItem_OpenParen,
        PreprocessorTokens.LParen,
      )
    ) {
      do {
        declaredItem.elements.push(declaredVariable(state));
      } while (
        state.tryConsume(
          declaredItem,
          CstNodeKind.DeclaredItem_Comma,
          PreprocessorTokens.Comma,
        )
      );
      state.consume(
        declaredItem,
        CstNodeKind.DeclaredItem_CloseParen,
        PreprocessorTokens.RParen,
      );
    } else {
      declaredItem.elements.push(declaredVariable(state));
    }
    const attrs = attributes(state);
    declaredItem.attributes = attrs;
  } while (
    state.tryConsume(
      statement,
      CstNodeKind.DeclareStatement_Comma,
      PreprocessorTokens.Comma,
    )
  );
  state.consume(
    statement,
    CstNodeKind.DeclareStatement_Semicolon,
    PreprocessorTokens.Semicolon,
  );
  return statement;
}

function declaredVariable(
  state: PreprocessorParserState,
): ast.DeclaredVariable {
  const declaredVariable = ast.createDeclaredVariable();
  const variable = state.consume(
    declaredVariable,
    CstNodeKind.DeclaredVariable_Name,
    PreprocessorTokens.Id,
  );
  const name = variable.image;
  declaredVariable.name = name;
  declaredVariable.nameToken = variable;
  return declaredVariable;
}

function dimensions(state: PreprocessorParserState): ast.Dimensions {
  const dimensions = ast.createDimensions();
  state.consume(
    dimensions,
    CstNodeKind.Dimensions_OpenParen,
    PreprocessorTokens.LParen,
  );
  if (
    state.tryConsume(
      dimensions,
      CstNodeKind.Dimensions_CloseParen,
      PreprocessorTokens.RParen,
    )
  ) {
    // Return early if we found a close parenthesis immediately after open
    return dimensions;
  }
  dimensions.dimensions.push(parseBound(state));
  while (
    state.tryConsume(
      dimensions,
      CstNodeKind.Dimensions_Comma,
      PreprocessorTokens.Comma,
    )
  ) {
    dimensions.dimensions.push(parseBound(state));
  }
  state.consume(
    dimensions,
    CstNodeKind.Dimensions_CloseParen,
    PreprocessorTokens.RParen,
  );
  return dimensions;
}

function parseBound(state: PreprocessorParserState): ast.DimensionBound {
  const bound = ast.createDimensionBound();
  const leftBound = ast.createBound();
  const left = parseExpressionWildcard(
    leftBound,
    CstNodeKind.Bound_Star,
    state,
  );
  leftBound.expression = left;
  if (
    state.tryConsume(
      bound,
      CstNodeKind.DimensionBound_Colon,
      PreprocessorTokens.Colon,
    )
  ) {
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
  state: PreprocessorParserState,
): ast.Wildcard<ast.Expression> {
  if (state.tryConsume(element, kind, PreprocessorTokens.Multiply)) {
    return "*";
  } else {
    return expression(state);
  }
}

function attributes(
  state: PreprocessorParserState,
): ast.DeclarationAttribute[] {
  const attributes: ast.DeclarationAttribute[] = [];
  while (!state.eof) {
    if (state.canConsume(PreprocessorTokens.DefaultAttribute)) {
      const dataAttribute = ast.createComputationDataAttribute();
      const attributeToken = state.consume(
        dataAttribute,
        CstNodeKind.DefaultAttribute_Value,
        PreprocessorTokens.DefaultAttribute,
      );
      dataAttribute.type = attributeToken.image as ast.DefaultAttribute;
      attributes.push(dataAttribute);
    } else if (state.canConsume(PreprocessorTokens.LParen)) {
      const dim = dimensions(state);
      const dimensionAttribute = ast.createDimensionsDataAttribute();
      dimensionAttribute.dimensions = dim;
      attributes.push(dimensionAttribute);
    } else {
      break;
    }
  }
  return attributes;
}

function expression(state: PreprocessorParserState): ast.Expression {
  return parseBinary(state);
}

function parseBinary(state: PreprocessorParserState): ast.Expression {
  const infixOperatorItem: IntermediateBinaryExpression = {
    infix: true,
    items: [],
    operators: [],
  };
  infixOperatorItem.items.push(primary(state));
  while (true) {
    const operatorTokenType = PreprocessorBinaryTokens.find((tokenType) =>
      state.canConsume(tokenType),
    );

    if (!operatorTokenType) {
      break;
    }

    const operator = state.consume(
      infixOperatorItem as any,
      CstNodeKind.BinaryExpression_Operator,
      operatorTokenType,
    );

    const item = primary(state);
    infixOperatorItem.items.push(item);
    infixOperatorItem.operators.push(operator);
  }
  return constructBinaryExpression(infixOperatorItem);
}

function primary(state: PreprocessorParserState): ast.Expression {
  if (state.canConsume(PreprocessorTokens.Number)) {
    return numberLiteral(state);
  } else if (state.canConsume(PreprocessorTokens.String)) {
    return stringLiteral(state);
  } else if (state.canConsume(PreprocessorTokens.Id)) {
    return locatorCall(state, true);
  } else if (state.canConsume(PreprocessorTokens.LParen)) {
    state.consume(
      undefined,
      CstNodeKind.ParenthesizedExpression_OpenParen,
      PreprocessorTokens.LParen,
    );
    const expr = expression(state);
    state.consume(
      undefined,
      CstNodeKind.ParenthesizedExpression_CloseParen,
      PreprocessorTokens.RParen,
    );
    return expr;
  }
  const token = state.current || state.last;
  throw new PreprocessorDiagnostic({
    message: "Cannot handle this type of preprocessor expression yet!",
    token: token,
    severity: Severity.S,
  });
}

function numberLiteral(state: PreprocessorParserState): ast.Literal {
  const literal = ast.createLiteral();
  const numberLiteral = ast.createNumberLiteral();
  literal.value = numberLiteral;
  const number = state.consume(
    numberLiteral,
    CstNodeKind.NumberLiteral_ValueNumber,
    PreprocessorTokens.Number,
  );
  numberLiteral.value = number.image;
  return literal;
}

function stringLiteral(state: PreprocessorParserState): ast.Literal {
  const literal = ast.createLiteral();
  const stringLiteral = ast.createStringLiteral();
  literal.value = stringLiteral;
  const stringToken = state.consume(
    stringLiteral,
    CstNodeKind.StringLiteral_ValueString,
    PreprocessorTokens.String,
  );
  const content = unpackCharacterValue(stringToken.image);
  stringLiteral.value = content;
  return literal;
}

function unpackCharacterValue(literal: string): string {
  return literal.substring(1, literal.length - 1);
}

function isXInstruction(token: Token): boolean {
  return token.image.toUpperCase().startsWith("X");
}
