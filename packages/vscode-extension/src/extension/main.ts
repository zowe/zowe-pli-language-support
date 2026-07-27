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

import type {
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node.js";
import * as vscode from "vscode";
import * as path from "node:path";
import * as fs from "node:fs";
import { LanguageClient, TransportKind } from "vscode-languageclient/node.js";
import { BuiltinFileSystemProvider } from "./builtin-files";
import { Settings } from "./settings";
import { registerCustomDecorators } from "./decorators";
import { TelemetryReporter } from "@vscode/extension-telemetry";
import { handleMissingConfig } from "../common/missing-config-handler";
import { registerPliDocumentIdentifier } from "./document-identification";
import { registerFileSystemProvider } from "./file-system-provider";
import { registerProgressReporter } from "./progress";
import {
  deriveUserSettingsUri,
  locateWorkspaceFolder,
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
  client = await startLanguageClient(context);

  const telemetryReporter: TelemetryReporter | undefined =
    getTelemetryReporter(context);
  telemetryReporter?.sendTelemetryEvent("pli.language.support.activated");
  context.subscriptions.push(
    registerOnDidChangeActiveTextEditor(),
    registerOnDidOpenTextDocListener(telemetryReporter),
    registerPliDocumentIdentifier(client),
    watchPluginSettings(client),
  );

  registerCommands(context, client);

  void handleMissingConfig(vscode.window.activeTextEditor);
}

/**
 * Listen for changes on file activation, and prompt if we can create a .pliplugin folder
 * @returns Disposable listener
 */
function registerOnDidChangeActiveTextEditor() {
  const listener = async (editor: vscode.TextEditor | undefined) => {
    await handleMissingConfig(editor);
  };
  return vscode.window.onDidChangeActiveTextEditor(listener);
}

function registerOnDidOpenTextDocListener(
  telemetryReporter: TelemetryReporter | undefined,
) {
  const listener = async (document: vscode.TextDocument) => {
    // settle on the 1st workspace folder available
    // TODO @montymxb May 15th, 2025: Support configs across multiple workspace folders
    const workspaceFolder = locateWorkspaceFolder(document.uri);
    if (!workspaceFolder) {
      return;
    }

    // check if we can create a .pliplugin folder
    const plipluginPath = path.join(workspaceFolder.fsPath, ".pliplugin");
    if (document.languageId !== "pli" || fs.existsSync(plipluginPath)) {
      // not a pli file or config already exists
      return;
    }

    // The telemetry event is intentionally guarded to only emit when the .pliplugin folder is missing. (#521)
    telemetryReporter?.sendTelemetryEvent(
      "pli.language.support.documentOpened",
    );
  };
  return vscode.workspace.onDidOpenTextDocument(listener);
}

function getTelemetryReporter(
  context: vscode.ExtensionContext,
): TelemetryReporter | undefined {
  const telemetryKeyPath = path.join(
    context.extension.extensionPath,
    "res",
    "telemetry-key.txt",
  );
  try {
    const key = fs.readFileSync(telemetryKeyPath, "utf-8");
    return new TelemetryReporter(key);
  } catch {
    return undefined;
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
  const serverModule = context.asAbsolutePath(
    path.join("out", "language", "main.cjs"),
  );
  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging.
  // By setting `process.env.DEBUG_BREAK` to a truthy value, the language server will wait until a debugger is attached.
  const debugOptions = {
    execArgv: [
      "--nolazy",
      `--inspect${process.env.DEBUG_BREAK ? "-brk" : ""}=${process.env.DEBUG_SOCKET || "6009"}`,
    ],
  };

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions,
    },
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { language: "pli" },
      { pattern: "**/.pliplugin/*.json" },
      { pattern: "**/settings.json" },
    ],
  };

  // Create the language client and start the client.
  const client = new LanguageClient(
    "pli",
    "PL/I",
    serverOptions,
    clientOptions,
  );

  // Register custom connection message handlers.
  registerFileSystemProvider(client);
  registerConfigLoader(client, deriveUserSettingsUri(context.globalStorageUri));
  context.subscriptions.push(
    client,
    registerProgressReporter(client),
    registerCustomDecorators(client, settings),
  );

  // Start the client. This will also launch the server
  await client.start();
  return client;
}
