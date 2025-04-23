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
import { LanguageClient } from "vscode-languageclient/node.js";
import { Settings } from "./settings";

let skippedCodeDecorationType: vscode.TextEditorDecorationType;
const skippedRangesByUri = new Map<string, vscode.Range[]>();

export function registerSkipDecoratorType(client: LanguageClient, settings: Settings) {
    updateSkipDecoratorType(settings);
  
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
        if (!settings.skippedCodeEnabled) {
          return;
        }
  
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
      if (!editor || !settings.skippedCodeEnabled) return;
      const ranges = skippedRangesByUri.get(editor.document.uri.toString());
      if (ranges) {
        editor.setDecorations(skippedCodeDecorationType, ranges);
      }
    });
  
    vscode.workspace.onDidCloseTextDocument((doc) => {
      skippedRangesByUri.delete(doc.uri.toString());
    });
  }
  
  export function updateSkipDecoratorType(settings: Settings) {
    if (skippedCodeDecorationType) {
      skippedCodeDecorationType.dispose();
    }
    skippedCodeDecorationType = vscode.window.createTextEditorDecorationType({
      opacity: settings.skippedCodeOpacity.toString(),
    });
  }
  