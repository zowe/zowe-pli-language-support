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

import { FileSystemProvider } from "./file-system-provider";
import { PluginConfigurationProvider } from "./plugin-configuration-provider";
import { CompilationUnit, createCompilationUnit } from "./compilation-unit";
import { URI, UriUtils } from "../utils/uri";
import {
  LongRunningOperation,
  LongRunningOperationImpl,
} from "../utils/promises";
import { GlobalConfigLoader } from "../utils/messages";
import { LibraryCaches, newLibraryCaches } from "../config/lib-expander";

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
  private compilationUnits: Map<string, CompilationUnit> = new Map();
  /**
   * Plugin configuration provider that owns the parsed `pgm_conf.json`
   * and `proc_grps.json` state and the lookups derived from them.
   */
  public readonly config: PluginConfigurationProvider;

  constructor(
    public readonly fs: FileSystemProvider,
    globalConfigLoader: GlobalConfigLoader,
    longRunningOperation?: LongRunningOperation,
    caches?: LibraryCaches,
  ) {
    this.config = new PluginConfigurationProvider(
      fs,
      globalConfigLoader,
      longRunningOperation ?? LongRunningOperationImpl.Dummy,
      caches ?? newLibraryCaches(),
    );
  }

  setCompilationUnit(uri: URI, unit: CompilationUnit): void {
    this.compilationUnits.set(uri.toString(), unit);
  }

  getCompilationUnit(uri: URI): CompilationUnit | undefined {
    return this.compilationUnits.get(uri.toString());
  }

  /**
   * Gets an existing or creates a new compilation unit for the given URI, except for standalone library files
   *
   * @returns Pre-existing or new compilation unit, or undefined if it's a standalone library file
   */
  async getOrCreateCompilationUnit(
    uri: URI,
  ): Promise<CompilationUnit | undefined> {
    if (this.compilationUnits.has(uri.toString())) {
      // existing compilation unit
      return this.compilationUnits.get(uri.toString());
    }
    if (isPluginConfigurationUri(uri)) {
      return undefined;
    } else if (!this.config.isLibFileCandidate(uri)) {
      // non-library files should always generate a compilation unit
      const unit = await this.createAndStoreCompilationUnit(uri);
      return unit;
    } else {
      // do not generate compilation units for standalone library files
      return undefined;
    }
  }

  async createAndStoreCompilationUnit(uri: URI): Promise<CompilationUnit> {
    const unit = await createCompilationUnit(uri, this);
    this.compilationUnits.set(uri.toString(), unit);
    return unit;
  }

  deleteCompilationUnit(uri: URI): boolean {
    const unit = this.compilationUnits.get(uri.toString());
    if (!unit) {
      return false;
    }

    for (const file of unit.services.files.keys()) {
      this.compilationUnits.delete(file);
    }
    this.compilationUnits.delete(uri.toString());

    return true;
  }

  getAllCompilationUnits(): CompilationUnit[] {
    return Array.from(new Set(this.compilationUnits.values()));
  }
}

/**
 * JSON under `.pliplugin/` is not PL/I source. The client attaches the LS there for code actions;
 * we skip compilation so only plugin-config diagnostics (e.g. COPC*) from the plugin loader show.
 */
function isPluginConfigurationUri(uri: URI): boolean {
  const baseName = UriUtils.basename(uri);
  if (baseName === "settings.json") {
    return true;
  }
  const path = uri.path;
  return path.includes("/.pliplugin/") && /\.json$/i.test(path);
}
