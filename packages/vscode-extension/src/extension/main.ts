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
import { LanguageClient, TransportKind } from "vscode-languageclient/node.js";
import { BuiltinFileSystemProvider } from "./builtin-files";

let client: LanguageClient;
let skippedCodeDecorationType: vscode.TextEditorDecorationType;
const skippedRangesByUri = new Map<string, vscode.Range[]>();

// This function is called when the extension is activated.
export function activate(context: vscode.ExtensionContext): void {
  BuiltinFileSystemProvider.register(context);
  client = startLanguageClient(context);
}

// This function is called when the extension is deactivated.
export function deactivate(): Thenable<void> | undefined {
  if (client) {
    return client.stop();
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
  registerSkipDecoratorType(client);

  // Start the client. This will also launch the server
  client.start();
  return client;
}

function registerSkipDecoratorType(client: LanguageClient) {
  skippedCodeDecorationType = vscode.window.createTextEditorDecorationType({
    opacity: "0.33",
  });

  client.onNotification(
    "pli/skippedCode",
    (params: {
      uri: string;
      ranges: Array<{
        range: {
          start: { line: number; character: number };
          end: { line: number; character: number };
        };
      }>;
    }) => {
      const editor = vscode.window.visibleTextEditors.find(
        (e) => e.document.uri.toString() === params.uri,
      );
      if (editor) {
        const ranges = params.ranges.map(
          ({ range }) =>
            new vscode.Range(
              new vscode.Position(range.start.line, range.start.character),
              new vscode.Position(range.end.line, range.end.character),
            ),
        );
        skippedRangesByUri.set(params.uri, ranges);
        editor.setDecorations(skippedCodeDecorationType, ranges);
      }
    },
  );

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (!editor) return;
    const ranges = skippedRangesByUri.get(editor.document.uri.toString());
    if (ranges) {
      editor.setDecorations(skippedCodeDecorationType, ranges);
    }
  });

  vscode.workspace.onDidCloseTextDocument((doc) => {
    skippedRangesByUri.delete(doc.uri.toString());
  });
}
