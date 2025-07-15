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

import { CompletionKeywords } from "../../src/language-server/completion/keywords";
import { Diagnostic } from "../../src/language-server/types";
import { PLICodes } from "../../src/validation/messages";
import { ExpectedCompletion } from "../test-builder";
import { type Severity } from "../../src/language-server/types";
import { SemanticTokenTypes } from "vscode-languageserver-types";

type Label = string | number;
type SemanticTokenTypesValues = `${SemanticTokenTypes}`;

export interface HarnessTesterInterface {
  verify: {
    /**
     * Expect that the given label has the given error codes.
     * @param label The label to expect the error codes at.
     * @param codes The error codes to expect.
     */
    expectExclusiveErrorCodesAt(label: Label, codes: string[] | string): void;
    /**
     * Expect that the given label has the given diagnostics.
     * @param label The label to expect the diagnostics at.
     * @param diagnostics The diagnostics to expect.
     */
    expectExclusiveDiagnosticsAt(
      label: Label,
      diagnostics: Partial<Diagnostic> | Partial<Diagnostic>[],
    ): void;
    /**
     * Expect that the compilation unit has no diagnostics.
     *
     * @param label The label to expect no diagnostics at. If not provided, all diagnostics are expected to be absent.
     * @example
     * ```ts
     * verify.noDiagnostics();
     * verify.noDiagnostics('i');
     * ```
     */
    noDiagnostics(label?: string | number): void;
  };

  linker: {
    /**
     * Expect that the defined links actually links to the correct target.
     */
    expectLinks(): void;
    /**
     * Expect that the defined links do not link to the given label.
     * @param label The label to expect no links at.
     */
    expectNoLinksAt(label: Label): void;
  };

  hover: {
    /**
     * Expect that the hover at the given label is the given markdown.
     *
     * @param label The label to expect the hover at.
     * @param markdown The expected hover markdown.
     */
    expectMarkdownAt(label: Label, markdown: string): void;
    /**
     * Expect that the hover at the given label is the given text.
     *
     * @param label The label to expect the hover at.
     * @param text The expected hover text.
     */
    expectTextAt(label: Label, text: string): void;
    /**
     * Format the given text as a code block.
     * @param text The text to format as a code block.
     * @returns The formatted text.
     *
     * @example
     * hover.codeBlock("DCL A;") === "```pli\nDCL A;\n```\n"
     */
    codeBlock(text: string): string;
  };

  completion: {
    /**
     * Expect that the completion items at the given label contains the given content.
     *
     * @param label The label to expect the completion items at.
     * @param expected The expected completion items.
     */
    expectAt(label: Label, expected: ExpectedCompletion): void;
  };

  semanticTokens: {
    /**
     * Expect that the semantic tokens at the given label are the given token type.
     * @param label The label to expect the semantic tokens at.
     */
    expectAt(label: SemanticTokenTypesValues): void;
    /**
     * Expect that the semantic tokens at the given label are the given token type.
     * @param label The label to expect the semantic tokens at.
     * @param tokenType The token type to expect.
     */
    expectAt(label: Label, tokenType: SemanticTokenTypesValues): void;
  };

  preprocessor: {
    /**
     * Expect that the preprocessor produces the given text or tokens.
     * @param textOrTokens The text or tokens to expect.
     * If an array of strings is provided, it is treated as a list of tokens.
     * If a string is provided, it is piped through the lexer and the resulting tokens are expected.
     */
    expectTokens(textOrTokens: string | string[]): void;
    /**
     * Expect that the code is skipped at the given range.
     * @param label The label to expect the skipped code at.
     */
    expectSkippedCodeAt(label: Label): void;
  };

  code: {
    Severe: typeof PLICodes.Severe;
    Warning: typeof PLICodes.Warning;
    Information: typeof PLICodes.Info;
    Error: typeof PLICodes.Error;
  };

  constants: {
    CompletionKeywords: typeof CompletionKeywords;
    Severity: typeof Severity;
  };
}
