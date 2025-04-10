import { ReferencesCache, resolveReferences } from "../linking/resolver";
import { iterateSymbols } from "../linking/symbol-table";
import { PliParserInstance } from "../parser/parser";
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
import { compilerOptionIssueToDiagnostics } from "../preprocessor/compiler-options/options";

export function lifecycle(
  compilationUnit: CompilationUnit,
  text: string,
): void {
  tokenize(compilationUnit, text);
  parse(compilationUnit);
  generateSymbolTable(compilationUnit);
  link(compilationUnit);
  validate(compilationUnit);
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
  compilationUnit.compilerOptions =
    result.compilerOptions.result?.options ?? {};
  const uri = compilationUnit.uri.toString();
  compilationUnit.diagnostics.lexer = lexerErrorsToDiagnostics(result.errors);
  compilationUnit.diagnostics.compilerOptions =
    result.compilerOptions.result?.issues.map((e) =>
      compilerOptionIssueToDiagnostics(e, uri),
    ) ?? [];
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

export function generateSymbolTable(compilationUnit: CompilationUnit) {
  compilationUnit.references.clear();
  compilationUnit.scopeCache.clear();
  iterateSymbols(compilationUnit);
}

export function link(compilationUnit: CompilationUnit): ReferencesCache {
  resolveReferences(compilationUnit);
  compilationUnit.diagnostics.linking = linkingErrorsToDiagnostics(
    compilationUnit.references,
  );
  return compilationUnit.references;
}

/**
 * Performs semantic validations on the AST of the compilation unit
 */
export function validate(compilationUnit: CompilationUnit): void {
  generateValidationDiagnostics(compilationUnit);
}
