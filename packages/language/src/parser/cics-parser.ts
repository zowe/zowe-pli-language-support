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
import { CICSPreprocessor } from "dialect-cics";
import { URI } from "vscode-uri";

export async function cicsExecStatement(
  state: ParserState,
): Promise<ast.CicsExecStatement> {
  const execStatement = ast.createCicsExecStatement();
  state.consume(execStatement, CstNodeKind.ExecCicsStatement_EXEC, t.EXEC);
  const cicsFragmentToken = state.consume(
    execStatement,
    CstNodeKind.ExecCicsStatement_COMMAND,
    t.ExecFragment,
  );
  if (!cicsFragmentToken) {
    return execStatement;
  }
  const prefixLength =
    /^CICS\s*/i.exec(cicsFragmentToken.image)?.[0].length || 0;
  const startOffset = cicsFragmentToken.startOffset + prefixLength;
  const endOffset = cicsFragmentToken.endOffset + 1;
  const statementText = state.textDocument
    .getText()
    .substring(startOffset, endOffset);
  const preprocessor = new CICSPreprocessor();
  const { diagnostics, identifiers } =
    await preprocessor.execute(statementText);
  for (const diagnostic of diagnostics) {
    state.error(diagnostic.message, state.token);
  }
  for (const token of identifiers) {
    if (!token.text) {
      continue;
    }
    const tokenStart = startOffset + token.start;
    const tokenEnd = startOffset + token.stop;
    const positionStart = state.textDocument.positionAt(tokenStart);
    const positionEnd = state.textDocument.positionAt(tokenEnd);
    const pliToken = t.createTokenInstance(
      token.text,
      token.text,
      t.ID,
      tokenStart,
      positionStart.line,
      positionStart.character,
      tokenEnd,
      positionEnd.line,
      positionEnd.character,
      URI.parse(state.textDocument.uri.toString()),
    );
    execStatement.hostVariables.push(pliToken);
  }
  state.consume(
    execStatement,
    CstNodeKind.ExecCicsStatement_Semicolon,
    t.Semicolon,
  );
  return execStatement;
}
