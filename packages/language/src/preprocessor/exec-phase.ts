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
import { preprocessorParse, StatementParser } from "../parser/parser-entry";
import { ParserState } from "../parser/parser-state";
import {
  cicsResponseStatement,
  isCicsResponseStatement,
} from "../parser/cics-response-parser";
import { parseExecStatement } from "../parser/preprocessor-parser";
import {
  isSqlAttributeStatement,
  sqlAttributeStatement,
} from "../parser/sql-attribute-parser";
import * as t from "../parser/tokens";
import { tokenize } from "../parser/tokenizer";
import * as ast from "../syntax-tree/ast";
import { Diagnostic, diagnosticFromCode } from "../language-server/types";
import { CompilerOptionsCodes } from "./compiler-options/codes";
import { CompilerOptionResult } from "./compiler-options/options";
import { generateInstructions } from "./instruction-generator";
import { runInstructions } from "./instruction-interpreter";
import { MarginsProcessor } from "./pli-margins-processor";
import { PhaseInput, PhaseResult, PreprocessorPhase } from "./pp-phase";

/**
 * Recognizes `SQL TYPE IS ...` attribute declarations (handled by the SQL phase).
 */
function createSqlAttributeHandler(): StatementParser {
  return async (state) => {
    if (state.token?.tokenTypeIdx !== t.SQL.tokenTypeIdx) {
      return undefined;
    }
    if (!isSqlAttributeStatement(state)) {
      return undefined;
    }
    const sqlAttrStmt = sqlAttributeStatement(state);
    const sqlAttrStatement = ast.createStatement();
    sqlAttrStatement.value = sqlAttrStmt;
    return sqlAttrStatement;
  };
}

/**
 * Recognizes `DFHRESP(...)` response code references (handled by the CICS phase).
 */
function createCicsResponseHandler(): StatementParser {
  return async (state) => {
    if (state.token?.tokenTypeIdx !== t.DFHRESP.tokenTypeIdx) {
      return undefined;
    }
    if (!isCicsResponseStatement(state)) {
      return undefined;
    }
    const cicsRespStmt = cicsResponseStatement(state);
    const cicsRespStatement = ast.createStatement();
    cicsRespStatement.value = cicsRespStmt;
    return cicsRespStatement;
  };
}

/**
 * Recognizes `EXEC SQL`/`EXEC CICS` statements. When `execType` is given, the handler
 * only claims EXEC statements whose prefix matches, so the SQL and CICS phases never
 * process each other's statements.
 */
function createExecHandler(
  textDocument: TextDocument,
  execType: ast.PreprocessorType,
): StatementParser {
  return async (state) => {
    if (state.token?.tokenTypeIdx !== t.EXEC.tokenTypeIdx) {
      return undefined;
    }

    const nextToken = state.peek(2);
    if (!nextToken) {
      return undefined;
    }

    const prefix = nextToken.image.match(/^(\w+)/i)?.[1]?.toUpperCase();
    const tokenType =
      prefix === "SQL"
        ? ast.PreprocessorType.SQL
        : prefix === "CICS"
          ? ast.PreprocessorType.CICS
          : ast.PreprocessorType.UNKNOWN;

    if (tokenType !== execType) {
      return undefined;
    }
    return await parseExecStatement(state, textDocument);
  };
}

/**
 * Base class for the EXEC-based preprocessor phases (SQL and CICS).
 *
 * Both phases share the same shape: re-parse the potentially macro-expanded token stream
 * with their own handlers, generate instructions, and run them. The only difference is which
 * handlers they compose ({@link createHandlers}).
 */
abstract class ExecPreprocessorPhase implements PreprocessorPhase {
  constructor(
    protected readonly compilerOptionsResult: CompilerOptionResult | undefined,
    protected readonly marginsProcessor: MarginsProcessor,
  ) {}

  protected abstract createHandlers(
    textDocument: TextDocument,
  ): StatementParser[];

  async execute(input: PhaseInput): Promise<PhaseResult> {
    const { tokens, unit, uri, textDocument } = input;
    const opts = this.compilerOptionsResult?.options;

    const state = new ParserState(tokens, opts);
    const { statements, diagnostics } = await preprocessorParse(
      state,
      this.createHandlers(textDocument),
    );

    const instructionResult = generateInstructions(statements);

    const output = await runInstructions(unit, uri, instructionResult, {
      compilerOptions: this.compilerOptionsResult,
      marginsProcessor: this.marginsProcessor,
      // Nested EXEC ... INCLUDE files are re-parsed with this same phase's handlers,
      // keeping the preprocessors independent of one another.
      createParseHandlers: (includeDocument) =>
        this.createHandlers(includeDocument),
    });

    return {
      tokens: output.all,
      statements: [...statements, ...output.statements],
      diagnostics: [...diagnostics, ...output.errors],
      references: output.references,
    };
  }
}

export class ExecSqlPreprocessorPhase extends ExecPreprocessorPhase {
  protected createHandlers(textDocument: TextDocument): StatementParser[] {
    return [
      createSqlAttributeHandler(),
      createExecHandler(textDocument, ast.PreprocessorType.SQL),
    ];
  }
}

export class ExecCicsPreprocessorPhase extends ExecPreprocessorPhase {
  protected createHandlers(textDocument: TextDocument): StatementParser[] {
    return [
      createCicsResponseHandler(),
      createExecHandler(textDocument, ast.PreprocessorType.CICS),
    ];
  }
}

/**
 * Runs unconditionally, after every configured PP() phase has already had a chance to
 * process the token stream. By this point, any `EXEC CICS`/`EXEC SQL` statement that was
 * actually handled has already been replaced. So an `EXEC`/`ExecFragment` pair still present here means
 * the corresponding preprocessor was never configured via `PP(CICS)`/`PP(SQL)`.
 *
 * Replaces the offending statement with `DO; END;` (matching the same fallback shape the
 * real phases use) so the final PL/I grammar parse doesn't ALSO raise its own generic
 * "unexpected token" error for the same statement.
 */
export class UnresolvedExecPhase implements PreprocessorPhase {
  constructor(
    private readonly hasCics: boolean,
    private readonly hasSql: boolean,
  ) {}

  async execute(input: PhaseInput): Promise<PhaseResult> {
    if (this.hasCics && this.hasSql) {
      // Both preprocessors are configured, so no EXEC statement can be left unresolved.
      return {
        tokens: input.tokens,
        statements: [],
        diagnostics: [],
        references: [],
      };
    }

    const tokens = [...input.tokens];
    const diagnostics: Diagnostic[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const execToken = tokens[i];
      if (execToken.tokenTypeIdx !== t.EXEC.tokenTypeIdx) {
        continue;
      }
      const fragmentToken = tokens[i + 1];
      if (fragmentToken?.tokenTypeIdx !== t.ExecFragment.tokenTypeIdx) {
        continue;
      }

      const prefix = fragmentToken.image.match(/^(\w+)/i)?.[1]?.toUpperCase();
      const code =
        prefix === "CICS" && !this.hasCics
          ? CompilerOptionsCodes.PP.CicsPreprocessorRequired
          : prefix === "SQL" && !this.hasSql
            ? CompilerOptionsCodes.PP.SqlPreprocessorRequired
            : undefined;
      if (!code) {
        continue;
      }

      diagnostics.push(diagnosticFromCode(code, execToken));

      // Replace EXEC/ExecFragment(/Semicolon) with a harmless DO; END; so the final
      // grammar parse doesn't also raise its own diagnostic for the same statement.
      let replaceCount = 2;
      if (tokens[i + 2]?.tokenTypeIdx === t.Semicolon.tokenTypeIdx) {
        replaceCount = 3;
      }
      const replacementTokens = tokenize("DO; END;", undefined).tokens;
      tokens.splice(i, replaceCount, ...replacementTokens);
      i += replacementTokens.length - 1;
    }

    return { tokens, statements: [], diagnostics, references: [] };
  }
}
