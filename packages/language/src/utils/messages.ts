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
import type { Connection } from "vscode-languageserver";

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

// Typed wrappers around the raw string-keyed connection API. They live here (not in
// connection-handler.ts) so modules reachable from `CompilationUnit` can use them
// without an import cycle through connection-handler.

export function onRequest<P, R>(
  connection: Connection,
  type: RequestType<P, R>,
  handler: (params: P) => R | Promise<R>,
): void {
  connection.onRequest(type.method, handler);
}

export function sendRequest<P, R>(
  connection: Connection,
  type: RequestType<P, R>,
  params: P,
): Promise<R> {
  return connection.sendRequest(type.method, params);
}

export function onNotification<P>(
  connection: Connection,
  type: NotificationType<P>,
  handler: (params: P) => void | Promise<void>,
): void {
  connection.onNotification(type.method, handler);
}

export function sendNotification<P>(
  connection: Connection,
  type: NotificationType<P>,
  params: P,
): void {
  connection.sendNotification(type.method, params);
}

export namespace Messages {
  export const GetGlobalConfig = createRequestType<
    string,
    Messages.GlobalConfig
  >("pli/getGlobalConfig");

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

  /** How a file matches `pgm_conf.json` program entries. */
  export type ProgramConfigMatchKind = "exact" | "glob" | "none";

  /** Backs client-side language identification of configured program entries. */
  export const MatchesProgramConfig = createRequestType<
    string,
    ProgramConfigMatchKind
  >("pli/matchesProgramConfig");

  /**
   * Notification sent to the language client to inform that an operation is in progress.
   * Client should show a progress indicator until the operation is complete.
   */
  export const UpdateOperation = createNotificationType<string>(
    "pli/updateOperation",
  );

  /**
   * VS Code settings scope of a {@link GlobalConfigEntry}. `workspace` (folder
   * or workspace-file settings) ranks above `user`, matching VS Code.
   */
  export type GlobalConfigScope = "user" | "workspace";

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
    scope: GlobalConfigScope;
  }

  /**
   * VS Code settings backing for the plugin config. Each key may carry a
   * `user` and/or `workspace` entry.
   */
  export interface GlobalConfig {
    pgmConf?: GlobalConfigEntry[];
    procGrps?: GlobalConfigEntry[];
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

  /**
   * Request sent to the LS to get the fully preprocessed text of the
   * compilation unit that contains the given file URI.
   * Returns null if no compilation unit exists for the file.
   */
  export const GetPreprocessedText = createRequestType<string, string | null>(
    "pli/getPreprocessedText",
  );

  /**
   * Notification sent to the language client when the preprocessed text of a
   * compilation unit has changed. Carries the URIs of all files belonging to
   * the unit, so the client only refreshes preprocessed text views showing
   * that unit.
   */
  export const PreprocessedTextChanged = createNotificationType<{
    uris: string[];
  }>("pli/preprocessedTextChanged");
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
