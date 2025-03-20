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
import { SymbolTable } from "../linking/symbol-table.js";
import { TextDocuments } from "../language-server/text-documents.js";
import { Connection } from "vscode-languageserver";
import { ReferencesCache } from "../linking/resolver.js";
import { Diagnostic, diagnosticToLSP } from "../language-server/types.js";
import { lifecycle } from "./lifecycle.js";

/**
 * A source file is a representation of a PL/I source file in the language server.
 * It contains all information about the source file.
 * 
 * Note that the source file is not a representation of the file on disk, but rather
 * a representation of the file once all of its macros have been expanded.
 * This means in particular that `%INCLUDE` statements have been resolved.
 * This in turn means that the source file is a collection of files, starting with the main file.
 */
export interface SourceFile {
  /**
   * The URI of the source file. This points to the main file that represents the entry point of the program.
   * This might not be the same as the URI of the currently open file.
   */
  uri: URI;
  ast: PliProgram;
  tokens: IToken[];
  symbols: SymbolTable;
  references: ReferencesCache;
  diagnostics: SourceFileDiagnostics;
}

export interface SourceFileDiagnostics {
  lexer: Diagnostic[];
  parser: Diagnostic[];
  linking: Diagnostic[];
  validation: Diagnostic[];
}

export function collectDiagnostics(sourceFile: SourceFile): Diagnostic[] {
  return [
    ...sourceFile.diagnostics.lexer,
    ...sourceFile.diagnostics.parser,
    ...sourceFile.diagnostics.linking,
    ...sourceFile.diagnostics.validation,
  ];
}

export function createSourceFile(uri: URI): SourceFile {
  return {
    uri,
    ast: {
      kind: SyntaxKind.PliProgram,
      container: null,
      statements: [],
    },
    tokens: [],
    symbols: new SymbolTable(),
    references: new ReferencesCache(),
    diagnostics: {
      lexer: [],
      parser: [],
      linking: [],
      validation: [],
    },
  };
}

export class SourceFileHandler {
  private sourceFiles: Map<string, SourceFile> = new Map();

  getSourceFile(uri: URI): SourceFile | undefined {
    return this.sourceFiles.get(uri.toString());
  }

  getOrCreateSourceFile(uri: URI): SourceFile {
    return this.sourceFiles.get(uri.toString()) || this.createSourceFile(uri);
  }

  createSourceFile(uri: URI): SourceFile {
    const sourceFile = createSourceFile(uri);
    this.sourceFiles.set(uri.toString(), sourceFile);
    return sourceFile;
  }

  deleteSourceFile(uri: URI): boolean {
    return this.sourceFiles.delete(uri.toString());
  }

  listen(connection: Connection): void {
    const textDocuments = TextDocuments;
    textDocuments.listen(connection);
    textDocuments.onDidChangeContent((event) => {
      const sourceFile = this.createSourceFile(URI.parse(event.document.uri));
      lifecycle(sourceFile, event.document.getText());
      connection.sendDiagnostics({
        uri: event.document.uri,
        diagnostics: collectDiagnostics(sourceFile).map((d) =>
          diagnosticToLSP(event.document, d),
        ),
      });
    });
    textDocuments.onDidClose((event) => {
      this.sourceFiles.delete(event.document.uri);
    });
  }
}
