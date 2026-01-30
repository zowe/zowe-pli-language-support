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

import { DefaultAttribute } from "../parser/tokens";
import { DeclaredVariable, SyntaxKind } from "../syntax-tree/ast";

export function assertType<T>(value: unknown): asserts value is T {}

export function getAttributes(item: DeclaredVariable): string[] {
  const attributes: string[] = [];
  let container = item.container;
  while (container?.kind === SyntaxKind.DeclaredItem) {
    const itemAttributes = container.attributes;
    for (const attr of itemAttributes) {
      if (
        attr.kind === SyntaxKind.ComputationDataAttribute &&
        attr.type !== null
      ) {
        attributes.push(DefaultAttribute.mapFromEnumLiteral(attr.type));
      }
    }
    container = container.container;
  }
  return attributes;
}

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}
