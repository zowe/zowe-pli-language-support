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

export async function updateOrCreateConfig(
  workspaceFolderUri: URI,
  configFilePath: URI,
  progConfigFile: string | undefined,
  programPath: string,
) {
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
