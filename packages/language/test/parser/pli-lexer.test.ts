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

import { beforeAll, describe, expect, test, afterAll } from "vitest";
import { PliLexer } from "../../src/preprocessor/pli-lexer";
import { URI } from "../../src/utils/uri";
import { createCompilationUnit } from "../../src/workspace/compilation-unit";
import {
  PluginConfigurationProviderInstance,
  ProcessGroup,
  ProgramConfig,
} from "../../src/workspace/plugin-configuration-provider";
import { TextDocument } from "vscode-languageserver-textdocument";
import { tokenize } from "../../src/parser/tokenizer";
import { fullCode } from "../../src/language-server/types";
import { PLICodes } from "../../src/validation/pli-codes";
import { CompilerOptions } from "../../src/preprocessor/compiler-options/options-pli";

type TokenizeFunction = (text: string) => Promise<string[]>;

describe("PL/1 Lexer", () => {
  let tokenizeWithErrors: TokenizeFunction;

  beforeAll(async () => {
    const lexer = new PliLexer();
    tokenizeWithErrors = async (text: string) => {
      const uri = URI.file("/test/test.pli");
      const document = TextDocument.create(uri.toString(), "pli", 0, text);
      const { diagnostics } = await lexer.tokenize(
        await createCompilationUnit(uri),
        document,
        uri,
      );
      return diagnostics.map((e) => e.message);
    };
  });

  test("Avoid infinite loop on unterminated string", async () => {
    const result = tokenize('"test', undefined);
    expect(result).toBeDefined();
    expect(result.tokens).toHaveLength(0);
    expect(result.diagnostics).toHaveLength(1);
    expect(result.diagnostics[0].code).toBe(fullCode(PLICodes.Severe.IBM3961I));
  });

  test("Preprocessor garbage", async () => {
    expect(await tokenizeWithErrors(" %garbage")).toStrictEqual([
      `Unexpected token 'GARBAGE', expected statement.`,
    ]);
  });

  test("PL/I garbage", async () => {
    //This is not an error, since it is a valid PL/I token.
    //The error will pop up in the PL/I parser due to syntax rules!
    expect(await tokenizeWithErrors(" garbage")).toStrictEqual([]);
  });

  test("Tokenize simple error in declaration with preprocessor", async () => {
    expect(
      await tokenizeWithErrors(`
            %decl A char;
            %A = 'B';
            dcl A%;C fixed bin(31);
        `),
    ).toStrictEqual(["Unexpected token 'DECL', expected statement."]);
  });

  test("Tokenize multiple errors in declaration with preprocessor", async () => {
    expect(
      await tokenizeWithErrors(`
            %decl A char;
            %%A = 'B';
        `),
    ).toStrictEqual([
      "Unexpected token 'DECL', expected statement.",
      "Unexpected token '%', expected statement.",
    ]);
  });

  test("Skip directive without parentheses should not lex correctly", async () => {
    expect(
      await tokenizeWithErrors(`
            %SKIP 2;
            dcl A fixed bin(31);
            dcl B fixed bin(31);
        `),
    ).not.toStrictEqual([]);
  });

  test("Skip directive with incorrect parentheses should not lex correctly", async () => {
    expect(
      await tokenizeWithErrors(`
            %SKIP (2;
            dcl A fixed bin(31);
            dcl B fixed bin(31);
        `),
    ).not.toStrictEqual([]);
  });

  describe("Compiler Options", () => {
    afterAll(async () => {
      // Reset the plugin configuration state
      PluginConfigurationProviderInstance.setProgramConfigs("", []);
      await PluginConfigurationProviderInstance.setProcessGroupConfigs([]);
    });

    test("Inject process group compiler options after *PROCESS directive", async () => {
      const lexer = new PliLexer();
      const uri = URI.file("/test/test.pli");
      const inputText = `*PROCESS ARCH(10);
      DCL A fixed bin(31);`;

      const programConfig: ProgramConfig = {
        program: "test.pli",
        pgroup: "testGroup",
        pliOptions: {},
      };
      const processGroupConfig: ProcessGroup = {
        name: "testGroup",
        compilerOptions: ["ASSERT(ENTRY)"],
        implicitBuiltins: new Set(),
        includeExtensions: [],
        libs: [],
        $computedLibs: [],
        $computedLibsSet: new Set<string>(),
        lspOptions: {
          checkMargins: false,
          instructionCounterLimit: 5000,
          caseUpperValidation: false,
        },
        pliOptions: {},
      };

      await PluginConfigurationProviderInstance.init("/test");
      PluginConfigurationProviderInstance.setProgramConfigs("/test", [
        programConfig,
      ]);
      const diagnostics =
        await PluginConfigurationProviderInstance.setProcessGroupConfigs([
          processGroupConfig,
        ]);

      expect(diagnostics).toHaveLength(0);

      const { compilerOptions } = await lexer.tokenize(
        await createCompilationUnit(uri),
        TextDocument.create(uri.toString(), "pli", 0, inputText),
        uri,
      );

      expect(compilerOptions.result?.options.arch).toBeDefined();
      expect(compilerOptions.result?.options.assert).toBeDefined();
      expect(compilerOptions.result?.options.assert).toBe(
        CompilerOptions.Assert.ENTRY,
      );
    });

    test("Missing process group configuration is OK", async () => {
      const lexer = new PliLexer();
      const uri = URI.file("/test/test.pli");
      const inputText = `*PROCESS ARCH(10);
      DCL A fixed bin(31);`;

      const programConfig: ProgramConfig = {
        program: "test.pli",
        pgroup: "missingGroup",
        pliOptions: {},
      };

      await PluginConfigurationProviderInstance.init("/test");
      PluginConfigurationProviderInstance.setProgramConfigs("/test", [
        programConfig,
      ]);

      const { compilerOptions } = await lexer.tokenize(
        await createCompilationUnit(uri),
        TextDocument.create(uri.toString(), "pli", 0, inputText),
        uri,
      );

      expect(compilerOptions.result?.options.arch).toBeDefined();
    });

    test("Inject compiler options when *PROCESS directive is absent", async () => {
      const lexer = new PliLexer();
      const uri = URI.file("/test/test.pli");
      const inputText = " DCL A fixed bin(31);";

      const programConfig: ProgramConfig = {
        program: "test.pli",
        pgroup: "testGroup",
        pliOptions: {},
      };
      const processGroupConfig: ProcessGroup = {
        name: "testGroup",
        compilerOptions: ["ASSERT(ENTRY)"],
        implicitBuiltins: new Set(),
        includeExtensions: [],
        libs: [],
        $computedLibs: [],
        $computedLibsSet: new Set<string>(),
        lspOptions: {
          checkMargins: false,
          instructionCounterLimit: 5000,
          caseUpperValidation: false,
        },
        pliOptions: {},
      };

      await PluginConfigurationProviderInstance.init("/test");
      PluginConfigurationProviderInstance.setProgramConfigs("/test", [
        programConfig,
      ]);
      await PluginConfigurationProviderInstance.setProcessGroupConfigs([
        processGroupConfig,
      ]);

      const { compilerOptions } = await lexer.tokenize(
        await createCompilationUnit(uri),
        TextDocument.create(uri.toString(), "pli", 0, inputText),
        uri,
      );

      expect(compilerOptions.result?.options.assert).toBeDefined();
      expect(compilerOptions.result?.options.assert).toBe(
        CompilerOptions.Assert.ENTRY,
      );
    });
  });
});
