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

import { Token } from "../parser/tokens";
import { Reference, Statement } from "../syntax-tree/ast";
import { Diagnostic } from "../language-server/types";
import { EvaluationResults } from "./instruction-interpreter";
import { PhaseInput, PhaseResult, PreprocessorPhase } from "./pp-phase";

export interface PipelineResult {
  tokens: Token[];
  statements: Statement[];
  diagnostics: Diagnostic[];
  references: Reference[];
  evaluationResults: EvaluationResults;
}

export async function runPipeline(
  phases: PreprocessorPhase[],
  input: PhaseInput,
): Promise<PipelineResult> {
  let tokens = input.tokens;
  const allStatements: Statement[] = [];
  const allDiagnostics: Diagnostic[] = [];
  const allReferences: Reference[] = [];
  let evaluationResults: EvaluationResults = {
    branchExecutions: new Map(),
  };

  for (const phase of phases) {
    const result: PhaseResult = await phase.execute({ ...input, tokens });
    tokens = result.tokens;
    allStatements.push(...result.statements);
    allDiagnostics.push(...result.diagnostics);
    allReferences.push(...result.references);
    if (result.evaluationResults) {
      for (const [key, value] of result.evaluationResults.branchExecutions) {
        evaluationResults.branchExecutions.set(key, value);
      }
    }
  }

  return {
    tokens,
    statements: allStatements,
    diagnostics: allDiagnostics,
    references: allReferences,
    evaluationResults,
  };
}
