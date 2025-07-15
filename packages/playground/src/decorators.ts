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
import * as monaco from "@codingame/monaco-vscode-editor-api";
import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";

let skippedCodeDecorationType: monaco.editor.IModelDecorationOptions;
let skippedCodeDecorations: string[] = [];

export function registerSkipDecoratorType(
  wrapper: MonacoEditorLanguageClientWrapper,
) {
  skippedCodeDecorationType = {
    inlineClassName: "pli-skippedCode",
  };

  const client = wrapper.getLanguageClient("langium");
  if (client) {
    client.onNotification(
      "pli/skippedCode",
      (params: {
        uri: string;
        ranges: Array<{
          start: { line: number; character: number };
          end: { line: number; character: number };
        }>;
      }) => {
        const model = monaco.editor.getModel(vscode.Uri.parse(params.uri));
        if (model) {
          const ranges = params.ranges.map((range) => ({
            startLineNumber: range.start.line + 1,
            startColumn: range.start.character + 1,
            endLineNumber: range.end.line + 1,
            endColumn: range.end.character + 1,
          }));

          skippedCodeDecorations = model.deltaDecorations(
            skippedCodeDecorations,
            ranges.map((range) => ({
              range,
              options: skippedCodeDecorationType,
            })),
          );
        } else {
          console.warn("No model found for", params.uri);
        }
      },
    );
  }
}
