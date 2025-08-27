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
  // Check for RETURN statements
  const returnStmt = node.statements?.find(
    (stmt) => stmt.value?.kind === AST.SyntaxKind.ReturnStatement,
  );
  if (!returnStmt) return;

  // Type-narrowing in order to access token
  if (returnStmt.value?.kind !== AST.SyntaxKind.ReturnStatement) return;
  const typedReturn = returnStmt.value as AST.ReturnStatement;

  // Check if procedure has RETURNS attribute - return if present
  const hasReturnsAtt = node.options?.some(
    (att) => att.kind === AST.SyntaxKind.ReturnsOption,
  );
  if (hasReturnsAtt) return;

  // Retrieve token of RETURN statement (NOT from the ProcedureStatement)
  const token = typedReturn.returnToken;
  if (!token) return;

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
