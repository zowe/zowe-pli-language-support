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

import { PLICodes } from "../../../validation/messages";
import {
  diagnosticFromCode,
} from "../../../language-server/types";
import * as AST from "../../../syntax-tree/ast";
import { ValidationAcceptor } from "../../validator";

/**
 * IBM1059I: The ERROR condition will be raised if SELECT statement contains no OTHERWISE clause.
 */
export function IBM1059I_select_without_otherwise(
  node: AST.SelectStatement,
  acceptor: ValidationAcceptor,
) {
  const token = node.selectToken;
  if (!token) return;

  const otherwiseStatement = node.statements?.some(
    (stmt) => stmt.kind === AST.SyntaxKind.OtherwiseStatement,
  );
  if (otherwiseStatement) return;

  acceptor(diagnosticFromCode(PLICodes.Info.IBM1059I, token));
}
