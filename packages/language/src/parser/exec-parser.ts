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
import {
  SemanticsKind,
  Preprocessor,
  Diagnostic,
  Token,
} from "preprocessor-api";
import { CICSPreprocessor } from "preprocessor-cics";
import { URI } from "vscode-uri";
import { TextDocument } from "vscode-languageserver-textdocument";
import { SemanticTokenTypes } from "../language-server/semantic-tokens";
import { Db2SqlPreprocessor } from "preprocessor-db2";

export async function execStatement(
  state: ParserState,
  textDocument: TextDocument,
): Promise<ast.ExecStatement> {
  const execStatement = ast.createExecStatement();
  state.consume(execStatement, CstNodeKind.ExecStatement_EXEC, t.EXEC);
  const fragmentToken = state.consume(
    execStatement,
    CstNodeKind.ExecStatement_ExecFragment,
    t.ExecFragment,
  );
  if (fragmentToken) {
    const { preprocessor, statementText, startOffset } = handleExecFragment(
      fragmentToken,
      textDocument,
      execStatement,
    );
    if (preprocessor) {
      const { diagnostics, tokens, replacement } =
        await preprocessor.execute(statementText);
      handleDiagnostics(diagnostics, state);
      execStatement.preprocessorTokens = handleTokens(
        tokens,
        startOffset,
        textDocument,
      );
      if (replacement) {
        if (replacement.type === "text") {
          execStatement.replacement = replacement.text;
        } else {
          const item = ast.createIncludeItemFile();
          item.sql = true;
          item.fileName = replacement.filePath;
          item.token = toPliToken(startOffset, replacement.token, textDocument);
          item.token.kind = CstNodeKind.IncludeItem_MemberID;
          item.token.element = item;
          execStatement.replacement = ast.createIncludeDirective();
          execStatement.replacement.items.push(item);
        }
      }
    }
  }
  state.consume(
    execStatement,
    CstNodeKind.ExecStatement_Semicolon,
    t.Semicolon,
  );
  return execStatement;
}

function handleTokens(
  tokens: Token[],
  startOffset: number,
  textDocument: TextDocument,
) {
  const result: ast.PreprocessorToken[] = [];
  for (const token of tokens) {
    const pliToken = toPliToken(startOffset, token, textDocument);

    let semanticType: SemanticTokenTypes = SemanticTokenTypes.modifier;
    switch (token.semanticsKind) {
      case SemanticsKind.Comment:
        semanticType = SemanticTokenTypes.comment;
        break;
      case SemanticsKind.Identifier:
        semanticType = SemanticTokenTypes.variable;
        break;
      case SemanticsKind.Keyword:
        semanticType = SemanticTokenTypes.keyword;
        break;
      case SemanticsKind.Number:
        semanticType = SemanticTokenTypes.number;
        break;
      case SemanticsKind.String:
        semanticType = SemanticTokenTypes.string;
        break;
    }

    result.push({ token: pliToken, semanticType });
  }
  return result;
}

function toPliToken(
  startOffset: number,
  token: Token,
  textDocument: TextDocument,
) {
  const tokenStart = startOffset + token.startOffset;
  const tokenEnd = startOffset + token.endOffset;
  const positionStart = textDocument.positionAt(tokenStart);
  const positionEnd = textDocument.positionAt(tokenEnd);
  const pliToken = t.createTokenInstance(
    token.image,
    token.image,
    t.ID,
    tokenStart,
    positionStart.line,
    positionStart.character,
    tokenEnd,
    positionEnd.line,
    positionEnd.character,
    URI.parse(textDocument.uri.toString()),
  );
  return pliToken;
}

function handleDiagnostics(diagnostics: Diagnostic[], state: ParserState) {
  for (const diagnostic of diagnostics) {
    state.error(diagnostic.message, state.token);
  }
}

function handleExecFragment(
  fragmentToken: t.Token,
  textDocument: TextDocument,
  execStatement: ast.ExecStatement,
) {
  const prefixMatch = /^(\w+)\s*/i.exec(fragmentToken.image);
  const prefixLength = prefixMatch?.[0].length || 0;
  const startOffset = fragmentToken.startOffset + prefixLength;
  const endOffset = fragmentToken.endOffset + 1;
  const statementText = textDocument
    .getText()
    .substring(startOffset, endOffset);
  let preprocessor: Preprocessor | undefined;
  switch (prefixMatch?.[1].toUpperCase()) {
    case "CICS":
      execStatement.preprocessorType = ast.PreprocessorType.CICS;
      preprocessor = new CICSPreprocessor();
      break;
    case "SQL":
      execStatement.preprocessorType = ast.PreprocessorType.SQL;
      preprocessor = new Db2SqlPreprocessor();
      break;
    default:
      execStatement.preprocessorType = ast.PreprocessorType.UNKNOWN;
      break;
  }
  return { preprocessor, statementText, startOffset };
}
