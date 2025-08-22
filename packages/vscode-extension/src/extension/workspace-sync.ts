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
import { ProcessGroup } from "../../../language/src/workspace/plugin-configuration-provider";
import { LanguageClient } from "vscode-languageclient/browser.js";
import { WorkspaceDidChangePlipluginConfigNotification } from "pli-language";
import {
  FILE_SYSTEM_NAMESPACE,
  FileSystemMessage,
  LSFileAction,
  PLIPLUGIN_CONFIG_FILES,
} from "../utils";

/**
 * Generic glob pattern for common PL/I source files
 */
const FILE_PATTERNS = "*.{pli,pl1,inc,mac}";

/**
 * Helper to read files and notify the ls worker of their content
 * @param worker Web Worker instance for the language server
 * @param uri URI of the file to read
 * @param action Action performed on the file
 * @returns Promise<void>
 */
export async function readAndNotifyWorker(
  worker: Worker,
  uri: vscode.Uri,
  action: LSFileAction,
): Promise<void> {
  try {
    const content = await vscode.workspace.fs.readFile(uri);
    const contentStr = new TextDecoder().decode(content);
    notifyWorker(worker, uri, action, contentStr);
  } catch (error) {
    console.error(`Error reading file ${uri.toString()}:`, error);
  }
}

/**
 * Helper to notify the language server worker of file system changes
 * @param worker Web Worker instance for the language server
 * @param uri URI of the file that changed
 * @param action Action performed on the file
 * @param content Changed content of the file, if applicable
 */
export function notifyWorker(
  worker: Worker,
  uri: vscode.Uri,
  action: LSFileAction,
  content?: string,
): void {
  if (worker) {
    const message: FileSystemMessage = {
      namespace: FILE_SYSTEM_NAMESPACE,
      type: action,
      uri: uri.toString(),
      content: content,
    };
    worker.postMessage(message);
  }
}

/**
 * Synchronizes existing files in the workspace to the language server,
 * to populate its Virtual File System
 * @param client LanguageClient instance to notify of config changes
 * @param worker Web Worker instance for the language server
 */
export async function syncExistingFiles(
  client: LanguageClient,
  worker: Worker,
): Promise<void> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return;
  }

  for (const folder of workspaceFolders) {
    await syncWorkspaceFolder(worker, folder);
  }

  try {
    client.sendNotification(WorkspaceDidChangePlipluginConfigNotification);
  } catch (error) {
    console.error("Error sending configuration reload notification:", error);
  }
}

/**
 * Syncs a single workspace folder's relevant files to the language server
 * @param worker Web Worker instance for the language server
 * @param folder Workspace folder to sync
 * @returns Promise<void>
 */
async function syncWorkspaceFolder(
  worker: Worker,
  folder: vscode.WorkspaceFolder,
): Promise<void> {
  try {
    // Sync top-level PL/I program files using FILE_PATTERNS
    const programFiles = await vscode.workspace.findFiles(
      new vscode.RelativePattern(folder, FILE_PATTERNS),
    );
    for (const fileUri of programFiles) {
      await readAndNotifyWorker(worker, fileUri, LSFileAction.Add);
    }

    // add in the pli plugin config files
    for (const configFile of PLIPLUGIN_CONFIG_FILES) {
      const configFiles = await vscode.workspace.findFiles(
        new vscode.RelativePattern(folder, configFile),
      );
      for (const fileUri of configFiles) {
        await readAndNotifyWorker(worker, fileUri, LSFileAction.Add);
      }
    }

    // Find the proc_grps.json config file in the workspace
    const procGrpsFiles = await vscode.workspace.findFiles(
      new vscode.RelativePattern(folder, ".pliplugin/proc_grps.json"),
    );

    if (procGrpsFiles.length === 0) {
      console.warn("No proc_grps.json found in workspace");
      return;
    }

    // Read and parse the first proc_grps.json file
    const procGrpsContent = await vscode.workspace.fs.readFile(
      procGrpsFiles[0],
    );
    const procGrpsJson = JSON.parse(new TextDecoder().decode(procGrpsContent));
    const pgroups = procGrpsJson.pgroups || [];

    // load library files
    for (const pgroup of pgroups) {
      await syncLibraryFilesForProcGroup(worker, folder, pgroup);
    }
  } catch (error) {
    console.error("Error finding library files:", error);
  }
}

/**
 * Loads library files for a given program group (pgroup) based on its configuration.
 * @param worker Web Worker instance for the language server
 * @param folder Workspace folder
 * @param pgroup Process group configuration object, w/ valid libs & extensions properties
 */
async function syncLibraryFilesForProcGroup(
  worker: Worker,
  folder: vscode.WorkspaceFolder,
  pgroup: ProcessGroup,
) {
  const libs = pgroup.libs || [];
  const extensions: string[] = pgroup["include-extensions"] || [
    ".pli",
    ".pl1",
    ".inc",
    ".mac",
  ];
  for (const lib of libs) {
    // construct a glob pattern for the lib, e.g. "cpy/**/*.pli"
    const pattern = `${lib}/**/*.{${extensions.map((ext) => ext.slice(1)).join(",")}}`;

    // find libs with these extensions
    const libFiles = await vscode.workspace.findFiles(
      new vscode.RelativePattern(folder, pattern),
    );
    for (const fileUri of libFiles) {
      await readAndNotifyWorker(worker, fileUri, LSFileAction.Add);
    }

    // find libs w/out any extensions , e.g. "cpy/LIB"
    const noExtPattern = `${lib}/**/[^.]*`;
    const libFilesNoExt = await vscode.workspace.findFiles(
      new vscode.RelativePattern(folder, noExtPattern),
    );
    for (const fileUri of libFilesNoExt) {
      await readAndNotifyWorker(worker, fileUri, LSFileAction.Add);
    }
  }
}
