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
import { UpdateOperation } from "pli-language";
import { BaseLanguageClient } from "vscode-languageclient";

export function registerProgressReporter(client: BaseLanguageClient): void {
  let dispose = new vscode.Disposable(() => {});
  client.onNotification(UpdateOperation, (operation) => {
    if (operation && typeof operation.title === "string") {
      const title = operation.title;
      if (title === "") {
        dispose.dispose();
      } else {
        dispose = vscode.window.setStatusBarMessage("$(loading~spin) " + title);
      }
    }
  });
}
