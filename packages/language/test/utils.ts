import { expect } from "vitest";
import { URI } from "vscode-uri";
import { Diagnostic } from "../src/language-server/types";
import * as lifecycle from "../src/workspace/lifecycle";
import { SourceFile, collectDiagnostics, createSourceFile } from "../src/workspace/source-file";

export function assertNoParseErrors(sourceFile: SourceFile) {
  expect(sourceFile.diagnostics.lexer).toHaveLength(0);
  expect(sourceFile.diagnostics.parser).toHaveLength(0);
}

/**
 * Asserts the absence of linking errors in the given source file
 */
export function assertNoLinkingErrors(sourceFile: SourceFile) {
  expect(sourceFile.diagnostics.linking).toHaveLength(0);
}

/**
 * Asserts the absence of validation errors in the given source file
 */
export function assertNoValidationErrors(sourceFile: SourceFile) {
  expect(sourceFile.diagnostics.validation).toHaveLength(0);
}

/**
 * Asserts the absence of all diagnostics in the given source file
 */
export function assertNoDiagnostics(sourceFile: SourceFile) {
  assertNoParseErrors(sourceFile);
  assertNoLinkingErrors(sourceFile);
  assertNoValidationErrors(sourceFile);
}

export function assertDiagnostic(sourceFile: SourceFile, diagnostic: Partial<Diagnostic>) {
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
export function parse(text: string, options?: { validate: boolean}): SourceFile {
  const sourceFile = createSourceFile(URI.file("test.pli"));
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
export function parseStmts(text: string): SourceFile {
  return parse(` STARTPR: PROCEDURE OPTIONS (MAIN);
${text}
 end STARTPR;`);
}
