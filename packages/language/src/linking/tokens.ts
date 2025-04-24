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

import { IToken } from "chevrotain";
import { Reference, SyntaxKind, SyntaxNode } from "../syntax-tree/ast";
import { CstNodeKind } from "../syntax-tree/cst";

export function isValidToken(token: IToken): boolean {
  return (
    !isNaN(token.startOffset) &&
    typeof token.endOffset === "number" &&
    !isNaN(token.endOffset)
  );
}

// TODO: There are more name tokens
export function isNameToken(kind: CstNodeKind): boolean {
  switch (kind) {
    case CstNodeKind.DeclaredVariable_Name:
    case CstNodeKind.LabelPrefix_Name:
    case CstNodeKind.DoType3Variable_Name:
    case CstNodeKind.OrdinalValue_Name:
      return true;
  }
  return false;
}

/**
 * Returns an associated name token for nodes that have one
 */
export function getNameToken(node: SyntaxNode): IToken | undefined {
  switch (node.kind) {
    case SyntaxKind.DeclaredVariable:
      return node.nameToken ?? undefined;
    case SyntaxKind.LabelPrefix:
      return node.nameToken ?? undefined;
    case SyntaxKind.DoType3Variable:
      return node.nameToken ?? undefined;
    case SyntaxKind.OrdinalValue:
      return node.nameToken ?? undefined;
  }
  return undefined;
}

export function isReferenceToken(kind: CstNodeKind): boolean {
  switch (kind) {
    case CstNodeKind.TypeAttribute_TypeId0:
    case CstNodeKind.TypeAttribute_TypeId1:
    case CstNodeKind.OrdinalTypeAttribute_TypeId0:
    case CstNodeKind.OrdinalTypeAttribute_TypeId1:
    case CstNodeKind.HandleAttribute_TypeId0:
    case CstNodeKind.HandleAttribute_TypeId1:
    case CstNodeKind.ProcedureCall_ProcedureRef:
    case CstNodeKind.LabelReference_LabelRef:
    case CstNodeKind.ReferenceItem_Ref:
      return true;
  }
  return false;
}

/**
 * Returns a reference contained within a node, when present
 */
export function getReference(node: SyntaxNode): Reference | undefined {
  switch (node.kind) {
    case SyntaxKind.HandleAttribute:
      return node.type ?? undefined;
    case SyntaxKind.LabelReference:
      return node.label ?? undefined;
    case SyntaxKind.OrdinalTypeAttribute:
      return node.type ?? undefined;
    case SyntaxKind.ProcedureCall:
      return node.procedure ?? undefined;
    case SyntaxKind.ReferenceItem:
      return node.ref ?? undefined;
    case SyntaxKind.TypeAttribute:
      return node.type ?? undefined;
    case SyntaxKind.FetchEntry:
      return node.entry?.ref ?? undefined;
  }
  return undefined;
}

/**
 * Gets a referenceable symbol name for the given node, when present
 */
export function getVariableSymbol(node: SyntaxNode): string | undefined {
  switch (node.kind) {
    case SyntaxKind.DeclaredVariable:
      return node.name!;
    default:
      return undefined;
  }
}

export function getLabelSymbol(node: SyntaxNode): string | undefined {
  switch (node.kind) {
    case SyntaxKind.LabelPrefix:
    case SyntaxKind.DoType3Variable:
    case SyntaxKind.OrdinalValue:
      return node.name!;
    default:
      return undefined;
  }
}
