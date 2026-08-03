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
import {
  DeclarationAttribute,
  DeclaredItem,
  DeclaredVariable,
  DefineStructureStatement,
  getContainer,
  LabelPrefix,
  SyntaxKind,
  TypeExtendingAttribute,
} from "./ast";

export function getLabelPrefixName(
  label: LabelPrefix | null | undefined,
): string | null {
  return label?.item?.ref?.text ?? null;
}

export function getLabelPrefixNameToken(
  label: LabelPrefix | null | undefined,
): Token | null {
  return label?.item?.ref?.token ?? null;
}

export function getTypeExtendingAttribute(
  attributes: DeclarationAttribute[],
): TypeExtendingAttribute | undefined {
  for (const attr of attributes) {
    if (
      attr.kind === SyntaxKind.LikeAttribute ||
      attr.kind === SyntaxKind.TypeAttribute
    ) {
      return attr;
    }
  }
  return undefined;
}

export interface ExtendingDeclaredItems {
  target: DeclaredVariable;
  token: Token | null;
  extendingItems: DeclaredItem[];
}

export function getExtendingDeclaredItems(
  item: DeclaredItem,
): ExtendingDeclaredItems | undefined {
  const attr = getTypeExtendingAttribute(item.attributes);
  if (!attr) {
    return undefined;
  }
  if (attr.kind === SyntaxKind.LikeAttribute) {
    const ref = attr.reference?.element?.element?.ref?.node;
    if (ref && ref.kind === SyntaxKind.DeclaredVariable) {
      const declareStatement = getContainer(ref, SyntaxKind.DeclareStatement);
      if (declareStatement) {
        return {
          target: ref,
          token: attr.likeToken,
          extendingItems: declareStatement.items,
        };
      }
    }
  } else if (attr.kind === SyntaxKind.TypeAttribute) {
    const ref = attr.type?.node;
    if (ref && ref.kind === SyntaxKind.DeclaredVariable) {
      const defineStructureStatement = getContainer(
        ref,
        SyntaxKind.DefineStructureStatement,
      );
      if (defineStructureStatement) {
        return {
          target: ref,
          token: attr.typeToken,
          extendingItems: defineStructureStatement.items,
        };
      }
    }
  }
  return undefined;
}

export function getFirstStructureVariable(
  statement: DefineStructureStatement,
): DeclaredVariable | undefined {
  let firstItem = statement.items[0];
  if (firstItem?.kind === SyntaxKind.DeclaredItem) {
    const firstChild = firstItem.elements[0];
    if (firstChild?.kind === SyntaxKind.DeclaredVariable) {
      return firstChild;
    }
  }
  return undefined;
}
