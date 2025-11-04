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

import {
  DeclarationAttribute,
  DeclaredItem,
  DeclaredVariable,
  SyntaxKind,
  TypeExtendingAttribute,
} from "../syntax-tree/ast";

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
      let container = ref.container;
      while (container) {
        if (container.kind === SyntaxKind.DeclaredItem) {
          container = container.container;
        } else if (container.kind === SyntaxKind.DeclareStatement) {
          return {
            target: ref,
            extendingItems: container.items,
          };
        } else {
          break;
        }
      }
    }
  }
  return undefined;
}
