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

export function registerConfigFileSystem(context: vscode.ExtensionContext) {
  const extensionUri = context.extensionUri;
  const generatePath = (uri: vscode.Uri) =>
    vscode.Uri.joinPath(extensionUri, uri.path);

  const emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
  const disposable = vscode.workspace.registerFileSystemProvider(
    "pli-language-support-config",
    {
      onDidChangeFile: emitter.event,
      watch() {
        return { dispose: () => {} };
      },
      stat(uri) {
        return vscode.workspace.fs.stat(generatePath(uri));
      },
      readDirectory() {
        throw Error("not implemented");
      },
      createDirectory() {
        throw Error("not implemented");
      },
      readFile(uri) {
        return vscode.workspace.fs.readFile(generatePath(uri));
      },
      writeFile() {
        throw Error("not implemented");
      },
      delete() {
        throw Error("not implemented");
      },
      rename() {
        throw Error("not implemented");
      },
    },
    { isReadonly: true, isCaseSensitive: true },
  );
  context.subscriptions.push(disposable);
}
