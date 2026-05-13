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
import { TextDocument } from "vscode-languageserver-textdocument";
import { Diagnostic as LspDiagnostic } from "vscode-languageserver-types";
import {
  Diagnostic,
  diagnosticFromCodeAtRange,
  offsetLengthToRange,
} from "../language-server/types";
import { mergeAbstractOptions } from "../config/compiler-options-merge";
import { expandGroup } from "../config/lib-expander";
import {
  parseProcessGroupConfigs,
  parseProgramConfigs,
  toLspDiagnostic,
} from "../config/loader";
import {
  GroupRecord,
  isLibsDir,
  PgmsConfig,
  plainItem,
  ProcessGroup,
  ProgramConfig,
  ProgramRecord,
} from "../config/schema";
import { isBoolean, isNumber, isStringArray } from "../utils/types";
import { URI, UriUtils } from "../utils/uri";
import { FileSystemProvider } from "./file-system-provider";
import { MAX_INSTRUCTION_COUNTER } from "../preprocessor/instruction-interpreter";
import { PluginConfiguration } from "../language-server/constants";
import { type JSONPath } from "../utils/jsonc";
import { LspCodes } from "../validation/lsp-codes";
import { Connection } from "vscode-languageserver";
import { startLongRunningOperation } from "../utils/promises";
import { validatePgroupReferences } from "../config/cross-validation";

// Re-export the schema types so existing imports of the provider module
// keep working without churn at every call site.
export {
  isLibsDir,
  plainItem,
  type GroupRecord,
  type JsonItem,
  type JsonItemMeta,
  type LibsDDEntry,
  type LibsDirEntry,
  type LibsEntry,
  type PgmsConfig,
  type ProcessGroup,
  type ProgramConfig,
  type ProgramEntry,
  type ProgramRecord,
} from "../config/schema";

/** On LSP diagnostics for {@link LspCodes.PluginConfiguration.UnresolvedEntry}; use in code actions. */
export type PluginConfigUnresolvedLibData = {
  lib: string;
  pgroup: string;
  path?: JSONPath;
};

/**
 * Plain-object form of a process group config — what `proc_grps.json`
 * deserializes to before {@link deserializeProcessGroup} wraps each leaf
 * in a {@link JsonItem}. Kept exported because tests construct fixtures
 * in this shape.
 */
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
 * Builds a {@link ProcessGroup} from a plain object — used by tests that
 * construct fixtures in the on-disk JSON shape. Production loading goes
 * through {@link parseProcessGroupConfigs} (in `config/loader.ts`), which
 * preserves source provenance; this helper produces JsonItems with no
 * meta because there is no source text to point at.
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
    name: plainItem(obj.name),
    compilerOptions: (isStringArray(compilerOptions)
      ? compilerOptions
      : []
    ).map(plainItem),
    libs: (isStringArray(libs) ? libs : []).map(plainItem),
    includeExtensions: (isStringArray(includeExtensions)
      ? includeExtensions
      : []
    ).map(plainItem),
    lspOptions: {
      checkMargins: plainItem(isBoolean(checkMargins) ? checkMargins : false),
      instructionCounterLimit: plainItem(
        isNumber(instructionCounterLimit)
          ? instructionCounterLimit
          : MAX_INSTRUCTION_COUNTER,
      ),
      caseUpperValidation: plainItem(
        isBoolean(lspOptions["case-upper-validation"])
          ? lspOptions["case-upper-validation"]
          : true,
      ),
    },
    memberNameValidation: isBoolean(memberNameValidation)
      ? plainItem(memberNameValidation)
      : undefined,
  };
}

export type PluginConfigLspDiagnostics = Map<string, LspDiagnostic[]>;
export type PluginConfigInternalDiagnostics = Map<string, Diagnostic[]>;

type ProcGrpsSnapshot = {
  entries: PluginConfigUnresolvedLibData[];
  text: string;
  uri: URI;
};

/**
 * Plugin configuration provider for loading '.pliplugin/pgm_conf.json' and '.pliplugin/proc_grps.json' (when they exist),
 * processing their contents, and making those settings available to the language server.
 */
export class PluginConfigurationProvider {
  /**
   * Direct prefix-and-extension index for library file membership checks.
   * Maps a lower-cased URI prefix (`<workspace>/<libDir>/`) to the set of
   * lower-cased extensions allowed in that lib. A file is a lib candidate
   * iff its parent directory matches a prefix and its extension matches the
   * prefix's set.
   */
  private libFileMatchers: Map<string, Set<string>> | undefined;

  /**
   * Map of program configs, keyed by their entry program.
   * These correspond to the entry point of a compile unit.
   */
  private programConfigs: Map<string, ProgramRecord>;

  /**
   * Map of process group configs, keyed by their group name.
   * These serve as a collection of libraries, compiler options, and other settings.
   */
  private processGroupConfigs: Map<string, GroupRecord>;

  /**
   * The workspace path that we're initialized with.
   */
  private workspacePath: URI;

  /**
   * Last unresolved lib entries from the most recent postProcessProcessGroups run.
   * Used for code actions: the editor often passes only one diagnostic in the code action request,
   * so fixes for proc_grps.json are driven from this list.
   */
  private lastProcGrpsSnapshot?: ProcGrpsSnapshot;

  /**
   * Most recent config diagnostics from the last loadConfigurations() run
   */
  private configLspDiagnostics: PluginConfigLspDiagnostics;

  private configInternalDiagnostics: PluginConfigInternalDiagnostics;

  /**
   * File system provider this configuration loads through. Injected at
   * construction so the provider has no dependency on a global FS singleton.
   */
  private readonly fs: FileSystemProvider;

  /**
   * Connection used to send status updates about file loading and config parsing.
   * In some cases, such as when working with remote file system, loading and processing of config files can be slow.
   * Having the connection allows us to send progress updates to the client, so the user knows something is happening.
   */
  private readonly connection: Connection | undefined;

  constructor(fs: FileSystemProvider, connection?: Connection) {
    this.fs = fs;
    this.connection = connection;
    this.programConfigs = new Map<string, ProgramRecord>();
    this.processGroupConfigs = new Map<string, GroupRecord>();
    this.workspacePath = UriUtils.parse(""); // empty workspace to start with
    this.configLspDiagnostics = new Map<string, LspDiagnostic[]>();
    this.configInternalDiagnostics = new Map<string, Diagnostic[]>();
  }

  /**
   * Entries matching the last published unresolved-library diagnostics for proc_grps.json.
   */
  public getLastProcGrpsSnapshot(): Readonly<ProcGrpsSnapshot> | undefined {
    return this.lastProcGrpsSnapshot;
  }

  /**
   * Returns the stored config diagnostics for both 'proc_grps.json' and 'pgm_conf.json' files.
   */
  public getConfigLspDiagnostics(): ReadonlyMap<string, LspDiagnostic[]> {
    return this.configLspDiagnostics;
  }

  public getConfigInternalDiagnostics(): ReadonlyMap<string, Diagnostic[]> {
    return this.configInternalDiagnostics;
  }

  /**
   * Initializes the plugin configuration provider with a workspace path, using any plugin configs present in the workspace.
   *
   * @param workspacePath The full path to the workspace to load plugin configurations from
   * @returns Diagnostics keyed by config URI
   */
  public async init(workspacePath: URI): Promise<PluginConfigLspDiagnostics> {
    this.workspacePath = workspacePath;
    return this.loadConfigurations();
  }

  /**
   * Builds the per-prefix extension index used by `isLibFileCandidate`.
   * Omits DD entries (members live as `name(member)` files; their parent
   * dirs are not "lib directories" in the file-membership sense).
   */
  private buildLibFileMatchers(): void {
    let wsPrefix = this.workspacePath.toString(true).toLowerCase();
    if (wsPrefix && !wsPrefix.endsWith("/")) {
      wsPrefix += "/";
    }
    const matchers = new Map<string, Set<string>>();
    for (const processGroup of this.processGroupConfigs.values()) {
      const exts = processGroup.includeExtensions.map((item) =>
        (item.value.startsWith(".")
          ? item.value
          : `.${item.value}`
        ).toLowerCase(),
      );
      if (exts.length === 0) {
        continue;
      }
      for (const lib of processGroup.computedLibs) {
        if (!isLibsDir(lib)) {
          continue;
        }
        const dir = lib.path.replace(/[\\/]+$/, "").toLowerCase();
        const prefix = `${wsPrefix}${dir}/`;
        let set = matchers.get(prefix);
        if (!set) {
          set = new Set<string>();
          matchers.set(prefix, set);
        }
        for (const ext of exts) {
          set.add(ext);
        }
      }
    }
    this.libFileMatchers = matchers;
  }

  /**
   * Checks whether a URI looks like a file inside one of the configured
   * lib directories (and matches one of that lib's allowed extensions).
   * Used to decide whether a file should get its own compilation unit.
   */
  public isLibFileCandidate(uri: URI): boolean {
    if (!this.libFileMatchers) {
      this.buildLibFileMatchers();
    }
    const matchers = this.libFileMatchers!;
    if (matchers.size === 0) {
      return false;
    }
    const filePath = uri
      .toString(true)
      .replace(/[\\/]+$/, "")
      .toLowerCase();
    const lastSlash = filePath.lastIndexOf("/");
    if (lastSlash < 0) {
      return false;
    }
    const dirPart = filePath.substring(0, lastSlash + 1);
    const exts = matchers.get(dirPart);
    if (!exts) {
      return false;
    }
    const fileName = filePath.substring(lastSlash + 1);
    const dotIdx = fileName.lastIndexOf(".");
    if (dotIdx < 0) {
      return false;
    }
    return exts.has(fileName.substring(dotIdx));
  }

  /**
   * Reloads plugin configurations from the existing workspace path.
   *
   * @returns Diagnostics keyed by config URI
   */
  public async reloadConfigurations(): Promise<PluginConfigLspDiagnostics> {
    console.log("Reloading .pliplugin configurations...");
    return this.loadConfigurations();
  }

  /**
   * Loads the plugin configurations from the workspace path, overwriting any existing configs.
   *
   * @returns Diagnostics keyed by config URI
   */
  private async loadConfigurations(): Promise<PluginConfigLspDiagnostics> {
    const workspaceUri = UriUtils.toUri(this.workspacePath);

    const cancel = startLongRunningOperation(
      this.connection,
      "Processing plugin configuration...",
    );
    const { diagnostics: programConfigDiagnostics, document } =
      await this.loadProgramConfig(
        UriUtils.joinPath(workspaceUri, ".pliplugin", "pgm_conf.json"),
      );
    const processGroupDiagnostics = await this.loadProcessGroupConfig(
      UriUtils.joinPath(workspaceUri, ".pliplugin", "proc_grps.json"),
    );
    let unknownProcessGroupsDiagnostic: Diagnostic[] = [];
    if (document && this.processGroupConfigs.size) {
      // Check for unknown process groups references under "pgm_conf.json"
      const pgroupNames = new Set(this.getProcessGroupNames());
      const pgroupReferences: Iterable<ProgramConfig> =
        this.programConfigs.values();
      unknownProcessGroupsDiagnostic = validatePgroupReferences(
        pgroupReferences,
        pgroupNames,
        document.uri,
      );
      for (const diagnostic of unknownProcessGroupsDiagnostic) {
        const lspDiag = toLspDiagnostic(diagnostic, document);
        programConfigDiagnostics.push(lspDiag);
      }
    }
    cancel();

    this.configInternalDiagnostics = new Map<string, Diagnostic[]>([
      [this.getConfigUri("pgm_conf.json"), unknownProcessGroupsDiagnostic],
    ]);
    this.configLspDiagnostics = new Map<string, LspDiagnostic[]>([
      [this.getConfigUri("pgm_conf.json"), programConfigDiagnostics],
      [this.getConfigUri("proc_grps.json"), processGroupDiagnostics],
    ]);
    return this.configLspDiagnostics;
  }

  /**
   * Loads the program config from the given path, and sets it in this provider.
   * @param programConfigUri URI to the program config file
   */
  private async loadProgramConfig(
    programConfigUri: URI,
  ): Promise<{ diagnostics: LspDiagnostic[]; document?: TextDocument }> {
    const diagnostics: LspDiagnostic[] = [];
    // attempt to read configs
    if (await this.fs.fileExists(programConfigUri)) {
      const progConfig = await this.fs.readFile(programConfigUri);

      // add configs to our provider if they exist
      if (progConfig !== undefined) {
        if (
          !this.parseProgramConfigs(
            this.workspacePath,
            progConfig.toString(),
            diagnostics,
          )
        ) {
          console.error("Failed to load program config, skipping.");
        } else {
          const document = TextDocument.create(
            programConfigUri.toString(),
            "jsonc",
            0,
            progConfig.toString(),
          );
          return { diagnostics, document };
        }
      } else {
        console.warn("No program config found.");
      }
    }

    // clear otherwise, no valid program config to use
    this.programConfigs.clear();
    console.warn("No program config found, clearing existing configurations.");
    return { diagnostics, document: undefined };
  }

  /**
   * Writes the process groups configuration file to the workspace.
   *
   * Uses the default process group content unless an override is provided.
   * Throws if the file cannot be written, so callers can handle the failure
   * appropriately.
   *
   * @param content - Process groups content to serialize and write.
   */
  public async writeProcessGroupsFile(
    content = PluginConfiguration.DEFAULT_PROCESS_GROUP_FILE_CONTENT,
  ): Promise<void> {
    const workspaceUri = this.getWorkspacePath();
    try {
      await this.fs.writeFile(
        UriUtils.joinPath(
          workspaceUri,
          PluginConfiguration.PROCESS_GROUP_FILE_PATH,
        ),
        JSON.stringify(content, null, 2),
      );
    } catch (err) {
      console.error("Failed to write process groups file:", err);
      throw err;
    }
  }

  public defaultProgramConfigContent(programPath: string): PgmsConfig {
    return {
      ...PluginConfiguration.DEFAULT_PROGRAM_FILE_CONTENT,
      pgms: [
        {
          ...PluginConfiguration.DEFAULT_PROGRAM_FILE_CONTENT.pgms[0],
          program: programPath,
        },
      ],
    };
  }

  /**
   * Writes the program configuration file to the workspace.
   *
   * Uses the provided content, or falls back to the default program config
   * content if none is given. Throws if the file cannot be written.
   *
   * @param content - Configuration content to serialize and write.
   */
  public async writeProgramConfigFile(
    content: PgmsConfig = PluginConfiguration.DEFAULT_PROGRAM_FILE_CONTENT,
  ): Promise<void> {
    const workspaceUri = this.getWorkspacePath();
    try {
      await this.fs.writeFile(
        UriUtils.joinPath(workspaceUri, PluginConfiguration.PROGRAM_FILE_PATH),
        JSON.stringify(content, null, 2),
      );
    } catch (err) {
      console.error("Failed to write program config file:", err);
      throw err;
    }
  }

  /**
   * Return the workspace URI that this provider was initialized with
   */
  public getWorkspacePath(): URI {
    return this.workspacePath;
  }

  public isPgmConfigDocumentUri(uri: URI | string): boolean {
    const inputUri = typeof uri === "string" ? UriUtils.toUri(uri) : uri;
    const pgmConfigUri = UriUtils.joinPath(
      this.getWorkspacePath(),
      ".pliplugin",
      "pgm_conf.json",
    );
    return UriUtils.equals(pgmConfigUri, inputUri);
  }

  public isProcGrpsDocumentUri(uri: URI | string): boolean {
    const inputUri = typeof uri === "string" ? UriUtils.toUri(uri) : uri;
    const procGrpsUri = UriUtils.joinPath(
      this.getWorkspacePath(),
      ".pliplugin",
      "proc_grps.json",
    );
    return UriUtils.equals(procGrpsUri, inputUri);
  }

  public isPluginConfigDocumentUri(uri: URI | string): boolean {
    return this.isPgmConfigDocumentUri(uri) || this.isProcGrpsDocumentUri(uri);
  }

  public getProcessGroupNames(): string[] {
    return Array.from(this.processGroupConfigs.keys());
  }

  /**
   * Loads the process group config from the given path, and sets it in this provider.
   * @param processGroupConfigUri URI to the process group config file
   * @returns List of diagnostics encountered during loading & processing
   */
  private async loadProcessGroupConfig(
    processGroupConfigUri: URI,
  ): Promise<LspDiagnostic[]> {
    if (await this.fs.fileExists(processGroupConfigUri)) {
      const processGrpConfig = await this.fs.readFile(processGroupConfigUri);

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
   * Expands every process group's libs via the lib-expander, populates each
   * record's `computedLibs`/`computedLibsSet` fields, and converts
   * unresolved libs into LSP diagnostics. The classification (directory vs
   * dataset vs unresolved) lives in `lib-expander.ts` and is driven by
   * `stat` — not by exception handling.
   */
  private async postProcessProcessGroups(
    configDocument?: TextDocument,
  ): Promise<LspDiagnostic[]> {
    this.lastProcGrpsSnapshot = undefined;
    const unresolvedLibEntries: PluginConfigUnresolvedLibData[] = [];
    const diagnostics: LspDiagnostic[] = [];

    for (const record of this.processGroupConfigs.values()) {
      const expanded = await expandGroup(
        record.libs,
        this.fs,
        this.workspacePath,
      );
      record.computedLibs = expanded.libs;
      record.computedLibsSet = expanded.libsSet;

      const pgroupName = record.name.value;
      for (const libItem of expanded.unresolved) {
        const fallbackRange = offsetLengthToRange(0, 1);
        const range = libItem.meta?.range ?? fallbackRange;
        const path = libItem.meta?.path;
        const lib = libItem.value;
        const unresolvedLibDiagnostic: Diagnostic = {
          ...diagnosticFromCodeAtRange(
            LspCodes.PluginConfiguration.UnresolvedEntry,
            range,
            lib,
          ),
          data: { lib, pgroup: pgroupName, path },
        };
        unresolvedLibEntries.push({ lib, pgroup: pgroupName, path });
        diagnostics.push(
          toLspDiagnostic(unresolvedLibDiagnostic, configDocument),
        );
      }
    }

    if (configDocument) {
      this.lastProcGrpsSnapshot = {
        entries: unresolvedLibEntries,
        text: configDocument.getText(),
        uri: UriUtils.toUri(configDocument.uri),
      };
    } else {
      this.lastProcGrpsSnapshot = undefined;
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
        programConfig.pgroup.value,
      );
      const { abstractOptions, issues } = mergeAbstractOptions(
        programConfig.compilerOptions,
        processGroupConfig?.compilerOptions,
      );
      programConfig.abstractOptions = abstractOptions;
      programConfig.issues = issues;
    }
  }

  /**
   * Attempts to parse program configs from the given text,
   * and sets them in this provider, overwriting any existing configs.
   * @param workspacePath Used to build full program config keys
   * @param text Program config text to parse
   * @returns Whether or not parsing & setup was successful
   */
  parseProgramConfigs(
    workspacePath: URI,
    text: string,
    diagnostics: LspDiagnostic[] = [],
  ): boolean {
    const configUri = UriUtils.toUri(this.getConfigUri("pgm_conf.json"));
    const result = parseProgramConfigs(text, configUri);
    diagnostics.push(...result.diagnostics);
    if (!result.config) {
      return false;
    }
    this.setProgramConfigs(workspacePath, result.config);
    return true;
  }

  /**
   * Sets the program configs of this plugin configuration provider, overwriting any existing configs.
   * Program paths are normalized and resolved relative to the workspace (unless absolute).
   * Post-processes the program configs after setting them, to ensure abstract options are built.
   * @param workspacePath The full workspace path (used as base for resolving relative program paths)
   * @param programConfigs Program configs loaded from .pliplugin/pgm_conf.json (when present)
   */
  public setProgramConfigs(
    workspaceUri: URI,
    programConfigs: ProgramConfig[],
  ): void {
    this.programConfigs.clear();

    for (const config of programConfigs) {
      const resolvedUri = this.resolveProgramPath(
        config.program.value,
        workspaceUri,
      );
      // Wrap the loaded config into a ProgramRecord. `abstractOptions` and
      // `issues` are filled in by `postProcessProgramConfigs` once the
      // bound process group is also available.
      this.programConfigs.set(resolvedUri.toString(), {
        ...config,
        abstractOptions: { options: [], tokens: [], issues: [], comments: [] },
        issues: [],
      });
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
      return UriUtils.toUri(normalizedProgramPath);
    }
    return UriUtils.joinPath(workspaceUri, normalizedProgramPath);
  }

  /**
   * Determines if a path is absolute (either Windows-style with drive letter or Unix-style).
   * Paths starting with "*" are treated as relative even if they appear absolute.
   */
  private isAbsolutePath(path: string): boolean {
    const hasWindowsDrive =
      UriUtils.isWindowsAbsolutePath(path) || /^\/[a-zA-Z]:\//.test(path);
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
    const configUriString = this.getConfigUri("proc_grps.json");
    const document = TextDocument.create(configUriString, "jsonc", 0, text);
    const result = parseProcessGroupConfigs(
      text,
      UriUtils.toUri(configUriString),
    );
    if (!result.config) {
      return result.diagnostics;
    }
    const processingDiagnostics = await this.setProcessGroupConfigs(
      result.config,
      document,
    );
    this.postProcessProgramConfigs();
    return [...result.diagnostics, ...processingDiagnostics];
  }

  private getConfigUri(fileName: string): string {
    return UriUtils.joinPath(
      UriUtils.toUri(this.workspacePath),
      ".pliplugin",
      fileName,
    ).toString();
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
    configDocument?: TextDocument,
  ): Promise<LspDiagnostic[]> {
    this.processGroupConfigs.clear();
    for (const config of processGroupConfigs) {
      // Wrap the loaded config into a GroupRecord. `computedLibs` and
      // `computedLibsSet` are filled in by `postProcessProcessGroups`.
      this.processGroupConfigs.set(config.name.value, {
        ...config,
        computedLibs: [],
        computedLibsSet: new Set<string>(),
      });
    }
    this.postProcessProgramConfigs();
    const diagnostics = await this.postProcessProcessGroups(configDocument);
    this.libFileMatchers = undefined;
    return diagnostics;
  }

  /**
   * Adds a program entry to the in-memory config and persists it to disk.
   *
   * @param workspacePath - Absolute path to the workspace.
   * @param programConfig - The program configuration to register.
   */
  public async addProgramConfig(
    workspacePath: URI,
    programConfig: ProgramConfig,
  ) {
    this.setProgramConfigs(workspacePath, [
      ...this.programConfigs.values(),
      programConfig,
    ]);
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
  public getProgramConfig(program: URI): ProgramRecord | undefined {
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
  public getProcessGroupConfig(pgroup: string): GroupRecord | undefined {
    return this.processGroupConfigs.get(pgroup);
  }

  /**
   * Returns the process group config for the given URI. This is used to find the
   * process group associated with a library file. It is rather fuzzy and might not be 100% accurate.
   * @param libUri URI of the including file (likely a library file)
   * @returns First process group config that includes a matching lib path, or undefined if not found
   */
  public getProcessGroupConfigFromLib(libUri: URI): GroupRecord | undefined {
    const dirname = UriUtils.basename(UriUtils.dirname(libUri));
    const absolutePathLib = UriUtils.toFilePath(UriUtils.dirname(libUri));
    for (const config of this.processGroupConfigs.values()) {
      if (
        config.computedLibsSet.has(dirname) ||
        config.computedLibsSet.has(absolutePathLib)
      ) {
        return config;
      }
    }
    return undefined;
  }
}
