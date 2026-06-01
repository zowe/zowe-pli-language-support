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

import { Messages } from "pli-language";
import * as vscode from "vscode";
import { BaseLanguageClient } from "vscode-languageclient";
import { onRequest, sendNotification } from "./messages";

type ConfigKey = "pgm_conf" | "proc_grps";

/**
 * Registers the LS-side handler for {@link Messages.GetGlobalConfig}.
 * Called once per language client (desktop + browser) so the LS can
 * fall back to VS Code settings when no `.pliplugin/` directory exists.
 *
 * `userSettingsUri` is the URI of the user-scope `settings.json` —
 * derived from {@link vscode.ExtensionContext.globalStorageUri} in the
 * caller, which is the only documented way to reach the user data
 * directory without platform-specific path math. (`vscode-userdata:/`
 * is unreliable on desktop and is NOT used here.)
 */
export function registerConfigLoader(
  client: BaseLanguageClient,
  userSettingsUri: vscode.Uri,
): void {
  onRequest(client, Messages.GetGlobalConfig, () =>
    getGlobalConfig(userSettingsUri),
  );
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
export async function getGlobalConfig(
  userSettingsUri: vscode.Uri,
): Promise<Messages.GlobalConfig> {
  // TODO: support multi-root workspaces here as well
  const folder = vscode.workspace.workspaceFolders?.[0];
  const result: Messages.GlobalConfig = {};
  if (folder) {
    const pgmConf = locate("pgm_conf", folder, userSettingsUri);
    if (pgmConf) result.pgmConf = pgmConf;
    const procGrps = locate("proc_grps", folder, userSettingsUri);
    if (procGrps) result.procGrps = procGrps;
  }
  return result;
}

function locate(
  key: ConfigKey,
  folder: vscode.WorkspaceFolder,
  userSettingsUri: vscode.Uri,
): Messages.GlobalConfigEntry | undefined {
  const inspect = vscode.workspace.getConfiguration("pli", folder).inspect(key);
  if (!inspect) return undefined;

  // Most-specific scope wins. The `*LanguageValue` variants are
  // ignored - `pli.pgm_conf` isn't language-scoped.
  if (inspect.workspaceFolderValue !== undefined) {
    return {
      uri: vscode.Uri.joinPath(
        folder.uri,
        ".vscode",
        "settings.json",
      ).toString(),
      containerPath: [],
      configKey: `pli.${key}`,
    };
  }
  if (inspect.workspaceValue !== undefined) {
    const workspaceFile = vscode.workspace.workspaceFile;
    if (workspaceFile && workspaceFile.scheme !== "untitled") {
      // Multi-root or saved workspace: value lives inside the
      // `.code-workspace` file under the `settings` object.
      return {
        uri: workspaceFile.toString(),
        containerPath: ["settings"],
        configKey: `pli.${key}`,
      };
    }
    // Single-folder workspace: VS Code treats `.vscode/settings.json`
    // as the workspace scope.
    return {
      uri: vscode.Uri.joinPath(
        folder.uri,
        ".vscode",
        "settings.json",
      ).toString(),
      containerPath: [],
      configKey: `pli.${key}`,
    };
  }
  if (inspect.globalValue !== undefined) {
    return {
      uri: userSettingsUri.toString(),
      containerPath: [],
      configKey: `pli.${key}`,
    };
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
 * to `.pliplugin/` files go through {@link watchPluginFolder} instead;
 * the LS treats both inputs as triggers for the same reload path.
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
        Messages.WorkspaceDidChangePluginConfigNotification,
      );
    }
  });
}
