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
import { diagnosticFromCode } from "../../language-server/types";
import { ProcedureStatement } from "../../syntax-tree/ast";
import { CompilationUnit } from "../../workspace/compilation-unit";
import { LspCodes } from "../lsp-codes";
import { ValidationAcceptor } from "../validator";

export function checkProcedureEnd(
  node: ProcedureStatement,
  acceptor: ValidationAcceptor,
  compilationUnit: CompilationUnit,
): void {
  if (
    !node.end?.endToken &&
    // TODO: Find a way to also support the multi-close option here
    !compilationUnit.compilerOptions.rules?.multiClose
  ) {
    // If the procedure has no end, and multi-close is not enabled,
    // we provide an additional diagnostic (in addition to the parser error)
    // to indicate that the procedure is missing an END statement.
    // This should help users identify the problem more easily.
    // Note: This shows the diagnostic on the PROC token, not a procedure label
    acceptor(diagnosticFromCode(LspCodes.MissingEnd, node.procToken));
  }
}
