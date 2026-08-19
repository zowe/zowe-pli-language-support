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
import { getReferenceLocations } from "../src/linking/resolver";
import { CompilationUnit } from "../src/workspace/compilation-unit";
import {
  Diagnostic,
  diagnosticToLSP,
  fullCode,
  Severity,
  Range,
} from "../src/language-server/types";
import {
  MatchingDiagnosticsResult,
  parseAndLink,
  PliTestFile,
  TestIndex,
  TestRange,
} from "./utils";
import { expect } from "vitest";
import {
  FileSystemProvider,
  VirtualFileSystemProvider,
} from "../src/workspace/file-system-provider";
import { completionRequest } from "../src/language-server/completion/completion-request";
import { AssertionError, fail } from "assert";
import { MarkupContent, Position } from "vscode-languageserver";
import { hoverRequest } from "../src/language-server/hover-request";
import { semanticTokens } from "../src/language-server/semantic-tokens";
import { TextDocument } from "vscode-languageserver-textdocument";
import { SemanticTokenDecoder } from "../src/language-server/semantic-token-decoder";
import { CodeAction, TextEdit } from "vscode-languageserver-types";
import { skippedCodeRanges } from "../src/language-server/skipped-code";
import {
  createTestWorkspace,
  defaultTestWorkspace,
  setDefaultTestWorkspace,
} from "./test-workspace";
import { InternalCodes } from "../src/validation/internal-codes";
import { CompilerOptions } from "../src/preprocessor/compiler-options/options";
import { tokenize } from "../src/parser/tokenizer";
import { escapeRegExp } from "../src/parser/tokens";
import { isPLICode, PLICode } from "../src/validation/pli-codes";
import { isSyntaxNode, SyntaxKind } from "../src/syntax-tree/ast";
import { isObject } from "../src/utils/types";
import { format } from "util";
import { DataType, TypeDescriptions } from "../src/typesystem/descriptions";
import {
  SemanticTokenModifiersValues,
  SemanticTokenTypesValues,
  TypeExpectation,
} from "./fourslash-harness/harness-interface";
import { binaryTokenSearch } from "../src/utils/search";
import { PluginConfiguration } from "../src/language-server/constants";
import { DiagnosticCategory } from "../src/validation/diagnostics-store";
import { UriUtils } from "../src/utils/uri";
import { applyQuickFixes } from "../src/language-server/code-actions/apply-quick-fixes";
import { signatureHelpRequest } from "../src/language-server/signature-help-request";
import { assertType } from "../src/preprocessor/util";
import {
  AbstractTestBuilder,
  DiagnosticExpectation,
  Label,
  TestDiagnostic,
} from "./abstract-test-builder";
import { Messages, TestGlobalConfigLoader } from "../src/utils/messages";

export type { DiagnosticExpectation, Label, TestDiagnostic };

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

  /**
   * Skip creating default plugin configuration files (pgm_conf.json, proc_grps.json).
   * Used to test scenarios where no configuration exists.
   * Corresponds to the fourslash directive: // @noDefaultConfig
   */
  noDefaultConfig?: boolean;
};

type LinkingRequest = {
  label: string;
  offset: TestIndex;
  rangeIndex: TestRange[];
};

export type ExpectedCompletion = {
  includes?: string[];
  excludes?: string[];
};

export class TestBuilder extends AbstractTestBuilder {
  private unit!: CompilationUnit;
  private output!: string;
  private diagnostics!: Diagnostic[];
  private options: TestBuilderOptions;
  /**
   * Whether the test supplied its own `.pliplugin/proc_grps.json`. The default
   * config lists `cpy`/`inc` libs that are unresolved in most test workspaces,
   * so proc_grps unresolved-lib diagnostics (COPC01E) are only surfaced to
   * assertions when the test opted in by providing its own config.
   */
  private areProcGrpsSupplied = false;

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
    super();
    this.options = options;

    this.initMarkerState(TestBuilder.getFiles(textOrFiles));
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
    if (!this.options.fs) {
      const fs = new VirtualFileSystemProvider();
      this.options.fs = fs;
    }
    const loader = new TestGlobalConfigLoader(this.extractGlobalConfig());
    setDefaultTestWorkspace(createTestWorkspace(this.options.fs, loader));
    for (const [uri, file] of this.files) {
      await this.options.fs.writeFile(UriUtils.toUri(uri), file.output);
    }
    await this.configurePluginConfigurationProvider();

    const [[firstFileUri, firstFile]] = this.files.entries();
    this.output = firstFile.output;
    this.unit = await parseAndLink(this.output, {
      validate: this.options.validate,
      uri: UriUtils.toUri(firstFileUri),
    });
    // Register every test file's document with the compilation unit's file
    // store. This lets LSP conversions (e.g. diagnosticToLSP) resolve
    // diagnostics that target non-PL/I files such as the plugin
    // configuration JSON, which are otherwise not part of the unit.
    for (const [uri, file] of this.files) {
      if (!this.unit.services.files.has(uri)) {
        this.unit.services.files.set({
          uri: UriUtils.toUri(uri),
          tokens: [],
          comments: [],
          textDocument: file.textDocument,
        });
      }
    }
    this.diagnostics = this.unit.diagnostics.getAll();
    const configDiagnostics =
      defaultTestWorkspace().config.getConfigInternalDiagnostics();
    for (const diagnostic of configDiagnostics) {
      // Skip proc_grps.json diagnostics when the default config was used: its
      // placeholder `cpy`/`inc` libs are unresolved in most test workspaces
      // and would otherwise leak COPC01E noise into unrelated tests.
      if (
        !this.areProcGrpsSupplied &&
        diagnostic.uri?.endsWith(PluginConfiguration.PROCESS_GROUP_FILE_PATH)
      ) {
        continue;
      }
      this.diagnostics.push(diagnostic);
    }
    this.checkDiagnosticsURIs();

    // After the test-builder is done, clear the workspace's plugin configuration
    // so that subsequent test functions that invoke parts of the lifecycle aren't
    // affected by this test-builder's configuration. Tests that need to inspect the
    // configuration can opt out via `options.preservePluginConfiguration`.
    if (!this.options.preservePluginConfiguration) {
      const config = defaultTestWorkspace().config;
      config.setProgramConfigs(UriUtils.toUri(""), []);
      await config.setProcessGroupConfigs([]);
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

  /**
   * Configures the plugin configuration provider based on the test files.
   * If a file for either the program or process group configuration is found, use it.
   * If not, provide a default configuration (unless noDefaultConfig is set).
   * Ensures we have a proper config after writing all files to the fs & before parsing,
   * so that we can build $computedLibs correctly
   */
  private async configurePluginConfigurationProvider() {
    let pgmConfUri: string | undefined;
    let hasProcGrpsUri: boolean = false;

    for (const [uri] of this.files) {
      if (uri.endsWith(PluginConfiguration.PROGRAM_FILE_PATH)) {
        pgmConfUri = uri;
      }
      if (uri.endsWith(PluginConfiguration.PROCESS_GROUP_FILE_PATH)) {
        hasProcGrpsUri = true;
      }
    }
    this.areProcGrpsSupplied = hasProcGrpsUri;
    const workspaceUri = pgmConfUri
      ? UriUtils.dirname(UriUtils.dirname(UriUtils.toUri(pgmConfUri)))
      : UriUtils.toUri("file:///");

    // Skip default config creation if noDefaultConfig is set
    if (this.options.noDefaultConfig) {
      await defaultTestWorkspace().config.init(workspaceUri);
      return;
    }

    // Writing the default config files requires an initialized workspace;
    // the final init below reloads them.
    await defaultTestWorkspace().config.init(workspaceUri);

    if (!pgmConfUri) {
      await defaultTestWorkspace().config.writeProgramConfigFile(
        PluginConfiguration.DEFAULT_PROGRAM_FILE_CONTENT,
      );
    }
    if (!hasProcGrpsUri) {
      await defaultTestWorkspace().config.writeProcessGroupsFile(
        PluginConfiguration.DEFAULT_PROCESS_GROUP_FILE_CONTENT,
      );
      // The default process group configuration references cpy and inc as default includes
      // If we don't create the directories, the config validation will generate diagnostics
      await defaultTestWorkspace().fs.writeFile(
        UriUtils.joinPath(workspaceUri, "cpy", "__placeholder"),
        "",
      );
      await defaultTestWorkspace().fs.writeFile(
        UriUtils.joinPath(workspaceUri, "inc", "__placeholder"),
        "",
      );
    }
    await defaultTestWorkspace().config.init(workspaceUri);
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
        if (!diagnostic.uri || diagnostic.uri.endsWith(labelFile)) {
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

  private applyEditsToString(content: string, edits: TextEdit[]): string {
    const doc = TextDocument.create("file://inmemory", "plaintext", 1, content);
    return TextDocument.applyEdits(doc, edits);
  }

  private codeActionCacheByLabel = new Map<string, [string, CodeAction[]][]>();
  async expectCodeActionAt(
    label: string,
    expectedActionLabel: string,
    expectedCodeAfter: string,
  ): Promise<void> {
    let codeActions = await this.getCodeActions(label);
    const expectedTokens = tokenize(expectedCodeAfter, undefined).tokens.map(
      (e) => e.image,
    );
    for (const [uri, actions] of codeActions) {
      for (const codeAction of actions) {
        if (codeAction.title === expectedActionLabel) {
          if (codeAction.edit && codeAction.edit.changes) {
            const originalSource = this.files.get(uri)!.textDocument.getText();
            const modifiedSource = this.applyEditsToString(
              originalSource,
              codeAction.edit.changes[uri],
            );
            const actualTokens = tokenize(modifiedSource, undefined).tokens.map(
              (e) => e.image,
            );
            expect(
              actualTokens,
              `Expected code after applying code action "${expectedActionLabel}" at label "${label}" to have tokens ${expectedTokens.join(", ")}, but got ${actualTokens.join(", ")}`,
            ).toEqual(expectedTokens);
            return;
          }
        }
      }
      fail(
        `Expected code action with title "${expectedActionLabel}" at label "${label}", but it was not found.
Available code actions for label "${label}" and URI "${uri}": ${codeActions.map(([_, actions]) => actions.map((a) => a.title).join(", ")).join("; ")}`,
      );
    }
  }

  async expectCodeActionCountAt(
    label: string,
    expectedCount: number,
  ): Promise<void> {
    const codeActions = await this.getCodeActions(label);
    const actualCount = codeActions.reduce(
      (acc, [, actions]) => acc + actions.length,
      0,
    );
    expect(
      actualCount,
      `Expected ${expectedCount} code actions at label "${label}", but found ${actualCount}.`,
    ).toBe(expectedCount);
  }

  /**
   * Get code actions for the given label. The code actions are cached, so subsequent calls with the same
   * label will return the cached code actions.
   * @param label The label to get code actions for.
   * @returns A promise that resolves to an array of tuples, each containing a URI and an array of code actions.
   */
  private async getCodeActions(
    label: string,
  ): Promise<[string, CodeAction[]][]> {
    let codeActions = this.codeActionCacheByLabel.get(label);
    if (!codeActions) {
      const asyncActionsByUri = this.getMatchingDiagnostics(label)
        .exactMatches.map(
          (d) => [d.uri, diagnosticToLSP(this.unit, d)] as const,
        )
        .filter(
          ([uri, diagnostic]) => diagnostic !== undefined && uri !== undefined,
        )
        .map(([uri, diagnostic]) => ({
          uri: uri!,
          actions: applyQuickFixes([diagnostic!], defaultTestWorkspace(), uri!),
        }));
      codeActions = [];
      for (const { uri, actions } of asyncActionsByUri) {
        const resolvedActions = await actions;
        if (resolvedActions) {
          codeActions.push([uri, resolvedActions] as const);
        }
      }
      this.codeActionCacheByLabel.set(label, codeActions);
    }
    return codeActions;
  }

  async noCodeActions(label: string): Promise<void> {
    await this.expectCodeActionCountAt(label, 0);
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
      if (
        key === "container" ||
        key.endsWith("Token") ||
        expected[key] === undefined
      ) {
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
        return value.item?.ref?.text ?? null;
      } else if (value.kind === SyntaxKind.Statement) {
        return {
          ...value.value,
          labels: value.labels,
        };
      } else if (value.kind === SyntaxKind.LabelReference) {
        return value.label?.element?.ref?.text;
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

  containsPreprocessorTokens(textOrTokens: string | string[]): void {
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
    for (const token of expectedTokens) {
      exp.toContain(token);
    }
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
      const { uri, start, end } = range;

      // getMatchingDiagnostics is supposed to check against the ranges of the diagnostics.
      // Make sure there is a range to check against, because ranges from indices diagnostics may be undefined.
      exactMatches.push(
        ...this.diagnostics.filter(
          (diagnostic) =>
            diagnostic.range &&
            UriUtils.equals(diagnostic.uri, uri) &&
            diagnostic.range.start === start &&
            diagnostic.range.end === end,
        ),
      );

      containingMatches.push(
        ...this.diagnostics.filter(
          (diagnostic) =>
            diagnostic.range &&
            UriUtils.equals(diagnostic.uri, uri) &&
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
    diagnostics: DiagnosticExpectation,
  ): TestBuilder {
    const diagnosticsArray = Array.isArray(diagnostics)
      ? diagnostics
      : [diagnostics];

    const { exactMatches, containingMatches } =
      this.getMatchingDiagnostics(label);
    const rangeMessage = this.createLabelRangeMessage(label);

    const expectedDesc = diagnosticsArray.map((d) =>
      this.formatExpectedDiagnostic(d),
    );

    const message = [
      `At label "${label}" (${rangeMessage})`,
      `Got errors:\n\n${JSON.stringify(exactMatches, null, 2)}`,
      `Expected errors:\n\n${expectedDesc.join("\n")}`,
      containingMatches.length > 0
        ? `Note! This label also contains other diagnostics: ${JSON.stringify(containingMatches, null, 2)}\n\n`
        : "",
    ].join("\n\n");

    expect(exactMatches, message).toHaveLength(diagnosticsArray.length);

    for (const expected of diagnosticsArray) {
      const found = exactMatches.some((actual) =>
        this.diagnosticMatchesExpectation(actual, expected),
      );
      if (!found) {
        fail(
          `${message}\n\nExpected diagnostic not found:\n${this.formatExpectedDiagnostic(expected)}`,
        );
      }
    }

    return this;
  }

  expectDiagnosticsAt(
    label: Label,
    diagnostics: DiagnosticExpectation,
  ): TestBuilder {
    const diagnosticsArray = Array.isArray(diagnostics)
      ? diagnostics
      : [diagnostics];

    this.forEachLabel(label, (l) => {
      const { exactMatches, containingMatches } =
        this.getMatchingDiagnostics(l);

      const getMessage = () => {
        if (containingMatches.length > 0) {
          return `At label "${l}" (${this.createLabelRangeMessage(l)}), but also contains other diagnostics: ${JSON.stringify(containingMatches, null, 2)}`;
        } else {
          return `At label "${l}" (${this.createLabelRangeMessage(l)})`;
        }
      };

      // Check both exactMatches and containingMatches since the diagnostic range
      // might not exactly match the label range (especially for parser errors)
      for (const expected of diagnosticsArray) {
        const allMatches = [...exactMatches, ...containingMatches];
        const found = allMatches.some((actual) =>
          this.diagnosticMatchesExpectation(actual, expected),
        );

        if (!found) {
          fail(
            `${getMessage()}\n\nExpected diagnostic not found:\n${this.formatExpectedDiagnostic(expected)}\n\nActual diagnostics:\n${JSON.stringify(allMatches, null, 2)}`,
          );
        }
      }
    });

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

  expectNoDiagnosticsFrom(...languages: string[]): TestBuilder {
    const diagnostics = this.diagnostics.filter((diagnostic) => {
      return (
        diagnostic.source !== undefined && languages.includes(diagnostic.source)
      );
    });
    if (diagnostics.length > 0) {
      const message = diagnostics
        .map((diagnostic) => this.createDiagnosticMessage(diagnostic))
        .join("\n- ");
      fail(
        `Expected no diagnostics from languages ${languages.join(", ")} but received:\n- ${message}`,
      );
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
    exceptions: RegExp[] | string[] | PLICode[],
    label?: Label,
  ): TestBuilder {
    if (exceptions.length === 0) {
      return this;
    }
    if (typeof exceptions[0] === "string") {
      exceptions = (exceptions as string[]).map(
        (s) => new RegExp(escapeRegExp(s)),
      );
    } else if (isPLICode(exceptions[0])) {
      exceptions = (exceptions as PLICode[]).map(
        (code) => new RegExp(escapeRegExp(fullCode(code))),
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

  expectNoCategoryDiagnostics(
    category: DiagnosticCategory,
    filter?: (d: Diagnostic) => boolean,
  ): TestBuilder {
    const diagnostics = this.unit.diagnostics.get(category);
    const filtered = filter ? diagnostics.filter(filter) : diagnostics;

    if (filtered.length > 0) {
      const message = filtered
        .map((diagnostic) => this.createDiagnosticMessage(diagnostic))
        .join("\n- ");
      fail(`Expected no diagnostics but received:\n- ${message}`);
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

    const expectPartialMatch = (
      actual: any,
      expected: any,
      path: string = "",
    ): void => {
      if (Array.isArray(expected)) {
        expect(actual, `${path} should be an array`).toEqual(expect.any(Array));
        expect(actual.length, `${path} array length`).toEqual(expected.length);

        for (let i = 0; i < expected.length; i++) {
          expectPartialMatch(actual[i], expected[i], `${path}[${i}]`);
        }
      } else if (typeof expected === "object" && expected !== null) {
        expect(actual, `${path} should be an object`).toBeDefined();
        expect(actual, `${path} should be an object`).not.toBeNull();

        for (const [key, value] of Object.entries(expected)) {
          expectPartialMatch(actual[key], value, `${path}.${key}`);
        }
      } else {
        expect(actual, `${path} should equal ${expected}`).toEqual(expected);
      }
    };

    for (const [key, value] of Object.entries(expectedOptions)) {
      expectPartialMatch(
        actualOptions[key as keyof CompilerOptions],
        value,
        key,
      );
    }
    return this;
  }

  /**
   * Get the positions of a label
   * @param label - The label to get the positions for
   * @returns The positions of the label
   * @throws If the label is not found
   */
  private getLabelPositions(label: string): TestIndex[] {
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

    for (const {
      label,
      offset: { uri, offset },
    } of requests) {
      const result = definitionRequest(this.unit, UriUtils.toUri(uri), offset);

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

    for (const {
      label,
      offset: { uri, offset },
      rangeIndex,
    } of requests) {
      const result = definitionRequest(this.unit, UriUtils.toUri(uri), offset);
      const message = `Expected ${rangeIndex.length} definitions but received ${result.length} for label "${label}" (${this.createLabelPositionMessage(label)})`;

      expect(result, message).toHaveLength(rangeIndex.length);

      if (rangeIndex.length > 1) {
        for (const expected of rangeIndex) {
          const { uri, start, end } = expected;
          const exists = result.some(
            (definition) =>
              UriUtils.equals(definition.uri, uri) &&
              definition.range.start === start &&
              definition.range.end === end,
          );
          expect(
            exists,
            `Expected definition at range [${start}, ${end}] for label "${label}" (${this.createLabelPositionMessage(label)}) not found`,
          ).toBeTruthy();
        }
      } else if (rangeIndex.length === 1) {
        const [singleRangeIndex] = rangeIndex;
        const [definition] = result;

        const expectedRange: Range = {
          start: singleRangeIndex.start,
          end: singleRangeIndex.end,
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
   * Ensure find-references from every definition label returns the definition itself plus
   * every reference marker of the same index - across all test files. The counterpart of
   * `expectLinks`: that one drives go-to-definition from each reference marker, this one
   * drives the references request from each definition.
   * @returns This test builder
   *
   * @example
   * ```ts
   * new TestBuilder(`
   *  DCL <|1:A|>;
   *  PUT(<|1>A);
   *  PUT(<|1>A);
   * `).expectReferences(); // Passes: references at A's declaration yield 3 locations
   */
  expectReferences(): TestBuilder {
    for (const label of Object.keys(this.ranges)) {
      const definitions = this.getLabelRanges(label);
      const markers = this.indices[label] ?? [];
      for (const definition of definitions) {
        const locations = getReferenceLocations(
          this.unit,
          UriUtils.toUri(definition.uri),
          definition.start,
        );
        const describe = (msg: string) =>
          `${msg} for label "${label}" (${this.createLabelPositionMessage(label)})`;
        for (const marker of markers) {
          const found = locations.some(
            (location) =>
              UriUtils.equals(location.uri, marker.uri) &&
              location.range.start === marker.offset,
          );
          expect(
            found,
            describe(
              `Expected reference at ${marker.uri}@${marker.offset} not found`,
            ),
          ).toBeTruthy();
        }
        const definitionIncluded = locations.some(
          (location) =>
            UriUtils.equals(location.uri, definition.uri) &&
            location.range.start === definition.start,
        );
        expect(
          definitionIncluded,
          describe("Expected the declaration itself among the references"),
        ).toBeTruthy();
        expect(
          locations,
          describe(
            `Expected exactly ${markers.length + 1} reference locations`,
          ),
        ).toHaveLength(markers.length + 1);
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
  expectSemanticTokens(label: string, tokenType: SemanticTokenTypesValues) {
    const ranges = this.getLabelRanges(label);

    for (const { uri, start, end } of ranges) {
      const file = this.files.get(uri);
      if (!file) {
        throw new Error(`File with URI ${uri} not found`);
      }

      const textDocument = file.textDocument;
      const tokens = semanticTokens(textDocument, this.unit);
      const decodedTokens = SemanticTokenDecoder.decode(tokens, textDocument);
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

  expectSemanticTokenModifiers(
    label: string,
    tokenModifiers: SemanticTokenModifiersValues,
  ) {
    const ranges = this.getLabelRanges(label);

    for (const { uri, start, end } of ranges) {
      const file = this.files.get(uri);
      if (!file) {
        throw new Error(`File with URI ${uri} not found`);
      }

      const textDocument = file.textDocument;
      const tokens = semanticTokens(textDocument, this.unit);
      const decodedTokens = SemanticTokenDecoder.decode(tokens, textDocument);
      const matchingToken = decodedTokens.find(
        (t) => t.offsetStart === start && t.offsetEnd === end,
      );

      expect(
        matchingToken,
        `Semantic token for label "${label}" (${this.createPositionMessage(start)}) not found`,
      ).toBeDefined();

      if (tokenModifiers === "none") {
        expect(
          matchingToken?.tokenModifiers,
          `Semantic token for label "${label}" (${this.createPositionMessage(start)}) has unexpected token modifiers`,
        ).toHaveLength(0);
      } else {
        expect(
          matchingToken?.tokenModifiers,
          `Semantic token for label "${label}" (${this.createPositionMessage(start)}) has wrong token modifier`,
        ).toContain(tokenModifiers);
      }
    }
  }

  expectSkippedCode(label: string) {
    const ranges = this.getLabelRanges(label);

    if (this.options.not) {
      for (let i = 0; i < ranges.length; i++) {
        const { uri, start, end } = ranges[i];
        const file = this.files.get(uri);
        if (!file) {
          throw new Error(`File with URI ${uri} not found`);
        }
        const textDocument = file.textDocument;
        const codeRanges = skippedCodeRanges(this.unit, textDocument);
        const startPosition = textDocument.positionAt(start);
        const endPosition = textDocument.positionAt(end);
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
      for (let i = 0; i < ranges.length; i++) {
        const { uri, start, end } = ranges[i];
        const file = this.files.get(uri);
        if (!file) {
          throw new Error(`File with URI ${uri} not found`);
        }
        const textDocument = file.textDocument;
        const codeRanges = skippedCodeRanges(this.unit, textDocument);
        const startPosition = textDocument.positionAt(start);
        const endPosition = textDocument.positionAt(end);
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
    for (const { uri, offset } of indices) {
      const completionResult = completionRequest(
        this.unit,
        UriUtils.toUri(uri),
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
    for (const { uri, start } of ranges) {
      const tokens = this.unit.services.files.get(
        UriUtils.normalize(uri),
      )?.tokens;
      if (!tokens) {
        throw new Error(`No tokens found for file ${uri}`);
      }
      const token = binaryTokenSearch(tokens, start);
      const node = token?.element;
      if (!node) {
        throw new Error(
          `No syntax node found at position ${this.createPositionMessage(start)}`,
        );
      }
      const actualType = this.unit.services.inferer.inferType(node, this.unit);
      if (actualType.type === DataType.Unknown) {
        this.expectTypeNoStructure(expectedType, actualType);
      } else if (
        actualType.type === DataType.Structure ||
        actualType.type === DataType.Union ||
        !actualType.dimension
      ) {
        this.expectTypeWithComposite(expectedType, actualType as any);
      } else {
        this.expectTypeNoStructure(expectedType, actualType);
      }
    }
  }

  private expectTypeWithComposite(
    expectedType: TypeExpectation,
    actualType: TypeDescriptions.Any,
  ) {
    if (
      expectedType.type === DataType.Structure ||
      expectedType.type === DataType.Union
    ) {
      if (!actualType.type) {
        throw new Error(
          `Expected type to be a ${TypeDescriptions.Names[DataType.Structure]}, but got undefined`,
        );
      }
      if (actualType.type !== expectedType.type) {
        throw new Error(
          `Expected type to be a ${TypeDescriptions.Names[expectedType.type]}, but got ${TypeDescriptions.Names[actualType.type]}`,
        );
      }

      if (expectedType.dimension !== undefined) {
        if (actualType.dimension === undefined) {
          throw new Error(`Expected type to have dimension, but got undefined`);
        } else {
          this.expectTypeNoStructure(
            expectedType.dimension,
            actualType.dimension,
          );
        }
      } else {
        if (actualType.dimension !== undefined) {
          throw new Error(`Expected type to not have dimension, but got one.`);
        }
      }

      //check: are expected members present?
      for (const [name, expectedMemberType] of Object.entries(
        expectedType.members ?? {},
      )) {
        const node = [...actualType.membersMetadata.keys()].find(
          (k) => actualType.membersMetadata.get(k)!.name === name,
        );
        if (!node) {
          throw new Error(
            `Expected member "${name}" to be present, but got undefined`,
          );
        }
        const actualMemberType = actualType.members.get(node);
        if (!actualMemberType) {
          throw new Error(
            `Expected member "${name}" to be present, but got undefined`,
          );
        }
        this.expectTypeWithComposite(expectedMemberType, actualMemberType);
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

  private expectTypeNoStructure(expectedType: object, actualType: object) {
    for (const [key, value] of Object.entries(expectedType)) {
      if (typeof value === "object" && value !== null) {
        const field = (actualType as any)[key as keyof typeof actualType];
        if (Array.isArray(value)) {
          expect(Array.isArray(field)).toEqual(true);
          expect(value.length).toEqual(field.length);
          value.forEach((v, i) => {
            this.expectTypeNoStructure(v, field[i]);
          });
        } else {
          this.expectTypeNoStructure(value, field);
        }
      } else {
        expect(actualType[key as keyof typeof actualType]).toEqual(value);
      }
    }
  }

  private createLabelRangeMessage(label: string): string {
    const [{ uri, start }] = this.getLabelRanges(label);
    return this.createPositionMessage(start, uri);
  }

  expectHover(label: string, content: MarkupContent) {
    const indices = this.getLabelPositions(label);

    for (const { uri, offset } of indices) {
      const hoverResult = hoverRequest(this.unit, UriUtils.toUri(uri), offset);

      const message = `Expected hover for label "${label}" (${this.createLabelPositionMessage(label)})`;
      expect(hoverResult, message).toBeDefined();
      expect(hoverResult?.contents, message).toEqual(content);
      // TODO: Also test the range
    }
  }

  expectNoSignatureHelp(label: string): void {
    const indices = this.getLabelPositions(label);

    for (const { uri, offset } of indices) {
      const signatureHelpResult = signatureHelpRequest(
        this.unit,
        UriUtils.toUri(uri),
        offset,
      );
      const message = `Expected no signature help for label "${label}" (${this.createLabelPositionMessage(label)})`;
      expect(signatureHelpResult, message).toBeNull();
    }
  }

  expectMarkdownSignatureAt(label: string, text: string): void {
    const indices = this.getLabelPositions(label);

    for (const { uri, offset } of indices) {
      const signatureHelpResult = signatureHelpRequest(
        this.unit,
        UriUtils.toUri(uri),
        offset,
      );
      const message = `Expected signature help for label "${label}" (${this.createLabelPositionMessage(label)})`;
      expect(signatureHelpResult, message).not.toBeNull();
      expect(signatureHelpResult?.activeSignature, message).toBeDefined();
      const activeSignature =
        signatureHelpResult?.signatures[signatureHelpResult.activeSignature!];
      const activeDocumentation = activeSignature?.documentation;
      expect(activeDocumentation, message).toBeTypeOf("object");
      assertType<MarkupContent>(activeDocumentation);
      expect(activeDocumentation.kind, message).toEqual("markdown");
      expect(activeDocumentation.value, message).toEqual(text);
    }
  }

  expectMarkdownParameterAt(label: string, markdown: string): void {
    const indices = this.getLabelPositions(label);

    for (const { uri, offset } of indices) {
      const signatureHelpResult = signatureHelpRequest(
        this.unit,
        UriUtils.toUri(uri),
        offset,
      );
      const message = `Expected parameter help for label "${label}" (${this.createLabelPositionMessage(label)})`;
      expect(signatureHelpResult, message).not.toBeNull();
      expect(signatureHelpResult?.activeSignature, message).toBeDefined();
      const activeSignature =
        signatureHelpResult?.signatures[signatureHelpResult.activeSignature!];
      expect(signatureHelpResult?.activeParameter, message).toBeDefined();
      expect(activeSignature?.parameters, message).toBeDefined();
      const activeParameter =
        activeSignature!.parameters![signatureHelpResult!.activeParameter!];
      const activeDocumentation = activeParameter?.documentation;
      expect(activeDocumentation, message).toBeTypeOf("object");
      assertType<MarkupContent>(activeDocumentation);
      expect(activeDocumentation.kind, message).toEqual("markdown");
      expect(activeDocumentation.value, message).toEqual(markdown);
    }
  }

  expectParameterIndexAt(label: string, index: number): void {
    const indices = this.getLabelPositions(label);

    for (const { uri, offset } of indices) {
      const signatureHelpResult = signatureHelpRequest(
        this.unit,
        UriUtils.toUri(uri),
        offset,
      );
      const message = `Expected parameter index for label "${label}" (${this.createLabelPositionMessage(label)})`;
      expect(signatureHelpResult, message).not.toBeNull();
      expect(signatureHelpResult!.activeParameter, message).toEqual(index);
    }
  }

  private createLabelPositionMessage(label: string): string {
    const { uri, offset } = this.getLabelPosition(label);
    return this.createPositionMessage(offset, uri);
  }

  private getLabelRanges(label: string): TestRange[] {
    const ranges = this.ranges[label];
    if (!ranges || ranges.length === 0) {
      throw new Error(`Label "${label}" not found`);
    }

    return ranges;
  }

  private getLabelPosition(label: string): TestIndex {
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

  /**
   * Builds the fake {@link Messages.GlobalConfig} from special test files:
   * `.vscode/settings.json` -> `workspace` scope, `user-settings.json` ->
   * `user` scope. Both may be present to test workspace-over-user precedence.
   */
  private extractGlobalConfig(): Messages.GlobalConfig {
    const pliPgmConf = "pli.pgm_conf";
    const pliProcGrps = "pli.proc_grps";
    const scopeFiles: Array<{
      suffix: string;
      scope: Messages.GlobalConfigScope;
    }> = [
      { suffix: "/.vscode/settings.json", scope: "workspace" },
      { suffix: "/user-settings.json", scope: "user" },
    ];
    const pgmConf: Messages.GlobalConfigEntry[] = [];
    const procGrps: Messages.GlobalConfigEntry[] = [];
    for (const [uri, file] of this.files) {
      const match = scopeFiles.find(
        ({ suffix }) => uri.endsWith(suffix) || uri === suffix.slice(1),
      );
      if (!match) {
        continue;
      }
      try {
        const config = JSON.parse(file.textDocument.getText());
        if (config && typeof config === "object") {
          if (pliPgmConf in config) {
            pgmConf.push({
              uri,
              configKey: pliPgmConf,
              containerPath: [],
              scope: match.scope,
            });
          }
          if (pliProcGrps in config) {
            procGrps.push({
              uri,
              configKey: pliProcGrps,
              containerPath: [],
              scope: match.scope,
            });
          }
        }
      } catch (e) {
        // Ignore JSON parsing errors
      }
    }
    return {
      pgmConf: pgmConf.length > 0 ? pgmConf : undefined,
      procGrps: procGrps.length > 0 ? procGrps : undefined,
    };
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
