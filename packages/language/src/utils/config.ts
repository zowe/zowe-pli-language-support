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
  const hasExistingConfigs = PluginConfigurationProviderInstance.hasRegisteredProgramConfigs();
  console.log(hasExistingConfigs);
  const workspaceFolderUri = URI.parse(
    PluginConfigurationProviderInstance.getWorkspacePath(),
  );
  
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
  const canAddToExistingConfig =
    PluginConfigurationProviderInstance.addProgramConfig(
      workspaceFolderUri.path,
      { program: programPath, pgroup: "default" },
    );

  if (!canAddToExistingConfig) {
    try {
      await PluginConfigurationProviderInstance.writeProgramConfigFile(
        programPath,
      );
      await PluginConfigurationProviderInstance.writeProcessGroupsFile();
    } catch (err) {
      console.error(err);
      return;
    }
  }

  if (!progConfigFile) {
    return;
  }
  try {
    const textContent = JSON.parse(progConfigFile);
    if (
      !textContent ||
      typeof textContent !== "object" ||
      !Array.isArray(textContent.pgms)
    ) {
      console.error("Invalid configuration file format");
      return;
    }
    textContent.pgms.push({
      program: programPath,
      pgroup: "default",
    });
    await PluginConfigurationProviderInstance.writeProgramConfigFile(
      configFilePath.path,
      textContent,
    );
  } catch (err) {
    console.error("Failed to create configuration: ", err);
    return;
  }
}
