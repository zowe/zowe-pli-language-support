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
import {
  parseAbstractCompilerOptions,
  AbstractCompilerOptions,
} from "./compiler-options/parser";
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
    const ranges = this.getCompilerOptionsRange(text, uri);
    let sourceCompilerOptions: string[] = [];
    let newText = text;
    for (const range of ranges) {
      // Magic number 8 is the length of the string "*PROCESS"
      const offset =
        range.start + CompilerOptionsProcessor.PROCESS_TOKEN_LENGTH;
      sourceCompilerOptions.push(text.substring(offset, range.end));
      newText =
        newText.substring(0, range.start) +
        " ".repeat(range.end - range.start) +
        newText.substring(range.end);
    }

    // Retrieve compiler options from the plugin configuration provider
    const programConfig = PluginConfigurationProviderInstance.getProgramConfig(
      uri.toString(),
    );
    const processGroupConfig = programConfig
      ? PluginConfigurationProviderInstance.getProcessGroupConfig(
          programConfig.pgroup,
        )
      : undefined;

    let mergedAbstractOptions: AbstractCompilerOptions | undefined = undefined;
    if (processGroupConfig?.abstractOptions) {
      mergedAbstractOptions = {
        options: [...processGroupConfig.abstractOptions.options],
        tokens: [...processGroupConfig.abstractOptions.tokens],
        issues: [],
      };
    }

    for (const [index, srcCompilerOpts] of sourceCompilerOptions.entries()) {
      const srcAbstractOptions = parseAbstractCompilerOptions(
        srcCompilerOpts,
        ranges[index].start + CompilerOptionsProcessor.PROCESS_TOKEN_LENGTH,
      );

      if (mergedAbstractOptions) {
        mergedAbstractOptions.options.push(...srcAbstractOptions.options);
        mergedAbstractOptions.tokens.push(...srcAbstractOptions.tokens);
        mergedAbstractOptions.issues = srcAbstractOptions.issues;
      } else {
        mergedAbstractOptions = srcAbstractOptions;
      }
    }

    if (mergedAbstractOptions) {
      const compilerOptionResult = translateCompilerOptions(
        mergedAbstractOptions,
      );

      // TODO @montymxb Jun. 18th, 2025: Block below is a temporary fix to avoid reporting the same issues repeatedly
      //  i.e. parsing & translation from config reveals duplicate or bad options,
      //  and translation again (in a program context) reinvokes duplicate + validation checks.
      //  We want a subset of the dupe checks, but we don't want the validation issues again (however these come together atm)
      //  this should be removed once we break up the translation process to avoid this issue

      //  shave off the issues that are already present in the process group config
      if (processGroupConfig?.issueCount) {
        for (const range of ranges) {
          // update just these first 'issueCount' issues to report on *PROCESS
          for (let i = 0; i < processGroupConfig.issueCount; i++) {
            if (i < compilerOptionResult.issues.length) {
              const issue = compilerOptionResult.issues[i];
              issue.range = {
                start: range.start,
                end: range.end,
              };
              issue.message = `PLI Plugin Config: ${issue.message}`;
            } else {
              // leave the rest alone
              break;
            }
          }
        }
        if (ranges.length === 0) {
          // no *PROCESS to attach to, slice them off instead
          compilerOptionResult.issues = compilerOptionResult.issues.slice(
            processGroupConfig.issueCount,
          );
        }
      }

      for (const range of ranges) {
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

  private getCompilerOptionsRange(
    text: string,
    uri: URI,
  ): (Range & { token: Token })[] {
    const ranges: (Range & { token: Token })[] = [];
    const processRegex = /([%*]PROCESS[^;\n]*[;\n])/iy;
    let match: RegExpExecArray | null;
    let currentPosition = 0;

    processRegex.lastIndex = this.advanceToNextProcessLocation(
      currentPosition,
      text,
    );
    while ((match = processRegex.exec(text))) {
      const directiveStart = match.index;
      const directiveEnd = match.index + match[0].length;
      const processStart = directiveStart + 1; // Skip the % or *
      const tokenEnd = processStart + "PROCESS".length;

      const token = createSyntheticTokenInstance(
        PROCESS,
        text.substring(directiveStart, tokenEnd),
      );
      token.startOffset = directiveStart;
      token.endOffset = tokenEnd;
      token.payload = {
        uri,
        kind: CstNodeKind.ProcessDirective_PROCESS,
        element: undefined,
      };

      ranges.push({
        token,
        start: directiveStart,
        end: directiveEnd,
      });

      processRegex.lastIndex = this.advanceToNextProcessLocation(
        directiveEnd,
        text,
      );
    }
    return ranges;
  }

  private advanceToNextProcessLocation(
    currentPosition: number,
    text: string,
  ): number {
    const skipPatterns: RegExp[] = [
      /\s*\/\*[\s\S]*?\*\//my, // Multi-line comments
      /\s*\/\/[^\n\r]*/y, // Single-line comments
      /[ \t]*\n/y, // End on newline
    ];

    let patternIndex = 0;
    while (patternIndex < skipPatterns.length) {
      const pattern = skipPatterns[patternIndex];
      patternIndex++;
      pattern.lastIndex = currentPosition;
      const match = pattern.exec(text);
      if (match) {
        currentPosition = match.index + match[0].length;
        patternIndex = 0; // Restart patterns from currentPosition.
      }
    }

    return currentPosition;
  }
}
