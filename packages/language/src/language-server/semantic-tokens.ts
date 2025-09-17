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
import { StructureItem, SyntaxKind, SyntaxNode } from "../syntax-tree/ast";
import { CstNodeKind } from "../syntax-tree/cst";
import { Token } from "../parser/tokens";

export const semanticTokenTypes = [
  SemanticTokenTypes.variable,
  SemanticTokenTypes.keyword,
  SemanticTokenTypes.number,
  SemanticTokenTypes.function,
  SemanticTokenTypes.parameter,
  SemanticTokenTypes.enum,
  SemanticTokenTypes.enumMember,
  SemanticTokenTypes.class,
  SemanticTokenTypes.type,
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
  const tokens = compilationUnit.services.files.getTokens(textDocument.uri);
  if (!tokens) {
    return [];
  }
  const semanticTokens = new SemanticTokensBuilder();
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
  const referenceTarget = getReferenceTarget(token);
  if (referenceTarget) {
    switch (referenceTarget.kind) {
      case SyntaxKind.LabelPrefix:
        if (isProcedurePrefix(referenceTarget)) {
          return SemanticTokenTypes.function;
        } else {
          return SemanticTokenTypes.variable;
        }
      case SyntaxKind.OrdinalValue:
        return SemanticTokenTypes.enumMember;
      case SyntaxKind.DefineOrdinalStatement:
        return SemanticTokenTypes.enum;
      case SyntaxKind.DefineAliasStatement:
        return SemanticTokenTypes.type;
      case SyntaxKind.StructureItem:
        if (isFirstStructureItem(referenceTarget)) {
          return SemanticTokenTypes.class;
        } else {
          return SemanticTokenTypes.variable;
        }
      case SyntaxKind.DeclaredVariable:
        return SemanticTokenTypes.variable;
    }
  }
  if (isProcedureType(token)) {
    return SemanticTokenTypes.function;
  } else if (isVariableType(token)) {
    return SemanticTokenTypes.variable;
  } else if (isEnumToken(token)) {
    return SemanticTokenTypes.enum;
  } else if (isEnumMemberToken(token)) {
    return SemanticTokenTypes.enumMember;
  } else if (isClassToken(token)) {
    return SemanticTokenTypes.class;
  } else if (isTypeToken(token)) {
    return SemanticTokenTypes.type;
  } else if (token.kind === CstNodeKind.ProcedureParameter_Id) {
    return SemanticTokenTypes.parameter;
  } else if (token.kind === CstNodeKind.CompilerOption_Name) {
    return SemanticTokenTypes.keyword;
  } else if (token.kind === CstNodeKind.CompilerOption_Number) {
    return SemanticTokenTypes.number;
  }

  return undefined;
}

/**
 * If the specified token represents a reference, this function returns the target SyntaxNode of that reference.
 */
function getReferenceTarget(token: Token): SyntaxNode | undefined {
  if (
    token.kind === CstNodeKind.ReferenceItem_Ref &&
    token.element?.kind === SyntaxKind.ReferenceItem
  ) {
    return token.element.ref?.node ?? undefined;
  } else if (
    token.kind === CstNodeKind.LabelReference_LabelRef &&
    token.element?.kind === SyntaxKind.LabelReference
  ) {
    return token.element.label?.node ?? undefined;
  } else if (
    (token.kind === CstNodeKind.TypeAttribute_TypeId0 ||
      token.kind === CstNodeKind.TypeAttribute_TypeId1) &&
    token.element?.kind === SyntaxKind.TypeAttribute
  ) {
    return token.element.type?.node ?? undefined;
  } else if (
    (token.kind === CstNodeKind.HandleAttribute_TypeId0 ||
      token.kind === CstNodeKind.HandleAttribute_TypeId1) &&
    token.element?.kind === SyntaxKind.HandleAttribute
  ) {
    return token.element.type?.node ?? undefined;
  }
  return undefined;
}

function isProcedureKind(container: SyntaxNode | null | undefined): boolean {
  if (!container) {
    return false;
  }

  if (container.kind === SyntaxKind.ProcedureStatement) {
    return true;
  }

  if (container.kind === SyntaxKind.Package) {
    return true;
  }

  return false;
}

function isProcedureType(token: Token): boolean {
  const kind = token.kind;
  if (
    kind === CstNodeKind.LabelPrefix_Name &&
    isProcedurePrefix(token.element)
  ) {
    return true;
  }
  if (kind === CstNodeKind.ProcedureCall_ProcedureRef) {
    return true;
  }
  if (kind === CstNodeKind.Exports_Procedure) {
    return true;
  }

  return false;
}

function isProcedurePrefix(node: SyntaxNode | null | undefined): boolean {
  if (!node) {
    return false;
  }

  if (
    node.kind === SyntaxKind.LabelPrefix &&
    node.container?.kind === SyntaxKind.Statement &&
    isProcedureKind(node.container.value)
  ) {
    return true;
  }

  return false;
}

function isVariableType(token: Token): boolean {
  switch (token.kind) {
    case CstNodeKind.DeclaredVariable_Name:
    case CstNodeKind.ReferenceItem_Ref:
    case CstNodeKind.ReplaceStatement_Id:
    case CstNodeKind.TypeAttribute_TypeId0:
    case CstNodeKind.TypeAttribute_TypeId1:
    case CstNodeKind.HandleAttribute_TypeId0:
    case CstNodeKind.HandleAttribute_TypeId1:
    case CstNodeKind.LabelReference_LabelRef:
    case CstNodeKind.IncludeItem_FileID:
      return true;
    case CstNodeKind.StructureItem_Name:
      if (token.element?.kind === SyntaxKind.StructureItem) {
        return !isFirstStructureItem(token.element);
      }
      return false;
  }
  return false;
}

function isEnumToken(token: Token): boolean {
  return token.kind === CstNodeKind.DefineOrdinalStatement_Name;
}

function isEnumMemberToken(token: Token): boolean {
  if (token.kind === CstNodeKind.OrdinalValue_Name) {
    return true;
  }
  return false;
}

function isClassToken(token: Token): boolean {
  const { kind, element } = token;
  if (
    kind === CstNodeKind.StructureItem_Name &&
    element?.kind === SyntaxKind.StructureItem
  ) {
    return isFirstStructureItem(element);
  }
  return false;
}

function isFirstStructureItem(element: StructureItem): boolean {
  const container = element.container;
  if (container?.kind === SyntaxKind.DefineStructureStatement) {
    return container.items[0] === element;
  }
  return false;
}

function isTypeToken(token: Token): boolean {
  return token.kind === CstNodeKind.DefineAliasStatement_Name;
}
