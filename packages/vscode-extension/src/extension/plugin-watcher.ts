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

import { TelemetryReporter } from "@vscode/extension-telemetry";
import { Messages } from "pli-language";
import * as vscode from "vscode";
import { BaseLanguageClient } from "vscode-languageclient";

/**
 * Watches the .pliplugin folder for changes to pgm_conf.json and proc_grps.json files.
 * Sends a notification to the LS when changes are detected
 */
export function watchPluginFolder(
  client: BaseLanguageClient,
  workspaceFolder: string,
  context: vscode.ExtensionContext,
  telemetryReporter?: TelemetryReporter,
): void {
  const folderPattern = new vscode.RelativePattern(
    workspaceFolder,
    ".pliplugin",
  );
  const filePattern = new vscode.RelativePattern(
    workspaceFolder,
    ".pliplugin/*.json",
  );

  const folderWatcher = vscode.workspace.createFileSystemWatcher(folderPattern);
  const fileWatcher = vscode.workspace.createFileSystemWatcher(filePattern);

  // watch for folder create/delete events
  folderWatcher.onDidCreate(() => {
    client.sendNotification(
      Messages.WorkspaceDidChangePluginConfigNotification,
    );
    telemetryReporter?.sendTelemetryEvent(
      "pli.language.support.onDidCreate.folder",
    );
  });

  folderWatcher.onDidDelete(() => {
    client.sendNotification(
      Messages.WorkspaceDidChangePluginConfigNotification,
    );
    telemetryReporter?.sendTelemetryEvent(
      "pli.language.support.onDidDelete.folder",
    );
  });

  // watch for file create/update/delete events
  fileWatcher.onDidChange(() => {
    client.sendNotification(
      Messages.WorkspaceDidChangePluginConfigNotification,
    );
    telemetryReporter?.sendTelemetryEvent(
      "pli.language.support.onDidChange.file",
    );
  });

  fileWatcher.onDidCreate(() => {
    client.sendNotification(
      Messages.WorkspaceDidChangePluginConfigNotification,
    );
    telemetryReporter?.sendTelemetryEvent(
      "pli.language.support.onDidCreate.file",
    );
  });

  fileWatcher.onDidDelete(() => {
    client.sendNotification(
      Messages.WorkspaceDidChangePluginConfigNotification,
    );
    telemetryReporter?.sendTelemetryEvent(
      "pli.language.support.onDidDelete.file",
    );
  });

  context.subscriptions.push(folderWatcher, fileWatcher);
}
