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
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import {
  IFileWriteOptions,
  InMemoryFileSystemProvider,
} from "@codingame/monaco-vscode-files-service-override";

let shareTimeout: number | undefined;
const encoder = new TextEncoder();

export const fileOptions: IFileWriteOptions = {
  atomic: false,
  unlock: false,
  create: true,
  overwrite: true,
};

export interface SharedWorkspace {
  focused?: string;
  files: WorkspaceFile[];
}

export interface WorkspaceFile {
  uri: string;
  content: string;
}

export function registerButtons() {
  const resetButton = document.getElementById("reset-button");
  resetButton?.addEventListener("click", () => {
    const url = new URL(window.location.toString(), window.origin);
    url.searchParams.delete("content");
    url.searchParams.delete("workspace");
    url.searchParams.delete("filename");
    window.location.href = url.toString();
  });

  const shareCurrentButton = document.getElementById("share-current-button");
  shareCurrentButton?.addEventListener("click", () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const text = editor.document.getText();
      share(text);
    }
  });

  const shareWorkspaceButton = document.getElementById(
    "share-workspace-button",
  );
  shareWorkspaceButton?.addEventListener("click", async () => {
    const workspaceFiles = await createWorkspaceFilesFromFileSystem();
    const activeEditor = vscode.window.activeTextEditor;
    const focusedFile = activeEditor?.document.uri.path;
    share({
      focused: focusedFile,
      files: workspaceFiles,
    });
  });
}

/**
 * Share the current content or workspace as link to the clipboard.
 *
 * @param content - The content to share is either a plain string or an array of workspace files.
 * @param options - The options to share. clearWorkspace is used to clear the workspace before sharing.
 */
async function share(content: string | SharedWorkspace): Promise<void> {
  const url = new URL(window.location.toString(), window.origin);
  url.searchParams.delete("content");
  url.searchParams.delete("workspace");
  if (typeof content === "string") {
    url.searchParams.set("content", compressToEncodedURIComponent(content));
  } else {
    url.searchParams.set(
      "workspace",
      compressToEncodedURIComponent(JSON.stringify(content)),
    );
  }
  await navigator.clipboard.writeText(url.toString());
  const shareInfo = document.getElementById("share-info");
  shareInfo?.classList.remove("hidden");
  window.clearTimeout(shareTimeout);
  shareTimeout = window.setTimeout(() => {
    shareInfo?.classList.add("hidden");
  }, 4000);
}

/**
 * Handle a shared workspace provided by a link.
 */
export async function handleSharedWorkspace(
  fileSystemProvider: InMemoryFileSystemProvider,
): Promise<vscode.Uri | undefined> {
  const url = new URL(window.location.toString());
  await writeWorkspaceFile(
    fileSystemProvider,
    createDefaultWorkspaceContent("/workspace"),
  );
  await fileSystemProvider.mkdir(vscode.Uri.file("/workspace"));

  // Create a new file for specific content.
  // The file will be named "new-file.pli" by default,
  // but a different name can be set by the user.
  const encodedContent = url.searchParams.get("content");
  if (encodedContent) {
    const filename =
      url.searchParams
        .get("filename")
        ?.replace(/[\\\/]/g, "")
        .replace(/^\.+/g, "") ?? "example.pli";
    const content = decompressFromEncodedURIComponent(encodedContent);
    const uri = vscode.Uri.file(`/workspace/${filename}`);
    await fileSystemProvider.writeFile(
      vscode.Uri.file(`/workspace/${filename}`),
      encoder.encode(content),
      fileOptions,
    );
    return uri;
  }

  // Load the workspace files.
  const encodedWorkspace = url.searchParams.get("workspace");
  if (encodedWorkspace) {
    const workspaceFiles: SharedWorkspace = JSON.parse(
      decompressFromEncodedURIComponent(encodedWorkspace),
    );
    for (const file of workspaceFiles.files) {
      console.debug("Loading document", file.uri);
      const uri = vscode.Uri.file(file.uri);
      const parentUri = uri.with({
        path: uri.path.substring(0, uri.path.lastIndexOf("/")),
      });
      try {
        await fileSystemProvider.mkdir(parentUri);
      } catch {
        // Ignore if the directory already exists.
      }
      await fileSystemProvider.writeFile(
        uri,
        new TextEncoder().encode(file.content),
        fileOptions,
      );
    }

    if (workspaceFiles.focused) {
      return vscode.Uri.file(workspaceFiles.focused);
    }
  }

  return undefined;
}

/**
 * Create workspace files by reading them from the file system.
 * Traverses all directories contained in the workspace to add files.
 */
async function createWorkspaceFilesFromFileSystem(): Promise<WorkspaceFile[]> {
  const workspaceFiles: WorkspaceFile[] = [];
  const workspaceUri = vscode.Uri.file("/workspace");

  try {
    const files = await vscode.workspace.fs.readDirectory(workspaceUri);

    while (files.length) {
      const [name, type] = files.pop()!;
      if (type === vscode.FileType.File) {
        const fileUri = vscode.Uri.joinPath(workspaceUri, name);
        console.debug("Saving document", fileUri.path);

        try {
          let text: string;
          const textDocument = vscode.workspace.textDocuments.find(
            (doc) => doc.uri.toString() === fileUri.toString(),
          );
          if (textDocument) {
            text = textDocument.getText();
          } else {
            const content = await vscode.workspace.fs.readFile(fileUri);
            text = new TextDecoder().decode(content);
          }
          workspaceFiles.push({ uri: fileUri.path, content: text });
        } catch (error) {
          console.warn("Failed to read file", fileUri.path, error);
        }
      } else if (type === vscode.FileType.Directory) {
        // read & add files to this directory as well
        const moreFiles = await vscode.workspace.fs.readDirectory(
          vscode.Uri.joinPath(workspaceUri, name),
        );
        for (const [childName, childType] of moreFiles) {
          files.push([`${name}/${childName}`, childType]);
        }
      }
    }
  } catch (error) {
    console.error("Failed to read workspace directory", error);
    return [];
  }

  return workspaceFiles;
}

export function redirectOutlineCancelReporting() {
  // There is a bug that is reported by the outline in combination with the InMemoryFileSystemProvider.
  // The issue is already reported and the outline works fine.
  // To avoid spamming the console with the known issue, we redirect this to debug level.
  // TODO ssmifi: Come back as soon as there is reasonable fix for https://github.com/TypeFox/monaco-languageclient/issues/935
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;

    if (reason?.name === "Canceled") {
      console.debug("[Redirected VS Code Outline Cancel]", reason);
      event.preventDefault();
    }
  });
}

import helloWorld from "../workspace/hello-world.pli?raw";
import includeExample from "../workspace/include.pli?raw";
import includedExample from "../workspace/lib/included.pli?raw";
import pgmconf from "../workspace/.pliplugin/pgm_conf.json?raw";
import procgrps from "../workspace/.pliplugin/proc_grps.json?raw";

export async function loadDefaultWorkspace(
  fileSystemProvider: InMemoryFileSystemProvider,
): Promise<vscode.Uri> {
  await writeWorkspaceFile(
    fileSystemProvider,
    createDefaultWorkspaceContent("/workspace"),
  );
  await fileSystemProvider.mkdir(vscode.Uri.file("/workspace/lib"));
  await fileSystemProvider.mkdir(vscode.Uri.file("/workspace/.pliplugin"));
  const defaultUri = vscode.Uri.file("/workspace/hello-world.pli");
  await fileSystemProvider.writeFile(
    defaultUri,
    encoder.encode(helloWorld),
    fileOptions,
  );
  await fileSystemProvider.writeFile(
    vscode.Uri.file("/workspace/.pliplugin/pgm_conf.json"),
    encoder.encode(pgmconf),
    fileOptions,
  );
  await fileSystemProvider.writeFile(
    vscode.Uri.file("/workspace/.pliplugin/proc_grps.json"),
    encoder.encode(procgrps),
    fileOptions,
  );
  await fileSystemProvider.writeFile(
    vscode.Uri.file("/workspace/include.pli"),
    encoder.encode(includeExample),
    fileOptions,
  );
  await fileSystemProvider.writeFile(
    vscode.Uri.file("/workspace/lib/included.pli"),
    encoder.encode(includedExample),
    fileOptions,
  );

  return defaultUri;
}

export async function writeWorkspaceFile(
  fileSystemProvider: InMemoryFileSystemProvider,
  content: string,
): Promise<void> {
  await fileSystemProvider.writeFile(
    vscode.Uri.file("/workspace.code-workspace"),
    encoder.encode(content),
    fileOptions,
  );
}

export const createDefaultWorkspaceContent = (workspacePath: string) => {
  return JSON.stringify(
    {
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
