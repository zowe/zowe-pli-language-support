import { expect } from "vitest";
import { SourceFile, createSourceFile } from "../src/workspace/source-file";
import * as lifecycle from "../src/workspace/lifecycle";
import { URI } from "vscode-uri";
import { definitionRequest } from "../src/language-server/definition-request";
import { Range } from "../src/language-server/types";
import assert from "node:assert";

export function assertNoParseErrors(sourceFile: SourceFile) {
  expect(sourceFile.diagnostics.lexer).toHaveLength(0);
  expect(sourceFile.diagnostics.parser).toHaveLength(0);
}

export function parse(text: string): SourceFile {
  const sourceFile = createSourceFile(URI.file("test.pli"));
  lifecycle.tokenize(sourceFile, text);
  lifecycle.parse(sourceFile);
  assertNoParseErrors(sourceFile);
  return sourceFile;
}

/**
 * Helper function to parse a string of PL/I statements,
 * wrapping them in a procedure to ensure they are valid
 */
export function parseStmts(text: string): SourceFile {
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
  message: string | Error
) {
  assert.deepStrictEqual(actual, expected, message);
}

export function parseAndLink(text: string): SourceFile {
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
    `${escapeRegExp(indexMarker)}|${escapeRegExp(rangeStartMarker)}|${escapeRegExp(rangeEndMarker)}`
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
  expectedGotoDefinition: ExpectGotoDefinitionParams
) {
  const { index, rangeIndex } = expectedGotoDefinition;
  const { output, indices, ranges } = replaceIndices(expectedGotoDefinition);
  const sourceFile = parseAndLink(output);

  const offset = indices[index];
  const result = definitionRequest(sourceFile, offset);

  if (Array.isArray(rangeIndex)) {
    expectedFunction(
      result.length,
      rangeIndex.length,
      `Expected ${rangeIndex.length} definitions but received ${result.length}`
    );

    throw new Error("Range index is not supported yet");
  } else {
    expectedFunction(
      result.length,
      1,
      `Expected a single definition but received ${result.length}`
    );

    const [definition] = result;
    const expectedRange: Range = {
      start: ranges[rangeIndex][0],
      end: ranges[rangeIndex][1],
    };

    expectedFunction(
      definition.range,
      expectedRange,
      `Expected range does not match actual range`
    );
  }

  return result;
}

/**
 * ---------- End of Linking utilities ----------
 */
