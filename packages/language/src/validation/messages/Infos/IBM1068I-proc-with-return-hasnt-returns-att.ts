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
  Severity,
  tokenToRange,
  tokenToUri,
} from "../../../language-server/types";
import * as AST from "../../../syntax-tree/ast";
import { ValidationAcceptor } from "../../validator";
import * as PLICodes from "./../pli-codes";

export function IBM1068I_proc_with_return_hasnt_returns_att(
  node: AST.ProcedureStatement,
  acceptor: ValidationAcceptor,
) {
  const token = node.procToken;
  if (!token) return;

  const hasReturnStatement = node.statements;
  console.log('STATEMENTS: ', hasReturnStatement)

  const infoRange = tokenToRange(token);
  const infoUri = tokenToUri(token);
  if (!infoRange || !infoUri) return;

  acceptor(
    Severity.I, PLICodes.Info.IBM1068I.message, {
      code: PLICodes.Info.IBM1068I.fullCode,
      range: infoRange,
      uri: infoUri,
    }
  )
}