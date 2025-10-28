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

import { describe, test, expect } from "vitest";
import { parseAbstractCompilerOptions } from "../../src/preprocessor/compiler-options/parser";
import { translateCompilerOptions } from "../../src/preprocessor/compiler-options/translate";
import {
  CompilerOption,
  CompilerOptionString,
  CompilerOptionText,
  SyntaxKind,
} from "../../src/syntax-tree/ast";
import { CompilerOptions } from "../../src/preprocessor/compiler-options/options-pli";
import { parse } from "../utils";

describe("CompilerOptions parser", async () => {
  test("simple word based compiler option", async () => {
    const options = await parseAbstractCompilerOptions("TERMINAL").options;
    expect(options).toHaveLength(1);
    expect(options[0].name).toBe("TERMINAL");
    expect(options[0].token.startOffset).toBe(0);
    expect(options[0].token.endOffset).toBe(7);
    expect(options[0].values).toHaveLength(0);
  });

  test("compiler option with parameter", async () => {
    const options =
      await parseAbstractCompilerOptions("AGGREGATE(DECIMAL)").options;
    expect(options).toHaveLength(1);
    expect(options[0].name).toBe("AGGREGATE");
    expect(options[0].values).toHaveLength(1);
    const parameter = options[0].values[0] as CompilerOptionText;
    expect(parameter.kind).toBe(SyntaxKind.CompilerOptionText);
    expect(parameter.value).toBe("DECIMAL");
  });

  test("compiler option with string parameter", async () => {
    const options =
      await parseAbstractCompilerOptions("BRACKETS('[]')").options;
    expect(options).toHaveLength(1);
    expect(options[0].name).toBe("BRACKETS");
    expect(options[0].values).toHaveLength(1);
    const parameter = options[0].values[0] as CompilerOptionString;
    expect(parameter.kind).toBe(SyntaxKind.CompilerOptionString);
    expect(parameter.value).toBe("[]");
  });

  test("compiler option with number parameter", async () => {
    const options = await parseAbstractCompilerOptions("ARCH(10)").options;
    expect(options).toHaveLength(1);
    expect(options[0].name).toBe("ARCH");
    expect(options[0].values).toHaveLength(1);
    const parameter = options[0].values[0] as CompilerOptionText;
    expect(parameter.kind).toBe(SyntaxKind.CompilerOptionText);
    expect(parameter.value).toBe("10");
  });

  test("compiler option with nested parameter", async () => {
    const options = await parseAbstractCompilerOptions(
      "DISPLAY(WTO(ROUTCDE(2)))",
    ).options;
    expect(options).toHaveLength(1);
    expect(options[0].name).toBe("DISPLAY");
    expect(options[0].values).toHaveLength(1);
    const parameter = options[0].values[0] as CompilerOption;
    expect(parameter.kind).toBe(SyntaxKind.CompilerOption);
    expect(parameter.name).toBe("WTO");
    expect(parameter.values).toHaveLength(1);
    const nested = parameter.values[0] as CompilerOption;
    expect(nested.kind).toBe(SyntaxKind.CompilerOption);
    expect(nested.name).toBe("ROUTCDE");
    expect(nested.values).toHaveLength(1);
    const nestedParameter = nested.values[0] as CompilerOptionText;
    expect(nestedParameter.kind).toBe(SyntaxKind.CompilerOptionText);
    expect(nestedParameter.value).toBe("2");
  });

  test("multiple compiler options", async () => {
    const options =
      await parseAbstractCompilerOptions("COMPILE,TERMINAL").options;
    expect(options).toHaveLength(2);
    expect(options[0].name).toBe("COMPILE");
    expect(options[1].name).toBe("TERMINAL");
  });
});

describe("CompilerOptions translator", async () => {
  test("Test PP validation", async () => {
    const options = await parseAbstractCompilerOptions(
      "PP(INCLUDE('ID(++INCLUDE)'))",
    );
    const result = translateCompilerOptions(options);
    const issues = result.issues;
    expect(issues).toHaveLength(0);

    const pp = result.options.pp as CompilerOptions.PP;
    expect(pp).toBeDefined();
    const items = pp.items as CompilerOptions.PPItem[];
    expect(items).toBeDefined();
    expect(items).toHaveLength(1);

    const ppItem: CompilerOptions.PPItem = (
      items as CompilerOptions.PPItem[]
    )[0];
    expect(ppItem.name).toBe("INCLUDE");
    expect(ppItem.value).toBe("ID(++INCLUDE)");

    // expect ppInclude to be normalized & set
    const ppInclude = pp.ppInclude as CompilerOptions.PPInclude;
    expect(ppInclude).toBeDefined();
    expect(ppInclude.value).toBe("++INCLUDE");
  });

  test('Test "SYSPARM" default option', async () => {
    // parse any compiler option, we should still expect the default SYSPARM in the complete options object
    const options = await parseAbstractCompilerOptions("AG");
    const translated = translateCompilerOptions(options).options;
    expect(translated.sysParm).toBeDefined();
    expect(translated.sysParm).toBe("");
  });

  test('Test "SYSPARM" option', async () => {
    const options = await parseAbstractCompilerOptions("SYSPARM('PLIVERSION')");
    const translated = translateCompilerOptions(options).options;
    expect(translated.sysParm).toBe("PLIVERSION");
  });

  test('Test "SYSPARM" error on excessive length', async () => {
    // >= 1023 is an issue
    const options = await parseAbstractCompilerOptions(
      `SYSPARM('${"i".repeat(1024)}')`,
    );
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toMatch(
      /SYSPARM value exceeds maximum length of 1023 characters. Received/,
    );
  });

  test('Test "SYSTEM" option default, should be MVS', async () => {
    const options = await parseAbstractCompilerOptions("SYSTEM");
    const translated = translateCompilerOptions(options).options;
    expect(translated.system).toBe("MVS");
  });

  for (const systemValue of ["MVS", "CICS", "IMS", "OS", "TSO"]) {
    test(
      'Test "SYSTEM" option with expected value ' + systemValue,
      async () => {
        const options = await parseAbstractCompilerOptions(
          "SYSTEM(" + systemValue + ")",
        );
        const translated = translateCompilerOptions(options).options;
        expect(translated.system).toBe(systemValue);
      },
    );
  }
});

describe("Process directives", async () => {
  test("should parse multiple process directives", async () => {
    const code = `
%PROCESS F(I) AG A(F); 
*PROCESS MARGINS(2,75);
%PROCESS F(I) AG A(F); 
 DECLARE LIBREF FIXED;
 LIBREF = 44;`;

    const doc = await parse(code, { validate: true });
    expect(doc.compilerOptions.flag).toBe("I");
    expect(doc.compilerOptions.aggregate).toBeDefined();
    expect(doc.compilerOptions.attributes?.identifiers).toBe("FULL");
    expect(doc.compilerOptions.margins).toEqual({ m: 2, n: 75 });
  });

  test("should parse multiple process directives with comments", async () => {
    const code = `
%PROCESS F(I) AG A(F); /* XX */
*PROCESS MARGINS(2,75); // test
%PROCESS DEFAULT(RETURNS()); 
 DECLARE LIBREF FIXED;
 LIBREF = 44;`;

    const doc = await parse(code, { validate: true });
    expect(doc.compilerOptions.flag).toBe("I");
    expect(doc.compilerOptions.aggregate).toBeDefined();
    expect(doc.compilerOptions.attributes?.identifiers).toBe("FULL");
    expect(doc.compilerOptions.margins).toEqual({ m: 2, n: 75 });
    expect(doc.compilerOptions.default?.returns).toEqual({
      type: "BYADDR",
    });
  });

  test("should parse multiple process directives with comments inbetween", async () => {
    const code = `
%PROCESS F(I) AG A(F); /* XX */
*PROCESS MARGINS(2,75); // test
 /* You can add multiline comments here as well
 */
 /* You can add multiline comments here as well
 */

   // Or somewhere over here

%PROCESS DEFAULT(RETURNS()); 
 DECLARE LIBREF FIXED;
 LIBREF = 44;`;

    const doc = await parse(code, { validate: true });
    expect(doc.compilerOptions.flag).toBe("I");
    expect(doc.compilerOptions.aggregate).toBeDefined();
    expect(doc.compilerOptions.attributes?.identifiers).toBe("FULL");
    expect(doc.compilerOptions.margins).toEqual({ m: 2, n: 75 });
    expect(doc.compilerOptions.default?.returns).toEqual({
      type: "BYADDR",
    });
  });

  test("should parse multiple process directives with windows line endings", async () => {
    const code = `
%PROCESS F(I) AG A(F); \r
*PROCESS MARGINS(2,75); 
%PROCESS F(I) AG A(F); \r
 DECLARE LIBREF FIXED;
 LIBREF = 44;`;

    const doc = await parse(code, { validate: true });
    expect(doc.compilerOptions.flag).toBe("I");
    expect(doc.compilerOptions.aggregate).toBeDefined();
    expect(doc.compilerOptions.attributes?.identifiers).toBe("FULL");
    expect(doc.compilerOptions.margins).toEqual({ m: 2, n: 75 });
  });
});
