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
import {
  CollectingErrorListener,
  CollectingIdentifierVisitor,
  ParseError,
} from "./parsing";

export interface ICICSPreprocessorResult {
  diagnostics: ParseError[];
  identifiers: antlr.Token[];
}

export class CICSPreprocessor {
  public async execute(textSnippet: string): Promise<ICICSPreprocessorResult> {
    const charStream = antlr.CharStream.fromString(textSnippet);
    const lexer = new CICSLexer(charStream);
    const tokenStream = new antlr.CommonTokenStream(lexer);
    const parser = new CICSParser(tokenStream);
    tokenStream.fill();

    lexer.removeErrorListeners();
    parser.removeErrorListeners();

    const lexerErrors = new CollectingErrorListener();
    const parserErrors = new CollectingErrorListener();
    const identifierVisitor = new CollectingIdentifierVisitor();

    lexer.addErrorListener(lexerErrors);
    parser.addErrorListener(parserErrors);

    const tree = parser.startRule();
    tree.accept(identifierVisitor);

    return {
      diagnostics: [...lexerErrors.errors, ...parserErrors.errors],
      identifiers: identifierVisitor.identifiers,
    };
  }
}
