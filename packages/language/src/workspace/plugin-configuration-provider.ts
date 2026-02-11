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

import { minimatch } from "minimatch";
import { Diagnostic as LspDiagnostic } from "vscode-languageserver-types";
import { Diagnostic } from "../language-server/types";
import {
  AbstractCompilerOptions,
  parseAbstractCompilerOptions,
} from "../preprocessor/compiler-options/parser";
import { isBoolean, isNumber, isStringArray } from "../utils/types";
import { URI, UriUtils } from "../utils/uri";
import { FileSystemProviderInstance } from "./file-system-provider";
import { MAX_INSTRUCTION_COUNTER } from "../preprocessor/instruction-interpreter";

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
  compilerOptions?: string[];

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
  issues?: Diagnostic[];
}

interface SerializedProgramConfig {
  program: string;
  pgroup: string;
  "compiler-options"?: string[];
}

function deserializeProgramConfig(obj: SerializedProgramConfig): ProgramConfig {
  const compilerOptions = obj["compiler-options"] || [];
  return {
    program: obj.program,
    pgroup: obj.pgroup,
    compilerOptions: isStringArray(compilerOptions) ? compilerOptions : [],
  };
}

/**
 * Process group configuration. Corresponds to libraries, compiler options, and other
 * settings that are associated with a program config.
 */
export interface ProcessGroup {
  name: string;
  compilerOptions: string[];

  /**
   * Actual libs as they're loaded from the config on disk.
   * Feeds into computed libs, not directly used for resolving includes.
   */
  libs: string[];

  /**
   * Computed libs, includes libs from discs, sub dirs of libs, & dd names.
   * DD name entries are derived from files like `abc(member)`, which produce a ddname of `abc`.
   * This is populated after reading the configs, not serialized like regular 'libs'.
   * Used to resolve includes.
   */
  $computedLibs: LibsEntry[];

  /**
   * Set of computed libs for fast lookup.
   * Only contains directory entries, not DD name entries, which are partial.
   * Used to find process groups from a lib URI
   */
  $computedLibsSet: Set<string>;

  includeExtensions: string[];
  lspOptions: {
    checkMargins: boolean;
    instructionCounterLimit: number;
    caseUpperValidation: boolean;
  };

  /**
   * Whether member name validation is enabled for this process group.
   * Validation constraints member names to no more than 8 chars, starting with a letter,
   * and only containing A-Z, 0-9, @, #, _, and $ (case insensitively).
   */
  memberNameValidation?: boolean;

  /**
   * Number of issues found in the compiler options for this process group.
   * Used to avoid duplicate issue reporting later on when running translation in a program context
   */
  issueCount?: number;
}

/**
 * Deserializes a process group config from a plain object.
 * Generates an empty $computedLibs array in the process, but does not populate it
 */
export function deserializeProcessGroup(
  obj: SerializedProcessGroup,
): ProcessGroup {
  const compilerOptions = obj["compiler-options"] || [];
  const includeExtensions = obj["include-extensions"] || [];
  const libs = obj.libs || [];
  const lspOptions = obj["lsp-options"] || {};
  const checkMargins = lspOptions["check-margins"] ?? false;
  const instructionCounterLimit = lspOptions["instruction-counter-limit"];
  const memberNameValidation = obj["member-name-validation"];
  return {
    name: obj.name,
    compilerOptions: isStringArray(compilerOptions) ? compilerOptions : [],
    libs: isStringArray(libs) ? libs : [],
    $computedLibs: [],
    $computedLibsSet: new Set<string>(),
    includeExtensions: isStringArray(includeExtensions)
      ? includeExtensions
      : [],
    lspOptions: {
      checkMargins: isBoolean(checkMargins) ? checkMargins : false,
      instructionCounterLimit: isNumber(instructionCounterLimit)
        ? instructionCounterLimit
        : MAX_INSTRUCTION_COUNTER,
      caseUpperValidation: isBoolean(lspOptions["case-upper-validation"])
        ? lspOptions["case-upper-validation"]
        : true,
    },
    memberNameValidation: isBoolean(memberNameValidation)
      ? memberNameValidation
      : undefined,
  };
}

/**
 * Serializes a process group config to a plain object.
 * Drops computed fields in the process (such as $computedLibs)
 */
export function serializeProcessGroup(
  group: ProcessGroup,
): SerializedProcessGroup {
  return {
    name: group.name,
    "compiler-options": group.compilerOptions,
    libs: group.libs,
    "include-extensions": group.includeExtensions,
    "member-name-validation": group.memberNameValidation,
    "lsp-options": {
      "check-margins": group.lspOptions.checkMargins,
    },
  };
}

interface SerializedProcessGroup {
  name: string;
  "compiler-options"?: string[];
  libs?: string[];
  "include-extensions"?: string[];
  "member-name-validation"?: boolean;
  "lsp-options"?: {
    "check-margins"?: boolean;
    "instruction-counter-limit"?: number;
    "case-upper-validation"?: boolean;
  };
}

/**
 * Library entry, either a directory or a DD entry
 */
export type LibsEntry = LibsDirEntry | LibsDDEntry;

/**
 * Library directory entry
 */
export interface LibsDirEntry {
  dir: string;
}

/**
 * Library DD name entry
 */
export interface LibsDDEntry {
  ddLib: string;
}

export function isLibsDir(entry: LibsEntry): entry is LibsDirEntry {
  return (entry as LibsDirEntry).dir !== undefined;
}

/**
 * Plugin configuration provider for loading '.pliplugin/pgm_conf.json' and '.pliplugin/proc_grps.json' (when they exist),
 * processing their contents, and making those settings available to the language server.
 */
export class PluginConfigurationProvider {
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
   *
   * @param workspacePath The full path to the workspace to load plugin configurations from
   * @returns List of diagnostics encountered during loading & processing
   */
  public async init(workspacePath: string): Promise<LspDiagnostic[]> {
    this.workspacePath = workspacePath;
    return this.loadConfigurations();
  }

  /**
   * Builds and saves the glob patterns for library file matching.
   * Omits DD entries, only includes directory-based libs.
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
      const computedLibs = processGroup.$computedLibs;
      const extensions = processGroup.includeExtensions;
      for (let lib of computedLibs) {
        if (isLibsDir(lib)) {
          const entry = lib.dir.replace(/[\\/]+$/, "");
          for (const ext of extensions) {
            patterns.push(`${wsPrefix}${entry}/*${ext}`);
          }
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
   *
   * @returns List of diagnostics encountered during loading & processing
   */
  public async reloadConfigurations(): Promise<LspDiagnostic[]> {
    console.log("Reloading .pliplugin configurations...");
    return this.loadConfigurations();
  }

  /**
   * Loads the plugin configurations from the workspace path, overwriting any existing configs.
   *
   * @returns List of diagnostics encountered during loading & processing
   */
  private async loadConfigurations(): Promise<LspDiagnostic[]> {
    const workspaceUri = URI.parse(this.workspacePath);

    // load configs
    await this.loadProgramConfig(
      UriUtils.joinPath(workspaceUri, ".pliplugin", "pgm_conf.json"),
    );

    const diagnostics = await this.loadProcessGroupConfig(
      UriUtils.joinPath(workspaceUri, ".pliplugin", "proc_grps.json"),
    );
    return diagnostics;
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
   * @returns List of diagnostics encountered during loading & processing
   */
  private async loadProcessGroupConfig(
    processGroupConfigUri: URI,
  ): Promise<LspDiagnostic[]> {
    if (await FileSystemProviderInstance.fileExists(processGroupConfigUri)) {
      const processGrpConfig = await FileSystemProviderInstance.readFile(
        processGroupConfigUri,
      );

      if (processGrpConfig !== undefined) {
        try {
          // process & set configs, also triggers post-processing of process groups
          const diagnostics =
            await this.parseProcessGroupConfigs(processGrpConfig);
          this.postProcessProgramConfigs();
          return diagnostics;
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
    return [];
  }

  /**
   * Go through all process groups & expand libs recursively to ensure all libs are findable when searching
   * Populates the $computedLibs property of each process group, which is used to resolve includes
   * @returns List of diagnostics encountered during processing
   */
  private async postProcessProcessGroups(): Promise<LspDiagnostic[]> {
    const diagnostics: LspDiagnostic[] = [];
    for (const processGroup of this.processGroupConfigs.values()) {
      // all computed libs for this group, dirs + ddnames
      // @montymxb Using a map here to avoid duplicates over a set, since our entries are objects.
      //  A set will compare by ref instead of value, seeing each entry as unique, and adding duplicate lib entries.
      //  That doesn't lead to any issues, but it adds extra entries that we have to look through later on.
      const computedLibsMap: Map<string, LibsEntry> = new Map();
      const libsToProcess = [...processGroup.libs];
      while (libsToProcess.length > 0) {
        const lib = libsToProcess.shift();
        if (lib) {
          // read all files in this lib path
          // add any contained directories to the libs list, as well as the toProcess list
          let libUri: URI;
          const absPathRegex = /^\/|[A-Z]:|~/i;
          if (absPathRegex.test(lib)) {
            // absolute path, use as-is
            libUri = URI.file(lib);
          } else {
            libUri = UriUtils.joinPath(URI.parse(this.workspacePath), lib);
          }

          try {
            const entries = await FileSystemProviderInstance.readDir(libUri);
            // add the lib itself first, since we know it exists now
            computedLibsMap.set(`dir:${lib}`, {
              dir: lib,
            });
            if (entries.length) {
              for (const fileName of entries) {
                // TODO @montymxb Nov. 7th, 2025: Handle stat checks in parallel to avoid blocking so long,
                // see https://github.com/zowe/zowe-pli-language-support/issues/465
                const stats = await FileSystemProviderInstance.stat(
                  UriUtils.joinPath(libUri, fileName),
                );
                if (stats.isDirectory) {
                  // directory to add for handling
                  libsToProcess.push(`${lib}/${fileName}`);
                  // also add to the full libs list
                  const dir = `${lib}/${fileName}`;
                  computedLibsMap.set(`dir:${dir}`, {
                    dir,
                  });
                }
              }
            }
          } catch (e) {
            // could not read, try again to retrieve & read the parent directory
            // take its entries to see if our lib exists as a file or directory
            // if so, add it as a ddLib entry instead
            const parentUri = UriUtils.dirname(libUri);
            const libName = UriUtils.basename(libUri);
            try {
              const parentEntries =
                await FileSystemProviderInstance.readDir(parentUri);
              const ddnamePattern = new RegExp(`^${libName}\\(`, "i");
              let matched = false;
              for (const entry of parentEntries) {
                if (ddnamePattern.test(entry)) {
                  // found a ddname-style entry, add full lib & break out, only need one to confirm
                  computedLibsMap.set(`dd:${lib}`, {
                    ddLib: lib,
                  });
                  matched = true;
                  break;
                }
              }

              if (!matched) {
                // no matches found, rethrow to generate diagnostic
                throw e;
              }
            } catch (parentError) {
              // parent directory also failed to read, skip this lib & collect diagnostic
              diagnostics.push({
                severity: 1, // err
                message: `Plugin Configuration failed to resolve library entry '${lib}'`,
                code: "COPC01",
                source: "PL/I",
                range: {
                  start: { line: 0, character: 0 },
                  end: { line: 0, character: 1 },
                },
              });
            }
          }
        }
      }
      // get computed libs in sorted order, depth 1st, alpha 2nd
      const computedLibs = Array.from(computedLibsMap.values()).sort((a, b) => {
        const aKey = isLibsDir(a) ? a.dir : a.ddLib;
        const bKey = isLibsDir(b) ? b.dir : b.ddLib;
        const aDepth = (aKey.match(/\//g) || []).length;
        const bDepth = (bKey.match(/\//g) || []).length;
        if (aDepth - bDepth === 0) {
          return aKey.localeCompare(bKey);
        }
        return aDepth - bDepth;
      });
      processGroup.$computedLibs = computedLibs;
      // build a lookup set for dir entries only
      processGroup.$computedLibsSet = new Set(
        computedLibs
          .filter((e) => isLibsDir(e))
          .map((e) => e.dir.replace(/\\/g, "/")),
      );
    }
    return diagnostics;
  }

  /**
   * Post-processes program configs after they've been loaded or set,
   * updates abstractOptions & issue counts, sourcing from the associated process group config as well.
   */
  private postProcessProgramConfigs() {
    for (const programConfig of this.programConfigs.values()) {
      const processGroupConfig = this.getProcessGroupConfig(
        programConfig.pgroup,
      );

      // Collect and parse compiler options from both program and process group
      // and parse them individually to accept working ones even if some have parser errors.
      const compilerOptions = [
        ...(programConfig.compilerOptions ?? []),
        ...(processGroupConfig?.compilerOptions ?? []),
      ];

      const abstractOptions: AbstractCompilerOptions = {
        options: [],
        tokens: [],
        issues: [],
      };

      for (const option of compilerOptions) {
        const parsed = parseAbstractCompilerOptions(option);
        abstractOptions.options.push(...parsed.options);
        abstractOptions.tokens.push(...parsed.tokens);
        abstractOptions.issues.push(...parsed.issues);
      }

      programConfig.abstractOptions = abstractOptions;
      programConfig.issues = abstractOptions.issues;
    }
  }

  /**
   * Attempts to parse program configs from the given text,
   * and sets them in this provider, overwriting any existing configs.
   * @param workspacePath Used to build full program config keys
   * @param text Program config text to parse
   * @returns Whether or not parsing & setup was successful
   */
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
   * Program paths are normalized and resolved relative to the workspace (unless absolute).
   * Post-processes the program configs after setting them, to ensure abstract options are built.
   * @param workspacePath The full workspace path (used as base for resolving relative program paths)
   * @param programConfigs Program configs loaded from .pliplugin/pgm_conf.json (when present)
   */
  public setProgramConfigs(
    workspacePath: string,
    programConfigs: ProgramConfig[],
  ): void {
    this.programConfigs.clear();
    const workspaceUri = URI.parse(workspacePath);

    for (const config of programConfigs) {
      const resolvedUri = this.resolveProgramPath(config.program, workspaceUri);
      this.programConfigs.set(resolvedUri.toString(), config);
    }
    this.postProcessProgramConfigs();
  }

  /**
   * Resolves a program path to an absolute URI.
   * Normalizes backslashes to forward slashes, then returns the path as-is if absolute,
   * or joins it with the workspace URI if relative.
   */
  private resolveProgramPath(programPath: string, workspaceUri: URI): URI {
    const normalizedProgramPath = programPath.replace(/\\/g, "/");
    if (this.isAbsolutePath(normalizedProgramPath)) {
      return URI.parse(normalizedProgramPath);
    }
    return UriUtils.joinPath(workspaceUri, normalizedProgramPath);
  }

  /**
   * Determines if a path is absolute (either Windows-style with drive letter or Unix-style).
   * Paths starting with "*" are treated as relative even if they appear absolute.
   */
  private isAbsolutePath(path: string): boolean {
    const hasWindowsDrive = Boolean(UriUtils.processDriveLetter(path).drive);
    const hasUnixRoot = !UriUtils.isPathRelative(path) && !path.startsWith("*");

    return hasWindowsDrive || hasUnixRoot;
  }

  /**
   * Parses & sets the process group configs of this plugin configuration provider, overwriting any existing configs.
   * @param text Raw text content of .pliplugin/proc_grps.json to parse
   * @returns List of diagnostics encountered during loading & processing
   */
  public async parseProcessGroupConfigs(
    text: string,
  ): Promise<LspDiagnostic[]> {
    try {
      const serializedData: SerializedProcessGroup[] = JSON.parse(text).pgroups;
      const groupConfigs = serializedData.map(deserializeProcessGroup);
      const diagnostics = await this.setProcessGroupConfigs(groupConfigs);
      this.postProcessProgramConfigs();
      return diagnostics;
    } catch {
      return [];
    }
  }

  /**
   * Sets the process group configs of this plugin configuration provider, overwriting any existing configs.
   * Also invalidates the saved library file patterns & post-processes program configs.
   * @param processGroupConfigs List of process group configs loaded from
   *  .pliplugin/proc_grps.json (when present)
   * @returns List of diagnostics encountered during loading & processing
   */
  public async setProcessGroupConfigs(
    processGroupConfigs: ProcessGroup[],
  ): Promise<LspDiagnostic[]> {
    this.processGroupConfigs.clear();
    for (const config of processGroupConfigs) {
      this.processGroupConfigs.set(config.name, config);
    }
    this.postProcessProgramConfigs();
    const diagnostics = await this.postProcessProcessGroups();
    this.libFileGlobPatterns = undefined;
    return diagnostics;
  }

  /**
   * Adds or updates a ProgramConfig in the internal map and persists
   * the updated configuration set for the given workspace.
   *
   * @param workspacePath - Absolute path to the workspace.
   * @param programConfig - The program configuration to add.
   * @returns `true` if the configuration was pushed successfully,
   *          `false` if no existing configurations are present.
   */
  public pushConfigProgram(
    workspacePath: string,
    programConfig: ProgramConfig,
  ): boolean {
    if (this.programConfigs.size === 0) {
      return false;
    }
    this.programConfigs.set(programConfig.program, programConfig);
    this.setProgramConfigs(
      workspacePath,
      [...this.programConfigs.values()].map(deserializeProgramConfig),
    );
    return true;
  }

  /**
   * Returns the program config for the given program URI.
   * Lookup order:
   * 1. Exact match against registered config keys.
   * 2. Glob pattern match (using minimatch) against decoded URIs.
   *
   * @see https://github.com/isaacs/minimatch
   * @param program Name of the program to get a config for
   * @returns Associated program config, or undefined if not found
   */
  public getProgramConfig(program: URI): ProgramConfig | undefined {
    // Note that we need to decode the URI
    const uri = program.toString(true);
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
    const absolutePathLib = UriUtils.dirname(libUri)
      .toString()
      .replace(/^file:\/\//, "");
    for (const config of this.processGroupConfigs.values()) {
      if (
        config.$computedLibsSet.has(dirname) ||
        config.$computedLibsSet.has(absolutePathLib)
      ) {
        return config;
      }
    }
    return undefined;
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
