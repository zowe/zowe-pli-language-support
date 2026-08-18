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
import { tokenize } from "../parser/tokenizer";
import * as ast from "../syntax-tree/ast";
import { CstNodeKind } from "../syntax-tree/cst";
import {
  CompilerOptionResult,
  CompilerOptions as PliCompilerOptions,
} from "./compiler-options/options";
import {
  CompilerOptions,
  getEffectiveIncludeAlt,
} from "./compiler-options/options-pli";
import { generateInstructions } from "./instruction-generator";
import { runInstructions } from "./instruction-interpreter";
import { createIncludeInstruction, InstructionNode } from "./instructions";
import { MarginsProcessor } from "./pli-margins-processor";
import {
  passthroughPhaseResult,
  PhaseInput,
  PhaseResult,
  PreprocessorPhase,
} from "./pp-phase";
import { extractDirectiveTokens } from "./token-annotator";
import { serializeTokens } from "./token-serializer";

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
 * Macro preprocessor phase. A `{text, sourceMap} -> {text, sourceMap}` transform: tokenizes
 * its own input text (the interpreter's internals stay token-based), parses `%` statements
 * and includes, runs the macro
 * instructions (variable expansion, `%IF`/`%DO`, `%INCLUDE`, `REPLACE`, ...), and serializes
 * the resulting tokens back to text plus a map to this phase's input (`serializeTokens`).
 * EXEC SQL/CICS text passes through with macro variables expanded.
 */
export class MacroPreprocessorPhase implements PreprocessorPhase {
  constructor(
    private readonly compilerOptionsResult: CompilerOptionResult | undefined,
    private readonly marginsProcessor: MarginsProcessor,
  ) {}

  async execute(input: PhaseInput): Promise<PhaseResult> {
    const { text, unit, uri, textDocument } = input;
    const opts = this.compilerOptionsResult?.options;

    if (!mayContainMacroStatements(text, opts)) {
      return passthroughPhaseResult(input);
    }

    const tokenization = tokenize(text, uri);

    // Parse the incoming tokens for macro statements and build the instruction set.
    const state = new ParserState(tokenization.tokens, opts);
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

    const serialized = serializeTokens(output.all, uri, text);

    // Token statements have served their purpose and are no longer useful.
    // We blank them out (remove their array), so that the garbage collector can reclaim the memory
    for (const stmt of statements) {
      if (stmt.value?.kind === ast.SyntaxKind.TokenStatement) {
        stmt.value.tokens = ast.emptyList();
      }
    }

    // Fragments inside %INCLUDEd files already carry file-local offsets; the entry
    // file's source map must only remap the entry file's own exec tokens.
    const ownExecTokens: t.Token[] = [];
    const foreignExecTokens: t.Token[] = [];
    for (const token of output.execTokens) {
      if (token.uri) {
        (token.uri.toString() === uri.toString()
          ? ownExecTokens
          : foreignExecTokens
        ).push(token);
      }
    }

    return {
      text: serialized.text,
      sourceMap: serialized.sourceMap,
      statements: [...statements, ...output.statements],
      diagnostics: [
        ...tokenization.diagnostics,
        ...diagnostics,
        ...output.errors,
      ],
      references: output.references,
      evaluationResults: output.evaluationResults,
      directiveTokens: [
        ...extractDirectiveTokens(tokenization.tokens, input.sourceMap),
        ...extractDirectiveTokens(ownExecTokens, input.sourceMap),
        ...foreignExecTokens,
      ],
    };
  }
}

/**
 * Cheap pre-scan deciding whether the macro phase can be skipped as a guaranteed identity
 * transform. Every construct the phase acts on requires one of: a `%` character (all `%`
 * statements), the effective alternate-include keyword (`++INCLUDE`-style, only active with
 * `PP(INCLUDE)`), or an `INCAFTER(PROCESS(...))` option. False positives (e.g. a `%` inside
 * a string literal) merely run the phase; only false negatives would be unsafe, and each
 * trigger below is a strict textual prerequisite of the corresponding construct's token.
 */
function mayContainMacroStatements(
  text: string,
  opts: PliCompilerOptions | undefined,
): boolean {
  if (opts?.incAfter?.process) {
    return true;
  }
  if (text.includes("%")) {
    return true;
  }
  // The alternate-include keyword (e.g. `++INCLUDE` with `PP(INCLUDE)`) is configurable
  // text, so escape any regex metacharacters in it and look for it as a case-insensitive
  // literal substring.
  const includeAlt = opts ? getEffectiveIncludeAlt(opts) : undefined;
  if (includeAlt) {
    const escaped = includeAlt.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(escaped, "i").test(text);
  }
  return false;
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
