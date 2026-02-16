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
import { PluginConfigurationProviderInstance } from "../workspace/plugin-configuration-provider";
import { FileSystemProviderInstance } from "../workspace/file-system-provider";
import { UriUtils } from "./uri";
import { PluginConfiguration } from "../language-server/constants";

export async function updateOrCreateConfig(programPath: string): Promise<void> {
  const hasExistingConfigs =
    PluginConfigurationProviderInstance.hasRegisteredProgramConfigs();

  if (!hasExistingConfigs) {
    try {
      await PluginConfigurationProviderInstance.writeProgramConfigFile(
        programPath,
      );
      await PluginConfigurationProviderInstance.writeProcessGroupsFile();
    } catch (err) {
      console.error(err);
    }
    return;
  }
  const workspaceFolderUri = URI.parse(
    PluginConfigurationProviderInstance.getWorkspacePath(),
  );
  const configFilePath = UriUtils.joinPath(
    workspaceFolderUri,
    PluginConfiguration.PROGRAM_FILE_PATH,
  );
  const progConfigFile =
    await FileSystemProviderInstance.readFile(configFilePath);
  if (!progConfigFile) {
    return;
  }
  const textContent = JSON.parse(progConfigFile);

  PluginConfigurationProviderInstance.addProgramConfig(
    workspaceFolderUri,
    { program: programPath, pgroup: "default" },
    programPath,
    textContent,
  );
}
