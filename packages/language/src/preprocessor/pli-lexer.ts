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

import { ILexingError, IToken, Lexer } from "chevrotain";
import { MarginsProcessor, PliMarginsProcessor } from "./pli-margins-processor";
import { PliPreprocessorLexer } from "./pli-preprocessor-lexer";
import { PliPreprocessorInterpreter } from "./pli-preprocessor-interpreter";
import { PliPreprocessorParser } from "./pli-preprocessor-parser";
import { PliPreprocessorGenerator } from "./pli-preprocessor-generator";
import { PliSmartTokenPickerOptimizer } from "./pli-token-picker-optimizer";
import * as tokens from "../parser/tokens";
import { URI } from "../utils/uri";
import {
  CompilerOptionsProcessor,
  CompilerOptionsProcessorResult,
} from "./compiler-options-processor";
import { PPStatement } from "./pli-preprocessor-ast";

export interface LexerResult {
  all: IToken[];
  errors: ILexingError[];
  compilerOptions: CompilerOptionsProcessorResult;
  fileTokens: Record<string, IToken[]>;
  preprocessorStatements: PPStatement[];
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
  readonly preprocessorGenerator: PliPreprocessorGenerator;
  readonly preprocessorInterpreter: PliPreprocessorInterpreter;

  constructor() {
    this.compilerOptionsPreprocessor = new CompilerOptionsProcessor();
    this.marginsProcessor = new PliMarginsProcessor();
    this.preprocessorLexer = new PliPreprocessorLexer(
      new PliSmartTokenPickerOptimizer(),
      tokens.all,
    );
    this.preprocessorParser = new PliPreprocessorParser(this.preprocessorLexer);
    this.preprocessorGenerator = new PliPreprocessorGenerator(tokens.NUMBER);
    this.preprocessorInterpreter = new PliPreprocessorInterpreter();
  }

  tokenize(inputText: string, uri: URI): LexerResult {
    const compilerOptionsResult =
      this.compilerOptionsPreprocessor.extractCompilerOptions(inputText);
    const textWithoutMargins = this.marginsProcessor.processMargins(
      compilerOptionsResult,
    );
    const state = this.preprocessorParser.initializeState(
      textWithoutMargins,
      uri,
    );
    const { statements, errors } = this.preprocessorParser.start(state);
    const program = this.preprocessorGenerator.generateProgram(statements);
    const output = this.preprocessorInterpreter.run(
      program,
      this.preprocessorLexer.idTokenType,
    );
    for (const uri in state.perFileTokens) {
      state.perFileTokens[uri] = this.filterHiddenTokens(
        state.perFileTokens[uri],
      );
    }
    if (compilerOptionsResult.result) {
      state.perFileTokens[uri.toString()].unshift(
        ...compilerOptionsResult.result.tokens,
      );
    }
    const preprocessorStatements = statements.filter(
      (statement) => statement.type !== "pli",
    );
    return {
      all: this.filterHiddenTokens(output.all),
      compilerOptions: compilerOptionsResult,
      errors,
      fileTokens: state.perFileTokens,
      preprocessorStatements,
    };
  }

  private filterHiddenTokens(tokens: IToken[]): IToken[] {
    return tokens.filter((token) => {
      const tokenType = token.tokenType;
      return tokenType.GROUP !== Lexer.SKIPPED;
    });
  }
}
