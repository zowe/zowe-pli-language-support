import { ILexingResult } from "chevrotain";
import { ReferencesCache, resolveReferences } from "../linking/resolver";
import { iterateSymbols, SymbolTable } from "../linking/symbol-table";
import { PliParserInstance } from "../parser/parser";
import { LexerInstance } from "../parser/tokens";
import { SourceFile } from "./source-file";
import { CompilationUnit } from "./compilation-unit";
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

export function lifecycle(
  compilationUnit: CompilationUnit,
  text: string,
): void {
  console.time("tokenize");
  tokenize(compilationUnit, text);
  console.timeEnd("tokenize");
  console.time("parse");
  parse(compilationUnit);
  console.timeEnd("parse");
  console.time("symbolTable");
  generateSymbolTable(compilationUnit);
  link(compilationUnit);
  console.timeEnd("symbolTable");
  validate(sourceFile);
}

const lexer = new PliLexer();

export function tokenize(
  compilationUnit: CompilationUnit,
  text: string,
): LexerResult {
  const result = lexer.tokenize(text, compilationUnit.uri);
  compilationUnit.files = Object.keys(result.fileTokens).map((e) =>
    URI.parse(e),
  );
  compilationUnit.tokens.all = result.all;
  compilationUnit.tokens.fileTokens = result.fileTokens;
  compilationUnit.diagnostics.lexer = lexerErrorsToDiagnostics(result.errors);
  return result;
}

export function parse(compilationUnit: CompilationUnit): PliProgram {
  PliParserInstance.input = compilationUnit.tokens.all;
  const ast = PliParserInstance.PliProgram();
  compilationUnit.ast = ast;
  compilationUnit.diagnostics.parser = parserErrorsToDiagnostics(
    PliParserInstance.errors,
  );
  return ast;
}

export function generateSymbolTable(
  compilationUnit: CompilationUnit,
): SymbolTable {
  compilationUnit.references.clear();
  compilationUnit.symbols.clear();
  iterateSymbols(compilationUnit);
  return compilationUnit.symbols;
}

export function link(compilationUnit: CompilationUnit): ReferencesCache {
  resolveReferences(compilationUnit);
  compilationUnit.diagnostics.linking = linkingErrorsToDiagnostics(
    compilationUnit.references,
  );
  return compilationUnit.references;
}

/**
 * Performs semantic validations on the AST of the source file
 */
export function validate(sourceFile: SourceFile): void {
  generateValidationDiagnostics(sourceFile);
}
