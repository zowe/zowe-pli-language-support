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
import { CallStatement, SyntaxKind } from "../../syntax-tree/ast";
import { PLICodes } from "../pli-codes";
import { resolveProcedureFromCall } from "../utils";
import { ValidationAcceptor } from "../validator";

export function IBM3970IS_IBM3971IS_check_pp_call_procedure(
  node: CallStatement,
  acceptor: ValidationAcceptor,
): void {
  const procedure = resolveProcedureFromCall(node);
  const refItem = node.call?.element?.element;
  const callToken = refItem?.ref?.token;
  if (!procedure || !callToken) {
    if (callToken) {
      acceptor(diagnosticFromCode(PLICodes.Severe.IBM3968I, callToken));
    }
    return;
  }
  if (procedure.statement) {
    acceptor(diagnosticFromCode(PLICodes.Severe.IBM3971I, callToken));
  }
  if (
    procedure.options.some((option) => option.kind === SyntaxKind.ReturnsOption)
  ) {
    acceptor(diagnosticFromCode(PLICodes.Severe.IBM3970I, callToken));
  }
}
