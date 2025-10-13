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

export type PreprocessorParserResult = {
  statements: ast.Statement[];
  diagnostics: Diagnostic[];
  tokens: t.Token[];
};

export function preprocessorParse(
  state: ParserState,
): PreprocessorParserResult {
  const statements: ast.Statement[] = [];
  while (!state.eof) {
    if (state.canConsume(t.Percent)) {
      // Parse a preprocessor statement
      const stmt = statement(state);
      if (stmt) {
        recursivelySetContainer(stmt);
        statements.push(stmt);
      }
    } else if (state.canConsume(t.INCLUDE_ALT)) {
      // Parse the "include-alt" statement
      // This is the only preprocessor statement that does not start with a percentage token
      const includeAlt = includeAltStatement(state);
      const stmt = ast.createStatement();
      stmt.value = includeAlt;
      recursivelySetContainer(stmt);
      statements.push(stmt);
    } else {
      // TODO: Handle other preprocessors (SQL, CICS) here!
      // state.canConsume(EXEC_SQL/DFHRESP/EXEC_CICS/...)

      // Otherwise construct a token statement
      const stmt = consumeTokenStatement(state);
      recursivelySetContainer(stmt);
      statements.push(stmt);
    }
  }
  return {
    statements,
    diagnostics: state.diagnostics,
    tokens: state.tokens,
  };
}
