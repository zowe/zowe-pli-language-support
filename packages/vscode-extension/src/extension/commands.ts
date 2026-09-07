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

import { Commands, Messages } from "pli-language";
import * as vscode from "vscode";
import { BaseLanguageClient } from "vscode-languageclient";
import {
  registerImportPlaygroundLinkCommand,
  registerShareAsPlaygroundLinkCommand,
} from "./playground-link";

/**
 * Opens (or focuses) the config entry described by `configLocation` and
 * positions the cursor at it. This works uniformly whether the entry is
 * sourced from a `.pliplugin/` file or from VS Code settings: `uri`/`range`
 * always point at the real, openable document (e.g. `settings.json`) that
 * the LS parsed the entry from.
 */
async function navigateToConfigEntry(
  configLocation: Messages.PluginConfigEntryLocation | null,
): Promise<void> {
  if (!configLocation) {
    // No configuration found - do nothing
    return;
  }

  const configUri = vscode.Uri.parse(configLocation.uri);
  const doc = await vscode.workspace.openTextDocument(configUri);
  const position = new vscode.Position(
    configLocation.range.start.line,
    configLocation.range.start.character,
  );

  const editor = await vscode.window.showTextDocument(doc, {
    selection: new vscode.Range(position, position),
    preserveFocus: false,
    preview: false,
  });

  // Reveal the line to ensure it's visible
  editor.revealRange(
    new vscode.Range(position, position),
    vscode.TextEditorRevealType.InCenter,
  );
}

function registerGoToConfigCommand(
  commandId: string,
  requestMethod: string,
  client: BaseLanguageClient,
): vscode.Disposable {
  return vscode.commands.registerCommand(commandId, async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== "pli") {
      return;
    }

    try {
      const configLocation: Messages.PluginConfigEntryLocation | null =
        await client.sendRequest(requestMethod, editor.document.uri.toString());
      await navigateToConfigEntry(configLocation);
    } catch (error) {
      console.error(`Failed to execute command "${commandId}":`, error);
    }
  });
}

export function registerCommands(
  context: vscode.ExtensionContext,
  client: BaseLanguageClient,
): void {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      Commands.SAVE_FILES,
      async (uris: string[]) => {
        for (const uri of uris) {
          try {
            const doc = await vscode.workspace.openTextDocument(
              vscode.Uri.parse(uri),
            );
            await doc.save(); // no-op if not dirty
          } catch {
            // ignore error
          }
        }
      },
    ),

    registerGoToConfigCommand(
      Commands.GO_TO_PROGRAM_CONFIG,
      "pli/getProgramConfigLocation",
      client,
    ),

    registerGoToConfigCommand(
      Commands.GO_TO_PROCESS_GROUP,
      "pli/getProcessGroupLocation",
      client,
    ),

    registerShareAsPlaygroundLinkCommand(),
    registerImportPlaygroundLinkCommand(),
  );
}
