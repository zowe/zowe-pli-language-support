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

import { WorkspaceDidChangePlipluginConfigNotification } from "pli-language";
import * as vscode from "vscode";
import type { LanguageClientOptions } from "vscode-languageclient/browser.js";
import { LanguageClient } from "vscode-languageclient/browser.js";
import { BuiltinFileSystemProvider } from "./builtin-files";
import {
  notifyWorker,
  readAndNotifyWorker,
  syncExistingFiles,
} from "./workspace-sync";
import { LSFileAction, PLIPLUGIN_CONFIG_FILES } from "../utils";

let client: LanguageClient;

/**
 * Web Worker instance for the language server
 * Held here to allow file system watchers to notify it of changes
 */
let worker: Worker;

/**
 * Helper to setup file system watchers and notify the language server of changes
 * @param context Extension context for registering subscriptions
 */
function setupFileSystemWatchers(context: vscode.ExtensionContext): void {
  // watch for file creation
  const createWatcher = vscode.workspace.onDidCreateFiles(async (event) => {
    for (const uri of event.files) {
      if (uri.scheme === "file") {
        await readAndNotifyWorker(worker, uri, LSFileAction.Add);
      }
    }
  });

  // watch for file deletion
  const deleteWatcher = vscode.workspace.onDidDeleteFiles((event) => {
    for (const file of event.files) {
      if (file.scheme === "file") {
        notifyWorker(worker, file, LSFileAction.Delete);
      }
    }
  });

  // watch for file renaming
  const renameWatcher = vscode.workspace.onDidRenameFiles(async (event) => {
    for (const rename of event.files) {
      if (rename.oldUri.scheme === "file" && rename.newUri.scheme === "file") {
        notifyWorker(worker, rename.oldUri, LSFileAction.Delete);
        await readAndNotifyWorker(worker, rename.newUri, LSFileAction.Add);
      }
    }
  });

  // Watch for text document changes
  const changeWatcher = vscode.workspace.onDidChangeTextDocument((event) => {
    const uri = event.document.uri;
    if (uri.scheme === "file") {
      notifyWorker(worker, uri, LSFileAction.Add, event.document.getText());
    }
  });

  context.subscriptions.push(
    createWatcher,
    deleteWatcher,
    renameWatcher,
    changeWatcher,
  );
}

/**
 * Watch for changes to .pliplugin configuration files and notify the language server
 * @param client LanguageClient instance to send notifications
 */
function watchPlipluginConfigChanges(client: LanguageClient): void {
  // get the workspace path
  const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri;

  if (!workspacePath) {
    return;
  }

  const configFilePaths = new Set(
    PLIPLUGIN_CONFIG_FILES.map(
      (file) => vscode.Uri.joinPath(workspacePath, file).path,
    ),
  );

  vscode.workspace.onDidChangeTextDocument((event) => {
    const uriPath = event.document.uri.path;
    if (configFilePaths.has(uriPath)) {
      client.sendNotification(WorkspaceDidChangePlipluginConfigNotification);
    }
  });
}

/**
 * Invoked when the extension is activated
 * @param context
 */
export async function activate(
  context: vscode.ExtensionContext,
): Promise<void> {
  BuiltinFileSystemProvider.register(context);
  client = startLanguageClient(context);
  setupFileSystemWatchers(context);
  watchPlipluginConfigChanges(client);
  syncExistingFiles(client, worker);
}

/**
 * Invoked when the extension is deactivated
 * @returns
 */
export function deactivate(): Thenable<void> | undefined {
  if (client) {
    return client.stop();
  }
  if (worker) {
    worker.terminate();
  }
  return undefined;
}

/**
 * Starts the language client in a web worker
 * @param context
 * @returns
 */
function startLanguageClient(context: vscode.ExtensionContext): LanguageClient {
  const serverModule = vscode.Uri.joinPath(
    context.extensionUri,
    "out/language/main-browser.js",
  );
  worker = new Worker(serverModule.toString(true));

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "*", language: "pli" }],
  };

  // Create the language client and start the client.
  const client = new LanguageClient("pli", "PL/I", clientOptions, worker);
  client.start();
  return client;
}
