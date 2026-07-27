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
import * as ast from "../../syntax-tree/ast";
import {
  getLabelPrefixName,
  getLabelPrefixNameToken,
} from "../../syntax-tree/ast-utils";
import { CompilationUnit } from "../../workspace/compilation-unit";
import { PLICodes } from "../pli-codes";
import { ValidationAcceptor } from "../validator";

export function IBM1213I_unreferenced_procedure(
  node: ast.ProcedureStatement,
  acceptor: ValidationAcceptor,
  compilationUnit: CompilationUnit,
) {
  const container = node.container;
  if (container?.kind !== ast.SyntaxKind.Statement) {
    return;
  }
  // Check if the procedure is part of a different procedure
  // This indicates that the procedure is not externally visible
  const parentProc = ast.getContainer(
    container,
    ast.SyntaxKind.ProcedureStatement,
  );
  if (!parentProc) {
    // If none exists, we can safely assume this is an external procedure
    return;
  }
  const labels = container.labels;
  const label = labels[0];
  const nameToken = getLabelPrefixNameToken(label);
  const name = getLabelPrefixName(label);
  if (!label || !nameToken || !name) {
    return;
  }
  for (const label of labels) {
    const references = compilationUnit.referencesCache.findReferences(label);
    for (const ref of references) {
      if (ref.owner.container?.kind === ast.SyntaxKind.LabelPrefix) {
        // The label prefix's own name reference — not a real usage
        continue;
      }
      if (
        ref.owner.container?.container?.container?.kind !==
        ast.SyntaxKind.EndStatement
      ) {
        // The label is referenced somewhere, so we don't generate a warning
        return;
      }
    }
  }
  acceptor(diagnosticFromCode(PLICodes.Warning.IBM1213I, nameToken, name));
}
