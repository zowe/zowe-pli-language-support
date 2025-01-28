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

import * as vscode from "vscode";
import { Builtins } from "pli-language";

export class BuiltinFileSystemProvider implements vscode.FileSystemProvider {
  static register(context: vscode.ExtensionContext) {
    context.subscriptions.push(
      vscode.workspace.registerFileSystemProvider(
        "pli-builtin",
        new BuiltinFileSystemProvider(),
        {
          isReadonly: true,
          isCaseSensitive: false,
        },
      ),
    );
  }

  stat(_uri: vscode.Uri): vscode.FileStat {
    const date = Date.now();
    return {
      ctime: date,
      mtime: date,
      size: Buffer.from(Builtins).length,
      type: vscode.FileType.File,
    };
  }

  readFile(_uri: vscode.Uri): Uint8Array {
    // We could return different libraries based on the URI
    // We have only one, so we always return the same
    return new Uint8Array(Buffer.from(Builtins));
  }

  // The following class members only serve to satisfy the interface

  private readonly didChangeFile = new vscode.EventEmitter<
    vscode.FileChangeEvent[]
  >();
  onDidChangeFile = this.didChangeFile.event;

  watch() {
    return {
      dispose: () => {},
    };
  }

  readDirectory(): [] {
    throw vscode.FileSystemError.NoPermissions();
  }

  createDirectory() {
    throw vscode.FileSystemError.NoPermissions();
  }

  writeFile() {
    throw vscode.FileSystemError.NoPermissions();
  }

  delete() {
    throw vscode.FileSystemError.NoPermissions();
  }

  rename() {
    throw vscode.FileSystemError.NoPermissions();
  }
}
