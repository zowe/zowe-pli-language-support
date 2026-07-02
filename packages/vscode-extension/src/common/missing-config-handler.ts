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
import { PluginConfiguration, UriUtils } from "pli-language";

let shouldShowInfoMessage = true;

export async function handleMissingConfig(
  textEditor: vscode.TextEditor | undefined,
) {
  if (!textEditor || !shouldShowInfoMessage) {
    return;
  }

  // settle on the 1st workspace folder available
  // TODO @montymxb May 15th, 2025: Support configs across multiple workspace folders
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspaceFolder) {
    return;
  }

  // check if we can create a .pliplugin folder
  const plipluginPath = path.join(workspaceFolder, ".pliplugin");
  const isPliDocument = textEditor.document.languageId === "pli";
  if (!isPliDocument || fs.existsSync(plipluginPath)) {
    return;
  }

  const workspaceParts = UriUtils.parts(
    UriUtils.toNormalizedKey(workspaceFolder),
  );
  const entryParts = UriUtils.parts(
    UriUtils.toNormalizedKey(textEditor.document.fileName),
  );
  const isInsideWorkspace = workspaceParts.every(
    (part, index) => part === entryParts[index],
  );
  const currentFileRelativePath = isInsideWorkspace
    ? entryParts.slice(workspaceParts.length).join("/")
    : UriUtils.normalizePath(textEditor.document.fileName);

  const options = {
    DONT_SHOW_AGAIN: "Don't show again",
    YES: "Yes",
    NO: "No",
  } as const;

  const userResponse = await vscode.window.showInformationMessage(
    `No startup configuration was found. Would you like to create one using '${currentFileRelativePath}' as the entry point?`,
    options.YES,
    options.NO,
    options.DONT_SHOW_AGAIN,
  );

  if (userResponse !== options.YES) {
    shouldShowInfoMessage = userResponse !== options.DONT_SHOW_AGAIN;
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
