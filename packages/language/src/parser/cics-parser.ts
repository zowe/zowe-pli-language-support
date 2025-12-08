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

import * as ast from "../syntax-tree/ast";
import * as t from "./tokens";
import { ParserState } from "./parser-state";
import { CstNodeKind } from "../syntax-tree/cst";

export function isCicsResponseStatement(state: ParserState): boolean {
  return state.canConsume(t.DFHRESP, t.OpenParen, t.ID, t.CloseParen);
}

export function cicsResponseStatement(
  state: ParserState,
): ast.CicsResponseStatement {
  const statement = ast.createCicsResponseStatement();
  statement.token = state.consume(
    statement,
    CstNodeKind.CicsResponseStatement_DFHRESP,
    t.DFHRESP,
  );
  state.consume(
    statement,
    CstNodeKind.CicsResponseStatement_OpenParen,
    t.OpenParen,
  );
  const codeToken = state.consume(
    statement,
    CstNodeKind.CicsResponseStatement_CicsResponseCode,
    t.CicsResponseCode,
  );
  if (codeToken) {
    statement.codeToken = codeToken;
    statement.code = t.CicsResponseCode.mapToEnumLiteral(
      codeToken.tokenTypeIdx,
    );
  } else if (state.canConsume(t.ID)) {
    // Invalid CICS response code, skip the token
    state.index++;
  }
  state.consume(
    statement,
    CstNodeKind.CicsResponseStatement_CloseParen,
    t.CloseParen,
  );
  return statement;
}
