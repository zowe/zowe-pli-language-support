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
import { URI } from "../utils/uri.js";
import { CancellationToken, Connection } from "vscode-languageserver";
import { ReferencesCache, StatementOrderCache } from "../linking/resolver.js";
import { diagnosticsToLSP } from "../language-server/types.js";
import {
  generateSymbolTable,
  lifecycle,
  parse,
  tokenize,
} from "./lifecycle.js";
import { skippedCode } from "../language-server/skipped-code.js";
import { marginIndicator } from "../language-server/margin-indicator.js";
import { createLSRequestCaches, LSRequestCache } from "../utils/cache.js";
import { Scope, ScopeCacheGroups } from "../linking/scope.js";
import { Token } from "../parser/tokens.js";
import {
  BuiltinDocuments,
  EditorDocuments,
  TextDocuments,
} from "../language-server/text-documents.js";
import {
  BuiltinsMacroTextDocument,
  BuiltinsTextDocument,
  BuiltinsUriSchema,
} from "./builtins.js";
import {
  PluginConfigurationProviderInstance,
  ProcessGroup,
  ProgramConfig,
} from "./plugin-configuration-provider.js";
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
  readonly programConfig: ProgramConfig | undefined;
  readonly processGroup: ProcessGroup | undefined;
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
}

const BuiltinFileStart = `${BuiltinsUriSchema}:/`;
const isBuiltinFile = (uri: URI) => uri.toString().startsWith(BuiltinFileStart);
const FIVE_MINUTES = 1000 * 60 * 5;

function createBuiltinScopeGetter(builtinDocument: TextDocument) {
  let builtinFileScope: Scope | undefined;
  return async (uri: URI): Promise<Scope> => {
    if (isBuiltinFile(uri)) {
      return Scope.createRoot();
    }
    if (!builtinFileScope) {
      const fileUri = URI.parse(builtinDocument.uri);
      const builtinUnit = await createCompilationUnit(fileUri);
      await tokenize(builtinUnit, builtinDocument);
      parse(builtinUnit);
      generateSymbolTable(builtinUnit);

      builtinFileScope =
        builtinUnit.scopeCaches.regular.get(builtinUnit.ast) ??
        Scope.createRoot();
    }
    return builtinFileScope;
  };
}

const getBuiltinScope = createBuiltinScopeGetter(BuiltinsTextDocument);
const getRootPreprocessorScope = createBuiltinScopeGetter(
  BuiltinsMacroTextDocument,
);

export async function createCompilationUnit(
  uri: URI,
): Promise<CompilationUnit> {
  const compilerOptions = getDefaultCompilerOptions();
  const services: CompilationServices = {
    files: new FileStore(),
    typeCache: new DefaultTypeCache(),
    includeCache: new LRUCache({
      max: 500,
      ttl: FIVE_MINUTES,
    }),
    inferer: new DefaultTypeInferer(),
  };
  // Cache for programConfig and processGroup to avoid repeated lookups
  // They cannot change during the lifetime of a compilation unit anyway
  let cachedProgramConfig: ProgramConfig | undefined | null = null;
  let cachedProcessGroup: ProcessGroup | undefined | null = null;
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
    rootScope: await getBuiltinScope(uri),
    rootPreprocessorScope: await getRootPreprocessorScope(uri),
    get programConfig() {
      if (cachedProgramConfig !== null) {
        return cachedProgramConfig;
      }
      cachedProgramConfig =
        PluginConfigurationProviderInstance.getProgramConfig(uri);
      return cachedProgramConfig;
    },
    get processGroup() {
      if (cachedProcessGroup !== null) {
        return cachedProcessGroup;
      }
      if (this.programConfig) {
        cachedProcessGroup =
          PluginConfigurationProviderInstance.getProcessGroupConfig(
            this.programConfig.pgroup,
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

export class CompilationUnitHandler {
  private compilationUnits: Map<string, CompilationUnit> = new Map();
  private connection!: Connection;
  private ready = new Deferred();

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
    } else if (!PluginConfigurationProviderInstance.isLibFileCandidate(uri)) {
      // non-library files should always generate a compilation unit
      const unit = await this.createAndStoreCompilationUnit(uri);
      return unit;
    } else {
      // do not generate compilation units for standalone library files
      return undefined;
    }
  }

  async createAndStoreCompilationUnit(uri: URI): Promise<CompilationUnit> {
    const unit = await createCompilationUnit(uri);
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
  finalize(): void {
    this.ready.resolve();
  }

  listen(connection: Connection): void {
    this.connection = connection;
    const textDocuments = EditorDocuments;
    textDocuments.listen(connection);
    textDocuments.onDidChangeContent((event) => {
      const uri = URI.parse(event.document.uri);
      this.updateUri(uri);
    });
    textDocuments.onDidClose((event) => {
      const uri = URI.parse(event.document.uri);
      const unit = this.compilationUnits.get(uri.toString());
      if (unit && this.tryCloseCompilationUnit(uri)) {
        console.debug(`Closed compilation unit for ${uri.toString()}`);
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
  }

  private tryCloseCompilationUnit(uri: URI): boolean {
    const unit = this.compilationUnits.get(uri.toString());
    if (!unit) {
      // Nothing to close
      return false;
    }
    let isOpen = false;
    for (const file of unit.services.files.keys()) {
      if (EditorDocuments.has(file)) {
        isOpen = true;
        break;
      }
    }
    if (!isOpen) {
      return this.deleteCompilationUnit(uri);
    }
    return false;
  }

  async updateUri(uri: URI): Promise<void> {
    await this.ready.promise;
    const unit = await this.getOrCreateCompilationUnit(uri);
    if (!unit) {
      // standalone library files do not synthesize new compilation units
      return;
    }
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
        if (BuiltinDocuments.get(file) || !EditorDocuments.get(file)) {
          // do not report diagnostics for built-in files or files not currently open in the editor
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
    for (const unit of this.getAllCompilationUnits()) {
      if (cancellationToken.isCancellationRequested) {
        return;
      }
      unit.mutex.run(async (cancellationToken) => {
        const textDocument = await TextDocuments.get(unit.uri.toString());
        if (textDocument) {
          this.process(unit, textDocument, connection, cancellationToken);
        }
      });
    }
  }
}
