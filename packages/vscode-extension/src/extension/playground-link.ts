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
import { Commands } from "pli-language";
import {
  encodePlaygroundWorkspace,
  SharedWorkspace,
  WorkspaceFile,
} from "pli-language/playground-link";
import { Settings } from "./settings";

// Long URLs can be rejected or truncated by browsers, chat tools, and issue
// trackers. Above this length we still generate the link, but warn.
const RECOMMENDED_MAX_URL_LENGTH = 8000;

export function registerShareAsPlaygroundLinkCommand(): vscode.Disposable {
  return vscode.commands.registerCommand(
    Commands.SHARE_PLAYGROUND_LINK,
    async (uri?: vscode.Uri, uris?: vscode.Uri[]) => {
      const selection = uris?.length ? uris : uri ? [uri] : [];
      if (selection.length === 0) {
        return;
      }

      try {
        await shareAsPlaygroundLink(selection);
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed to create playground link: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    },
  );
}

async function shareAsPlaygroundLink(selection: vscode.Uri[]): Promise<void> {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(selection[0]);
  if (!workspaceFolder) {
    vscode.window.showErrorMessage(
      "Select files inside a workspace folder to create a playground link.",
    );
    return;
  }

  const multiRoot = (vscode.workspace.workspaceFolders?.length ?? 0) > 1;
  const collected = new Map<string, WorkspaceFile>();
  for (const item of selection) {
    await collectFiles(item, collected, multiRoot);
  }

  if (collected.size === 0) {
    vscode.window.showWarningMessage(
      "No files found in the current selection.",
    );
    return;
  }

  // The focused file must come from the explicit selection, never from the
  // .pliplugin config that gets pulled in below.
  const focused = determineFocusedFile(collected);

  // Preprocessor/compiler behavior (CICS/DB2/SQL, includes, ...) depends on
  // the .pliplugin config, so always bundle it if the workspace has one.
  const pluginConfigUri = vscode.Uri.joinPath(
    workspaceFolder.uri,
    ".pliplugin",
  );
  if (await exists(pluginConfigUri)) {
    await collectFiles(pluginConfigUri, collected, multiRoot);
  }

  const sharedWorkspace: SharedWorkspace = {
    focused,
    files: [...collected.values()],
  };

  const encoded = encodePlaygroundWorkspace(sharedWorkspace);
  const url = new URL(Settings.getInstance().playgroundUrl);
  url.searchParams.set("workspace", encoded);
  const link = url.toString();

  if (link.length > RECOMMENDED_MAX_URL_LENGTH) {
    vscode.window.showWarningMessage(
      `The generated playground link is very long (${link.length} characters) and may not work in all browsers or tools. Consider sharing fewer files.`,
    );
  }

  await vscode.env.clipboard.writeText(link);
  const action = await vscode.window.showInformationMessage(
    "Playground link copied to clipboard.",
    "Open in Browser",
  );
  if (action === "Open in Browser") {
    await vscode.env.openExternal(vscode.Uri.parse(link));
  }
}

/**
 * Recursively adds `uri` (a file or a directory) to `collected`, keyed by its
 * real URI so the same file is never added twice.
 */
async function collectFiles(
  uri: vscode.Uri,
  collected: Map<string, WorkspaceFile>,
  multiRoot: boolean,
): Promise<void> {
  const key = uri.toString();
  if (collected.has(key)) {
    return;
  }

  const stat = await vscode.workspace.fs.stat(uri);
  if (stat.type === vscode.FileType.Directory) {
    const entries = await vscode.workspace.fs.readDirectory(uri);
    for (const [name] of entries) {
      await collectFiles(vscode.Uri.joinPath(uri, name), collected, multiRoot);
    }
    return;
  }

  if (stat.type !== vscode.FileType.File) {
    return;
  }

  collected.set(key, {
    uri: toVirtualPath(uri, multiRoot),
    content: await readFileContent(uri),
  });
}

async function readFileContent(uri: vscode.Uri): Promise<string> {
  const textDocument = vscode.workspace.textDocuments.find(
    (doc) => doc.uri.toString() === uri.toString(),
  );
  if (textDocument) {
    return textDocument.getText();
  }
  const bytes = await vscode.workspace.fs.readFile(uri);
  return new TextDecoder().decode(bytes);
}

// Maps a real file URI to the virtual `/workspace/...` path expected by the
// playground's in-memory file system.
function toVirtualPath(uri: vscode.Uri, multiRoot: boolean): string {
  const relative = vscode.workspace.asRelativePath(uri, multiRoot);
  return `/workspace/${relative.replace(/\\/g, "/")}`;
}

async function exists(uri: vscode.Uri): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(uri);
    return true;
  } catch {
    return false;
  }
}

function determineFocusedFile(
  collected: Map<string, WorkspaceFile>,
): string | undefined {
  const activeUri = vscode.window.activeTextEditor?.document.uri;
  const active = activeUri && collected.get(activeUri.toString());
  if (active) {
    return active.uri;
  }
  return collected.values().next().value?.uri;
}
