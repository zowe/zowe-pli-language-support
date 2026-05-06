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
import { CompilerOptions as MacroCompilerOptions } from "../../preprocessor/compiler-options/options-macro";
import { LspCodes } from "../lsp-codes";
import { PreprocessorTokens } from "../../preprocessor/pli-preprocessor-tokens";
import { stringToken } from "../../preprocessor/compiler-options/parser";

export function MACRO_Case(
  node: AST.Program,
  acceptor: ValidationAcceptor,
  compilationUnit: CompilationUnit,
) {
  if (!compilationUnit.processGroup?.lspOptions.caseUpperValidation.value)
    return;
  if (
    compilationUnit.compilerOptions.macroOptions.case === undefined ||
    !compilationUnit.compilerOptions.macroOptions.case.explicitlySet ||
    compilationUnit.compilerOptions.macroOptions.case?.case !==
      MacroCompilerOptions.Case.UPPER
  ) {
    return;
  }

  const MAX_DIAGNOSTICS = 100;
  let diagnosticCount = 0;

  for (const token of compilationUnit.services.files.getAllTokens()) {
    // Tokens of the compiler options parser use the original token from chevrotain and do not set the originalImage field.
    // However, their image field contains the original text.
    const isCompilerOptionToken = token.originalImage === undefined;
    const image = token.originalImage ?? token.image;

    // Skip string tokens
    if (isCompilerOptionToken) {
      if (token.tokenType.tokenTypeIdx === stringToken.tokenTypeIdx) {
        continue;
      }
    } else {
      if (token.tokenTypeIdx === PreprocessorTokens.String.tokenTypeIdx) {
        continue;
      }
    }

    if (/[a-z]/.test(image)) {
      const diagnostic = diagnosticFromCode(LspCodes.UpperCase, token, image);

      // Diagnostic data needed for the quickfix
      diagnostic.data = {
        uri: diagnostic.uri,
        text: token.originalImage,
      };
      acceptor(diagnostic);

      diagnosticCount++;
      if (diagnosticCount >= MAX_DIAGNOSTICS) {
        break;
      }
    }
  }
}
