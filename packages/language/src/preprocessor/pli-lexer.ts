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
import { preprocessorParse } from "../parser/parser-entry";
import * as ast from "../syntax-tree/ast";
import { URI } from "../utils/uri";
import {
  CompilerOptionsProcessor,
  CompilerOptionsProcessorResult,
} from "./compiler-options-processor";
import { CompilationUnit } from "../workspace/compilation-unit";
import { Reference, Statement } from "../syntax-tree/ast";
import { Token } from "../parser/tokens";
import { generateInstructions } from "./instruction-generator";
import { EvaluationResults, runInstructions } from "./instruction-interpreter";
import { createIncludeInstruction, InstructionNode } from "./instructions";
import { CstNodeKind } from "../syntax-tree/cst";
import { tokenize } from "../parser/tokenizer";
import { ParserState } from "../parser/parser-state";
import { TextDocument } from "vscode-languageserver-textdocument";
import { getDefaultCompilerOptions } from "./compiler-options/options";
import { CompilerOptions } from "./compiler-options/options-pli";
import { DiagnosticCategory } from "../validation/diagnostics-store";
import { updatePliTokenizer } from "../parser/tokenizer/pli-tokenizer";

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
    const instruction = await unit.instructionCache.get(
      uri,
      inputText,
      async () => {
        const textWithoutMargins = this.marginsProcessor.processMargins(
          compilerOptionsResult,
          uri,
          unit.services.workspace,
        );
        const tokenizeResult = tokenize(textWithoutMargins, uri);
        const state = new ParserState(tokenizeResult.tokens);
        // Do a full parsing of the input text to extract all *local* statements
        const { statements, diagnostics } = await preprocessorParse(
          state,
          document,
          opts,
        );
        const result = generateInstructions(statements);
        diagnostics.push(...tokenizeResult.diagnostics);
        return {
          tokens: tokenizeResult.tokens,
          comments: tokenizeResult.comments,
          diagnostics: diagnostics,
          statements: statements,
          result,
        };
      },
    );
    unit.diagnostics.addAll(DiagnosticCategory.Lexer, instruction.diagnostics);
    unit.diagnostics.addAll(
      DiagnosticCategory.Lexer,
      this.marginsProcessor.issues,
    );

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
    const output = await runInstructions(unit, uri, instruction.result, {
      compilerOptions: compilerOptionsResult.result,
      marginsProcessor: this.marginsProcessor,
    });
    unit.services.files.set({
      textDocument: document,
      tokens: instruction.tokens,
      comments: instruction.comments,
      uri,
    });
    if (compilerOptionsResult.result) {
      instruction.tokens.unshift(...compilerOptionsResult.result.tokens);
      instruction.comments.unshift(...compilerOptionsResult.result.comments);
    }
    const uriString = uri.toString();
    unit.diagnostics.addAll(DiagnosticCategory.Lexer, output.errors);
    unit.diagnostics.addAll(
      DiagnosticCategory.CompilerOptions,
      (compilerOptionsResult.result?.issues ?? []).filter(
        (e) => e.uri === uriString,
      ),
    );

    return {
      all: output.all,
      compilerOptions: compilerOptionsResult,
      statements: [...instruction.statements, ...output.statements],
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
  const includeItem = ast.createIncludeItemFile();
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
    instruction: createIncludeInstruction([includeItem], false),
    next: existingNode,
  };
  return instruction;
}
