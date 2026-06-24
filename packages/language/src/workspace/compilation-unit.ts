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

import { Program, SyntaxKind } from "../syntax-tree/ast.js";
import { isVirtualFile, URI, UriUtils } from "../utils/uri.js";
import { CancellationToken, Connection } from "vscode-languageserver";
import { ReferencesCache, StatementOrderCache } from "../linking/resolver.js";
import { diagnosticsToLSP } from "../language-server/types.js";
import {
  generateSymbolTable,
  lifecycle,
  link,
  parse,
  tokenize,
} from "./lifecycle.js";
import { skippedCode } from "../language-server/skipped-code.js";
import { marginIndicator } from "../language-server/margin-indicator.js";
import { createLSRequestCaches, LSRequestCache } from "../utils/cache.js";
import { Scope, ScopeCacheGroups } from "../linking/scope.js";
import { Token } from "../parser/tokens.js";
import {
  EditorDocuments,
  TextDocuments,
} from "../language-server/text-documents.js";
import {
  BuiltinsMacroTextDocument,
  BuiltinsTextDocument,
  BuiltinsIntTypeAliasesLP32TextDocument,
  BuiltinsIntTypeAliasesLP64TextDocument,
  BuiltinsUriSchema,
} from "./builtins.js";
import { GroupRecord, ProgramRecord } from "./plugin-configuration-provider.js";
import { WorkspaceContext } from "./workspace-context.js";
import { EvaluationResults } from "../preprocessor/instruction-interpreter.js";
import { createMutex, Mutex } from "./mutex.js";
import { Deferred, isOperationCancelled } from "../utils/promises.js";
import { InstructionCache } from "../preprocessor/instruction-cache.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { FileStore } from "./file-store.js";
import { DefaultTypeInferer, TypeInferer } from "../typesystem/infer.js";
import { DefaultTypeCache, TypeCache } from "../typesystem/type-cache.js";
import {
  CompilerOptions,
  getDefaultCompilerOptions,
} from "../preprocessor/compiler-options/options.js";
import { CompilerOptions as PliCompilerOptions } from "../preprocessor/compiler-options/options-pli.js";
import { DiagnosticsStore } from "../validation/diagnostics-store.js";
import { LRUCache } from "lru-cache";

/**
 * A compilation unit is a representation of a PL/I program in the language server.
 * It contains all information about the program.
 *
 * Note that the compilation unit is not a representation of the file on disk, but rather
 * a representation of the file once all of its macros have been expanded.
 * This means in particular that `%INCLUDE` statements have been resolved.
 * This in turn means that the compilation unit is a collection of files, starting with the main file.
 */
export interface CompilationUnit {
  /**
   * The URI of the source file. This points to the main file that represents the entry point of the program.
   * This might not be the same as the URI of the currently open file.
   */
  uri: URI;
  compilerOptions: CompilerOptions;
  ast: Program;
  preprocessorAst: Program;
  preprocessorEvaluationResults: EvaluationResults;
  tokens: Token[];
  referencesCache: ReferencesCache;
  statementOrderCache: StatementOrderCache;
  diagnostics: DiagnosticsStore;
  scopeCaches: ScopeCacheGroups;
  requestCaches: LSRequestCache;
  instructionCache: InstructionCache;
  rootScope: Scope;
  rootPreprocessorScope: Scope;
  readonly services: CompilationServices;
  readonly programConfig: ProgramRecord | undefined;
  readonly processGroup: GroupRecord | undefined;
  readonly mutex: Mutex;
  /**
   * Resets all caches associated with this compilation unit.
   */
  reset(): void;
}

export interface CompilationServices {
  files: FileStore;
  typeCache: TypeCache;
  includeCache: LRUCache<string, string>;
  inferer: TypeInferer;
  /**
   * The workspace this unit belongs to. Owns the file system provider and
   * the plugin configuration. Replaces the `PluginConfigurationProviderInstance`
   * and `FileSystemProviderInstance` globals: callers reach the workspace
   * through their compilation unit.
   */
  workspace: WorkspaceContext;
}

const FIVE_MINUTES = 1000 * 60 * 5;

/**
 * JSON under `.pliplugin/` is not PL/I source. The client attaches the LS there for code actions;
 * we skip compilation so only plugin-config diagnostics (e.g. COPC*) from the plugin loader show.
 */
function isPluginConfigurationUri(uri: URI): boolean {
  const path = uri.fsPath.replace(/\\/g, "/");
  return path.includes("/.pliplugin/") && /\.json$/i.test(path);
}

export async function createCompilationUnit(
  uri: URI,
  workspace: WorkspaceContext,
): Promise<CompilationUnit> {
  const compilerOptions = getDefaultCompilerOptions();
  const services: CompilationServices = {
    files: new FileStore([]),
    typeCache: new DefaultTypeCache(),
    includeCache: new LRUCache({
      max: 500,
      ttl: FIVE_MINUTES,
    }),
    inferer: new DefaultTypeInferer(),
    workspace,
  };
  // Cache for programConfig and processGroup to avoid repeated lookups
  // They cannot change during the lifetime of a compilation unit anyway
  let cachedProgramConfig: ProgramRecord | undefined | null = null;
  let cachedProcessGroup: GroupRecord | undefined | null = null;
  const unit: CompilationUnit = {
    uri,
    services,
    compilerOptions,
    ast: {
      kind: SyntaxKind.Program,
      container: null,
      statements: [],
    },
    preprocessorAst: {
      kind: SyntaxKind.Program,
      container: null,
      statements: [],
    },
    preprocessorEvaluationResults: {
      branchExecutions: new Map(),
    },
    tokens: [],
    referencesCache: new ReferencesCache(),
    statementOrderCache: new StatementOrderCache(),
    scopeCaches: new ScopeCacheGroups(),
    instructionCache: new InstructionCache(),
    diagnostics: new DiagnosticsStore(),
    requestCaches: createLSRequestCaches()
      .onRevalidate("margins", ({ connection, unit }) => {
        marginIndicator(connection, unit);
      })
      .onRevalidate("skippedCodeRanges", ({ connection, unit }) => {
        skippedCode(connection, unit);
      }),
    rootScope: Scope.createRoot(),
    rootPreprocessorScope: Scope.createRoot(),
    get programConfig() {
      if (cachedProgramConfig !== null) {
        return cachedProgramConfig;
      }
      cachedProgramConfig = workspace.config.getProgramConfig(uri);
      return cachedProgramConfig;
    },
    get processGroup() {
      if (cachedProcessGroup !== null) {
        return cachedProcessGroup;
      }
      if (this.programConfig) {
        cachedProcessGroup = workspace.config.getProcessGroupConfig(
          this.programConfig.pgroup.value,
        );
      } else {
        cachedProcessGroup = undefined;
      }
      return cachedProcessGroup;
    },
    mutex: createMutex(),
    reset() {
      services.files.clear();
      services.typeCache.clear();
      unit.statementOrderCache.clear();
      unit.referencesCache.clear();
      unit.scopeCaches.clear();
      unit.diagnostics.clear();
      cachedProcessGroup = null;
      cachedProgramConfig = null;
    },
  };
  return unit;
}

const BuiltinFileStart = `${BuiltinsUriSchema}:/`;
const isBuiltinFile = (uri: URI) => uri.toString().startsWith(BuiltinFileStart);

function createBuiltinUnitGetter(
  builtinDocument: TextDocument,
  parentUnitGetter?: (workspace: WorkspaceContext) => Promise<CompilationUnit>,
): (workspace: WorkspaceContext) => Promise<CompilationUnit> {
  let builtinUnit: CompilationUnit | undefined = undefined;
  return async (workspace) => {
    if (!builtinUnit) {
      const fileUri = URI.parse(builtinDocument.uri);
      builtinUnit = await createCompilationUnit(fileUri, workspace);
      await tokenize(builtinUnit, builtinDocument);
      parse(builtinUnit);

      if (parentUnitGetter) {
        const parentUnit = await parentUnitGetter(workspace);
        const parentScope = parentUnit.scopeCaches.regular.get(parentUnit.ast);
        if (parentScope) {
          builtinUnit.rootScope = parentScope;
        }
      }

      await generateSymbolTable(builtinUnit);
      link(builtinUnit);
    }
    return builtinUnit;
  };
}

const getBuiltinUnit = createBuiltinUnitGetter(BuiltinsTextDocument);
const getBuiltinMacroUnit = createBuiltinUnitGetter(BuiltinsMacroTextDocument);
const getBuiltinIntTypeAliasesLP32Unit = createBuiltinUnitGetter(
  BuiltinsIntTypeAliasesLP32TextDocument,
  getBuiltinUnit,
);
const getBuiltinIntTypeAliasesLP64Unit = createBuiltinUnitGetter(
  BuiltinsIntTypeAliasesLP64TextDocument,
  getBuiltinUnit,
);

/**
 * Add all builtin units and set up the root scope chain.
 * Must be called after compiler options are extracted (during tokenization).
 */
export async function addBuiltinUnits(
  unit: CompilationUnit,
  workspace: WorkspaceContext,
): Promise<void> {
  if (isBuiltinFile(unit.uri)) {
    return;
  }

  const builtinUnit = await getBuiltinUnit(workspace);
  const macroUnit = await getBuiltinMacroUnit(workspace);
  const intTypeAliasUnit =
    unit.compilerOptions.LP === PliCompilerOptions.LP.LP64
      ? await getBuiltinIntTypeAliasesLP64Unit(workspace)
      : await getBuiltinIntTypeAliasesLP32Unit(workspace);

  unit.services.files.addBaseFiles([builtinUnit, macroUnit, intTypeAliasUnit]);

  const intTypeAliasScope =
    intTypeAliasUnit.scopeCaches.regular.get(intTypeAliasUnit.ast) ??
    Scope.createRoot();
  const macroScope =
    macroUnit.scopeCaches.regular.get(macroUnit.ast) ?? Scope.createRoot();

  unit.rootScope = Scope.createChild(intTypeAliasScope);
  unit.rootPreprocessorScope = Scope.createChild(macroScope);
}

export class CompilationUnitHandler {
  private compilationUnits: Map<string, CompilationUnit> = new Map();
  private connection!: Connection;
  private readyDeferred = new Deferred();

  /**
   * A global mutex that ensures that retrieving compilation units happens after they are created.
   */
  readonly globalMutex = createMutex();

  /**
   * Workspace context shared by every unit this handler creates. Provides
   * the file-system provider and the plugin configuration.
   */
  readonly workspace: WorkspaceContext;

  constructor(workspace: WorkspaceContext) {
    this.workspace = workspace;
  }

  get ready(): Promise<void> {
    return this.readyDeferred.promise;
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
    if (!this.workspace.config.isLibFileCandidate(uri)) {
      // non-library files should always generate a compilation unit
      const unit = await this.createAndStoreCompilationUnit(uri);
      return unit;
    } else {
      // do not generate compilation units for standalone library files
      return undefined;
    }
  }

  async createAndStoreCompilationUnit(uri: URI): Promise<CompilationUnit> {
    const unit = await createCompilationUnit(uri, this.workspace);
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

  /**
   * Marks the compilation unit handler as ready to process updates.
   * **Must** be called if `listen` has been called previously.
   */
  markReady(): void {
    this.readyDeferred.resolve();
  }

  listen(connection: Connection): void {
    this.connection = connection;
    const textDocuments = EditorDocuments;
    textDocuments.listen(connection);
    textDocuments.onDidChangeContent((event) => {
      const uri = UriUtils.toUri(event.document.uri);
      this.updateUri(uri);
    });
    textDocuments.onDidClose((event) => {
      const uri = UriUtils.toUri(event.document.uri);
      this.globalMutex.read(async () => {
        const unit = this.compilationUnits.get(uri.toString());
        if (unit && this.tryCloseCompilationUnit(uri)) {
          for (const file of unit.services.files.keys()) {
            // Clear diagnostics for all files in the closed compilation unit
            // Otherwise, keep the diagnostics, even if the files have been closed
            connection.sendDiagnostics({
              uri: file,
              diagnostics: [],
            });
          }
        }
      });
    });
  }

  private tryCloseCompilationUnit(uri: URI): boolean {
    const unit = this.compilationUnits.get(uri.toString());
    if (!unit) {
      // Nothing to close
      return false;
    }
    for (const file of unit.services.files.keys()) {
      if (EditorDocuments.has(file)) {
        // Return early if any file is still open
        return false;
      }
    }
    return this.deleteCompilationUnit(uri);
  }

  async updateUri(uri: URI): Promise<void> {
    await this.globalMutex.run(async () => {
      await this.ready;
      if (isPluginConfigurationUri(uri)) {
        // Plugin configuration changes should trigger a reindex
        this.updateConfigs();
        return;
      }
      const unit = await this.getOrCreateCompilationUnit(uri);
      if (!unit) {
        // standalone library files do not synthesize new compilation units
        return;
      }
      // We do not await the compilation unit mutex operation here
      // This ensures that we exit the global mutex as soon as possible.
      // That way, we allow subsequent updates cancel the previous requests
      // While ensuring that only one update runs at a time for a specific compilation unit
      // And also ensuring that the LSP requests wait for the compilation unit to be available
      unit.mutex.run(async (cancellationToken) => {
        const document = await EditorDocuments.get(unit.uri);
        if (!document) {
          return;
        }
        await this.process(unit, document, this.connection, cancellationToken);
        // TODO: Wagner Laranjeiras -> includeCache based on changes of a specific file.
        unit.services.includeCache.clear();
        unit.requestCaches.revalidateAll({ connection: this.connection, unit });
      });
    });
  }

  /**
   * Process a unit by running it through the lifecycle and generating diagnostics to report back.
   * @param unit The compilation unit
   * @param text Program content to use for the lifecycle
   * @param connection The connection to send diagnostics to
   */
  private async process(
    unit: CompilationUnit,
    document: TextDocument,
    connection: Connection,
    cancellationToken: CancellationToken,
  ): Promise<void> {
    try {
      await lifecycle(unit, document, cancellationToken);
      for (const file of unit.services.files.keys()) {
        this.compilationUnits.set(file, unit);
      }
      const allDiagnostics = diagnosticsToLSP(unit, unit.diagnostics.getAll());
      for (const file of unit.services.files.keys()) {
        // Check synchronously if the file is currently open in the editor.
        // Use has() not get() - we don't want to load from disk, just check if already open.
        // Do not report diagnostics for virtual files or files not currently open in the editor.
        if (!EditorDocuments.has(file) || isVirtualFile(file)) {
          continue;
        }
        const fileDiagnostics = allDiagnostics.get(file);
        connection.sendDiagnostics({
          uri: file,
          diagnostics: fileDiagnostics ?? [],
        });
      }
    } catch (err) {
      if (isOperationCancelled(err)) {
        return;
      }
      throw err;
    }
  }

  debounceTimer: NodeJS.Timeout | undefined = undefined;

  updateConfigs(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      this.doUpdateConfigs();
    }, 200);
  }

  private async doUpdateConfigs(): Promise<void> {
    // handle changes to the .pliplugin config folder's contents
    const diagnosticsByUri = await this.workspace.config.reloadConfigurations();
    for (const [uri, diagnostics] of diagnosticsByUri.entriesGroupedByKey()) {
      this.connection.sendDiagnostics({
        uri,
        diagnostics,
      });
    }

    // reindex reachable compilation units
    await this.reindex(this.connection, CancellationToken.None);

    // refresh semantic tokens so syntax coloring updates immediately
    this.connection.languages.semanticTokens.refresh();
  }

  /**
   * Reindexes all compilation units that are reachable, and reports fresh diagnostics.
   * Reachable as in the units w/ associated docs that are currently open in the editor.
   * @param connection The connection to send diagnostics to
   */
  async reindex(
    connection: Connection,
    cancellationToken: CancellationToken,
  ): Promise<void> {
    const promises: Promise<void>[] = [];
    this.globalMutex.run(async () => {
      for (const unit of this.getAllCompilationUnits()) {
        if (cancellationToken.isCancellationRequested) {
          return;
        }
        promises.push(
          unit.mutex.run(async (cancellationToken) => {
            const textDocument = await TextDocuments.get(unit.uri.toString());
            if (textDocument) {
              await this.process(
                unit,
                textDocument,
                connection,
                cancellationToken,
              );
              // Revalidate request caches (margins, skipped code, etc.)
              // This is necessary so that changes to the plugin configuration are reflected immediately.
              unit.requestCaches.revalidateAll({ connection, unit });
            }
          }),
        );
      }
    });
    return Promise.all(promises).then(() => undefined);
  }
}
