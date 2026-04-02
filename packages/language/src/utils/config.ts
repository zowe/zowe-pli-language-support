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

import { PluginConfigurationProviderInstance } from "../workspace/plugin-configuration-provider";
import { FileSystemProviderInstance } from "../workspace/file-system-provider";
import { UriUtils } from "./uri";
import { PluginConfiguration } from "../language-server/constants";

/**
 * Creates or updates the program configuration for the given program path.
 *
 * If no existing configs are registered, both the program config file and
 * process groups file are created from scratch. Otherwise, the existing
 * program config file is read and updated with the new program entry.
 *
 * @param programPath - Absolute path to the program to register.
 */
export async function updateOrCreateConfig(programPath: string): Promise<void> {
  const hasExistingConfigs =
    PluginConfigurationProviderInstance.hasRegisteredProgramConfigs();

  if (!hasExistingConfigs) {
    try {
      await PluginConfigurationProviderInstance.writeProgramConfigFile(
        PluginConfigurationProviderInstance.defaultProgramConfigContent(
          programPath,
        ),
      );
      await PluginConfigurationProviderInstance.writeProcessGroupsFile();
    } catch (err) {
      console.error("Failed to create initial config files:", err);
      throw err;
    }
    return;
  }

  const workspaceFolderUri = UriUtils.toUri(
    PluginConfigurationProviderInstance.getWorkspacePath(),
  );
  const configFilePath = UriUtils.joinPath(
    workspaceFolderUri,
    PluginConfiguration.PROGRAM_FILE_PATH,
  );

  const fileExists =
    await FileSystemProviderInstance.fileExists(configFilePath);
  if (!fileExists) {
    try {
      await PluginConfigurationProviderInstance.writeProgramConfigFile();
    } catch (err) {
      console.error("Failed to create program config file:", err);
      throw err;
    }
    return;
  }

  try {
    const progConfigFile =
      await FileSystemProviderInstance.readFile(configFilePath);
    if (!progConfigFile) {
      return;
    }
    const parsedTextContent = JSON.parse(progConfigFile);
    if (!parsedTextContent || !Array.isArray(parsedTextContent.pgms)) {
      console.error("Unexpected format in program config file");
      return;
    }

    PluginConfigurationProviderInstance.addProgramConfig(workspaceFolderUri, {
      program: programPath,
      pgroup: "default",
    });

    parsedTextContent.pgms.push({ program: programPath, pgroup: "default" });
    await PluginConfigurationProviderInstance.writeProgramConfigFile(
      parsedTextContent,
    );
  } catch (err) {
    console.error("Failed to read or update program config file:", err);
    throw err;
  }
}
