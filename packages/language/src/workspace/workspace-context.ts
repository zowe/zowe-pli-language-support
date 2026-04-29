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

import { Connection } from "vscode-languageserver";
import { FileSystemProvider } from "./file-system-provider";
import { PluginConfigurationProvider } from "./plugin-configuration-provider";

/**
 * WorkspaceContext bundles the per-language-server-instance state that
 * other parts of the language need to function: a file-system provider
 * and the plugin-configuration provider that loads `.pliplugin/*.json`
 * through it.
 *
 * This replaces two implicit globals (`PluginConfigurationProviderInstance`
 * and `FileSystemProviderInstance`) that previously coupled the language
 * package to a single, mutable, module-scope singleton. The context is
 * threaded through explicitly: the language server creates one at
 * startup, attaches it to every {@link CompilationUnit} via
 * `services.workspace`, and passes it to handlers that don't have a unit
 * (code actions, commands, file watchers).
 *
 * Tests construct their own `WorkspaceContext` per test and pass it to
 * the helpers that build compilation units.
 */
export class WorkspaceContext {
  /**
   * Plugin configuration provider that owns the parsed `pgm_conf.json`
   * and `proc_grps.json` state and the lookups derived from them.
   */
  public readonly config: PluginConfigurationProvider;

  constructor(
    public readonly fs: FileSystemProvider,
    connection?: Connection,
  ) {
    this.config = new PluginConfigurationProvider(fs, connection);
  }
}
