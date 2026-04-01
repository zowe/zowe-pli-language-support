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

import * as ast from "../syntax-tree/ast";
import { TypeDescriptions } from "./descriptions";

export interface TypeCache {
  get(
    node: ast.SyntaxNode,
    getter?: () => TypeDescriptions.Any,
  ): TypeDescriptions.Any;
  set(node: ast.SyntaxNode, description: TypeDescriptions.Any): void;
  clear(): void;
}

export class DefaultTypeCache implements TypeCache {
  private cache = new Map<ast.SyntaxNode, TypeDescriptions.Any>();

  clear() {
    this.cache.clear();
  }

  set(node: ast.SyntaxNode, description: TypeDescriptions.Any): void {
    this.cache.set(node, description);
  }

  get(
    node: ast.SyntaxNode,
    getter: () => TypeDescriptions.Any,
  ): TypeDescriptions.Any {
    if (this.cache.has(node)) {
      return this.cache.get(node)!;
    }
    if (!getter) {
      return TypeDescriptions.Unknown();
    }
    // Set a temporary value to prevent infinite recursion in case of circular references.
    this.set(node, TypeDescriptions.Unknown());
    const description = getter();
    this.set(node, description);
    return description;
  }
}
