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
import {
  CompilerOptionResult,
  CompilerOptionIssue,
} from "./compiler-options/options";
import { parseAbstractCompilerOptions } from "./compiler-options/parser";
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
  // constant for the *PROCESS token length
  private static readonly PROCESS_TOKEN_LENGTH = 8;

  /**
   * Extracts compiler options from the given text
   * @param text - The source text containing compiler options.
   * @param uri - The URI of the source file, for configuration lookup.
   * @returns Processed compiler options and modified text.
   */
  extractCompilerOptions(
    text: string,
    uri: URI,
  ): CompilerOptionsProcessorResult {
    const range = this.getCompilerOptionsRange(text, uri);
    let srcCompilerOpts: string | undefined = undefined;
    let newText = text;
    if (range) {
      // Magic number 8 is the length of the string "*PROCESS"
      const offset =
        range.start + CompilerOptionsProcessor.PROCESS_TOKEN_LENGTH;
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
      configCompilerOpts = processGroupConfig["compiler-options"].join(" ");
    }

    if (srcCompilerOpts || configCompilerOpts) {
      let configCompilerResult: CompilerOptionResult | undefined = undefined;
      let srcCompilerResult: CompilerOptionResult | undefined = undefined;

      // process compiler options from the config
      if (configCompilerOpts) {
        const configAbstractOptions =
          parseAbstractCompilerOptions(configCompilerOpts);
        configCompilerResult = translateCompilerOptions(configAbstractOptions);
        // adjust all issues from config
        this.adjustIssuesFromConfig(configCompilerResult.issues, range);
        if (!range) {
          // don't report config issues if we don't have a *PROCESS directive to attach them to
          configCompilerResult.issues = [];
        }
      }

      // process compiler options from the *PROCESS directive
      if (srcCompilerOpts) {
        const srcAbstractOptions = parseAbstractCompilerOptions(
          srcCompilerOpts,
          range ? range.start + CompilerOptionsProcessor.PROCESS_TOKEN_LENGTH : 0,
        );
        
        // TODO @montymxb Jun 6th, 2025: Duplicates across both config & src options are not yet accounted for
        // due to the separate processing of each src

        srcCompilerResult = translateCompilerOptions(srcAbstractOptions);
      }

      // merge option results
      const compilerOptionResult: CompilerOptionResult = {
        options: {
          ...configCompilerResult?.options,
          ...srcCompilerResult?.options,
        },
        tokens: [
          ...(configCompilerResult?.tokens || []),
          ...(srcCompilerResult?.tokens || []),
        ],
        issues: [
          ...(configCompilerResult?.issues || []),
          ...(srcCompilerResult?.issues || []),
        ],
      };

      if (range) {
        compilerOptionResult.tokens.unshift(range.token);
      }

      return {
        result: compilerOptionResult,
        text: newText,
      };
    } else {
      return {
        result: undefined,
        text: newText,
      };
    }
  }

  /**
   * Helper function to adjust issue ranges & messages from the config
   * Primarily to try and avoid conflating the sourcing of these issues w/ *PROCESS related issues
   */
  private adjustIssuesFromConfig(
    issues: CompilerOptionIssue[],
    range?: Range & { token: IToken },
  ): void {
    for (const issue of issues) {
      // only retain issues that have a range
      if (range) {
        // adjust range & message for issues from config, placing on *PROCESS directive
        issue.range = range
          ? {
              start: range.start,
              end: range.start + CompilerOptionsProcessor.PROCESS_TOKEN_LENGTH,
            }
          : { start: 0, end: 0 };
        issue.message = `PLI Plugin Config: ${issue.message}`;
      } else {
        // report as is, don't adjust
        console.warn(
          `PLI Plugin Config: ${issue.message}`,
          issue.range,
        );
      }
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
