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
import { CallStatement } from "../../syntax-tree/ast";
import { PLICodes } from "../pli-codes";
import { resolveProcedureFromCall } from "../utils";
import { ValidationAcceptor } from "../validator";

export function IBM3323I_IBM3324I_check_argument_count(
  node: CallStatement,
  acceptor: ValidationAcceptor,
): void {
  const procedure = resolveProcedureFromCall(node);
  if (!procedure) {
    return;
  }
  const callToken = node.call!.procedure!.token;
  const expectedArgs = procedure.parameters.length;
  const providedArgs = node.call?.args1?.list.length || 0;

  if (providedArgs < expectedArgs) {
    acceptor(
      diagnosticFromCode(PLICodes.Warning.IBM3323I, callToken, callToken.image),
    );
  } else if (providedArgs > expectedArgs) {
    acceptor(
      diagnosticFromCode(PLICodes.Warning.IBM3324I, callToken, callToken.image),
    );
  }
}
