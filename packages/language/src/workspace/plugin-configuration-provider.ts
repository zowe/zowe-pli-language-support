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
import { URI } from "vscode-uri";

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
  compilerOptions: string[];
  libs: string[];
  copybookExtensions: string[];
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

  constructor() {
    this.programConfigs = new Map<string, ProgramConfig>();
    this.processGroupConfigs = new Map<string, ProcessGroup>();
  }

  /**
   * Initializes the plugin configuration provider with a connection, using any plugins present in the workspace
   */
  public async init(workspacePath: string) {
    // TODO @montymxb Apr. 23rd, 2025: Path sep is not cross-platform
    const plipluginPath = workspacePath + "/.pliplugin";
    const programConfigPath = plipluginPath + "/pgm_conf.json";
    const processGroupConfigPath = plipluginPath + "/proc_grps.json";

    // attempt to read configs
    const progConfig = FileSystemProviderInstance.readFileSync(URI.parse(programConfigPath));
    const processGrpConfig = FileSystemProviderInstance.readFileSync(URI.parse(processGroupConfigPath));

    // add configs to our provider if they exist
    if (progConfig !== undefined) {
      try {
        const programConfigs: ProgramConfig[] = JSON.parse(progConfig.toString()).pgms;
        // set w/ respect to the cur workspace path
        this.setProgramConfigs(workspacePath, programConfigs);
      } catch (e) {
        console.error("Failed to load program config, skipping:", e);
      }
    } else {
      console.warn("No program config found.");
    }

    if (processGrpConfig !== undefined) {
      try {
      const processGroupConfigs: ProcessGroup[] = JSON.parse(processGrpConfig.toString()).pgroups;
      this.setProcessGroupConfigs(processGroupConfigs);
      } catch (e) {
        console.error("Failed to load process group config, skipping:", e);
      }
    } else {
      console.warn("No process group config found.");
    }
  }

  /**
   * Sets program config of our plugin configuration provider, overriding prior configs
   * @param partialKey Workspace path as a partial key (program name takes the rest)
   * @param programConfigs Program configs loaded from
   *  .pliplugin/pgm_confg.json (when present)
   */
  public setProgramConfigs(partialKey: string, programConfigs: ProgramConfig[]): void {
    for (const config of programConfigs) {
      // TODO @montymxb Apr. 23rd, 2025: Path sep is not cross-platform
      this.programConfigs.set(partialKey + '/' + config.program, config);
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
export const PluginConfigurationProviderInstance: PluginConfigurationProvider = new PluginConfigurationProvider();
