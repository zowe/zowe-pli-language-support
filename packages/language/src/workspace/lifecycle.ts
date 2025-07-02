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

import { ReferencesCache, resolveReferences } from "../linking/resolver";
import { iterateSymbols } from "../linking/symbol-table";
import { PliParserInstance } from "../parser/parser";
import { CompilationUnit } from "./compilation-unit";
import { PliProgram } from "../syntax-tree/ast";
import {
  generateValidationDiagnostics,
  lexerErrorsToDiagnostics,
  linkingErrorsToDiagnostics,
  parserErrorsToDiagnostics,
} from "../validation/validator";
import { LexerResult, PliLexer } from "../preprocessor/pli-lexer";
import { URI } from "../utils/uri";
import { compilerOptionIssueToDiagnostics } from "../preprocessor/compiler-options/options";
import { assignDebugKinds } from "../utils/debug-kinds";

export function lifecycle(
  compilationUnit: CompilationUnit,
  text: string,
): void {
  compilationUnit.statementOrderCache.clear();
  compilationUnit.referencesCache.clear();
  compilationUnit.scopeCaches.clear();
  tokenize(compilationUnit, text);
  parse(compilationUnit);
  generateSymbolTable(compilationUnit);
  link(compilationUnit);
  validate(compilationUnit);
}

const lexer = new PliLexer();

export function tokenize(
  compilationUnit: CompilationUnit,
  text: string,
): LexerResult {
  const result = lexer.tokenize(compilationUnit, text, compilationUnit.uri);
  compilationUnit.files = Object.keys(result.fileTokens).map((e) =>
    URI.parse(e),
  );
  compilationUnit.tokens.all = result.all;
  compilationUnit.tokens.fileTokens = result.fileTokens;
  compilationUnit.preprocessorAst.statements = result.statements;
  compilationUnit.preprocessorEvaluationResults = result.evaluationResults;
  compilationUnit.compilerOptions =
    result.compilerOptions.result?.options ?? {};
  const uri = compilationUnit.uri.toString();
  compilationUnit.diagnostics.lexer = lexerErrorsToDiagnostics(result.errors);
  compilationUnit.diagnostics.compilerOptions =
    result.compilerOptions.result?.issues.map((e) =>
      compilerOptionIssueToDiagnostics(e, uri),
    ) ?? [];
  return result;
}

export function parse(compilationUnit: CompilationUnit): PliProgram {
  PliParserInstance.input = compilationUnit.tokens.all;
  const ast = PliParserInstance.parse();
  compilationUnit.ast = ast;
  compilationUnit.diagnostics.parser = parserErrorsToDiagnostics(
    PliParserInstance.errors,
  );

  if (process.env.NODE_ENV === "development") {
    assignDebugKinds(ast);
  }

  return ast;
}

export function generateSymbolTable(compilationUnit: CompilationUnit) {
  compilationUnit.diagnostics.symbolTable = iterateSymbols(compilationUnit);
}

export function link(compilationUnit: CompilationUnit): ReferencesCache {
  const resolveDiagnostics = resolveReferences(compilationUnit);
  const linkingDiagnostics = linkingErrorsToDiagnostics(
    compilationUnit.referencesCache,
    compilationUnit.scopeCaches,
  );

  compilationUnit.diagnostics.linking = [
    ...resolveDiagnostics,
    ...linkingDiagnostics,
  ];

  return compilationUnit.referencesCache;
}

/**
 * Performs semantic validations on the AST of the compilation unit
 */
export function validate(compilationUnit: CompilationUnit): void {
  generateValidationDiagnostics(compilationUnit);
}
