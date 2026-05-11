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

export function sqlExecStatement(state: ParserState): ast.SqlExecStatement {
  const execStatement = ast.createSqlExecStatement();
  state.consume(execStatement, CstNodeKind.ExecSqlStatement_EXEC, t.EXEC);
  state.consume(
    execStatement,
    CstNodeKind.ExecSqlStatement_SQL,
    t.ExecFragment,
  );
  state.consume(
    execStatement,
    CstNodeKind.ExecSqlStatement_Semicolon,
    t.Semicolon,
  );
  return execStatement;
}

/* TODO maybe needed when implementing SQL again
function parseSqlIncludeStatement(state: ParserState): ast.IncludeDirective {
  const includeDirective = ast.createIncludeDirective();
  state.consume(
    includeDirective,
    CstNodeKind.IncludeDirective_INCLUDE,
    sql.INCLUDE,
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
*/
