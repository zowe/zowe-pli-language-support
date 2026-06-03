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
  ParseTree,
  ParserRuleContext,
  TerminalNode,
} from "antlr4ng";
import { Db2SqlExecParserVisitor } from "../generated/Db2SqlExecParserVisitor";
import {
  Dbs_host_identifierContext,
  Dbs_include_sqlcaContext,
  Dbs_include_sqldaContext,
  Dbs_includeContext,
} from "../generated/Db2SqlExecParser";
import {
  Diagnostic,
  PreprocessorReplacement,
  SemanticsKind,
  Severity,
  Token,
} from "preprocessor-api";

export class CollectingErrorListener extends BaseErrorListener {
  public readonly errors: Diagnostic[] = [];

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
      code: "syntax",
      severity: Severity.Error,
    });
  }
}

export class CollectingIdentifierVisitor extends Db2SqlExecParserVisitor<void> {
  static collect(tree: ParseTree): Token[] {
    const visitor = new CollectingIdentifierVisitor();
    tree.accept(visitor);
    return visitor.identifiers;
  }
  readonly identifiers: Token[] = [];
  override visitDbs_host_identifier = (
    ctx: Dbs_host_identifierContext,
  ): void => {
    if (ctx.start && ctx.stop) {
      this.identifiers.push({
        //remove leading colon
        image: ctx.getText().slice(1),
        startOffset: ctx.start.start + 1,
        endOffset: ctx.stop.stop,
        semanticsKind: SemanticsKind.Identifier,
      });
    }
  };
}

export class CollectingIncludeVisitor extends Db2SqlExecParserVisitor<void> {
  static collect(tree: ParseTree): PreprocessorReplacement | null {
    const visitor = new CollectingIncludeVisitor();
    tree.accept(visitor);
    return visitor.includePath
      ? {
          type: "include",
          token: visitor.includePath,
          filePath: visitor.includePath.image ?? "",
        }
      : null;
  }

  includePath: Token | null = null;
  override visitDbs_include = (ctx: Dbs_includeContext): void => {
    this.addIncludePath(ctx.dbs_sql_identifier());
  };
  override visitDbs_include_sqlca = (ctx: Dbs_include_sqlcaContext): void => {
    this.addIncludePath(ctx.SQLCA());
  };
  override visitDbs_include_sqlda = (ctx: Dbs_include_sqldaContext): void => {
    this.addIncludePath(ctx.SQLDA());
  };

  private addIncludePath(path: ParserRuleContext | TerminalNode) {
    if (path instanceof TerminalNode) {
      this.includePath = {
        image: path.getText(),
        startOffset: path.symbol.start,
        endOffset: path.symbol.stop,
        semanticsKind: SemanticsKind.Identifier,
      };
    } else {
      this.includePath = {
        image: path.getText(),
        startOffset: path.start?.start ?? 0,
        endOffset: path.stop?.stop ?? 0,
        semanticsKind: SemanticsKind.Identifier,
      };
    }
  }
}
