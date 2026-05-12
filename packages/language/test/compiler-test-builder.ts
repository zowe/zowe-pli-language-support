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

import fs from "fs/promises";
import {
  FilePosition,
  fromParsedListFile,
  ListFile,
  File,
  Diagnostic as ListDiagnostic,
} from "./list-file";
import {
  createTestFiles,
  extractIndices,
  extractRanges,
  PliTestFile,
  TestFile,
  TestIndex,
  TestRange,
} from "./utils";
import { parseListFile } from "./list-file-parser";
import { UriUtils } from "../src/utils/uri";
import { tokenize } from "../src/parser/tokenizer";
import { isPLICode, PLICodes } from "../src/validation/pli-codes";
import { DiagnosticExpectation, Label } from "./test-builder";
import { fullCode, Severity } from "../src/language-server/types";

export class CompilerTestBuilder {
  private files: Map<string, TestFile> = new Map();
  private listing!: ListFile;
  private indices!: Record<string, TestIndex[]>;
  private ranges!: Record<string, TestRange[]>;

  private async init(files: PliTestFile[], outputDir: string): Promise<void> {
    // The path of the listing is always the path to the main .pli file but with a .list extension
    const first = files[0];
    const lastIndex = first.uri.lastIndexOf("/");
    const baseName =
      lastIndex >= 0 ? first.uri.slice(lastIndex + 1) : first.uri;
    const outputListing = `${outputDir}/${baseName}.list`;
    const listingContent = await fs.readFile(outputListing, "utf-8");
    const listFileContent = parseListFile(listingContent);
    this.listing = fromParsedListFile(listFileContent);
    this.files = createTestFiles(files);
    this.indices = extractIndices(this.files);
    this.ranges = extractRanges(this.files);
  }

  static async create(
    files: PliTestFile[],
    outputDir: string,
  ): Promise<CompilerTestBuilder> {
    const builder = new CompilerTestBuilder();
    await builder.init(files, outputDir);
    return builder;
  }

  expectTokens(tokens: string | string[]): void {
    let expectedTokens: string[] = [];
    if (Array.isArray(tokens)) {
      expectedTokens = tokens;
    } else {
      expectedTokens = tokenize(tokens, undefined).tokens.map((e) => e.image);
    }
    const actualTokens = tokenize(
      this.listing.sourceCode,
      undefined,
    ).tokens.map((t) => t.image);
    if (expectedTokens.length !== actualTokens.length) {
      throw new Error(
        `Expected ${expectedTokens.length} tokens, but got ${actualTokens.length}.`,
      );
    }
    for (let i = 0; i < expectedTokens.length; i++) {
      if (expectedTokens[i] !== actualTokens[i]) {
        throw new Error(
          `Token mismatch at index ${i}: expected '${expectedTokens[i]}', but got '${actualTokens[i]}'.`,
        );
      }
    }
  }

  expectLinks(): void {
    for (const [label, indices] of Object.entries(this.indices)) {
      for (const index of indices) {
        const position = this.deriveFilePosition(index.uri, index.offset);
        const ranges = this.ranges[label];
        if (!ranges || ranges.length === 0) {
          throw new Error(`No ranges found for label ${label}`);
        } else if (ranges.length > 1) {
          throw new Error(
            `Multiple ranges found for label ${label}, expected only one.`,
          );
        }
        const range = ranges[0];
        const target = this.deriveFilePosition(range.uri, range.start);
        this.expectLink(position, target);
      }
    }
  }

  private expectLink(position: FilePosition, target: FilePosition): void {
    const definition = this.listing.definitions.find(
      (def) =>
        // Either defined at the target position
        (def.position?.file.uri === target.file.uri &&
          def.position.line === target.line) ||
        // Or has a sets entry matching the target position (i.e. via an assignment)
        def.sets.some(
          (set) => set.file.uri === target.file.uri && set.line === target.line,
        ),
    );
    if (!definition) {
      console.warn(
        `No definition found in listing for target ${target.file.uri}:${target.line}. Potentially part of a factorized variable?`,
      );
      return;
    }
    // References can be either in the refs or sets of the definition,
    // since an assignment can link to a definition as well.
    // We check both.
    const ref = definition.refs.find(
      (ref) => ref.file.uri === position.file.uri && ref.line === position.line,
    );
    const set = definition.sets.find(
      (set) => set.file.uri === position.file.uri && set.line === position.line,
    );
    if (!ref && !set) {
      throw new Error(
        `Definition at ${position.file.uri}:${position.line} does not link to expected target ${target.file.uri}:${target.line}`,
      );
    }
  }

  private deriveFilePosition(uri: string, offset: number): FilePosition {
    const listingFile = this.findListingFile(uri);
    if (!listingFile) {
      throw new Error(`File with URI ${uri} not found in listing.`);
    }
    const sourceFile = this.files.get(uri);
    if (!sourceFile) {
      throw new Error(`File with URI ${uri} not found in source files.`);
    }
    const line = this.getLine(sourceFile, offset);
    return {
      file: listingFile,
      line,
    };
  }

  private getLine(sourceFile: TestFile, offset: number): number {
    return sourceFile.output.slice(0, offset).split("\n").length;
  }

  private findListingFile(uri: string): File | undefined {
    const index = uri.lastIndexOf("/");
    const baseName = index >= 0 ? uri.slice(index) : uri;
    return this.listing.files.find((f) =>
      UriUtils.normalize(f.uri).endsWith(baseName),
    );
  }

  noDiagnostics(): void {
    if (this.listing.diagnostics.length > 0) {
      const messages = this.generateDiagnosticsErrorMessage(
        this.listing.diagnostics,
      );
      throw new Error(`Expected no diagnostics, but got:\n${messages}`);
    }
  }

  expectDiagnosticsAt(label: Label, diagnostics: DiagnosticExpectation): void {
    if (Array.isArray(label)) {
      for (const l of label) {
        this.expectDiagnosticsAt(l, diagnostics);
      }
      return;
    }
    if (typeof label === "number") {
      label = label.toString();
    }
    const ranges = this.ranges[label];
    if (!ranges || ranges.length === 0) {
      throw new Error(`No range found for label ${label}`);
    } else if (ranges.length > 1) {
      throw new Error(
        `Multiple ranges found for label ${label}, expected only one.`,
      );
    }
    const range = ranges[0];
    const file = this.files.get(range.uri);
    if (!file) {
      throw new Error(`File with URI ${range.uri} not found in source files.`);
    }
    const line = this.getLine(file, range.start);
    const diagnosticsAtLine = this.listing.getDiagnostics(line);
    const diagnosticsArray = Array.isArray(diagnostics)
      ? diagnostics
      : [diagnostics];
    const expectedDiagnostics = diagnosticsArray.map((diag) => {
      if (isPLICode(diag)) {
        return { code: fullCode(diag) };
      }
      return diag;
    });
    if (diagnosticsAtLine.length !== expectedDiagnostics.length) {
      const messages = this.generateDiagnosticsErrorMessage(diagnosticsAtLine);
      throw new Error(
        `Expected ${expectedDiagnostics.length} diagnostics at label ${label}, but got ${diagnosticsAtLine.length}:\n${messages}`,
      );
    }
    for (const expected of expectedDiagnostics) {
      const match = diagnosticsAtLine.find((diag) => {
        // Compute the full code as the code plus severity
        const fullDiagCode = diag.code + Severity[diag.severity];
        if (expected.code && fullDiagCode !== expected.code) {
          return false;
        }
        if (expected.severity && diag.severity !== expected.severity) {
          return false;
        }
        if (
          expected.message &&
          (typeof expected.message === "string"
            ? diag.message === expected.message
            : expected.message.test(diag.message))
        ) {
          return false;
        }
        return true;
      });
      if (!match) {
        const messages =
          this.generateDiagnosticsErrorMessage(diagnosticsAtLine);
        throw new Error(
          `Expected diagnostic not found at label ${label}:\n${messages}`,
        );
      }
    }
  }

  noParserDiagnostics(): void {
    // A list of codes that are for the most part parser errors
    // The actual compiler does not differentiate between parser and other errors
    const parserCodes: string[] = [
      PLICodes.Error.IBM3552I.code,
      PLICodes.Error.IBM1352I.code,
      PLICodes.Severe.IBM3988I.code,
      PLICodes.Severe.IBM3986I.code,
      PLICodes.Severe.IBM3930I.code,
      PLICodes.Severe.IBM3809I.code,
      PLICodes.Severe.IBM3808I.code,
      PLICodes.Severe.IBM3807I.code,
      PLICodes.Severe.IBM3806I.code,
      PLICodes.Severe.IBM3805I.code,
      PLICodes.Severe.IBM3787I.code,
      PLICodes.Severe.IBM3786I.code,
      PLICodes.Severe.IBM3785I.code,
      PLICodes.Severe.IBM3784I.code,
      PLICodes.Severe.IBM3783I.code,
      PLICodes.Severe.IBM3782I.code,
      PLICodes.Severe.IBM3778I.code,
      PLICodes.Severe.IBM3759I.code,
      PLICodes.Severe.IBM3758I.code,
      PLICodes.Severe.IBM3757I.code,
      PLICodes.Severe.IBM3756I.code,
      PLICodes.Severe.IBM3755I.code,
      PLICodes.Severe.IBM3754I.code,
      PLICodes.Severe.IBM1618I.code,
      PLICodes.Error.IBM3509I.code,
      PLICodes.Error.IBM1473I.code,
    ];
    const parserDiagnostics = this.listing.diagnostics.filter((diag) =>
      parserCodes.includes(diag.code),
    );
    if (parserDiagnostics.length > 0) {
      const messages = this.generateDiagnosticsErrorMessage(parserDiagnostics);
      throw new Error(`Expected no parser diagnostics, but got:\n${messages}`);
    }
  }

  private generateDiagnosticsErrorMessage(
    diagnostics: ListDiagnostic[],
  ): string {
    return diagnostics
      .map(
        (msg) =>
          `${msg.code} at ${msg.position.file.uri}:${msg.position.line} - ${msg.message}`,
      )
      .join("\n");
  }
}
