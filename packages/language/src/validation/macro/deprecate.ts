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
import { getLabelPrefixNameToken } from "../../syntax-tree/ast-utils";
import { ValidationAcceptor } from "../validator";
import { CompilationUnit } from "../../workspace/compilation-unit";
import { PLICodes } from "../pli-codes";

export function MACRO_Deprecate(
  node: AST.ProcedureStatement,
  acceptor: ValidationAcceptor,
  compilationUnit: CompilationUnit,
) {
  if (
    !compilationUnit.compilerOptions.macroOptions.deprecate &&
    !compilationUnit.compilerOptions.macroOptions.deprecateNext
  ) {
    return;
  }

  if (
    compilationUnit.compilerOptions.macroOptions.deprecate?.size === 0 &&
    compilationUnit.compilerOptions.macroOptions.deprecateNext?.size === 0
  ) {
    return;
  }

  const nameTokens =
    node.container?.kind === AST.SyntaxKind.Statement
      ? node.container.labels
          ?.map((label) => getLabelPrefixNameToken(label))
          .filter((token) => token !== null) || []
      : [];

  if (!nameTokens.length) return;

  for (const nameToken of nameTokens) {
    const name = nameToken.image;

    if (
      compilationUnit.compilerOptions.macroOptions.deprecate &&
      compilationUnit.compilerOptions.macroOptions.deprecate.has(name)
    ) {
      acceptor(diagnosticFromCode(PLICodes.Error.IBM3660I, nameToken, name));
    }
    if (
      compilationUnit.compilerOptions.macroOptions.deprecateNext &&
      compilationUnit.compilerOptions.macroOptions.deprecateNext.has(name)
    ) {
      acceptor(diagnosticFromCode(PLICodes.Warning.IBM3334I, nameToken, name));
    }
  }
}
