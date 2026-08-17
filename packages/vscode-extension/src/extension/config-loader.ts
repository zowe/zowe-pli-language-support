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

/**
 * Registers the LS-side handler for {@link Messages.GetGlobalConfig}.
 * Called once per language client (desktop + browser) so the LS can
 * fall back to VS Code settings when no `.pliplugin/` directory exists.
 *
 * The user-scope `settings.json` URI is derived from
 * {@link vscode.ExtensionContext.globalStorageUri} (via
 * {@link deriveUserSettingsUri}), which is the only documented way to reach
 * the user data directory without platform-specific path math.
 * (`vscode-userdata:/` is unreliable on desktop and is NOT used here.)
 */
export function registerConfigLoader(
  client: BaseLanguageClient,
  context: vscode.ExtensionContext,
): vscode.Disposable {
  return client.onRequest(
    Messages.GetGlobalConfig.method,
    async (workspaceUri) => {
      return getGlobalConfig(
        UriUtils.toUri(workspaceUri),
        deriveUserSettingsUri(context.globalStorageUri),
      );
    },
  );
}

/**
 * Locates each PL/I plugin config value in VS Code settings and reports
 * back the actual JSON document URI plus the path inside that document.
 *
 * Unlike VS Code's collapsed resolution, each key may yield an independent
 * `user` and/or `workspace` entry; the LS decides precedence (workspace over
 * user, both below `.pliplugin/`).
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
    if (pgmConf.length > 0) result.pgmConf = pgmConf;
    const procGrps = locate("proc_grps", workspaceFolder, userSettingsUri);
    if (procGrps.length > 0) result.procGrps = procGrps;
  } else {
    // No workspace folder contains the file: only user-scope settings can
    // apply, so report them directly.
    result.pgmConf = [
      {
        uri: userSettingsUri.toString(),
        containerPath: [],
        configKey: "pli.pgm_conf",
        scope: "user",
      },
    ];
    result.procGrps = [
      {
        uri: userSettingsUri.toString(),
        containerPath: [],
        configKey: "pli.proc_grps",
        scope: "user",
      },
    ];
  }
  return result;
}

/**
 * Returns one entry per settings scope that defines a value (user and/or
 * workspace). Unlike VS Code's `get()`, scopes are not collapsed — the LS
 * treats each as its own source. `*LanguageValue` variants are ignored.
 */
function locate(
  key: ConfigKey,
  folder: vscode.Uri,
  userSettingsUri: vscode.Uri,
): Messages.GlobalConfigEntry[] {
  const inspect = vscode.workspace.getConfiguration("pli", folder).inspect(key);
  if (!inspect) return [];

  const entry = (
    uri: vscode.Uri,
    scope: Messages.GlobalConfigScope,
    containerPath: string[] = [],
  ): Messages.GlobalConfigEntry => ({
    uri: uri.toString(),
    containerPath,
    configKey: `pli.${key}`,
    scope,
  });
  const vscodeSettingsUri = vscode.Uri.joinPath(
    folder,
    ".vscode",
    "settings.json",
  );

  const entries: Messages.GlobalConfigEntry[] = [];

  // User (global) scope.
  if (inspect.globalValue !== undefined) {
    entries.push(entry(userSettingsUri, "user"));
  }

  // Workspace scope. Within this bucket, workspace-folder settings win over
  // the workspace file, mirroring VS Code; the whole bucket outranks user.
  if (inspect.workspaceFolderValue !== undefined) {
    entries.push(entry(vscodeSettingsUri, "workspace"));
  } else if (inspect.workspaceValue !== undefined) {
    const workspaceFile = vscode.workspace.workspaceFile;
    if (workspaceFile && workspaceFile.scheme !== "untitled") {
      // Multi-root or saved workspace: value lives inside the
      // `.code-workspace` file under the `settings` object.
      entries.push(entry(workspaceFile, "workspace", ["settings"]));
    } else {
      // Single-folder workspace: VS Code treats `.vscode/settings.json`
      // as the workspace scope.
      entries.push(entry(vscodeSettingsUri, "workspace"));
    }
  }

  return entries;
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

/**
 * Finds the workspace folder that contains the given file URI. When folders
 * are nested, the most specific (longest matching) folder wins. Returns
 * `undefined` when no workspace folder contains the file.
 */
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
