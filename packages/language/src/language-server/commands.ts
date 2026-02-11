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
import { updateExistingConfig, createNewConfig } from "../utils/config";

export async function commandResolveInclude(params: ExecuteCommandParams) {
  const [uri, content] = params.arguments as string[];
  try {
    await FileSystemProviderInstance.writeFile(URI.parse(uri), content);
  } catch (err) {
    console.error("Failed to write proc_grps.json:", err);
  }
}

export async function commandCreateConfig(params: ExecuteCommandParams) {
  const workspaceFolderUri = URI.parse(
    PluginConfigurationProviderInstance.getWorkspacePath(),
  );

  if (!workspaceFolderUri || !params.arguments) {
    return;
  }

  const programPath = params.arguments[0];
  const configFilePath = UriUtils.joinPath(
    workspaceFolderUri,
    PluginConfiguration.PROGRAM_FILE_PATH,
  );

  const progConfigFile =
    await FileSystemProviderInstance.readFile(configFilePath);

  if (progConfigFile) {
    await updateExistingConfig(
      workspaceFolderUri,
      configFilePath,
      progConfigFile,
      programPath,
    );
  } else {
    await createNewConfig(workspaceFolderUri, programPath);
  }
}
