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

import {
  CodeAction,
  CodeActionKind,
  Diagnostic,
  TextEdit,
} from "vscode-languageserver-types";
import { URI } from "../../utils/uri";
import { CompilationUnitHandler } from "../../workspace/compilation-unit";
import { diagnosticToLSP, fullCode } from "../types";
import { LspCodes } from "../../validation/lsp-codes";

export function sourceActionUppercaseAllText(
  caseDiagnostics: Diagnostic[],
): CodeAction {
  // Group diagnostics by URI
  const diagnosticsByUri: { [uri: string]: Diagnostic[] } = {};

  for (const diagnostic of caseDiagnostics) {
    if (!diagnostic.data || !diagnostic.data.uri) {
      console.error(
        "Diagnostic data is missing for source action uppercase all text.",
      );
      continue;
    }
    const uri = diagnostic.data.uri;
    if (!diagnosticsByUri[uri]) {
      diagnosticsByUri[uri] = [];
    }
    diagnosticsByUri[uri].push(diagnostic);
  }

  // Create text edits for each file
  const changes: { [uri: string]: TextEdit[] } = {};

  for (const [uri, diagnostics] of Object.entries(diagnosticsByUri)) {
    changes[uri] = diagnostics
      .filter((d) => d.range && d.data?.text)
      .map((diagnostic) =>
        TextEdit.replace(
          diagnostic.range!,
          (diagnostic.data?.text || "").toUpperCase(),
        ),
      );
  }

  const action: CodeAction = {
    title: `Convert all to uppercase (${caseDiagnostics.length} instances)`,
    kind: CodeActionKind.SourceFixAll,
    diagnostics: caseDiagnostics,
    edit: {
      changes,
    },
  };

  return action;
}

export function getCaseDiagnosticsFromCompilationUnit(
  uri: string,
  compilationUnitHandler: CompilationUnitHandler,
): Diagnostic[] {
  try {
    const unit = compilationUnitHandler.getCompilationUnit(URI.parse(uri));
    if (!unit) return [];

    const caseDiagnostics = unit.diagnostics
      .getAll()
      .filter((d) => d.code === fullCode(LspCodes.UpperCase));

    return caseDiagnostics
      .map((d) => diagnosticToLSP(unit, d))
      .filter((d) => d !== undefined) as Diagnostic[];
  } catch (error) {
    return [];
  }
}

export async function applySourceActions(
  uri: string,
  compilationUnitHandler: CompilationUnitHandler,
): Promise<CodeAction[] | undefined> {
  const actions: CodeAction[] = [];

  const caseDiagnostics = getCaseDiagnosticsFromCompilationUnit(
    uri,
    compilationUnitHandler,
  );
  if (caseDiagnostics.length > 0) {
    const fixAllAction = sourceActionUppercaseAllText(caseDiagnostics);
    actions.push(fixAllAction);
  }

  if (!actions.length) return undefined;
  return actions;
}
