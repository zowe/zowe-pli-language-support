import { ILexingResult } from "chevrotain";
import { ReferencesCache, resolveReferences } from "../linking/resolver";
import { iterateSymbols, SymbolTable } from "../linking/symbol-table";
import { PliParserInstance } from "../parser/parser";
import { LexerInstance } from "../parser/tokens";
import { SourceFile } from "./source-file";
import { PliProgram } from "../syntax-tree/ast";
import {
  generateValidationDiagnostics,
  lexerErrorsToDiagnostics,
  linkingErrorsToDiagnostics,
  parserErrorsToDiagnostics,
} from "../validation/validator";
import { LexerResult, PliLexer } from "../preprocessor/pli-lexer";
import { URI } from "../utils/uri";
import { SourceFile } from "./source-file";

export function lifecycle(sourceFile: SourceFile, text: string): void {
  console.time("tokenize");
  tokenize(sourceFile, text);
  console.timeEnd("tokenize");
  console.time("parse");
  parse(sourceFile);
  console.timeEnd("parse");
  console.time("symbolTable");
  generateSymbolTable(sourceFile);
  link(sourceFile);
  console.timeEnd("symbolTable");
  validate(sourceFile);
}

const lexer = new PliLexer();

export function tokenize(sourceFile: SourceFile, text: string): LexerResult {
  const result = lexer.tokenize(text, sourceFile.uri);
  sourceFile.files = Object.keys(result.fileTokens).map((e) => URI.parse(e));
  sourceFile.tokens.all = result.all;
  sourceFile.tokens.fileTokens = result.fileTokens;
  sourceFile.diagnostics.lexer = lexerErrorsToDiagnostics(result.errors);
  return result;
}

export function parse(sourceFile: SourceFile): PliProgram {
  PliParserInstance.input = sourceFile.tokens.all;
  const ast = PliParserInstance.PliProgram();
  sourceFile.ast = ast;
  sourceFile.diagnostics.parser = parserErrorsToDiagnostics(
    PliParserInstance.errors,
  );
  return ast;
}

export function generateSymbolTable(sourceFile: SourceFile): SymbolTable {
  sourceFile.references.clear();
  sourceFile.symbols.clear();
  iterateSymbols(sourceFile);
  return sourceFile.symbols;
}

export function link(sourceFile: SourceFile): ReferencesCache {
  resolveReferences(sourceFile);
  sourceFile.diagnostics.linking = linkingErrorsToDiagnostics(
    sourceFile.references,
  );
  return sourceFile.references;
}

/**
 * Performs semantic validations on the AST of the source file
 */
export function validate(sourceFile: SourceFile): void {
  generateValidationDiagnostics(sourceFile);
}
