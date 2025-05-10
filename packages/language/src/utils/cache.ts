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

/**
 * A generic cache implementation that stores a single value and provides revalidation capabilities.
 * T is the type of the cached value.
 * U is the type of the parameter used to revalidate the cache.
 */
export class Cache<T, U> {
  private data?: T;
  // Default behavior is to clear the cache when revalidated
  private onRevalidateCallback: (param: U) => void = () => {
    this.clear();
  };

  isCached(): boolean {
    return this.data !== undefined;
  }

  clear(): void {
    this.data = undefined;
  }

  revalidate(param: U): void {
    this.onRevalidateCallback(param);
  }

  onRevalidate(onRevalidate: (param: U) => void): this {
    this.onRevalidateCallback = onRevalidate;
    return this;
  }

  set(data: T): void {
    this.data = data;
  }

  get(): T | undefined {
    return this.data;
  }
}

/**
 * A group of caches that can be managed together.
 */
export class CacheGroup<T extends Record<string, any>, U> {
  private caches: Map<keyof T, Cache<any, U>> = new Map();

  /**
   * Configures the cache callbacks.
   * @param config - An object specifying the configuration for each cache.
   * @returns this for method chaining
   */
  configure(config: {
    [K in keyof T]?: (cache: Cache<T[K], U>) => void;
  }): this {
    Object.entries(config).forEach(([key, configureFn]) => {
      const cache = this.get(key as keyof T);
      configureFn?.(cache);
    });
    return this;
  }

  get<K extends keyof T>(key: K): Cache<T[K], U> {
    if (!this.caches.has(key)) {
      this.caches.set(key, new Cache<T[K], U>());
    }
    return this.caches.get(key) as Cache<T[K], U>;
  }

  clearAll(): void {
    this.caches.forEach((cache) => cache.clear());
  }

  revalidateAll(param: U): void {
    this.caches.forEach((cache) => cache.revalidate(param));
  }
}

/**
 * Predefined set of caches used for language server request lifecycle.
 */
export class LSRequestCaches extends CacheGroup<
  {
    documentSymbols: DocumentSymbol[];
    workspaceSymbols: SymbolInformation[];
    margins: MarginIndicatorNotificationParams;
    skippedCodeRanges: Range[];
  },
  { connection: Connection; unit: CompilationUnit }
> {}
