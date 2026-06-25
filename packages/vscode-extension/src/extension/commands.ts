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

import { Commands } from "pli-language";
import * as vscode from "vscode";

export function registerCommands(context: vscode.ExtensionContext): void {
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
  );
}
