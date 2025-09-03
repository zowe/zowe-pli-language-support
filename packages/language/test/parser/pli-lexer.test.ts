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
import { PluginConfigurationProviderInstance } from "../../src/workspace/plugin-configuration-provider";
import { TextDocument } from "vscode-languageserver-textdocument";

type TokenizeFunction = (text: string) => Promise<string[]>;

describe("PL/1 Lexer", () => {
  let tokenize: TokenizeFunction;
  let tokenizeWithErrors: TokenizeFunction;

  beforeAll(async () => {
    const lexer = new PliLexer();
    tokenize = async (text: string) => {
      const uri = URI.file("/test/test.pli");
      const document = TextDocument.create(uri.toString(), "pli", 0, text);
      const { all: allTokens, errors } = await lexer.tokenize(
        await createCompilationUnit(uri),
        document,
        uri,
      );
      if (errors.length > 0) {
        throw new Error(
          errors
            .map((e) => `${e.range?.start}:${e.range?.end}: ${e.message}`)
            .join("\n"),
        );
      }
      return allTokens.map(
        (t) => t.image + ":" + t.tokenType.name.toUpperCase(),
      );
    };
    tokenizeWithErrors = async (text: string) => {
      const uri = URI.file("/test/test.pli");
      const document = TextDocument.create(uri.toString(), "pli", 0, text);
      const { errors } = await lexer.tokenize(
        await createCompilationUnit(uri),
        document,
        uri,
      );
      return errors.map((e) => e.message);
    };
  });

  test("Preprocessor garbage", async () => {
    expect(await tokenizeWithErrors(" %garbage")).toStrictEqual([
      `Unexpected token 'GARBAGE'.`,
    ]);
  });

  test("PL/I garbage", async () => {
    //This is not an error, since it is a valid PL/I token.
    //The error will pop up in the PL/I parser due to syntax rules!
    expect(await tokenizeWithErrors(" garbage")).toStrictEqual([]);
  });

  test("Tokenize simple declaration with preprocessor", async () => {
    expect(
      await tokenize(`
            %dcl A char;
            %A = 'B';
            dcl A%;C fixed bin(31);
        `),
    ).toStrictEqual([
      "DCL:DECLARE",
      "BC:ID",
      "FIXED:FIXED",
      "BIN:BINARY",
      "(:(",
      "31:NUMBER",
      "):)",
      ";:;",
    ]);
  });

  test("Tokenize simple error in declaration with preprocessor", async () => {
    expect(
      await tokenizeWithErrors(`
            %decl A char;
            %A = 'B';
            dcl A%;C fixed bin(31);
        `),
    ).toStrictEqual(["Unexpected token 'DECL'."]);
  });

  test("Tokenize multiple errors in declaration with preprocessor", async () => {
    expect(
      await tokenizeWithErrors(`
            %decl A char;
            %%A = 'B';
        `),
    ).toStrictEqual(["Unexpected token 'DECL'.", "Unexpected token '%'."]);
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

  test("Hello World", async () => {
    expect(
      await tokenize(`
            AVERAGE: PROCEDURE OPTIONS (MAIN);
                /* Test characters: ^[] € */
                /* AVERAGE_GRADE = SUM / 5; */
                PUT LIST ('PROGRAM TO COMPUTE AVERAGE');
            END AVERAGE;
        `),
    ).toStrictEqual([
      "AVERAGE:ID",
      ":::",
      "PROCEDURE:PROCEDURE",
      "OPTIONS:OPTIONS",
      "(:(",
      "MAIN:MAIN",
      "):)",
      ";:;",
      "PUT:PUT",
      "LIST:LIST",
      "(:(",
      "'PROGRAM TO COMPUTE AVERAGE':STRING_TERM",
      "):)",
      ";:;",
      "END:END",
      "AVERAGE:ID",
      ";:;",
    ]);
  });

  test("NodeDescriptor", async () => {
    expect(
      await tokenize(`
            a: proc( x ) options(nodescriptor);
              dcl x(20) fixed bin nonconnected;
            end a;
        `),
    ).toStrictEqual([
      "A:A",
      ":::",
      "PROC:PROCEDURE",
      "(:(",
      "X:X",
      "):)",
      "OPTIONS:OPTIONS",
      "(:(",
      "NODESCRIPTOR:NODESCRIPTOR",
      "):)",
      ";:;",
      "DCL:DECLARE",
      "X:X",
      "(:(",
      "20:NUMBER",
      "):)",
      "FIXED:FIXED",
      "BIN:BINARY",
      "NONCONNECTED:NONCONNECTED",
      ";:;",
      "END:END",
      "A:A",
      ";:;",
    ]);
  });

  describe("Compiler Options", () => {
    afterAll(() => {
      // Reset the plugin configuration state
      PluginConfigurationProviderInstance.setProgramConfigs("", []);
      PluginConfigurationProviderInstance.setProcessGroupConfigs([]);
    });

    test("Inject process group compiler options after *PROCESS directive", async () => {
      const lexer = new PliLexer();
      const uri = URI.file("/test/test.pli");
      const inputText = `*PROCESS ARCH(10);
      DCL A fixed bin(31);`;

      const programConfig = {
        program: "test.pli",
        pgroup: "testGroup",
      };
      const processGroupConfig = {
        name: "testGroup",
        "compiler-options": ["ASSERT(ENTRY)"],
      };

      await PluginConfigurationProviderInstance.init("/test");
      PluginConfigurationProviderInstance.setProgramConfigs("/test", [
        programConfig,
      ]);
      PluginConfigurationProviderInstance.setProcessGroupConfigs([
        processGroupConfig,
      ]);

      const { compilerOptions } = await lexer.tokenize(
        await createCompilationUnit(uri),
        TextDocument.create(uri.toString(), "pli", 0, inputText),
        uri,
      );

      expect(compilerOptions.result?.options.arch).toBeDefined();
      expect(compilerOptions.result?.options.assert).toBeDefined();
      expect(compilerOptions.result?.options.assert).toBe("ENTRY");
    });

    test("Missing process group configuration is OK", async () => {
      const lexer = new PliLexer();
      const uri = URI.file("/test/test.pli");
      const inputText = `*PROCESS ARCH(10);
      DCL A fixed bin(31);`;

      const programConfig = {
        program: "test.pli",
        pgroup: "missingGroup",
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

      const programConfig = {
        program: "test.pli",
        pgroup: "testGroup",
      };
      const processGroupConfig = {
        name: "testGroup",
        "compiler-options": ["ASSERT(ENTRY)"],
      };

      await PluginConfigurationProviderInstance.init("/test");
      PluginConfigurationProviderInstance.setProgramConfigs("/test", [
        programConfig,
      ]);
      PluginConfigurationProviderInstance.setProcessGroupConfigs([
        processGroupConfig,
      ]);

      const { compilerOptions } = await lexer.tokenize(
        await createCompilationUnit(uri),
        TextDocument.create(uri.toString(), "pli", 0, inputText),
        uri,
      );

      expect(compilerOptions.result?.options.assert).toBeDefined();
      expect(compilerOptions.result?.options.assert).toBe("ENTRY");
      expect(compilerOptions.result?.options.arch).toBeUndefined();
    });
  });
});
