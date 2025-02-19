import { describe, test, expect } from "vitest";
import {
  AbstractCompilerOption,
  AbstractCompilerOptionString,
  AbstractCompilerOptionText,
  isAbstractCompilerOption,
  isAbstractCompilerOptionString,
  isAbstractCompilerOptionText,
  parseAbstractCompilerOptions,
} from "../../src/compiler/parser";
import { translateCompilerOptions } from "../../src/compiler/translator";

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
    const parameter = options[0].values[0] as AbstractCompilerOptionText;
    expect(isAbstractCompilerOptionText(parameter)).toBe(true);
    expect(parameter.value).toBe("DECIMAL");
  });

  test("compiler option with string parameter", () => {
    const options = parseAbstractCompilerOptions("BRACKETS('[]')").options;
    expect(options).toHaveLength(1);
    expect(options[0].name).toBe("BRACKETS");
    expect(options[0].values).toHaveLength(1);
    const parameter = options[0].values[0] as AbstractCompilerOptionString;
    expect(isAbstractCompilerOptionString(parameter)).toBe(true);
    expect(parameter.value).toBe("[]");
  });

  test("compiler option with number parameter", () => {
    const options = parseAbstractCompilerOptions("ARCH(10)").options;
    expect(options).toHaveLength(1);
    expect(options[0].name).toBe("ARCH");
    expect(options[0].values).toHaveLength(1);
    const parameter = options[0].values[0] as AbstractCompilerOptionText;
    expect(isAbstractCompilerOptionText(parameter)).toBe(true);
    expect(parameter.value).toBe("10");
  });

  test("compiler option with nested parameter", () => {
    const options = parseAbstractCompilerOptions(
      "DISPLAY(WTO(ROUTCDE(2)))",
    ).options;
    expect(options).toHaveLength(1);
    expect(options[0].name).toBe("DISPLAY");
    expect(options[0].values).toHaveLength(1);
    const parameter = options[0].values[0] as AbstractCompilerOption;
    expect(isAbstractCompilerOption(parameter)).toBe(true);
    expect(parameter.name).toBe("WTO");
    expect(parameter.values).toHaveLength(1);
    const nested = parameter.values[0] as AbstractCompilerOption;
    expect(isAbstractCompilerOption(nested)).toBe(true);
    expect(nested.name).toBe("ROUTCDE");
    expect(nested.values).toHaveLength(1);
    const nestedParameter = nested.values[0] as AbstractCompilerOptionText;
    expect(isAbstractCompilerOptionText(nestedParameter)).toBe(true);
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
  test("Translates MARGINS #1", () => {
    const options = parseAbstractCompilerOptions("MARGINS(4, 80)");
    const translated = translateCompilerOptions(options).options;
    expect(translated.margins).toEqual({ m: 4, n: 80 });
  });

  test("Translates MARGINS with short identifier", () => {
    const options = parseAbstractCompilerOptions("MAR(4, 80)");
    const translated = translateCompilerOptions(options).options;
    expect(translated.margins).toEqual({ m: 4, n: 80 });
  });

  test("Translates MARGINS #2", () => {
    const options = parseAbstractCompilerOptions("MARGINS(4,)");
    const translated = translateCompilerOptions(options).options;
    expect(translated.margins).toEqual({ m: 4, n: NaN });
  });

  test("Translates MARGINS - negative", () => {
    // Margins requires two or three arguments
    const options = parseAbstractCompilerOptions("MARGINS(4)");
    const translated = translateCompilerOptions(options).options;
    // If the parsing fails, the option is not set
    expect(translated.margins).toBeUndefined();
  });

  test("Translates MARGINS #3", () => {
    const options = parseAbstractCompilerOptions("MARGINS(0, 14,)");
    const translated = translateCompilerOptions(options).options;
    expect(translated.margins).toEqual({ m: 0, n: 14, c: "" });
  });

  test("Translates MARGINS #4", () => {
    const options = parseAbstractCompilerOptions("NOMARGINS");
    const translated = translateCompilerOptions(options).options;
    expect(translated.margins).toEqual(false);
  });

  test("Produce issue for text value when string is expected", () => {
    const options = parseAbstractCompilerOptions("BRACKETS(TEST)");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe("Expected a plain text value");
  });

  test("Produce issue for text value when enum is expected", () => {
    const options = parseAbstractCompilerOptions("CASE(TEST)");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe(
      "Expected one of 'UPPER', 'ASIS', but received 'TEST'.",
    );
  });

  test("Produce issue for unknown compiler option", () => {
    const options = parseAbstractCompilerOptions("UNKNOWNOPTION");
    const issues = translateCompilerOptions(options).issues;
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toMatch("Unknown compiler option");
  });
});
