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

export type PreprocessorParserResult = {
  statements: ast.Statement[];
  diagnostics: Diagnostic[];
  tokens: t.Token[];
};

export function preprocessorParse(
  state: ParserState,
): PreprocessorParserResult {
  const statements: ast.Statement[] = [];

  let index = state.index;
  let token = state.token;
  while (token) {
    let stmt: ast.Statement | null = null;
    let isTokenStatement = true;
    switch (token.tokenTypeIdx) {
      case t.Percent.tokenTypeIdx:
        isTokenStatement = false;
        // Parse a preprocessor statement
        stmt = statement(state);
        break;
      case t.INCLUDE_ALT.tokenTypeIdx:
        isTokenStatement = false;
        // Parse the "include-alt" statement
        // This is the only preprocessor statement that does not start with a percentage token
        const includeAlt = includeAltStatement(state);
        const includeAltStmt = ast.createStatement();
        includeAltStmt.value = includeAlt;
        stmt = includeAltStmt;
        break;
      case t.SQL.tokenTypeIdx:
        if (isSqlAttributeStatement(state)) {
          isTokenStatement = false;
          const sqlAttrStmt = sqlAttributeStatement(state);
          const sqlAttrStatement = ast.createStatement();
          sqlAttrStatement.value = sqlAttrStmt;
          stmt = sqlAttrStatement;
        }
        break;
      case t.DFHRESP.tokenTypeIdx:
        if (isCicsResponseStatement(state)) {
          isTokenStatement = false;
          const cicsRespStmt = cicsResponseStatement(state);
          const cicsRespStatement = ast.createStatement();
          cicsRespStatement.value = cicsRespStmt;
          stmt = cicsRespStatement;
        }
        break;
      case t.EXEC.tokenTypeIdx:
        if (isCicsExecStatement(state)) {
          // Do not really parse the CICS EXEC statement yet
          // Just create a placeholder AST node for now
          isTokenStatement = true;
          const cicsExecStatement = ast.createCicsExecStatement();
          const stmtWrapper = ast.createStatement();
          stmtWrapper.value = cicsExecStatement;
          statements.push(stmtWrapper);
        }
    }
    if (isTokenStatement) {
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
