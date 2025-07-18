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

import { MarkupKind } from "vscode-languageserver";
import { TestBuilder } from "../../test-builder";
import { HarnessTesterInterface } from "../harness-interface";
import { HarnessCodes } from "./codes";
import { HarnessConstants } from "./constants";
import { formatPliCodeBlock } from "../../../src/utils/code-block";
import { SemanticTokenTypes } from "vscode-languageserver-types";

/**
 * Create a harness implementation that can be used to run the harness test.
 *
 * @param testBuilder - The test builder to use to verify the harness test.
 * @returns A harness implementation that can be used to run the harness test.
 */
export function createTestBuilderHarnessImplementation(
  testBuilder: TestBuilder,
): HarnessTesterInterface {
  return {
    linker: {
      expectLinks: () => testBuilder.expectLinks(),
      expectNoLinksAt: (label) => testBuilder.expectNoLinksAt(label.toString()),
    },
    verify: {
      expectExclusiveErrorCodesAt: (label, codes) =>
        testBuilder.expectExclusiveErrorCodesAt(label.toString(), codes),
      expectExclusiveDiagnosticsAt: (label, diagnostics) =>
        testBuilder.expectExclusiveDiagnosticsAt(label.toString(), diagnostics),
      noDiagnostics: (label) =>
        label !== undefined
          ? testBuilder.expectNoDiagnosticsAt(label.toString())
          : testBuilder.expectNoDiagnostics(),
    },
    completion: {
      expectAt: (label, content) =>
        testBuilder.expectCompletions(label.toString(), content),
    },
    hover: {
      expectMarkdownAt: (label, markdown) =>
        testBuilder.expectHover(label.toString(), {
          kind: MarkupKind.Markdown,
          value: markdown,
        }),
      expectTextAt: (label, text) =>
        testBuilder.expectHover(label.toString(), {
          kind: MarkupKind.PlainText,
          value: text,
        }),
      codeBlock: formatPliCodeBlock,
    },
    semanticTokens: {
      expectAt: (label, tokenType = label.toString()) =>
        testBuilder.expectSemanticTokens(
          label.toString(),
          tokenType as `${SemanticTokenTypes}`,
        ),
    },
    preprocessor: {
      expectTokens: (text) => testBuilder.expectPreprocessorTokens(text),
      expectSkippedCodeAt: (label) =>
        testBuilder.expectSkippedCode(label.toString()),
    },
    code: HarnessCodes,
    constants: HarnessConstants,
  };
}
