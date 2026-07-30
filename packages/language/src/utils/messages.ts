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

import { URI } from "./uri";

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
  export const GetGlobalConfig = createRequestType<string, Messages.GlobalConfig>(
    "pli/getGlobalConfig",
  );

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
   * Location information for a plugin configuration entry (either a
   * program entry in pgm_conf.json or a process group entry in
   * proc_grps.json). Used by the "Go to Program Configuration" and
   * "Go to Process Group" commands to navigate to the entry that
   * applies to a given .pli file.
   */
  export interface PluginConfigEntryLocation {
    /** URI of the config file (or settings.json / .code-workspace file) */
    uri: string;
    /** Range of the entry in the file */
    range: {
      start: { line: number; character: number };
      end: { line: number; character: number };
    };
  }

  /**
   * Request sent to the LS to get the source location of the program
   * configuration that applies to a given file URI.
   * Returns null if no configuration matches the file.
   */
  export const GetProgramConfigLocation = createRequestType<
    string,
    PluginConfigEntryLocation | null
  >("pli/getProgramConfigLocation");

  /**
   * Request sent to the LS to get the source location of the process
   * group configuration bound to the program configuration that applies
   * to a given file URI.
   * Returns null if no configuration matches the file, or the matching
   * program configuration has no resolvable process group.
   */
  export const GetProcessGroupLocation = createRequestType<
    string,
    PluginConfigEntryLocation | null
  >("pli/getProcessGroupLocation");
}

export interface GlobalConfigLoader {
  loadGlobalConfig(workspaceUri: URI): Promise<Messages.GlobalConfig>;
}

export class TestGlobalConfigLoader implements GlobalConfigLoader {
  constructor(private readonly config: Messages.GlobalConfig) {}
  loadGlobalConfig(_workspaceUri: URI): Promise<Messages.GlobalConfig> {
    return Promise.resolve(this.config);
  }
}