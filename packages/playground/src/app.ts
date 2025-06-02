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
import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import { registerSkipDecoratorType } from "./decorators.js";
import { configure } from "./config.js";
import helloWorld from "../hello-world.pli?raw";
import pliTestCode from "../../../code_samples/RXGIM.pli?raw";
import includeExample from "../../../code_samples/preprocessor/include.pli?raw";
import includedExample from "../../../code_samples/preprocessor/included.pli?raw";
import {
  handleSharedWorkspace,
  deactivateExplorerContextMenu,
  registerButtons,
} from "./workspace.js";
import {
  createFileSystemProvider,
  FileSystemProvider,
} from "./file-system-provider.js";

let wrapper: MonacoEditorLanguageClientWrapper | undefined;

export async function startClient() {
  try {
    const config = configure(document.getElementById("vscode-views-root")!);
    wrapper = new MonacoEditorLanguageClientWrapper();
    const fileSystemProvider = createFileSystemProvider(config);
    await wrapper.init(config.wrapperConfig);
    await wrapper.startLanguageClients();
    registerSkipDecoratorType(wrapper);
    registerButtons();
    deactivateExplorerContextMenu();

    let defaultUri: vscode.Uri | undefined = undefined;
    defaultUri = await handleSharedWorkspace(fileSystemProvider);
    if (!defaultUri) {
      defaultUri = await loadDefaultWorkspace(fileSystemProvider);
    }

    await vscode.window.showTextDocument(defaultUri, { preserveFocus: true });
  } catch (e) {
    console.log(e);
  }
}

async function loadDefaultWorkspace(
  fileSystemProvider: FileSystemProvider,
): Promise<vscode.Uri> {
  let defaultUri = await fileSystemProvider.addFileToWorkspace(
    "/workspace/hello-world.pli",
    helloWorld,
  );
  await fileSystemProvider.addFileToWorkspace(
    "/workspace/RXGIM.pli",
    pliTestCode,
  );
  await fileSystemProvider.addFileToWorkspace(
    "/workspace/include.pli",
    includeExample,
  );
  await fileSystemProvider.addFileToWorkspace(
    "/workspace/included.pli",
    includedExample,
  );

  return defaultUri;
}
