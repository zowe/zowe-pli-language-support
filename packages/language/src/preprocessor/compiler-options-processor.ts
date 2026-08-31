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
import { createTokenInstance, Token } from "../parser/tokens";
import { PROCESS as PROCESS_TOKEN } from "../parser/tokens";
import { CstNodeKind } from "../syntax-tree/cst";
import { URI } from "../utils/uri";
import { CompilerOptionSource } from "./compiler-options/translator";
import { CompilationUnit } from "../workspace/compilation-unit";

export interface CompilerOptionsProcessorResult {
  result: CompilerOptionResult | undefined;
  text: string;
  /**
   * Fingerprint of all forceRecompile-flagged compiler option rules and their
   * concrete argument values. Used by InstructionCache to detect when re-tokenization is needed.
   */
  recompileFingerprint: string;
}

export class CompilerOptionsProcessor {
  protected translator = new CompilerOptionTranslator();

  /**
   * Extracts compiler options from the given text and returns the modified text with the options removed.
   * @param text - The source text containing compiler options.
   * @param uri - The URI of the source file, for configuration lookup.
   * @returns Processed compiler options and modified text.
   */
  extractCompilerOptions(
    text: string,
    uri: URI,
    unit: CompilationUnit,
  ): CompilerOptionsProcessorResult {
    const ranges = this.getCompilerOptionsRange(text, uri);
    const sourceCompilerOptions: string[] = [];
    const textSegments: string[] = [];
    let lastPosition = 0;

    for (const range of ranges) {
      const offset = range.start + PROCESS_TOKEN_LENGTH;
      sourceCompilerOptions.push(text.substring(offset, range.end));
      textSegments.push(text.substring(lastPosition, range.start));

      // Preserve line structure
      const directiveText = text.substring(range.start, range.end);
      const lines = directiveText.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (i > 0) {
          textSegments.push("\n");
        }
        textSegments.push(" ".repeat(lines[i].length));
      }

      lastPosition = range.end;
    }

    textSegments.push(text.substring(lastPosition));
    const newText = textSegments.join("");

    this.translator.clear();

    // Retrieve compiler options from the plugin configuration provider.
    // We run the translation of the plugin configuration first, so that
    // duplicate or mutual exclusive options are recognized when translating
    // the current source file.
    const programConfig = unit.programConfig;

    if (programConfig) {
      if (ranges.length > 0) {
        // If there is at least one process directive, use the first one as anchor
        // for the plugin configuration diagnostics.
        const range = ranges[0];
        this.translator.setDiagnosticAnchor(
          {
            start: range.start + 1,
            end: range.start + PROCESS_TOKEN_LENGTH,
          },
          uri.toString(),
          (text) => `PLI Plugin Config: ${text}`,
        );
      } else {
        this.translator.setDiagnosticAnchor();
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
        ranges[index].start + PROCESS_TOKEN_LENGTH,
      );

      // Add parser errors and translate.
      this.translator.addIssues(sourceOptions.issues);
      this.translator.translateCompilerOptions(sourceOptions, {
        source: CompilerOptionSource.SOURCE_FILE,
      });
    }

    this.translator.postProcessCompilerOptions();

    const result = this.translator.getResults();
    result.options.ranges = ranges;

    return {
      result,
      text: newText,
      recompileFingerprint: this.translator.getRecompileFingerprint(),
    };
  }

  private getCompilerOptionsRange(
    text: string,
    uri: URI,
  ): (Range & { token: Token })[] {
    const ranges: (Range & { token: Token })[] = [];
    // The PROCESS directive allows for further characters after the ;.
    // *PROCESS MARGINS(2, 72) ; MARGINS(1, 72); is valid, but everything after the first ; is ignored.
    // PROCESS directives can span multiple lines until a semicolon (outside comments) is encountered.
    // Example: *PROCESS MARGINS(2,72,1),INCLUDE,LIST
    // ,AG,A(F),MAP,NEST,NOF,NOPT,STG,X(F),
    //  INITAUTO(F);

    let col0 = true;
    let index = 0;

    let inDirective = false;
    let inMultiLineComment = false;
    let inSingleLineComment = false;
    let inString: number = 0; //charCode of the opening quote or 0

    let processStart = 0;

    const la = (n: number): number =>
      index + n < text.length ? text.charCodeAt(index + n) : -1;

    const consumeLine = () => {
      while (index < text.length && text.charCodeAt(index) != LF) {
        index++;
      }
      if (index < text.length) {
        index++;
        col0 = true;
        inSingleLineComment = false;
      }
    };

    const createToken = (): Token => {
      const image = text.substring(processStart, processStart + PROCESS.length);
      const token = createTokenInstance(
        image,
        image,
        PROCESS_TOKEN,
        processStart,
        processStart + PROCESS.length,
        uri,
      );
      token.kind = CstNodeKind.ProcessDirective_PROCESS;
      return token;
    };

    while (index < text.length) {
      const code = text.charCodeAt(index);

      const processDirective =
        col0 &&
        (code == STAR || code == PERCENT) &&
        !inDirective &&
        !inMultiLineComment &&
        !inSingleLineComment &&
        (la(1) | 0x20) == P &&
        (la(2) | 0x20) == R &&
        (la(3) | 0x20) == O &&
        (la(4) | 0x20) == C &&
        (la(5) | 0x20) == E &&
        (la(6) | 0x20) == S &&
        (la(7) | 0x20) == S;

      col0 = false;

      if (processDirective) {
        inDirective = true;
        processStart = index;
        index += PROCESS.length + 1;
        continue;
      }

      if (!inString && !inMultiLineComment && !inSingleLineComment) {
        if (code == SLASH && la(1) == STAR) {
          inMultiLineComment = true;
          index += 2;
          continue;
        }

        if (code == SLASH && la(1) == SLASH) {
          inSingleLineComment = true;
          index += 2;
          continue;
        }

        if (code == SEMICOLON) {
          if (inDirective) {
            consumeLine();
            ranges.push({
              token: createToken(),
              start: processStart,
              end: index,
            });
            inDirective = false;
            continue;
          }
        }
      }

      if (code == LF) {
        consumeLine();
        continue;
      }

      if (inMultiLineComment && code == STAR && la(1) == SLASH) {
        inMultiLineComment = false;
        index += 2;
        continue;
      }

      if (
        !inDirective &&
        !inMultiLineComment &&
        !inSingleLineComment &&
        code > SPACE
      ) {
        break; // If we encounter any non-whitespace character outside of a directive or comment, we can stop scanning
      }

      if (
        !inMultiLineComment &&
        !inSingleLineComment &&
        (code == SINGLE_QUOTE || code == DOUBLE_QUOTE)
      ) {
        if (inString === 0) {
          inString = code;
        } else if (inString === code) {
          if (la(1) === code) {
            // Escaped quote, skip both
            index += 2;
            continue;
          } else {
            inString = 0;
          }
        }
      }

      index++;
    }

    if (inDirective) {
      ranges.push({
        token: createToken(),
        start: processStart,
        end: text.length,
      });
    }

    return ranges;
  }
}

const PROCESS_TOKEN_LENGTH = 8;
const STAR = "*".charCodeAt(0);
const PERCENT = "%".charCodeAt(0);
const PROCESS = "PROCESS";
const SLASH = "/".charCodeAt(0);
const SEMICOLON = ";".charCodeAt(0);
const SPACE = " ".charCodeAt(0);
const SINGLE_QUOTE = "'".charCodeAt(0);
const DOUBLE_QUOTE = '"'.charCodeAt(0);
const LF = "\n".charCodeAt(0);

const P = "p".charCodeAt(0);
const R = "r".charCodeAt(0);
const O = "o".charCodeAt(0);
const C = "c".charCodeAt(0);
const E = "e".charCodeAt(0);
const S = "s".charCodeAt(0);
