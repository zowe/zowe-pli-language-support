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
import { WorkspaceDidChangePlipluginConfigNotification } from "pli-language";
import TelemetryReporter from "@vscode/extension-telemetry";

let client: LanguageClient;
let settings: Settings;

// This function is called when the extension is activated.
export function activate(context: vscode.ExtensionContext): void {
  BuiltinFileSystemProvider.register(context);
  settings = Settings.getInstance();
  client = startLanguageClient(context);
  context.subscriptions.push(registerOnDidOpenTextDocListener());
  const telemetryReporter: TelemetryReporter | undefined =
    getTelemetryReporter(context);
  sendTelemetryEvent("pli.language.support.activated", telemetryReporter);

  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (workspaceFolder) {
    watchPlipluginFolder(client, workspaceFolder, context, telemetryReporter);
  }
}

/**
 * Listen for file open events, and prompt if we can create a .pliplugin folder
 * @returns Disposable listener
 */
function registerOnDidOpenTextDocListener() {
  const listener = vscode.workspace.onDidOpenTextDocument(async (document) => {
    // settle on the 1st workspace folder available
    // TODO @montymxb May 15th, 2025: Support configs across multiple workspace folders
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceFolder) {
      return;
    }

    // check if we can create a .pliplugin folder
    const plipluginPath = path.join(workspaceFolder, ".pliplugin");

    if (document.languageId !== "pli" || fs.existsSync(plipluginPath)) {
      // not a pli file or config already exists
      return;
    }

    const userResponse = await vscode.window.showInformationMessage(
      "Create a '.pliplugin' folder in the project root using this file as the entry point in 'pgm_conf.json'?",
      "Yes",
      "No",
    );

    if (userResponse !== "Yes") {
      return;
    }

    // create the .pliplugin folder and files, using the current file as the entry point
    fs.mkdirSync(plipluginPath);

    fs.writeFileSync(
      path.join(plipluginPath, "pgm_conf.json"),
      JSON.stringify(
        {
          pgms: [
            {
              program: path.relative(workspaceFolder, document.fileName),
              pgroup: "default",
            },
          ],
        },
        null,
        2,
      ),
    );
    fs.writeFileSync(
      path.join(plipluginPath, "proc_grps.json"),
      JSON.stringify(
        {
          pgroups: [
            {
              name: "default",
              "compiler-options": [],
              libs: ["cpy", "inc"],
              "include-extensions": [],
            },
          ],
        },
        null,
        2,
      ),
    );
    vscode.window.showInformationMessage(
      "'.pliplugin' folder and files created successfully.",
    );
  });
  return listener;
}

// This function is called when the extension is deactivated.
export function deactivate(): Thenable<void> | undefined {
  if (client) {
    return client.stop();
  }
  if (settings) {
    settings.dispose();
  }
  return undefined;
}

function startLanguageClient(context: vscode.ExtensionContext): LanguageClient {
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
    documentSelector: [{ scheme: "*", language: "pli" }],
  };

  // Create the language client and start the client.
  const client = new LanguageClient(
    "pli",
    "PL/I",
    serverOptions,
    clientOptions,
  );

  // Register custom decorator types.
  registerCustomDecorators(client, settings);

  // Start the client. This will also launch the server
  client.start();
  return client;
}

function getTelemetryReporter(
  context: vscode.ExtensionContext,
): TelemetryReporter | undefined {
  const extension = context.extension;
  if (extension) {
    return new TelemetryReporter("2493c87d-82ee-403a-ac45-dccab714590b");
  } else {
    return undefined;
  }
}

function sendTelemetryEvent(
  eventName: string,
  telemetryReporter?: TelemetryReporter,
): void {
  telemetryReporter?.sendTelemetryEvent(eventName);
}

/**
 * Watches the .pliplugin folder for changes to pgm_conf.json and proc_grps.json files.
 * Sends a notification to the LS when changes are detected
 */
function watchPlipluginFolder(
  client: LanguageClient,
  workspaceFolder: string,
  context: vscode.ExtensionContext,
  telemetryReporter: TelemetryReporter | undefined,
): void {
  const folderPattern = new vscode.RelativePattern(
    workspaceFolder,
    ".pliplugin",
  );
  const filePattern = new vscode.RelativePattern(
    workspaceFolder,
    ".pliplugin/*.json",
  );

  const folderWatcher = vscode.workspace.createFileSystemWatcher(folderPattern);
  const fileWatcher = vscode.workspace.createFileSystemWatcher(filePattern);

  // watch for folder create/delete events
  folderWatcher.onDidCreate(() => {
    client.sendNotification(WorkspaceDidChangePlipluginConfigNotification);
    sendTelemetryEvent(
      "pli.language.support.onDidCreate.folder",
      telemetryReporter,
    );
  });

  folderWatcher.onDidDelete(() => {
    client.sendNotification(WorkspaceDidChangePlipluginConfigNotification);
    sendTelemetryEvent(
      "pli.language.support.onDidDelete.folder",
      telemetryReporter,
    );
  });

  // watch for file create/update/delete events
  fileWatcher.onDidChange(() => {
    client.sendNotification(WorkspaceDidChangePlipluginConfigNotification);
    sendTelemetryEvent(
      "pli.language.support.onDidChange.file",
      telemetryReporter,
    );
  });

  fileWatcher.onDidCreate(() => {
    client.sendNotification(WorkspaceDidChangePlipluginConfigNotification);
    sendTelemetryEvent(
      "pli.language.support.onDidCreate.file",
      telemetryReporter,
    );
  });

  fileWatcher.onDidDelete(() => {
    client.sendNotification(WorkspaceDidChangePlipluginConfigNotification);
    sendTelemetryEvent(
      "pli.language.support.onDidDelete.file",
      telemetryReporter,
    );
  });

  context.subscriptions.push(folderWatcher, fileWatcher);
}
