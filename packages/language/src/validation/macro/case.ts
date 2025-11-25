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
import { Token } from "../../parser/tokens";
import {
  TraversalState,
  traverseAllNodes,
} from "../../syntax-tree/ast-iterator";
import { PreprocessorTokens } from "../../preprocessor/pli-preprocessor-tokens";
import { MultiMap } from "../../utils/collections";
import { LspCodes } from "../lsp-codes";

export function MACRO_Case(
  node: AST.Program,
  acceptor: ValidationAcceptor,
  compilationUnit: CompilationUnit,
) {
  if (node !== compilationUnit.preprocessorAst) return;
  if (compilationUnit.compilerOptions.macroOptions.case !== "UPPER") return;

  const tokens = collectPreprocessorTokens(compilationUnit).filter(
    (token) =>
      token.tokenType?.tokenTypeIdx !== PreprocessorTokens.String.tokenTypeIdx,
  );

  for (const token of tokens) {
    if (/[a-z]/.test(token.originalImage)) {
      const diagnostic = diagnosticFromCode(
        LspCodes.UpperCase,
        token,
        token.image,
      );
      // Diagnostic data needed for the quickfix
      diagnostic.data = {
        uri: diagnostic.uri,
        text: token.originalImage,
      };
      acceptor(diagnostic);
    }
  }
}

function collectPreprocessorTokens(unit: CompilationUnit): Token[] {
  const tokens: Token[] = [];
  const tokenMap = new MultiMap<AST.SyntaxNode, Token>();
  for (const token of unit.services.files.getAllTokens()) {
    if (token.element) {
      tokenMap.add(token.element, token);
    }
  }

  traverseAllNodes(unit.preprocessorAst, (child) => {
    const nodeTokens = tokenMap.get(child);
    if (nodeTokens.length > 0) {
      tokens.push(...nodeTokens);
    }
    return TraversalState.Continue;
  });

  return tokens;
}
