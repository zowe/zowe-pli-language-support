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

import { plainItem } from "../workspace/plugin-configuration-provider";
import { UriUtils } from "./uri";
import { PluginConfiguration } from "../language-server/constants";
import { WorkspaceContext } from "../workspace/workspace-context";

/**
 * Creates or updates the program configuration for the given program path.
 *
 * If no existing configs are registered, both the program config file and
 * process groups file are created from scratch. Otherwise, the existing
 * program config file is read and updated with the new program entry.
 *
 * @param programPath - Absolute path to the program to register.
 * @param workspace - Workspace context owning the file system and config.
 */
export async function updateOrCreateConfig(
  programPath: string,
  workspace: WorkspaceContext,
): Promise<void> {
  const config = workspace.config;
  const workspaceFolderUri = config.getWorkspaceUri();
  if (!workspaceFolderUri) {
    // Fallback workspace: there is no workspace to write config files into.
    return;
  }
  const hasExistingConfigs = config.hasRegisteredProgramConfigs();

  if (!hasExistingConfigs) {
    try {
      await config.writeProgramConfigFile(
        config.defaultProgramConfigContent(programPath),
      );
      await config.writeProcessGroupsFile();
    } catch (err) {
      console.error("Failed to create initial config files:", err);
      throw err;
    }
    return;
  }

  const configFilePath = UriUtils.joinPath(
    workspaceFolderUri,
    PluginConfiguration.PROGRAM_FILE_PATH,
  );

  const fileExists = await workspace.fs.fileExists(configFilePath);
  if (!fileExists) {
    try {
      await config.writeProgramConfigFile();
    } catch (err) {
      console.error("Failed to create program config file:", err);
      throw err;
    }
    return;
  }

  try {
    const progConfigFile = await workspace.fs.readFile(configFilePath);
    if (!progConfigFile) {
      return;
    }
    const parsedTextContent = JSON.parse(progConfigFile);
    if (!parsedTextContent || !Array.isArray(parsedTextContent.pgms)) {
      console.error("Unexpected format in program config file");
      return;
    }
    parsedTextContent.pgms.push({ program: programPath, pgroup: "default" });
    await config.writeProgramConfigFile(parsedTextContent);

    config.addProgramConfig(workspaceFolderUri, {
      program: plainItem(programPath),
      pgroup: plainItem("default"),
      compilerOptions: [],
    });
  } catch (err) {
    console.error("Failed to read or update program config file:", err);
    throw err;
  }
}
