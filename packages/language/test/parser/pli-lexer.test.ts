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
import { UriUtils } from "../../src/utils/uri";
import { createCompilationUnit } from "../../src/workspace/compilation-unit";
import {
  ProcessGroup,
  ProgramConfig,
} from "../../src/workspace/plugin-configuration-provider";
import { TextDocument } from "vscode-languageserver-textdocument";
import { tokenize } from "../../src/parser/tokenizer";
import { fullCode } from "../../src/language-server/types";
import { PLICodes } from "../../src/validation/pli-codes";
import { CompilerOptions } from "../../src/preprocessor/compiler-options/options-pli";
import { makeProcessGroup, makeProgramConfig } from "../config-fixtures";
import { defaultTestWorkspace } from "../test-workspace";

type TokenizeFunction = (text: string) => Promise<string[]>;

describe("PL/1 Lexer", () => {
  let tokenizeWithErrors: TokenizeFunction;

  beforeAll(async () => {
    const lexer = new PliLexer();
    tokenizeWithErrors = async (text: string) => {
      const uri = UriUtils.toUri("/test/test.pli");
      const document = TextDocument.create(uri.toString(), "pli", 0, text);
      const unit = await createCompilationUnit(uri, defaultTestWorkspace());
      await lexer.tokenize(unit, document, uri);
      return unit.diagnostics.getAll().map((e) => e.message);
    };
  });

  test("Avoid infinite loop on unterminated string", async () => {
    const result = tokenize('"test', undefined);
    expect(result).toBeDefined();
    expect(result.tokens).toHaveLength(0);
    expect(result.diagnostics).toHaveLength(1);
    expect(result.diagnostics[0].code).toBe(fullCode(PLICodes.Severe.IBM3961I));
  });

  test("Exposes the final preprocessed text", async () => {
    const uri = UriUtils.toUri("/test/test.pli");
    const text = `
            %DCL A CHARACTER;
            %A = 'B';
            dcl A fixed bin(31);
            dcl C fixed bin(31);
        `;
    const document = TextDocument.create(uri.toString(), "pli", 0, text);
    const unit = await createCompilationUnit(uri, defaultTestWorkspace());
    const lexer = new PliLexer();
    const result = await lexer.tokenize(unit, document, uri);
    // The macro replaced A with B in the final text.
    expect(result.preprocessedText).toContain("B");
    expect(result.preprocessedText).not.toContain("%DCL");
    // Serialization keeps rough line structure via `startsNewLine`.
    expect(result.preprocessedText).toContain("\n");
    // The result tokens are exactly what lexing the preprocessed text yields.
    expect(result.all.map((t) => t.image)).toStrictEqual(
      tokenize(result.preprocessedText, undefined).tokens.map((t) => t.image),
    );
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
      defaultTestWorkspace().config.setProgramConfigs(UriUtils.toUri(""), []);
      await defaultTestWorkspace().config.setProcessGroupConfigs([]);
    });

    test("Inject process group compiler options after *PROCESS directive", async () => {
      const lexer = new PliLexer();
      const uri = UriUtils.toUri("/test/test.pli");
      const inputText = `*PROCESS ARCH(10);
      DCL A fixed bin(31);`;

      const programConfig: ProgramConfig = makeProgramConfig({
        program: "test.pli",
        pgroup: "testGroup",
      });
      const processGroupConfig: ProcessGroup = makeProcessGroup({
        name: "testGroup",
        compilerOptions: ["ASSERT(ENTRY)"],
        checkMargins: false,
        instructionCounterLimit: 5000,
        caseUpperValidation: false,
      });

      await defaultTestWorkspace().config.init(UriUtils.toUri("/test"));
      defaultTestWorkspace().config.setProgramConfigs(UriUtils.toUri("/test"), [
        programConfig,
      ]);
      const diagnostics =
        await defaultTestWorkspace().config.setProcessGroupConfigs([
          processGroupConfig,
        ]);

      expect(diagnostics).toHaveLength(0);

      const { compilerOptions } = await lexer.tokenize(
        await createCompilationUnit(uri, defaultTestWorkspace()),
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
      const uri = UriUtils.toUri("/test/test.pli");
      const inputText = `*PROCESS ARCH(10);
      DCL A fixed bin(31);`;

      const programConfig: ProgramConfig = makeProgramConfig({
        program: "test.pli",
        pgroup: "missingGroup",
      });

      await defaultTestWorkspace().config.init(UriUtils.toUri("/test"));
      defaultTestWorkspace().config.setProgramConfigs(UriUtils.toUri("/test"), [
        programConfig,
      ]);

      const { compilerOptions } = await lexer.tokenize(
        await createCompilationUnit(uri, defaultTestWorkspace()),
        TextDocument.create(uri.toString(), "pli", 0, inputText),
        uri,
      );

      expect(compilerOptions.result?.options.arch).toBeDefined();
    });

    test("Inject compiler options when *PROCESS directive is absent", async () => {
      const lexer = new PliLexer();
      const uri = UriUtils.toUri("/test/test.pli");
      const inputText = " DCL A fixed bin(31);";

      const programConfig: ProgramConfig = makeProgramConfig({
        program: "test.pli",
        pgroup: "testGroup",
      });
      const processGroupConfig: ProcessGroup = makeProcessGroup({
        name: "testGroup",
        compilerOptions: ["ASSERT(ENTRY)"],
        checkMargins: false,
        instructionCounterLimit: 5000,
        caseUpperValidation: false,
      });

      await defaultTestWorkspace().config.init(UriUtils.toUri("/test"));
      defaultTestWorkspace().config.setProgramConfigs(UriUtils.toUri("/test"), [
        programConfig,
      ]);
      await defaultTestWorkspace().config.setProcessGroupConfigs([
        processGroupConfig,
      ]);

      const { compilerOptions } = await lexer.tokenize(
        await createCompilationUnit(uri, defaultTestWorkspace()),
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
