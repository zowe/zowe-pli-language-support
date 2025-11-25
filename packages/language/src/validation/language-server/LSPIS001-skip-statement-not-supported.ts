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
import { diagnosticFromCode } from "../../language-server/types";
import { LspCodes } from "../lsp-codes";

export function LSPIS001_standalone_skip_directive_not_supported(
  node: AST.SkipDirective,
  acceptor: ValidationAcceptor,
): void {
  if (node.kind !== AST.SyntaxKind.SkipDirective || !node.token) return;
  acceptor(diagnosticFromCode(LspCodes.SkipDirective.InvalidSkip, node.token));
}
