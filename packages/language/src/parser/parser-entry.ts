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
import { recursivelySetContainer } from "../linking/symbol-table";
import { Diagnostic } from "../language-server/types";
import { consumeTokenStatement } from "./preprocessor-parser";

export type PreprocessorParserResult = {
  statements: ast.Statement[];
  diagnostics: Diagnostic[];
};

/**
 * Statement parser handler function type.
 *
 * Each preprocessor phase composes its own ordered list of these and hands it to
 * {@link preprocessorParse}, so this module only owns the generic parse loop while the
 * phases own the building blocks they recognize.
 *
 * Returns:
 * - ast.Statement: Successfully parsed a statement
 * - null: Failed to parse (error condition)
 * - undefined: This handler doesn't recognize this token (pass to next handler)
 */
export type StatementParser = (
  state: ParserState,
) => Promise<ast.Statement | null | undefined>;

/**
 * Parse a token stream into preprocessor statements using an explicit, ordered list
 * of statement handlers.
 *
 * Each preprocessor phase composes its own handler list.
 * Falls back to a plain token statement when none of them recognize the current token.
 * Tokens that are not consumed by any handler simply pass through to the next phase.
 */
export async function preprocessorParse(
  state: ParserState,
  handlers: StatementParser[],
): Promise<PreprocessorParserResult> {
  const statements: ast.Statement[] = [];

  const statementParser: StatementParser = async (state) => {
    for (const handler of handlers) {
      const result = await handler(state);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  };

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

    state.skipRecovery();
    token = state.token;
    index = state.index;
  }

  return {
    statements,
    diagnostics: state.diagnostics,
  };
}
