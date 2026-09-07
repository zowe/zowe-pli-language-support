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

const OPEN_SETTINGS = "Open Settings";

/**
 * Opens user `settings.json` at `pli.pgm_conf` so copybook `libs` can be added
 * (user defaults ship with none).
 */
async function openUserSettings(): Promise<void> {
  await vscode.commands.executeCommand("workbench.action.openSettingsJson", {
    revealSetting: { key: "pli.pgm_conf" },
  });
}

/**
 * After a write, offer to open `settings.json` so copybook `libs` can be
 * added (user defaults ship with none). The message body is not clickable
 * (VS Code API); the action opens the file.
 */
export async function notifyUserConfigAppended(program: string): Promise<void> {
  const selection = await vscode.window.showInformationMessage(
    `Added '${program}' as an entry point to your user settings.`,
    OPEN_SETTINGS,
  );
  if (selection === OPEN_SETTINGS) {
    await openUserSettings();
  }
}
