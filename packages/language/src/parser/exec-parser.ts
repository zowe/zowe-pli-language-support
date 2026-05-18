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
import { TextDocument } from "vscode-languageserver-textdocument";

export async function execStatement(
  state: ParserState,
  textDocument: TextDocument,
): Promise<ast.ExecStatement> {
  const execStatement = ast.createExecStatement();
  state.consume(execStatement, CstNodeKind.ExecStatement_EXEC, t.EXEC);
  const cicsFragmentToken = state.consume(
    execStatement,
    CstNodeKind.ExecStatement_ExecFragment,
    t.ExecFragment,
  );
  if (!cicsFragmentToken) {
    return execStatement;
  }
  const prefixMatch = /^(\w+)\s*/i.exec(cicsFragmentToken.image);
  switch (prefixMatch?.[1].toUpperCase()) {
    case "CICS":
      execStatement.preprocessorType = ast.PreprocessorType.CICS;
      break;
    case "SQL":
      execStatement.preprocessorType = ast.PreprocessorType.SQL;
      break;
    default:
      execStatement.preprocessorType = ast.PreprocessorType.UNKNOWN;
      break;
  }
  const prefixLength = prefixMatch?.[0].length || 0;
  const startOffset = cicsFragmentToken.startOffset + prefixLength;
  const endOffset = cicsFragmentToken.endOffset + 1;
  const statementText = textDocument
    .getText()
    .substring(startOffset, endOffset);
  const preprocessor = new CICSPreprocessor();
  const { diagnostics, identifiers } =
    await preprocessor.execute(statementText);
  for (const diagnostic of diagnostics) {
    state.error(diagnostic.message, state.token);
  }
  for (const identifier of identifiers) {
    const tokenStart = startOffset + identifier.startOffset;
    const tokenEnd = startOffset + identifier.endOffset;
    const positionStart = textDocument.positionAt(tokenStart);
    const positionEnd = textDocument.positionAt(tokenEnd);
    const pliToken = t.createTokenInstance(
      identifier.name,
      identifier.name,
      t.ID,
      tokenStart,
      positionStart.line,
      positionStart.character,
      tokenEnd,
      positionEnd.line,
      positionEnd.character,
      URI.parse(textDocument.uri.toString()),
    );
    execStatement.hostVariables.push(pliToken);
  }
  state.consume(
    execStatement,
    CstNodeKind.ExecStatement_Semicolon,
    t.Semicolon,
  );
  return execStatement;
}
