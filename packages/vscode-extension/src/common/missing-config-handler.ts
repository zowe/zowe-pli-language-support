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
import * as path from "node:path";
import * as fs from "node:fs";
import { BaseLanguageClient } from "vscode-languageclient";
import { isVirtualFile, PluginConfiguration, UriUtils } from "pli-language";
import { locateWorkspaceFolder } from "../extension/config-loader";
import { identifyFile } from "../extension/document-identification";
import {
  ensureUserPluginConfig,
  programKeyForDocument,
  userPluginConfigExists,
} from "./user-plugin-config";
import {
  notifyUserConfigAppended,
  openUserSettings,
} from "../extension/user-settings";

let shouldShowInfoMessage = true;

/**
 * Session guard against duplicate appends: prompt, write, and config reload
 * are all async, so the same document can re-enter before its entry is visible.
 */
const handledUserConfigUris = new Set<string>();

const options = {
  DONT_SHOW_AGAIN: "Don't show again",
  YES: "Yes",
  NO: "No",
} as const;

/** Prompt for a missing startup config: `.pliplugin` in a workspace folder, user settings otherwise. */
export async function handleMissingConfig(
  textEditor: vscode.TextEditor | undefined,
  context: vscode.ExtensionContext,
  client: BaseLanguageClient,
) {
  if (!textEditor || textEditor.document.languageId !== "pli") {
    return;
  }
  const document = textEditor.document;
  if (isVirtualFile(document.uri.toString())) {
    // No meaningful entry-point path (untitled, git diffs, generated views).
    return;
  }

  const workspaceFolderUri = locateWorkspaceFolder(document.uri);
  if (workspaceFolderUri) {
    await promptForWorkspaceConfig(document, workspaceFolderUri);
    return;
  }
  await handleConfigOutsideWorkspace(document, context, client);
}

async function promptForWorkspaceConfig(
  document: vscode.TextDocument,
  workspaceFolderUri: vscode.Uri,
): Promise<void> {
  if (!shouldShowInfoMessage) {
    return;
  }
  const workspaceFolder = workspaceFolderUri.fsPath;
  const plipluginPath = path.join(workspaceFolder, ".pliplugin");
  if (fs.existsSync(plipluginPath)) {
    return;
  }

  const currentFileRelativePath = UriUtils.workspaceRelativeEntryPath(
    workspaceFolder,
    document.fileName,
  );

  if (!(await askToCreateConfig(currentFileRelativePath))) {
    return;
  }

  try {
    fs.mkdirSync(plipluginPath);
    fs.writeFileSync(
      path.join(plipluginPath, "pgm_conf.json"),
      JSON.stringify(
        {
          ...PluginConfiguration.DEFAULT_PROGRAM_FILE_CONTENT,
          pgms: [
            {
              ...PluginConfiguration.DEFAULT_PROGRAM_FILE_CONTENT.pgms[0],
              program: currentFileRelativePath,
            },
          ],
        },
        null,
        2,
      ),
    );

    fs.writeFileSync(
      path.join(plipluginPath, "proc_grps.json"),
      JSON.stringify(
        PluginConfiguration.DEFAULT_PROCESS_GROUP_FILE_CONTENT,
        null,
        2,
      ),
    );

    vscode.window.showInformationMessage(
      "'.pliplugin' folder and files created successfully.",
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to create '.pliplugin' folder: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * First create also reveals settings.json so the user can add copybook `libs`
 * (user defaults ship with none). Later files are appended without a prompt.
 */
async function handleConfigOutsideWorkspace(
  document: vscode.TextDocument,
  context: vscode.ExtensionContext,
  client: BaseLanguageClient,
): Promise<void> {
  const uriKey = document.uri.toString();
  if (handledUserConfigUris.has(uriKey)) {
    return;
  }

  // Only the server knows if a glob already covers this file.
  const { programMatch } = await identifyFile(document, client);
  if (programMatch !== "none") {
    return;
  }

  const hasUserConfig = userPluginConfigExists();
  if (!hasUserConfig) {
    if (!shouldShowInfoMessage) {
      return;
    }
    if (!(await askToCreateConfig(programKeyForDocument(document.uri)))) {
      return;
    }
  }

  handledUserConfigUris.add(uriKey);
  try {
    const result = await ensureUserPluginConfig(document.uri);
    if (result === "created") {
      await openUserSettings(context);
    } else if (result === "appended") {
      await notifyUserConfigAppended(
        programKeyForDocument(document.uri),
        context,
      );
    }
  } catch (error) {
    handledUserConfigUris.delete(uriKey);
    vscode.window.showErrorMessage(
      `Failed to update the PL/I user settings: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/** "Don't show again" only suppresses this prompt, not silent appends once a config exists. */
async function askToCreateConfig(entryPoint: string): Promise<boolean> {
  const userResponse = await vscode.window.showInformationMessage(
    `No startup configuration was found. Would you like to create one using '${entryPoint}' as the entry point?`,
    options.YES,
    options.NO,
    options.DONT_SHOW_AGAIN,
  );

  if (userResponse !== options.YES) {
    shouldShowInfoMessage = userResponse !== options.DONT_SHOW_AGAIN;
    return false;
  }
  return true;
}
