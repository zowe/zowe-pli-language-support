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

import { describe, expect, test, vitest } from "vitest";
import { HarnessTesterInterface } from "./harness-interface";
import { HarnessCodes } from "./implementation/codes";
import { HarnessTest } from "./types";
import { runHarnessTest } from "./harness-runner";
import { parseHarnessTest } from "./harness-parser";
import { parseWrapperFile } from "./wrapper";
import { HarnessConstants } from "./implementation/constants";
import { TestBuilder } from "../test-builder";
import { generateIncludeItemMarkup } from "../../src/language-server/hover-request";
import { SyntaxKind } from "../../src/syntax-tree/ast";
import { HarnessTypeAttributes } from "./implementation/type-attributes";
import { CICSPreprocessor } from "preprocessor-cics";
import { Db2SqlPreprocessor } from "preprocessor-db2";
import { PliLanguageName } from "../../src/language-server/types";

type HarnessImplementationListener = (
  method: string,
  ...args: any[]
) => Promise<void>;

const INTERNAL_METHOD_NAME_PREFIX = "__methodName";

function createListenerCreator(listener: HarnessImplementationListener) {
  return (methodName: string) => {
    const _listener = async function (...args: any[]) {
      await listener(methodName, ...args);
    };
    _listener[INTERNAL_METHOD_NAME_PREFIX] = methodName;

    return _listener;
  };
}

async function createTestingHarnessImplementation(
  listener: HarnessImplementationListener,
): Promise<HarnessTesterInterface> {
  const listen = createListenerCreator(listener);

  return {
    Syntax: SyntaxKind,
    languages: {
      Pli: PliLanguageName,
      Db2Sql: Db2SqlPreprocessor.Name,
      Cics: CICSPreprocessor.Name,
    },
    linker: {
      expectLinks: listen("linker.expectLinks"),
      expectNoLinksAt: listen("linker.expectNoLinksAt"),
      expectReferences: listen("linker.expectReferences"),
    },
    testAPI: {
      testBuilder: await TestBuilder.create("", {}),
    },
    verify: {
      expectExclusiveErrorCodesAt: listen("verify.expectExclusiveErrorCodesAt"),
      expectErrorCodesAt: listen("verify.expectErrorCodesAt"),
      expectExclusiveDiagnosticsAt: listen(
        "verify.expectExclusiveDiagnosticsAt",
      ),
      expectDiagnosticsAt: listen("verify.expectDiagnosticsAt"),
      noDiagnostics: listen("verify.noDiagnostics"),
      noDiagnosticsFrom: listen("verify.noDiagnosticsFrom"),
      noDiagnosticsExcept: listen("verify.noDiagnosticsExcept"),
      noDiagnosticsExceptAt: listen("verify.noDiagnosticsExceptAt"),
      noParserDiagnostics: listen("verify.noParserDiagnostics"),
      noParserErrors: listen("verify.noParserErrors"),
      noLinkingDiagnostics: listen("verify.noLinkingDiagnostics"),
      expectToThrow: listen("verify.expectToThrow"),
      expectCompilerOptions: listen("verify.expectCompilerOptions"),
      expectAst: listen("verify.expectAst"),
      expectPPAst: listen("verify.expectPPAst"),
      expectCodeActionAt: listen("verify.expectCodeActionAt"),
      expectCodeActionCountAt: listen("verify.expectCodeActionCountAt"),
      noCodeActions: listen("verify.noCodeActions"),
    },
    types: {
      ...HarnessTypeAttributes,
      expectTypeAt: listen("types.expectTypeAt"),
    },
    completion: {
      expectAt: listen("completion.expectAt"),
    },
    hover: {
      codeBlock: (text) => text,
      include: generateIncludeItemMarkup,
      expectMarkdownAt: listen("hover.expectMarkdownAt"),
      expectTextAt: listen("hover.expectTextAt"),
    },
    signatureHelp: {
      expectNoHelp: listen("signatureHelp.expectNoHelp"),
      expectMarkdownSignatureAt: listen(
        "signatureHelp.expectMarkdownSignatureAt",
      ),
      expectMarkdownParameterAt: listen(
        "signatureHelp.expectMarkdownParameterAt",
      ),
      expectParameterIndexAt: listen("signatureHelp.expectParameterIndexAt"),
    },
    semanticTokens: {
      expectAt: listen("semanticTokens.expectAt"),
      expectModifierAt: listen("semanticTokens.expectModifierAt"),
    },
    preprocessor: {
      not: {
        expectTokens: listen("preprocessor.not.expectTokens"),
        containsTokens: listen("preprocessor.not.containsTokens"),
        expectSkippedCodeAt: listen("preprocessor.not.expectSkippedCodeAt"),
      },
      expectTokens: listen("preprocessor.expectTokens"),
      containsTokens: listen("preprocessor.containsTokens"),
      expectSkippedCodeAt: listen("preprocessor.expectSkippedCodeAt"),
    },
    code: HarnessCodes,
    constants: HarnessConstants,
  };
}

describe("Harness test framework tests", () => {
  test("should run expectNoLinksAt command", async () => {
    const mockFunction = vitest.fn().mockImplementation(() => {});
    const implementation =
      await createTestingHarnessImplementation(mockFunction);
    const commands = `linker.expectNoLinksAt("label");`;

    const file: HarnessTest = {
      commands,
      fileName: "test.pli",
      files: new Map(),
      tags: {},
    };

    await runHarnessTest(file, implementation);

    expect(mockFunction).toHaveBeenCalledWith(
      "linker.expectNoLinksAt",
      "label",
    );
  });

  test("should run all commands", async () => {
    const mockFunction = vitest.fn().mockImplementation(() => {});
    const implementation =
      await createTestingHarnessImplementation(mockFunction);

    const functionCalls = Object.values(implementation).flatMap(
      (group, groupId) =>
        Object.values(group)
          .filter(
            (method) =>
              (method as any)?.[INTERNAL_METHOD_NAME_PREFIX] !== undefined,
          )
          .map((method, methodId) => [
            (method as any)[INTERNAL_METHOD_NAME_PREFIX],
            `${groupId}.${methodId}`,
          ]),
    );

    const commands = functionCalls
      .map(
        ([methodName, methodArguments]) =>
          `${methodName}("${methodArguments}")`,
      )
      .join("\n");

    const file: HarnessTest = {
      commands,
      fileName: "test.pli",
      files: new Map(),
      tags: {},
    };

    await runHarnessTest(file, implementation);

    for (const [method, methodArguments] of functionCalls) {
      expect(mockFunction).toHaveBeenCalledWith(method, methodArguments);
    }
  });

  test("should extract code from multiple file blocks", () => {
    const wrap1 = "main";
    const fileName1 = "file1.pli";
    const content1 = `line
 with space
  and newlines
  
two newlines`;

    const wrap2 = "main2";
    const fileName2 = "file2.pli";
    const content2 = `CONTENT`;

    const commands = `
/// <reference path="../framework.ts" />

import { whatever } from "wherever";

/**
 Ignore this comment please
 */

// @wrap: ${wrap1}
// @filename: ${fileName1}
${content1
  .split("\n")
  .map((line) => `////${line}`)
  .join("\n")}

// @wrap: ${wrap2}
// @filename: ${fileName2}
////${content2}
`;

    const file = parseHarnessTest(commands, "test.ts", {
      wrappers: {
        main: {
          wrap: (content) => content,
          headerLength: 0,
          footerLength: 0,
        },
        main2: {
          wrap: (content) => content,
          headerLength: 0,
          footerLength: 0,
        },
      },
    });

    const file1 = file.files.get(`file:///${fileName1}`);
    const file2 = file.files.get(`file:///${fileName2}`);

    expect(file1).toBeDefined();
    expect(file2).toBeDefined();

    expect(file1?.content).toBe(content1);
    expect(file2?.content).toBe(content2);

    expect(file1?.wrap).toBe(wrap1);
    expect(file2?.wrap).toBe(wrap2);

    expect(file.commands).toBe(commands);
    expect(file.fileName).toBe("test.ts");
  });

  test("should wrap a file in a wrapper", () => {
    const commands = `
/// <reference path="../framework.ts" />

// @wrap: main
// @filename: main.pli
////MY CONTENT
`;

    const file = parseHarnessTest(commands, "test.ts", {
      wrappers: {
        main: {
          wrap: (content) => `WRAP_BEGIN ${content} WRAP_END`,
          headerLength: 1,
          footerLength: 1,
        },
      },
    });

    const mainFile = file.files.get("file:///main.pli");

    expect(mainFile).toBeDefined();
    expect(mainFile?.wrap).toBe("main");
    expect(mainFile?.content).toBe(`WRAP_BEGIN MY CONTENT WRAP_END`);
  });

  test("should parse a wrapper file", () => {
    const wrapFileContent = `////WRAP_BEGIN <...> WRAP_END`;
    const wrapper = parseWrapperFile(wrapFileContent);

    expect(wrapper.wrap("MY CONTENT")).toBe("WRAP_BEGIN MY CONTENT WRAP_END");
  });
});
