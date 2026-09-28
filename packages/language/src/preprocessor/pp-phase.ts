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
import { CancellationToken } from "vscode-languageserver";
import { EvaluationResults } from "./instruction-interpreter";
import { SourceMap } from "./source-map";

export interface PhaseInput {
  text: string;
  sourceMap: SourceMap;
  unit: CompilationUnit;
  uri: URI;
  textDocument: TextDocument;
  /**
   * Cancellation of the build that started this pipeline. A requested cancellation throws
   * `OperationCancelled`.
   */
  cancellation?: CancellationToken;
}

export interface PhaseResult {
  text: string;
  sourceMap: SourceMap;
  statements: Statement[];
  diagnostics: Diagnostic[];
  references: Reference[];
  evaluationResults?: EvaluationResults;
  /**
   * Tokens from this phase's own internal parse that are consumed by the directive they belong to
   * and never reach the `text` output. Already remapped to original-source positions.
   */
  directiveTokens: Token[];
}

export interface PreprocessorPhase {
  execute(input: PhaseInput): Promise<PhaseResult>;
}

/**
 * The no-op result of a phase that short-circuited: text passes through untouched under an identity
 * map.
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
