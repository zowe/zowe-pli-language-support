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

import { TextDocument } from "vscode-languageserver-textdocument";
import { SemanticTokenModifiers, SemanticTokenTypes } from "./semantic-tokens";

export namespace SemanticTokenDecoder {
  export interface DecodedSemanticToken {
    offsetStart: number;
    offsetEnd: number;
    semanticTokenType: string;
    tokenModifiers: string[];
    text: string;
  }

  export function decode(
    tokens: number[],
    textDocument: TextDocument,
  ): DecodedSemanticToken[] {
    const decodedTokens: DecodedSemanticToken[] = [];

    let line = 0;
    let character = 0;

    for (let i = 0; i < tokens.length; i += 5) {
      line += tokens[i];
      if (tokens[i] !== 0) {
        character = 0;
      }
      character += tokens[i + 1];
      const offset = textDocument.offsetAt({ line, character });

      const modifiers = tokens[i + 4];
      const tokenModifiers: string[] = [];
      for (let bit = 0; bit < 32; bit++) {
        if ((modifiers & (1 << bit)) !== 0) {
          tokenModifiers.push(SemanticTokenModifiers[bit]);
        }
      }
      const decodedToken: DecodedSemanticToken = {
        offsetStart: offset,
        offsetEnd: offset + tokens[i + 2],
        semanticTokenType: SemanticTokenTypes[tokens[i + 3]],
        tokenModifiers,
        text: textDocument.getText({
          start: { line, character },
          end: { line, character: character + tokens[i + 2] },
        }),
      };
      decodedTokens.push(decodedToken);
    }
    return decodedTokens;
  }
}
