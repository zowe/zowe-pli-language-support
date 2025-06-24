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

import { definitionRequest } from "../src/language-server/definition-request";
import {
  collectDiagnostics,
  CompilationUnit,
} from "../src/workspace/compilation-unit";
import { URI } from "vscode-uri";
import { Diagnostic, Range } from "../src/language-server/types";
import { parseAndLink, replaceNamedIndices } from "./utils";
import { expect } from "vitest";
import { FileSystemProvider } from "../src/workspace/file-system-provider";
import { assignDebugKinds } from "../src/utils/debug-kinds";
import { completionRequest } from "../src/language-server/completion/completion-request";

export const DEFAULT_FILE_URI = "file:///main.pli";

export type TestBuilderOptions = {
  validate?: boolean;
  fs?: FileSystemProvider;
};

export type PliTestFile = {
  uri: string;
  content: string;
};

type LinkingRequest = {
  label: string;
  offset: number;
  rangeIndex: [number, number][];
};

export type ExpectedCompletion = {
  includes?: string[];
  excludes?: string[];
};

export class TestBuilder {
  private unit: CompilationUnit;
  private files: Record<
    string,
    {
      output: string;
      indices: Record<string, number[]>;
      ranges: Record<string, Array<[number, number]>>;
    }
  > = {};
  private output: string;
  private indices: Record<string, number[]>;
  private ranges: Record<string, Array<[number, number]>>;
  private diagnostics: Diagnostic[];

  /**
   * Construct a test builder from a PL/I text with range and index markers. Used to chain assertions.
   *
   * @param text PL/I text to parse and link, with range and index markers (as specified in `replaceNamedIndices`)
   *
   * Example:
   * ```ts
   * new TestBuilder(`
   *  DCL <|1:A|>, <|2:B|>;
   *  PUT(<|1>A);
   *  PUT(<|2>B);
   * `).expectLinks().expectDiagnosticsAt("1", [
   *  {
   *    message: "Error message",
   *    severity: DiagnosticSeverity.Error,
   *  }
   * ]);
   */
  constructor(
    textOrFiles: string | PliTestFile[],
    options?: TestBuilderOptions,
  ) {
    const files =
      typeof textOrFiles === "string"
        ? [{ uri: DEFAULT_FILE_URI, content: textOrFiles }]
        : textOrFiles;
    for (const file of files) {
      this.files[file.uri] = replaceNamedIndices(file.content);
    }

    if (options?.fs) {
      for (const [uri, file] of Object.entries(this.files)) {
        options.fs.writeFileSync(URI.parse(uri), file.output);
      }
    }

    const firstFile = Object.values(this.files)[0];
    const output = firstFile.output;
    const indices = firstFile.indices;
    const ranges = firstFile.ranges;

    this.unit = parseAndLink(output, {
      validate: options?.validate,
      uri: URI.parse(Object.keys(this.files)[0]),
    });

    assignDebugKinds(this.unit.ast);
    assignDebugKinds(this.unit.preprocessorAst);

    this.output = output;
    this.indices = indices;
    this.ranges = ranges;
    this.diagnostics = collectDiagnostics(this.unit);
  }

  /**
   * Expects the given label to have only the given error codes.
   *
   * @param label Label to expect the error codes at
   * @param codes Error codes to expect
   * @returns This test builder
   */
  expectExclusiveErrorCodesAt(
    label: string,
    codes: string | string[],
  ): TestBuilder {
    const codesArray = Array.isArray(codes) ? codes : [codes];

    return this.expectExclusiveDiagnosticsAt(
      label,
      codesArray.map((code) => ({
        code,
      })),
    );
  }

  /**
   * Expects the given label to have the given error codes. But might have other error codes as well.
   *
   * @param label Label to expect the error codes at
   * @param codes Error codes to expect
   * @returns This test builder
   */
  expectErrorCodesAt(label: string, codes: string | string[]): TestBuilder {
    const codesArray = Array.isArray(codes) ? codes : [codes];

    return this.expectDiagnosticsAt(
      label,
      codesArray.map((code) => ({
        code,
      })),
    );
  }

  private getMatchingDiagnostics(label: string): Diagnostic[] {
    const range = this.ranges[label];
    if (!range || range.length === 0) {
      throw new Error(`Label "${label}" not found`);
    }

    if (range.length > 1) {
      throw new Error("TODO: Multiple ranges are not supported yet");
    }

    const [[start, end]] = range;

    const matchingDiagnostics = this.diagnostics.filter(
      (diagnostic) =>
        diagnostic.range.start === start && diagnostic.range.end === end,
    );

    return matchingDiagnostics;
  }

  expectExclusiveDiagnosticsAt(
    label: string,
    diagnostics: Partial<Diagnostic>[],
  ): TestBuilder {
    const matchingDiagnostics = this.getMatchingDiagnostics(label);

    expect(
      matchingDiagnostics,
      `Expected ${diagnostics.length} diagnostics at label "${label}" but received ${matchingDiagnostics.length}`,
    ).toHaveLength(diagnostics.length);

    for (const diagnostic of diagnostics) {
      expect(matchingDiagnostics).toContainEqual(
        expect.objectContaining(diagnostic),
      );
    }

    return this;
  }

  expectDiagnosticsAt(
    label: string,
    diagnostics: Partial<Diagnostic>[],
  ): TestBuilder {
    const matchingDiagnostics = this.getMatchingDiagnostics(label);

    for (const diagnostic of diagnostics) {
      expect(matchingDiagnostics).toContainEqual(
        expect.objectContaining(diagnostic),
      );
    }

    return this;
  }

  /**
   * Get the linking requests for a given label
   * @param label - The label to get the linking requests for
   * @returns The linking requests
   */
  private getLinkingRequests(label: string): LinkingRequest[] {
    const indices = this.indices[label];
    if (!indices) {
      throw new Error(`Label "${label}" not found`);
    }

    return indices.map((offset) => ({
      label,
      offset,
      rangeIndex: Object.values(this.files).flatMap(
        (f) => f.ranges[label] ?? [],
      ),
    }));
  }

  /**
   * Produce a small snippet with a margin of 10 characters to give a hint of where the error is
   * @param offset - The offset of the label in the output
   * @param label - The label to get the snippet for
   * @returns The snippet and the line number
   */
  private getSnippet(offset: number, label: string) {
    const start = this.output.slice(offset - 10, offset).trimStart();
    const end = this.output.slice(offset, offset + 10).trimEnd();
    const snippet = `${start}<|${label}>${end}`.replaceAll("\n", "\\n");
    const line = this.output.slice(0, offset).split("\n").length + 1;

    return { snippet, line };
  }

  /**
   * Expect no links for a given label
   * @param label - The label to expect no links for
   * @returns This test builder
   *
   * @example
   * ```ts
   * new TestBuilder(`
   *  DCL A;
   *  PUT(<|1>B);
   * `).expectNoLinksFor("1"); // Passes
   */
  expectNoLinksAt(label: string): TestBuilder {
    const requests = this.getLinkingRequests(label);

    for (const { label, offset } of requests) {
      const result = definitionRequest(this.unit, this.unit.uri, offset);
      const { snippet, line } = this.getSnippet(offset, label);

      expect(
        result,
        `Expected no links for label "${label}" at offset ${offset} on line ${line} near \`${snippet}\``,
      ).toHaveLength(0);
    }

    return this;
  }

  /**
   * Ensure all labels correctly link to their definitions
   * @returns This test builder
   *
   * @example
   * ```ts
   * new TestBuilder(`
   *  DCL <|1:A|>, <|2:B|>;
   *  PUT(<|1>A);
   *  PUT(<|2>B);
   * `).expectLinks(); // Passes
   */
  expectLinks(): TestBuilder {
    const requests = Object.keys(this.indices).flatMap((index) =>
      this.getLinkingRequests(index),
    );

    for (const { label, offset, rangeIndex } of requests) {
      const result = definitionRequest(this.unit, this.unit.uri, offset);
      const { snippet, line } = this.getSnippet(offset, label);

      expect(
        result,
        `Expected ${rangeIndex.length} definitions but received ${result.length} on line ${line} for label "${label}" near \`${snippet}\``,
      ).toHaveLength(rangeIndex.length);

      if (rangeIndex.length > 1) {
        throw new Error("TODO: Range index is not supported yet");
      } else if (rangeIndex.length === 1) {
        const [singleRangeIndex] = rangeIndex;
        const [definition] = result;

        const expectedRange: Range = {
          start: singleRangeIndex[0],
          end: singleRangeIndex[1],
        };

        expect(
          definition.range,
          `Expected range does not match actual range for label "${label}" on line ${line} near \`${snippet}\``,
        ).toEqual(expectedRange);
      }
    }

    return this;
  }

  private _expectCompletions(
    label: string,
    check: (completionResult: string[]) => void,
  ) {
    const indices = this.indices[label];
    if (!indices) {
      throw new Error(`Label "${label}" not found`);
    }

    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      const completionResult = completionRequest(
        this.unit,
        this.unit.uri,
        index,
      )
        .sort((a, b) => {
          const aLabel = a.sortText ?? a.label;
          const bLabel = b.sortText ?? b.label;
          return aLabel.localeCompare(bLabel);
        })
        .map((e) => e.label);

      check(completionResult);
    }
  }

  expectCompletions(label: string, expectedCompletion: ExpectedCompletion) {
    const message = `Unexpected completions at label "${label}"`;

    this._expectCompletions(label, (completionResult) => {
      for (const completion of expectedCompletion.includes ?? []) {
        expect(completionResult, message).toContain(completion);
      }
      for (const completion of expectedCompletion.excludes ?? []) {
        expect(completionResult, message).not.toContain(completion);
      }
    });
  }
}

/**
 * Create a test builder that does not validate the PL/I text after linking.
 *
 * @param text PL/I text to parse and link, with range and index markers (as specified in `replaceNamedIndices`)
 * @returns A test builder that can be used to chain assertions
 */
export function createTestBuilder(
  textOrFiles: string | PliTestFile[],
  options?: TestBuilderOptions,
) {
  return new TestBuilder(textOrFiles, options);
}

/**
 * Create a test builder that validates the PL/I text after linking.
 *
 * @param text PL/I text to parse and link, with range and index markers (as specified in `replaceNamedIndices`)
 * @returns A test builder that can be used to chain assertions
 */
export function createValidatorTestBuilder(
  textOrFiles: string | PliTestFile[],
  options?: TestBuilderOptions,
) {
  return new TestBuilder(textOrFiles, {
    ...options,
    validate: true,
  });
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
export function expectLinks(textOrFiles: string | PliTestFile[]) {
  createTestBuilder(textOrFiles).expectLinks();
}
