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
  decodePlaygroundContent,
  decodePlaygroundWorkspace,
  encodePlaygroundWorkspace,
  sanitizeSharedFilename,
  SharedWorkspace,
  WorkspaceFile,
} from "pli-language/playground-link";
import { Settings } from "./settings";

// Long URLs can be rejected or truncated by browsers, chat tools, and issue
// trackers. Above this length we still generate the link, but warn.
const RECOMMENDED_MAX_URL_LENGTH = 8000;

// The playground's in-memory file system roots every shared file under this
// virtual path (see pli-language/playground-link's WorkspaceFile.uri).
const VIRTUAL_ROOT_PREFIX = "/workspace/";

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

export function registerImportPlaygroundLinkCommand(): vscode.Disposable {
  return vscode.commands.registerCommand(
    Commands.IMPORT_PLAYGROUND_LINK,
    async () => {
      try {
        await importPlaygroundLink();
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed to import playground link: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    },
  );
}

async function importPlaygroundLink(): Promise<void> {
  const link = await promptForPlaygroundLink();
  if (!link) {
    return;
  }

  const sharedWorkspace = parseSharedWorkspaceFromLink(link);
  if (!sharedWorkspace) {
    vscode.window.showErrorMessage(
      "This link's workspace data could not be read.",
    );
    return;
  }
  if (sharedWorkspace.files.length === 0) {
    vscode.window.showWarningMessage(
      "This playground link doesn't contain any files.",
    );
    return;
  }

  const workspaceFolder = await resolveTargetWorkspaceFolder();
  if (!workspaceFolder) {
    return;
  }

  const destinationRoot = await createImportSubfolder(workspaceFolder.uri);

  const written = new Map<string, vscode.Uri>();
  const skipped: string[] = [];
  for (const file of sharedWorkspace.files) {
    const targetUri = mapVirtualPathToSafeUri(file.uri, destinationRoot);
    if (!targetUri) {
      skipped.push(file.uri);
      continue;
    }
    await vscode.workspace.fs.createDirectory(
      vscode.Uri.joinPath(targetUri, ".."),
    );
    await vscode.workspace.fs.writeFile(
      targetUri,
      new TextEncoder().encode(file.content),
    );
    written.set(file.uri, targetUri);
  }

  if (written.size === 0) {
    vscode.window.showErrorMessage(
      "None of the files in this playground link could be imported safely.",
    );
    return;
  }

  const focusedUri =
    (sharedWorkspace.focused && written.get(sharedWorkspace.focused)) ??
    written.values().next().value;
  if (focusedUri) {
    await vscode.window.showTextDocument(focusedUri, { preview: false });
  }

  const folderName = destinationRoot.path.slice(
    destinationRoot.path.lastIndexOf("/") + 1,
  );
  const action = await vscode.window.showInformationMessage(
    `Imported ${written.size} file${written.size === 1 ? "" : "s"} from the playground link into "${folderName}".`,
    "Reveal in Explorer",
  );
  if (action === "Reveal in Explorer") {
    await vscode.commands.executeCommand("revealInExplorer", destinationRoot);
  }

  if (skipped.length > 0) {
    const shown = skipped.slice(0, 3).join(", ");
    const more = skipped.length > 3 ? ` and ${skipped.length - 3} more` : "";
    vscode.window.showWarningMessage(
      `Skipped ${skipped.length} file${skipped.length === 1 ? "" : "s"} with an unsafe or unexpected path: ${shown}${more}.`,
    );
  }
}

async function promptForPlaygroundLink(): Promise<string | undefined> {
  const clipboardLink = await getClipboardLinkIfValid();
  const input = await vscode.window.showInputBox({
    title: "Import Playground Link",
    prompt: "Paste a PL/I playground link",
    value: clipboardLink,
    placeHolder:
      "https://zowe.github.io/zowe-pli-language-support/main/?workspace=...",
    validateInput: (value) => {
      const trimmed = value.trim();
      if (!trimmed) {
        return undefined;
      }
      return parseSharedWorkspaceFromLink(trimmed)
        ? undefined
        : "This doesn't look like a valid playground link.";
    },
  });
  return input?.trim() || undefined;
}

async function getClipboardLinkIfValid(): Promise<string | undefined> {
  try {
    const text = (await vscode.env.clipboard.readText()).trim();
    return parseSharedWorkspaceFromLink(text) ? text : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Parse a playground link (either the multi-file `workspace` format or the
 * single-file `content`/`filename` format) into a {@link SharedWorkspace}.
 */
function parseSharedWorkspaceFromLink(
  link: string,
): SharedWorkspace | undefined {
  let url: URL;
  try {
    url = new URL(link);
  } catch {
    return undefined;
  }

  const encodedWorkspace = url.searchParams.get("workspace");
  if (encodedWorkspace) {
    return decodePlaygroundWorkspace(encodedWorkspace);
  }

  const encodedContent = url.searchParams.get("content");
  if (encodedContent) {
    const filename = sanitizeSharedFilename(url.searchParams.get("filename"));
    const virtualUri = `${VIRTUAL_ROOT_PREFIX}${filename}`;
    return {
      focused: virtualUri,
      files: [
        { uri: virtualUri, content: decodePlaygroundContent(encodedContent) },
      ],
    };
  }

  return undefined;
}

async function resolveTargetWorkspaceFolder(): Promise<
  vscode.WorkspaceFolder | undefined
> {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    vscode.window.showErrorMessage(
      "Open a folder before importing a playground link.",
    );
    return undefined;
  }
  if (folders.length === 1) {
    return folders[0];
  }
  return vscode.window.showWorkspaceFolderPick({
    placeHolder:
      "Select the workspace folder to import the playground link into",
  });
}

async function createImportSubfolder(root: vscode.Uri): Promise<vscode.Uri> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  let name = `playground-import-${timestamp}`;
  let candidate = vscode.Uri.joinPath(root, name);
  let suffix = 1;
  while (await exists(candidate)) {
    name = `playground-import-${timestamp}-${suffix++}`;
    candidate = vscode.Uri.joinPath(root, name);
  }
  await vscode.workspace.fs.createDirectory(candidate);
  return candidate;
}

/**
 * Maps a file's virtual `/workspace/...` URI (untrusted: it comes from an
 * externally-shared link) onto a real URI under `destinationRoot`, rejecting
 * anything that isn't a plain, contained relative path — guards against
 * path traversal (e.g. `/workspace/../../evil.txt`) escaping the fresh
 * import subfolder.
 */
function mapVirtualPathToSafeUri(
  virtualUri: string,
  destinationRoot: vscode.Uri,
): vscode.Uri | undefined {
  if (!virtualUri.startsWith(VIRTUAL_ROOT_PREFIX)) {
    return undefined;
  }

  const segments = virtualUri.slice(VIRTUAL_ROOT_PREFIX.length).split("/");
  if (
    segments.some(
      (segment) =>
        segment === "" ||
        segment === "." ||
        segment === ".." ||
        // Backslashes are ordinary filename characters on POSIX, but some
        // filesystem APIs (notably Windows) treat them as separators, so a
        // segment like "..\\..\\evil" could still traverse there.
        segment.includes("\\"),
    )
  ) {
    return undefined;
  }

  const targetUri = vscode.Uri.joinPath(destinationRoot, ...segments);
  const destinationPrefix = destinationRoot.path.endsWith("/")
    ? destinationRoot.path
    : `${destinationRoot.path}/`;
  if (!targetUri.path.startsWith(destinationPrefix)) {
    return undefined;
  }

  return targetUri;
}
