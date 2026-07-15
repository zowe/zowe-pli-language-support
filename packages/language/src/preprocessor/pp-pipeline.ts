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
 * Runs the ordered `PP()` phases as `{text, sourceMap} -> {text, sourceMap}` transforms,
 * composing each phase's own map into a single map from the pipeline's original input text
 * all the way to the final phase's output text. The
 * caller (`PliLexer`) lexes that final text exactly once and uses the composed map to
 * recover original positions and cross-reference metadata.
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
    const inputMap = sourceMap;
    const result: PhaseResult = await phase.execute({
      ...input,
      text,
      sourceMap,
    });
    text = result.text;
    sourceMap = SourceMap.compose(sourceMap, result.sourceMap);
    allStatements.push(...result.statements);
    allDiagnostics.push(
      ...remapPhaseDiagnostics(result.diagnostics, inputMap, input.uri),
    );
    allReferences.push(...result.references);
    allDirectiveTokens.push(...result.directiveTokens);
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
 * A phase reports its diagnostics with offsets into its own *input* text (its tokenizer and
 * statement parsers run over that text), which only equals real document offsets while no
 * earlier phase has rewritten the text. Resolves each such range back through the map that
 * produced the phase's input, so reported positions always land in the original source.
 * Diagnostics for other files (e.g. raised inside an `EXEC SQL INCLUDE`d file, whose offsets
 * are already that file's own) and diagnostics without a range or uri pass through unchanged.
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
    // `range.end` is exclusive - mapping it directly would resolve a boundary-exact end
    // through the NEXT segment (possibly a foreign `%INCLUDE` one); see `mapExclusiveEnd`.
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
