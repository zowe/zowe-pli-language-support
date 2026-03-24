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

export function cicsExecStatement(state: ParserState): ast.CicsExecStatement {
  const execStatement = ast.createCicsExecStatement();
  state.consume(execStatement, CstNodeKind.ExecCicsStatement_EXEC, t.EXEC);
  state.consume(execStatement, CstNodeKind.ExecCicsStatement_CICS, t.CICS);
  // Use unknown CICS statement for now - we will get to more of the CICS spec later.
  execStatement.content = embeddedUnknownStatement(
    state,
    CstNodeKind.ExecCicsStatement_COMMAND,
  );
  state.consume(
    execStatement,
    CstNodeKind.ExecCicsStatement_Semicolon,
    t.Semicolon,
  );
  return execStatement;
}
