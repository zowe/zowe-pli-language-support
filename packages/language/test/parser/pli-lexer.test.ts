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

type TokenizeFunction = (text: string) => string[];

describe("PL/1 Lexer", () => {
  let tokenize: TokenizeFunction;
  let tokenizeWithErrors: TokenizeFunction;

  beforeAll(async () => {
    const lexer = new PliLexer();
    tokenize = (text: string) => {
      const uri = URI.file("/test/test.pli");
      const { all: allTokens, errors } = lexer.tokenize(
        createCompilationUnit(uri),
        text,
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
    tokenizeWithErrors = (text: string) => {
      const uri = URI.file("/test/test.pli");
      const { errors } = lexer.tokenize(createCompilationUnit(uri), text, uri);
      return errors.map((e) => e.message);
    };
  });

  test("Preprocessor garbage", () => {
    expect(tokenizeWithErrors(" %garbage")).toStrictEqual([
      `Unexpected token 'garbage'.`,
    ]);
  });

  test("PL/I garbage", () => {
    //This is not an error, since it is a valid PL/I token.
    //The error will pop up in the PL/I parser due to syntax rules!
    expect(tokenizeWithErrors(" garbage")).toStrictEqual([]);
  });

  test("Tokenize simple declaration with preprocessor", () => {
    expect(
      tokenize(`
            %dcl A char;
            %A = 'B';
            dcl A%;C fixed bin(31);
        `),
    ).toStrictEqual([
      "dcl:DECLARE",
      "BC:ID",
      "fixed:FIXED",
      "bin:BINARY",
      "(:(",
      "31:NUMBER",
      "):)",
      ";:;",
    ]);
  });

  test("Tokenize simple error in declaration with preprocessor", () => {
    expect(
      tokenizeWithErrors(`
            %decl A char;
            %A = 'B';
            dcl A%;C fixed bin(31);
        `),
    ).toStrictEqual(["Unexpected token 'decl'."]);
  });

  test("Tokenize multiple errors in declaration with preprocessor", () => {
    expect(
      tokenizeWithErrors(`
            %decl A char;
            %%A = 'B';
        `),
    ).toStrictEqual(["Unexpected token 'decl'.", "Unexpected token '%'."]);
  });

  test("Skip directive without parentheses should not lex correctly", () => {
    expect(
      tokenizeWithErrors(`
            %SKIP 2;
            dcl A fixed bin(31);
            dcl B fixed bin(31);
        `),
    ).not.toStrictEqual([]);
  });

  test("Skip directive with incorrect parentheses should not lex correctly", () => {
    expect(
      tokenizeWithErrors(`
            %SKIP (2;
            dcl A fixed bin(31);
            dcl B fixed bin(31);
        `),
    ).not.toStrictEqual([]);
  });

  test("Hello World", () => {
    expect(
      tokenize(`
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

  test("NodeDescriptor", () => {
    expect(
      tokenize(`
            a: proc( x ) options(nodescriptor);
              dcl x(20) fixed bin nonconnected;
            end a;
        `),
    ).toStrictEqual([
      "a:A",
      ":::",
      "proc:PROCEDURE",
      "(:(",
      "x:X",
      "):)",
      "options:OPTIONS",
      "(:(",
      "nodescriptor:NODESCRIPTOR",
      "):)",
      ";:;",
      "dcl:DECLARE",
      "x:X",
      "(:(",
      "20:NUMBER",
      "):)",
      "fixed:FIXED",
      "bin:BINARY",
      "nonconnected:NONCONNECTED",
      ";:;",
      "end:END",
      "a:A",
      ";:;",
    ]);
  });

  test.skip("XYZ", () => {
    expect(
      tokenize(`
            %DCL GEN ENTRY;
            DCL A GEN(FIXED);
            %GEN: PROCEDURE(STRING) RETURNS (CHAR);
                DCL STRING CHAR;
                RETURN (STRING);
            END;
        `),
    ).toStrictEqual([
      // DCL A GENERIC(A2 WHEN (FIXED,FIXED),
      // A3 WHEN (FIXED, FIXED, FIXED),
      // A4 WHEN (FIXED, FIXED, FIXED, FIXED),
      // A5 WHEN (FIXED, FIXED, FIXED, FIXED, FIXED));
    ]);
  });

  test.skip("Preprocessor example", () => {
    //TODO the final procedure test
    expect(
      tokenize(`
            %DCL GEN ENTRY;
            DCL A GEN (A,2,5,FIXED);
            %GEN: PROC(NAME,LOW,HIGH,ATTR) RETURNS (CHAR);
                DCL (NAME, SUFFIX, ATTR, STRING) CHAR, (LOW, HIGH, I, J) FIXED;
                STRING='GENERIC(';
                DO I=LOW TO HIGH;                      /* ENTRY NAME LOOP*/
                    IF I>9 THEN
                    SUFFIX=SUBSTR(I, 7, 2);
                                                        /* 2 DIGIT SUFFIX*/
                    ELSE SUFFIX=SUBSTR(I, 8, 1);
                                                        /* 1 DIGIT SUFFIX*/
                    STRING=STRING||NAME||SUFFIX||' WHEN (';
                    DO J=1 TO I;                        /* DESCRIPTOR LIST*/
                    STRING=STRING||ATTR;
                    IF J<I                           /* ATTRIBUTE SEPARATOR*/
                        THEN STRING=STRING||',';
                        ELSE STRING=STRING||')';
                                                        /* LIST SEPARATOR */
                    END;
                    IF I<HIGH THEN                      /* ENTRY NAME SEPARATOR*/
                    STRING=STRING||',';
                    ELSE STRING=STRING||')';
                                                    /* END OF LIST /*
                END;
                RETURN (STRING);
            % END;
        `),
    ).toStrictEqual([
      // DCL A GENERIC(A2 WHEN (FIXED,FIXED),
      // A3 WHEN (FIXED, FIXED, FIXED),
      // A4 WHEN (FIXED, FIXED, FIXED, FIXED),
      // A5 WHEN (FIXED, FIXED, FIXED, FIXED, FIXED));
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

      const { compilerOptions } = lexer.tokenize(
        createCompilationUnit(uri),
        inputText,
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

      const { compilerOptions } = lexer.tokenize(
        createCompilationUnit(uri),
        inputText,
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

      const { compilerOptions } = lexer.tokenize(
        createCompilationUnit(uri),
        inputText,
        uri,
      );

      expect(compilerOptions.result?.options.assert).toBeDefined();
      expect(compilerOptions.result?.options.assert).toBe("ENTRY");
      expect(compilerOptions.result?.options.arch).toBeUndefined();
    });
  });
});
