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
import { Statement } from "../syntax-tree/ast";
import { URI } from "../utils/uri";
import { InstructionGeneratorResult } from "./instruction-generator";

interface CachedInstructions {
  text: string;
  instructions: FileInstructionResult;
}

export interface FileInstructionResult {
  tokens: Token[];
  comments: Token[];
  diagnostics: Diagnostic[];
  statements: Statement[];
  result: InstructionGeneratorResult;
}

export class InstructionCache {
  private cache = new Map<string, CachedInstructions>();

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

  async get(
    uri: URI,
    text: string,
    getter: () => Promise<FileInstructionResult>,
  ): Promise<FileInstructionResult> {
    const key = uri.toString();
    if (this.cache.has(key)) {
      const cached = this.cache.get(key)!;
      if (cached.text === text) {
        return cached.instructions;
      }
    }
    const instructions = await getter();
    this.cache.set(key, { text, instructions });
    return instructions;
  }
}
