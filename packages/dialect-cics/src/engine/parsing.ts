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
  Token,
} from "antlr4ng";
import { Range } from "vscode-languageserver";
import { CICSParserVisitor } from "../generated/CICSParserVisitor";
import { CicsWordContext } from "../generated/CICSParser";

export interface ParseError {
  line: number;
  column: number;
  message: string;
  range: Range;
}

export class CollectingErrorListener extends BaseErrorListener {
  public readonly errors: ParseError[] = [];

  override syntaxError<S extends Token, T extends ATNSimulator>(
    _recognizer: Recognizer<T>,
    offendingSymbol: S | null,
    line: number,
    charPositionInLine: number,
    msg: string,
    _e: RecognitionException | null,
  ): void {
    this.errors.push({
      line,
      column: charPositionInLine,
      message: msg,
      range: this.getRangeForSyntaxError(
        offendingSymbol,
        line,
        charPositionInLine,
      ),
    });
  }

  private getRangeForSyntaxError(
    offendingSymbol: Token | null,
    line: number,
    charPositionInLine: number,
  ) {
    const tokenLength = offendingSymbol
      ? offendingSymbol.stop - offendingSymbol.start + 1
      : 0;
    return Range.create(
      line - 1,
      charPositionInLine,
      line - 1,
      charPositionInLine + tokenLength,
    );
  }
}

export class CollectingIdentifierVisitor extends CICSParserVisitor<void> {
  readonly identifiers: Token[] = [];
  override visitCicsWord = (ctx: CicsWordContext): void => {
    const symbol = ctx.WORD_IDENTIFIER()?.getSymbol();
    if (symbol) {
      this.identifiers.push(symbol);
    }
  };
}
