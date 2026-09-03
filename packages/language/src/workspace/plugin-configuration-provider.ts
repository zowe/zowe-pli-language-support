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
import { DATASET_MEMBER_FILE_REGEX, expandGroup } from "../config/lib-expander";
import { resolveLibUri } from "../config/path-resolver";
import {
  ParseEntry,
  parseProcessGroupConfigs,
  parseProgramConfigs,
  toLspDiagnostic,
} from "../config/loader";
import { GlobalConfigLoader, Messages } from "../utils/messages";
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
import { DEFAULT_INSTRUCTION_LIMIT } from "../preprocessor/instruction-interpreter";
import { PluginConfiguration } from "../language-server/constants";
import { type JSONPath } from "../utils/jsonc";
import { LspCodes } from "../validation/lsp-codes";
import { LongRunningOperation } from "../utils/promises";
import { validatePgroupReferences } from "../config/cross-validation";
import { MultiMap } from "../utils/collections";
import { TextDocuments } from "../language-server/text-documents";

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
  /** Root-relative path to this lib entry, e.g. `["pgroups", 0, "libs", 2]`. */
  path?: JSONPath;
  /**
   * The lib values that should remain in this pgroup's `libs` array once every
   * unresolved entry is removed. Lets the "remove all" quick fix rewrite the
   * array as a whole without re-parsing the source.
   */
  survivingLibs?: string[];
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
          : DEFAULT_INSTRUCTION_LIMIT,
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

export type PluginConfigLspDiagnostics = MultiMap<string, LspDiagnostic>;
export type PluginConfigDiagnostics = Diagnostic[];

export interface ProcGrpsSnapshot {
  entries: PluginConfigUnresolvedLibData[];
  text: string;
  uri: URI;
}

/**
 * One concrete source of plugin configuration (a `.pliplugin/` file or
 * a settings-side document). Holds everything the parser and
 * post-processor need: the URI to attribute diagnostics to, the raw
 * text, the entry navigation hints, and a pre-built TextDocument used
 * for offset→LSP range conversion.
 */
interface ConfigSource {
  uri: URI;
  text: string;
  entry?: ParseEntry;
  document: TextDocument;
}

/**
 * Precedence of a program-config match against a file, **lowest value wins**.
 * Used by {@link PluginConfigurationProvider.getProgramConfig} to prefer an
 * exact path match over a glob match. `Exact` is the best rank, so matching it
 * stops the lookup early.
 */
const ProgramMatchRank = {
  Exact: 0,
  Glob: 1,
} as const;

// Fallback source extensions assumed when a program entry omits one.
const DEFAULT_PROGRAM_EXTENSIONS = [".pli", ".pl1"] as const;

// A dataset member ref or a dotted name already names a concrete target, so no
// extension is fabricated for it (unlike a bare stem).
function programBasenameIsConcrete(basename: string): boolean {
  if (DATASET_MEMBER_FILE_REGEX.test(basename)) {
    return true;
  }
  const dot = basename.lastIndexOf(".");
  return dot > 0 && dot < basename.length - 1;
}

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
   * The key is a path without URI scheme at the beginning.
   * These correspond to the entry point of a compile unit.
   */
  private programConfigs: Map<string, ProgramRecord>;

  /**
   * Map of process group configs, keyed by their group name.
   * These serve as a collection of libraries, compiler options, and other settings.
   */
  private processGroupConfigs: Map<string, GroupRecord>;

  /**
   * The workspace path that we're initialized with. `undefined` when this
   * provider backs the fallback workspace that serves files outside any real
   * workspace folder (or hasn't been initialized yet). Without a workspace
   * there is no base to resolve workspace-relative paths against, so such
   * libs are unresolvable and must not be reported as unresolved.
   */
  private workspaceUri: URI | undefined;

  /**
   * Per-source snapshots from the most recent postProcessProcessGroups run,
   * keyed by source URI. `proc_grps` comes from a single selected source, so
   * this normally holds one entry (`.pliplugin/proc_grps.json` or the
   * `settings.json` / `.code-workspace` file it came from). Quick-fix code
   * actions look it up by the acted-on document's URI.
   */
  private procGrpsSnapshots: Map<string, ProcGrpsSnapshot> = new Map();

  /**
   * URIs of files we loaded program config from on the most recent
   * {@link loadConfigurations} run. Used so quick-fixes / file-type checks
   * can recognize either `.pliplugin/pgm_conf.json` or a settings file
   * as a plugin-config source. {@link isPgmConfigDocumentUri} stays
   * `.pliplugin/`-only so config-completion doesn't fire in `settings.json`.
   */
  private knownPgmConfUris: Set<string> = new Set();

  /**
   * URIs of files we loaded process group config from on the most recent
   * {@link loadConfigurations} run. Same purpose as {@link knownPgmConfUris}.
   */
  private knownProcGrpsUris: Set<string> = new Set();

  private configDiagnostics: PluginConfigDiagnostics = [];

  /**
   * File system provider this configuration loads through. Injected at
   * construction so the provider has no dependency on a global FS singleton.
   */
  private readonly fs: FileSystemProvider;
  private readonly longRunningOperation: LongRunningOperation;
  private readonly globalConfigLoader: GlobalConfigLoader;

  constructor(
    fs: FileSystemProvider,
    globalConfigLoader: GlobalConfigLoader,
    longRunningOperation: LongRunningOperation,
  ) {
    this.fs = fs;
    this.longRunningOperation = longRunningOperation;
    this.globalConfigLoader = globalConfigLoader;
    this.programConfigs = new Map<string, ProgramRecord>();
    this.processGroupConfigs = new Map<string, GroupRecord>();
  }

  /**
   * Snapshot of the file the user is acting on, used by quick-fixes that
   * rewrite `proc_grps` to remove unresolved libs.
   *
   * Pass the diagnostic's source URI (`params.textDocument.uri`) to select the
   * matching snapshot. Without a URI, returns the only snapshot when there's
   * exactly one — the common case, since `proc_grps` has a single source.
   */
  public getLastProcGrpsSnapshot(
    uri?: string,
  ): Readonly<ProcGrpsSnapshot> | undefined {
    if (uri !== undefined) {
      return this.procGrpsSnapshots.get(uri);
    }
    if (this.procGrpsSnapshots.size === 1) {
      return this.procGrpsSnapshots.values().next().value;
    }
    return undefined;
  }

  /**
   * True if `uri` is one of the source files we loaded plugin
   * configuration from on the most recent {@link loadConfigurations} run.
   * Used by code actions to recognize either a `.pliplugin/` file or a
   * settings-style file as a valid target.
   */
  public isPluginConfigSource(uri: URI | string): boolean {
    const key = typeof uri === "string" ? uri : uri.toString();
    return this.knownPgmConfUris.has(key) || this.knownProcGrpsUris.has(key);
  }

  public isProcGrpsConfigSource(uri: URI | string): boolean {
    const key = typeof uri === "string" ? uri : uri.toString();
    return this.knownProcGrpsUris.has(key);
  }

  public getConfigLspDiagnostics(): Promise<PluginConfigLspDiagnostics> {
    return this.convertDiagnosticsToLsp();
  }

  public getConfigInternalDiagnostics(): PluginConfigDiagnostics {
    return this.configDiagnostics;
  }

  /**
   * Initializes the plugin configuration provider with a workspace path, using any plugin configs present in the workspace.
   *
   * @param workspacePath The full path to the workspace to load plugin
   *   configurations from, or `undefined` for the fallback workspace (config
   *   then comes from settings sources only).
   * @returns Diagnostics keyed by config URI
   */
  public async init(
    workspacePath: URI | undefined,
  ): Promise<PluginConfigLspDiagnostics> {
    this.workspaceUri = workspacePath;
    return this.loadConfigurations();
  }

  /**
   * Builds the per-prefix extension index used by `isLibFileCandidate`.
   * Omits DD entries (members live as `name(member)` files; their parent
   * dirs are not "lib directories" in the file-membership sense).
   */
  private buildLibFileMatchers(): void {
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
        const dirUri = resolveLibUri(lib.path, this.workspaceUri);
        if (!dirUri) {
          continue;
        }
        const dir = UriUtils.normalizePath(dirUri.toString(true)).toLowerCase();
        const prefix = `${dir}/`;
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
   * Loads the plugin configurations, overwriting any existing configs.
   *
   * Each config file (`pgm_conf`, `proc_grps`) is taken from exactly one source
   * by precedence — project `.pliplugin/`, else workspace settings, else user
   * settings — and the two files are selected independently.
   *
   * Fallback happens only when a `.pliplugin/` file is *missing*. One that
   * exists (even empty or invalid) is used as-is and blocks fallback; sources
   * are selected whole, never merged property-by-property.
   *
   * @returns Diagnostics keyed by source URI. Every file we loaded *or*
   *   previously loaded gets an entry — including empty lists, so the
   *   LSP clears prior diagnostics on files that are no longer a source.
   */
  private async loadConfigurations(): Promise<PluginConfigLspDiagnostics> {
    const workspaceUri = this.workspaceUri;
    const cancel = this.longRunningOperation.start(
      "Processing plugin configuration...",
    );

    this.programConfigs.clear();
    this.processGroupConfigs.clear();
    this.procGrpsSnapshots.clear();
    this.knownPgmConfUris.clear();
    this.knownProcGrpsUris.clear();

    this.configDiagnostics = [];

    const diagnostics: PluginConfigDiagnostics = [];

    const plipluginDir =
      workspaceUri && UriUtils.joinPath(workspaceUri, ".pliplugin");
    const plipluginPgmConfUri =
      plipluginDir && UriUtils.joinPath(plipluginDir, "pgm_conf.json");
    const plipluginProcGrpsUri =
      plipluginDir && UriUtils.joinPath(plipluginDir, "proc_grps.json");

    const global = await this.fetchGlobalSettings(this.workspaceUri);

    const [pgmSource, procGrpsSource] = await Promise.all([
      this.resolveConfigSource(plipluginPgmConfUri, global?.pgmConf),
      this.resolveConfigSource(plipluginProcGrpsUri, global?.procGrps),
    ]);

    // Parse the selected pgm_conf source (if any). Only one source contributes,
    // so the `has` guard just dedupes program keys within that file.
    const selectedPrograms = new Map<string, ProgramConfig>();
    if (pgmSource) {
      this.knownPgmConfUris.add(pgmSource.uri.toString());
      const result = parseProgramConfigs(
        pgmSource.text,
        pgmSource.uri,
        pgmSource.entry,
      );
      diagnostics.push(...result.diagnostics);
      if (result.config) {
        for (const config of result.config) {
          const key = this.resolveProgramKey(
            config.program.value,
            this.workspaceUri,
          );
          if (!selectedPrograms.has(key)) {
            selectedPrograms.set(key, config);
          }
        }
      }
    }
    this.applyProgramConfigs(
      this.workspaceUri,
      Array.from(selectedPrograms.values()),
    );

    // Parse the selected proc_grps source (if any), keyed by pgroup name;
    // duplicate names within it are won by the later entry.
    const selectedGroups = new Map<string, ProcessGroup>();
    if (procGrpsSource) {
      this.knownProcGrpsUris.add(procGrpsSource.uri.toString());
      const result = parseProcessGroupConfigs(
        procGrpsSource.text,
        procGrpsSource.uri,
        procGrpsSource.entry,
      );
      diagnostics.push(...result.diagnostics);
      if (result.config) {
        for (const config of result.config) {
          selectedGroups.set(config.name.value, config);
        }
      }
    }
    // `processGroupConfigs` was already cleared at the top of this method
    // and nothing has repopulated it since, so we can write straight in.
    for (const config of selectedGroups.values()) {
      this.processGroupConfigs.set(config.name.value, {
        ...config,
        computedLibs: [],
      });
    }

    this.postProcessProgramConfigs();
    const procGrpsDiagnostics = await this.postProcessProcessGroups(
      procGrpsSource?.document,
    );
    diagnostics.push(...procGrpsDiagnostics);
    // Runs AFTER the post-processing above so the program/lib overlap check
    // sees each group's expanded `computedLibs`.
    diagnostics.push(...this.validatePluginConfig());
    this.libFileMatchers = undefined;
    this.configDiagnostics = diagnostics;
    const lspDiagnostics = await this.convertDiagnosticsToLsp();
    // Now override which URIs we published diagnostics for this time
    this.previouslyPublishedUris = new Set<string>();
    if (plipluginPgmConfUri) {
      this.previouslyPublishedUris.add(plipluginPgmConfUri.toString());
    }
    if (plipluginProcGrpsUri) {
      this.previouslyPublishedUris.add(plipluginProcGrpsUri.toString());
    }
    for (const diagnostic of diagnostics) {
      const uri = diagnostic.uri?.toString();
      if (uri) {
        this.previouslyPublishedUris.add(uri);
      }
    }
    cancel();
    return lspDiagnostics;
  }

  private async convertDiagnosticsToLsp(): Promise<PluginConfigLspDiagnostics> {
    const lspDiagnostics = new MultiMap<string, LspDiagnostic>();
    for (const diagnostic of this.configDiagnostics) {
      if (diagnostic.uri) {
        const document = await TextDocuments.get(diagnostic.uri.toString());
        if (document) {
          lspDiagnostics.add(
            diagnostic.uri.toString(),
            toLspDiagnostic(diagnostic, document),
          );
        }
      }
    }
    // Make sure URIs we published last time but are no longer sources
    // come back with an empty list, so the editor clears those diagnostics.
    for (const uri of this.previouslyPublishedUris) {
      if (!lspDiagnostics.has(uri)) {
        lspDiagnostics.addAll(uri, []);
      }
    }
    return lspDiagnostics;
  }

  /**
   * URIs whose diagnostics we published on the previous load. Re-included
   * with an empty list on the next load if they're no longer a source,
   * so the LSP clears stale diagnostics.
   */
  private previouslyPublishedUris: Set<string> = new Set();

  /**
   * Asks the {@link GlobalConfigLoader} for the VS Code settings backing for
   * `pli.pgm_conf` and `pli.proc_grps` for the given workspace. In production
   * this round-trips to the client; in tests it's a fixture-backed loader.
   */
  private async fetchGlobalSettings(
    workspaceUri: URI | undefined,
  ): Promise<Messages.GlobalConfig | undefined> {
    return this.globalConfigLoader.loadGlobalConfig(workspaceUri);
  }

  /**
   * Reads a config file and wraps it as a {@link ConfigSource}, or returns
   * `undefined` if the file doesn't exist.
   */
  private async readConfigSource(
    item: URI | Messages.GlobalConfigEntry | undefined,
  ): Promise<ConfigSource | undefined> {
    if (!item) {
      return undefined;
    }
    let resolvedUri: URI;
    let entry: ParseEntry | undefined;
    if ("scheme" in item) {
      resolvedUri = item;
    } else {
      resolvedUri = UriUtils.toUri(item.uri);
      entry = {
        configKey: item.configKey,
        containerPath: item.containerPath,
      };
    }
    let text: string;
    const textDocument = await TextDocuments.get(resolvedUri);
    if (textDocument) {
      text = textDocument.getText();
    } else {
      return undefined;
    }
    return {
      uri: resolvedUri,
      text,
      entry,
      document: textDocument,
    };
  }

  /**
   * Returns the highest-priority settings source for one config key —
   * workspace scope before user scope — or `undefined` if neither resolves
   * to a document. A file that exists wins its tier even if empty/invalid.
   */
  private async readPreferredGlobalConfigSource(
    entries: Messages.GlobalConfigEntry[] | undefined,
  ): Promise<ConfigSource | undefined> {
    for (const scope of ["workspace", "user"] as const) {
      const entry = entries?.find((e) => e.scope === scope);
      const source = await this.readConfigSource(entry);
      if (source) {
        return source;
      }
    }
    return undefined;
  }

  /**
   * Resolves the winning {@link ConfigSource} for one config file by precedence:
   * project (`.pliplugin/`) first, then settings (workspace before user, read
   * lazily). Returns `undefined` if no tier provides the file.
   */
  private async resolveConfigSource(
    pluginUri: URI | undefined,
    entries: Messages.GlobalConfigEntry[] | undefined,
  ): Promise<ConfigSource | undefined> {
    return (
      (await this.readConfigSource(pluginUri)) ??
      (await this.readPreferredGlobalConfigSource(entries))
    );
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
    const workspaceUri = this.requireWorkspaceUri();
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
    const workspaceUri = this.requireWorkspaceUri();
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
   * Return the workspace URI that this provider was initialized with, or
   * `undefined` for the fallback workspace.
   */
  public getWorkspaceUri(): URI | undefined {
    return this.workspaceUri;
  }

  /**
   * The workspace URI for operations that make no sense without one
   * (config file authoring). Throws on the fallback workspace.
   */
  public requireWorkspaceUri(): URI {
    if (!this.workspaceUri) {
      throw new Error(
        "Operation requires a workspace, but this provider has none (fallback workspace).",
      );
    }
    return this.workspaceUri;
  }

  public isPgmConfigDocumentUri(uri: URI | string): boolean {
    if (!this.workspaceUri) {
      return false;
    }
    const inputUri = typeof uri === "string" ? UriUtils.toUri(uri) : uri;
    const pgmConfigUri = UriUtils.joinPath(
      this.workspaceUri,
      ".pliplugin",
      "pgm_conf.json",
    );
    return UriUtils.equals(pgmConfigUri, inputUri);
  }

  public isProcGrpsDocumentUri(uri: URI | string): boolean {
    if (!this.workspaceUri) {
      return false;
    }
    const inputUri = typeof uri === "string" ? UriUtils.toUri(uri) : uri;
    const procGrpsUri = UriUtils.joinPath(
      this.workspaceUri,
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
   * Expands every process group's libs via the lib-expander, populates each
   * record's `computedLibs` field, and converts unresolved
   * libs into LSP diagnostics — one per lib, attributed to whichever source
   * file the lib came from (via `libItem.meta?.uri`).
   *
   * Returns diagnostics grouped by source URI string so the caller can
   * publish to each file separately. Also rebuilds `procGrpsSnapshots`, one
   * entry per source document — quick-fix code actions need the right
   * document text + entries to rewrite.
   *
   * `documents` maps source URI string → TextDocument; it must include
   * every URI referenced by `libItem.meta?.uri` for ranges to convert
   * correctly. Items without meta (test fixtures from
   * {@link deserializeProcessGroup}) get the fallback range and pick any
   * available document.
   */
  private async postProcessProcessGroups(
    document?: TextDocument,
  ): Promise<Diagnostic[]> {
    this.procGrpsSnapshots.clear();
    const diagnostics: Diagnostic[] = [];
    const entriesBySource = new MultiMap<
      string,
      PluginConfigUnresolvedLibData
    >();

    // The fallback workspace has no base for workspace-relative paths, so skip
    // "unresolved" diagnostics for them (absolute-path libs are still checked).
    const isFallback = this.workspaceUri === undefined;

    for (const record of this.processGroupConfigs.values()) {
      const expanded = await expandGroup(
        record.libs,
        this.fs,
        this.workspaceUri,
      );
      record.computedLibs = expanded.libs;

      const pgroupName = record.name.value;
      // The libs that stay once every unresolved entry is dropped. `unresolved`
      // holds the original `record.libs` items (by reference), so set membership
      // is exact and duplicate-safe. Computed once per pgroup and shared by all
      // of its unresolved diagnostics so the "remove all" quick fix can rewrite
      // the array without re-parsing.
      const unresolvedItems = new Set(
        expanded.unresolved.map((item) => item[0]),
      );
      const survivingLibs = record.libs
        .filter((item) => !unresolvedItems.has(item))
        .map((item) => item.value);
      for (const [libItem, reason] of expanded.unresolved) {
        // Skip relative libs in the fallback workspace (see above).
        if (isFallback && !this.isAbsolutePath(libItem.value)) {
          continue;
        }
        const fallbackRange = offsetLengthToRange(0, 1);
        const range = libItem.meta?.range ?? fallbackRange;
        const path = libItem.meta?.path;
        const lib = libItem.value;
        const sourceUri = libItem.meta?.uri?.toString();
        const data: PluginConfigUnresolvedLibData = {
          lib,
          pgroup: pgroupName,
          path,
          survivingLibs,
        };
        const unresolvedLibDiagnostic: Diagnostic = {
          ...diagnosticFromCodeAtRange(
            LspCodes.PluginConfiguration.UnresolvedEntry,
            sourceUri,
            range,
            lib,
            reason,
          ),
          data,
        };
        diagnostics.push(unresolvedLibDiagnostic);
        if (sourceUri) {
          entriesBySource.add(sourceUri, data);
        }
      }
    }

    if (document) {
      this.procGrpsSnapshots.set(document.uri, {
        entries: Array.from(entriesBySource.get(document.uri)),
        text: document.getText(),
        uri: UriUtils.toUri(document.uri),
      });
    }

    return diagnostics;
  }

  /**
   * Validates the merged plugin configuration and returns the accumulated
   * diagnostics. Single entry point for the config-level checks, called from
   * {@link loadConfigurations} *after* the configs are post-processed.
   */
  private validatePluginConfig(): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    diagnostics.push(
      ...validatePgroupReferences(
        this.programConfigs.values(),
        new Set(this.processGroupConfigs.keys()),
      ),
    );
    diagnostics.push(...this.validateProgramLibOverlap());
    return diagnostics;
  }

  /**
   * Warns when a directory is both a configured lib and a program-entry
   * location for one of the lib's include extensions, since such files are
   * ambiguously both compiled standalone and offered as includes. Emits at
   * most one diagnostic per (program entry, lib directory) pair.
   */
  private validateProgramLibOverlap(): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    for (const processGroup of this.processGroupConfigs.values()) {
      const extSet = new Set(
        processGroup.includeExtensions.map((item) =>
          (item.value.startsWith(".")
            ? item.value
            : `.${item.value}`
          ).toLowerCase(),
        ),
      );
      if (extSet.size === 0) {
        // No include extensions → nothing can overlap on.
        continue;
      }
      for (const lib of processGroup.computedLibs) {
        // Only real directories carry a `files` map; skip dataset/DD libs.
        if (!isLibsDir(lib)) {
          continue;
        }
        const libUri = resolveLibUri(lib.path, this.workspaceUri);
        if (!libUri) {
          continue;
        }
        // Dedupe: one warning per program entry overlapping this lib dir,
        // even if many files in the dir match that entry.
        const seenProgramKeys = new Set<string>();
        for (const realName of lib.files.values()) {
          const dotIdx = realName.lastIndexOf(".");
          const ext = dotIdx >= 0 ? realName.slice(dotIdx).toLowerCase() : "";
          if (!extSet.has(ext)) {
            continue;
          }
          const fileUri = UriUtils.joinPath(libUri, realName);
          const program = this.getProgramConfig(fileUri);
          if (!program) {
            continue;
          }
          const key = program.program.value;
          if (seenProgramKeys.has(key)) {
            continue;
          }
          seenProgramKeys.add(key);
          const uri = program.program.meta?.uri?.toString();
          const range =
            program.program.meta?.range ?? offsetLengthToRange(0, 1);
          diagnostics.push(
            diagnosticFromCodeAtRange(
              LspCodes.PluginConfiguration.AmbiguousProgramLibOverlap,
              uri,
              range,
              lib.path,
              ext,
              processGroup.name.value,
            ),
          );
        }
      }
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
    diagnostics: Diagnostic[] = [],
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
    this.applyProgramConfigs(workspaceUri, programConfigs);
  }

  /**
   * Rebuilds the program-config map from the given configs. Program paths are
   * normalized and resolved relative to the workspace (unless absolute), then
   * post-processed so abstract options are built.
   */
  private applyProgramConfigs(
    workspaceUri: URI | undefined,
    programConfigs: ProgramConfig[],
  ): void {
    this.programConfigs.clear();

    for (const config of programConfigs) {
      const key = this.resolveProgramKey(config.program.value, workspaceUri);
      // Wrap the loaded config into a ProgramRecord. `abstractOptions` and
      // `issues` are filled in by `postProcessProgramConfigs` once the
      // bound process group is also available.
      this.programConfigs.set(key, {
        ...config,
        abstractOptions: { options: [], tokens: [], issues: [], comments: [] },
        issues: [],
      });
    }
    this.postProcessProgramConfigs();
  }

  /**
   * Resolves a program path to the key it's matched under (see
   * {@link getProgramConfig}). Normalizes backslashes to forward slashes,
   * then uses the path as-is if absolute, or joins it with the workspace URI
   * if relative. Without a workspace (the fallback workspace), a relative
   * path stays as-is and matches unanchored against full file paths.
   */
  private resolveProgramKey(
    programPath: string,
    workspaceUri: URI | undefined,
  ): string {
    let normalizedProgramPath = UriUtils.normalizePath(programPath);
    // A bare "." or "./" means the workspace folder itself, matching its direct
    // (non-recursive) children. Expressed as the "*" glob, since joining "."
    // collapses back to the workspace URI and would then match nothing.
    if (normalizedProgramPath === "." || normalizedProgramPath === "./") {
      normalizedProgramPath = "*";
    }
    // Key URI-scheme entries by path so they match the document. Skip
    // single-letter schemes: `C:foo` is a drive-relative path, not a URI.
    if (
      UriUtils.computePathType(normalizedProgramPath) === UriUtils.PathType.URI
    ) {
      const programUri = UriUtils.toUri(normalizedProgramPath);
      if (programUri.scheme.length > 1) {
        return programUri.path;
      }
    }
    if (this.isAbsolutePath(normalizedProgramPath)) {
      return UriUtils.toUri(normalizedProgramPath).path;
    }
    if (!workspaceUri) {
      return normalizedProgramPath;
    }
    return UriUtils.joinPath(workspaceUri, normalizedProgramPath).path;
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
  public async parseProcessGroupConfigs(text: string): Promise<Diagnostic[]> {
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
      this.requireWorkspaceUri(),
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
  ): Promise<Diagnostic[]> {
    this.processGroupConfigs.clear();
    for (const config of processGroupConfigs) {
      // Wrap the loaded config into a GroupRecord. `computedLibs` is filled
      // in by `postProcessProcessGroups`.
      this.processGroupConfigs.set(config.name.value, {
        ...config,
        computedLibs: [],
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
   *
   * An exact path match wins outright; otherwise the first matching glob entry
   * is returned (see {@link ProgramMatchRank}). This keeps an exact key like
   * `a.pli` from being shadowed by a broader glob such as `*.pli` that also
   * matches the same file.
   *
   * @param program Name of the program to get a config for
   * @returns Associated program config, or undefined if not found
   */
  public getProgramConfig(program: URI): ProgramRecord | undefined {
    const path = program.path;

    let globMatch: ProgramRecord | undefined;
    for (const [pattern, config] of this.programConfigs.entries()) {
      const rank = this.programMatchRank(path, pattern, config);
      if (rank === ProgramMatchRank.Exact) {
        return config;
      }
      if (rank === ProgramMatchRank.Glob) {
        globMatch = globMatch ?? config;
      }
    }
    return globMatch;
  }

  /**
   * Precedence of a single program-config entry as a match for `path`, or
   * `undefined` when its pattern does not match the file. Lower ranks win;
   * see {@link ProgramMatchRank}.
   *
   * @param path Decoded program path being resolved.
   * @param pattern The program config's key (an exact path or a glob).
   */
  private programMatchRank(
    path: string,
    pattern: string,
    record: ProgramRecord,
  ): number | undefined {
    const kind = this.programMatchKind(path, pattern, record);
    if (kind === "none") {
      return;
    }
    return kind === "exact" ? ProgramMatchRank.Exact : ProgramMatchRank.Glob;
  }

  /**
   * Classifies `pattern` against `path` as exact/glob/none, letting an
   * extensionless entry also bind its on-disk file via an assumed extension.
   */
  private programMatchKind(
    path: string,
    pattern: string,
    record: ProgramRecord,
  ): "exact" | "glob" | "none" {
    if (pattern === path) {
      return "exact";
    }
    let decoded: string;
    try {
      decoded = decodeURIComponent(pattern);
    } catch (e) {
      console.error(
        `Invalid program pattern "${pattern}" for program "${path}": ${e}`,
      );
      return "none";
    }

    const hasWildcard = decoded.includes("*");
    const basename = decoded.substring(decoded.lastIndexOf("/") + 1);
    const assumedExts = programBasenameIsConcrete(basename)
      ? []
      : this.assumedProgramExtensions(record);

    // A stem that only matches once an extension is assumed is still a
    // specifically-named entry, so treat it as exact rather than glob.
    if (!hasWildcard && assumedExts.length > 0) {
      const lowerPath = path.toLowerCase();
      for (const ext of assumedExts) {
        if (lowerPath === (decoded + ext).toLowerCase()) {
          return "exact";
        }
      }
    }

    try {
      if (minimatch(path, decoded, { nocase: true })) {
        return "glob";
      }
      for (const ext of assumedExts) {
        if (minimatch(path, decoded + ext, { nocase: true })) {
          return "glob";
        }
      }
    } catch (e) {
      console.error(
        `Invalid glob pattern "${pattern}" for program "${path}": ${e}`,
      );
      return "none";
    }
    return "none";
  }

  // Prefer the bound group's include-extensions, but always keep the .pli/.pl1
  // fallback so an entry still binds when the group declares none.
  private assumedProgramExtensions(record: ProgramRecord): string[] {
    const exts = new Set<string>();
    const pgroup = this.processGroupConfigs.get(record.pgroup.value);
    for (const item of pgroup?.includeExtensions ?? []) {
      const value = item.value.toLowerCase();
      exts.add(value.startsWith(".") ? value : `.${value}`);
    }
    for (const ext of DEFAULT_PROGRAM_EXTENSIONS) {
      exts.add(ext);
    }
    return Array.from(exts);
  }

  /**
   * Returns true if the given program has a config (i.e. is a listed entry point)
   */
  public hasProgramConfig(program: URI): boolean {
    return this.getProgramConfig(program) !== undefined;
  }

  /**
   * Lets the client trust an exact entry outright while still content-checking
   * a mere glob match before reclassifying a file.
   */
  public classifyProgramMatch(program: URI): "exact" | "glob" | "none" {
    const path = program.path;
    let sawGlob = false;
    for (const [pattern, config] of this.programConfigs.entries()) {
      const kind = this.programMatchKind(path, pattern, config);
      if (kind === "exact") {
        return "exact";
      }
      if (kind === "glob") {
        sawGlob = true;
      }
    }
    return sawGlob ? "glob" : "none";
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

  public getProgramConfigFromLib(libUri: URI): ProgramRecord | undefined {
    const processGroup = this.getProcessGroupConfigFromLib(libUri);
    if (!processGroup) {
      return undefined;
    }
    for (const program of this.programConfigs.values()) {
      if (program.pgroup.value === processGroup.name.value) {
        return program;
      }
    }
    return undefined;
  }

  /**
   * Returns the process group config for the given URI. This is used to find the
   * process group associated with a library file. It is rather fuzzy and might not be 100% accurate.
   * @param libUri URI of the including file (likely a library file)
   * @returns First process group config that includes a matching lib path, or undefined if not found
   */
  public getProcessGroupConfigFromLib(libUri: URI): GroupRecord | undefined {
    const dirUri = UriUtils.dirname(libUri);
    const dirname = UriUtils.basename(dirUri);
    const absolutePathLib = UriUtils.toFilePath(dirUri);
    const fileName = UriUtils.basename(libUri).toLowerCase();
    for (const config of this.processGroupConfigs.values()) {
      for (const lib of config.computedLibs) {
        if (isLibsDir(lib)) {
          const path = lib.path;
          if (path === dirname || path === absolutePathLib) {
            return config;
          }
        } else {
          for (const memberFile of lib.members.values()) {
            if (memberFile.toLowerCase() === fileName) {
              return config;
            }
          }
        }
      }
    }
    return undefined;
  }

  public getLibDirectoryUris(): URI[] {
    const uris: URI[] = [];
    for (const config of this.processGroupConfigs.values()) {
      for (const lib of config.computedLibs) {
        const libUri = resolveLibUri(lib.path, this.workspaceUri);
        if (!libUri) {
          continue;
        }
        uris.push(isLibsDir(lib) ? libUri : UriUtils.dirname(libUri));
      }
    }
    return uris;
  }
}
