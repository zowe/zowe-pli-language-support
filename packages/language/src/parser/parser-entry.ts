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
import { sqlExecStatement } from "./sql-parser";
import { cicsExecStatement } from "./cics-parser";
import {
  isSqlAttributeStatement,
  sqlAttributeStatement,
} from "./sql-attribute-parser";
import {
  cicsResponseStatement,
  isCicsResponseStatement,
} from "./cics-response-parser";
import { CompilerOptions } from "../preprocessor/compiler-options/options";

export type PreprocessorParserResult = {
  statements: ast.Statement[];
  diagnostics: Diagnostic[];
};

/**
 * Statement parser handler function type.
 * Returns:
 * - ast.Statement: Successfully parsed a statement
 * - null: Failed to parse (error condition)
 * - undefined: This handler doesn't recognize this token (pass to next handler)
 */
type StatementParser = (state: ParserState) => Promise<ast.Statement | null | undefined>;

function createPreprocessorHandler(): StatementParser {
  return async (state) => {
    if (state.token?.tokenTypeIdx !== t.Percent.tokenTypeIdx) {
      return undefined; // Not a preprocessor statement
    }
    return statement(state);
  };
}

function createIncOnlyPreprocessorHandler(): StatementParser {
  return async (state) => {
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
  return async (state) => {
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
  return async (state) => {
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
  return async (state) => {
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

function createExecHandler(): StatementParser {
  return async (state) => {
    if (state.token?.tokenTypeIdx !== t.EXEC.tokenTypeIdx) {
      return undefined;
    }
    return await parseExecStatement(state);
  };
}

async function parseExecStatement(state: ParserState): Promise<ast.Statement | undefined> {
  const statement = ast.createStatement();
  if (state.canConsume(t.EXEC, t.CICS)) {
    statement.value = await cicsExecStatement(state);
  } else if (state.canConsume(t.EXEC, t.SQL)) {
    statement.value = sqlExecStatement(state);
  } else {
    // Failure; fall back to token statement
    return undefined;
  }
  return statement;
}

function generateStatementParser(
  compilerOptions: CompilerOptions | undefined,
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
  handlers.push(createExecHandler());

  return async (state) => {
    for (const handler of handlers) {
      const result = await handler(state);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  };
}

export async function preprocessorParse(
  state: ParserState,
  compilerOptions?: CompilerOptions,
): Promise<PreprocessorParserResult> {
  const statements: ast.Statement[] = [];

  const statementParser = generateStatementParser(compilerOptions);

  let index = state.index;
  let token = state.token;
  while (token) {
    let stmt: ast.Statement | null = null;

    const result = await statementParser(state);
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
  };
}
