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
  test("Produce issue for text value when string is expected", async () => {
    const options = await parseAbstractCompilerOptions("BRACKETS(TEST)");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe("Expected a string value.");
  });

  test("Produce issue for text value when enum is expected", async () => {
    const options = await parseAbstractCompilerOptions("CASE(TEST)");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      "Expected one of 'UPPER', 'ASIS', but received 'TEST'.",
    );
  });

  test("Produce issue for text value when option is expected in CASERULES", async () => {
    const options = await parseAbstractCompilerOptions("CASERULES(TEST)");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      "Expected a compiler option with arguments.",
    );
  });

  test("Produce issue for wrong option in CASERULES", async () => {
    const options = await parseAbstractCompilerOptions("CASERULES(TEST())");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      `Expected "KEYWORD" as compiler option value.`,
    );
  });

  test("Produce issue for wrong option in KEYWORD in CASERULES", async () => {
    const options = await parseAbstractCompilerOptions(
      "CASERULES(KEYWORD(TEST))",
    );
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      "Expected one of 'MIXED', 'UPPER', 'LOWER', 'START', but received 'TEST'.",
    );
  });

  test("Accept multiple same options on CHECK", async () => {
    const options = await parseAbstractCompilerOptions("CHECK(storage, stg)");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(0);
  });

  test("Accept multiple same options on CHECK without comma", async () => {
    const options = await parseAbstractCompilerOptions("CHECK(storage stg)");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(0);
  });

  test("Produce issue for empty DDSQL", async () => {
    const options = await parseAbstractCompilerOptions("DDSQL()");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      `DDSQL option value cannot be empty without parentheses.`,
    );
  });

  test("Accept DDSQL with empty string", async () => {
    const options = await parseAbstractCompilerOptions("DDSQL('')");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(0);
  });

  test("Produce issue for unknown compiler option", async () => {
    const options = await parseAbstractCompilerOptions("UNKNOWNOPTION");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toMatch(
      "The string UNKNOWNOPTION is not recognized as a valid option keyword and is ignored.",
    );
  });

  test("Produce issue for arguments at COMPILE", async () => {
    const options = await parseAbstractCompilerOptions("COMPILE(E)");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe("Expected 0 arguments, but received 1.");
  });

  test("Produce issue for arguments at NOCOPYRIGHT", async () => {
    const options = await parseAbstractCompilerOptions("NOCOPYRIGHT(E)");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe("Expected 0 arguments, but received 1.");
  });

  test("Produce issue for text value when option is expected in DEPRECATE", async () => {
    const options = await parseAbstractCompilerOptions("DEPRECATE(BUILTIN)");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      "Expected a compiler option with arguments.",
    );
  });

  test("Test compiler option abbreviations", async () => {
    const abbreviations = ["CURR", "CP", "CSE", "NOCSE", "DEC", "DFT"];
    for (const abbr of abbreviations) {
      const options = await parseAbstractCompilerOptions(abbr);
      const issues = translateCompilerOptions(options).issues;
      if (
        issues.some((issue) =>
          issue.message.includes("Unknown compiler option:"),
        )
      ) {
        throw new Error(
          `Abbreviation ${abbr} was not recognized as a valid compiler option.`,
        );
      }
    }
  });

  test("Test BLANK validation, disallowed characters", async () => {
    const options = await parseAbstractCompilerOptions("BLANK('D')");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      "BLANK option value contains disallowed characters. Cannot contain letters, numbers, spaces, or PL/I special characters.",
    );
  });

  test("Test BLANK validation, single character", async () => {
    const options = await parseAbstractCompilerOptions("BLANK('$$$##')");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      "BLANK option value must be a single character.",
    );
  });

  test("Test BRACKETS validation, double character", async () => {
    const options = await parseAbstractCompilerOptions("BRACKETS('D')");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      "BRACKETS option value must be two characters.",
    );
  });

  test("Test BRACKETS validation, disallowed characters", async () => {
    const options = await parseAbstractCompilerOptions("BRACKETS('  ')");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      "BRACKETS option value contains disallowed characters. Cannot contain letters, numbers, spaces, or PL/I special characters.",
    );
  });

  test("Test BRACKETS validation, same character", async () => {
    const options = await parseAbstractCompilerOptions("BRACKETS('[[')");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      "BRACKETS option value must be two different characters.",
    );
  });

  test("Test DEFAULT SHORT validation", async () => {
    const options = await parseAbstractCompilerOptions(
      "DEFAULT(SHORT(IEEEp98))",
    );
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe("Invalid default option value: IEEEP98");
  });

  test("Test DEFAULT RETURNS validation", async () => {
    const options = await parseAbstractCompilerOptions("DEFAULT(RETURNS())");
    const translated = translateCompilerOptions(options).options;
    expect(translated.default?.returns).toEqual({ type: "BYADDR" });
  });

  test("Test CODEPAGE validation", async () => {
    const options = await parseAbstractCompilerOptions("CODEPAGE(0114dd0)");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      "Invalid codepage value. Expected one of 01047, 01140, 01141, 01142, 01143, 01144, 01025, 01145, 01146, 01147, 01148, 01149, 00037, 01155, 00273, 00277, 00278, 00280, 00284, 00285, 00297, 00500, 00871, 00819, 00813, 00920, but received '0114DD0'.",
    );
  });

  test("Test DECIMAL validation, mandatory argument", async () => {
    const options = await parseAbstractCompilerOptions("DECIMAL");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      "Expected at least 1 argument, but received 0.",
    );
  });

  test("Test DECIMAL validation, mandatory argument #2", async () => {
    const options = await parseAbstractCompilerOptions("DECIMAL()");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      "Invalid decimal option. Expected one of 'CHECKFLOAT', 'NOCHECKFLOAT', 'FOFLONADD', 'NOFOFLONADD', 'FOFLONASGN', 'NOFOFLONASGN', 'FOFLONDIV', 'NOFOFLONDIV', 'FOFLONMULT', 'NOFOFLONMULT', 'FORCEDSIGN', 'NOFORCEDSIGN', 'KEEPMINUS', 'NOKEEPMINUS', 'TRUNCFLOAT', 'NOTRUNCFLOAT', but received ''.",
    );
  });

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
