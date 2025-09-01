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
import { forEachNode } from "../../../syntax-tree/ast-iterator";
import { ValidationAcceptor } from "../../validator";
import * as PLICodes from "./../pli-codes";

/**
 * IBM1068I: If a procedure contains a RETURN statement, it should have the RETURNS attribute specified on its PROCEDURE statement.
 *
 * Triggers if a procedure has a RETURN statement, but doesn't provide a RETURNS attribute.
 *
 */

function visitAll(node: AST.SyntaxNode, action: (n: AST.SyntaxNode) => void) {
  // Run your custom action
  action(node);

  // Recurse manually into children
  forEachNode(node, (child) => {
    console.log('CURRENT NODE: ', child.kind);
    visitAll(child, action);
  });
}

function collectReturnStatements(
  stmts: AST.Statement[] | undefined,
  visited = new Set<object>(),
): AST.ReturnStatement[] {
  if (!stmts) return [];

  const found: AST.ReturnStatement[] = [];

  for (const stmt of stmts) {
    if (!stmt.value) continue;

    // Avoid infinite recursion (cyclical references)
    if (visited.has(stmt.value)) continue;
    visited.add(stmt.value);

    // If this is directly a RETURN
    if (stmt.value.kind === AST.SyntaxKind.ReturnStatement) {
      found.push(stmt.value as AST.ReturnStatement);
    }

    // Traverse *all* properties of this node dynamically
    for (const key of Object.keys(stmt.value)) {
      const prop = (stmt.value as any)[key];
      if (!prop) continue;

      // Case 1: a single nested Statement
      if (prop._debugKind === "Statement") {
        found.push(...collectReturnStatements([prop], visited));
      }

      // Case 2: an array of nested Statements
      if (
        Array.isArray(prop) &&
        prop.every((p) => p?._debugKind === "Statement")
      ) {
        found.push(...collectReturnStatements(prop, visited));
      }
    }
  }

  return found;
}

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

  const returnStmts = collectReturnStatements(node.statements);
  console.log('HAS RETURN STATEMENTS: ', returnStmts.length);

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
