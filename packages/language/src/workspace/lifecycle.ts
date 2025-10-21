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
import { Program } from "../syntax-tree/ast";
import {
  compilerOptionIssuesToDiagnostics,
  generatePliValidationDiagnostics,
  generatePreprocessorValidationDiagnostics,
  linkingErrorsToDiagnostics,
  parserErrorsToDiagnostics,
} from "../validation/validator";
import { LexerResult, PliLexer } from "../preprocessor/pli-lexer";
import { assignDebugKinds } from "../utils/debug-kinds";
import { CancellationToken } from "vscode-languageserver";
import { interruptAndCheck } from "../utils/promises";
import { TextDocument } from "vscode-languageserver-textdocument";

export async function lifecycle(
  compilationUnit: CompilationUnit,
  document: TextDocument,
  cancellation: CancellationToken,
): Promise<void> {
  compilationUnit.services.files.clear();
  compilationUnit.diagnostics.typeSystem = [];
  compilationUnit.services.typeCache.clear();
  compilationUnit.statementOrderCache.clear();
  compilationUnit.referencesCache.clear();
  compilationUnit.scopeCaches.clear();
  await interruptAndCheck(cancellation);
  await tokenize(compilationUnit, document);
  parse(compilationUnit);
  await interruptAndCheck(cancellation);
  generateSymbolTable(compilationUnit);
  await interruptAndCheck(cancellation);
  link(compilationUnit);
  await interruptAndCheck(cancellation);
  preprocessorValidate(compilationUnit);
  await interruptAndCheck(cancellation);
  validate(compilationUnit);
  await interruptAndCheck(cancellation);
}

const lexer = new PliLexer();

export async function tokenize(
  compilationUnit: CompilationUnit,
  document: TextDocument,
): Promise<LexerResult> {
  const result = await lexer.tokenize(
    compilationUnit,
    document,
    compilationUnit.uri,
  );
  compilationUnit.tokens = result.all;
  compilationUnit.preprocessorAst.statements = result.statements;
  compilationUnit.preprocessorEvaluationResults = result.evaluationResults;
  compilationUnit.referencesCache.addAll(result.tokenReferences);
  const uri = compilationUnit.uri.toString();
  compilationUnit.diagnostics.lexer = result.diagnostics;
  compilationUnit.diagnostics.compilerOptions =
    compilerOptionIssuesToDiagnostics(
      result.compilerOptions.result?.issues,
      uri,
    );
  return result;
}

export function parse(compilationUnit: CompilationUnit): Program {
  PliParserInstance.input = compilationUnit.tokens;
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
    compilationUnit,
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
  generatePliValidationDiagnostics(compilationUnit);
}

export function preprocessorValidate(compilationUnit: CompilationUnit): void {
  generatePreprocessorValidationDiagnostics(compilationUnit);
}
