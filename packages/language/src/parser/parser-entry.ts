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

import { ParserState } from "./parser-state";
import * as ast from "../syntax-tree/ast";
import * as t from "./tokens";
import { recursivelySetContainer } from "../linking/symbol-table";
import { Diagnostic } from "../language-server/types";
import {
  consumeTokenStatement,
  includeAltStatement,
  statement,
} from "./preprocessor-parser";
import { isSqlAttributeStatement, sqlAttributeStatement } from "./sql-parser";
import {
  cicsResponseStatement,
  isCicsExecStatement,
  isCicsResponseStatement,
} from "./cics-parser";
import { CompilerOptions } from "../preprocessor/compiler-options/options";

export type PreprocessorParserResult = {
  statements: ast.Statement[];
  diagnostics: Diagnostic[];
  tokens: t.Token[];
};

/**
 * Statement parser handler function type.
 * Returns:
 * - ast.Statement: Successfully parsed a statement
 * - null: Failed to parse (error condition)
 * - undefined: This handler doesn't recognize this token (pass to next handler)
 */
type StatementParser = (state: ParserState) => ast.Statement | null | undefined;

function createPreprocessorHandler(): StatementParser {
  return (state) => {
    if (state.token?.tokenTypeIdx !== t.Percent.tokenTypeIdx) {
      return undefined; // Not a preprocessor statement
    }
    return statement(state);
  };
}

function createIncOnlyPreprocessorHandler(): StatementParser {
  return (state) => {
    // If it is not a preprocessor statement and also not an include alternate,
    // return undefined to let other handlers process it.
    if (
      state.token?.tokenTypeIdx !== t.Percent.tokenTypeIdx &&
      state.token?.tokenTypeIdx !== t.INCLUDE_ALT.tokenTypeIdx
    ) {
      return undefined;
    }

    const nextToken = state.peek(2);
    const isInclude =
      nextToken &&
      (nextToken.tokenTypeIdx === t.INCLUDE.tokenTypeIdx ||
        nextToken.tokenTypeIdx === t.INSCAN.tokenTypeIdx);
    if (isInclude) {
      // Only process include statements.
      return statement(state);
    }

    return undefined;
  };
}

function createIncludeAltHandler(): StatementParser {
  return (state) => {
    if (state.token?.tokenTypeIdx !== t.INCLUDE_ALT.tokenTypeIdx) {
      return undefined;
    }
    const includeAlt = includeAltStatement(state);
    const includeAltStmt = ast.createStatement();
    includeAltStmt.value = includeAlt;
    return includeAltStmt;
  };
}

function createSqlAttributeHandler(): StatementParser {
  return (state) => {
    if (state.token?.tokenTypeIdx !== t.SQL.tokenTypeIdx) {
      return undefined;
    }
    if (!isSqlAttributeStatement(state)) {
      return undefined;
    }
    const sqlAttrStmt = sqlAttributeStatement(state);
    const sqlAttrStatement = ast.createStatement();
    sqlAttrStatement.value = sqlAttrStmt;
    return sqlAttrStatement;
  };
}

function createCicsResponseHandler(): StatementParser {
  return (state) => {
    if (state.token?.tokenTypeIdx !== t.DFHRESP.tokenTypeIdx) {
      return undefined;
    }
    if (!isCicsResponseStatement(state)) {
      return undefined;
    }
    const cicsRespStmt = cicsResponseStatement(state);
    const cicsRespStatement = ast.createStatement();
    cicsRespStatement.value = cicsRespStmt;
    return cicsRespStatement;
  };
}

function createCicsExecHandler(statements: ast.Statement[]): StatementParser {
  return (state) => {
    if (state.token?.tokenTypeIdx !== t.EXEC.tokenTypeIdx) {
      return undefined;
    }
    if (!isCicsExecStatement(state)) {
      return undefined;
    }
    // Special case: CICS EXEC creates a placeholder and adds it directly
    // but we return undefined to let the token statement be created
    const cicsExecStatement = ast.createCicsExecStatement();
    const stmtWrapper = ast.createStatement();
    stmtWrapper.value = cicsExecStatement;
    statements.push(stmtWrapper);
    return undefined; // Let token statement handler process the EXEC token
  };
}

function generateStatementParser(
  compilerOptions: CompilerOptions | undefined,
  statements: ast.Statement[],
): StatementParser {
  const handlers: StatementParser[] = [];

  const incOnly = compilerOptions?.macroOptions?.incOnly;

  if (incOnly) {
    handlers.push(createIncOnlyPreprocessorHandler());
  } else {
    handlers.push(createPreprocessorHandler());
  }

  handlers.push(createIncludeAltHandler());
  handlers.push(createSqlAttributeHandler());
  handlers.push(createCicsResponseHandler());
  handlers.push(createCicsExecHandler(statements));

  return (state) => {
    for (const handler of handlers) {
      const result = handler(state);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  };
}

export function preprocessorParse(
  state: ParserState,
  compilerOptions?: CompilerOptions,
): PreprocessorParserResult {
  const statements: ast.Statement[] = [];

  const statementParser = generateStatementParser(compilerOptions, statements);

  let index = state.index;
  let token = state.token;
  while (token) {
    let stmt: ast.Statement | null = null;

    const result = statementParser(state);
    if (result !== undefined) {
      stmt = result;
    } else {
      // Otherwise construct a token statement
      stmt = consumeTokenStatement(state);
    }

    if (stmt) {
      recursivelySetContainer(stmt);
      statements.push(stmt);
    }

    if (index === state.index) {
      console.error("Parser did not advance at token: " + token.image);
      state.index++;
    }

    // Always recover after each statement
    state.skipRecovery();
    token = state.token;
    index = state.index;
  }

  return {
    statements,
    diagnostics: state.diagnostics,
    tokens: state.tokens,
  };
}
