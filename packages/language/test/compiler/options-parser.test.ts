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
import { translateCompilerOptions } from "../../src/preprocessor/compiler-options/translator";
import {
  CompilerOption,
  CompilerOptionString,
  CompilerOptionText,
  SyntaxKind,
} from "../../src/syntax-tree/ast";
import { CompilerOptions } from "../../src/preprocessor/compiler-options/options";
import { parse } from "../utils";

describe("CompilerOptions parser", () => {
  test("simple word based compiler option", () => {
    const options = parseAbstractCompilerOptions("TERMINAL").options;
    expect(options).toHaveLength(1);
    expect(options[0].name).toBe("TERMINAL");
    expect(options[0].token.startOffset).toBe(0);
    expect(options[0].token.endOffset).toBe(7);
    expect(options[0].values).toHaveLength(0);
  });

  test("compiler option with parameter", () => {
    const options = parseAbstractCompilerOptions("AGGREGATE(DECIMAL)").options;
    expect(options).toHaveLength(1);
    expect(options[0].name).toBe("AGGREGATE");
    expect(options[0].values).toHaveLength(1);
    const parameter = options[0].values[0] as CompilerOptionText;
    expect(parameter.kind).toBe(SyntaxKind.CompilerOptionText);
    expect(parameter.value).toBe("DECIMAL");
  });

  test("compiler option with string parameter", () => {
    const options = parseAbstractCompilerOptions("BRACKETS('[]')").options;
    expect(options).toHaveLength(1);
    expect(options[0].name).toBe("BRACKETS");
    expect(options[0].values).toHaveLength(1);
    const parameter = options[0].values[0] as CompilerOptionString;
    expect(parameter.kind).toBe(SyntaxKind.CompilerOptionString);
    expect(parameter.value).toBe("[]");
  });

  test("compiler option with number parameter", () => {
    const options = parseAbstractCompilerOptions("ARCH(10)").options;
    expect(options).toHaveLength(1);
    expect(options[0].name).toBe("ARCH");
    expect(options[0].values).toHaveLength(1);
    const parameter = options[0].values[0] as CompilerOptionText;
    expect(parameter.kind).toBe(SyntaxKind.CompilerOptionText);
    expect(parameter.value).toBe("10");
  });

  test("compiler option with nested parameter", () => {
    const options = parseAbstractCompilerOptions(
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

  test("multiple compiler options", () => {
    const options = parseAbstractCompilerOptions("COMPILE,TERMINAL").options;
    expect(options).toHaveLength(2);
    expect(options[0].name).toBe("COMPILE");
    expect(options[1].name).toBe("TERMINAL");
  });
});

describe("CompilerOptions translator", () => {
  test("Translates MARGINS with values", () => {
    const options = parseAbstractCompilerOptions("MARGINS(4, 80)");
    const translated = translateCompilerOptions(options).options;
    expect(translated.margins).toEqual({ m: 4, n: 80 });
  });

  test("Translates MARGINS with short identifier", () => {
    const options = parseAbstractCompilerOptions("MAR(4, 80)");
    const translated = translateCompilerOptions(options).options;
    expect(translated.margins).toEqual({ m: 4, n: 80 });
  });

  test("Translates MARGINS default value", () => {
    const options = parseAbstractCompilerOptions("MARGINS(4,)");
    const translated = translateCompilerOptions(options).options;
    expect(translated.margins).toEqual({ m: 4, n: 72 });
  });

  test("Translates MARGINS - negative", () => {
    // Margins requires two or three arguments
    const options = parseAbstractCompilerOptions("MARGINS(4)");
    const translated = translateCompilerOptions(options).options;
    // If the parsing fails, the option is not set
    expect(translated.margins).toBeUndefined();
  });

  test("Translates MARGINS with c", () => {
    const options = parseAbstractCompilerOptions("MARGINS(0, 14,)");
    const translated = translateCompilerOptions(options).options;
    expect(translated.margins).toEqual({ m: 0, n: 14, c: "" });
  });

  test("Translates NOMARGINS", () => {
    const options = parseAbstractCompilerOptions("NOMARGINS");
    const translated = translateCompilerOptions(options).options;
    expect(translated.margins).toEqual(false);
  });

  test("Produce issue for text value in MARGINS m", () => {
    const options = parseAbstractCompilerOptions("MARGINS(M,444)");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe("Expected a number.");
  });

  test("Produce issue for text value in MARGINS n", () => {
    const options = parseAbstractCompilerOptions("MARGINS(112, R)");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe("Expected a number.");
  });

  test("Produce issue for text value when string is expected", () => {
    const options = parseAbstractCompilerOptions("BRACKETS(TEST)");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe("Expected a string value.");
  });

  test("Produce issue for text value when enum is expected", () => {
    const options = parseAbstractCompilerOptions("CASE(TEST)");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      "Expected one of 'UPPER', 'ASIS', but received 'TEST'.",
    );
  });

  test("Produce issue for text value when option is expected in CASERULES", () => {
    const options = parseAbstractCompilerOptions("CASERULES(TEST)");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      "Expected a compiler option with arguments.",
    );
  });

  test("Produce issue for wrong option in CASERULES", () => {
    const options = parseAbstractCompilerOptions("CASERULES(TEST())");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      `Expected "KEYWORD" as compiler option value.`,
    );
  });

  test("Produce issue for wrong option in KEYWORD in CASERULES", () => {
    const options = parseAbstractCompilerOptions("CASERULES(KEYWORD(TEST))");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      "Expected one of 'MIXED', 'UPPER', 'LOWER', 'START', but received 'TEST'.",
    );
  });

  test("Produce issue for unknown compiler option", () => {
    const options = parseAbstractCompilerOptions("UNKNOWNOPTION");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toMatch(
      "The string UNKNOWNOPTION is not recognized as a valid option keyword and is ignored.",
    );
  });

  test("Produce issue for arguments at COMPILE", () => {
    const options = parseAbstractCompilerOptions("COMPILE(E)");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe("Expected 0 arguments, but received 1.");
  });

  test("Produce issue for arguments at NOCOPYRIGHT", () => {
    const options = parseAbstractCompilerOptions("NOCOPYRIGHT(E)");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe("Expected 0 arguments, but received 1.");
  });

  test("Produce issue for text value when option is expected in DEPRECATE", () => {
    const options = parseAbstractCompilerOptions("DEPRECATE(BUILTIN)");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      "Expected a compiler option with arguments.",
    );
  });

  test("Test compiler option abbreviations", () => {
    const abbreviations = ["CURR", "CP", "CSE", "NOCSE", "DEC", "DFT"];
    for (const abbr of abbreviations) {
      const options = parseAbstractCompilerOptions(abbr);
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

  test("Test BLANK validation", () => {
    const options = parseAbstractCompilerOptions("BLANK('dssssdD')");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      "BLANK option value contains disallowed characters. Cannot contain letters, numbers, spaces, or PL/I special characters.",
    );
  });

  test("Test DEFAULT SHORT validation", () => {
    const options = parseAbstractCompilerOptions("DEFAULT(SHORT(IEEEp98))");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe("Invalid default option value: IEEEp98");
  });

  test("Test DEFAULT RETURNS validation", () => {
    const options = parseAbstractCompilerOptions("DEFAULT(RETURNS())");
    const translated = translateCompilerOptions(options).options;
    expect(translated.default?.returns).toEqual({ type: "BYADDR" });
  });

  test("Test CODEPAGE validation", () => {
    const options = parseAbstractCompilerOptions("CODEPAGE(0114dd0)");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      "Invalid codepage value. Expected one of 01047, 01140, 01141, 01142, 01143, 01144, 01025, 01145, 01146, 01147, 01148, 01149, 00037, 01155, 00273, 00277, 00278, 00280, 00284, 00285, 00297, 00500, 00871, 00819, 00813, 00920, but received '0114dd0'.",
    );
  });

  const testCases: {
    input: string;
    toTest: (options: CompilerOptions) => unknown;
    expected: unknown;
  }[] = [
    {
      input: "AGGREGATE(DeCiMaL)",
      toTest: (options) =>
        (options.aggregate as CompilerOptions.Aggregate).offsets,
      expected: "DECIMAL",
    },
    {
      input: "ASSERT(entry)",
      toTest: (options) => options.assert,
      expected: "ENTRY",
    },
    {
      input: "ATTRIBUTES(f)",
      toTest: (options) => options.attributes?.identifiers,
      expected: "FULL",
    },
    {
      input: "CASE(asis)",
      toTest: (options) => options.case,
      expected: "ASIS",
    },
    {
      input: "CASERULES(keyword(lower))",
      toTest: (options) => options.caserules,
      expected: "LOWER",
    },
    {
      input: "CHECK(stg)",
      toTest: (options) => options.check?.storage,
      expected: "STORAGE",
    },
    { input: "CMPAT(v1)", toTest: (options) => options.cmpat, expected: "V1" },
    {
      input: "NOCOMPILE(e)",
      toTest: (options) =>
        (options.compile as CompilerOptions.Compile).severity,
      expected: "ERROR",
    },
    {
      input: "DECIMAL(checkfloat)",
      toTest: (options) => options.decimal?.checkfloat,
      expected: true,
    },
    {
      input: "DEFAULT(aligned)",
      toTest: (options) => options.default?.aligned,
      expected: true,
    },
    {
      input: "DEPRECATE(builtin(x))",
      toTest: (options) => options.deprecate?.items,
      expected: [{ type: "BUILTIN", value: "x" }],
    },
    {
      input: "DISPLAY(wto(RoUTcDE(1)))",
      toTest: (options) => options.display?.routcde,
      expected: ["1"],
    },
    {
      input: "EXTRN(short)",
      toTest: (options) => options.extrn,
      expected: "SHORT",
    },
    {
      input: "FILEREF(hash)",
      toTest: (options) => (options.fileRef as CompilerOptions.FileRef).hash,
      expected: true,
    },
    { input: "FLAG(s)", toTest: (options) => options.flag, expected: "S" },
    {
      input: "FLOAT(dfp)",
      toTest: (options) => (options.float as CompilerOptions.Float).dfp,
      expected: true,
    },
    {
      input: "FLOATINMATH(long)",
      toTest: (options) =>
        (options.floatInMath as CompilerOptions.FloatInMath).type,
      expected: "LONG",
    },
  ];

  for (const testCase of testCases) {
    test(`Translates option with parameter case-insensitively: ${testCase.input}`, () => {
      const parsed = parseAbstractCompilerOptions(testCase.input);
      const options = translateCompilerOptions(parsed).options;
      expect(testCase.toTest(options)).toEqual(testCase.expected);
    });
  }
});

describe("Process directives", () => {
  test("should parse multiple process directives", () => {
    const code = `
%PROCESS F(I) AG A(F); 
*PROCESS MARGINS(2,75);
%PROCESS F(I) AG A(F); 
 DECLARE LIBREF FIXED;
 LIBREF = 44;`;

    const doc = parse(code, { validate: true });
    expect(doc.compilerOptions.flag).toBe("I");
    expect(doc.compilerOptions.aggregate).toBeDefined();
    expect(doc.compilerOptions.attributes?.identifiers).toBe("FULL");
    expect(doc.compilerOptions.margins).toEqual({ m: 2, n: 75 });
  });

  test("should parse multiple process directives with comments", () => {
    const code = `
%PROCESS F(I) AG A(F); /* XX */
*PROCESS MARGINS(2,75); // test
%PROCESS DEFAULT(RETURNS()); 
 DECLARE LIBREF FIXED;
 LIBREF = 44;`;

    const doc = parse(code, { validate: true });
    expect(doc.compilerOptions.flag).toBe("I");
    expect(doc.compilerOptions.aggregate).toBeDefined();
    expect(doc.compilerOptions.attributes?.identifiers).toBe("FULL");
    expect(doc.compilerOptions.margins).toEqual({ m: 2, n: 75 });
    expect(doc.compilerOptions.default?.returns).toEqual({ type: "BYADDR" });
  });

  test("should parse multiple process directives with comments inbetween", () => {
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

    const doc = parse(code, { validate: true });
    expect(doc.compilerOptions.flag).toBe("I");
    expect(doc.compilerOptions.aggregate).toBeDefined();
    expect(doc.compilerOptions.attributes?.identifiers).toBe("FULL");
    expect(doc.compilerOptions.margins).toEqual({ m: 2, n: 75 });
    expect(doc.compilerOptions.default?.returns).toEqual({ type: "BYADDR" });
  });

  test("should parse multiple process directives with windows line endings", () => {
    const code = `
%PROCESS F(I) AG A(F); \r
*PROCESS MARGINS(2,75); 
%PROCESS F(I) AG A(F); \r
 DECLARE LIBREF FIXED;
 LIBREF = 44;`;

    const doc = parse(code, { validate: true });
    expect(doc.compilerOptions.flag).toBe("I");
    expect(doc.compilerOptions.aggregate).toBeDefined();
    expect(doc.compilerOptions.attributes?.identifiers).toBe("FULL");
    expect(doc.compilerOptions.margins).toEqual({ m: 2, n: 75 });
  });
});
