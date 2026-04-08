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
import { BuiltinsUriSchema } from "./builtins";

export interface CompilationUnitFile {
  readonly uri: URI;
  readonly tokens: Token[];
  readonly comments: Token[];
  readonly textDocument: TextDocument;
}

export class FileStore {
  private map = new Map<string, CompilationUnitFile>();

  get(uri: URI | string): CompilationUnitFile | undefined {
    return this.map.get(uri.toString());
  }

  getTokens(uri: URI | string): Token[] | undefined {
    return this.get(uri)?.tokens;
  }

  getComments(uri: URI | string): Token[] | undefined {
    return this.get(uri)?.comments;
  }

  *getAllTokens(includeBuiltins = false): IterableIterator<Token> {
    for (const file of this.map.values()) {
      if (!includeBuiltins && file.uri.scheme === BuiltinsUriSchema) {
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
