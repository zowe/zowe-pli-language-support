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

import { FileSystemProviderInstance } from "./file-system-provider";
import { URI, UriUtils } from "../utils/uri";
import {
  AbstractCompilerOptions,
  parseAbstractCompilerOptions,
} from "../preprocessor/compiler-options/parser";
import { translateCompilerOptions } from "../preprocessor/compiler-options/translator";
import { minimatch } from "minimatch";
import { CompilerOptionResult } from "../preprocessor/compiler-options/options";

/**
 * Pli options are effectively macros to set w/ the given values
 */
export type PliOptions = Record<string, string>;

/**
 * Program configuration. Corresponds to the entry point of a compile unit
 * and the process group that it belongs to.
 */
export interface ProgramConfig {
  program: string;
  pgroup: string;
  "pli-options"?: PliOptions;
}

/**
 * Process group configuration. Corresponds to libraries, compiler options, and other
 * settings that are associated with a program config.
 */
export interface ProcessGroup {
  name: string;
  "compiler-options"?: string[];
  "pli-options"?: PliOptions;
  libs?: string[];
  "include-extensions"?: string[];
  abstractOptions?: AbstractCompilerOptions;

  /**
   * Number of issues found in the compiler options for this process group.
   * Used to avoid duplicate issue reporting later on when running translation in a program context
   */
  issueCount?: number;
}

/**
 * Plugin configuration provider for loading '.pliplugin/pgm_conf.json' and '.pliplugin/proc_grps.json' (when they exist),
 * processing their contents, and making those settings available to the language server.
 */
class PluginConfigurationProvider {
  /**
   * Prebuilt list of glob patterns for library file matching.
   */
  private libFileGlobPatterns: string[] | undefined;

  /**
   * Map of program configs, keyed by their entry program.
   * These correspond to the entry point of a compile unit.
   */
  private programConfigs: Map<string, ProgramConfig>;

  /**
   * Map of process group configs, keyed by their group name.
   * These serve as a collection of libraries, compiler options, and other settings.
   */
  private processGroupConfigs: Map<string, ProcessGroup>;

  /**
   * The workspace path that we're initialized with.
   */
  private workspacePath: string;

  constructor() {
    this.programConfigs = new Map<string, ProgramConfig>();
    this.processGroupConfigs = new Map<string, ProcessGroup>();
    this.workspacePath = ""; // empty workspace to start with
  }

  /**
   * Initializes the plugin configuration provider with a workspace path, using any plugin configs present in the workspace.
   */
  public async init(workspacePath: string) {
    this.workspacePath = workspacePath;
    this.loadConfigurations();
  }

  /**
   * Builds and saves the glob patterns for library file matching.
   * Patterns are prefixed with the workspace path and are intended to match full file paths.
   */
  private buildLibFileGlobPatterns(): void {
    const patterns: string[] = [];
    // Normalize workspace path for URI prefix
    let wsPrefix = this.workspacePath;
    if (wsPrefix && !wsPrefix.endsWith("/")) {
      wsPrefix += "/";
    }
    for (const processGroup of this.processGroupConfigs.values()) {
      const libs = processGroup.libs || [];
      const extensions = processGroup["include-extensions"] || [];
      for (let lib of libs) {
        lib = lib.replace(/[\\/]+$/, "");
        for (const ext of extensions) {
          patterns.push(`${wsPrefix}${lib}/*${ext}`);
        }
      }
    }
    this.libFileGlobPatterns = patterns;
  }

  /**
   * Checks if the given file path matches any known library file pattern.
   * Patterns are memoized and rebuilt when process group configs change.
   * @param filePath The file path to check for library membership
   * @returns true if the file path matches any library file pattern, false otherwise
   */
  public isLibFileCandidate(filePath: string): boolean {
    if (!this.libFileGlobPatterns) {
      this.buildLibFileGlobPatterns();
    }
    const patterns = this.libFileGlobPatterns || [];
    for (const pattern of patterns) {
      // normalize a bit
      filePath = filePath.replace(/[\\/]+$/, "");
      if (minimatch(filePath, pattern, { nocase: true })) {
        return true;
      }
    }
    return false;
  }

  /**
   * Reloads plugin configurations from the existing workspace path.
   */
  public reloadConfigurations(): void {
    console.log("Reloading .pliplugin configurations...");
    this.loadConfigurations();
  }

  /**
   * Loads the plugin configurations from the workspace path, overwriting any existing configs.
   */
  private loadConfigurations(): void {
    const workspaceUri = URI.parse(this.workspacePath);

    // load configs
    this.loadProgramConfig(
      UriUtils.joinPath(workspaceUri, ".pliplugin", "pgm_conf.json"),
    );

    this.loadProcessGroupConfig(
      UriUtils.joinPath(workspaceUri, ".pliplugin", "proc_grps.json"),
    );
  }

  /**
   * Loads the program config from the given path, and sets it in this provider.
   * @param programConfigUri URI to the program config file
   */
  private loadProgramConfig(programConfigUri: URI): void {
    // attempt to read configs
    if (FileSystemProviderInstance.fileExistsSync(programConfigUri)) {
      const progConfig =
        FileSystemProviderInstance.readFileSync(programConfigUri);

      // add configs to our provider if they exist
      if (progConfig !== undefined) {
        try {
          const programConfigs: ProgramConfig[] = JSON.parse(
            progConfig.toString(),
          ).pgms;
          // set w/ respect to the current workspace path
          this.setProgramConfigs(this.workspacePath, programConfigs);
          return;
        } catch (e) {
          console.error("Failed to load program config, skipping:", e);
        }
      } else {
        console.warn("No program config found.");
      }
    }

    // clear otherwise, no valid program config to use
    this.programConfigs.clear();
    console.warn("No program config found, clearing existing configurations.");
  }

  /**
   * Return the workspace path that this provider was initialized with
   */
  public getWorkspacePath(): string {
    return this.workspacePath;
  }

  /**
   * Loads the process group config from the given path, and sets it in this provider.
   * @param processGroupConfigUri URI to the process group config file
   */
  private loadProcessGroupConfig(processGroupConfigUri: URI): void {
    if (FileSystemProviderInstance.fileExistsSync(processGroupConfigUri)) {
      const processGrpConfig = FileSystemProviderInstance.readFileSync(
        processGroupConfigUri,
      );

      if (processGrpConfig !== undefined) {
        try {
          const processGroupConfigs: ProcessGroup[] = JSON.parse(
            processGrpConfig.toString(),
          ).pgroups;
          this.setProcessGroupConfigs(processGroupConfigs);
          this.postProcessGroupConfigs();
          return;
        } catch (e) {
          console.error("Failed to load process group config, skipping:", e);
        }
      } else {
        console.warn("No process group config found.");
      }
    }

    // clear otherwise, no valid PG to use
    this.processGroupConfigs.clear();
    console.warn(
      "No process group config found, clearing existing configurations.",
    );
  }

  /**
   * Post-processes group configs after they've been loaded or set,
   * updates abstractOptions & issue counts
   */
  private postProcessGroupConfigs() {
    const processGroupConfigs = this.processGroupConfigs.values();
    for (const config of processGroupConfigs) {
      if (config["compiler-options"]?.length) {
        const [abstractOptions, translatedOptions] =
          this.parseAndTranslateOptions(config["compiler-options"].join(" "));

        for (const issue of [
          ...translatedOptions.issues,
          ...abstractOptions.issues,
        ]) {
          console.error(
            `Error in compiler options for process group "${config.name}": ${issue.message}`,
          );
        }
        config.abstractOptions = abstractOptions;
        config.issueCount = translatedOptions.issues.length;
      }
    }
  }

  /**
   * Helper to translate some string of compiler options into a tuple of abstract & translated options
   * @param options Options string to parse and translate
   * @returns Tuple of AbstractCompilerOptions and CompilerOptionResult
   */
  private parseAndTranslateOptions(
    options: string,
  ): [AbstractCompilerOptions, CompilerOptionResult] {
    const abstractOptions = parseAbstractCompilerOptions(options);
    const translatedOptions = translateCompilerOptions(abstractOptions);
    return [abstractOptions, translatedOptions];
  }

  /**
   * Sets the program configs of this plugin configuration provider, overwriting any existing configs.
   * The config key is set as the full path relative to the workspace.
   * @param workspacePath The full workspace path (used as a prefix for program config keys)
   * @param programConfigs Program configs loaded from .pliplugin/pgm_conf.json (when present)
   */
  public setProgramConfigs(
    workspacePath: string,
    programConfigs: ProgramConfig[],
  ): void {
    this.programConfigs.clear();
    const workspaceUri = URI.parse(workspacePath);
    for (const config of programConfigs) {
      const newPath = UriUtils.joinPath(workspaceUri, config.program);
      this.programConfigs.set(newPath.toString(), config);
    }
  }

  /**
   * Sets the process group configs of this plugin configuration provider, overwriting any existing configs.
   * Also invalidates the saved library file patterns.
   * @param processGroupConfigs List of process group configs loaded from
   *  .pliplugin/proc_grps.json (when present)
   */
  public setProcessGroupConfigs(processGroupConfigs: ProcessGroup[]): void {
    this.processGroupConfigs.clear();
    for (const config of processGroupConfigs) {
      this.processGroupConfigs.set(config.name, config);
    }
    this.postProcessGroupConfigs();
    this.libFileGlobPatterns = undefined;
  }

  /**
   * Returns the program config for the given program.
   * If no exact match is found, will attempt to match against
   * any glob patterns registered as a config keys using minimatch.
   * See: https://github.com/isaacs/minimatch for ref
   * @param program Name of the program to get a config for
   * @returns Associated program config, or undefined if not found
   */
  public getProgramConfig(program: string): ProgramConfig | undefined {
    // try direct match first
    const direct = this.programConfigs.get(program);
    if (direct) {
      return direct;
    }
    // fallback to glob matching
    for (const [pattern, config] of this.programConfigs.entries()) {
      if (pattern === program) {
        continue; // already checked
      }
      try {
        // attempt match on decoded URI
        if (minimatch(program, decodeURIComponent(pattern))) {
          return config;
        }
      } catch (e) {
        console.error(
          `Invalid glob pattern "${pattern}" for program "${program}": ${e}`,
        );
      }
    }
    // no match
    return undefined;
  }

  /**
   * Returns true if the given program has a config (i.e. is a listed entry point)
   */
  public hasProgramConfig(program: string): boolean {
    return this.getProgramConfig(program) !== undefined;
  }

  /**
   * Returns whether any program configs have been registered.
   * If none are registered, all programs are treated as valid entry points.
   */
  public hasRegisteredProgramConfigs(): boolean {
    return this.programConfigs.size > 0;
  }

  /**
   * Returns the process group config for the given process group name.
   * @param pgroup Name of the process group to get a config for
   * @returns Associated process group config, or undefined if not found
   */
  public getProcessGroupConfig(pgroup: string): ProcessGroup | undefined {
    return this.processGroupConfigs.get(pgroup);
  }

  /**
   * Converts the merged pli-options for a given program config to a string suitable for compiler options.
   * Program config pli-options override process group pli-options.
   * Example: { SYSPARM: "'myval'" } => 'SYSPARM('myval')', note the quotes
   * Example: { SYSTEM: "MVS" } => 'SYSTEM(MVS)'
   * @param programConfig Program config entry to retrieve options for, factoring in process group options too
   * @returns Merged pli-options as a string, or "" if none
   */
  public pliOptionsStringForProgramConfig(
    programConfig: ProgramConfig,
  ): string {
    const group = this.getProcessGroupConfig(programConfig.pgroup);
    const groupOpts = group && group["pli-options"] ? group["pli-options"] : {};
    const progOpts = programConfig["pli-options"] || {};
    // merge w/ program config entries taking precedence
    const merged = { ...groupOpts, ...progOpts };
    if (Object.keys(merged).length === 0) {
      return "";
    } else {
      return Object.entries(merged)
        .map(([key, value]) => `${key}(${value})`)
        .join(" ");
    }
  }
}

/**
 * Singleton instance of the pli plugin configuration provider.
 */
export const PluginConfigurationProviderInstance: PluginConfigurationProvider =
  new PluginConfigurationProvider();
