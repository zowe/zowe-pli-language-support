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
import { PLICodes } from "../pli-codes";

/**
 * IBM2615I – Warn when a doType3 statement will execute only once
 */
export function IBM2615I_do_loops_execute_once(
  _: CompilationUnit,
  node: AST.DoStatement,
  acceptor: ValidationAcceptor,
): void {
  const doToken = node.doToken;
  if (!doToken) return;

  // Check doType3
  const dt3 = node.doType3;
  if (!dt3 || (!dt3?.variable && !Array.isArray(dt3.specifications))) return;
  if (dt3?.specifications.length !== 1) return;
  const spec = dt3.specifications[0];

  if (
    spec.to ||
    spec.by ||
    spec.upthru ||
    spec.downthru ||
    spec.repeat ||
    spec.whileOrUntil
  ) {
    return; // Valid iteration spec found
  }

  acceptor(diagnosticFromCode(PLICodes.Warning.IBM2615I, doToken));
}
