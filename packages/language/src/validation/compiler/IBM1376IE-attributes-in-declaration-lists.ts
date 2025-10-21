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
import {
  DeclareStatement,
  SyntaxKind,
  SyntaxNode,
} from "../../syntax-tree/ast";
import { forEachNode } from "../../syntax-tree/ast-iterator";
import { PLICodes } from "../pli-codes";
import { ValidationAcceptor } from "../validator";

export function IBM1376IE_attributes_in_declaration_lists(
  node: DeclareStatement,
  accept: ValidationAcceptor,
): void {
  const checkNode = (hasLevel: boolean) => (child: SyntaxNode) => {
    if (child.kind === SyntaxKind.DeclaredItem) {
      if (hasLevel && child.levelToken) {
        accept(diagnosticFromCode(PLICodes.Error.IBM1376I, child.levelToken));
      }

      const childHasLevel = child.level !== undefined;
      const nextCheckNode = checkNode(childHasLevel);
      child.elements.forEach(nextCheckNode);
    } else {
      forEachNode(child, checkNode(false));
    }
  };

  node.items.forEach(checkNode(false));
}
