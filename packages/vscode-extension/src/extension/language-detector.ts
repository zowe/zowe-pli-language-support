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

export function registerPLILanguageDetectionListener(
  context: vscode.ExtensionContext,
) {
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((doc) => {
      // Only add listeners for plaintext documents.
      if (doc.languageId !== "plaintext") {
        return;
      }

      if (isPLILanguage(doc.getText())) {
        vscode.languages.setTextDocumentLanguage(doc, "pli");
        return;
      }

      const changeListener = vscode.workspace.onDidChangeTextDocument(
        (event) => {
          if (event.document.uri !== doc.uri) {
            return;
          }

          // If a language was set in the meantime, remove the listeners.
          if (event.document.languageId !== "plaintext") {
            changeListener.dispose();
            closeListener.dispose();
            return;
          }

          // Check if the document contains pli language elements.
          if (isPLILanguage(event.document.getText())) {
            vscode.languages.setTextDocumentLanguage(event.document, "pli");
            changeListener.dispose();
            closeListener.dispose();
          }
        },
      );
      context.subscriptions.push(changeListener);

      // If this document is closed, remove the listeners.
      const closeListener = vscode.workspace.onDidCloseTextDocument((event) => {
        if (event.uri !== doc.uri) {
          return;
        }
        changeListener.dispose();
        closeListener.dispose();
      });
      context.subscriptions.push(closeListener);
    }),
  );
}

function isPLILanguage(text: string) {
  // Only check the first 80 characters
  text = text.substring(0, 80);

  const commonPLILanguageKeywords = [
    /^[*%]PROCESS/im,
    /DECLARE/i,
    /DCL/i,
    /: PROC/i,
  ];

  return commonPLILanguageKeywords.some((regex) => regex.test(text));
}
