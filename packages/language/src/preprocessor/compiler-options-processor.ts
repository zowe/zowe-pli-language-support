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

import { createTokenInstance } from "chevrotain";
import { Range } from "../language-server/types";
import { CompilerOptionResult } from "./compiler-options/options";
import { parseAbstractCompilerOptions } from "./compiler-options/parser";
import { translateCompilerOptions } from "./compiler-options/translator";
import { PROCESS, Token } from "../parser/tokens";
import { CstNodeKind } from "../syntax-tree/cst";
import { URI } from "../utils/uri";

export interface CompilerOptionsProcessorResult {
  result: CompilerOptionResult | undefined;
  text: string;
}

export class CompilerOptionsProcessor {
  extractCompilerOptions(
    text: string,
    uri: URI,
  ): CompilerOptionsProcessorResult {
    const range = this.getCompilerOptionsRange(text, uri);
    if (range) {
      // Magic number 8 is the length of the string "*PROCESS"
      const offset = range.start + 8;
      const optionsText = text.substring(offset, range.end);
      const newText =
        text.substring(0, range.start) +
        " ".repeat(range.end - range.start) +
        text.substring(range.end);
      const abstractOptions = parseAbstractCompilerOptions(optionsText, offset);
      const compilerOptionsResult = translateCompilerOptions(abstractOptions);
      // Prepend the *PROCESS token to the compiler options result
      compilerOptionsResult.tokens.unshift(range.token);
      return {
        result: compilerOptionsResult,
        text: newText,
      };
    } else {
      return {
        result: undefined,
        text,
      };
    }
  }

  private getCompilerOptionsRange(
    text: string,
    uri: URI,
  ): (Range & { token: Token }) | undefined {
    let start = 0;
    const ws = /\s+/y;
    ws.lastIndex = 0;
    const match = ws.exec(text);
    if (match) {
      start = match.index;
    }
    const current = text.charAt(start);
    if (current === "*" || current === "%") {
      const processLength = "PROCESS".length;
      let offset = start + 1;
      const process = text
        .substring(offset, offset + processLength)
        .toUpperCase();
      if (process === "PROCESS") {
        offset += processLength;
        const token = createTokenInstance(
          PROCESS,
          text.substring(start, offset),
          start,
          offset,
          NaN,
          NaN,
          NaN,
          NaN,
        ) as Token;
        token.payload = {
          uri,
          kind: CstNodeKind.ProcessDirective_PROCESS,
          element: undefined,
        };
        for (let i = offset; i < text.length; i++) {
          const char = text.charAt(i);
          if (char === ";" || char === "\n") {
            return {
              token,
              start,
              end: i,
            };
          }
        }
      }
    }
    return undefined;
  }
}
