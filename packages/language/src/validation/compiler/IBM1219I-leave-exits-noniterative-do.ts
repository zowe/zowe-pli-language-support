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
import * as AST from "../../syntax-tree/ast";
import { ValidationAcceptor } from "../validator";
import { CompilationUnit } from "../../workspace/compilation-unit";
import * as PLICodes from "../pli-codes";

/**
 * IBM1219I – LEAVE will exit noniterative DO.
 *
 * Warn when an unlabeled LEAVE sits inside a non-iterative DO.
 */
export function IBM1219I_leave_exits_noniterative_do(
  _: CompilationUnit,
  node: AST.LeaveStatement,
  acceptor: ValidationAcceptor,
): void {
  const leaveToken = node.leaveToken;

  // If LEAVE has a label, rule does not apply. If no token is found - return
  if (node.label || !leaveToken) return;

  // Find nearest enclosing DO
  let ancestor: AST.SyntaxNode | null = node.container;
  let nearestDo: AST.DoStatement | undefined;
  while (ancestor) {
    if (ancestor.kind === AST.SyntaxKind.DoStatement) {
      nearestDo = ancestor;
      break;
    }
    ancestor = ancestor.container;
  }
  if (!nearestDo) return;

  // Nearest DO must be a non-iterative DO-group
  if (nearestDo.doType2 || nearestDo.doType3 || nearestDo.doType4) return;

  acceptor(diagnosticFromCode(PLICodes.Warning.IBM1219I, leaveToken));
}
