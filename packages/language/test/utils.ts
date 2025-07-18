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

import { expect } from "vitest";
import {
  collectDiagnostics,
  CompilationUnit,
  createCompilationUnit,
} from "../src/workspace/compilation-unit";
import * as lifecycle from "../src/workspace/lifecycle";
import { URI } from "vscode-uri";
import { Diagnostic, Severity } from "../src/language-server/types";
import { SyntaxKind, SyntaxNode } from "../src/syntax-tree/ast";
import { forEachNode } from "../src/syntax-tree/ast-iterator";
import { IntermediateBinaryExpression } from "../src/parser/abstract-parser";
import { escapeRegExp, Token } from "../src/parser/tokens";
import { referencesRequest } from "../src/language-server/references-request";
import { completionRequest } from "../src/language-server/completion/completion-request";

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
 * Asserts the absence of compiler option errors in the given source file
 */
export function assertNoCompilerOptionErrors(
  sourceFile: CompilationUnit,
  options: AssertNoDiagnosticsOptions = {},
) {
  expectNoDiagnostics(sourceFile.diagnostics.compilerOptions, options);
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
  assertNoCompilerOptionErrors(sourceFile, options);
  assertNoValidationErrors(sourceFile, options);
}

export function assertDiagnostic(
  sourceFile: CompilationUnit,
  diagnostic: Partial<Diagnostic>,
  { ignoreSeverity = [] }: AssertNoDiagnosticsOptions = {},
) {
  const diagnostics = collectDiagnostics(sourceFile).filter(
    (diagnostic) => !ignoreSeverity.includes(diagnostic.severity),
  );
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
  options?: { validate?: boolean; uri?: URI },
): CompilationUnit {
  const sourceFile = createCompilationUnit(
    options?.uri ?? URI.file("test.pli"),
  );
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

export function generateAndAssertValidSymbolTable(
  compilationUnit: CompilationUnit,
) {
  // Retrieve a list of valid tokens with validated payloads.
  const tokens = compilationUnit.tokens.all.filter((token) => {
    expect(token.payload).toBeDefined();

    // FQN rule (token payload === undefined) does not reset the token kind.
    // Todo: Remove this exception once the FQN rule is updated.
    // Intermediate binary expressions are not AST nodes.
    if (
      token.payload.kind === undefined ||
      isIntermediateBinaryExpression(token.payload.element)
    ) {
      return false;
    }

    const element = token.payload.element;
    const kind = token.payload.kind;
    const kindName = SyntaxKind[kind];
    const image = token.image;

    expect(
      element,
      `Token of kind ${kind} (${kindName}) (${image}) should have a defined element`,
    ).toBeDefined();
    expect(
      element,
      `Token of kind ${kind} (${kindName}) (${image}) should have a non-null element`,
    ).not.toBeNull();

    return true;
  });

  // Verify the AST iterator before the symbol table is generated.
  const addProperty = (node: SyntaxNode, prop: string) => {
    (node as any)[prop] = prop;
    forEachNode(node, (child) => addProperty(child, prop));
  };

  forEachNode(compilationUnit.ast, (node) =>
    addProperty(node, "_beforeSymbolTable"),
  );

  const verifyNodeReachability = (node: SyntaxNode | undefined) => {
    expect(node).toBeDefined();
    expect(
      (node as any)._beforeSymbolTable,
      `Node of kind ${node!.kind} (${SyntaxKind[node!.kind]}) was not reached by the AST iterator at all.`,
    ).toBeDefined();
    forEachNode(node!, verifyNodeReachability);
  };

  tokens.forEach((token) => verifyNodeReachability(token.payload.element));

  // Generate the symbol table and verify the container structure.
  lifecycle.generateSymbolTable(compilationUnit);

  forEachNode(compilationUnit.ast, (node) =>
    addProperty(node, "_afterSymbolTable"),
  );

  const verifyNodeContainer = (node: SyntaxNode | undefined, token: Token) => {
    expect(node).toBeDefined();
    const kind = node!.kind;
    const kindName = SyntaxKind[kind];
    const reachedBefore = (node as any)._beforeSymbolTable !== undefined;
    const image = token.image;

    // If there is a bug in the symbol table generation, it is possible to retrieve a node with a non-null container
    // that is still not reachable by the AST iterator anymore.
    // This is a sanity check to ensure that the symbol table generation is not messing with the structure of the AST.
    expect(
      (node as any)._afterSymbolTable,
      `Node of kind ${kind} (${kindName}, reached before: ${reachedBefore}) was not reached by the AST iterator after the symbol table was generated.`,
    ).toBeDefined();

    // All nodes should have a non-null container.
    expect(
      node!.container,
      `Node of kind ${kind} (${kindName}) (${image}) should have a defined container`,
    ).toBeDefined();
    expect(
      node!.container,
      `Node of kind ${kind} (${kindName}) (${image}) should have a non-null container.`,
    ).not.toBeNull();

    forEachNode(node!, (child) => verifyNodeContainer(child, token));
  };

  tokens.forEach((token) => verifyNodeContainer(token.payload.element, token));
}

/**
 * ---------- Linking utilities ----------
 */

export function parseAndLink(
  text: string,
  options?: { validate?: boolean; uri?: URI },
): CompilationUnit {
  const unit = createCompilationUnit(options?.uri ?? URI.file("test.pli"));

  lifecycle.tokenize(unit, text);
  lifecycle.parse(unit);
  lifecycle.generateSymbolTable(unit);
  lifecycle.link(unit);
  if (options?.validate) {
    lifecycle.validate(unit);
  }

  return unit;
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
 * Extract named range and index information and verify that the "find references" request works as expected.
 *
 * Note that there are multiple references for each index, see the example below.
 *
 * @param text PL/I text to parse and link, with range and index markers (as specified in `replaceNamedIndices`)
 *
 * @example
 * ```ts
 * expectReferences(`
 *  DCL <|1:A|>, <|2:B|>;
 *  PUT(<|1><|1:A|>);
 *  PUT(<|2><|2:B|>);
 * `)
 * ```
 */
export function expectReferences(text: string) {
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
    const result = referencesRequest(unit, unit.uri, offset);

    expect(
      result,
      `Expected ${rangeIndex.length} references but received ${result.length} for label "${label}"`,
    ).toHaveLength(rangeIndex.length);

    for (const reference of result) {
      const expectedIndex = rangeIndex.findIndex(
        ([start, end]) =>
          start === reference.range.start && end === reference.range.end,
      );
      if (expectedIndex === -1) {
        throw new Error(
          `Reference ${reference.range.start}-${reference.range.end} not found in expected ranges for label "${label}". Expected ranges: ${rangeIndex.map(([start, end]) => `${start}-${end}`).join(", ")}`,
        );
      }
      // Remove the found index from the rangeIndex array
      rangeIndex.splice(expectedIndex, 1);
    }
    expect(
      rangeIndex,
      `Not all expected ranges were found for label "${label}". Remaining ranges: ${rangeIndex.map(([start, end]) => `${start}-${end}`).join(", ")}`,
    ).toHaveLength(0);
  }
}

/**
 * ---------- End of Linking utilities ----------
 */

interface ExpectedCompletion {
  includes: string[];
  excludes?: string[];
}

export function expectCompletions(
  text: string,
  completions: ExpectedCompletion[],
) {
  const { output, indices } = replaceIndices({ text });

  const unit = parseAndLink(output);

  for (let i = 0; i < indices.length; i++) {
    const index = indices[i];
    const completionItems = completions[i];
    const completionResult = completionRequest(unit, unit.uri, index)
      .sort((a, b) => {
        const aLabel = a.sortText ?? a.label;
        const bLabel = b.sortText ?? b.label;
        return aLabel.localeCompare(bLabel);
      })
      .map((e) => e.label);

    expect(completionResult).containSubset(completionItems.includes);

    if (completionItems.excludes && completionItems.excludes.length > 0) {
      expect(completionResult).not.containSubset(completionItems.excludes);
    }
  }
}
