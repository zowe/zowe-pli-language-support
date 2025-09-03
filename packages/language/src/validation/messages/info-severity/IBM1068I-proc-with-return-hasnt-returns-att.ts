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
import { findFirstNodeOfKind } from "../../../syntax-tree/ast-iterator";
import { ValidationAcceptor } from "../../validator";
import * as PLICodes from "../pli-codes";

/**
 * IBM1068I: If a procedure contains a RETURN statement, it should have the RETURNS attribute specified on its PROCEDURE statement.
 *
 * Triggers if a procedure has a RETURN statement, but doesn't provide a RETURNS attribute.
 *
 */

export function IBM1068I_proc_with_return_hasnt_returns_att(
  node: AST.ProcedureStatement,
  acceptor: ValidationAcceptor,
) {
  const token = node.procToken;
  if (!token) return;
  
  // Check if procedure has RETURNS attribute - return if present
  const hasReturnsAtt = node.options?.some(
    (att) => att.kind === AST.SyntaxKind.ReturnsOption,
  );
  if (hasReturnsAtt) return;
  // Still has to pass proc-with-return-inside-if-with-returns -> option is being read first as 135

  const returnStmt = findFirstNodeOfKind(node, AST.SyntaxKind.ReturnStatement);
  if (!returnStmt) return;

  // Build diagnostic
  const infoRange = tokenToRange(token);
  const infoUri = tokenToUri(token);
  if (!infoRange || !infoUri) return;

  acceptor(Severity.I, PLICodes.Info.IBM1068I.message, {
    code: PLICodes.Info.IBM1068I.fullCode,
    range: infoRange,
    uri: infoUri,
  });
}
