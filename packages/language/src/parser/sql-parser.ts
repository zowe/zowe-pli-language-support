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
import { embeddedUnknownStatement } from "./unknown-parser";
import { tokenToRange } from "../language-server/types";

export function sqlExecStatement(state: ParserState): ast.SqlExecStatement {
  const execStatement = ast.createSqlExecStatement();
  state.consume(execStatement, CstNodeKind.ExecSqlStatement_EXEC, t.EXEC);
  state.consume(execStatement, CstNodeKind.ExecSqlStatement_SQL, t.SQL);
  if (state.canConsume(t.INCLUDE)) {
    execStatement.content = parseSqlIncludeStatement(state);
  } else {
    // Use unknown SQL statement for now - we will get to more of the SQL spec later.
    execStatement.content = embeddedUnknownStatement(
      state,
      CstNodeKind.EmbeddedUnknownStatement_Token,
    );
  }
  state.consume(
    execStatement,
    CstNodeKind.ExecSqlStatement_Semicolon,
    t.Semicolon,
  );
  return execStatement;
}

function parseSqlIncludeStatement(state: ParserState): ast.IncludeDirective {
  const includeDirective = ast.createIncludeDirective();
  state.consume(
    includeDirective,
    CstNodeKind.IncludeDirective_INCLUDE,
    t.INCLUDE,
  );
  const item = ast.createIncludeItemFile();
  item.sql = true;
  includeDirective.items.push(item);
  const token = state.consume(item, CstNodeKind.IncludeItem_MemberID, t.ID);
  if (token) {
    item.token = token;
    item.fileName = token.image;
    item.range = tokenToRange(token);
  }
  return includeDirective;
}
