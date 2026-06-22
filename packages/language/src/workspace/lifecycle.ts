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
import { CompilationUnit, addBuiltinUnits } from "./compilation-unit";
import {
  Program,
} from "../syntax-tree/ast";
import {
  generatePliValidationDiagnostics,
  generatePreprocessorValidationDiagnostics,
  linkingErrorsToDiagnostics,
} from "../validation/validator";
import { LexerResult, PliLexer } from "../preprocessor/pli-lexer";
import { assignDebugKinds } from "../utils/debug-kinds";
import { CancellationToken } from "vscode-languageserver";
import { interruptAndCheck } from "../utils/promises";
import { TextDocument } from "vscode-languageserver-textdocument";
import { DiagnosticCategory } from "../validation/diagnostics-store";
import { parsePli } from "../parser/parser";
import * as environment from "../workspace/environment";
import { extractIncludeDirectives, markErroneousIncludes } from "./include-validations";

export async function lifecycle(
  compilationUnit: CompilationUnit,
  document: TextDocument,
  cancellation: CancellationToken,
): Promise<void> {
  compilationUnit.reset();
  await interruptAndCheck(cancellation);
  await tokenize(compilationUnit, document);
  await interruptAndCheck(cancellation);
  parse(compilationUnit);
  await interruptAndCheck(cancellation);
  await generateSymbolTable(compilationUnit);
  await interruptAndCheck(cancellation);
  link(compilationUnit);
  await interruptAndCheck(cancellation);
  preprocessorValidate(compilationUnit);
  await interruptAndCheck(cancellation);
  validate(compilationUnit);
  await interruptAndCheck(cancellation);
  const includes = extractIncludeDirectives(compilationUnit);
  markErroneousIncludes(compilationUnit, includes);
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
  result.statements.forEach((stmt) => {
    stmt.container = compilationUnit.preprocessorAst;
  });
  compilationUnit.preprocessorEvaluationResults = result.evaluationResults;
  compilationUnit.referencesCache.addAll(result.tokenReferences);
  return result;
}

export function parse(compilationUnit: CompilationUnit): Program {
  const { tree, diagnostics } = parsePli(
    compilationUnit.tokens,
    compilationUnit.compilerOptions,
  );
  compilationUnit.ast = tree;
  compilationUnit.diagnostics.addAll(DiagnosticCategory.Parser, diagnostics);

  if (environment.IsDebugging) {
    assignDebugKinds(tree);
  }

  return tree;
}

export async function generateSymbolTable(compilationUnit: CompilationUnit) {
  await addBuiltinUnits(compilationUnit, compilationUnit.services.workspace);
  iterateSymbols(compilationUnit);
}

export function link(compilationUnit: CompilationUnit): ReferencesCache {
  resolveReferences(compilationUnit);
  linkingErrorsToDiagnostics(
    compilationUnit,
    compilationUnit.referencesCache,
    compilationUnit.scopeCaches,
  );
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