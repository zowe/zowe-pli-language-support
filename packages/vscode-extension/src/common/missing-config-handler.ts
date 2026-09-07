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
  applyUserPluginConfig,
  programKeyForDocument,
  userPluginConfigExists,
  userPluginConfigHasProgram,
} from "./user-plugin-config";

let shouldShowInfoMessage = true;

const options = {
  DONT_SHOW_AGAIN: "Don't show again",
  YES: "Yes",
  NO: "No",
} as const;

/** Prompt for a missing startup config: `.pliplugin` in a workspace folder, user settings otherwise. */
export async function handleMissingConfig(
  textEditor: vscode.TextEditor | undefined,
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
  await handleConfigOutsideWorkspace(document, client);
}

async function promptForWorkspaceConfig(
  document: vscode.TextDocument,
  workspaceFolderUri: vscode.Uri,
): Promise<void> {
  if (!shouldShowInfoMessage) {
    return;
  }
  const workspaceFolder = workspaceFolderUri.fsPath;
  const plipluginUri = vscode.Uri.joinPath(workspaceFolderUri, ".pliplugin");
  try {
    await vscode.workspace.fs.stat(plipluginUri);
    return;
  } catch {
    // `.pliplugin` is not present.
  }
  const plipluginPath = path.join(workspaceFolder, ".pliplugin");

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
 * Ask before writing user settings. First create also reveals settings.json
 * so copybook `libs` can be added (user defaults ship with none). Append
 * does not toast: the user already confirmed in this prompt.
 */
async function handleConfigOutsideWorkspace(
  document: vscode.TextDocument,
  client: BaseLanguageClient,
): Promise<void> {
  // Only the server knows if a glob already covers this file.
  const identity = await identifyFile(document, client);
  if (!identity || identity.programMatch !== "none") {
    return;
  }

  // Exact entries in settings.json: skip even if the server has not loaded them yet.
  if (userPluginConfigHasProgram(document.uri)) {
    return;
  }

  if (!shouldShowInfoMessage) {
    return;
  }

  const program = programKeyForDocument(document.uri);
  const hasUserConfig = userPluginConfigExists();
  if (!(await askToCreateConfig(program, hasUserConfig))) {
    return;
  }

  await applyUserPluginConfig(document.uri);
}

/** "Don't show again" suppresses further prompts for this session (create or append). */
async function askToCreateConfig(
  entryPoint: string,
  appending = false,
): Promise<boolean> {
  const message = appending
    ? `Would you like to add '${entryPoint}' as an entry point to your user settings?`
    : `No startup configuration was found. Would you like to create one using '${entryPoint}' as the entry point?`;
  const userResponse = await vscode.window.showInformationMessage(
    message,
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
