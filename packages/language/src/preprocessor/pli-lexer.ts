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
import { PliPreprocessorParser } from "./pli-preprocessor-parser";
import * as ast from "../syntax-tree/ast";
import { URI } from "../utils/uri";
import {
  CompilerOptionsProcessor,
  CompilerOptionsProcessorResult,
} from "./compiler-options-processor";
import { CompilationUnit } from "../workspace/compilation-unit";
import { Reference, Statement } from "../syntax-tree/ast";
import { Range, Severity } from "../language-server/types";
import { Token } from "../parser/tokens";
import { generateInstructions } from "./instruction-generator";
import { EvaluationResults, runInstructions } from "./instruction-interpreter";
import { createIncludeInstruction, InstructionNode } from "./instructions";
import {
  CompilerOptions,
  getDefaultCompilerOptions,
} from "./compiler-options/options";
import { CstNodeKind } from "../syntax-tree/cst";
import { initLexer } from "../parser/tokenizer";

export interface LexingIssue {
  readonly message: string;
  readonly severity: Severity;
  readonly range: Range | undefined;
  readonly uri: URI | undefined;
}

export interface LexerResult {
  all: Token[];
  errors: LexingIssue[];
  compilerOptions: CompilerOptionsProcessorResult;
  statements: Statement[];
  fileTokens: Map<string, Token[]>;
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
  readonly preprocessorParser: PliPreprocessorParser;

  constructor() {
    this.compilerOptionsPreprocessor = new CompilerOptionsProcessor();
    this.marginsProcessor = new PliMarginsProcessor();
    this.preprocessorParser = new PliPreprocessorParser();
  }

  tokenize(unit: CompilationUnit, inputText: string, uri: URI): LexerResult {
    const compilerOptionsResult =
      this.compilerOptionsPreprocessor.extractCompilerOptions(inputText, uri);
    const opts =
      compilerOptionsResult.result?.options ?? getDefaultCompilerOptions();
    initLexer(opts);
    unit.instructionCache.update(opts);
    const allErrors: LexingIssue[] = [];
    const instruction = unit.instructionCache.get(uri, inputText, () => {
      const textWithoutMargins = this.marginsProcessor.processMargins(
        compilerOptionsResult,
        uri,
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
      const result = generateInstructions(statements);
      return {
        tokens: fileTokens,
        issues: errors,
        statements: statements,
        result,
      };
    });
    allErrors.push(...instruction.issues);
    allErrors.push(...this.marginsProcessor.issues);

    const incAfter = compilerOptionsResult.result?.options.incAfter;
    if (incAfter?.process) {
      instruction.result = {
        entryNode: generateIncAfterInstruction(
          instruction.result.entryNode,
          incAfter,
        ),
        procedures: instruction.result.procedures,
      };
    }
    const output = runInstructions(unit, uri, instruction.result, {
      compilerOptions: compilerOptionsResult.result,
      marginsProcessor: this.marginsProcessor,
      parser: this.preprocessorParser,
    });
    output.fileTokens.set(uri.toString(), instruction.tokens);
    if (compilerOptionsResult.result) {
      output.fileTokens
        .get(uri.toString())
        ?.unshift(...compilerOptionsResult.result.tokens);
    }
    allErrors.push(...output.errors);
    return {
      all: output.all,
      compilerOptions: compilerOptionsResult,
      errors: allErrors,
      statements: [...instruction.statements, ...output.statements],
      fileTokens: output.fileTokens,
      evaluationResults: output.evaluationResults,
      tokenReferences: output.references,
    };
  }
}

function generateIncAfterInstruction(
  existingNode: InstructionNode,
  incAfter: CompilerOptions.IncAfter | undefined,
): InstructionNode {
  if (!incAfter || !incAfter.process) {
    return existingNode;
  }
  // Generate a synthetic include item here
  // This allows us to perform LSP operations to jump to the included file
  const includeItem = ast.createIncludeItem();
  includeItem.fileName = incAfter.process;
  includeItem.token = incAfter.token || null;
  if (incAfter.token) {
    includeItem.token = incAfter.token;
    incAfter.token.element = includeItem;
    incAfter.token.kind = CstNodeKind.IncludeItem_FileID;
  }
  // IncAfter runs as the very first instruction in the preprocessor.
  // It allows to include ONE SINGLE file. Afterwards the preprocessor runs as normal.
  const instruction: InstructionNode = {
    labels: [],
    instruction: createIncludeInstruction(
      includeItem,
      incAfter.process,
      false,
      incAfter.token,
    ),
    next: existingNode,
  };
  return instruction;
}
