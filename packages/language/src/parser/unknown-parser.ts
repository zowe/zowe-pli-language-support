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

// This file is temporary and contains a parser for unknown embedded statements
// It can be removed once we have implemented more of the SQL and CICS specs.

import * as ast from "../syntax-tree/ast";
import * as t from "./tokens";
import { CstNodeKind } from "../syntax-tree/cst";
import { ParserState } from "./parser-state";
import { tokenMatcher } from "chevrotain";

export function embeddedUnknownStatement(
  state: ParserState,
  kind: CstNodeKind,
): ast.EmbeddedUnknownStatement {
  const unknownStatement = ast.createEmbeddedUnknownStatement();

  // Don't consume the semicolon at the end of the statement.
  // It belongs to the parent statement (EXEC SQL ...;)
  while (!state.eof && !state.canConsume(t.Semicolon)) {
    const token = state.token;
    if (!token) {
      break;
    }
    if (token.tokenTypeIdx === t.Colon.tokenTypeIdx) {
      // Special handling for host variables
      // IDs with a colon prefix
      state.index++;
      const nextToken = state.token;
      if (tokenMatcher(nextToken, t.ID)) {
        // IMPORTANT: set immediateFollow to false
        // Otherwise, some token that might come later might be incorrectly merged into it
        nextToken.immediateFollow = false;
        unknownStatement.hostVariables.push(nextToken);
        state.index++;
      }
    } else {
      // All other tokens are simply consumed
      token.element = unknownStatement;
      token.kind = kind;
      // Advance manually
      state.index++;
    }
  }
  return unknownStatement;
}
