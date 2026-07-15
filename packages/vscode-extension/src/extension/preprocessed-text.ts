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
import { BaseLanguageClient } from "vscode-languageclient";
import { Commands, Messages, PreprocessedTextUriSchema } from "pli-language";
import { onNotification, sendRequest } from "./messages";

/**
 * Registers the read-only virtual document provider and the
 * "Show Preprocessed Text" command. The virtual document shows the fully
 * preprocessed text of the compilation unit containing a .pli file and
 * refreshes whenever the language server re-processes a unit.
 */
export function registerPreprocessedText(
  client: BaseLanguageClient,
): vscode.Disposable {
  const onDidChange = new vscode.EventEmitter<vscode.Uri>();
  const provider: vscode.TextDocumentContentProvider = {
    onDidChange: onDidChange.event,
    async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
      const originalUri = decodeURIComponent(uri.query);
      const text = await sendRequest(
        client,
        Messages.GetPreprocessedText,
        originalUri,
      );
      return text ?? "";
    },
  };

  onNotification(client, Messages.PreprocessedTextChanged, ({ uris }) => {
    // Only refresh the views showing the changed compilation unit; a view's
    // query holds the file URI it was opened from, which is one of the unit's files.
    const changed = new Set(uris);
    for (const doc of vscode.workspace.textDocuments) {
      if (
        doc.uri.scheme === PreprocessedTextUriSchema &&
        changed.has(decodeURIComponent(doc.uri.query))
      ) {
        onDidChange.fire(doc.uri);
      }
    }
  });

  const command = vscode.commands.registerCommand(
    Commands.SHOW_PREPROCESSED_TEXT,
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== "pli") {
        return;
      }
      const originalUri = editor.document.uri;
      const virtualUri = vscode.Uri.from({
        scheme: PreprocessedTextUriSchema,
        path: `/${originalUri.path.split("/").pop()} (preprocessed)`,
        query: encodeURIComponent(originalUri.toString()),
      });
      const doc = await vscode.workspace.openTextDocument(virtualUri);
      await vscode.languages.setTextDocumentLanguage(doc, "pli");
      await vscode.window.showTextDocument(doc, {
        viewColumn: vscode.ViewColumn.Beside,
        preview: false,
        preserveFocus: true,
      });
    },
  );

  return vscode.Disposable.from(
    onDidChange,
    vscode.workspace.registerTextDocumentContentProvider(
      PreprocessedTextUriSchema,
      provider,
    ),
    command,
  );
}
