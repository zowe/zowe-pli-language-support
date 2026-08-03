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

import { Messages, UriUtils } from "pli-language";
import * as vscode from "vscode";
import { BaseLanguageClient } from "vscode-languageclient";
import { sendNotification } from "./messages";

type ConfigKey = "pgm_conf" | "proc_grps";

export function registerConfigLoader(client: BaseLanguageClient, context: vscode.ExtensionContext): vscode.Disposable {
  return client.onRequest(Messages.GetGlobalConfig.method, async (workspaceUri) => {
    return getGlobalConfig(UriUtils.toUri(workspaceUri), deriveUserSettingsUri(context.globalStorageUri));
  });
}

/**
 * Locates each PL/I plugin config value in VS Code settings and reports
 * back the actual JSON document URI plus the path inside that document.
 *
 * Scope precedence mirrors VS Code's normal resolution:
 *   workspaceFolder > workspace > user (global).
 *
 * The LS uses the result to read the source file via its `FileSystemProvider`
 * and parse the subtree directly - so diagnostics on a bad `pgroup`
 * reference (etc.) squiggle inside the right `settings.json` or
 * `.code-workspace` file.
 */
async function getGlobalConfig(
  workspaceUri: vscode.Uri,
  userSettingsUri: vscode.Uri,
): Promise<Messages.GlobalConfig> {
  const workspaceFolder = locateWorkspaceFolder(workspaceUri);
  const result: Messages.GlobalConfig = {};
  if (workspaceFolder) {
    const pgmConf = locate("pgm_conf", workspaceFolder, userSettingsUri);
    if (pgmConf) result.pgmConf = pgmConf;
    const procGrps = locate("proc_grps", workspaceFolder, userSettingsUri);
    if (procGrps) result.procGrps = procGrps;
  } else {
    result.pgmConf = {
      uri: userSettingsUri.toString(),
      containerPath: [],
      configKey: "pli.pgm_conf",
    };
    result.procGrps = {
      uri: userSettingsUri.toString(),
      containerPath: [],
      configKey: "pli.proc_grps",
    };
  }
  return result;
}

function locate(
  key: ConfigKey,
  folder: vscode.Uri,
  userSettingsUri: vscode.Uri,
): Messages.GlobalConfigEntry | undefined {
  const inspect = vscode.workspace.getConfiguration("pli", folder).inspect(key);
  if (!inspect) return undefined;

  const entry = (
    uri: vscode.Uri,
    containerPath: string[] = [],
  ): Messages.GlobalConfigEntry => ({
    uri: uri.toString(),
    containerPath,
    configKey: `pli.${key}`,
  });
  const vscodeSettingsUri = vscode.Uri.joinPath(
    folder,
    ".vscode",
    "settings.json",
  );

  // Most-specific scope wins. The `*LanguageValue` variants are
  // ignored - `pli.pgm_conf` isn't language-scoped.
  if (inspect.workspaceFolderValue !== undefined) {
    return entry(vscodeSettingsUri);
  }
  if (inspect.workspaceValue !== undefined) {
    const workspaceFile = vscode.workspace.workspaceFile;
    if (workspaceFile && workspaceFile.scheme !== "untitled") {
      // Multi-root or saved workspace: value lives inside the
      // `.code-workspace` file under the `settings` object.
      return entry(workspaceFile, ["settings"]);
    }
    // Single-folder workspace: VS Code treats `.vscode/settings.json`
    // as the workspace scope.
    return entry(vscodeSettingsUri);
  }
  if (inspect.globalValue !== undefined) {
    return entry(userSettingsUri);
  }
  return undefined;
}

/**
 * Computes the user-scope `settings.json` URI from an extension's
 * `globalStorageUri`. VS Code's `globalStorageUri` always resolves to
 * `<userdata>/User/globalStorage/<extensionId>` (on every platform and
 * in remote/web), so going up two levels gives us `<userdata>/User`,
 * and that's where `settings.json` lives.
 */
export function deriveUserSettingsUri(
  globalStorageUri: vscode.Uri,
): vscode.Uri {
  return vscode.Uri.joinPath(globalStorageUri, "..", "..", "settings.json");
}

/**
 * Watches the `pli.pgm_conf` / `pli.proc_grps` settings for changes and
 * pings the LS so it reloads the settings-fallback configuration. Edits
 * to `.pliplugin/` files go through the LSP file watcher.
 */
export function watchPluginSettings(
  client: BaseLanguageClient,
): vscode.Disposable {
  return vscode.workspace.onDidChangeConfiguration((e) => {
    if (
      e.affectsConfiguration("pli.pgm_conf") ||
      e.affectsConfiguration("pli.proc_grps")
    ) {
      sendNotification(
        client,
        Messages.OnDidChangePluginConfigSettingsNotification,
      );
    }
  });
}

export function locateWorkspaceFolder(
  textEditorUri: vscode.Uri,
): vscode.Uri | undefined {
  const workspaceFolders = (vscode.workspace.workspaceFolders ?? []).map(
    (folder) => folder.uri,
  );
  let workspaceFolderUri: vscode.Uri | undefined;

  for (const folder of workspaceFolders) {
    if (UriUtils.contains(folder, textEditorUri)) {
      if (
        !workspaceFolderUri ||
        UriUtils.toNormalizedKey(folder).length >
          UriUtils.toNormalizedKey(workspaceFolderUri).length
      ) {
        workspaceFolderUri = folder;
      }
    }
  }
  return workspaceFolderUri;
}
