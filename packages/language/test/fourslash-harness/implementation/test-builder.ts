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
import { SemanticTokenTypes } from "vscode-languageserver-types";
import { formatPliCodeBlock } from "../../../src/utils/code-block";
import { TestBuilder } from "../../test-builder";
import { HarnessTesterInterface } from "../harness-interface";
import { HarnessCodes } from "./codes";
import { HarnessConstants } from "./constants";
import { generateIncludeItemMarkup } from "../../../src/language-server/hover-request";
import { PLICode } from "../../../src/validation/messages/pli-codes";
import { HarnessTypeAttributes } from "./type-atttributes";
import { SyntaxKind } from "../../../src/syntax-tree/ast";

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
    Syntax: SyntaxKind,
    testAPI: {
      testBuilder,
    },
    linker: {
      expectLinks: () => testBuilder.expectLinks(),
      expectNoLinksAt: (label) => testBuilder.expectNoLinksAt(label.toString()),
    },
    verify: {
      expectExclusiveErrorCodesAt: (label, codes) =>
        testBuilder.expectExclusiveErrorCodesAt(label.toString(), codes),
      expectErrorCodesAt: (label, codes) =>
        testBuilder.expectErrorCodesAt(label.toString(), codes),
      expectExclusiveDiagnosticsAt: (label, diagnostics) =>
        testBuilder.expectExclusiveDiagnosticsAt(label.toString(), diagnostics),
      expectDiagnosticsAt: (label, diagnostics) =>
        testBuilder.expectDiagnosticsAt(label, diagnostics),
      noDiagnostics: (label, ...errorCodes: PLICode[]) =>
        label !== undefined
          ? testBuilder.expectNoDiagnosticsAt(label, ...errorCodes)
          : testBuilder.expectNoDiagnostics(...errorCodes),
      noDiagnosticsExcept: (regex: RegExp[] | string[]) =>
        testBuilder.noDiagnosticsExcept(regex),
      noDiagnosticsExceptAt: (label, regex: RegExp[] | string[]) =>
        testBuilder.noDiagnosticsExcept(regex, label),
      expectToThrow: (fn, messageToThrow) =>
        testBuilder.expectToThrow(fn, messageToThrow),
      expectCompilerOptions: (expectedOptions) =>
        testBuilder.expectCompilerOptions(expectedOptions),
      expectAst: (...expectedAst) => testBuilder.expectAst(expectedAst),
      expectPPAst: (...expectedAst) => testBuilder.expectMacroAst(expectedAst),
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
      include: generateIncludeItemMarkup,
    },
    semanticTokens: {
      expectAt: (label, tokenType = label.toString()) =>
        testBuilder.expectSemanticTokens(
          label.toString(),
          tokenType as `${SemanticTokenTypes}`,
        ),
    },
    preprocessor: {
      not: {
        expectTokens: (text) => testBuilder.not.expectPreprocessorTokens(text),
        expectSkippedCodeAt: (label) =>
          testBuilder.not.expectSkippedCode(label.toString()),
      },
      expectTokens: (text) => testBuilder.expectPreprocessorTokens(text),
      expectSkippedCodeAt: (label) =>
        testBuilder.expectSkippedCode(label.toString()),
    },
    types: {
      ...HarnessTypeAttributes,
      expectTypeAt: (label, type) =>
        testBuilder.expectTypeAt(label.toString(), type),
    },
    code: HarnessCodes,
    constants: HarnessConstants,
  };
}
