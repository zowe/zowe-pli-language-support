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
import { formatPliCodeBlock } from "../../../src/utils/code-block";
import { TestBuilder } from "../../test-builder";
import {
  HarnessTesterInterface,
  SemanticTokenModifiersValues,
  SemanticTokenTypesValues,
} from "../harness-interface";
import { HarnessCodes } from "./codes";
import { HarnessConstants } from "./constants";
import { generateIncludeItemMarkup } from "../../../src/language-server/hover-request";
import { PLICode } from "../../../src/validation/pli-codes";
import { HarnessTypeAttributes } from "./type-attributes";
import { SyntaxKind } from "../../../src/syntax-tree/ast";
import { DiagnosticCategory } from "../../../src/validation/diagnostics-store";
import { PliLanguageName, Severity } from "../../../src/language-server/types";
import { Db2SqlPreprocessor } from "../../../../preprocessor-db2/out/engine/preprocessor";
import { CICSPreprocessorBase } from "preprocessor-cics";

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
    languages: {
      Pli: PliLanguageName,
      Db2Sql: Db2SqlPreprocessor.Name,
      Cics: CICSPreprocessorBase.Name,
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
      noParserDiagnostics: () =>
        testBuilder.expectNoCategoryDiagnostics(DiagnosticCategory.Parser),
      noParserErrors: () =>
        testBuilder.expectNoCategoryDiagnostics(
          DiagnosticCategory.Parser,
          (d) => d.severity === Severity.E || d.severity === Severity.S,
        ),
      noLinkingDiagnostics: () =>
        testBuilder.expectNoCategoryDiagnostics(DiagnosticCategory.Linking),
      noDiagnosticsFrom: (...languages) =>
        testBuilder.expectNoDiagnosticsFrom(...languages),
      expectToThrow: (fn, messageToThrow) =>
        testBuilder.expectToThrow(fn, messageToThrow),
      expectCompilerOptions: (expectedOptions) =>
        testBuilder.expectCompilerOptions(expectedOptions),
      expectAst: (...expectedAst) => testBuilder.expectAst(expectedAst),
      expectPPAst: (...expectedAst) => testBuilder.expectMacroAst(expectedAst),
      expectCodeActionAt: (
        label,
        expectedActionLabel,
        expectedCodeAfter,
      ): Promise<void> =>
        testBuilder.expectCodeActionAt(
          label.toString(),
          expectedActionLabel,
          expectedCodeAfter,
        ),
      noCodeActions: (label): Promise<void> =>
        testBuilder.noCodeActions(label.toString()),
      expectCodeActionCountAt: (label, expectedCount): Promise<void> =>
        testBuilder.expectCodeActionCountAt(label.toString(), expectedCount),
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
    signatureHelp: {
      expectNoHelp: (label) =>
        testBuilder.expectNoSignatureHelp(label.toString()),
      expectMarkdownSignatureAt: (label, markdown) =>
        testBuilder.expectMarkdownSignatureAt(label.toString(), markdown),
      expectMarkdownParameterAt: (label, markdown) =>
        testBuilder.expectMarkdownParameterAt(label.toString(), markdown),
      expectParameterIndexAt: (label, index) =>
        testBuilder.expectParameterIndexAt(label.toString(), index),
    },
    semanticTokens: {
      expectAt: (label, tokenType = label.toString()) =>
        testBuilder.expectSemanticTokens(
          label.toString(),
          tokenType as SemanticTokenTypesValues,
        ),
      expectModifierAt: (label, modifier = label.toString()) =>
        testBuilder.expectSemanticTokenModifiers(
          label.toString(),
          modifier as SemanticTokenModifiersValues,
        ),
    },
    preprocessor: {
      not: {
        expectTokens: (text) => testBuilder.not.expectPreprocessorTokens(text),
        containsTokens: (text) =>
          testBuilder.not.containsPreprocessorTokens(text),
        expectSkippedCodeAt: (label) =>
          testBuilder.not.expectSkippedCode(label.toString()),
      },
      expectTokens: (text) => testBuilder.expectPreprocessorTokens(text),
      containsTokens: (text) => testBuilder.containsPreprocessorTokens(text),
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
