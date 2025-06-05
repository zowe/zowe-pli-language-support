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

import { Range } from "../language-server/types";
import { CompilerOptionResult } from "./compiler-options/options";
import { parseAbstractCompilerOptions, AbstractCompilerOptions } from "./compiler-options/parser";
import { translateCompilerOptions } from "./compiler-options/translator";
import { createSyntheticTokenInstance, PROCESS, Token } from "../parser/tokens";
import { CstNodeKind } from "../syntax-tree/cst";
import { URI } from "../utils/uri";
import { PluginConfigurationProviderInstance } from "../workspace/plugin-configuration-provider";

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
    let srcCompilerOpts: string | undefined = undefined;
    let newText = text;
    if (range) {
      // Magic number 8 is the length of the string "*PROCESS"
      const offset = range.start + 8;
      srcCompilerOpts = text.substring(offset, range.end);
      newText =
        text.substring(0, range.start) +
        " ".repeat(range.end - range.start) +
        text.substring(range.end);
    }

    // Retrieve compiler options from the plugin configuration provider
    const programConfig = PluginConfigurationProviderInstance.getProgramConfig(uri.toString());
    const processGroupConfig = programConfig ? PluginConfigurationProviderInstance.getProcessGroupConfig(programConfig.pgroup) : undefined;

    let configCompilerOpts: string | undefined = undefined;
    if (processGroupConfig?.["compiler-options"]?.length) {
      configCompilerOpts =
        processGroupConfig["compiler-options"].join(" ");
    }

    if (srcCompilerOpts || configCompilerOpts) {
      // prepare a common structure for config & src compiler options
      const abstractOptions: AbstractCompilerOptions = {
        options: [],
        tokens: [],
        issues: [],
      };

      // check to parse and merge config options
      if (configCompilerOpts) {
        const configAbstractOptions = parseAbstractCompilerOptions(configCompilerOpts);
        abstractOptions.options = configAbstractOptions.options;
        abstractOptions.tokens = configAbstractOptions.tokens;
        abstractOptions.issues = configAbstractOptions.issues;
      }

      // check to parse and merge src options (directly from the *PROCESS directive)
      if (srcCompilerOpts) {
        const srcAbstractOptions = parseAbstractCompilerOptions(
          srcCompilerOpts,
          range ? range.start + 8 : 0,
        );
        abstractOptions.options.push(...srcAbstractOptions.options);
        abstractOptions.tokens.push(...srcAbstractOptions.tokens);
        abstractOptions.issues.push(...srcAbstractOptions.issues);
      }

      // translate altogether
      const compilerOptionsResult = translateCompilerOptions(abstractOptions);

      if (range) {
        // Prepend the *PROCESS token to the compiler options result
        compilerOptionsResult.tokens.unshift(range.token);
      }

      return {
        result: compilerOptionsResult,
        text: newText,
      };
    } else {
      return {
        result: undefined,
        text: newText,
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
        const token = createSyntheticTokenInstance(
          PROCESS,
          text.substring(start, offset),
        );
        token.startOffset = start;
        token.endOffset = offset;
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
