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
  IFileWriteOptions,
  InMemoryFileSystemProvider,
  registerFileSystemOverlay,
} from "@codingame/monaco-vscode-files-service-override";
import { IStoredWorkspace } from "@codingame/monaco-vscode-configuration-service-override";
import { ConfigResult } from "./config";
import {
  Builtins,
  BuiltinsUriSchema,
  WorkspaceDidChangePlipluginConfigNotification,
} from "pli-language";
import { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import {
  FILE_SYSTEM_NAMESPACE,
  FileSystemMessage,
  LSFileAction,
} from "./language-server";

/**
 * The file system provider that is used to create our virtual workspace.
 */
export class FileSystemProvider extends InMemoryFileSystemProvider {
  static fileOptions: IFileWriteOptions = {
    atomic: false,
    unlock: false,
    create: true,
    overwrite: true,
  };
  protected textEncoder = new TextEncoder();

  constructor(private pliWorker: Worker) {
    super();
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

    // Create the directory if necessary.
    await this.createDirectory(uri);

    await this.writeFile(
      uri,
      this.textEncoder.encode(content),
      FileSystemProvider.fileOptions,
    );

    // We need to make the files available for the parser to work across files.
    // This will not show them in the editor. Use showTextDocument to show them.
    await vscode.workspace.openTextDocument(uri);

    this.notifyWorker(uri, LSFileAction.Add, content);

    return uri;
  }

  async createDirectory(uri: vscode.Uri) {
    const segments = uri.path.split("/").slice(1, -1);
    for (let i = 0; i < segments.length; i++) {
      const path = "/" + segments.slice(0, i + 1).join("/");
      const dir = vscode.Uri.file(path);
      if (!(await this.fileExists(dir))) {
        await this.mkdir(dir);
      }
    }
  }

  notifyWorker(uri: vscode.Uri, action: LSFileAction, content: string) {
    this.pliWorker.postMessage(<FileSystemMessage>{
      namespace: FILE_SYSTEM_NAMESPACE,
      type: action,
      uri: uri.toString(),
      content: content,
    });
  }
}

export async function createFileSystemProvider(
  config: ConfigResult,
): Promise<FileSystemProvider> {
  const fileSystemProvider = new FileSystemProvider(config.pliWorker);
  const textEncoder = new TextEncoder();

  const workspaceUri = vscode.Uri.file("/workspace");
  await fileSystemProvider.mkdir(workspaceUri);
  await fileSystemProvider.writeFile(
    config.workspaceFileUri,
    textEncoder.encode(createDefaultWorkspaceContent("/workspace")),
    FileSystemProvider.fileOptions,
  );
  registerFileSystemOverlay(1, fileSystemProvider);

  return fileSystemProvider;
}

export const createDefaultWorkspaceContent = (workspacePath: string) => {
  return JSON.stringify(
    <IStoredWorkspace>{
      folders: [
        {
          path: workspacePath,
        },
      ],
    },
    null,
    2,
  );
};

export function watchWorkspaceChanges(
  wrapper: MonacoEditorLanguageClientWrapper,
  fileSystemProvider: FileSystemProvider,
): void {
  vscode.workspace.onDidCreateFiles((event) => {
    event.files.forEach((file) => {
      fileSystemProvider.notifyWorker(file, LSFileAction.Add, "");
    });
  });
  vscode.workspace.onDidDeleteFiles((event) => {
    event.files.forEach((file) => {
      fileSystemProvider.notifyWorker(file, LSFileAction.Delete, "");
    });
  });
  vscode.workspace.onDidRenameFiles((event) => {
    event.files.forEach((file) => {
      fileSystemProvider.notifyWorker(
        file.oldUri,
        LSFileAction.Rename,
        file.newUri.toString(),
      );
      vscode.workspace.openTextDocument(file.newUri);
    });
  });

  const configFiles = new Set([
    "/workspace/.pliplugin/pgm_conf.json",
    "/workspace/.pliplugin/proc_grps.json",
  ]);
  vscode.workspace.onDidChangeTextDocument((event) => {
    fileSystemProvider.notifyWorker(
      event.document.uri,
      LSFileAction.Add,
      event.document.getText(),
    );

    const uriPath = event.document.uri.path;

    if (configFiles.has(uriPath)) {
      const client = wrapper.getLanguageClient("langium");
      if (client) {
        console.debug("Change detected in", uriPath);
        client.sendNotification(WorkspaceDidChangePlipluginConfigNotification);
      }
    }
  });
}

export class BuiltinFileSystemProvider implements vscode.FileSystemProvider {
  static register() {
    vscode.workspace.registerFileSystemProvider(
      BuiltinsUriSchema,
      new BuiltinFileSystemProvider(),
      {
        isReadonly: true,
        isCaseSensitive: false,
      },
    );
  }

  stat(_uri: vscode.Uri): vscode.FileStat {
    const date = Date.now();
    const encoded = new TextEncoder().encode(Builtins);
    return {
      ctime: date,
      mtime: date,
      size: encoded.length,
      type: vscode.FileType.File,
    };
  }

  readFile(_uri: vscode.Uri): Uint8Array {
    return new TextEncoder().encode(Builtins);
  }

  private readonly didChangeFile = new vscode.EventEmitter<
    vscode.FileChangeEvent[]
  >();
  onDidChangeFile = this.didChangeFile.event;

  watch() {
    return {
      dispose: () => {},
    };
  }

  readDirectory(): [] {
    throw vscode.FileSystemError.NoPermissions();
  }

  createDirectory() {
    throw vscode.FileSystemError.NoPermissions();
  }

  writeFile() {
    throw vscode.FileSystemError.NoPermissions();
  }

  delete() {
    throw vscode.FileSystemError.NoPermissions();
  }

  rename() {
    throw vscode.FileSystemError.NoPermissions();
  }
}
