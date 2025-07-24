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
import { Diagnostic, Range, Severity } from "../src/language-server/types";
import { parse, parseAndLink, replaceNamedIndices } from "./utils";
import { expect } from "vitest";
import { FileSystemProvider } from "../src/workspace/file-system-provider";
import { completionRequest } from "../src/language-server/completion/completion-request";
import { fail } from "assert";
import { MarkupContent, Position } from "vscode-languageserver";
import { hoverRequest } from "../src/language-server/hover-request";
import {
  semanticTokens,
  tokenTypes,
} from "../src/language-server/semantic-tokens";
import { TextDocument } from "vscode-languageserver-textdocument";
import { SemanticTokenDecoder } from "../src/language-server/semantic-token-decoder";
import { SemanticTokenTypes } from "vscode-languageserver-types";
import { skippedCodeRanges } from "../src/language-server/skipped-code";
import {
  PluginConfigurationProvider,
  PluginConfigurationProviderInstance,
} from "../src/workspace/plugin-configuration-provider";

export const DEFAULT_FILE_URI = "file:///main.pli";

type Path = string;
export type LocationOverride = {
  uri: Path;
  lineOffset: number;
  characterOffset: number;
};

export type TestBuilderOptions = {
  validate?: boolean;
  fs?: FileSystemProvider;

  /**
   * Override the location of files.
   *
   * This is useful for harness tests, where files are 'virtually' created inside a single test file
   */
  locationOverrides?: Record<Path, LocationOverride>;
};

export type PliTestFile = {
  uri: Path;
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

type TestFile = {
  output: string;
  indices: Record<string, number[]>;
  ranges: Record<string, Array<[number, number]>>;
  textDocument: TextDocument;
};

type MatchingDiagnosticsResult = {
  exactMatches: Diagnostic[];
  containingMatches: Diagnostic[];
};

function replaceNamedIndicesWithDocument(file: PliTestFile): TestFile {
  const { output, indices, ranges } = replaceNamedIndices(file.content);
  const textDocument = TextDocument.create(file.uri, "pli", 1, output);

  return {
    output,
    indices,
    ranges,
    textDocument,
  };
}

export class TestBuilder {
  private unit: CompilationUnit;
  private files: Map<string, TestFile> = new Map();
  private output: string;
  private indices: Record<string, number[]>;
  private ranges: Record<string, Array<[number, number]>>;
  private diagnostics: Diagnostic[];
  private options: TestBuilderOptions;

  private static getFiles(
    textOrFiles: string | PliTestFile | PliTestFile[],
  ): PliTestFile[] {
    if (typeof textOrFiles === "string") {
      return [{ uri: DEFAULT_FILE_URI, content: textOrFiles }];
    }

    if (Array.isArray(textOrFiles)) {
      return textOrFiles;
    }

    return [textOrFiles];
  }

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
  private constructor(
    textOrFiles: string | PliTestFile | PliTestFile[],
    options: TestBuilderOptions = {},
  ) {
    this.options = options;

    this.files = new Map(
      TestBuilder.getFiles(textOrFiles).map((file) => [
        file.uri,
        replaceNamedIndicesWithDocument(file),
      ]),
    );

    if (options?.fs) {
      for (const [uri, file] of this.files) {
        options.fs.writeFileSync(URI.parse(uri), file.output);
      }
    }

    this.configurePluginConfigurationProvider();

    const [[firstFileUri, firstFile]] = this.files.entries();
    const output = firstFile.output;
    const indices = firstFile.indices;
    const ranges = firstFile.ranges;

    this.unit = parseAndLink(output, {
      validate: options?.validate,
      uri: URI.parse(firstFileUri),
    });

    this.output = output;
    this.indices = indices;
    this.ranges = ranges;
    this.diagnostics = collectDiagnostics(this.unit);
  }

  private configurePluginConfigurationProvider() {
    // Check if the files contain a program config or process group.
    for (const [uri, file] of this.files) {
      if (uri.endsWith(PluginConfigurationProvider.PROGRAM_CONFIG_FILE)) {
        PluginConfigurationProviderInstance.setProgramConfigs(
          "",
          JSON.parse(file.output).pgms,
        );
      }
      if (uri.endsWith(PluginConfigurationProvider.PROCESS_GROUP_CONFIG_FILE)) {
        PluginConfigurationProviderInstance.setProcessGroupConfigs(
          JSON.parse(file.output).pgroups,
        );
      }
    }
  }

  /**
   * Create a test builder that does not validate the PL/I text after linking.
   *
   * @param text PL/I text to parse and link, with range and index markers (as specified in `replaceNamedIndices`)
   * @returns A test builder that can be used to chain assertions
   */
  static create(
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
  static createValidating(
    textOrFiles: string | PliTestFile[],
    options?: TestBuilderOptions,
  ) {
    return new TestBuilder(textOrFiles, {
      ...options,
      validate: true,
    });
  }

  expectPreprocessorTokens(textOrTokens: string | string[]): void {
    const actualTokens = this.unit.tokens.all.map((e) => e.image);
    let expectedTokens: string[] = [];
    // TODO: Instead of calling the lifecycle, we should simply call the lexer
    // Currently, everything related to the lexer lives in rather complicated services
    // Eventually, we want to refactor those to use functions
    if (Array.isArray(textOrTokens)) {
      expectedTokens = textOrTokens;
    } else {
      const expectedUnit = parse(textOrTokens);
      expectedTokens = expectedUnit.tokens.all.map((e) => e.image);
    }
    expect(actualTokens).toEqual(expectedTokens);
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

  private getMatchingDiagnostics(label: string): MatchingDiagnosticsResult {
    const range = this.ranges[label];
    if (!range || range.length === 0) {
      throw new Error(`Label "${label}" not found`);
    }

    if (range.length > 1) {
      throw new Error("TODO: Multiple ranges are not supported yet");
    }

    const [[start, end]] = range;

    const exactMatches = this.diagnostics.filter(
      (diagnostic) =>
        diagnostic.range.start === start && diagnostic.range.end === end,
    );

    const containingMatches = this.diagnostics.filter(
      (diagnostic) =>
        diagnostic.range.start >= start && diagnostic.range.end <= end,
    );

    return {
      exactMatches,
      containingMatches,
    };
  }

  expectExclusiveDiagnosticsAt(
    label: string,
    diagnostics: Partial<Diagnostic> | Partial<Diagnostic>[],
  ): TestBuilder {
    const expectedDiagnostics = Array.isArray(diagnostics)
      ? diagnostics
      : [diagnostics];

    const { exactMatches, containingMatches } =
      this.getMatchingDiagnostics(label);
    const rangeMessage = this.createLabelRangeMessage(label);

    const message = [
      `At label "${label}" (${rangeMessage})`,
      `Got errors:\n\n${JSON.stringify(exactMatches, null, 2)}`,
      `Expected errors:\n\n${JSON.stringify(expectedDiagnostics, null, 2)}`,
      containingMatches.length > 0
        ? `Note! This label also contains other diagnostics: ${JSON.stringify(containingMatches, null, 2)}\n\n`
        : "",
    ].join("\n\n");

    expect(exactMatches, message).toHaveLength(expectedDiagnostics.length);

    for (const diagnostic of expectedDiagnostics) {
      const message = `At label "${label}" (${rangeMessage})`;
      expect(exactMatches, message).toContainEqual(
        expect.objectContaining(diagnostic),
      );
    }

    return this;
  }

  expectDiagnosticsAt(
    label: string,
    diagnostics: Partial<Diagnostic>[],
  ): TestBuilder {
    const { exactMatches, containingMatches } =
      this.getMatchingDiagnostics(label);

    const getMessage = () => {
      if (containingMatches.length > 0) {
        return `At label "${label}" (${this.createLabelRangeMessage(label)}), but also contains other diagnostics: ${JSON.stringify(containingMatches, null, 2)}`;
      } else {
        return `At label "${label}" (${this.createLabelRangeMessage(label)})`;
      }
    };

    for (const diagnostic of diagnostics) {
      expect(exactMatches, getMessage()).toContainEqual(
        expect.objectContaining(diagnostic),
      );
    }

    return this;
  }

  expectNoDiagnosticsAt(label: string): TestBuilder {
    const { exactMatches } = this.getMatchingDiagnostics(label);

    if (exactMatches.length > 0) {
      const message = exactMatches
        .map((diagnostic) => this.createDiagnosticMessage(diagnostic))
        .join("\n- ");
      fail(
        `Expected no diagnostics at label "${label}" (${this.createLabelRangeMessage(label)}) but received:\n- ${message}`,
      );
    }

    return this;
  }

  expectNoDiagnostics(): TestBuilder {
    if (this.diagnostics.length > 0) {
      const message = this.diagnostics
        .map((diagnostic) => this.createDiagnosticMessage(diagnostic))
        .join("\n- ");
      fail(`Expected no diagnostics but received:\n- ${message}`);
    }

    return this;
  }

  /**
   * Get the positions of a label
   * @param label - The label to get the positions for
   * @returns The positions of the label
   * @throws If the label is not found
   */
  private getLabelPositions(label: string): number[] {
    const indices = this.indices[label];
    if (!indices) {
      throw new Error(`Label "${label}" not found`);
    }

    return indices;
  }

  /**
   * Get the linking requests for a given label
   * @param label - The label to get the linking requests for
   * @returns The linking requests
   */
  private getLinkingRequests(label: string): LinkingRequest[] {
    return this.getLabelPositions(label).map((offset) => ({
      label,
      offset,
      rangeIndex: [...this.files.values()].flatMap(
        (f) => f.ranges[label] ?? [],
      ),
    }));
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

      expect(
        result,
        `Expected no links for label "${label}" (${this.createLabelPositionMessage(label)})`,
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
      const message = `Expected ${rangeIndex.length} definitions but received ${result.length} for label "${label}" (${this.createLabelPositionMessage(label)})`;

      expect(result, message).toHaveLength(rangeIndex.length);

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
          `Expected range does not match actual range for label "${label}" (${this.createLabelPositionMessage(label)})`,
        ).toEqual(expectedRange);
      }
    }

    return this;
  }

  /**
   * Expects the given label to have the given semantic token type.
   * @param label - The label to expect the semantic token type at
   * @param tokenType - The semantic token type to expect
   * @returns This test builder
   *
   * @example
   * ```ts
   * new TestBuilder(`
   *  DCL <|1:A|>;
   * `).expectSemanticTokens("1", "variable"); // Passes
   * ```
   */
  expectSemanticTokens(label: string, tokenType: `${SemanticTokenTypes}`) {
    const ranges = this.getLabelRanges(label);

    for (const file of this.files.values()) {
      const textDocument = file.textDocument;

      const tokens = semanticTokens(textDocument, this.unit);
      const decodedTokens = SemanticTokenDecoder.decode(
        tokens,
        tokenTypes,
        textDocument,
      );

      for (const [start, end] of ranges) {
        const matchingToken = decodedTokens.find(
          (t) => t.offsetStart === start && t.offsetEnd === end,
        );

        expect(
          matchingToken,
          `Semantic token for label "${label}" (${this.createPositionMessage(start)}) not found`,
        ).toBeDefined();

        expect(
          matchingToken?.semanticTokenType,
          `Semantic token for label "${label}" (${this.createPositionMessage(start)}) has wrong token type`,
        ).toBe(tokenType);
      }
    }
  }

  expectSkippedCode(label: string) {
    const ranges = this.getLabelRanges(label);

    for (const file of this.files.values()) {
      const textDocument = file.textDocument;
      const codeRanges = skippedCodeRanges(this.unit, textDocument);

      const message = `Expected ${ranges.length} skipped code ranges but received ${codeRanges.length} for label "${label}" (${this.createLabelRangeMessage(label)})`;
      expect(codeRanges, message).toHaveLength(ranges.length);

      for (let i = 0; i < ranges.length; i++) {
        const startPosition = textDocument.positionAt(ranges[i][0]);
        const endPosition = textDocument.positionAt(ranges[i][1]);
        const messageStart = `Expected skipped code to start at ${formatPosition(startPosition)} but received ${formatPosition(codeRanges[i].start)} for label "${label}" (${this.createLabelRangeMessage(label)})`;
        expect(codeRanges[i].start, messageStart).toEqual(startPosition);
        const messageEnd = `Expected skipped code to end at ${formatPosition(endPosition)} but received ${formatPosition(codeRanges[i].end)} for label "${label}" (${this.createLabelRangeMessage(label)})`;
        expect(codeRanges[i].end, messageEnd).toEqual(endPosition);
      }
    }
  }

  private _expectCompletions(
    label: string,
    check: (completionResult: string[]) => void,
  ) {
    const indices = this.getLabelPositions(label);
    for (const offset of indices) {
      const completionResult = completionRequest(
        this.unit,
        this.unit.uri,
        offset,
      )
        .toSorted((a, b) => {
          const aLabel = a.sortText ?? a.label;
          const bLabel = b.sortText ?? b.label;
          return aLabel.localeCompare(bLabel);
        })
        .map((e) => e.label);

      check(completionResult);
    }
  }

  expectCompletions(label: string, expectedCompletion: ExpectedCompletion) {
    const message = `Unexpected completions at label "${label}" (${this.createLabelPositionMessage(label)})`;

    this._expectCompletions(label, (completionResult) => {
      for (const completion of expectedCompletion.includes ?? []) {
        expect(completionResult, message).toContain(completion);
      }
      for (const completion of expectedCompletion.excludes ?? []) {
        expect(completionResult, message).not.toContain(completion);
      }
    });
  }

  private createLabelRangeMessage(label: string): string {
    const [[start, _end]] = this.getLabelRanges(label);
    return this.createPositionMessage(start, this.unit.uri.toString());
  }

  expectHover(label: string, content: MarkupContent) {
    const indices = this.getLabelPositions(label);

    for (const index of indices) {
      const hoverResult = hoverRequest(this.unit, this.unit.uri, index);

      const message = `Expected hover for label "${label}" (${this.createLabelPositionMessage(label)})`;
      expect(hoverResult, message).toBeDefined();
      expect(hoverResult?.contents, message).toEqual(content);
    }
  }

  private createLabelPositionMessage(label: string): string {
    const position = this.getLabelPosition(label);
    return this.createPositionMessage(position, this.unit.uri.toString());
  }

  private getLabelRanges(label: string): [number, number][] {
    const ranges = this.ranges[label];
    if (!ranges || ranges.length === 0) {
      throw new Error(`Label "${label}" not found`);
    }

    return ranges;
  }

  private getLabelPosition(label: string): number {
    const indices = this.indices[label];
    if (!indices) {
      throw new Error(`Label "${label}" not found`);
    }

    return indices[0];
  }

  private createDiagnosticMessage(diagnostic: Diagnostic): string {
    const position = this.createPositionMessage(
      diagnostic.range.start,
      diagnostic.uri,
    );
    const severity = Severity[diagnostic.severity];

    if (diagnostic.code !== undefined) {
      return `${severity} ${diagnostic.code}: ${diagnostic.message} (${position})`;
    }

    return `${severity}: ${diagnostic.message} (${position})`;
  }

  private createPositionMessage(
    position: number,
    uri: string = this.unit.uri.toString(),
  ): string {
    const { line, character } = offsetAt(this.output, position);

    const locationOverride = this.options.locationOverrides?.[uri];
    const uriOverride = locationOverride?.uri ?? uri;
    const lineOffset = locationOverride?.lineOffset ?? 0;
    const characterOffset = locationOverride?.characterOffset ?? 0;

    return `${uriOverride}:${line + lineOffset}:${character + characterOffset}`;
  }
}

function formatPosition(position: Position): string {
  return `${position.line}:${position.character}`;
}

function offsetAt(text: string, start: number): Position {
  const lines = text.slice(0, start).split("\n");
  const line = lines.length - 1;
  const character = lines[line].length + 1;

  return {
    line,
    character,
  };
}

/**
 * Extract named range and index information and verify that linking works as expected.
 *
 * @param text PL/I text to parse and link, with range and index markers (as specified in `replaceNamedIndices`)
 * @returns A test builder that can be used to chain assertions
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
export function expectLinks(textOrFiles: string | PliTestFile[]): TestBuilder {
  return TestBuilder.create(textOrFiles).expectLinks();
}
