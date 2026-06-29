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

import type { LanguageClientOptions } from "vscode-languageclient/browser.js";
import * as vscode from "vscode";
import { LanguageClient } from "vscode-languageclient/browser.js";
import { BuiltinFileSystemProvider } from "./builtin-files";
import { registerFileSystemProvider } from "./file-system-provider";
import { registerProgressReporter } from "./progress";
import { watchPluginFolder } from "./plugin-watcher";
import { registerCustomDecorators } from "./decorators";
import { Settings } from "./settings";
import {
  deriveUserSettingsUri,
  registerConfigLoader,
  watchPluginSettings,
} from "./config-loader";
import { registerConfigFileSystem } from "./config-file-system";
import { registerCommands } from "./commands";

let client: LanguageClient;
let settings: Settings;

// This function is called when the extension is activated.
export async function activate(
  context: vscode.ExtensionContext,
): Promise<void> {
  BuiltinFileSystemProvider.register(context);
  registerConfigFileSystem(context);
  settings = Settings.getInstance();
  context.subscriptions.push(settings);
  registerCommands(context);
  client = await startLanguageClient(context);

  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (workspaceFolder) {
    watchPluginFolder(client, workspaceFolder, context);
  }
}

// This function is called when the extension is deactivated.
export async function deactivate(): Promise<void> {
  if (client) {
    await client.stop();
  }
}

async function startLanguageClient(
  context: vscode.ExtensionContext,
): Promise<LanguageClient> {
  const serverModule = vscode.Uri.joinPath(
    context.extensionUri,
    "out/language/main-browser.js",
  );
  const worker = new Worker(serverModule.toString(true));

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "*", language: "pli" }],
  };

  // Create the language client and start the client.
  const client = new LanguageClient("pli", "PL/I", clientOptions, worker);
  context.subscriptions.push(
    registerProgressReporter(client),
    watchPluginSettings(client),
  );
  registerFileSystemProvider(client);
  registerConfigLoader(client, deriveUserSettingsUri(context.globalStorageUri));
  context.subscriptions.push(
    registerProgressReporter(client),
    registerCustomDecorators(client, settings),
  );
  // Start the client. This will also launch the server
  await client.start();
  return client;
}
