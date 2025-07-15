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
import helloWorld from "../workspace/hello-world.pli?raw";
import includeExample from "../workspace/include.pli?raw";
import includedExample from "../workspace/lib/included.pli?raw";
import pgmconf from "../workspace/.pliplugin/pgm_conf.json?raw";
import procgrps from "../workspace/.pliplugin/proc_grps.json?raw";
import {
  redirectOutlineCancelReporting,
  handleSharedWorkspace,
  registerButtons,
} from "./workspace.js";
import {
  BuiltinFileSystemProvider,
  createFileSystemProvider,
  FileSystemProvider,
  watchWorkspaceChanges,
} from "./file-system-provider.js";
import { Builtins, BuiltinsUri } from "pli-language";

let wrapper: MonacoEditorLanguageClientWrapper | undefined;

export async function startClient() {
  try {
    redirectOutlineCancelReporting();
    const config = await configure(
      document.getElementById("vscode-views-root")!,
    );
    wrapper = new MonacoEditorLanguageClientWrapper();
    const fileSystemProvider = await createFileSystemProvider(config);
    await wrapper.init(config.wrapperConfig);
    registerSkipDecoratorType(wrapper);
    registerButtons();

    let defaultUri: vscode.Uri | undefined = undefined;
    defaultUri = await handleSharedWorkspace(fileSystemProvider);
    if (!defaultUri) {
      defaultUri = await loadDefaultWorkspace(fileSystemProvider);
    }
    await wrapper.startLanguageClients();
    BuiltinFileSystemProvider.register();
    watchWorkspaceChanges(wrapper, fileSystemProvider);

    await vscode.window.showTextDocument(defaultUri, { preserveFocus: true });
  } catch (e) {
    console.log(e);
  }
}

async function loadDefaultWorkspace(
  fileSystemProvider: FileSystemProvider,
): Promise<vscode.Uri> {
  const defaultUri = await fileSystemProvider.addFileToWorkspace(
    "/workspace/hello-world.pli",
    helloWorld,
  );
  await fileSystemProvider.mkdir(vscode.Uri.parse("/workspace/.pliplugin"));
  await fileSystemProvider.mkdir(vscode.Uri.parse("/workspace/lib"));
  await fileSystemProvider.addFileToWorkspace(
    "/workspace/.pliplugin/pgm_conf.json",
    pgmconf,
  );
  await fileSystemProvider.addFileToWorkspace(
    "/workspace/.pliplugin/proc_grps.json",
    procgrps,
  );
  await fileSystemProvider.addFileToWorkspace(
    "/workspace/include.pli",
    includeExample,
  );
  await fileSystemProvider.addFileToWorkspace(
    "/workspace/lib/included.pli",
    includedExample,
  );

  await fileSystemProvider.writeFile(
    vscode.Uri.parse(BuiltinsUri),
    new TextEncoder().encode(Builtins),
    FileSystemProvider.fileOptions,
  );

  return defaultUri;
}
