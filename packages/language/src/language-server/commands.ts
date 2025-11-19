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
import { Mutex } from "../workspace/mutex";
import { PluginConfigurationProviderInstance } from "../workspace/plugin-configuration-provider";
import { ExecuteCommandParams } from "vscode-languageserver";
import { UriUtils } from "../utils/uri";
import { PluginConfiguration } from "./constants";

export async function commandResolveInclude(params: ExecuteCommandParams) {
  return Mutex.run(async () => {
    const [uri, content] = params.arguments as string[];
    try {
      await FileSystemProviderInstance.writeFile(URI.parse(uri), content);
    } catch (err) {
      console.error("Failed to write proc_grps.json:", err);
    }
  });
}

export async function commandCreateConfig(params: ExecuteCommandParams) {
  return Mutex.run(async () => {
    const workspaceFolderUri = URI.parse(
      PluginConfigurationProviderInstance.getWorkspacePath(),
    );
    if (!workspaceFolderUri || !params.arguments) {
      return;
    }
    try {
      const entryUri = params.arguments[0];
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
                program: entryUri,
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
    } catch (err) {
      console.error("Failed to create configuration: ", err);
    }
  });
}
