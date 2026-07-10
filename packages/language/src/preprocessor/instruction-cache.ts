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

import { Diagnostic } from "../language-server/types";
import { Token } from "../parser/tokens";
import { TokenizationResult } from "../parser/tokenizer";
import { Statement } from "../syntax-tree/ast";
import { URI } from "../utils/uri";
import { InstructionGeneratorResult } from "./instruction-generator";

/**
 * A per-file, text-keyed cache that is invalidated whenever the recompile fingerprint
 * changes (i.e. a compiler option flagged as `recompile` changed).
 */
export class TextKeyedCache<T> {
  private cache = new Map<string, { text: string; value: T }>();

  private previousRecompileFingerprint: string | undefined;

  /**
   * Updates the recompile fingerprint and clears the cache if it changed.
   */
  update(fingerprint: string): void {
    if (
      this.previousRecompileFingerprint !== undefined &&
      this.previousRecompileFingerprint !== fingerprint
    ) {
      this.cache.clear();
    }
    this.previousRecompileFingerprint = fingerprint;
  }

  async get(uri: URI, text: string, getter: () => Promise<T> | T): Promise<T> {
    const key = uri.toString();
    const cached = this.cache.get(key);
    if (cached && cached.text === text) {
      return cached.value;
    }
    const value = await getter();
    this.cache.set(key, { text, value });
    return value;
  }
}

export interface FileInstructionResult {
  tokens: Token[];
  comments: Token[];
  diagnostics: Diagnostic[];
  statements: Statement[];
  result: InstructionGeneratorResult;
}

/**
 * Caches the parse + instruction generation of a single file. Used by the macro
 * preprocessor when resolving `%INCLUDE`d files.
 */
export class InstructionCache extends TextKeyedCache<FileInstructionResult> {}

/**
 * Caches the raw tokenization (margins + tokenize) of the main compilation unit's source.
 */
export class TokenizationCache extends TextKeyedCache<TokenizationResult> {}
