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

export namespace Messages {
  /**
   * Notification sent to the LS when the workspace's plugin configuration changes.
   */
  export const WorkspaceDidChangePluginConfigNotification =
    "workspace/didChangePluginConfig";

  /**
   * Request sent to the LS to check if a file is already present in the workspace (i.e. included in a program)
   */
  export const ExistingFileRequest = "pli/existingFileRequest";

  /**
   * Notification sent to the language client to inform that an operation is in progress.
   * Client should show a progress indicator until the operation is complete.
   */
  export const UpdateOperation = "pli/updateOperation";
}
