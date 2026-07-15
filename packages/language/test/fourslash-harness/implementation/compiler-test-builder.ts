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

import { CICSPreprocessor } from "preprocessor-cics";
import { Db2SqlPreprocessor } from "preprocessor-db2";
import { generateIncludeItemMarkup } from "../../../src/language-server/hover-request";
import { PliLanguageName } from "../../../src/language-server/types";
import { SyntaxKind } from "../../../src/syntax-tree/ast";
import { CompilerTestBuilder } from "../../compiler-test-builder";
import { TestBuilder } from "../../test-builder";
import { HarnessTesterInterface } from "../harness-interface";
import { HarnessCodes } from "./codes";
import { HarnessConstants } from "./constants";
import { HarnessTypeAttributes } from "./type-attributes";

export async function createCompilerTestHarnessImplementation(
  testBuilder: CompilerTestBuilder,
): Promise<HarnessTesterInterface> {
  const notImplemented = (name: string) => async () => {
    console.warn(
      `Method ${name} is not implemented in the compiler test harness implementation.`,
    );
  };
  return {
    Syntax: SyntaxKind,
    languages: {
      Pli: PliLanguageName,
      Db2Sql: Db2SqlPreprocessor.Name,
      Cics: CICSPreprocessor.Name,
    },
    linker: {
      expectLinks: () => testBuilder.expectLinks(),
      expectNoLinksAt: notImplemented("linker.expectNoLinksAt"),
      expectReferences: notImplemented("linker.expectReferences"),
    },
    testAPI: {
      get testBuilder(): TestBuilder {
        throw new Error(
          "testAPI.testBuilder is not available in compiler tests. ",
        );
      },
    },
    verify: {
      expectExclusiveErrorCodesAt: notImplemented(
        "verify.expectExclusiveErrorCodesAt",
      ),
      expectErrorCodesAt: notImplemented("verify.expectErrorCodesAt"),
      expectExclusiveDiagnosticsAt: notImplemented(
        "verify.expectExclusiveDiagnosticsAt",
      ),
      expectDiagnosticsAt: (label, diagnostics) =>
        testBuilder.expectDiagnosticsAt(label, diagnostics),
      noDiagnostics: () => testBuilder.noDiagnostics(),
      noDiagnosticsExcept: notImplemented("verify.noDiagnosticsExcept"),
      noDiagnosticsExceptAt: notImplemented("verify.noDiagnosticsExceptAt"),
      noDiagnosticsFrom: (...languages) =>
        testBuilder.expectNoDiagnosticsFrom(...languages),
      noParserDiagnostics: () => testBuilder.noParserDiagnostics(),
      noParserErrors: () => testBuilder.noParserDiagnostics(),
      noLinkingDiagnostics: notImplemented("verify.noLinkingDiagnostics"),
      expectToThrow: notImplemented("verify.expectToThrow"),
      expectCompilerOptions: notImplemented("verify.expectCompilerOptions"),
      expectAst: notImplemented("verify.expectAst"),
      expectPPAst: notImplemented("verify.expectPPAst"),
      expectCodeActionAt: notImplemented("verify.expectCodeActionAt"),
      expectCodeActionCountAt: notImplemented("verify.expectCodeActionCountAt"),
      noCodeActions: notImplemented("verify.noCodeActions"),
    },
    types: {
      ...HarnessTypeAttributes,
      expectTypeAt: notImplemented("types.expectTypeAt"),
    },
    completion: {
      expectAt: notImplemented("completion.expectAt"),
    },
    hover: {
      codeBlock: (text) => text,
      include: generateIncludeItemMarkup,
      expectMarkdownAt: notImplemented("hover.expectMarkdownAt"),
      expectTextAt: notImplemented("hover.expectTextAt"),
    },
    signatureHelp: {
      expectNoHelp: notImplemented("signatureHelp.expectNoHelp"),
      expectMarkdownSignatureAt: notImplemented(
        "signatureHelp.expectMarkdownSignatureAt",
      ),
      expectMarkdownParameterAt: notImplemented(
        "signatureHelp.expectMarkdownParameterAt",
      ),
      expectParameterIndexAt: notImplemented(
        "signatureHelp.expectParameterIndexAt",
      ),
    },
    semanticTokens: {
      expectAt: notImplemented("semanticTokens.expectAt"),
      expectModifierAt: notImplemented("semanticTokens.expectModifierAt"),
    },
    preprocessor: {
      not: {
        expectTokens: notImplemented("preprocessor.not.expectTokens"),
        containsTokens: notImplemented("preprocessor.not.containsTokens"),
        expectSkippedCodeAt: notImplemented(
          "preprocessor.not.expectSkippedCodeAt",
        ),
      },
      expectTokens: (tokens) => testBuilder.expectTokens(tokens),
      containsTokens: notImplemented("preprocessor.containsTokens"),
      expectSkippedCodeAt: notImplemented("preprocessor.expectSkippedCodeAt"),
    },
    code: HarnessCodes,
    constants: HarnessConstants,
  };
}
