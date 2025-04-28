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
import { LanguageClient, Range } from "vscode-languageclient/node.js";
import { Settings } from "./settings";

export namespace SkippedCodeDecorator {
  let skippedCodeDecorationType: vscode.TextEditorDecorationType;
  const skippedRangesByUri = new Map<string, vscode.Range[]>();

  export function register(client: LanguageClient, settings: Settings): void {
    skippedCodeDecorationType = vscode.window.createTextEditorDecorationType({
      opacity: settings.skippedCodeOpacity.toString(),
    });

    client.onNotification(
      "pli/skippedCode",
      (params: { uri: string; ranges: Range[] }) => {
        const ranges = params.ranges.map(
          (range) =>
            new vscode.Range(
              new vscode.Position(range.start.line, range.start.character),
              new vscode.Position(range.end.line, range.end.character),
            ),
        );
        skippedRangesByUri.set(params.uri, ranges);
        updateURI(params.uri, settings);
      },
    );

    vscode.window.onDidChangeVisibleTextEditors((editors) => {
      for (const editor of editors) {
        updateEditor(editor, settings);
      }
    });

    vscode.workspace.onDidCloseTextDocument((doc) => {
      skippedRangesByUri.delete(doc.uri.toString());
    });
  }

  export function updateAll(settings: Settings): void {
    for (const editor of vscode.window.visibleTextEditors) {
      updateEditor(editor, settings);
    }
  }

  function updateURI(uri: string, settings: Settings): void {
    vscode.window.visibleTextEditors
      .filter((e) => e.document.uri.toString() === uri)
      .forEach((editor) => {
        updateEditor(editor, settings);
      });
  }

  function updateEditor(editor: vscode.TextEditor, settings: Settings): void {
    if (!settings.skippedCodeEnabled) {
      editor.setDecorations(skippedCodeDecorationType, []);
      return;
    }
    const ranges = skippedRangesByUri.get(editor.document.uri.toString());
    if (!ranges) return;

    editor.setDecorations(skippedCodeDecorationType, ranges);
  }

  export function updateType(settings: Settings): void {
    if (skippedCodeDecorationType) {
      skippedCodeDecorationType.dispose();
    }
    skippedCodeDecorationType = vscode.window.createTextEditorDecorationType({
      opacity: settings.skippedCodeOpacity.toString(),
    });
    updateAll(settings);
  }
}
