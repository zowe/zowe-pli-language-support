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
import { CancellationToken, Connection, Diagnostic } from "vscode-languageserver";
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
import {
  InstructionCache,
  TokenizationCache,
} from "../preprocessor/instruction-cache.js";
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
import { WorkspaceFolderTree } from "./workspace-folder-tree.js";
import { FileSystemProvider } from "./file-system-provider.js";
import { MultiMap } from "../utils/collections.js";

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
  tokenizationCache: TokenizationCache;
  rootScope: Scope;
  rootPreprocessorScope: Scope;
  /**
   * Indicates whether an include file could not be resolved during the last lifecycle.
   * This is used to trigger a re-run of the lifecycle when the file system changes.
   * Maybe we should have a more general mechanism for this, but for now this is sufficient.
   */
  includeError: boolean;
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
    tokenizationCache: new TokenizationCache(),
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
    includeError: false,
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
      unit.includeError = false;
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

export class CompilationUnitHandler extends WorkspaceFolderTree<WorkspaceContext> {
  private fs: FileSystemProvider;
  private connection!: Connection;
  private readyDeferred = new Deferred();

  /**
   * A global mutex that ensures that retrieving compilation units happens after they are created.
   */
  readonly globalMutex = createMutex();

  constructor(fs: FileSystemProvider) {
    super(false);
    this.fs = fs;
  }



  get ready(): Promise<void> {
    return this.readyDeferred.promise;
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
        const context = this.getWorkspaceFolderOf(uri);
        if (!context) {
          return;
        }
        const unit = context.getCompilationUnit(uri);
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

  async initializeWorkspaceFolder(uriString: string|URI) {
    const uri = UriUtils.toUri(uriString);
    const workspace = new WorkspaceContext(uri, this.fs, this.connection);
    this.addWorkspaceFolder(uri, workspace);
    return workspace.config
      .init(uri)
      .then((diagnosticsByUri) => {
        if(this.connection) {
          publishPluginConfigDiagnostics(this.connection, diagnosticsByUri);
        }
        return workspace;
      });
  }

  getCompilationUnit(uri: URI): CompilationUnit | undefined {
    const context = this.getWorkspaceFolderOf(uri);
    if (!context) {
      return undefined;
    }
    return context.getCompilationUnit(uri);
  }

  async getOrCreateCompilationUnit(
    uri: URI,
  ): Promise<CompilationUnit | undefined> {
    const context = this.getWorkspaceFolderOf(uri);
    if (!context) {
      return undefined;
    }
    return context.getOrCreateCompilationUnit(uri);
  }

  deleteCompilationUnit(uri: URI): boolean {
    const context = this.getWorkspaceFolderOf(uri);
    if (!context) {
      return false;
    }
    return context.deleteCompilationUnit(uri);
  }

  getAllCompilationUnits(): CompilationUnit[] {
    const units: CompilationUnit[] = [];
    for (const context of this.getAllWorkspaceFolders()) {
      units.push(...context.getAllCompilationUnits());
    }
    return units;
  }

  private tryCloseCompilationUnit(uri: URI): boolean {
    const context = this.getWorkspaceFolderOf(uri);
    if (!context) {
      return false;
    }
    const unit = context.getCompilationUnit(uri);
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
    return context.deleteCompilationUnit(uri);
  }

  async updateUri(uri: URI): Promise<void> {
    await this.globalMutex.run(async () => {
      await this.ready;
      const context = this.getWorkspaceFolderOf(uri);
      if (!context) {
        return;
      }
      const unit = await context.getOrCreateCompilationUnit(uri);
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
        const context = this.getWorkspaceFolderOf(file);
        if (context) {
          context.setCompilationUnit(URI.parse(file), unit);
        }
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
      for (const context of this.getAllWorkspaceFolders()) {
        for (const unit of context.getAllCompilationUnits()) {
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
      }
    });
    return Promise.all(promises).then(() => undefined);
  }
}

export function publishPluginConfigDiagnostics(
  connection: Connection,
  diagnosticsByUri: MultiMap<string, Diagnostic>,
): void {
  for (const [uri, diagnostics] of diagnosticsByUri.entriesGroupedByKey()) {
    connection.sendDiagnostics({
      uri,
      diagnostics,
    });
  }
}