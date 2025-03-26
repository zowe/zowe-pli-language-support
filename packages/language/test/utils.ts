import { expect } from "vitest";
import { SourceFile, createSourceFile } from "../src/workspace/source-file";
import * as lifecycle from "../src/workspace/lifecycle";
import { URI } from "vscode-uri";

export function assertNoParseErrors(sourceFile: SourceFile) {
  expect(sourceFile.diagnostics.lexer).toHaveLength(0);
  expect(sourceFile.diagnostics.parser).toHaveLength(0);
}

export function parse(text: string): SourceFile {
  const sourceFile = createSourceFile(URI.file("test.pli"));
  lifecycle.tokenize(sourceFile, text);
  lifecycle.parse(sourceFile);
  assertNoParseErrors(sourceFile);
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
