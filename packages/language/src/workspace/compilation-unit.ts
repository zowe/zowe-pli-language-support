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

import { PliProgram, SyntaxKind } from "../syntax-tree/ast.js";
import { URI } from "../utils/uri.js";
import { Connection } from "vscode-languageserver";
import { ReferencesCache, StatementOrderCache } from "../linking/resolver.js";
import { Diagnostic, diagnosticsToLSP } from "../language-server/types.js";
import {
  generateSymbolTable,
  lifecycle,
  parse,
  tokenize,
} from "./lifecycle.js";
import { CompilerOptions } from "../preprocessor/compiler-options/options.js";
import { skippedCode } from "../language-server/skipped-code.js";
import { EvaluationResults } from "../preprocessor/pli-preprocessor-interpreter-state.js";
import { marginIndicator } from "../language-server/margin-indicator.js";
import { createLSRequestCaches, LSRequestCache } from "../utils/cache.js";
import { Scope, ScopeCacheGroups } from "../linking/scope.js";
import { Token } from "../parser/tokens.js";
import {
  EditorDocuments,
  TextDocuments,
} from "../language-server/text-documents.js";
import { Builtins, BuiltinsUri, BuiltinsUriSchema } from "./builtins.js";

/**
 * A compilation unit is a representation of a PL/I program in the language server.
 * It contains all information about the program.
 *
 * Note that the compilation unit is not a representation of the file on disk, but rather
 * a representation of the file once all of its macros have been expanded.
 * This means in particular that `%INCLUDE` statements have been resolved.
 * This in turn means that the compilation unit is a collection of files, starting with the main file.
 */
export interface CompilationUnit {
  /**
   * The URI of the source file. This points to the main file that represents the entry point of the program.
   * This might not be the same as the URI of the currently open file.
   */
  uri: URI;
  files: URI[];
  compilerOptions: CompilerOptions;
  ast: PliProgram;
  preprocessorAst: PliProgram;
  preprocessorEvaluationResults: EvaluationResults;
  tokens: CompilationUnitTokens;
  referencesCache: ReferencesCache;
  statementOrderCache: StatementOrderCache;
  diagnostics: CompilationUnitDiagnostics;
  scopeCaches: ScopeCacheGroups;
  requestCaches: LSRequestCache;
  rootScope: Scope;
  rootPreprocessorScope: Scope;
}

export interface CompilationUnitTokens {
  all: Token[];
  fileTokens: Record<string, Token[]>;
}

export interface CompilationUnitDiagnostics {
  lexer: Diagnostic[];
  compilerOptions: Diagnostic[];
  parser: Diagnostic[];
  symbolTable: Diagnostic[];
  linking: Diagnostic[];
  validation: Diagnostic[];
}

export function collectDiagnostics(sourceFile: CompilationUnit): Diagnostic[] {
  return [
    ...sourceFile.diagnostics.lexer,
    ...sourceFile.diagnostics.compilerOptions,
    ...sourceFile.diagnostics.parser,
    ...sourceFile.diagnostics.symbolTable,
    ...sourceFile.diagnostics.linking,
    ...sourceFile.diagnostics.validation,
  ];
}

const BuiltinFileStart = `${BuiltinsUriSchema}:/`;
const isBuiltinFile = (uri: URI) => uri.toString().startsWith(BuiltinFileStart);

/**
 * Creates a function that returns the root scope, with builtins.
 *
 * Caches the scope for reuse.
 */
function createBuiltinScopeGetter() {
  let builtinSymbolTable: Scope | undefined = undefined;

  return (uri: URI): Scope => {
    // Don't load the builtin symbol table for builtin files
    if (isBuiltinFile(uri)) {
      return new Scope();
    }

    if (builtinSymbolTable === undefined) {
      const unit = createCompilationUnit(URI.parse(BuiltinsUri));
      tokenize(unit, Builtins);
      parse(unit);
      generateSymbolTable(unit);

      builtinSymbolTable =
        unit.scopeCaches.regular.get(unit.ast) ?? new Scope();
    }

    return builtinSymbolTable;
  };
}

const getBuiltinScope = createBuiltinScopeGetter();

// TODO: Add preprocessor scope for builtins?
const getRootPreprocessorScope = () => new Scope();

export function createCompilationUnit(uri: URI): CompilationUnit {
  return {
    uri,
    files: [],
    compilerOptions: {},
    ast: {
      kind: SyntaxKind.PliProgram,
      container: null,
      statements: [],
    },
    preprocessorAst: {
      kind: SyntaxKind.PliProgram,
      container: null,
      statements: [],
    },
    preprocessorEvaluationResults: new Map(),
    tokens: {
      fileTokens: {},
      all: [],
    },
    referencesCache: new ReferencesCache(),
    statementOrderCache: new StatementOrderCache(),
    scopeCaches: new ScopeCacheGroups(),
    diagnostics: {
      lexer: [],
      compilerOptions: [],
      parser: [],
      symbolTable: [],
      linking: [],
      validation: [],
    },
    requestCaches: createLSRequestCaches()
      .onRevalidate("margins", ({ connection, unit }) => {
        marginIndicator(connection, unit);
      })
      .onRevalidate("skippedCodeRanges", ({ connection, unit }) => {
        skippedCode(connection, unit);
      }),
    rootScope: getBuiltinScope(uri),
    rootPreprocessorScope: getRootPreprocessorScope(),
  };
}

export class CompilationUnitHandler {
  private compilationUnits: Map<string, CompilationUnit> = new Map();

  getCompilationUnit(uri: URI): CompilationUnit | undefined {
    return this.compilationUnits.get(uri.toString());
  }

  /**
   * Gets an existing or creates a new compilation unit for the given URI
   *
   * @returns Pre-existing or new compilation unit
   */
  getOrCreateCompilationUnit(uri: URI): CompilationUnit {
    return (
      this.compilationUnits.get(uri.toString()) ||
      this.createAndStoreCompilationUnit(uri)
    );
  }

  createAndStoreCompilationUnit(uri: URI): CompilationUnit {
    const unit = createCompilationUnit(uri);
    this.compilationUnits.set(uri.toString(), unit);
    return unit;
  }

  deleteCompilationUnit(uri: URI): boolean {
    const unit = this.compilationUnits.get(uri.toString());
    if (!unit) {
      return false;
    }

    for (const file of unit.files ?? []) {
      this.compilationUnits.delete(file.toString());
    }
    this.compilationUnits.delete(uri.toString());

    return true;
  }

  getAllCompilationUnits(): CompilationUnit[] {
    return Array.from(this.compilationUnits.values());
  }

  listen(connection: Connection): void {
    const textDocuments = EditorDocuments;
    textDocuments.listen(connection);
    textDocuments.onDidChangeContent((event) => {
      const unit = this.getOrCreateCompilationUnit(
        URI.parse(event.document.uri),
      );
      const document = textDocuments.get(unit.uri) ?? event.document;
      this.process(unit, document.getText(), connection);
      unit.requestCaches.revalidateAll({ connection, unit });
    });
    textDocuments.onDidClose((event) => {
      this.compilationUnits.delete(event.document.uri);
      connection.sendDiagnostics({
        uri: event.document.uri,
        diagnostics: [],
      });
    });
  }

  /**
   * Process a unit by running it through the lifecycle and generating diagnostics to report back.
   * @param unit The compilation unit
   * @param text Program content to use for the lifecycle
   * @param connection The connection to send diagnostics to
   */
  private process(
    unit: CompilationUnit,
    text: string,
    connection: Connection,
  ): void {
    lifecycle(unit, text);
    for (const file of unit.files) {
      this.compilationUnits.set(file.toString(), unit);
    }
    const allDiagnostics = diagnosticsToLSP(collectDiagnostics(unit));
    for (const file of unit.files) {
      const fileDiagnostics = allDiagnostics.get(file.toString());
      connection.sendDiagnostics({
        uri: file.toString(),
        diagnostics: fileDiagnostics ?? [],
      });
    }
  }

  /**
   * Reindexes all compilation units that are reachable, and reports fresh diagnostics.
   * Reachable as in the units w/ associated docs that are currently open in the editor.
   * @param connection The connection to send diagnostics to
   */
  reindex(connection: Connection): void {
    for (const unit of this.getAllCompilationUnits()) {
      const textDocument = TextDocuments.get(unit.uri.toString());
      if (textDocument) {
        this.process(unit, textDocument.getText(), connection);
      }
    }
  }
}
