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
  ComputationDataAttribute,
  DeclaredItem,
  SyntaxKind,
  DefaultAttribute,
} from "../../syntax-tree/ast";
import { PLICodes } from "../pli-codes";
import { ValidationAcceptor } from "../validator";

// %dcl A(4) FIXED INTERNAL SCAN RESCAN; // throws warning IBM3252I with RESCAN.
// dcl A FIXED SCAN RESCAN; // throws generic IBM1352I with SCAN.

const scanAttributes = (node: DeclaredItem): ComputationDataAttribute[] =>
  node.attributes.filter(
    (attr) =>
      attr.kind === SyntaxKind.ComputationDataAttribute &&
      (attr.type === DefaultAttribute.SCAN ||
        attr.type === DefaultAttribute.RESCAN ||
        attr.type === DefaultAttribute.NOSCAN),
  ) as ComputationDataAttribute[];

export function IBM1352IE_declared_item_pp_scan_repetition(
  node: DeclaredItem,
  accept: ValidationAcceptor,
): void {
  let hasScanAttribute = false;

  scanAttributes(node).forEach((attr) => {
    if (hasScanAttribute) {
      const token = attr.typeToken;
      if (!token) return;
      accept(diagnosticFromCode(PLICodes.Warning.IBM3252I, token, token.image));
    } else {
      hasScanAttribute = true;
    }
  });
}

export function IBM1352IE_declared_item_pli_scan_repetition(
  node: DeclaredItem,
  accept: ValidationAcceptor,
): void {
  scanAttributes(node).forEach((attr) => {
    const token = (attr as ComputationDataAttribute).typeToken;
    if (!token) return;
    accept(diagnosticFromCode(PLICodes.Error.IBM1352I, token, token.image));
  });
}
