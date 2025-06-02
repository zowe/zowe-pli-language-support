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
import { FileSystemProvider } from "./file-system-provider";

let shareTimeout: number | undefined;

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

  const shareOpenButton = document.getElementById("share-open-button");
  shareOpenButton?.addEventListener("click", () => {
    const documents: vscode.TextDocument[] = [];
    for (let uriPath of getOpenTabUris()) {
      console.log("uriPath", uriPath);
      // If the tab is in preview mode, it will not have the workspace path.
      if (!uriPath.startsWith("/workspace/")) {
        uriPath = "/workspace/" + uriPath;
      }
      const doc = vscode.workspace.textDocuments.find(
        (d) => d.uri.path === uriPath,
      )!;
      if (doc) {
        documents.push(doc);
      }
    }
    share(createWorkspaceFiles(documents));
  });

  const shareWorkspaceButton = document.getElementById(
    "share-workspace-button",
  );
  shareWorkspaceButton?.addEventListener("click", () => {
    const workspaceFiles = createWorkspaceFiles(getWorkspaceDocuments());
    share(workspaceFiles);
  });
}

/**
 * Share the current content or workspace as link to the clipboard.
 *
 * @param content - The content to share is either a plain string or an array of workspace files.
 * @param options - The options to share. clearWorkspace is used to clear the workspace before sharing.
 */
async function share(content: string | WorkspaceFile[]): Promise<void> {
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
  fileSystemProvider: FileSystemProvider,
): Promise<vscode.Uri | undefined> {
  let defaultUri: vscode.Uri | undefined = undefined;
  const url = new URL(window.location.toString());

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
    return await fileSystemProvider.addFileToWorkspace(
      `/workspace/${filename}`,
      content,
    );
  }

  // Load the workspace files.
  const encodedWorkspace = url.searchParams.get("workspace");
  if (encodedWorkspace) {
    const workspaceFiles: WorkspaceFile[] = JSON.parse(
      decompressFromEncodedURIComponent(encodedWorkspace),
    );
    for (const [index, file] of workspaceFiles.entries()) {
      const uri = await fileSystemProvider.addFileToWorkspace(
        file.uri,
        file.content,
      );
      // Use the preview option to set the editor tab in the correct mode.
      // preserveFocus also enforces sequential processing of the editor tabs,
      // which prevents deferred loading of editor resources, which can cause
      // issues with the virtual workspace fs operations.
      await vscode.window.showTextDocument(uri, {
        preview: false,
        preserveFocus: true,
      });
      if (index === 0) {
        defaultUri = uri;
      }
    }
  }

  return defaultUri;
}

function getOpenTabUris() {
  // Since the tab groups are not exposed, try to get the tabs from the dom.
  const tabsContainer = document.querySelector(".tabs-container");
  if (!tabsContainer) {
    console.warn("No tabs-container found!");
    return [];
  }

  const tabElements = tabsContainer.querySelectorAll(".tab .monaco-icon-label");
  const openTabs: string[] = [];

  tabElements.forEach((tabEl) => {
    const uriString = tabEl.getAttribute("aria-label");
    if (uriString) {
      // In the dom: "\workspace\RXGIM.pli • 50 problems in this file"
      openTabs.push(uriString.replace(/\\/g, "/").split(" • ")[0]);
    }
  });

  return openTabs;
}

function getWorkspaceDocuments() {
  const workspaceDocuments: vscode.TextDocument[] = [];
  for (const doc of vscode.workspace.textDocuments) {
    if (doc.uri.path.startsWith("/workspace/")) {
      workspaceDocuments.push(doc);
    }
  }
  return workspaceDocuments;
}

function createWorkspaceFiles(workspaceDocuments: vscode.TextDocument[]) {
  const workspaceFiles: WorkspaceFile[] = [];
  for (const doc of workspaceDocuments) {
    const text = doc.getText();
    workspaceFiles.push({ uri: doc.uri.path, content: text });
  }
  return workspaceFiles;
}

export function deactivateExplorerContextMenu() {
  const explorer = document.querySelector(
    '.explorer-folders-view .monaco-list[role="tree"]',
  );
  if (explorer) {
    explorer.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      },
      true,
    );
  }
}
