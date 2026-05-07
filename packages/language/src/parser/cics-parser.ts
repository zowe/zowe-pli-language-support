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

export async function cicsExecStatement(state: ParserState): Promise<ast.CicsExecStatement> {
  const execStatement = ast.createCicsExecStatement();
  const firstToken = state.consume(execStatement, CstNodeKind.ExecCicsStatement_EXEC, t.EXEC);
  state.consume(execStatement, CstNodeKind.ExecCicsStatement_CICS, t.CICS);

  const unknownStatement = ast.createEmbeddedUnknownStatement();
  execStatement.content = unknownStatement;
  const startOffset = state.token?.startOffset ?? 0;
  while (!state.eof && !state.canConsume(t.Semicolon) && state.token) {
    const token = state.token;
    token.element = unknownStatement;
    token.kind = CstNodeKind.ExecCicsStatement_COMMAND;
    state.index++;
  }
  const endOffset = state.last ? state.last.endOffset + 1 : startOffset;
  const statementText = state.textDocument.getText().substring(startOffset, endOffset);

  const preprocessor = new CICSPreprocessor();
  const { diagnostics, identifiers } = await preprocessor.execute(statementText);
  for (const diagnostic of diagnostics) {
    state.error(diagnostic.message, state.token);
  }
  for (const token of identifiers) {
    if(!token.text) {
      continue;
    }
    const tokenStart = startOffset + token.start;
    const tokenEnd = startOffset + token.stop + 1;
    const tokenStartPosition = state.textDocument.positionAt(tokenStart);
    const tokenEndPosition = state.textDocument.positionAt(tokenEnd);
    const pliToken = t.createTokenInstance(
      token.text,
      token.text,
      t.ID,
      tokenStart, tokenStartPosition.line, tokenStartPosition.character,
      tokenEnd, tokenEndPosition.line, tokenEndPosition.character, 
      firstToken?.uri
    );
    pliToken.element = unknownStatement;
    unknownStatement.hostVariables.push(pliToken);
  }

  execStatement.content = unknownStatement;

  state.consume(
    execStatement,
    CstNodeKind.ExecCicsStatement_Semicolon,
    t.Semicolon,
  );
  return execStatement;
}