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
  const entryUri = URI.parse(params.arguments[1]);
  const test = PluginConfigurationProviderInstance.getProgramConfig(entryUri);
  console.log(test);
  const test2 = PluginConfigurationProviderInstance.pushConfigProgram(
    workspaceFolderUri.path,
    programPath,
  );
  console.log(test2);
  // hasProgramConfig(entryUri);
  if (test2) {
    const FILE = await FileSystemProviderInstance.readFile(
      UriUtils.joinPath(
        workspaceFolderUri,
        PluginConfiguration.PROGRAM_FILE_PATH,
      ),
    );
    if (!FILE) return;
    const textContent = JSON.parse(FILE);
    console.log(textContent);
    textContent.pgms.push({
      program: programPath,
      pgroup: "default",
    });
    await FileSystemProviderInstance.writeFile(
      UriUtils.joinPath(
        workspaceFolderUri,
        PluginConfiguration.PROGRAM_FILE_PATH,
      ),
      JSON.stringify(textContent, null, 2));
      return;
  }
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
  } catch (err) {
    console.error("Failed to create configuration: ", err);
  }
}
