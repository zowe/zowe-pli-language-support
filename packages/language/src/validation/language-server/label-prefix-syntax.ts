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
import { PLICodes } from "../pli-codes";
import * as AST from "../../syntax-tree/ast";
import { CompilationUnit } from "../../workspace/compilation-unit";
import { ValidationAcceptor } from "../validator";

export function checkLabelPrefixSyntax(
  node: AST.ReferenceItem,
  acceptor: ValidationAcceptor,
  compilationUnit: CompilationUnit,
): void {
  if (
    node.dimensions.length === 0 ||
    node.container?.kind !== AST.SyntaxKind.LabelPrefix
  ) {
    // No need to check anything if its not a label, or if there are no dimensions attached
    return;
  }
  if (node.dimensions.length > 1) {
    acceptor(diagnosticFromCode(PLICodes.Severe.IBM3988I, node.ref?.token));
  }
  const dim = node.dimensions[0];
  for (const entry of dim.dimensions) {
    if (entry.lower !== null) {
      // Can only have a direct reference to a label, not a range
      acceptor(diagnosticFromCode(PLICodes.Severe.IBM3988I, entry.lower.token));
      continue;
    }
    if (entry.upper !== null) {
      const value = entry.upper.expression;
      if (value && value.kind !== AST.SyntaxKind.NumberLiteral) {
        // Label prefixes can only be indexed using a number literal
        acceptor(
          diagnosticFromCode(PLICodes.Severe.IBM3988I, entry.upper.token),
        );
      }
    }
  }
}
