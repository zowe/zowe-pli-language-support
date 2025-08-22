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

import { PluginConfigurationProvider } from "../../language/src/workspace/plugin-configuration-provider";

/**
 * File actions that can be communicated to the language server
 */
export enum LSFileAction {
  Add = "add",
  Delete = "delete",
  Rename = "rename",
}

export const FILE_SYSTEM_NAMESPACE = "file-system";

export const PLIPLUGIN_CONFIG_FILES = [
  PluginConfigurationProvider.PROGRAM_CONFIG_FILE,
  PluginConfigurationProvider.PROCESS_GROUP_CONFIG_FILE,
];

/**
 * Message format for file system changes
 */
export interface FileSystemMessage {
  namespace: typeof FILE_SYSTEM_NAMESPACE;
  type: LSFileAction;
  uri: string;
  content?: string;
}
