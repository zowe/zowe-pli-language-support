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
import { Token } from "../../parser/tokens";
import { PLICodes } from "../pli-codes";

export function MACRO_NamePrefix(
  node: AST.ProcedureStatement | AST.DeclaredVariable,
  acceptor: ValidationAcceptor,
  compilationUnit: CompilationUnit,
) {
  if (!compilationUnit.compilerOptions.macroOptions.namePrefix) {
    return;
  }

  let nameTokens: Token[];
  let name;

  if (node.kind === AST.SyntaxKind.DeclaredVariable) {
    nameTokens = node.nameToken !== null ? [node.nameToken] : [];
  } else {
    nameTokens =
      node.container?.kind === AST.SyntaxKind.Statement
        ? node.container.labels
            ?.map((label) => getLabelPrefixNameToken(label))
            .filter((token) => token !== null) || []
        : [];
  }

  if (!nameTokens.length) return;

  for (const nameToken of nameTokens) {
    name = nameToken.originalImage;
    if (
      !nameToken ||
      !name ||
      name.startsWith(
        compilationUnit.compilerOptions.macroOptions.namePrefix.character,
      )
    ) {
      continue;
    }

    acceptor(diagnosticFromCode(PLICodes.Error.IBM3518I, nameToken, name));
  }
}
