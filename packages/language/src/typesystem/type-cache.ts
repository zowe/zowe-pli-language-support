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
import { DataType, TypeDescriptions } from "./descriptions";

export interface TypeCache {
  get(
    node: ast.SyntaxNode,
    getter?: () => TypeDescriptions.Any,
  ): TypeDescriptions.Any;
  set(node: ast.SyntaxNode, description: TypeDescriptions.Any): void;
  clear(): void;
}

export class DefaultTypeCache implements TypeCache {
  private blocked = new Set<ast.SyntaxNode>();
  private cache = new Map<ast.SyntaxNode, TypeDescriptions.Any>();

  clear() {
    this.cache.clear();
  }

  set(node: ast.SyntaxNode, description: TypeDescriptions.Any): void {
    this.cache.set(node, description);
    this.blocked.delete(node);
  }

  get(
    node: ast.SyntaxNode,
    getter: () => TypeDescriptions.Any,
  ): TypeDescriptions.Any {
    if (this.cache.has(node)) {
      return this.cache.get(node)!;
    }
    if(!getter){
      return TypeDescriptions.Unknown();
    }
    if (this.blocked.has(node)) {
      // Cyclic dependency detected
      const result = TypeDescriptions.Unknown();
      this.cache.set(node, result);
      this.blocked.delete(node);
      return result;
    } else {
      this.blocked.add(node);
      const description = getter();
      this.set(node, description);
      return description;
    }
  }
}
