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

export function registerCustomDecorators(
  client: LanguageClient,
  settings: Settings,
) {
  SkippedCodeDecorator.register(client, settings);
  MarginIndicatorDecorator.register(client, settings);
}

export namespace SkippedCodeDecorator {
  let skippedCodeDecorationType: vscode.TextEditorDecorationType;
  const skippedRangesByUri = new Map<string, vscode.Range[]>();

  export function register(client: LanguageClient, settings: Settings): void {
    updateDecoratorType(settings, false);

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

  export function updateDecoratorType(
    settings: Settings,
    update: boolean = true,
  ): void {
    if (skippedCodeDecorationType) {
      skippedCodeDecorationType.dispose();
    }
    skippedCodeDecorationType = vscode.window.createTextEditorDecorationType({
      opacity: settings.skippedCodeOpacity.toString(),
    });
    if (update) {
      updateAll(settings);
    }
  }
}

export namespace MarginIndicatorDecorator {
  const marginIndicatorRangesByUri = new Map<
    string,
    { m: number; n: number }
  >();

  export function register(client: LanguageClient, settings: Settings): void {
    client.onNotification(
      "pli/marginIndicator",
      (params: { uri: string; m: number; n: number }) => {
        marginIndicatorRangesByUri.set(params.uri, {
          m: params.m,
          n: params.n,
        });
        updateRulers(settings);
      },
    );

    vscode.workspace.onDidCloseTextDocument((doc) => {
      marginIndicatorRangesByUri.delete(doc.uri.toString());
      updateRulers(settings);
    });
  }

  export function updateRulers(settings: Settings): void {
    const config = vscode.workspace.getConfiguration("editor", {
      languageId: "pli",
    });
    const existingRulers = config.get<number[]>("rulers") || [];
    let rulers: number[] = [];

    if (!settings.marginIndicatorRulersEnabled) {
      if (existingRulers.length > 0) {
        // Ensure that we clear the rulers ONLY if they were previously set
        config.update("rulers", [], vscode.ConfigurationTarget.Global, true);
      }
      return;
    }

    // The left ruler should be left of the column number (-1), whereas
    // the right ruler should be right of the column number.
    if (settings.marginIndicatorRulers === "automatic") {
      for (const margins of marginIndicatorRangesByUri.values()) {
        if (!rulers.includes(margins.m)) {
          rulers.push(margins.m - 1);
        }
        if (!rulers.includes(margins.n)) {
          rulers.push(margins.n);
        }
      }
    } else {
      rulers = [1, 72];
    }

    if (rulers.length === existingRulers.length) {
      // If the rulers are the same, no need to update
      if (rulers.every((r, i) => r === existingRulers[i])) {
        return;
      }
    }
    config.update("rulers", rulers, vscode.ConfigurationTarget.Global, true);
  }
}
