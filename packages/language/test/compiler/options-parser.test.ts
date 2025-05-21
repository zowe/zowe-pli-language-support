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
});
