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
import * as builtins from "pli-language/builtins";

const files = new Map<string, string>([
  [builtins.BuiltinsFile, builtins.Builtins],
  [builtins.BuiltinsMacroFile, builtins.BuiltinsMacro],
  [builtins.BuiltinsSqlcaFile, builtins.BuiltinsSqlca],
  [builtins.BuiltinsSqldaFile, builtins.BuiltinsSqlda],
]);

function getFile(uri: vscode.Uri): string | undefined {
  const path = uri.path;
  const index = path.lastIndexOf("/") + 1;
  return files.get(path.substring(index));
}

export class BuiltinFileSystemProvider implements vscode.FileSystemProvider {
  static register(context: vscode.ExtensionContext) {
    context.subscriptions.push(
      vscode.workspace.registerFileSystemProvider(
        builtins.BuiltinsUriSchema,
        new BuiltinFileSystemProvider(),
        {
          isReadonly: true,
          isCaseSensitive: false,
        },
      ),
    );
  }

  stat(uri: vscode.Uri): vscode.FileStat {
    const file = getFile(uri);
    if (!file) {
      throw new Error("File not found!");
    }
    return {
      ctime: 0,
      mtime: 0,
      size: Buffer.from(file).length,
      type: vscode.FileType.File,
    };
  }

  readFile(uri: vscode.Uri): Uint8Array {
    const file = getFile(uri);
    if (!file) {
      throw new Error("File not found!");
    }
    return new Uint8Array(Buffer.from(file));
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

  readDirectory(): [string, vscode.FileType][] {
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
