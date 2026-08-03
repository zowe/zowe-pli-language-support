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

import { Token } from "../parser/tokens";
import { Reference, SyntaxKind, SyntaxNode } from "../syntax-tree/ast";
import { CstNodeKind } from "../syntax-tree/cst";

export function isValidToken(token: Token): boolean {
  return (
    !isNaN(token.startOffset) &&
    typeof token.endOffset === "number" &&
    !isNaN(token.endOffset)
  );
}

// TODO: There are more name tokens
export function isNameToken(kind: CstNodeKind | undefined): boolean {
  switch (kind) {
    case CstNodeKind.DeclaredVariable_Name:
    case CstNodeKind.OrdinalValue_Name:
    case CstNodeKind.ReplaceStatement_Id:
    case CstNodeKind.DefineOrdinalStatement_Name:
    case CstNodeKind.DefineAliasStatement_Name:
      return true;
  }
  return false;
}

/**
 * Returns an associated name token for nodes that have one
 */
export function getNameToken(node: SyntaxNode): Token | undefined {
  switch (node.kind) {
    case SyntaxKind.ProcedureParameter:
    case SyntaxKind.ReferenceItem:
      return node.ref?.token ?? undefined;
    case SyntaxKind.LabelPrefix:
      return node.item?.ref?.token ?? undefined;
    case SyntaxKind.DeclaredVariable:
    case SyntaxKind.OrdinalValue:
    case SyntaxKind.ReplaceStatement:
    case SyntaxKind.DefineOrdinalStatement:
    case SyntaxKind.DefineAliasStatement:
      return node.nameToken ?? undefined;
  }
  return undefined;
}

export function isReferenceToken(kind: CstNodeKind | undefined): boolean {
  switch (kind) {
    case CstNodeKind.TypeAttribute_TypeId0:
    case CstNodeKind.TypeAttribute_TypeId1:
    case CstNodeKind.HandleAttribute_TypeId0:
    case CstNodeKind.HandleAttribute_TypeId1:
    case CstNodeKind.ReferenceItem_Ref:
    case CstNodeKind.Exports_Procedure:
    case CstNodeKind.ProcedureParameter_Id:
    case CstNodeKind.TypeReference_Ref:
    case CstNodeKind.SqlHostVariableReference_HostVariable:
    case CstNodeKind.CicsVariableReference_HostVariable:
      return true;
  }
  return false;
}

export function isIncludeItemToken(kind: CstNodeKind | undefined): boolean {
  switch (kind) {
    case CstNodeKind.IncludeItem_FileString:
    case CstNodeKind.IncludeItem_FileID:
    case CstNodeKind.IncludeItem_MemberID:
    case CstNodeKind.InscanDirective_INSCAN:
      return true;
  }
  return false;
}

/**
 * Returns a reference contained within a node, when present
 */
export function getReference(node: SyntaxNode): Reference | undefined {
  switch (node.kind) {
    case SyntaxKind.ProcedureParameter:
      return node.ref ?? undefined;
    case SyntaxKind.HandleAttribute:
      return node.type ?? undefined;
    case SyntaxKind.ReferenceItem:
      return node.ref ?? undefined;
    case SyntaxKind.TypeAttribute:
      return node.type ?? undefined;
    case SyntaxKind.FetchEntry:
      return node.entry?.ref ?? undefined;
    case SyntaxKind.ExportsItem:
      return node.reference ?? undefined;
    case SyntaxKind.ExecVariableReference:
      return node.ref ?? undefined;
  }
  return undefined;
}
