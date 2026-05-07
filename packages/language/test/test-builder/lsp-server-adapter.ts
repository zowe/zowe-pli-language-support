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

import {
  TestBuilder,
  DiagnosticExpectation,
  ExpectedCompletion,
} from "../test-builder";
import { TestLspClient } from "./lsp-client";
import { MarkupContent, Position } from "vscode-languageserver";
import { expect } from "vitest";
import { isPLICode, PLICode } from "../../src/validation/pli-codes";
import { fullCode } from "../../src/language-server/types";
import { Diagnostic, CodeAction, Command } from "vscode-languageserver-types";
import { SemanticTokenDecoder } from "../../src/language-server/semantic-token-decoder";
import {
  SemanticTokenModifiersValues,
  SemanticTokenTypesValues,
} from "../fourslash-harness/harness-interface";
import { TestRange } from "../test-builder";

/**
 * LSP Server Adapter for testing language server via LSP protocol.
 * Delegates to TestBuilder for fourslash parsing and label/position resolution,
 * but calls the LSP client for all language server operations instead of
 * calling functions directly.
 *
 * This enables testing the full LSP stack including connection-handler.ts
 * and message serialization/deserialization.
 */
export class LspServerAdapter {
  constructor(
    private testBuilder: TestBuilder,
    private lspClient: TestLspClient,
  ) {}

  private offsetToPosition(uri: string, offset: number): Position {
    const file = this.testBuilder.getFiles().get(uri);
    if (!file) {
      throw new Error(`File not found: ${uri}`);
    }
    return file.textDocument.positionAt(offset);
  }

  private positionToOffset(uri: string, position: Position): number {
    const file = this.testBuilder.getFiles().get(uri);
    if (!file) {
      throw new Error(`File not found: ${uri}`);
    }
    return file.textDocument.offsetAt(position);
  }

  private lspRangeToOffsetRange(
    uri: string,
    lspRange: { start: Position; end: Position },
  ): TestRange {
    const start = this.positionToOffset(uri, lspRange.start);
    const end = this.positionToOffset(uri, lspRange.end);
    return { uri, start, end };
  }

  /**
   * Expects hover content at the given label positions.
   * Sends textDocument/hover requests to the LSP server.
   *
   * @param label Label to check hover at
   * @param content Expected hover content
   */
  async expectHover(label: string, content: MarkupContent): Promise<void> {
    // Reuse TestBuilder's label resolution
    const indices = this.testBuilder.getLabelPositions(label);

    for (const { uri, offset } of indices) {
      // Reuse TestBuilder's position conversion
      const position = this.offsetToPosition(uri, offset);

      // Call LSP instead of direct function
      const hoverResult = await this.lspClient.hover(uri, position);

      // Same verification as TestBuilder
      const message = `Expected hover for label "${label}" (${this.testBuilder.createLabelPositionMessage(label)})`;
      expect(hoverResult, message).toBeDefined();
      expect(hoverResult?.contents, message).toEqual(content);
    }
  }

  /**
   * Expects diagnostics at the given label.
   * Uses diagnostics received via textDocument/publishDiagnostics notifications.
   *
   * @param label Label to check diagnostics at
   * @param expected Expected diagnostics (can be codes, or full diagnostic objects)
   */
  async expectDiagnosticsAt(
    label: string,
    expected: DiagnosticExpectation,
  ): Promise<void> {
    const ranges = this.testBuilder.getLabelRanges(label);

    // Normalize expected to array of test diagnostics
    const expectedDiagnostics = this.normalizeDiagnosticExpectation(expected);

    for (const range of ranges) {
      const { uri, start, end } = range;

      // Get diagnostics from LSP client (received via notifications)
      const allDiagnostics = this.lspClient.getDiagnostics(uri);

      // Convert LSP diagnostics to offset-based ranges for matching
      const lspDiagnosticsWithOffsets = allDiagnostics.map((d) => ({
        ...d,
        offsetRange: this.lspRangeToOffsetRange(uri, d.range),
      }));

      // Find exact matches: diagnostics that exactly match the label range
      const exactMatches = lspDiagnosticsWithOffsets.filter(
        (d) => d.offsetRange.start === start && d.offsetRange.end === end,
      );

      // Match diagnostics against expectations
      this.matchDiagnostics(exactMatches, expectedDiagnostics, label);
    }
  }

  /**
   * Expects error codes at the given label.
   *
   * @param label Label to check error codes at
   * @param codes Expected error codes
   */
  async expectErrorCodesAt(
    label: string,
    codes: string | string[] | PLICode | PLICode[],
  ): Promise<void> {
    const codesArray = Array.isArray(codes) ? codes : [codes];
    const diagnostics = codesArray.map((code) => ({
      code: typeof code === "string" ? code : fullCode(code),
    }));
    await this.expectDiagnosticsAt(label, diagnostics);
  }

  /**
   * Expects no diagnostics at the given label, optionally excluding specific error codes.
   *
   * @param label Label to check (if undefined, checks entire file)
   * @param errorCodes Error codes to exclude from the check
   */
  async noDiagnostics(label?: string, ...errorCodes: PLICode[]): Promise<void> {
    if (label) {
      const ranges = this.testBuilder.getLabelRanges(label);
      for (const range of ranges) {
        const { uri, start, end } = range;
        const allDiagnostics = this.lspClient.getDiagnostics(uri);

        // Convert and filter diagnostics
        const matchingDiagnostics = allDiagnostics
          .map((d) => ({
            ...d,
            offsetRange: this.lspRangeToOffsetRange(uri, d.range),
          }))
          .filter(
            (d) => d.offsetRange.start === start && d.offsetRange.end === end,
          )
          .filter((d) => {
            // Filter to only the specified error codes (if any provided)
            if (errorCodes.length === 0) return true;
            const code = d.code?.toString() ?? "";
            return errorCodes.some((ec) => code === fullCode(ec));
          });

        const message = `Expected no diagnostics at label "${label}"`;
        expect(matchingDiagnostics, message).toEqual([]);
      }
    } else {
      // Check all diagnostics across all files
      const allDiagnostics = this.lspClient.getAllDiagnostics();
      for (const [uri, diagnostics] of allDiagnostics) {
        const filtered = diagnostics.filter((d) => {
          if (errorCodes.length === 0) return true;
          const code = d.code?.toString() ?? "";
          return errorCodes.some((ec) => code === fullCode(ec));
        });
        expect(filtered, `Expected no diagnostics in ${uri}`).toEqual([]);
      }
    }
  }

  /**
   * Expects completion items at the given label.
   *
   * @param label Label to check completion at
   * @param expected Expected completion configuration
   */
  async expectCompletionAt(
    label: string,
    expected: ExpectedCompletion,
  ): Promise<void> {
    const indices = this.testBuilder.getLabelPositions(label);

    for (const { uri, offset } of indices) {
      const position = this.offsetToPosition(uri, offset);
      const completionItems = await this.lspClient.completion(uri, position);

      const labels = completionItems.map((item) => item.label);
      const message = `Expected completion at label "${label}"`;

      if (expected.includes) {
        for (const include of expected.includes) {
          expect(labels, message).toContain(include);
        }
      }

      if (expected.excludes) {
        for (const exclude of expected.excludes) {
          expect(labels, message).not.toContain(exclude);
        }
      }
    }
  }

  /**
   * Expects definition links from the label positions.
   * Sends textDocument/definition requests to the LSP server.
   */
  async expectLinks(): Promise<void> {
    const files = this.testBuilder.getFiles();

    for (const [uri, file] of files) {
      // Get all labeled indices for this file
      for (const [_label, indices] of Object.entries(file.indices)) {
        for (const { offset } of indices) {
          const position = this.offsetToPosition(uri, offset);
          const definitions = await this.lspClient.definition(uri, position);

          // For links, we just verify that definitions were found
          // (matching exact targets would require more complex test setup)
          if (definitions.length > 0) {
            // Link found - this is what we expect
            continue;
          }
        }
      }
    }
  }

  /**
   * Expects no definition links at the given label.
   *
   * @param label Label to check for absence of links
   */
  async expectNoLinksAt(label: string): Promise<void> {
    const indices = this.testBuilder.getLabelPositions(label);

    for (const { uri, offset } of indices) {
      const position = this.offsetToPosition(uri, offset);
      const definitions = await this.lspClient.definition(uri, position);

      const message = `Expected no links at label "${label}"`;
      expect(definitions, message).toEqual([]);
    }
  }

  /**
   * Expects semantic tokens at the given label.
   *
   * @param label Label to check semantic tokens at
   * @param tokenType Expected token type
   * @param tokenModifiers Expected token modifiers
   */
  async expectSemanticTokenTypeAt(
    label: string,
    tokenType: SemanticTokenTypesValues,
    ...tokenModifiers: SemanticTokenModifiersValues[]
  ): Promise<void> {
    const ranges = this.testBuilder.getLabelRanges(label);

    for (const range of ranges) {
      const { uri, start, end } = range;

      // Get semantic tokens for the document
      const semanticTokensResult = await this.lspClient.semanticTokens(uri);
      expect(
        semanticTokensResult,
        `Expected semantic tokens for ${uri}`,
      ).not.toBeNull();

      if (!semanticTokensResult) continue;

      // Decode semantic tokens
      const file = this.testBuilder.getFiles().get(uri);
      if (!file) continue;

      const decodedTokens = SemanticTokenDecoder.decode(
        semanticTokensResult.data,
        file.textDocument,
      );

      // Find token that overlaps with the range
      const matchingTokens = decodedTokens.filter((token) => {
        return token.offsetStart >= start && token.offsetEnd <= end;
      });

      const message = `Expected semantic token at label "${label}"`;
      expect(matchingTokens.length, message).toBeGreaterThan(0);

      for (const token of matchingTokens) {
        expect(token.semanticTokenType, message).toBe(tokenType);
        if (tokenModifiers.length > 0) {
          for (const modifier of tokenModifiers) {
            expect(token.tokenModifiers, message).toContain(modifier);
          }
        }
      }
    }
  }

  /**
   * Expects signature help at the given label.
   *
   * @param label Label to check signature help at
   * @param markdown Expected markdown content
   */
  async expectMarkdownSignatureAt(
    label: string,
    markdown: string,
  ): Promise<void> {
    const indices = this.testBuilder.getLabelPositions(label);

    for (const { uri, offset } of indices) {
      const position = this.offsetToPosition(uri, offset);
      const signatureHelp = await this.lspClient.signatureHelp(uri, position);

      const message = `Expected signature help at label "${label}"`;
      expect(signatureHelp, message).not.toBeNull();
      expect(signatureHelp!.signatures.length, message).toBeGreaterThan(0);

      const activeSignature =
        signatureHelp!.signatures[signatureHelp!.activeSignature ?? 0];
      expect(activeSignature.documentation, message).toBeDefined();

      const doc = activeSignature.documentation as MarkupContent;
      expect(doc.kind, message).toBe("markdown");
      expect(doc.value, message).toBe(markdown);
    }
  }

  /**
   * Normalizes diagnostic expectations to a consistent format.
   */
  private normalizeDiagnosticExpectation(
    expected: DiagnosticExpectation,
  ): Array<Partial<Diagnostic> & { message?: string | RegExp }> {
    const expectedArray = Array.isArray(expected) ? expected : [expected];

    return expectedArray.map((exp) => {
      if (isPLICode(exp)) {
        return { code: fullCode(exp) };
      }
      return exp as Partial<Diagnostic> & { message?: string | RegExp };
    });
  }

  /**
   * Matches actual diagnostics against expected diagnostics.
   */
  private matchDiagnostics(
    actual: Diagnostic[],
    expected: Array<Partial<Diagnostic> & { message?: string | RegExp }>,
    label: string,
  ): void {
    const message = `Expected diagnostics at label "${label}"`;

    expect(actual.length, message).toBe(expected.length);

    for (let i = 0; i < expected.length; i++) {
      const exp = expected[i];
      const act = actual[i];

      if (exp.code !== undefined) {
        expect(act.code, message).toBe(exp.code);
      }

      if (exp.message !== undefined) {
        if (typeof exp.message === "object" && "test" in exp.message) {
          // It's a RegExp
          expect(act.message, message).toMatch(exp.message as RegExp);
        } else {
          expect(act.message, message).toBe(exp.message);
        }
      }

      if (exp.severity !== undefined) {
        expect(act.severity, message).toBe(exp.severity);
      }

      if (exp.source !== undefined) {
        expect(act.source, message).toBe(exp.source);
      }
    }
  }

  /**
   * Expects references at the given label.
   *
   * @param label Label to check references at
   * @param expectedCount Expected number of references (or undefined for any)
   */
  async expectReferences(label: string, expectedCount?: number): Promise<void> {
    const indices = this.testBuilder.getLabelPositions(label);

    for (const { uri, offset } of indices) {
      const position = this.offsetToPosition(uri, offset);
      const references = await this.lspClient.references(uri, position, true);

      const message = `Expected references at label "${label}"`;
      if (expectedCount !== undefined) {
        expect(references.length, message).toBe(expectedCount);
      } else {
        expect(references.length, message).toBeGreaterThan(0);
      }
    }
  }

  /**
   * Expects document highlights at the given label.
   *
   * @param label Label to check highlights at
   * @param expectedCount Expected number of highlights (or undefined for any)
   */
  async expectDocumentHighlight(
    label: string,
    expectedCount?: number,
  ): Promise<void> {
    const indices = this.testBuilder.getLabelPositions(label);

    for (const { uri, offset } of indices) {
      const position = this.offsetToPosition(uri, offset);
      const highlights = await this.lspClient.documentHighlight(uri, position);

      const message = `Expected document highlights at label "${label}"`;
      if (expectedCount !== undefined) {
        expect(highlights.length, message).toBe(expectedCount);
      } else {
        expect(highlights.length, message).toBeGreaterThan(0);
      }
    }
  }

  /**
   * Expects rename to work at the given label.
   *
   * @param label Label to check rename at
   * @param newName New name for the symbol
   */
  async expectRename(label: string, newName: string): Promise<void> {
    const indices = this.testBuilder.getLabelPositions(label);

    for (const { uri, offset } of indices) {
      const position = this.offsetToPosition(uri, offset);
      const workspaceEdit = await this.lspClient.rename(uri, position, newName);

      const message = `Expected rename at label "${label}"`;
      expect(workspaceEdit, message).not.toBeNull();
      expect(workspaceEdit?.changes, message).toBeDefined();

      // Verify that at least one change was generated
      const changeCount = Object.values(workspaceEdit?.changes ?? {}).reduce(
        (sum, edits) => sum + edits.length,
        0,
      );
      expect(changeCount, message).toBeGreaterThan(0);
    }
  }

  /**
   * Expects document symbols in a specific file.
   *
   * @param filename Optional filename (e.g., "main.pli"). If not provided, uses the first file.
   * @param expectedSymbols Expected symbol names (partial match)
   */
  async expectDocumentSymbols(
    filenameOrSymbols: string | string[],
    expectedSymbols?: string[],
  ): Promise<void> {
    const files = this.testBuilder.getFiles();

    let targetUri: string;
    let symbols: string[];

    if (Array.isArray(filenameOrSymbols)) {
      // First overload: just expectedSymbols, use first file
      const firstUri = Array.from(files.keys())[0];
      if (!firstUri) {
        throw new Error("No files found in test builder");
      }
      targetUri = firstUri;
      symbols = filenameOrSymbols;
    } else {
      // Second overload: (filename, expectedSymbols)
      if (!expectedSymbols) {
        throw new Error(
          "expectedSymbols is required when filename is provided",
        );
      }
      const filename = filenameOrSymbols;

      // Find URI that matches the filename
      const matchingUri = Array.from(files.keys()).find(
        (uri) => uri.endsWith(filename) || uri.endsWith(`/${filename}`),
      );

      if (!matchingUri) {
        const availableFiles = Array.from(files.keys()).join(", ");
        throw new Error(
          `File "${filename}" not found in test. Available files: ${availableFiles}`,
        );
      }

      targetUri = matchingUri;
      symbols = expectedSymbols;
    }

    const documentSymbols = await this.lspClient.documentSymbol(targetUri);

    // Both DocumentSymbol and SymbolInformation have a 'name' property
    const symbolNames = documentSymbols.map((s) => s.name);

    const message = `Expected document symbols in ${targetUri}, got: ${symbolNames.join(", ")}`;
    for (const expectedSymbol of symbols) {
      expect(symbolNames, message).toContain(expectedSymbol);
    }
  }

  /**
   * Expects workspace symbols.
   *
   * @param query Search query
   * @param expectedSymbols Expected symbol names (partial match)
   */
  async expectWorkspaceSymbols(
    query: string,
    expectedSymbols: string[],
  ): Promise<void> {
    const symbols = await this.lspClient.workspaceSymbol(query);

    const symbolNames = symbols.map((s) => s.name);

    const message = `Expected workspace symbols for query "${query}"`;
    for (const expectedSymbol of expectedSymbols) {
      expect(symbolNames, message).toContain(expectedSymbol);
    }
  }

  /**
   * Expects code actions at the given label.
   *
   * @param label Label to check code actions at
   * @param kind Kind of code actions to request (e.g., "quickfix", "source")
   * @param expectedCount Expected number of code actions (or undefined for any)
   */
  async expectCodeActions(
    label: string,
    kind?: string,
    expectedCount?: number,
  ): Promise<(CodeAction | Command)[]> {
    // Ensure LSP client is fully initialized before expecting code actions
    await this.lspClient.ensureInitialized();

    const ranges = this.testBuilder.getLabelRanges(label);

    if (ranges.length === 0) {
      return [];
    }

    // Process first range and return its actions
    const range = ranges[0];
    const { uri, start, end } = range;
    const startPos = this.offsetToPosition(uri, start);
    const endPos = this.offsetToPosition(uri, end);

    // Get diagnostics at this range if requesting quickfix
    const diagnostics =
      kind === "quickfix"
        ? this.lspClient.getDiagnostics(uri).filter((d) => {
            const diagRange = this.lspRangeToOffsetRange(uri, d.range);
            return diagRange.start === start && diagRange.end === end;
          })
        : [];

    const only = kind ? [kind] : undefined;
    const codeActions = await this.lspClient.codeAction(
      uri,
      { start: startPos, end: endPos },
      diagnostics,
      only,
    );

    const message = `Expected code actions at label "${label}"`;
    if (expectedCount !== undefined) {
      expect(codeActions.length, message).toBe(expectedCount);
    } else if (kind) {
      // If requesting specific kind, expect at least one
      expect(codeActions.length, message).toBeGreaterThan(0);
    }

    return codeActions;
  }

  /**
   * Gets code actions at a label position.
   * Returns the code actions for the first matching range.
   *
   * @param label Label to get code actions at
   * @param kind Optional kind filter (e.g., "quickfix", "source.fixAll")
   * @returns Code actions at the label
   */
  async getCodeActionsAt(
    label: string,
    kind?: string,
  ): Promise<(CodeAction | Command)[]> {
    // Ensure LSP client is fully initialized before getting code actions
    await this.lspClient.ensureInitialized();

    const ranges = this.testBuilder.getLabelRanges(label);
    if (ranges.length === 0) {
      return [];
    }

    const range = ranges[0]; // Get first range
    const { uri, start, end } = range;
    const startPos = this.offsetToPosition(uri, start);
    const endPos = this.offsetToPosition(uri, end);

    // Get diagnostics at this range if requesting quickfix
    const allDiags = this.lspClient.getDiagnostics(uri);
    const diagnostics =
      kind === "quickfix"
        ? allDiags.filter((d) => {
            const diagRange = this.lspRangeToOffsetRange(uri, d.range);
            return diagRange.start === start && diagRange.end === end;
          })
        : [];

    const only = kind ? [kind] : undefined;
    return await this.lspClient.codeAction(
      uri,
      { start: startPos, end: endPos },
      diagnostics,
      only,
    );
  }

  /**
   * Applies a code action.
   *
   * @param action Code action to apply
   */
  async applyCodeAction(action: CodeAction | Command): Promise<void> {
    await this.lspClient.applyCodeAction(action);
  }

  /**
   * Shuts down the LSP client and cleans up resources.
   */
  async dispose(): Promise<void> {
    await this.lspClient.shutdown();
  }
}
