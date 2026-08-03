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

import { ValidationAcceptor } from "../validator";
import * as AST from "../../syntax-tree/ast";
import { getLabelPrefixNameToken } from "../../syntax-tree/ast-utils";
import { diagnosticFromCode } from "../../language-server/types";
import * as PLICodes from "../pli-codes";
import {
  TraversalState,
  traverseAllNodes,
} from "../../syntax-tree/ast-iterator";

/**
 * IBM2412I: If a procedure contains a RETURN statement, it should have the RETURNS attribute
 * specified on its PROCEDURE statement.
 *
 * IBM2409I: RETURN statement without an expression is invalid inside a nested PROCEDURE that
 * specifies the RETURNS attribute. All RETURN statements inside functions must specify a value
 * to be returned.
 *
 * IBM2410I: Functions must contain at least one RETURN statement.
 *
 * @param node The AST node being analyzed.
 * @param acceptor The mechanism used to collect validation issues.
 * @returns Validation results or diagnostics, as appropriate.
 */
export function IBM2412I_IBM2410I_IBM2409I_handle_return_stmt_and_returns_att(
  node: AST.ProcedureStatement,
  acceptor: ValidationAcceptor,
): void {
  const returnStmts: AST.ReturnStatement[] = [];

  traverseAllNodes(node, (n) => {
    if (n !== node && n.kind === AST.SyntaxKind.ProcedureStatement)
      return TraversalState.Stop;
    if (n.kind === AST.SyntaxKind.ReturnStatement)
      returnStmts.push(n as AST.ReturnStatement);

    return TraversalState.Continue;
  });

  const hasReturnsAtt = node.options?.some(
    (att) => att.kind === AST.SyntaxKind.ReturnsOption,
  );

  if (returnStmts.length === 0 && !hasReturnsAtt) return;

  const returnSomething: AST.ReturnStatement[] = [];
  const returnNothing: AST.ReturnStatement[] = [];

  for (const ret of returnStmts) {
    if (ret.expression) returnSomething.push(ret);
    else returnNothing.push(ret);
  }

  if (hasReturnsAtt && returnSomething.length > 0 && returnNothing.length === 0)
    return;

  // IBM2409I: All RETURN statements inside functions that specified the RETURNS attribute must specify a value to be returned.
  if (hasReturnsAtt && returnNothing.length > 0) {
    for (const ret of returnNothing) {
      const returnToken = ret.returnToken;
      if (!returnToken) return;

      acceptor(diagnosticFromCode(PLICodes.Error.IBM2409I, returnToken));
    }
    return;
  }

  const procToken = node.procToken;
  if (!procToken) return;

  //IBM2410I: Procedures with RETURNS attribute must contain at least one RETURN statement.
  if (hasReturnsAtt && returnStmts.length === 0) {
    const procName =
      node.container?.kind === AST.SyntaxKind.Statement
        ? (getLabelPrefixNameToken(node.container.labels[0])?.originalImage ??
          "<unnamed>")
        : "<unnamed>";

    acceptor(diagnosticFromCode(PLICodes.Error.IBM2410I, procToken, procName));
  }

  // IBM2412I: If a procedure contains a RETURN (...) statement, it should have the RETURNS attribute.
  if (returnSomething.length > 0 && !hasReturnsAtt) {
    acceptor(diagnosticFromCode(PLICodes.Error.IBM2412I, procToken));
  }
}
