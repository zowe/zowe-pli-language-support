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

import { SemanticTokensBuilder } from "vscode-languageserver";
import { SourceFile } from "../workspace/source-file";
import { offsetToPosition, Range } from "./types";
import { IToken } from "chevrotain";
import { TokenPayload } from "../parser/abstract-parser";
import { TextDocument } from "vscode-languageserver-textdocument";
import { isNameToken, isReferenceToken } from "../linking/tokens";
import {
  SemanticTokensLegend,
  SemanticTokenTypes,
} from "vscode-languageserver-types";

const tokenTypes = new Map<string, number>([[SemanticTokenTypes.variable, 0]]);

const tokenModifiers = new Map<string, number>([]);

export const semanticTokenLegend: SemanticTokensLegend = {
  tokenTypes: Array.from(tokenTypes.keys()),
  tokenModifiers: Array.from(tokenModifiers.keys()),
};

export function semanticTokens(
  textDocument: TextDocument,
  sourceFile: SourceFile,
  range?: Range,
): number[] {
  const semanticTokens = new SemanticTokensBuilder();
  const tokens = sourceFile.tokens;
  for (const token of tokens) {
    const type = tokenType(token);
    if (type !== undefined) {
      const position = offsetToPosition(textDocument, token.startOffset);
      semanticTokens.push(
        position.line,
        position.character,
        token.image.length,
        tokenTypes.get(type)!,
        0,
      );
    }
  }
  return semanticTokens.build().data;
}

function tokenType(token: IToken): string | undefined {
  const payload = token.payload as TokenPayload;
  if (!payload) {
    return undefined;
  }
  if (isNameToken(payload.kind) || isReferenceToken(payload.kind)) {
    return SemanticTokenTypes.variable;
  }
  return undefined;
}
