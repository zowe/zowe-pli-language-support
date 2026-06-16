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
  ParseEntry,
  parseProcessGroupConfigs,
  parseProgramConfigs,
  toLspDiagnostic,
} from "../config/loader";
import { Messages } from "../utils/messages";
import { sendRequest } from "../language-server/connection-handler";
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
import { Connection } from "vscode-languageserver";
import { startLongRunningOperation } from "../utils/promises";
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

function validatePluginConfig(
  configs: Map<string, ProgramRecord>,
  pGroups: Map<string, ProcessGroup>,
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  // Check for unknown process groups references under "pgm_conf.json"
  const pgroupReferences: Iterable<ProgramConfig> = configs.values();
  const unknownProcessGroupsDiagnostic = validatePgroupReferences(
    pgroupReferences,
    new Set(pGroups.keys()),
  );
  diagnostics.push(...unknownProcessGroupsDiagnostic);
  return diagnostics;
}

export type PluginConfigLspDiagnostics = MultiMap<string, LspDiagnostic>;
export type PluginConfigDiagnostics = Diagnostic[];

type ProcGrpsSnapshot = {
  entries: PluginConfigUnresolvedLibData[];
  text: string;
  uri: URI;
};

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
   * Per-source snapshots from the most recent postProcessProcessGroups run.
   * Keyed by source URI string. With merge enabled, this can hold up to two
   * entries — `.pliplugin/proc_grps.json` and the `settings.json` /
   * `.code-workspace` file the `pli.proc_grps` value came from. Quick-fix
   * code actions look up the snapshot by the URI of the document the user
   * is acting on.
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
  }

  /**
   * Snapshot of the file the user is acting on, used by quick-fixes that
   * rewrite `proc_grps` to remove unresolved libs.
   *
   * Pass the diagnostic's source URI (i.e. `params.textDocument.uri` from
   * the code-action request) to disambiguate when both `.pliplugin/` and
   * settings contribute a `proc_grps`. Without a URI, returns the only
   * snapshot if there's exactly one — preserves the legacy single-source
   * call sites without changing them.
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
   * Loads the plugin configurations, overwriting any existing configs.
   *
   * Both sources contribute unconditionally and are merged: the
   * `.pliplugin/` files (when present in the workspace) and the
   * `pli.pgm_conf` / `pli.proc_grps` VS Code settings (when set; the
   * extension resolves them to whichever `settings.json` /
   * `.code-workspace` file VS Code attributes the effective value to).
   *
   * On key collisions (same program path or same `pgroup` name in both
   * sources), `.pliplugin/` wins — project files override personal /
   * workspace settings.
   *
   * @returns Diagnostics keyed by source URI. Every file we loaded *or*
   *   previously loaded gets an entry — including empty lists, so the
   *   LSP clears prior diagnostics on files that are no longer a source.
   */
  private async loadConfigurations(): Promise<PluginConfigLspDiagnostics> {
    const workspaceUri = UriUtils.toUri(this.workspacePath);
    const cancel = startLongRunningOperation(
      this.connection,
      "Processing plugin configuration...",
    );

    this.programConfigs.clear();
    this.processGroupConfigs.clear();
    this.procGrpsSnapshots.clear();
    this.knownPgmConfUris.clear();
    this.knownProcGrpsUris.clear();

    this.configDiagnostics = [];

    const diagnostics: PluginConfigDiagnostics = [];

    const plipluginDir = UriUtils.joinPath(workspaceUri, ".pliplugin");
    const plipluginPgmConfUri = UriUtils.joinPath(
      plipluginDir,
      "pgm_conf.json",
    );
    const plipluginProcGrpsUri = UriUtils.joinPath(
      plipluginDir,
      "proc_grps.json",
    );

    // Collect sources in PRECEDENCE-LOWEST-FIRST order. Map-based merge
    // means later writes overwrite earlier writes, so listing
    // .pliplugin/ second makes it the winning source on key collisions.
    const global = await this.fetchGlobalSettings();

    // Read every source concurrently. Precedence (settings < .pliplugin/)
    // is established by the order we assemble each array below, not by the
    // order the reads resolve, so reading in parallel is safe.
    const [globalPgm, globalProc, plipluginPgm, plipluginProc] =
      await Promise.all([
        this.readConfigSource(global?.pgmConf),
        this.readConfigSource(global?.procGrps),
        this.readConfigSource(plipluginPgmConfUri),
        this.readConfigSource(plipluginProcGrpsUri),
      ]);

    const pgmSources = [globalPgm, plipluginPgm].filter(
      (source): source is ConfigSource => source !== undefined,
    );
    const procGrpsSources = [globalProc, plipluginProc].filter(
      (source): source is ConfigSource => source !== undefined,
    );

    // Parse pgm_conf sources and merge by resolved program URI.
    const mergedPrograms = new Map<string, ProgramConfig>();
    for (const source of pgmSources) {
      this.knownPgmConfUris.add(source.uri.toString());
      const result = parseProgramConfigs(source.text, source.uri, source.entry);
      diagnostics.push(...result.diagnostics);
      if (result.config) {
        for (const config of result.config) {
          const resolvedUri = this.resolveProgramPath(
            config.program.value,
            this.workspacePath,
          );
          mergedPrograms.set(resolvedUri.toString(), config);
        }
      }
    }
    this.setProgramConfigs(
      this.workspacePath,
      Array.from(mergedPrograms.values()),
    );

    // Parse proc_grps sources and merge by pgroup name.
    const mergedGroups = new Map<string, ProcessGroup>();
    const procGrpsDocuments = new Map<string, TextDocument>();
    for (const source of procGrpsSources) {
      this.knownProcGrpsUris.add(source.uri.toString());
      procGrpsDocuments.set(source.uri.toString(), source.document);
      const result = parseProcessGroupConfigs(
        source.text,
        source.uri,
        source.entry,
      );
      diagnostics.push(...result.diagnostics);
      if (result.config) {
        for (const config of result.config) {
          mergedGroups.set(config.name.value, config);
        }
      }
    }
    // `processGroupConfigs` was already cleared at the top of this method
    // and nothing has repopulated it since, so we can write straight in.
    for (const config of mergedGroups.values()) {
      this.processGroupConfigs.set(config.name.value, {
        ...config,
        computedLibs: [],
        computedLibsSet: new Set<string>(),
      });
    }
    const validationResult = validatePluginConfig(
      this.programConfigs,
      mergedGroups,
    );
    diagnostics.push(...validationResult);

    this.postProcessProgramConfigs();
    const procGrpsDiagnostics =
      await this.postProcessProcessGroups(procGrpsDocuments);
    diagnostics.push(...procGrpsDiagnostics);
    this.libFileMatchers = undefined;
    this.configDiagnostics = diagnostics;
    const lspDiagnostics = await this.convertDiagnosticsToLsp();
    // Now override which URIs we published diagnostics for this time
    this.previouslyPublishedUris = new Set([
      plipluginPgmConfUri.toString(),
      plipluginProcGrpsUri.toString(),
    ]);
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
   * Asks the client for the VS Code settings backing for `pli.pgm_conf`
   * and `pli.proc_grps`. Returns `undefined` when no connection is
   * available (e.g. tests) or the request fails.
   */
  private async fetchGlobalSettings(): Promise<
    Messages.GlobalConfig | undefined
  > {
    if (!this.connection) return undefined;
    try {
      return await sendRequest(
        this.connection,
        Messages.GetGlobalConfig,
        undefined,
      );
    } catch (err) {
      console.error("Failed to fetch global plugin configuration:", err);
      return undefined;
    }
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
    const text = await this.fs.readFile(resolvedUri);
    if (text === undefined) return undefined;
    const stringText = text.toString();
    return {
      uri: resolvedUri,
      text: stringText,
      entry,
      document: TextDocument.create(
        resolvedUri.toString(),
        "jsonc",
        0,
        stringText,
      ),
    };
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
   * Expands every process group's libs via the lib-expander, populates each
   * record's `computedLibs`/`computedLibsSet` fields, and converts unresolved
   * libs into LSP diagnostics — one per lib, attributed to whichever source
   * file the lib came from (via `libItem.meta?.uri`).
   *
   * Returns diagnostics grouped by source URI string so the caller can
   * publish to each file separately; the merged config can contribute
   * diagnostics to multiple sources at once. Also rebuilds
   * `procGrpsSnapshots`, one entry per source document — quick-fix code
   * actions need the right document text + entries to rewrite.
   *
   * `documents` maps source URI string → TextDocument; it must include
   * every URI referenced by `libItem.meta?.uri` for ranges to convert
   * correctly. Items without meta (test fixtures from
   * {@link deserializeProcessGroup}) get the fallback range and pick any
   * available document.
   */
  private async postProcessProcessGroups(
    documents: Map<string, TextDocument>,
  ): Promise<Diagnostic[]> {
    this.procGrpsSnapshots.clear();
    const diagnostics: Diagnostic[] = [];
    const entriesBySource = new MultiMap<
      string,
      PluginConfigUnresolvedLibData
    >();

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
        const sourceUri = libItem.meta?.uri?.toString();
        const unresolvedLibDiagnostic: Diagnostic = {
          ...diagnosticFromCodeAtRange(
            LspCodes.PluginConfiguration.UnresolvedEntry,
            sourceUri,
            range,
            lib,
          ),
          data: { lib, pgroup: pgroupName, path },
        };
        diagnostics.push(unresolvedLibDiagnostic);
        if (sourceUri) {
          entriesBySource.add(sourceUri, { lib, pgroup: pgroupName, path });
        }
      }
    }

    for (const [uri, document] of documents) {
      this.procGrpsSnapshots.set(uri, {
        entries: Array.from(entriesBySource.get(uri)),
        text: document.getText(),
        uri: UriUtils.toUri(document.uri),
      });
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
  ): Promise<Diagnostic[]> {
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
    const documents = new Map<string, TextDocument>();
    if (configDocument) {
      documents.set(configDocument.uri, configDocument);
    }
    const diagnostics = await this.postProcessProcessGroups(documents);
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
