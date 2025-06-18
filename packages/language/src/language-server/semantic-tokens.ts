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

import { SemanticTokensBuilder } from "vscode-languageserver";
import { CompilationUnit } from "../workspace/compilation-unit";
import { offsetToPosition, Range } from "./types";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  SemanticTokensLegend,
  SemanticTokenTypes,
} from "vscode-languageserver-types";
import { SyntaxKind, SyntaxNode } from "../syntax-tree/ast";
import { CstNodeKind } from "../syntax-tree/cst";
import { Token, TokenPayload } from "../parser/tokens";

const semanticTokenTypes = [
  SemanticTokenTypes.variable,
  SemanticTokenTypes.keyword,
  SemanticTokenTypes.number,
  SemanticTokenTypes.function,
];

export const tokenTypes = new Map<string, number>(
  semanticTokenTypes.map((type, index) => [type, index]),
);

const tokenModifiers = new Map<string, number>([]);

export const semanticTokenLegend: SemanticTokensLegend = {
  tokenTypes: Array.from(tokenTypes.keys()),
  tokenModifiers: Array.from(tokenModifiers.keys()),
};

export function semanticTokens(
  textDocument: TextDocument,
  compilationUnit: CompilationUnit,
  range?: Range,
): number[] {
  const semanticTokens = new SemanticTokensBuilder();
  const tokens = compilationUnit.tokens.fileTokens[textDocument.uri] ?? [];
  for (const token of tokens) {
    const type = tokenType(token);
    if (type !== undefined) {
      const position = offsetToPosition(textDocument, token.startOffset);
      semanticTokens.push(
        position.line,
        position.character,
        token.image.length,
        tokenTypes.get(type)!,
        0,
      );
    }
  }
  return semanticTokens.build().data;
}

function tokenType(token: Token): string | undefined {
  const payload = token.payload;

  if (isProcedureType(payload)) {
    return SemanticTokenTypes.function;
  }

  if (isVariableType(payload)) {
    return SemanticTokenTypes.variable;
  } else if (payload.kind === CstNodeKind.CompilerOption_Name) {
    return SemanticTokenTypes.keyword;
  } else if (payload.kind === CstNodeKind.CompilerOption_Number) {
    return SemanticTokenTypes.number;
  }

  return undefined;
}

function isProcedureType(payload: TokenPayload): boolean {
  const kind = payload.kind;
  const element = payload.element;
  if (
    kind === CstNodeKind.ReferenceItem_Ref &&
    element?.kind === SyntaxKind.ReferenceItem
  ) {
    const ref = element.ref?.node;
    return isProcedurePrefix(ref);
  }
  if (
    kind === CstNodeKind.LabelPrefix_Name &&
    isProcedurePrefix(payload.element)
  ) {
    return true;
  }
  if (
    kind === CstNodeKind.LabelReference_LabelRef &&
    element?.container?.kind === SyntaxKind.EndStatement &&
    element?.container.container?.kind === SyntaxKind.ProcedureStatement
  ) {
    return true;
  }
  if (kind === CstNodeKind.ProcedureCall_ProcedureRef) {
    return true;
  }

  return false;
}

function isProcedurePrefix(node: SyntaxNode | null | undefined): boolean {
  return (
    node?.kind === SyntaxKind.LabelPrefix &&
    node.container?.kind === SyntaxKind.Statement &&
    node.container.value?.kind === SyntaxKind.ProcedureStatement
  );
}

function isVariableType(payload: TokenPayload): boolean {
  switch (payload.kind) {
    case CstNodeKind.DeclaredVariable_Name:
    case CstNodeKind.ReferenceItem_Ref:
    case CstNodeKind.TypeAttribute_TypeId0:
    case CstNodeKind.TypeAttribute_TypeId1:
    case CstNodeKind.OrdinalTypeAttribute_TypeId0:
    case CstNodeKind.OrdinalTypeAttribute_TypeId1:
    case CstNodeKind.HandleAttribute_TypeId0:
    case CstNodeKind.HandleAttribute_TypeId1:
    case CstNodeKind.LabelReference_LabelRef:
      return true;
  }
  return false;
}
