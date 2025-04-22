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

import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import { editor } from "monaco-editor";

let skippedCodeDecorationType: editor.IModelDecorationOptions;
let skippedCodeDecorations: editor.IEditorDecorationsCollection | undefined;

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
          range: {
            start: { line: number; character: number };
            end: { line: number; character: number };
          };
        }>;
      }) => {
        const editor = wrapper.getEditor();
        if (editor) {
          if (skippedCodeDecorations) {
            skippedCodeDecorations.clear();
          }

          const ranges = params.ranges.map(({ range }) => ({
            startLineNumber: range.start.line + 1,
            startColumn: range.start.character + 1,
            endLineNumber: range.end.line + 1,
            endColumn: range.end.character + 1,
          }));
          skippedCodeDecorations = editor.createDecorationsCollection(
            ranges.map((range) => ({
              range,
              options: skippedCodeDecorationType,
            })),
          );
        }
      },
    );
  }
}
