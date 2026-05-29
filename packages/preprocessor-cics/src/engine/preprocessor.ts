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
/*
 * Copyright (c) 2026 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Broadcom, Inc. - initial API and implementation
 */

import * as antlr from "antlr4ng";
import { CICSLexer } from "../generated/CICSLexer";
import { CICSParser } from "../generated/CICSParser";
import { CollectingErrorListener } from "./parsing";
import { CollectingIdentifierVisitor } from "./CollectingIdentifierVisitor";
import {
  Diagnostic,
  Preprocessor,
  PreprocessorResult,
  SemanticsKind,
  Token,
} from "preprocessor-api";

const COMMENTS = CICSLexer.channelNames.indexOf("COMMENTS");

export class CICSPreprocessor implements Preprocessor {
  public async execute(textSnippet: string): Promise<PreprocessorResult> {
    const charStream = antlr.CharStream.fromString(textSnippet);
    const lexer = new CICSLexer(charStream);
    const tokenStream = new antlr.CommonTokenStream(lexer);
    const parser = new CICSParser(tokenStream);
    tokenStream.fill();

    lexer.removeErrorListeners();
    parser.removeErrorListeners();

    const lexerErrors = new CollectingErrorListener();
    const parserErrors = new CollectingErrorListener();

    lexer.addErrorListener(lexerErrors);
    parser.addErrorListener(parserErrors);

    const tree = parser.startRule();
    const identifierTokens = CollectingIdentifierVisitor.collect(tree);
    const keywordPattern = /^[a-z_]/i;
    let idIndex = 0;
    const tokens = tokenStream
      .getTokens()
      .filter((token) => token.text !== undefined)
      .map((token) => {
        let semanticsKind: SemanticsKind;
        if (
          idIndex < identifierTokens.length &&
          token.start === identifierTokens[idIndex].startOffset
        ) {
          return identifierTokens[idIndex++];
        } else if (token.channel === COMMENTS) {
          semanticsKind = SemanticsKind.Comment;
        } else if (token.type === CICSLexer.NONNUMERICLITERAL) {
          semanticsKind = SemanticsKind.String;
        } else if (token.type === CICSLexer.NUMERICLITERAL) {
          semanticsKind = SemanticsKind.Number;
        } else if (keywordPattern.test(token.text!)) {
          semanticsKind = SemanticsKind.Keyword;
        } else {
          return undefined;
        }
        return <Token>{
          image: token.text!,
          startOffset: token.start,
          endOffset: token.stop,
          semanticsKind,
        };
      })
      .filter((token): token is Token => token !== undefined)
      // Add any remaining identifier tokens that were not matched in the token stream
      .concat(identifierTokens.slice(idIndex));

    const diagnostics: Diagnostic[] = [];
    diagnostics.push(...lexerErrors.errors);
    diagnostics.push(...parserErrors.errors);
    return {
      diagnostics,
      tokens,
      replacement: null,
    };
  }
}
