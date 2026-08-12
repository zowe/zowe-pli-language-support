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

import { CompilationUnit } from "../workspace/compilation-unit";
import { URI } from "../utils/uri";
import { Reference, Statement } from "../syntax-tree/ast";
import { Diagnostic } from "../language-server/types";
import { Token } from "../parser/tokens";
import { TextDocument } from "vscode-languageserver-textdocument";
import { EvaluationResults } from "./instruction-interpreter";
import { SourceMap } from "./source-map";

export interface PhaseInput {
  text: string;
  sourceMap: SourceMap;
  unit: CompilationUnit;
  uri: URI;
  textDocument: TextDocument;
}

export interface PhaseResult {
  text: string;
  sourceMap: SourceMap;
  statements: Statement[];
  diagnostics: Diagnostic[];
  references: Reference[];
  evaluationResults?: EvaluationResults;
  /**
   * Tokens from this phase's *own* internal parse (e.g. the `%IF`/`%DCL`/`EXEC`/`DFHRESP`
   * keyword and name tokens) that carry `.kind`/`.element` CST attachments but are entirely
   * consumed by the directive they belong to - they never reach this phase's `text` output,
   * so they would otherwise be unreachable via `unit.services.files.getTokens(uri)` (which
   * only sees the pipeline's final, post-substitution tokens). LSP features that inspect a
   * directive itself rather than its expansion (`pli/skippedCode`, hovering a `%DCL`'d
   * variable, semantic-highlighting a macro variable reference, ...) need these. Already
   * remapped to original-source positions via this phase's own `PhaseInput.sourceMap`.
   */
  directiveTokens: Token[];
}

export interface PreprocessorPhase {
  execute(input: PhaseInput): Promise<PhaseResult>;
}

/**
 * The no-op result of a phase that short-circuited: text passes through untouched under an
 * identity map (which `SourceMap.compose` collapses, so downstream mapping is unaffected).
 * Phases use this when a cheap pre-scan proves their constructs cannot occur in the input -
 * skipping the phase's own full tokenize/parse pass, which otherwise dominates pipeline
 * time on files that don't use the preprocessor (see `test/benchmarks/phases.bench.ts`).
 */
export function passthroughPhaseResult(input: PhaseInput): PhaseResult {
  return {
    text: input.text,
    sourceMap: SourceMap.identity(input.text, input.uri),
    statements: [],
    diagnostics: [],
    references: [],
    directiveTokens: [],
  };
}
