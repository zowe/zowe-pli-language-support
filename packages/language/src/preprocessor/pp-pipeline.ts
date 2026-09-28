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

import { Reference, Statement } from "../syntax-tree/ast";
import { Diagnostic } from "../language-server/types";
import { Token } from "../parser/tokens";
import { URI } from "../utils/uri";
import { EvaluationResults } from "./instruction-interpreter";
import { PhaseInput, PhaseResult, PreprocessorPhase } from "./pp-phase";
import { SourceMap } from "./source-map";
import { largePush } from "../utils/collections";
import { interruptAndCheck } from "../utils/promises";

export interface PipelineResult {
  text: string;
  sourceMap: SourceMap;
  statements: Statement[];
  diagnostics: Diagnostic[];
  references: Reference[];
  evaluationResults: EvaluationResults;
  /** See `PhaseResult.directiveTokens` - collected across every phase. */
  directiveTokens: Token[];
}

/**
 * Runs the ordered `PP()` phases as `{text, sourceMap} -> {text, sourceMap}` transforms, composing
 * each phase's map into a single map from the original input text to the final output text.
 */
export async function runPipeline(
  phases: PreprocessorPhase[],
  input: PhaseInput,
): Promise<PipelineResult> {
  let text = input.text;
  let sourceMap = input.sourceMap;
  const allStatements: Statement[] = [];
  const allDiagnostics: Diagnostic[] = [];
  const allReferences: Reference[] = [];
  const allDirectiveTokens: Token[] = [];
  let evaluationResults: EvaluationResults = {
    branchExecutions: new Map(),
  };

  for (const phase of phases) {
    if (input.cancellation) {
      await interruptAndCheck(input.cancellation);
    }
    const inputMap = sourceMap;
    const result: PhaseResult = await phase.execute({
      ...input,
      text,
      sourceMap,
    });
    text = result.text;
    sourceMap = SourceMap.compose(sourceMap, result.sourceMap);
    // No argument spreads: they throw a RangeError beyond ~100k elements, and
    // several of these lists scale with file size.
    largePush(allStatements, result.statements);
    largePush(
      allDiagnostics,
      remapPhaseDiagnostics(result.diagnostics, inputMap, input.uri),
    );
    largePush(allReferences, result.references);
    largePush(allDirectiveTokens, result.directiveTokens);
    if (result.evaluationResults) {
      for (const [key, value] of result.evaluationResults.branchExecutions) {
        evaluationResults.branchExecutions.set(key, value);
      }
    }
  }

  return {
    text,
    sourceMap,
    statements: allStatements,
    diagnostics: allDiagnostics,
    references: allReferences,
    evaluationResults,
    directiveTokens: allDirectiveTokens,
  };
}

/**
 * Resolves a phase's diagnostic ranges (offsets into its own input text) back to the original
 * source. Diagnostics for other files or without a range pass through unchanged.
 */
function remapPhaseDiagnostics(
  diagnostics: Diagnostic[],
  inputMap: SourceMap,
  uri: URI,
): Diagnostic[] {
  const uriString = uri.toString();
  return diagnostics.map((diagnostic) => {
    if (!diagnostic.range || diagnostic.uri !== uriString) {
      return diagnostic;
    }
    const start = inputMap.mapToOriginal(diagnostic.range.start);
    const end = inputMap.mapExclusiveEnd(
      diagnostic.range.start,
      diagnostic.range.end,
    );
    if (!start || !end) {
      return diagnostic;
    }
    return {
      ...diagnostic,
      uri: start.uri?.toString() ?? diagnostic.uri,
      range: { start: start.offset, end: end.offset },
    };
  });
}
