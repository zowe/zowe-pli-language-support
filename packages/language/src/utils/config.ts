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
import { PluginConfiguration } from "../language-server/constants";
import { FileSystemProviderInstance } from "../workspace/file-system-provider";
import { PluginConfigurationProviderInstance } from "../workspace/plugin-configuration-provider";
import { UriUtils } from "../utils/uri";

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
      await FileSystemProviderInstance.writeFile(
        UriUtils.joinPath(
          workspaceFolderUri,
          PluginConfiguration.PROGRAM_FILE_PATH,
        ),
        JSON.stringify(
          {
            ...PluginConfiguration.DEFAULT_PROGRAM_FILE_CONTENT,
            pgms: [
              {
                ...PluginConfiguration.DEFAULT_PROGRAM_FILE_CONTENT.pgms[0],
                program: programPath,
              },
            ],
          },
          null,
          2,
        ),
      );

      await FileSystemProviderInstance.writeFile(
        UriUtils.joinPath(
          workspaceFolderUri,
          PluginConfiguration.PROCESS_GROUP_FILE_PATH,
        ),
        JSON.stringify(
          PluginConfiguration.DEFAULT_PROCESS_GROUP_FILE_CONTENT,
          null,
          2,
        ),
      );
      return;
    } catch (err) {
      console.error("Failed to create configuration: ", err);
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
    await FileSystemProviderInstance.writeFile(
      configFilePath,
      JSON.stringify(textContent, null, 2),
    );
  } catch (err) {
    console.error("Failed to create configuration: ", err);
    return;
  }
}
