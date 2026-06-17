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

import { TextDocument } from "vscode-languageserver-textdocument";
import { Token } from "../parser/tokens";
import { URI } from "../utils/uri";
import { BuiltinDocuments } from "../language-server/text-documents";
import { CompilationUnit } from "./compilation-unit";

export interface CompilationUnitFile {
  readonly uri: URI;
  readonly tokens: Token[];
  readonly comments: Token[];
  readonly textDocument: TextDocument;
}

export class FileStore {
  private map = new Map<string, CompilationUnitFile>();
  private baseFileUris: Set<string>;

  constructor(private baseFiles: CompilationUnit[]) {
    this.baseFileUris = new Set(
      this.baseFiles.map((file) => file.uri.toString()),
    );
    this.clear();
  }

  get(uri: URI | string): CompilationUnitFile | undefined {
    return this.map.get(uri.toString());
  }

  getTokens(uri: URI | string): Token[] | undefined {
    return this.get(uri)?.tokens;
  }

  getComments(uri: URI | string): Token[] | undefined {
    return this.get(uri)?.comments;
  }

  *getAllTokens(): IterableIterator<Token> {
    for (const file of this.map.values()) {
      if (this.baseFileUris.has(file.uri.toString())) {
        continue;
      }
      yield* file.tokens;
    }
  }

  getDocument(uri: URI | string): TextDocument | undefined {
    // Builtin documents are not stored on the compilation unit
    // To respond to LSP requests, we need to return them anyway
    return this.get(uri)?.textDocument ?? BuiltinDocuments.get(uri);
  }

  set(file: CompilationUnitFile): void {
    this.map.set(file.uri.toString(), file);
  }

  delete(uri: URI | string): void {
    this.map.delete(uri.toString());
  }

  clear(): void {
    this.map.clear();
    for (const file of this.baseFiles) {
      this.map.set(file.uri.toString(), file.services.files.get(file.uri)!);
    }
  }

  addBaseFiles(files: CompilationUnit[]): void {
    for (const file of files) {
      const uriString = file.uri.toString();
      this.baseFiles.push(file);
      this.baseFileUris.add(uriString);
      this.map.set(uriString, file.services.files.get(file.uri)!);
    }
  }

  has(uri: URI | string): boolean {
    return this.map.has(uri.toString());
  }

  keys(): IterableIterator<string> {
    return this.map.keys();
  }

  values(): IterableIterator<CompilationUnitFile> {
    return this.map.values();
  }

  entries(): IterableIterator<[string, CompilationUnitFile]> {
    return this.map.entries();
  }
}
