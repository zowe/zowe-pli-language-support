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
import { CompilationUnit } from "../workspace/compilation-unit";
import { URI } from "../utils/uri";
import { Reference, Statement } from "../syntax-tree/ast";
import { Diagnostic } from "../language-server/types";
import { TextDocument } from "vscode-languageserver-textdocument";
import { EvaluationResults } from "./instruction-interpreter";

export interface PhaseInput {
  tokens: Token[];
  unit: CompilationUnit;
  uri: URI;
  textDocument: TextDocument;
}

export interface PhaseResult {
  tokens: Token[];
  statements: Statement[];
  diagnostics: Diagnostic[];
  references: Reference[];
  evaluationResults?: EvaluationResults;
}

export interface PreprocessorPhase {
  execute(input: PhaseInput): Promise<PhaseResult>;
}
