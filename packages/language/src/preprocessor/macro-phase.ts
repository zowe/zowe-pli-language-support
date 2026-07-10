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
import { includeAltStatement, statement } from "../parser/preprocessor-parser";
import * as t from "../parser/tokens";
import * as ast from "../syntax-tree/ast";
import { CstNodeKind } from "../syntax-tree/cst";
import {
  CompilerOptionResult,
  CompilerOptions as PliCompilerOptions,
} from "./compiler-options/options";
import { CompilerOptions } from "./compiler-options/options-pli";
import { generateInstructions } from "./instruction-generator";
import { runInstructions } from "./instruction-interpreter";
import { createIncludeInstruction, InstructionNode } from "./instructions";
import { MarginsProcessor } from "./pli-margins-processor";
import { PhaseInput, PhaseResult, PreprocessorPhase } from "./pp-phase";

/**
 * Recognizes `%` preprocessor statements.
 */
function createPreprocessorHandler(
  textDocument: TextDocument,
): StatementParser {
  return async (state) => {
    if (state.token?.tokenTypeIdx !== t.Percent.tokenTypeIdx) {
      return undefined; // Not a preprocessor statement
    }
    return await statement(state, textDocument);
  };
}

/**
 * Under the macro `INCONLY` option, only
 * processes `%INCLUDE`/`%INSCAN` statements and lets everything else pass through.
 */
function createIncOnlyPreprocessorHandler(
  textDocument: TextDocument,
): StatementParser {
  return async (state) => {
    // If it is not a preprocessor statement and also not an include alternate,
    // return undefined to let other handlers process it.
    if (
      state.token?.tokenTypeIdx !== t.Percent.tokenTypeIdx &&
      state.token?.tokenTypeIdx !== t.INCLUDE_ALT.tokenTypeIdx
    ) {
      return undefined;
    }

    const nextToken = state.peek(2);
    const isInclude =
      nextToken &&
      (nextToken.tokenTypeIdx === t.INCLUDE.tokenTypeIdx ||
        nextToken.tokenTypeIdx === t.INSCAN.tokenTypeIdx);
    if (isInclude) {
      // Only process include statements.
      return await statement(state, textDocument);
    }

    return undefined;
  };
}

/**
 * Recognizes `++INCLUDE` alternative include statements.
 */
function createIncludeAltHandler(): StatementParser {
  return async (state: ParserState) => {
    if (state.token?.tokenTypeIdx !== t.INCLUDE_ALT.tokenTypeIdx) {
      return undefined;
    }
    const includeAlt = includeAltStatement(state);
    const includeAltStmt = ast.createStatement();
    includeAltStmt.value = includeAlt;
    return includeAltStmt;
  };
}

export function createMacroHandlers(
  compilerOptions: PliCompilerOptions | undefined,
  textDocument: TextDocument,
): StatementParser[] {
  const preprocessorHandler = compilerOptions?.macroOptions?.incOnly
    ? createIncOnlyPreprocessorHandler(textDocument)
    : createPreprocessorHandler(textDocument);
  return [preprocessorHandler, createIncludeAltHandler()];
}

/**
 * Macro preprocessor phase. A `Token[] -> Token[]` transformation that parses `%`
 * statements and includes from its input tokens, runs the macro instructions (variable
 * expansion, `%IF`/`%DO`, `%INCLUDE`, `REPLACE`, ...) and passes EXEC SQL/CICS tokens
 * through with macro variables expanded.
 */
export class MacroPreprocessorPhase implements PreprocessorPhase {
  constructor(
    private readonly compilerOptionsResult: CompilerOptionResult | undefined,
    private readonly marginsProcessor: MarginsProcessor,
  ) {}

  async execute(input: PhaseInput): Promise<PhaseResult> {
    const { tokens, unit, uri, textDocument } = input;
    const opts = this.compilerOptionsResult?.options;

    // Parse the incoming tokens for macro statements and build the instruction set.
    const state = new ParserState(tokens, opts);
    const { statements, diagnostics } = await preprocessorParse(
      state,
      createMacroHandlers(opts, textDocument),
    );
    const instructionResult = generateInstructions(statements);

    // Handle the incAfter option - prepend an include instruction.
    const incAfter = opts?.incAfter;
    if (incAfter?.process) {
      instructionResult.entryNode = generateIncAfterInstruction(
        instructionResult.entryNode,
        incAfter,
      );
    }

    const output = await runInstructions(unit, uri, instructionResult, {
      compilerOptions: this.compilerOptionsResult,
      marginsProcessor: this.marginsProcessor,
      createParseHandlers: (includeDocument) =>
        createMacroHandlers(opts, includeDocument),
    });

    return {
      tokens: output.all,
      statements: [...statements, ...output.statements],
      diagnostics: [...diagnostics, ...output.errors],
      references: output.references,
      evaluationResults: output.evaluationResults,
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
  const includeItem = ast.createIncludeItemFile();
  includeItem.fileName = incAfter.process;
  includeItem.token = incAfter.token || null;
  if (incAfter.token) {
    includeItem.token = incAfter.token;
    incAfter.token.element = includeItem;
    incAfter.token.kind = CstNodeKind.IncludeItem_FileID;
  }
  const instruction: InstructionNode = {
    labels: [],
    instruction: createIncludeInstruction([includeItem], false),
    next: existingNode,
  };
  return instruction;
}
