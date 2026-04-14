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
import { ReferenceItem, SyntaxKind } from "../../syntax-tree/ast";
import { CompilationUnit } from "../../workspace/compilation-unit";
import { PLICodes } from "../pli-codes";
import { retrieveProcedureFromLabelPrefix } from "../utils";
import { ValidationAcceptor } from "../validator";

export function checkProcedureCallsDimensions(
  node: ReferenceItem,
  acceptor: ValidationAcceptor,
  compilationUnit: CompilationUnit,
): void {
  if (
    node.ref &&
    node.ref.node &&
    node.ref.node.kind === SyntaxKind.LabelPrefix
  ) {
    const procedure = retrieveProcedureFromLabelPrefix(node.ref.node);
    if (procedure && node.dimensions.length > 1) {
      acceptor(
        diagnosticFromCode(
          PLICodes.Severe.IBM1704I,
          node.ref.token,
          node.ref.token.image,
        ),
      );
    }
  }
}
