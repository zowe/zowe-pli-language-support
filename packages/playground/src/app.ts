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
import { MonacoVscodeApiWrapper } from "monaco-languageclient/vscodeApiWrapper";
import { configure } from "./config.js";
import {
  InMemoryFileSystemProvider,
  registerFileSystemOverlay,
} from "@codingame/monaco-vscode-files-service-override";
import {
  handleSharedWorkspace,
  loadDefaultWorkspace,
  redirectOutlineCancelReporting,
  registerButtons,
} from "./workspace.js";

export async function startClient() {
  try {
    redirectOutlineCancelReporting();
    registerButtons();
    const config = await configure(
      document.getElementById("vscode-views-root")!,
    );

    const fileSystemProvider = new InMemoryFileSystemProvider();
    let defaultUri: vscode.Uri | undefined = undefined;
    defaultUri = await handleSharedWorkspace(fileSystemProvider);
    if (!defaultUri) {
      defaultUri = await loadDefaultWorkspace(fileSystemProvider);
    }
    registerFileSystemOverlay(1, fileSystemProvider);

    const apiWrapper = new MonacoVscodeApiWrapper(config.vscodeApiConfig);
    await apiWrapper.start();
    await vscode.window.showTextDocument(defaultUri, {
      preserveFocus: true,
      preview: false,
    });
  } catch (e) {
    console.log(e);
  }
}
