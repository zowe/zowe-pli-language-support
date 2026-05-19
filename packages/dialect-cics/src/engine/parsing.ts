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
import {
  BaseErrorListener,
  Recognizer,
  ATNSimulator,
  RecognitionException,
  Token as AntlrToken,
} from "antlr4ng";
import { CICSParserVisitor } from "../generated/CICSParserVisitor";
import { CicsWordContext } from "../generated/CICSParser";
import { ParseError, SemanticsKind, Token } from "dialect-api";

export class CollectingErrorListener extends BaseErrorListener {
  public readonly errors: ParseError[] = [];

  override syntaxError<S extends AntlrToken, T extends ATNSimulator>(
    _recognizer: Recognizer<T>,
    offendingSymbol: S | null,
    line: number,
    charPositionInLine: number,
    msg: string,
    _e: RecognitionException | null,
  ): void {
    this.errors.push({
      message: msg,
      startOffset: offendingSymbol?.start || 0,
      endOffset: offendingSymbol?.stop || 0,
    });
  }
}

export class CollectingIdentifierVisitor extends CICSParserVisitor<void> {
  readonly identifiers: Token[] = [];
  override visitCicsWord = (ctx: CicsWordContext): void => {
    const symbol = ctx.WORD_IDENTIFIER()?.getSymbol();
    if (symbol && symbol.text) {
      this.identifiers.push({
        image: symbol.text,
        startOffset: symbol.start,
        endOffset: symbol.stop,
        semanticsKind: SemanticsKind.Identifier,
      });
    }
  };
}
