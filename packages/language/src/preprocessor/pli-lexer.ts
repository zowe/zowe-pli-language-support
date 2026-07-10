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

import { MarginsProcessor, PliMarginsProcessor } from "./pli-margins-processor";
import { URI } from "../utils/uri";
import {
  CompilerOptionsProcessor,
  CompilerOptionsProcessorResult,
} from "./compiler-options-processor";
import { CompilationUnit } from "../workspace/compilation-unit";
import { Reference, Statement } from "../syntax-tree/ast";
import { Token } from "../parser/tokens";
import { EvaluationResults } from "./instruction-interpreter";
import { tokenize, TokenizationResult } from "../parser/tokenizer";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  CompilerOptionResult,
  CompilerOptions,
  getDefaultCompilerOptions,
} from "./compiler-options/options";
import { CompilerOptions as PliCompilerOptions } from "./compiler-options/options-pli";
import { DiagnosticCategory } from "../validation/diagnostics-store";
import { updatePliTokenizer } from "../parser/tokenizer/pli-tokenizer";
import { PipelineResult, runPipeline } from "./pp-pipeline";
import { PreprocessorPhase } from "./pp-phase";
import { MacroPreprocessorPhase } from "./macro-phase";
import {
  ExecCicsPreprocessorPhase,
  ExecSqlPreprocessorPhase,
} from "./exec-phase";

export interface LexerResult {
  all: Token[];
  compilerOptions: CompilerOptionsProcessorResult;
  statements: Statement[];
  evaluationResults: EvaluationResults;
  tokenReferences: Reference[];
}

/**
 * Lexer for PL/I language. It orchestrates a margins processor and a preprocessor.
 * The latter creates the desired token stream without preprocessor statements
 */
export class PliLexer {
  readonly compilerOptionsPreprocessor: CompilerOptionsProcessor;
  readonly marginsProcessor: MarginsProcessor;

  constructor() {
    this.compilerOptionsPreprocessor = new CompilerOptionsProcessor();
    this.marginsProcessor = new PliMarginsProcessor();
  }

  async tokenize(
    unit: CompilationUnit,
    document: TextDocument,
    uri: URI,
  ): Promise<LexerResult> {
    const inputText = document.getText();

    // Compiler options
    const compilerOptionsResult =
      this.compilerOptionsPreprocessor.extractCompilerOptions(
        inputText,
        uri,
        unit.services.workspace,
      );
    const opts =
      compilerOptionsResult.result?.options ?? getDefaultCompilerOptions();
    unit.compilerOptions = opts;
    updatePliTokenizer(opts);
    unit.instructionCache.update(compilerOptionsResult.recompileFingerprint);
    unit.tokenizationCache.update(compilerOptionsResult.recompileFingerprint);

    // Produce the first Token[] (margins + tokenize).
    const tokenization = await unit.tokenizationCache.get(uri, inputText, () =>
      this.tokenizeSource(unit, uri, compilerOptionsResult),
    );

    // Run the preprocessor pipeline (MACRO, SQL, CICS according to PP()).
    // Each phase parses the tokens it receives, so the stages compose as
    // Token[] -> MACRO -> Token[] -> SQL -> ... -> final Token[].
    const phases = buildPhases(
      opts,
      compilerOptionsResult.result,
      this.marginsProcessor,
    );
    const pipeline = await runPipeline(phases, {
      tokens: tokenization.tokens,
      unit,
      uri,
      textDocument: document,
    });

    // Publish diagnostics, register the file's tokens, and assemble the result.
    this.reportDiagnostics(
      unit,
      uri,
      compilerOptionsResult,
      tokenization,
      pipeline,
    );
    this.registerFileTokens(
      unit,
      document,
      uri,
      compilerOptionsResult,
      tokenization,
    );

    return {
      all: pipeline.tokens,
      compilerOptions: compilerOptionsResult,
      statements: pipeline.statements,
      evaluationResults: pipeline.evaluationResults,
      tokenReferences: pipeline.references,
    };
  }

  /**
   * Process margins and tokenize the source
   * into the first `Token[]`. Margin diagnostics are folded into the result so they stay
   * correct on cache hits (the pipeline reuses the same margins processor for %INCLUDE
   * files and would otherwise overwrite `marginsProcessor.issues`).
   */
  private tokenizeSource(
    unit: CompilationUnit,
    uri: URI,
    compilerOptionsResult: CompilerOptionsProcessorResult,
  ): TokenizationResult {
    const textWithoutMargins = this.marginsProcessor.processMargins(
      compilerOptionsResult,
      uri,
      unit.services.workspace,
    );
    const marginIssues = [...this.marginsProcessor.issues];
    const tokenizeResult = tokenize(textWithoutMargins, uri);
    return {
      tokens: tokenizeResult.tokens,
      comments: tokenizeResult.comments,
      diagnostics: [...tokenizeResult.diagnostics, ...marginIssues],
    };
  }

  /**
   * Publish the diagnostics collected across all stages.
   */
  private reportDiagnostics(
    unit: CompilationUnit,
    uri: URI,
    compilerOptionsResult: CompilerOptionsProcessorResult,
    tokenization: TokenizationResult,
    pipeline: PipelineResult,
  ): void {
    unit.diagnostics.addAll(DiagnosticCategory.Lexer, tokenization.diagnostics);
    unit.diagnostics.addAll(DiagnosticCategory.Lexer, pipeline.diagnostics);
    const uriString = uri.toString();
    unit.diagnostics.addAll(
      DiagnosticCategory.CompilerOptions,
      (compilerOptionsResult.result?.issues ?? []).filter(
        (e) => e.uri === uriString,
      ),
    );
  }

  /**
   * Register the file's tokens with the file store.
   */
  private registerFileTokens(
    unit: CompilationUnit,
    document: TextDocument,
    uri: URI,
    compilerOptionsResult: CompilerOptionsProcessorResult,
    tokenization: TokenizationResult,
  ): void {
    const optionTokens = compilerOptionsResult.result?.tokens ?? [];
    const optionComments = compilerOptionsResult.result?.comments ?? [];
    unit.services.files.set({
      textDocument: document,
      tokens: [...optionTokens, ...tokenization.tokens],
      comments: [...optionComments, ...tokenization.comments],
      uri,
    });
  }
}

/**
 * Build the preprocessor phase list from the PP() compiler option.
 * The PP option contains an ordered list of preprocessor items
 * (MACRO, SQL, CICS, INCLUDE), and each maps to a PreprocessorPhase.
 * The phases run sequentially: Token[] -> Phase1 -> Token[] -> Phase2 -> ...
 */
function buildPhases(
  opts: CompilerOptions,
  compilerOptionsResult: CompilerOptionResult | undefined,
  marginsProcessor: MarginsProcessor,
): PreprocessorPhase[] {
  const phases: PreprocessorPhase[] = [];
  const pp = opts.pp;

  if (!pp || !pp.items) {
    // No PP option - default to just macro phase
    phases.push(
      new MacroPreprocessorPhase(compilerOptionsResult, marginsProcessor),
    );
    return phases;
  }

  let hasMacroPhase = false;

  for (const item of pp.items) {
    switch (item.name) {
      case PliCompilerOptions.PPItemName.MACRO:
        // Each explicit MACRO item is its own pass, so e.g. PP(MACRO MACRO) runs the
        // macro preprocessor twice. A second pass can expand macro code that the first
        // pass generated.
        hasMacroPhase = true;
        phases.push(
          new MacroPreprocessorPhase(compilerOptionsResult, marginsProcessor),
        );
        break;
      case PliCompilerOptions.PPItemName.INCLUDE:
        // INCLUDE is handled by the macro phase (the instruction interpreter processes
        // %INCLUDE/++INCLUDE). Only add a macro phase for it if none exists yet.
        if (!hasMacroPhase) {
          hasMacroPhase = true;
          phases.push(
            new MacroPreprocessorPhase(compilerOptionsResult, marginsProcessor),
          );
        }
        break;
      case PliCompilerOptions.PPItemName.SQL:
        phases.push(
          new ExecSqlPreprocessorPhase(compilerOptionsResult, marginsProcessor),
        );
        break;
      case PliCompilerOptions.PPItemName.CICS:
        phases.push(
          new ExecCicsPreprocessorPhase(
            compilerOptionsResult,
            marginsProcessor,
          ),
        );
        break;
    }
  }

  return phases;
}
