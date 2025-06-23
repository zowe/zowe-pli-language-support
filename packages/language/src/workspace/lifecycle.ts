import { ReferencesCache, resolveReferences } from "../linking/resolver";
import { iterateSymbols } from "../linking/symbol-table";
import { PliParserInstance } from "../parser/parser";
import { CompilationUnit, createCompilationUnit } from "./compilation-unit";
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
import { Scope } from "../linking/scope";
import { Builtins, BuiltinsUri, BuiltinsUriSchema } from "./builtins";

const BuiltinFileStart = `${BuiltinsUriSchema}:/`;
const isBuiltinFile = (uri: URI) => uri.toString().startsWith(BuiltinFileStart);

export function lifecycle(
  compilationUnit: CompilationUnit,
  text: string,
): void {
  compilationUnit.references.clear();
  compilationUnit.scopeCaches.clear();
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
  const result = lexer.tokenize(compilationUnit, text, compilationUnit.uri);
  compilationUnit.files = Object.keys(result.fileTokens).map((e) =>
    URI.parse(e),
  );
  compilationUnit.tokens.all = result.all;
  compilationUnit.tokens.fileTokens = result.fileTokens;
  compilationUnit.preprocessorAst.statements = result.statements;
  compilationUnit.preprocessorEvaluationResults = result.evaluationResults;
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
  const ast = PliParserInstance.parse();
  compilationUnit.ast = ast;
  compilationUnit.diagnostics.parser = parserErrorsToDiagnostics(
    PliParserInstance.errors,
  );
  return ast;
}

let builtinsScope: Scope | undefined;

function loadBuiltinSymbolTable(): Scope {
  if (builtinsScope) {
    return builtinsScope;
  }
  const unit = createCompilationUnit(URI.parse(BuiltinsUri));
  tokenize(unit, Builtins);
  parse(unit);
  generateSymbolTable(unit);

  // Get the root scope of the builtins
  builtinsScope = unit.scopeCaches.regular.get(unit.ast)!;
  return builtinsScope;
}

export function generateSymbolTable(compilationUnit: CompilationUnit) {
  // Don't load the builtin symbol table for builtin files
  const rootScope = isBuiltinFile(compilationUnit.uri)
    ? undefined
    : loadBuiltinSymbolTable();

  // TODO: Add preprocessor scope for builtins?
  const rootPreprocessorScope = undefined;

  const symbolTableDiagnostics = iterateSymbols(compilationUnit, {
    rootScope,
    rootPreprocessorScope,
  });

  compilationUnit.diagnostics.symbolTable = symbolTableDiagnostics;
}

export function link(compilationUnit: CompilationUnit): ReferencesCache {
  const resolveDiagnostics = resolveReferences(compilationUnit);
  const linkingDiagnostics = linkingErrorsToDiagnostics(
    compilationUnit.references,
    compilationUnit.scopeCaches,
  );

  compilationUnit.diagnostics.linking = [
    ...resolveDiagnostics,
    ...linkingDiagnostics,
  ];

  return compilationUnit.references;
}

/**
 * Performs semantic validations on the AST of the compilation unit
 */
export function validate(compilationUnit: CompilationUnit): void {
  generateValidationDiagnostics(compilationUnit);
}
