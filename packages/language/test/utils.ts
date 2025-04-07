import { expect } from "vitest";
import {
  collectDiagnostics,
  CompilationUnit,
  createCompilationUnit,
} from "../src/workspace/compilation-unit";
import * as lifecycle from "../src/workspace/lifecycle";
import { URI } from "vscode-uri";
import { Diagnostic, Range } from "../src/language-server/types";
import { definitionRequest } from "../src/language-server/definition-request";
import assert from "node:assert";

export function assertNoParseErrors(sourceFile: CompilationUnit) {
  expect(sourceFile.diagnostics.lexer).toHaveLength(0);
  expect(sourceFile.diagnostics.parser).toHaveLength(0);
}

/**
 * Asserts the absence of linking errors in the given source file
 */
export function assertNoLinkingErrors(sourceFile: CompilationUnit) {
  expect(sourceFile.diagnostics.linking).toHaveLength(0);
}

/**
 * Asserts the absence of validation errors in the given source file
 */
export function assertNoValidationErrors(sourceFile: CompilationUnit) {
  expect(sourceFile.diagnostics.validation).toHaveLength(0);
}

/**
 * Asserts the absence of all diagnostics in the given source file
 */
export function assertNoDiagnostics(sourceFile: CompilationUnit) {
  assertNoParseErrors(sourceFile);
  assertNoLinkingErrors(sourceFile);
  assertNoValidationErrors(sourceFile);
}

export function assertDiagnostic(
  sourceFile: CompilationUnit,
  diagnostic: Partial<Diagnostic>,
) {
  const diagnostics = collectDiagnostics(sourceFile);
  // assert that there's at least one diagnostic that matches the given partial diagnostic
  expect(diagnostics).toContainEqual(expect.objectContaining(diagnostic));
}

/**
 * Parses the given text and returns a source file with attached diagnostics
 *
 * @param text PL/I text to parse
 * @param options Options for parsing, chiefly to enable additional validation
 */
export function parse(
  text: string,
  options?: { validate: boolean },
): CompilationUnit {
  const sourceFile = createCompilationUnit(URI.file("test.pli"));
  if (!options?.validate) {
    lifecycle.tokenize(sourceFile, text);
    lifecycle.parse(sourceFile);
  } else {
    lifecycle.lifecycle(sourceFile, text);
  }
  return sourceFile;
}

/**
 * Helper function to parse a string of PL/I statements,
 * wrapping them in a procedure to ensure they are valid
 */
export function parseStmts(text: string): CompilationUnit {
  return parse(` STARTPR: PROCEDURE OPTIONS (MAIN);
${text}
 end STARTPR;`);
}

/**
 * ---------- Linking utilities ----------
 */

export function expectedFunction(
  actual: any,
  expected: any,
  message: string | Error,
) {
  assert.deepStrictEqual(actual, expected, message);
}

export function parseAndLink(text: string): CompilationUnit {
  const sourceFile = parse(text);
  lifecycle.generateSymbolTable(sourceFile);
  lifecycle.link(sourceFile);
  return sourceFile;
}

interface ExpectedBase {
  /**
   * Document content.
   * Use `<|>` and `<|...|>` to mark special items that are relevant to the test case.
   */
  text: string;
  /**
   * String to mark indices for test cases. `<|>` by default.
   */
  indexMarker?: string;
  /**
   * String to mark start indices for test cases. `<|` by default.
   */
  rangeStartMarker?: string;
  /**
   * String to mark end indices for test cases. `|>` by default.
   */
  rangeEndMarker?: string;
}

interface ExpectGotoDefinitionParams extends ExpectedBase {
  index: number;
  rangeIndex: number | number[];
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function replaceIndices(base: ExpectedBase): {
  output: string;
  indices: number[];
  ranges: Array<[number, number]>;
} {
  const indices: number[] = [];
  const ranges: Array<[number, number]> = [];
  const rangeStack: number[] = [];
  const indexMarker = base.indexMarker || "<|>";
  const rangeStartMarker = base.rangeStartMarker || "<|";
  const rangeEndMarker = base.rangeEndMarker || "|>";
  const regex = new RegExp(
    `${escapeRegExp(indexMarker)}|${escapeRegExp(rangeStartMarker)}|${escapeRegExp(rangeEndMarker)}`,
  );

  let matched = true;
  let input = base.text;

  while (matched) {
    const regexMatch = regex.exec(input);
    if (regexMatch) {
      const matchedString = regexMatch[0];
      switch (matchedString) {
        case indexMarker:
          indices.push(regexMatch.index);
          break;
        case rangeStartMarker:
          rangeStack.push(regexMatch.index);
          break;
        case rangeEndMarker: {
          const rangeStart = rangeStack.pop() || 0;
          ranges.push([rangeStart, regexMatch.index]);
          break;
        }
      }
      input =
        input.substring(0, regexMatch.index) +
        input.substring(regexMatch.index + matchedString.length);
    } else {
      matched = false;
    }
  }

  return { output: input, indices, ranges: ranges.sort((a, b) => a[0] - b[0]) };
}

export function expectGotoDefinition(
  expectedGotoDefinition: ExpectGotoDefinitionParams,
) {
  const { index, rangeIndex } = expectedGotoDefinition;
  const { output, indices, ranges } = replaceIndices(expectedGotoDefinition);
  const unit = parseAndLink(output);

  const offset = indices[index];
  const result = definitionRequest(unit, unit.uri, offset);

  if (Array.isArray(rangeIndex)) {
    expectedFunction(
      result.length,
      rangeIndex.length,
      `Expected ${rangeIndex.length} definitions but received ${result.length}`,
    );

    throw new Error("Range index is not supported yet");
  } else {
    expectedFunction(
      result.length,
      1,
      `Expected a single definition but received ${result.length}`,
    );

    const [definition] = result;
    const expectedRange: Range = {
      start: ranges[rangeIndex][0],
      end: ranges[rangeIndex][1],
    };

    expectedFunction(
      definition.range,
      expectedRange,
      `Expected range does not match actual range`,
    );
  }

  return result;
}

/**
 * ---------- End of Linking utilities ----------
 */
