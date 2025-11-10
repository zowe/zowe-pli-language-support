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
import { CompilationUnit } from "../src/workspace/compilation-unit";
import { URI } from "vscode-uri";
import {
  Diagnostic,
  fullCode,
  Range,
  Severity,
} from "../src/language-server/types";
import { parseAndLink, replaceNamedIndices } from "./utils";
import { expect } from "vitest";
import { FileSystemProvider } from "../src/workspace/file-system-provider";
import { completionRequest } from "../src/language-server/completion/completion-request";
import { AssertionError, fail } from "assert";
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
  setPluginConfigurationProvider,
} from "../src/workspace/plugin-configuration-provider";
import { InternalCodes } from "../src/validation/internal-codes";
import { CompilerOptions } from "../src/preprocessor/compiler-options/options";
import { tokenize } from "../src/parser/tokenizer";
import { escapeRegExp } from "../src/parser/tokens";
import { isPLICode, PLICode } from "../src/validation/pli-codes";
import { isSyntaxNode, SyntaxKind } from "../src/syntax-tree/ast";
import { isObject } from "../src/utils/types";
import { format } from "util";
import { DataType, TypeDescriptions } from "../src/typesystem/descriptions";
import { TypeExpectation } from "./fourslash-harness/harness-interface";
import { binaryTokenSearch } from "../src/utils/search";

export type Label = string | number | string[] | number[];

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
   * Inverts the testing steps.
   */
  not?: boolean;
  /**
   * Override the location of files.
   * This is useful for harness tests, where files are 'virtually' created inside a single test file
   */
  locationOverrides?: Record<Path, LocationOverride>;

  /**
   * The test-builder resets the plugin configuration provider automatically for the harness tests.
   * preservePluginConfiguration can be used to disable this behavior for other test cases.
   */
  preservePluginConfiguration?: boolean;
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
  private unit!: CompilationUnit;
  private files: Map<string, TestFile> = new Map();
  private output!: string;
  private indices!: Record<string, number[]>;
  private ranges!: Record<string, Array<[number, number]>>;
  private diagnostics!: Diagnostic[];
  private options: TestBuilderOptions;

  getDiagnostics(): Diagnostic[] {
    return this.diagnostics;
  }

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
  }

  get not(): TestBuilder {
    const copy = this.copy();
    copy.options.not = !this.options.not;
    return copy;
  }

  private copy(): TestBuilder {
    const copy = new TestBuilder([], {
      ...this.options,
    });
    copy.files = this.files;
    copy.unit = this.unit;
    copy.output = this.output;
    copy.indices = this.indices;
    copy.ranges = this.ranges;
    copy.diagnostics = this.diagnostics;
    return copy;
  }

  private async init() {
    if (this.options.fs) {
      for (const [uri, file] of this.files) {
        await this.options.fs.writeFile(URI.parse(uri), file.output);
      }
    }

    await this.configurePluginConfigurationProvider();

    const [[firstFileUri, firstFile]] = this.files.entries();
    this.output = firstFile.output;
    this.indices = firstFile.indices;
    this.ranges = firstFile.ranges;

    this.unit = await parseAndLink(this.output, {
      validate: this.options.validate,
      uri: URI.parse(firstFileUri),
    });
    this.diagnostics = this.unit.diagnostics.getAll();
    this.checkDiagnosticsURIs();

    // After the test-builder is done with its tests, reset the plugin configuration provider
    // so that potential test functions that invoke functions of the lifecycle are not affected
    // by a potential test-builder's plugin configuration.
    // If some test functions in the future need to access the actual test plugin configuration
    // in the future, we can add a dedicated tag to the harness implementation.
    if (!this.options.preservePluginConfiguration) {
      setPluginConfigurationProvider(undefined);
    }
  }

  /**
   * Create a test builder that does not validate the PL/I text after linking.
   *
   * @param text PL/I text to parse and link, with range and index markers (as specified in `replaceNamedIndices`)
   * @returns A test builder that can be used to chain assertions
   */
  static async create(
    textOrFiles: string | PliTestFile[],
    options?: TestBuilderOptions,
  ) {
    const testBuilder = new TestBuilder(textOrFiles, options);
    await testBuilder.init();
    return testBuilder;
  }

  /**
   * Create a test builder that validates the PL/I text after linking.
   *
   * @param text PL/I text to parse and link, with range and index markers (as specified in `replaceNamedIndices`)
   * @returns A test builder that can be used to chain assertions
   */
  static async createValidating(
    textOrFiles: string | PliTestFile[],
    options?: TestBuilderOptions,
  ) {
    const testBuilder = new TestBuilder(textOrFiles, {
      ...options,
      validate: true,
    });
    await testBuilder.init();
    return testBuilder;
  }

  private async configurePluginConfigurationProvider() {
    // Check if the files contain a program config or process group.
    for (const [uri, file] of this.files) {
      if (uri.endsWith(PluginConfigurationProvider.PROGRAM_CONFIG_FILE)) {
        PluginConfigurationProviderInstance.parseProgramConfigs(
          "",
          file.output,
        );
      }
      if (uri.endsWith(PluginConfigurationProvider.PROCESS_GROUP_CONFIG_FILE)) {
        await PluginConfigurationProviderInstance.parseProcessGroupConfigs(
          file.output,
        );
      }
    }
  }

  public checkDiagnosticsURIs() {
    // Check all ranges
    for (const label of Object.keys(this.ranges)) {
      if (this.ranges[label].length === 0) {
        continue;
      }

      // Get all diagnostics for this label
      const { exactMatches } = this.getMatchingDiagnostics(label);

      // Check where the range originates from
      let labelFile: string | undefined;
      for (const file of this.files.keys()) {
        const fileRanges = this.files.get(file)?.ranges[label];
        if (fileRanges && fileRanges.length > 0) {
          labelFile = file;
          break;
        }
      }

      if (!labelFile) {
        continue;
      }

      for (const diagnostic of exactMatches) {
        if (diagnostic.uri && diagnostic.uri.endsWith(labelFile)) {
          continue;
        }

        fail(
          InternalCodes.DiagnosticURIMismatch.message(
            label,
            labelFile,
            diagnostic.uri,
          ),
        );
      }
    }
  }

  expectAst(statements: any[]): void {
    const actualStatements = this.unit.ast.statements;
    this.matchStatements(statements, actualStatements);
  }

  expectMacroAst(statements: any[]): void {
    const preprocessorStatements = this.unit.preprocessorAst.statements;
    this.matchStatements(statements, preprocessorStatements);
  }

  private matchStatements(expected: any[], actual: any[]): void {
    expect(
      actual,
      `Expected ${expected.length} statements, but received ${actual.length}`,
    ).toHaveLength(expected.length);
    for (let i = 0; i < expected.length; i++) {
      this.matchObj(
        expected[i],
        this.transformActualValue(actual[i]),
        `statements[${i}]`,
      );
    }
  }

  private matchObj(
    expected: Record<string, unknown>,
    actual: object,
    path: string,
  ): void {
    // We can always expect that the `actual` node contains ALL properties, even if they're null
    // Therefore, we simply iterate over its properties and check if they match the expected values
    for (const [key, actualValue] of Object.entries(actual)) {
      if (key === "container" || key.endsWith("Token")) {
        // Skip container and token properties
        continue;
      }
      const currentPath = `${path}.${key}`;
      const expectedValue = expected[key];
      this.matchValue(expectedValue, actualValue, currentPath);
    }
  }

  private matchValue(expected: any, actual: any, path: string): void {
    const value = this.transformActualValue(actual);
    if (value === null || value === undefined || value === false) {
      // If the actual value is null, undefined or false, we only check if the expected value is somehow falsy
      if (expected) {
        fail(`Expected no value for ${path}, but received ${format(value)}`);
      }
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        // If the actual value is an empty array, the expected value can be undefined or an empty array as well
        if (
          expected === undefined ||
          (Array.isArray(expected) && expected.length === 0)
        ) {
          return;
        }
        fail(
          `Expected no value or empty array for ${path}, but received ${format(value)}`,
        );
      } else if (!Array.isArray(expected)) {
        fail(`Expected an array for ${path}, but received ${typeof expected}`);
      } else {
        expect(
          expected.length,
          `Expected ${path} to have ${value.length} elements, but received ${expected.length}`,
        ).toBe(value.length);
        for (let i = 0; i < value.length; i++) {
          this.matchValue(expected[i], value[i], `${path}[${i}]`);
        }
      }
    } else {
      if (isObject(expected)) {
        if (!isObject(value)) {
          fail(
            `Expected an AST node for ${path}, but received ${format(actual)}`,
          );
        }
        this.matchObj(expected, value, path);
      } else {
        expect(
          value,
          `Expected ${path} to be ${format(expected)}, but received ${format(value)}`,
        ).toEqual(expected);
      }
    }
  }

  private transformActualValue(value: any): any {
    if (Array.isArray(value)) {
      return value.map((v) => this.transformActualValue(v));
    }
    if (isSyntaxNode(value)) {
      if (value.kind === SyntaxKind.LabelPrefix) {
        return value.name;
      } else if (value.kind === SyntaxKind.Statement) {
        return {
          ...value.value,
          labels: value.labels,
        };
      } else if (value.kind === SyntaxKind.LabelReference) {
        return value.label?.text;
      }
    }
    return value;
  }

  expectPreprocessorTokens(textOrTokens: string | string[]): void {
    const actualTokens = this.unit.tokens.map((e) => e.image);
    let expectedTokens: string[] = [];
    if (Array.isArray(textOrTokens)) {
      expectedTokens = textOrTokens;
    } else {
      expectedTokens = tokenize(textOrTokens, undefined).tokens.map(
        (e) => e.image,
      );
    }
    let exp = expect(actualTokens);
    if (this.options.not) {
      exp = exp.not;
    }
    exp.toEqual(expectedTokens);
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
    codes: string | string[] | PLICode | PLICode[],
  ): TestBuilder {
    const codesArray = Array.isArray(codes) ? codes : [codes];
    const createCode = (code: string | PLICode): string => {
      if (typeof code === "string") {
        return code;
      }
      return fullCode(code);
    };

    return this.expectExclusiveDiagnosticsAt(
      label,
      codesArray.map((code) => ({
        code: createCode(code),
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
  expectErrorCodesAt(
    label: string,
    codes: string | string[] | PLICode | PLICode[],
  ): TestBuilder {
    const codesArray = Array.isArray(codes) ? codes : [codes];
    const createCode = (code: string | PLICode): string => {
      if (typeof code === "string") {
        return code;
      }
      return fullCode(code);
    };

    return this.expectDiagnosticsAt(
      label,
      codesArray.map((code) => ({
        code: createCode(code),
      })),
    );
  }

  private getMatchingDiagnostics(label: string): MatchingDiagnosticsResult {
    const ranges = this.ranges[label];
    if (!ranges || ranges.length === 0) {
      throw new Error(`Label "${label}" not found`);
    }

    const exactMatches: Diagnostic[] = [];
    const containingMatches: Diagnostic[] = [];

    for (const range of ranges) {
      const [start, end] = range;

      // getMatchingDiagnostics is supposed to check against the ranges of the diagnostics.
      // Make sure there is a range to check against, because ranges from indices diagnostics may be undefined.
      exactMatches.push(
        ...this.diagnostics.filter(
          (diagnostic) =>
            diagnostic.range &&
            diagnostic.range.start === start &&
            diagnostic.range.end === end,
        ),
      );

      containingMatches.push(
        ...this.diagnostics.filter(
          (diagnostic) =>
            diagnostic.range &&
            diagnostic.range.start >= start &&
            diagnostic.range.end <= end,
        ),
      );
    }

    return {
      exactMatches,
      containingMatches,
    };
  }

  expectExclusiveDiagnosticsAt(
    label: string,
    diagnostics:
      | Partial<Diagnostic>
      | Partial<Diagnostic>[]
      | PLICode
      | PLICode[],
  ): TestBuilder {
    const diagnosticsArray = Array.isArray(diagnostics)
      ? diagnostics
      : [diagnostics];
    const expectedDiagnostics = diagnosticsArray.map((diag) => {
      if (isPLICode(diag)) {
        return { code: fullCode(diag) };
      }
      return diag;
    });

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
    label: Label,
    diagnostics:
      | Partial<Diagnostic>
      | Partial<Diagnostic>[]
      | PLICode
      | PLICode[],
  ): TestBuilder {
    if (Array.isArray(label)) {
      for (const l of label) {
        this.expectDiagnosticsAt(l, diagnostics);
      }
      return this;
    }
    if (typeof label === "number") {
      label = label.toString();
    }

    const diagnosticsArray = Array.isArray(diagnostics)
      ? diagnostics
      : [diagnostics];
    const expectedDiagnostics = diagnosticsArray.map((diag) => {
      if (isPLICode(diag)) {
        return { code: fullCode(diag) };
      }
      return diag;
    });

    const { exactMatches, containingMatches } =
      this.getMatchingDiagnostics(label);

    const getMessage = () => {
      if (containingMatches.length > 0) {
        return `At label "${label}" (${this.createLabelRangeMessage(label)}), but also contains other diagnostics: ${JSON.stringify(containingMatches, null, 2)}`;
      } else {
        return `At label "${label}" (${this.createLabelRangeMessage(label)})`;
      }
    };

    for (const diagnostic of expectedDiagnostics) {
      expect(exactMatches, getMessage()).toContainEqual(
        expect.objectContaining(diagnostic),
      );
    }

    return this;
  }

  expectNoDiagnosticsAt(label: Label, ...errorCodes: PLICode[]): TestBuilder {
    if (Array.isArray(label)) {
      for (const l of label) {
        this.expectNoDiagnosticsAt(l, ...errorCodes);
      }
      return this;
    }

    const { exactMatches } = this.getMatchingDiagnostics(label.toString());
    const filteredDiagnostics = this.filterByErrorCodes(
      exactMatches,
      errorCodes,
    );

    if (filteredDiagnostics.length > 0) {
      const message = filteredDiagnostics
        .map((diagnostic) => this.createDiagnosticMessage(diagnostic))
        .join("\n- ");
      fail(
        `Expected no diagnostics at label "${label}" (${this.createLabelRangeMessage(label.toString())}) but received:\n- ${message}`,
      );
    }

    return this;
  }

  expectNoDiagnostics(...errorCodes: PLICode[]): TestBuilder {
    const diagnostics = this.filterByErrorCodes(this.diagnostics, errorCodes);
    if (diagnostics.length > 0) {
      const message = diagnostics
        .map((diagnostic) => this.createDiagnosticMessage(diagnostic))
        .join("\n- ");
      fail(`Expected no diagnostics but received:\n- ${message}`);
    }

    return this;
  }

  private filterByErrorCodes(diagnostics: Diagnostic[], errorCodes: PLICode[]) {
    return errorCodes.length > 0
      ? diagnostics.filter((diagnostic) => {
          return (
            diagnostic.code !== undefined &&
            errorCodes.map((code) => fullCode(code)).includes(diagnostic.code)
          );
        })
      : diagnostics;
  }

  noDiagnosticsExcept(
    exceptions: RegExp[] | string[],
    label?: Label,
  ): TestBuilder {
    if (exceptions.length === 0) {
      return this;
    }
    if (typeof exceptions[0] === "string") {
      exceptions = (exceptions as string[]).map(
        (s) => new RegExp(escapeRegExp(s)),
      );
    }
    if (Array.isArray(label)) {
      for (const l of label) {
        this.noDiagnosticsExcept(exceptions, l);
      }
      return this;
    }
    const regex = exceptions as RegExp[];

    const diagnostics = label
      ? this.getMatchingDiagnostics(label.toString()).exactMatches
      : this.diagnostics;
    const remainingDiagnostics = diagnostics.filter((diagnostic) => {
      const message = this.createDiagnosticMessage(diagnostic);
      return !regex.some((r) => r.test(message));
    });
    if (remainingDiagnostics.length > 0) {
      const message = remainingDiagnostics
        .map((diagnostic) => this.createDiagnosticMessage(diagnostic))
        .join("\n- ");
      fail(
        `Expected no diagnostics apart from ${regex.map((r) => r.source).join(", ")}, but received:\n- ${message}`,
      );
    }
    return this;
  }

  expectToThrow(fn: () => void, messageToThrow?: string) {
    const message = `Expected function to throw an error ${
      messageToThrow ? `with message "${messageToThrow}"` : ""
    }, but it did not`;
    try {
      fn();
      fail(message);
    } catch (error) {
      if (error instanceof AssertionError) {
        if (messageToThrow) {
          expect(error.message, message).toContain(messageToThrow);
        }
      } else {
        throw error;
      }
    }
  }

  expectCompilerOptions(
    expectedOptions: Partial<CompilerOptions>,
  ): TestBuilder {
    const actualOptions = this.unit.compilerOptions;
    for (const [key, value] of Object.entries(expectedOptions)) {
      // If the value is an object, only check for the options that are expected.
      if (typeof value === "object" && value !== null) {
        expect(actualOptions[key as keyof CompilerOptions]).toEqual(
          expect.objectContaining(value),
        );
      } else {
        expect(actualOptions[key as keyof CompilerOptions]).toEqual(value);
      }
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

      if (this.options.not) {
        for (let i = 0; i < ranges.length; i++) {
          const startPosition = textDocument.positionAt(ranges[i][0]);
          const endPosition = textDocument.positionAt(ranges[i][1]);
          const codeRange = codeRanges.find(
            (cr) =>
              cr.start.line === startPosition.line &&
              cr.start.character === startPosition.character &&
              cr.end.line === endPosition.line &&
              cr.end.character === endPosition.character,
          );
          if (codeRange) {
            fail(
              `Found unexpected skipped code from ${formatPosition(startPosition)} to ${formatPosition(endPosition)} for label "${label}" (${this.createLabelRangeMessage(label)})`,
            );
          }
        }
      } else {
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

  expectTypeAt(label: string, expectedType: TypeExpectation): void {
    const ranges = this.getLabelRanges(label);
    for (const [start] of ranges) {
      const token = binaryTokenSearch(this.unit.tokens, start);
      const node = token?.element;
      if (!node) {
        throw new Error(
          `No syntax node found at position ${this.createPositionMessage(start)}`,
        );
      }
      const actualType = this.unit.services.inferer.inferType(node, this.unit);
      this.expectTypeWithStructure(expectedType, actualType);
    }
  }

  private expectTypeWithStructure(
    expectedType: TypeExpectation,
    actualType: TypeDescriptions.Any,
  ) {
    if (expectedType.type === DataType.Structure) {
      //check: is structure?
      if (actualType.type !== DataType.Structure) {
        throw new Error(
          `Expected type to be a ${TypeDescriptions.Names[DataType.Structure]}, but got ${TypeDescriptions.Names[actualType.type]}`,
        );
      }

      //check: are expected members present?
      for (const [name, expectedMemberType] of Object.entries(
        expectedType.members ?? {},
      )) {
        const actualMemberType = actualType.members[name];
        if (!actualMemberType) {
          throw new Error(
            `Expected member "${name}" to be present, but got undefined`,
          );
        }
        this.expectTypeWithStructure(expectedMemberType, actualMemberType);
      }

      //check: are there any actual members missing in our expectation?
      const missingActualMembers = Object.keys(actualType.members).filter(
        (name) => !expectedType.members || !(name in expectedType.members),
      );
      if (missingActualMembers.length > 0) {
        throw new Error(
          `Actual type provides more members than the expected type: ${missingActualMembers.join(", ")}`,
        );
      }
    } else {
      this.expectTypeNoStructure(expectedType, actualType);
    }
  }

  private expectTypeNoStructure(
    expectedType: TypeExpectation,
    actualType: TypeDescriptions.Any,
  ) {
    for (const [key, value] of Object.entries(expectedType)) {
      if (typeof value === "object" && value !== null) {
        expect(actualType[key as keyof typeof actualType]).toEqual(
          expect.objectContaining(value),
        );
      } else {
        expect(actualType[key as keyof typeof actualType]).toEqual(value);
      }
    }
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
      // TODO: Also test the range
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
      diagnostic.range?.start ?? 0,
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
