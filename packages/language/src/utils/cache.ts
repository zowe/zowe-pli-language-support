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
  Connection,
  DocumentSymbol,
  Range,
  SymbolInformation,
} from "vscode-languageserver";
import { CompilationUnit } from "../workspace/compilation-unit";
import { MarginIndicatorNotificationParams } from "../language-server/margin-indicator";

export class Cache<T extends Record<string, any>, U> {
  private cache: Partial<T> = {};
  private callbacks: Map<keyof T, (param: U) => void> = new Map();

  constructor(initialCache?: Partial<T>) {
    if (initialCache) {
      this.cache = initialCache;
    }
  }

  get<K extends keyof T>(key: K): T[K] | undefined {
    return this.cache[key];
  }

  set<K extends keyof T>(key: K, value: T[K]): void {
    this.cache[key] = value;
  }

  onRevalidate<K extends keyof T>(key: K, callback: (param: U) => void): this {
    this.callbacks.set(key, callback);
    return this;
  }

  revalidateAll(param: U): void {
    for (const key of Object.keys(this.cache) as (keyof T)[]) {
      const callback = this.callbacks.get(key);
      if (callback) {
        callback(param);
      } else {
        this.cache[key] = undefined;
      }
    }
  }
}

type LSRequestCaches = {
  documentSymbols: DocumentSymbol[];
  workspaceSymbols: SymbolInformation[];
  margins: MarginIndicatorNotificationParams;
  skippedCodeRanges: Range[];
};

export type LSRequestCache = Cache<
  LSRequestCaches,
  { connection: Connection; unit: CompilationUnit }
>;

export function createLSRequestCaches() {
  return new Cache<
    LSRequestCaches,
    { connection: Connection; unit: CompilationUnit }
  >() as LSRequestCache;
}
