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
import { deriveUserSettingsUri } from "./config-loader";

const OPEN_SETTINGS = "Open Settings";

/**
 * Reveal user `settings.json` so copybook `libs` can be added (user defaults
 * ship with none). Falls back to VS Code's command when the derived path
 * isn't a document (remote/web).
 */
export async function openUserSettings(
  context: vscode.ExtensionContext,
): Promise<void> {
  try {
    const settingsUri = deriveUserSettingsUri(context.globalStorageUri);
    const document = await vscode.workspace.openTextDocument(settingsUri);
    await vscode.window.showTextDocument(document, { preview: false });
  } catch {
    await vscode.commands.executeCommand(
      "workbench.action.openSettingsJson",
      "pli.pgm_conf",
    );
  }
}

/**
 * Toast after appending a program entry. The message body is not clickable
 * (VS Code API); the action opens the same `settings.json` as first create.
 */
export async function notifyUserConfigAppended(
  program: string,
  context: vscode.ExtensionContext,
): Promise<void> {
  const selection = await vscode.window.showInformationMessage(
    `Added '${program}' as an entry point to your user settings.`,
    OPEN_SETTINGS,
  );
  if (selection === OPEN_SETTINGS) {
    await openUserSettings(context);
  }
}
