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

import path from "path";
import fs from "fs/promises";
import {
  FilePosition,
  fromParsedListFile,
  ListFile,
  File,
  Diagnostic as ListDiagnostic,
} from "./list-file";
import { PliTestFile } from "./utils";
import { parseListFile } from "./list-file-parser";
import { UriUtils } from "../src/utils/uri";
import { tokenize } from "../src/parser/tokenizer";
import { PLICodes } from "../src/validation/pli-codes";
import { Severity } from "../src/language-server/types";
import {
  AbstractTestBuilder,
  DiagnosticExpectation,
  DiagnosticLike,
  Label,
} from "./abstract-test-builder";

export class CompilerTestBuilder extends AbstractTestBuilder {
  private listing!: ListFile;

  private async init(files: PliTestFile[], outputDir: string): Promise<void> {
    // The path of the listing is always the path to the main .pli file but with a .list extension
    const first = files[0];
    const lastIndex = first.uri.lastIndexOf("/");
    const baseName =
      lastIndex >= 0 ? first.uri.slice(lastIndex + 1) : first.uri;
    const outputListing = path.join(outputDir, `${baseName}.list`);
    const listingContent = await fs.readFile(outputListing, "utf-8");
    const listFileContent = parseListFile(listingContent);
    this.listing = fromParsedListFile(listFileContent);
    this.initMarkerState(files);
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
      const expectedPreview = expectedTokens.join(" ");
      const actualPreview = actualTokens.join(" ");
      throw new Error(
        `Expected ${expectedTokens.length} tokens, but got ${actualTokens.length}.\nExpected: ${expectedPreview}\nActual: ${actualPreview}`,
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
        const range = this.resolveSingleRange(label);
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
    return {
      file: listingFile,
      line: this.offsetToLine(sourceFile, offset),
    };
  }

  private findListingFile(uri: string): File | undefined {
    const index = uri.lastIndexOf("/");
    // Includes the leading slash to avoid collisions with files that have the same suffix
    const baseName = index >= 0 ? uri.slice(index) : uri;
    return this.listing.files.find((f) =>
      UriUtils.normalize(f.uri).endsWith(baseName),
    );
  }

  noDiagnostics(): void {
    if (this.listing.diagnostics.length > 0) {
      const messages = this.formatDiagnostics(this.listing.diagnostics);
      throw new Error(`Expected no diagnostics, but got:\n${messages}`);
    }
  }

  expectNoDiagnosticsFrom(...languages: string[]): void {
    const diagnosticsFromLanguages = this.listing.diagnostics;
    if (diagnosticsFromLanguages.length > 0) {
      const messages = this.formatDiagnostics(diagnosticsFromLanguages);
      throw new Error(
        `Expected no diagnostics from languages ${languages.join(
          ", ",
        )}, but got:\n${messages}`,
      );
    }
  }

  expectDiagnosticsAt(label: Label, diagnostics: DiagnosticExpectation): void {
    const expectedArray = Array.isArray(diagnostics)
      ? diagnostics
      : [diagnostics];

    this.forEachLabel(label, (l) => {
      const range = this.resolveSingleRange(l);
      const file = this.files.get(range.uri);
      if (!file) {
        throw new Error(
          `File with URI ${range.uri} not found in source files.`,
        );
      }
      const line = this.offsetToLine(file, range.start);
      const actual = this.listing.getDiagnostics(line).map(toDiagnosticLike);

      if (actual.length !== expectedArray.length) {
        const messages = this.formatDiagnostics(
          this.listing.getDiagnostics(line),
        );
        throw new Error(
          `Expected ${expectedArray.length} diagnostics at label ${l}, but got ${actual.length}:\n${messages}`,
        );
      }

      for (const expected of expectedArray) {
        const match = actual.some((a) =>
          this.diagnosticMatchesExpectation(a, expected),
        );
        if (!match) {
          const messages = this.formatDiagnostics(
            this.listing.getDiagnostics(line),
          );
          throw new Error(
            `Expected diagnostic not found at label ${l}: ${this.formatExpectedDiagnostic(expected)}\nActual:\n${messages}`,
          );
        }
      }
    });
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
      const messages = this.formatDiagnostics(parserDiagnostics);
      throw new Error(`Expected no parser diagnostics, but got:\n${messages}`);
    }
  }

  private formatDiagnostics(diagnostics: ListDiagnostic[]): string {
    return diagnostics
      .map(
        (msg) =>
          `${msg.code} at ${msg.position.file.uri}:${msg.position.line} - ${msg.message}`,
      )
      .join("\n");
  }
}

/**
 * Adapt a listing diagnostic to the structural shape consumed by the shared matcher.
 * The compiler doesn't distinguish severity in the diagnostic code itself, so we
 * synthesize the full code (`code + Severity`) the way fourslash tests express it.
 */
function toDiagnosticLike(diag: ListDiagnostic): DiagnosticLike {
  return {
    code: diag.code + Severity[diag.severity],
    severity: diag.severity,
    message: diag.message,
  };
}
