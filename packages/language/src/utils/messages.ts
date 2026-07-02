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

export type RequestType<P, R> = {
  method: string;

  /**
   * Used to ensure correct typing. Do not use this property
   */
  readonly _?: [P, R];
};

export function createRequestType<P, R>(method: string): RequestType<P, R> {
  return { method };
}

export type NotificationType<P> = {
  method: string;
  /**
   * Used to ensure correct typing. Do not use this property
   */
  readonly _?: P;
};

export function createNotificationType<P>(method: string): NotificationType<P> {
  return { method };
}

export namespace Messages {
  /**
   * Notification sent to the LS when the workspace's plugin configuration changes.
   */
  export const OnDidChangePluginConfigSettingsNotification =
    createNotificationType<void>("workspace/didChangePluginConfig");

  /**
   * Request sent to the LS to check if a file is already present in the workspace (i.e. included in a program)
   */
  export const ExistingFile = createRequestType<string, boolean>(
    "pli/existingFile",
  );

  /**
   * Notification sent to the language client to inform that an operation is in progress.
   * Client should show a progress indicator until the operation is complete.
   */
  export const UpdateOperation = createNotificationType<string>(
    "pli/updateOperation",
  );

  /**
   * A single config entry sourced from VS Code settings.
   *
   * The LS reads the file, navigates to the entry, and parses the
   * subtree with the same loader used for `.pliplugin/` files - so
   * diagnostics underline the real source.
   */
  export interface GlobalConfigEntry {
    uri: string;
    containerPath: (string | number)[];
    configKey: string;
  }

  export interface GlobalConfig {
    pgmConf?: GlobalConfigEntry;
    procGrps?: GlobalConfigEntry;
  }

  /**
   * Request sent to the language client to get the global configuration.
   * Only required if no plugin configuration file is present in the workspace.
   */
  export const GetGlobalConfig = createRequestType<void, GlobalConfig>(
    "config/getGlobal",
  );
}
