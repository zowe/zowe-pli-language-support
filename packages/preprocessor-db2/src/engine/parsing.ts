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
import { Db2SqlExecParserVisitor } from "../generated/Db2SqlExecParserVisitor";
import { Dbs_sql_identifierContext } from "../generated/Db2SqlExecParser";
import { ParseError, SemanticsKind, Token } from "preprocessor-api";

export class CollectingErrorListener extends BaseErrorListener {
  public readonly errors: ParseError[] = [];

  override syntaxError<S extends AntlrToken, T extends ATNSimulator>(
    _recognizer: Recognizer<T>,
    offendingSymbol: S | null,
    _line: number,
    _charPositionInLine: number,
    msg: string,
    _e: RecognitionException | null,
  ): void {
    this.errors.push({
      message: msg,
      startOffset: offendingSymbol?.start ?? 0,
      endOffset: offendingSymbol?.stop ?? 0,
    });
  }
}

export class CollectingIdentifierVisitor extends Db2SqlExecParserVisitor<void> {
  readonly identifiers: Token[] = [];
  override visitDbs_sql_identifier = (ctx: Dbs_sql_identifierContext): void => {
    if (ctx.start && ctx.stop) {
      this.identifiers.push({
        image: ctx.getText(),
        startOffset: ctx.start.start,
        endOffset: ctx.stop.stop,
        semanticsKind: SemanticsKind.Identifier,
      });
    }
  };
}
