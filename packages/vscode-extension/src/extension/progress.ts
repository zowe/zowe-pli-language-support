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
import { Messages } from "pli-language";
import { BaseLanguageClient } from "vscode-languageclient";
import { onNotification } from "./messages";

export function registerProgressReporter(
  client: BaseLanguageClient,
): vscode.Disposable {
  let statusBarItem = new vscode.Disposable(() => {});
  onNotification(client, Messages.UpdateOperation, (title) => {
    statusBarItem.dispose();
    if (title) {
      statusBarItem = vscode.window.setStatusBarMessage(
        "$(loading~spin) " + title,
      );
    }
  });
  return statusBarItem;
}
