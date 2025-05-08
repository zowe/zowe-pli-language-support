import { expect } from "vitest";
import {
  collectDiagnostics,
  CompilationUnit,
  createCompilationUnit,
} from "../src/workspace/compilation-unit";
import * as lifecycle from "../src/workspace/lifecycle";
import { URI } from "vscode-uri";
import { Diagnostic, Range, Severity } from "../src/language-server/types";
import { definitionRequest } from "../src/language-server/definition-request";
import assert from "node:assert";
import { SyntaxKind, SyntaxNode } from "../src/syntax-tree/ast";
import { forEachNode } from "../src/syntax-tree/ast-iterator";
import { IntermediateBinaryExpression } from "../src/parser/abstract-parser";
import { IToken } from "@chevrotain/types";

interface AssertNoDiagnosticsOptions {
  ignoreSeverity?: Severity[];
}

function expectNoDiagnostics(
  diagnostics: Diagnostic[],
  { ignoreSeverity = [] }: AssertNoDiagnosticsOptions,
) {
  const filteredDiagnostics = diagnostics.filter(
    (diagnostic) => !ignoreSeverity.includes(diagnostic.severity),
  );

  expect(filteredDiagnostics).toHaveLength(0);
}

export function assertNoParseErrors(
  sourceFile: CompilationUnit,
  options: AssertNoDiagnosticsOptions = {},
) {
  expectNoDiagnostics(sourceFile.diagnostics.lexer, options);
  expectNoDiagnostics(sourceFile.diagnostics.parser, options);
  assertValidSymbolTable(sourceFile);
}

/**
 * Asserts the absence of linking errors in the given source file
 */
export function assertNoLinkingErrors(
  sourceFile: CompilationUnit,
  options: AssertNoDiagnosticsOptions = {},
) {
  expectNoDiagnostics(sourceFile.diagnostics.linking, options);
}

/**
 * Asserts the absence of validation errors in the given source file
 */
export function assertNoValidationErrors(
  sourceFile: CompilationUnit,
  options: AssertNoDiagnosticsOptions = {},
) {
  expectNoDiagnostics(sourceFile.diagnostics.validation, options);
}

/**
 * Asserts the absence of all diagnostics in the given source file
 */
export function assertNoDiagnostics(
  sourceFile: CompilationUnit,
  options: AssertNoDiagnosticsOptions = {},
) {
  assertNoParseErrors(sourceFile, options);
  assertNoLinkingErrors(sourceFile, options);
  assertNoValidationErrors(sourceFile, options);
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
export function parseStmts(
  text: string,
  options?: { validate: boolean },
): CompilationUnit {
  return parse(
    ` STARTPR: PROCEDURE OPTIONS (MAIN);
${text}
 end STARTPR;`,
    options,
  );
}

/**
 * ---------- Symbol Table ----------
 */

function isIntermediateBinaryExpression(
  node: any,
): node is IntermediateBinaryExpression {
  return node && "infix" in node && "items" in node && "operators" in node;
}

function assertValidSymbolTable(compilationUnit: CompilationUnit) {
  lifecycle.generateSymbolTable(compilationUnit);

  for (const token of compilationUnit.tokens.all) {
    expect(token.payload).toBeDefined();

    if (token.payload.kind === -1) {
      // FQN rule does not reset the token kind.
      // todo: Remove this exception once the FQN rule is updated.
      continue;
    }
    if (isIntermediateBinaryExpression(token.payload.element)) {
      // Not an AST node
      continue;
    }

    expect(
      token.payload.element,
      `Token of kind ${token.payload.kind} (${SyntaxKind[token.payload.kind]}) (${token.image}) should have a defined element`,
    ).toBeDefined();
    expect(
      token.payload.element,
      `Token of kind ${token.payload.kind} (${SyntaxKind[token.payload.kind]})(${token.image}) should have a non-null element`,
    ).not.toBeNull();
    expectASTNodeContainer(token.payload.element, token);
  }
}

function expectASTNodeContainer(node: SyntaxNode, originalToken: IToken) {
  expect(
    node.container,
    `Node of kind ${node.kind} (${SyntaxKind[node.kind]}) (${originalToken.image}) should have a defined container`,
  ).toBeDefined();
  expect(
    node.container,
    `Node of kind ${node.kind} (${SyntaxKind[node.kind]}) (${originalToken.image}) should have a non-null container.`,
  ).not.toBeNull();

  forEachNode(node as SyntaxNode, (childNode: SyntaxNode) => {
    expectASTNodeContainer(childNode, originalToken);
  });
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

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Strip and extract named indices and ranges from the given text.
 * Currently supports markers through the following syntax:
 * - Range: `<|abc:A|>` -> produces output `A` and a named range `abc`
 * - Index: `<|abc>A` -> produces output `A` and a named index `abc`
 *
 * Marker identifiers are limited to alphanumeric characters (`/\w+/`).
 */
export function replaceNamedIndices(text: string): {
  output: string;
  indices: Record<string, number[]>;
  ranges: Record<string, Array<[number, number]>>;
} {
  const indices: Record<string, number[]> = {};
  const ranges: Record<string, Array<[number, number]>> = {};
  const rangeStack: {
    index: number;
    label: string;
  }[] = [];

  const regex = /<\|(?<indexMarker>\w+)>|<\|(?<rangeStartMarker>\w+):|\|>/;

  let matched = true;
  let input = text;

  while (matched) {
    const regexMatch = regex.exec(input);

    if (regexMatch?.groups) {
      if (regexMatch.groups.indexMarker) {
        const label = regexMatch.groups.indexMarker;

        if (!indices[label]) {
          indices[label] = [];
        }

        indices[label].push(regexMatch.index);

        if (!ranges[label]) {
          ranges[label] = [];
        }
      } else if (regexMatch.groups.rangeStartMarker) {
        rangeStack.push({
          index: regexMatch.index,
          label: regexMatch.groups.rangeStartMarker,
        });
      } else {
        const rangeStart = rangeStack.pop();
        if (!rangeStart) {
          throw new Error("Range start not found");
        }

        if (!ranges[rangeStart.label]) {
          ranges[rangeStart.label] = [];
        }

        ranges[rangeStart.label].push([rangeStart.index, regexMatch.index]);
      }

      const matchedString = regexMatch[0];

      input =
        input.substring(0, regexMatch.index) +
        input.substring(regexMatch.index + matchedString.length);
    } else {
      matched = false;
    }
  }

  return { output: input, indices, ranges };
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

/**
 * Extract named range and index information and verify that linking works as expected.
 *
 * @param text PL/I text to parse and link, with range and index markers (as specified in `replaceNamedIndices`)
 *
 * @example
 * ```ts
 * expectLinks(`
 *  DCL <|1:A|>, <|2:B|>;
 *  PUT(<|1>A);
 *  PUT(<|2>B);
 * `)
 * ```
 */
export function expectLinks(text: string) {
  const { output, indices, ranges } = replaceNamedIndices(text);

  const requests = Object.entries(indices).flatMap(([index, offsets]) =>
    offsets.map((offset) => ({
      label: index,
      offset,
      rangeIndex: ranges[index],
    })),
  );

  const unit = parseAndLink(output);

  for (const { label, offset, rangeIndex } of requests) {
    const result = definitionRequest(unit, unit.uri, offset);

    expectedFunction(
      result.length,
      rangeIndex.length,
      `Expected ${rangeIndex.length} definitions but received ${result.length} for label "${label}"`,
    );

    if (rangeIndex.length > 1) {
      throw new Error("TODO: Range index is not supported yet");
    } else if (rangeIndex.length === 1) {
      const [singleRangeIndex] = rangeIndex;
      const [definition] = result;

      const expectedRange: Range = {
        start: singleRangeIndex[0],
        end: singleRangeIndex[1],
      };

      // Produce a small snippet with a margin of 10 characters to give a hint of where the error is
      const snippet = `${output.slice(offset - 10, offset).trimStart()}<|${label}>${output.slice(offset, offset + 10).trimEnd()}`;
      const line = output.slice(0, offset).split("\n").length + 1;

      expectedFunction(
        definition.range,
        expectedRange,
        `Expected range does not match actual range for label "${label}" on line ${line} near \`${snippet}\``,
      );
    }
  }
}

/**
 * ---------- End of Linking utilities ----------
 */
