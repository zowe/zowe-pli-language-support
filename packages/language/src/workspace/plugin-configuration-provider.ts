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
import { translateCompilerOptions } from "../preprocessor/compiler-options/translate";
import { minimatch } from "minimatch";
import { CompilerOptionResult } from "../preprocessor/compiler-options/options";
import { isBoolean, isRecordOf, isString, isStringArray } from "../utils/types";

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
  pliOptions: PliOptions;

  /**
   * Prebuilt abstract options for this program config.
   * This is built from the program group's compiler options + pli-options,
   * and includes this config's pli-options as well.
   * This is used to avoid re-parsing the options every time we need them for any programs recognized by this config.
   */
  abstractOptions?: AbstractCompilerOptions;
  /**
   * Number of issues found in the pli-options for this program config (which generate compiler options)
   * Used to avoid duplicate issue reporting later on when running translation in a program context
   */
  issueCount?: number;
}

interface SerializedProgramConfig {
  program: string;
  pgroup: string;
  "pli-options"?: PliOptions;
}

function deserializeProgramConfig(obj: SerializedProgramConfig): ProgramConfig {
  const pliOptions = obj["pli-options"] || {};
  return {
    program: obj.program,
    pgroup: obj.pgroup,
    pliOptions: isRecordOf(pliOptions, isString) ? pliOptions : {},
  };
}

/**
 * Process group configuration. Corresponds to libraries, compiler options, and other
 * settings that are associated with a program config.
 */
export interface ProcessGroup {
  name: string;
  compilerOptions: string[];
  pliOptions: PliOptions;
  libs: string[];

  /**
   * Sub directories of libs, populated after reading the configs.
   * A computed property that is not serialized like regular 'libs',
   * but is also used to resolve includes.
   */
  _subLibs: string[];

  includeExtensions: string[];
  implicitBuiltins: Set<string>;
  lspOptions: {
    checkMargins: boolean;
  };

  /**
   * Number of issues found in the compiler options for this process group.
   * Used to avoid duplicate issue reporting later on when running translation in a program context
   */
  issueCount?: number;
}

/**
 * Deserializes a process group config from a plain object.
 * Generates an empty _subLibs array in the process, but does not populate it
 */
export function deserializeProcessGroup(
  obj: SerializedProcessGroup,
): ProcessGroup {
  const compilerOptions = obj["compiler-options"] || [];
  const pliOptions = obj["pli-options"] || {};
  const includeExtensions = obj["include-extensions"] || [];
  const implicitBuiltins = obj["implicit-builtins"] || [];
  const libs = obj.libs || [];
  const lspOptions = obj["lsp-options"] || {};
  const checkMargins = lspOptions["check-margins"] ?? false;
  return {
    name: obj.name,
    compilerOptions: isStringArray(compilerOptions) ? compilerOptions : [],
    pliOptions: isRecordOf(pliOptions, isString) ? pliOptions : {},
    libs: isStringArray(libs) ? libs : [],
    _subLibs: [],
    includeExtensions: isStringArray(includeExtensions)
      ? includeExtensions
      : [],
    implicitBuiltins: isStringArray(implicitBuiltins)
      ? new Set(implicitBuiltins.map((b) => b.toUpperCase()))
      : new Set(),
    lspOptions: {
      checkMargins: isBoolean(checkMargins) ? checkMargins : false,
    },
  };
}

/**
 * Serializes a process group config to a plain object.
 * Drops the _subLibs field in the process, to avoid polluting the original config
 */
export function serializeProcessGroup(
  group: ProcessGroup,
): SerializedProcessGroup {
  return {
    name: group.name,
    "compiler-options": group.compilerOptions,
    "pli-options": group.pliOptions,
    libs: group.libs,
    "include-extensions": group.includeExtensions,
    "implicit-builtins": Array.from(group.implicitBuiltins).map((b) =>
      b.toLowerCase(),
    ),
    "lsp-options": {
      "check-margins": group.lspOptions.checkMargins,
    },
  };
}

interface SerializedProcessGroup {
  name: string;
  "compiler-options"?: string[];
  "pli-options"?: PliOptions;
  libs?: string[];
  "include-extensions"?: string[];
  "implicit-builtins"?: string[];
  "lsp-options"?: {
    "check-margins"?: boolean;
  };
}

/**
 * Plugin configuration provider for loading '.pliplugin/pgm_conf.json' and '.pliplugin/proc_grps.json' (when they exist),
 * processing their contents, and making those settings available to the language server.
 */
export class PluginConfigurationProvider {
  public static readonly PROGRAM_CONFIG_FILE = ".pliplugin/pgm_conf.json";
  public static readonly PROCESS_GROUP_CONFIG_FILE =
    ".pliplugin/proc_grps.json";

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
  public async init(workspacePath: string): Promise<void> {
    this.workspacePath = workspacePath;
    await this.loadConfigurations();
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
      const allLibs = processGroup.libs.concat(processGroup._subLibs);
      const extensions = processGroup.includeExtensions;
      for (let lib of allLibs) {
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
  public isLibFileCandidate(uri: URI): boolean {
    if (!this.libFileGlobPatterns) {
      this.buildLibFileGlobPatterns();
    }
    // normalize a bit
    const filePath = uri.toString(true).replace(/[\\/]+$/, "");
    const patterns = this.libFileGlobPatterns || [];
    for (const pattern of patterns) {
      if (minimatch(filePath, pattern, { nocase: true })) {
        return true;
      }
    }
    return false;
  }

  /**
   * Reloads plugin configurations from the existing workspace path.
   */
  public async reloadConfigurations(): Promise<void> {
    console.log("Reloading .pliplugin configurations...");
    await this.loadConfigurations();
  }

  /**
   * Loads the plugin configurations from the workspace path, overwriting any existing configs.
   */
  private async loadConfigurations(): Promise<void> {
    const workspaceUri = URI.parse(this.workspacePath);

    // load configs
    await this.loadProgramConfig(
      UriUtils.joinPath(workspaceUri, ".pliplugin", "pgm_conf.json"),
    );

    await this.loadProcessGroupConfig(
      UriUtils.joinPath(workspaceUri, ".pliplugin", "proc_grps.json"),
    );
  }

  /**
   * Loads the program config from the given path, and sets it in this provider.
   * @param programConfigUri URI to the program config file
   */
  private async loadProgramConfig(programConfigUri: URI): Promise<void> {
    // attempt to read configs
    if (await FileSystemProviderInstance.fileExists(programConfigUri)) {
      const progConfig =
        await FileSystemProviderInstance.readFile(programConfigUri);

      // add configs to our provider if they exist
      if (progConfig !== undefined) {
        if (
          !this.parseProgramConfigs(this.workspacePath, progConfig.toString())
        ) {
          console.error("Failed to load program config, skipping.");
        } else {
          return;
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
  private async loadProcessGroupConfig(
    processGroupConfigUri: URI,
  ): Promise<void> {
    if (await FileSystemProviderInstance.fileExists(processGroupConfigUri)) {
      const processGrpConfig = await FileSystemProviderInstance.readFile(
        processGroupConfigUri,
      );

      if (processGrpConfig !== undefined) {
        try {
          this.parseProcessGroupConfigs(processGrpConfig);
          this.postProcessProgramConfigs();
          await this.postProcessProcessGroups();
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
   * Go through all process groups & expand libs recursively to ensure all libs are findable when searching
   * Has a side-effect of adding sub-directories to the _subLibs list of each process group
   */
  private async postProcessProcessGroups() {
    for (const processGroup of this.processGroupConfigs.values()) {
      const allLibs = new Set(processGroup.libs);
      const libsToProcess = [...processGroup.libs];
      while (libsToProcess.length > 0) {
        const lib = libsToProcess.pop();
        if (lib) {
          // read all files in this lib path
          // add any contained directories to the libs list, as well as the toProcess list
          const libUri = UriUtils.joinPath(URI.parse(this.workspacePath), lib);
          const entries = await FileSystemProviderInstance.readDir(libUri);
          if (entries.length) {
            for (const dirEntry of entries) {
              const fileName = dirEntry.name;
              const fileType = dirEntry.type;
              if (fileType === 2) {
                // directory to add for handling
                libsToProcess.push(`${lib}/${fileName}`);
                // also add to the full libs list
                allLibs.add(`${lib}/${fileName}`);
              }
            }
          }
        }
      }
      processGroup._subLibs = Array.from(allLibs);
    }
  }

  /**
   * Post-processes program configs after they've been loaded or set,
   * updates abstractOptions & issue counts, sourcing from the associated process group config as well.
   */
  private postProcessProgramConfigs() {
    const programConfigs = this.programConfigs.values();
    for (const programConfig of programConfigs) {
      // get the process group config for this program
      const processGroupConfig = this.getProcessGroupConfig(
        programConfig.pgroup,
      );

      // collect raw compiler options from the group
      const rawCompilerOptions = (
        processGroupConfig?.compilerOptions || []
      ).join(" ");
      // collect raw pli-options from the group & program config
      const rawPliOptions =
        this.pliOptionsStringForProgramConfig(programConfig);

      // combine them and pass them all together to parse and translate
      const [abstractOptions, translatedOptions, collectedIssues] =
        this.parseAndTranslateOptions(`${rawCompilerOptions} ${rawPliOptions}`);
      for (const issue of collectedIssues) {
        console.error(
          `Error in compiler options for program config "${programConfig.program}": ${issue}`,
        );
      }
      programConfig.abstractOptions = abstractOptions;
      programConfig.issueCount = translatedOptions.issues.length;
    }
  }

  /**
   * Helper to translate some string of compiler options into a tuple of abstract & translated options
   * @param options Options string to parse and translate
   * @returns Tuple of AbstractCompilerOptions and CompilerOptionResult
   */
  private parseAndTranslateOptions(
    options: string,
  ): [AbstractCompilerOptions, CompilerOptionResult, string[]] {
    const abstractOptions = parseAbstractCompilerOptions(options);
    const translatedOptions = translateCompilerOptions(abstractOptions);
    const collectedIssues: string[] = [];
    for (const issue of [
      ...translatedOptions.issues,
      ...abstractOptions.issues,
    ]) {
      collectedIssues.push(issue.message);
    }
    return [abstractOptions, translatedOptions, collectedIssues];
  }

  parseProgramConfigs(workspacePath: string, text: string): boolean {
    try {
      const serializedData: SerializedProgramConfig[] = JSON.parse(text).pgms;
      const programConfigs = serializedData.map(deserializeProgramConfig);
      this.setProgramConfigs(workspacePath, programConfigs);
      return true;
    } catch {
      return false;
    }
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
   * Parses & sets the process group configs of this plugin configuration provider, overwriting any existing configs.
   * @param text Raw text content of .pliplugin/proc_grps.json to parse
   * @returns Whether parsing was successful
   */
  public parseProcessGroupConfigs(text: string): boolean {
    try {
      const serializedData: SerializedProcessGroup[] = JSON.parse(text).pgroups;
      const groupConfigs = serializedData.map(deserializeProcessGroup);
      this.setProcessGroupConfigs(groupConfigs);
      this.postProcessProgramConfigs();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Sets the process group configs of this plugin configuration provider, overwriting any existing configs.
   * Also invalidates the saved library file patterns.
   * @param processGroupConfigs List of process group configs loaded from
   *  .pliplugin/proc_grps.json (when present)
   */
  public async setProcessGroupConfigs(
    processGroupConfigs: ProcessGroup[],
  ): Promise<void> {
    this.processGroupConfigs.clear();
    for (const config of processGroupConfigs) {
      this.processGroupConfigs.set(config.name, config);
    }
    this.postProcessProgramConfigs();
    await this.postProcessProcessGroups();
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
  public getProgramConfig(program: URI): ProgramConfig | undefined {
    // Note that we need to decode the URI
    const uri = program.toString(true);
    // try direct match first
    const direct = this.programConfigs.get(uri);
    if (direct) {
      return direct;
    }
    // fallback to glob matching
    for (const [pattern, config] of this.programConfigs.entries()) {
      if (pattern === uri) {
        continue; // already checked
      }
      try {
        // attempt match on decoded URI
        if (minimatch(uri, decodeURIComponent(pattern))) {
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
  public hasProgramConfig(program: URI): boolean {
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
   * Returns the process group config for the given URI. This is used to find the
   * process group associated with a library file. It is rather fuzzy and might not be 100% accurate.
   * @param libUri URI of the including file (likely a library file)
   * @returns First process group config that includes a matching lib path, or undefined if not found
   */
  public getProcessGroupConfigFromLib(libUri: URI): ProcessGroup | undefined {
    const dirname = UriUtils.basename(UriUtils.dirname(libUri));
    for (const config of this.processGroupConfigs.values()) {
      if (config.libs?.includes(dirname)) {
        return config;
      } else if (config._subLibs?.includes(dirname)) {
        return config;
      }
    }
    return undefined;
  }

  /**
   * Extracts & converts the merged pli-options for a given program config & associated process group to a compiler option string
   * Program config pli-options override process group pli-options.
   * @param programConfig Program config entry to retrieve options for, factoring in process group options too
   * @returns Merged pli-options as a string, or "" if none
   */
  private pliOptionsStringForProgramConfig(
    programConfig: ProgramConfig,
  ): string {
    const group = this.getProcessGroupConfig(programConfig.pgroup);
    const groupOpts = group?.pliOptions ?? {};
    const progOpts = programConfig.pliOptions;
    // merge w/ program config entries taking precedence
    const merged = { ...groupOpts, ...progOpts };
    if (Object.keys(merged).length === 0) {
      return "";
    } else {
      // form literal PP option strings
      // e.g. { SYSPARM: "'a'"} => "SYSPARM('a')" // note the quotes
      // e.g. { SYSTEM: "MVS", "SYSTEM(MVS)"
      return Object.entries(merged)
        .map(([key, value]) => `${key}(${value})`)
        .join(" ");
    }
  }
}

/**
 * Singleton instance of the pli plugin configuration provider.
 */
export let PluginConfigurationProviderInstance: PluginConfigurationProvider =
  new PluginConfigurationProvider();

export function setPluginConfigurationProvider(
  provider: PluginConfigurationProvider | undefined,
): void {
  PluginConfigurationProviderInstance =
    provider ?? new PluginConfigurationProvider();
}
