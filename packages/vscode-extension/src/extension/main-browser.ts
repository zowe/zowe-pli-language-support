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

import type { LanguageClientOptions } from 'vscode-languageclient/browser.js';
import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/browser.js';
import { BuiltinFileSystemProvider } from './builtin-files';

let client: LanguageClient;

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
    const serverModule = vscode.Uri.joinPath(context.extensionUri, 'out/language/main-browser.js');
    const worker = new Worker(serverModule.toString(true));

    // Options to control the language client
    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: '*', language: 'pli' }]
    };

    // Create the language client and start the client.
    const client = new LanguageClient(
        'pli',
        'PL/I',
        clientOptions,
        worker
    );

    // Start the client. This will also launch the server
    client.start();
    return client;
}
