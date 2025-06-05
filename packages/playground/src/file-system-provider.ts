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
import {
  RegisteredFileSystemProvider,
  RegisteredMemoryFile,
  registerFileSystemOverlay,
} from "@codingame/monaco-vscode-files-service-override";
import { IStoredWorkspace } from "@codingame/monaco-vscode-configuration-service-override";
import { ConfigResult } from "./config";

/**
 * The file system provider that is used to create our virtual workspace.
 */
export class FileSystemProvider extends RegisteredFileSystemProvider {
  constructor() {
    super(false);
  }

  async fileExists(uri: vscode.Uri) {
    try {
      await this.stat(uri);
      return true;
    } catch (error) {
      return false;
    }
  }

  async addFileToWorkspace(
    uriString: string,
    content: string,
  ): Promise<vscode.Uri> {
    const uri = vscode.Uri.file(uriString);

    if (await this.fileExists(uri)) {
      this.delete(uri);
    }

    this.registerFile(new RegisteredMemoryFile(uri, content));
    // We need to make the files available for the parser to work across files.
    // This will not show them in the editor. Use showTextDocument to show them.
    await vscode.workspace.openTextDocument(uri);

    return uri;
  }
}

export function createFileSystemProvider(
  config: ConfigResult,
): FileSystemProvider {
  const fileSystemProvider = new FileSystemProvider();
  fileSystemProvider.registerFile(
    createDefaultWorkspaceFile(config.workspaceFile, "/workspace"),
  );
  registerFileSystemOverlay(1, fileSystemProvider);

  return fileSystemProvider;
}

const createDefaultWorkspaceFile = (
  workspaceFile: vscode.Uri,
  workspacePath: string,
) => {
  return new RegisteredMemoryFile(
    workspaceFile,
    JSON.stringify(
      <IStoredWorkspace>{
        folders: [
          {
            path: workspacePath,
          },
        ],
      },
      null,
      2,
    ),
  );
};
