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

import { IToken } from "chevrotain";
import { PliProgram, SyntaxKind } from "../syntax-tree/ast.js";
import { URI } from "../utils/uri.js";
import { ScopeCacheGroups } from "../linking/symbol-table.js";
import { TextDocuments } from "../language-server/text-documents.js";
import { Connection } from "vscode-languageserver";
import { ReferencesCache } from "../linking/resolver.js";
import { Diagnostic, diagnosticsToLSP } from "../language-server/types.js";
import { lifecycle } from "./lifecycle.js";
import { CompilerOptions } from "../preprocessor/compiler-options/options.js";
import { skippedCode } from "../language-server/skipped-code.js";
import { EvaluationResults } from "../preprocessor/pli-preprocessor-interpreter-state.js";

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
  references: ReferencesCache;
  diagnostics: CompilationUnitDiagnostics;
  scopeCaches: ScopeCacheGroups;
}

export interface CompilationUnitTokens {
  all: IToken[];
  fileTokens: Record<string, IToken[]>;
}

export interface CompilationUnitDiagnostics {
  lexer: Diagnostic[];
  compilerOptions: Diagnostic[];
  parser: Diagnostic[];
  linking: Diagnostic[];
  validation: Diagnostic[];
}

export function collectDiagnostics(sourceFile: CompilationUnit): Diagnostic[] {
  return [
    ...sourceFile.diagnostics.lexer,
    ...sourceFile.diagnostics.compilerOptions,
    ...sourceFile.diagnostics.parser,
    ...sourceFile.diagnostics.linking,
    ...sourceFile.diagnostics.validation,
  ];
}

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
    references: new ReferencesCache(),
    scopeCaches: new ScopeCacheGroups(),
    diagnostics: {
      lexer: [],
      compilerOptions: [],
      parser: [],
      linking: [],
      validation: [],
    },
  };
}

export class CompletionUnitHandler {
  private compilationUnits: Map<string, CompilationUnit> = new Map();

  getCompilationUnit(uri: URI): CompilationUnit | undefined {
    return this.compilationUnits.get(uri.toString());
  }

  getOrCreateCompilationUnit(uri: URI): CompilationUnit {
    return (
      this.compilationUnits.get(uri.toString()) ||
      this.createCompilationUnit(uri)
    );
  }

  createCompilationUnit(uri: URI): CompilationUnit {
    const unit = createCompilationUnit(uri);
    this.compilationUnits.set(uri.toString(), unit);
    return unit;
  }

  deleteCompilationUnit(uri: URI): boolean {
    const unit = this.compilationUnits.get(uri.toString());
    for (const file of unit?.files ?? []) {
      this.compilationUnits.delete(file.toString());
    }
    return unit !== undefined;
  }

  listen(connection: Connection): void {
    const textDocuments = TextDocuments;
    textDocuments.listen(connection);
    textDocuments.onDidChangeContent((event) => {
      const unit = this.getOrCreateCompilationUnit(
        URI.parse(event.document.uri),
      );
      const document = textDocuments.get(unit.uri) ?? event.document;
      lifecycle(unit, document.getText());
      unit.files.forEach((file) => {
        this.compilationUnits.set(file.toString(), unit);
      });
      const allDiagnostics = diagnosticsToLSP(collectDiagnostics(unit));
      for (const file of unit.files) {
        const fileDiagnostics = allDiagnostics.get(file.toString());
        connection.sendDiagnostics({
          uri: file.toString(),
          diagnostics: fileDiagnostics ?? [],
        });
      }
      skippedCode(connection, event.document.uri, unit, document);
    });
    textDocuments.onDidClose((event) => {
      this.compilationUnits.delete(event.document.uri);
      connection.sendDiagnostics({
        uri: event.document.uri,
        diagnostics: [],
      });
    });
  }
}
