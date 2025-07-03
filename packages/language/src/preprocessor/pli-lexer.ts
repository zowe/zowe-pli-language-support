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
import { PliPreprocessorLexer } from "./pli-preprocessor-lexer";
import { PliPreprocessorParser } from "./pli-preprocessor-parser";
import * as tokens from "../parser/tokens";
import { URI } from "../utils/uri";
import {
  CompilerOptionsProcessor,
  CompilerOptionsProcessorResult,
} from "./compiler-options-processor";
import { CompilationUnit } from "../workspace/compilation-unit";
import { Statement } from "../syntax-tree/ast";
import { Range } from "../language-server/types";
import { Token } from "../parser/tokens";
import { recursivelySetContainer } from "../linking/symbol-table";
import { generateInstructions } from "./instruction-generator";
import { EvaluationResults, runInstructions } from "./instruction-interpreter";

export interface LexingError {
  readonly message: string;
  readonly range: Range | undefined;
  readonly uri: URI | undefined;
}

export interface LexerResult {
  all: Token[];
  errors: LexingError[];
  compilerOptions: CompilerOptionsProcessorResult;
  statements: Statement[];
  fileTokens: Record<string, Token[]>;
  evaluationResults: EvaluationResults;
}

/**
 * Lexer for PL/I language. It orchestrates a margins processor and a preprocessor.
 * The latter creates the desired token stream without preprocessor statements
 */
export class PliLexer {
  readonly compilerOptionsPreprocessor: CompilerOptionsProcessor;
  readonly marginsProcessor: MarginsProcessor;
  readonly preprocessorLexer: PliPreprocessorLexer;
  readonly preprocessorParser: PliPreprocessorParser;

  constructor() {
    this.compilerOptionsPreprocessor = new CompilerOptionsProcessor();
    this.marginsProcessor = new PliMarginsProcessor();
    this.preprocessorLexer = new PliPreprocessorLexer();
    this.preprocessorParser = new PliPreprocessorParser(this.preprocessorLexer);
  }

  tokenize(unit: CompilationUnit, inputText: string, uri: URI): LexerResult {
    const compilerOptionsResult =
      this.compilerOptionsPreprocessor.extractCompilerOptions(inputText, uri);
    tokens.setCompilerOptions(compilerOptionsResult.result?.options ?? {});
    const textWithoutMargins = this.marginsProcessor.processMargins(
      compilerOptionsResult,
    );
    const state = this.preprocessorParser.initializeState(
      textWithoutMargins,
      uri,
    );
    // Do a full parsing of the input text to extract all *local* statements
    const {
      statements,
      errors,
      tokens: fileTokens,
    } = this.preprocessorParser.parse(state);
    unit.preprocessorAst.statements = statements;
    recursivelySetContainer(unit.preprocessorAst);

    const instructionNode = generateInstructions(statements);
    const output = runInstructions(uri, instructionNode, {
      compilerOptions: compilerOptionsResult.result,
      marginsProcessor: this.marginsProcessor,
      parser: this.preprocessorParser,
    });
    output.fileTokens[uri.toString()] = fileTokens;
    if (compilerOptionsResult.result) {
      output.fileTokens[uri.toString()].unshift(
        ...compilerOptionsResult.result.tokens,
      );
    }
    if (output.errors) {
      errors.push(...output.errors);
    }
    return {
      all: output.all,
      compilerOptions: compilerOptionsResult,
      errors,
      statements,
      fileTokens: output.fileTokens,
      evaluationResults: output.evaluationResults,
    };
  }
}
