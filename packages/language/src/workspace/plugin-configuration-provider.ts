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

/**
 * Plugin configuration provider for loading up '.pliplugin' (when it exists), processing its contents,
 * and making those settings available to the language server.
 */

/**
 * Program configuration, this corresponds to the entry point of a compile unit
 * and the process group that belongs to it
 */
export interface ProgramConfig {
  program: string;
  pgroup: string;
}

/**
 * Process group configuration, this corresponds to libs, compiler options, and other
 * settings that are associated will be associated with a program config
 */
export interface ProcessGroup {
  name: string;
  "compiler-options"?: string[];
  libs?: string[];
  "copybook-extensions"?: string[];
  abstractOptions?: AbstractCompilerOptions;

  /**
   * Number of issues found in the compiler options for this process group.
   * Used to avoid duplicate issue reporting later on when running translation in a program context
   */
  issueCount?: number;
}

class PluginConfigurationProvider {
  /**
   * Map of program configs, keyed by their entry program
   * These correlate to the entry point of a compile unit
   */
  private programConfigs: Map<string, ProgramConfig>;

  /**
   * Map of process group configs, keyed by their group name.
   * These serve as a collection of libs, compiler options, and other settings
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
   * Initializes the plugin configuration provider with a workspace path, using any plugins present in the workspace
   */
  public async init(workspacePath: string) {
    // TODO @montymxb Apr. 23rd, 2025: Path sep is not cross-platform (vscode-uri does the same)
    const plipluginPath = workspacePath + "/.pliplugin";
    const programConfigPath = plipluginPath + "/pgm_conf.json";
    const processGroupConfigPath = plipluginPath + "/proc_grps.json";

    // load configs
    this.loadProgramConfig(programConfigPath, workspacePath);
    this.loadProcessGroupConfig(processGroupConfigPath);

    // set the workspace path
    this.workspacePath = workspacePath;
  }

  /**
   * Reloads plugin configurations from the existing workspace path.
   */
  public reloadConfigurations(): void {
    const plipluginPath = this.workspacePath + "/.pliplugin";
    const programConfigPath = plipluginPath + "/pgm_conf.json";
    const processGroupConfigPath = plipluginPath + "/proc_grps.json";

    console.log("Reloading .pliplugin configurations...");
    this.loadProgramConfig(programConfigPath, this.workspacePath);
    this.loadProcessGroupConfig(processGroupConfigPath);
  }

  /**
   * Loads the program config from the given path, and sets it in our provider
   * @param programConfigPath Path to the program config file
   * @param workspacePath Used to set program configs in relation to our workspace path
   */
  private loadProgramConfig(
    programConfigPath: string,
    workspacePath: string,
  ): void {
    // attempt to read configs
    const programConfigUri = URI.parse(programConfigPath);
    if (FileSystemProviderInstance.fileExistsSync(programConfigUri)) {
      const progConfig = FileSystemProviderInstance.readFileSync(
        URI.parse(programConfigPath),
      );

      // add configs to our provider if they exist
      if (progConfig !== undefined) {
        try {
          const programConfigs: ProgramConfig[] = JSON.parse(
            progConfig.toString(),
          ).pgms;
          // set w/ respect to the cur workspace path
          this.setProgramConfigs(workspacePath, programConfigs);
        } catch (e) {
          console.error("Failed to load program config, skipping:", e);
        }
      } else {
        console.warn("No program config found.");
      }
    }
  }

  /**
   * Return the workspace path that this provider was initialized with
   */
  public getWorkspacePath(): string {
    return this.workspacePath;
  }

  /**
   * Loads the process group config from the given path, and sets it in our provider
   * @param processGroupConfigPath Path to the process group config file
   */
  private loadProcessGroupConfig(processGroupConfigPath: string): void {
    const processGroupConfigUri = URI.parse(processGroupConfigPath);
    if (FileSystemProviderInstance.fileExistsSync(processGroupConfigUri)) {
      const processGrpConfig = FileSystemProviderInstance.readFileSync(
        URI.parse(processGroupConfigPath),
      );

      if (processGrpConfig !== undefined) {
        try {
          const processGroupConfigs: ProcessGroup[] = JSON.parse(
            processGrpConfig.toString(),
          ).pgroups;
          this.setProcessGroupConfigs(processGroupConfigs);
          this.postProcessGroupConfigs();
        } catch (e) {
          console.error("Failed to load process group config, skipping:", e);
        }
      } else {
        console.warn("No process group config found.");
      }
    }
  }

  /**
   * Post-processes group configs after they've been loaded or set,
   * updates abstractOptions & issue counts
   */
  private postProcessGroupConfigs() {
    const processGroupConfigs = this.processGroupConfigs.values();
    for (const config of processGroupConfigs) {
      if (config["compiler-options"]?.length) {
        const abstractOptions = parseAbstractCompilerOptions(
          config["compiler-options"].join(" "),
        );

        const translatedOptions = translateCompilerOptions(abstractOptions);
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
   * Sets program config of our plugin configuration provider, overriding prior configs
   * @param partialKey Workspace path as a partial key (program name takes the rest)
   * @param programConfigs Program configs loaded from .pliplugin/pgm_confg.json (when present)
   */
  public setProgramConfigs(
    partialKey: string,
    programConfigs: ProgramConfig[],
  ): void {
    for (const config of programConfigs) {
      // TODO @montymxb Apr. 23rd, 2025: Path sep is not cross-platform
      const workspaceUri = URI.parse(partialKey);
      const newPath = UriUtils.joinPath(workspaceUri, config.program);
      this.programConfigs.set(newPath.toString(), config);
    }
  }

  /**
   * Sets process group configs of our plugin configuration provider, overriding prior configs
   * @param processGroupConfigs List of process group configs loaded from
   *  .pliplugin/proc_grps.json (when present)
   */
  public setProcessGroupConfigs(processGroupConfigs: ProcessGroup[]): void {
    for (const config of processGroupConfigs) {
      this.processGroupConfigs.set(config.name, config);
    }
    this.postProcessGroupConfigs();
  }

  /**
   * Returns the program config for the given program
   * @param program File name of the program to get a config for (entry point)
   * @returns Associated program config, or undefined if not found
   */
  public getProgramConfig(program: string): ProgramConfig | undefined {
    return this.programConfigs.get(program);
  }

  /**
   * Returns true if the given program has a config (i.e. is a listed entry point)
   */
  public hasProgramConfig(program: string): boolean {
    return this.programConfigs.has(program);
  }

  /**
   * Returns whether any program configs have been registered.
   * Without any, all programs are treated as valid entry points
   */
  public hasRegisteredProgramConfigs(): boolean {
    return this.programConfigs.size > 0;
  }

  /**
   * Returns the process group config for the given process group
   * @param pgroup Name of the process group to get a config for
   * @returns Associated process group config, or undefined if not found
   */
  public getProcessGroupConfig(pgroup: string): ProcessGroup | undefined {
    return this.processGroupConfigs.get(pgroup);
  }
}

/**
 * Single instance of the pli plugin configuration provider.
 */
export const PluginConfigurationProviderInstance: PluginConfigurationProvider =
  new PluginConfigurationProvider();
