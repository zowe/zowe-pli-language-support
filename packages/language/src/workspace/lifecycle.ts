import { ILexingResult } from "chevrotain";
import { SourceFile } from "./source-file";
import { LexerInstance } from "../parser/tokens";
import { PliProgram } from "../syntax-tree/ast";
import { PliParserInstance } from "../parser/parser";
import { iterateSymbols, SymbolTable } from "../linking/symbol-table";
import { ReferencesCache, resolveReferences } from "../linking/resolver";
import {
  lexerErrorsToDiagnostics,
  linkingErrorsToDiagnostics,
  parserErrorsToDiagnostics,
} from "../validation/validator";

export function lifecycle(sourceFile: SourceFile, text: string): void {
  tokenize(sourceFile, text);
  parse(sourceFile);
  generateSymbolTable(sourceFile);
  link(sourceFile);
}

export function tokenize(sourceFile: SourceFile, text: string): ILexingResult {
  const result = LexerInstance.tokenize(adjustMargins(text));
  sourceFile.tokens = result.tokens;
  sourceFile.diagnostics.lexer = lexerErrorsToDiagnostics(result.errors);
  return result;
}

// TODO: use margins processor later on
function adjustMargins(text: string): string {
  const lines = splitLines(text);
  const adjustedLines = lines.map((line) => adjustLine(line));
  const adjustedText = adjustedLines.join("");
  return adjustedText;
}

const NEWLINE = "\n".charCodeAt(0);

function splitLines(text: string): string[] {
  const lines: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const start = i;
    while (i < text.length && text.charCodeAt(i) !== NEWLINE) {
      i++;
    }
    lines.push(text.substring(start, i + 1));
  }
  return lines;
}

const start = 1;
const end = 72;

function adjustLine(line: string): string {
  let eol = "";
  if (line.endsWith("\r\n")) {
    eol = "\r\n";
  } else if (line.endsWith("\n")) {
    eol = "\n";
  }
  const prefixLength = start;
  const lineLength = line.length - eol.length;
  if (lineLength < prefixLength) {
    return " ".repeat(lineLength) + eol;
  }
  const lineEnd = end;
  const prefix = " ".repeat(prefixLength);
  let postfix = "";
  if (lineLength > lineEnd) {
    postfix = " ".repeat(lineLength - lineEnd);
  }
  return (
    prefix +
    line.substring(prefixLength, Math.min(lineEnd, lineLength)) +
    postfix +
    eol
  );
}

export function parse(sourceFile: SourceFile): PliProgram {
  PliParserInstance.input = sourceFile.tokens;
  const ast = PliParserInstance.PliProgram();
  sourceFile.ast = ast;
  sourceFile.diagnostics.parser = parserErrorsToDiagnostics(
    PliParserInstance.errors,
  );
  return ast;
}

export function generateSymbolTable(sourceFile: SourceFile): SymbolTable {
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

// TODO: add semantic validation phase
// export function validate(sourceFile: SourceFile): Diagnostic[] {
//     sourceFile.diagnostics = collectCommonDiagnostics(sourceFile, LexerInstance.errors, PliParserInstance.errors);
// }
