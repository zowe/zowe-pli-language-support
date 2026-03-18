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
import { parseAbstractCompilerOptions } from "./compiler-options/parser";
import { CompilerOptionTranslator } from "./compiler-options/translate";
import { createTokenInstance, PROCESS, Token } from "../parser/tokens";
import { CstNodeKind } from "../syntax-tree/cst";
import { URI } from "../utils/uri";
import { PluginConfigurationProviderInstance } from "../workspace/plugin-configuration-provider";
import { CompilerOptionSource } from "./compiler-options/translator";

export interface CompilerOptionsProcessorResult {
  result: CompilerOptionResult | undefined;
  text: string;
}
export class CompilerOptionsProcessor {
  // constant for the *PROCESS token length
  private static readonly PROCESS_TOKEN_LENGTH = 8;

  protected translator = new CompilerOptionTranslator();

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
    // Extract options and build modified text in a single pass
    const ranges = this.getCompilerOptionsRange(text, uri);
    const sourceCompilerOptions: string[] = [];
    const textSegments: string[] = [];
    let lastPosition = 0;

    for (const range of ranges) {
      // Extract the compiler option text (after *PROCESS token)
      const offset =
        range.start + CompilerOptionsProcessor.PROCESS_TOKEN_LENGTH;
      sourceCompilerOptions.push(text.substring(offset, range.end));

      // Build the modified text: keep text before range, replace range with spaces + newline
      textSegments.push(text.substring(lastPosition, range.start));
      textSegments.push(" ".repeat(range.end - range.start - 1));
      textSegments.push("\n");

      lastPosition = range.end;
    }

    // Append remaining text after last range
    textSegments.push(text.substring(lastPosition));
    const newText = textSegments.join("");

    // Start the compiler options translation here
    this.translator.clear();

    // Retrieve compiler options from the plugin configuration provider.
    // We run the translation of the plugin configuration first, so that
    // duplicate or mutual exclusive options are recognized when translating
    // the current source file.
    const programConfig =
      PluginConfigurationProviderInstance.getProgramConfig(uri);

    if (programConfig) {
      if (ranges.length === 0) {
        // If there is no anchor in the current file, diagnostics are not added at all.
        // Just run the compiler options translation.
        this.translator.setDiagnosticAnchor();
      } else {
        // If there is at least one process directive, use the first one as anchor
        // for the plugin configuration diagnostics.
        const range = ranges[0];
        this.translator.setDiagnosticAnchor(
          {
            start: range.start + 1,
            end: range.start + CompilerOptionsProcessor.PROCESS_TOKEN_LENGTH,
          },
          uri.toString(),
          (text) => `PLI Plugin Config: ${text}`,
        );
      }

      // Add the compiler option parser issues and start the translation.
      this.translator.addIssues(programConfig?.issues || []);
      if (programConfig.abstractOptions) {
        this.translator.translateCompilerOptions(
          programConfig.abstractOptions,
          {
            source: CompilerOptionSource.PLUGIN_CONFIG,
          },
        );
      }
    }

    // Now translate all options from the source file.
    this.translator.clearDiagnosticAnchor();
    for (const [index, option] of sourceCompilerOptions.entries()) {
      const sourceOptions = parseAbstractCompilerOptions(
        option,
        uri,
        ranges[index].start + CompilerOptionsProcessor.PROCESS_TOKEN_LENGTH,
        index,
        CompilerOptionsProcessor.PROCESS_TOKEN_LENGTH,
      );

      // Add parser errors and translate.
      this.translator.addIssues(sourceOptions.issues);
      this.translator.translateCompilerOptions(sourceOptions, {
        source: CompilerOptionSource.SOURCE_FILE,
      });
    }

    return {
      result: this.translator.getResults(),
      text: newText,
    };
  }

  private getCompilerOptionsRange(
    text: string,
    uri: URI,
  ): (Range & { token: Token })[] {
    const ranges: (Range & { token: Token })[] = [];
    // The PROCESS directive actually allows for further characters after the ;.
    // *PROCESS MARGINS(2, 72) ; MARGINS(1, 72); is valid, but everything after the first ; is ignored.
    // Just extract the complete line and let the parser decide what is valid.
    // We still need the whole line to preserve original positions for diagnostics.
    const processRegex = /([%*]PROCESS[^\n\r]*)(?:\r?\n|$)/iy;
    let match: RegExpExecArray | null;
    let currentPosition = 0;

    processRegex.lastIndex = this.advanceToNextProcessLocation(
      currentPosition,
      text,
    );
    let line = 0;
    while ((match = processRegex.exec(text))) {
      const directiveStart = match.index;
      const directiveEnd = match.index + match[0].length;
      const processStart = directiveStart + 1; // Skip the % or *
      const tokenLength = "PROCESS".length;
      const tokenEnd = processStart + tokenLength;

      const image = text.substring(directiveStart, tokenEnd);
      const token = createTokenInstance(
        image,
        image,
        PROCESS,
        directiveStart,
        line,
        0,
        tokenEnd,
        line++,
        tokenLength,
        uri,
      );
      token.kind = CstNodeKind.ProcessDirective_PROCESS;

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
      /[ \t\r]*\n/y, // End on newline
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
