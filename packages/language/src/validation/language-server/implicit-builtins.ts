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

import { diagnosticFromCode, Severity } from "../../language-server/types";
import { BuiltinsUri, KNOWN_BUILTINS } from "../../workspace/builtins";
import { PLICodes } from "../pli-codes";
import * as AST from "../../syntax-tree/ast";
import { getNameToken } from "../../linking/tokens";
import { CompilationUnit } from "../../workspace/compilation-unit";
import { ValidationAcceptor } from "../validator";

// Builtins after this offset are valid to be used even if not listed
let knownBuiltinsOffset = 0;

// This function checks if a builtin is implicitly declared and if it is, it reports a warning diagnostic.
// Note that builtins can be "contextually declared" when used with dimensions, so we skip the check in that case.
// From the language reference manual:
//   Some built-ins do not require arguments. You must either explicitly declare these with the BUILTIN
//   attribute or contextually declare them by including a null argument list in the reference—for example,
//   ONCHAR(). Otherwise, the name is not recognized as a built-in.
export function checkImplicitBuiltins(
  node: AST.ReferenceItem,
  acceptor: ValidationAcceptor,
  compilationUnit: CompilationUnit,
): void {
  // When using dimensions, the builtin is automatically contextually declared, so we can skip the check.
  if (node.dimensions.length > 0) {
    return;
  }

  const nameToken = node.ref?.node ? getNameToken(node.ref.node) : undefined;
  const uri = nameToken?.uri?.toString();

  // Check if the reference item is a builtin.
  if (!node.ref || !nameToken || !uri || uri !== BuiltinsUri) {
    return;
  }

  // This is a rather hacky way to determine what are "valid" builtins
  // We should have a separate file for that
  // TODO: Refactor this, probably when fixing the LSP features for builtins
  if (knownBuiltinsOffset === 0) {
    const file = compilationUnit.services.files.getDocument(uri);
    if (!file) {
      return;
    }
    const text = file.getText();
    knownBuiltinsOffset = text.indexOf(KNOWN_BUILTINS);
  }
  if (nameToken.startOffset < knownBuiltinsOffset) {
    acceptor({
      ...diagnosticFromCode(
        PLICodes.Error.IBM1373I,
        node.ref.token,
        node.ref.text,
      ),
      severity: Severity.W, // Downgrade to a warning.
    });
  }
}
