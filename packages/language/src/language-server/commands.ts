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

import { URI } from "vscode-uri";
import { FileSystemProviderInstance } from "../workspace/file-system-provider";
import { PluginConfigurationProviderInstance } from "../workspace/plugin-configuration-provider";
import { ExecuteCommandParams } from "vscode-languageserver";
import { UriUtils } from "../utils/uri";
import { PluginConfiguration } from "./constants";
import { updateOrCreateConfig } from "../utils/config";

export async function commandResolveInclude(params: ExecuteCommandParams) {
  const [uri, content] = params.arguments as string[];
  try {
    await FileSystemProviderInstance.writeFile(URI.parse(uri), content);
  } catch (err) {
    console.error("Failed to write proc_grps.json:", err);
  }
}

export async function commandCreateConfig(
  params: ExecuteCommandParams,
): Promise<undefined> {
  const workspacePath = PluginConfigurationProviderInstance.getWorkspacePath();
  if (!workspacePath.length || !params.arguments) {
    return;
  }

  const workspaceFolderUri = URI.parse(workspacePath);
  const programPath = params.arguments[0];
  if (!programPath.length) {
    return;
  }

  const configFilePath = UriUtils.joinPath(
    workspaceFolderUri,
    PluginConfiguration.PROGRAM_FILE_PATH,
  );

  let progConfigFile: string | undefined;
  try {
    progConfigFile = await FileSystemProviderInstance.readFile(configFilePath);
  } catch {
    console.info(
      `[Info] No existing "pgm_conf.json" found in workspace — a new configuration file will be created.`,
    );
  }

  await updateOrCreateConfig(
    workspaceFolderUri,
    configFilePath,
    progConfigFile,
    programPath,
  );
}
