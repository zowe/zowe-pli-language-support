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

import {
  CompilationUnit,
  CompilationUnitHandler,
  pluginConfigChanged,
} from "../workspace/compilation-unit";
import {
  Connection,
  DidChangeWatchedFilesNotification,
  DocumentHighlight,
  LSPErrorCodes,
  ResponseError,
  TextDocumentSyncKind,
} from "vscode-languageserver";
import { URI, UriUtils } from "../utils/uri";
import { definitionRequest } from "./definition-request";
import { referencesRequest } from "./references-request";
import { semanticTokenLegend, semanticTokens } from "./semantic-tokens";
import {
  CodeActionKind,
  Diagnostic,
  Location,
  LocationLink,
  TextEdit,
  WorkspaceFolder,
} from "vscode-languageserver-types";
import {
  completionItemToLSP,
  documentSymbolToLSP,
  hoverResponseToLSP,
  rangeToLSP,
} from "./types";
import { renameRequest } from "./rename-request";
import { getReferenceLocations } from "../linking/resolver";
import { documentSymbolRequest } from "./document-symbol-request";
import { workspaceSymbolRequest } from "./workspace-symbol-request";
import { FileSystemProvider } from "../workspace/file-system-provider";
import {
  EditorDocuments,
  resetDocumentProviders,
  TextDocuments as PliTextDocuments,
} from "./text-documents";
import { completionRequest } from "./completion/completion-request";
import { hoverRequest } from "./hover-request";
import { applyQuickFixes } from "./code-actions/apply-quick-fixes";
import { applySourceActions } from "./code-actions/apply-source-actions";
import { commandCreateConfig } from "./commands";
import { Commands } from "./constants";
import { signatureHelpRequest } from "./signature-help-request";
import {
  GlobalConfigLoader,
  Messages,
  NotificationType,
  RequestType,
} from "../utils/messages";
import { configCompletionRequest } from "./completion/completion-plugin-configuration";
import { JsonItemMeta } from "../config/schema";
import { assertType } from "../preprocessor/util";
import { LongRunningOperationImpl } from "../utils/promises";
export { PluginConfiguration, Commands } from "./constants";

export function startLanguageServer(
  connection: Connection,
  fs: FileSystemProvider,
  globalConfigLoader: GlobalConfigLoader,
): void {
  // Wire the on-demand file loader for include URIs to the workspace's fs
  // so the document store doesn't reach for any module-level singleton.
  resetDocumentProviders(fs);
  const compilationUnitHandler = new CompilationUnitHandler(
    fs,
    globalConfigLoader,
    new LongRunningOperationImpl(connection),
  );
  compilationUnitHandler.listen(connection);
  let folders: WorkspaceFolder[] = [];

  async function withReadMutex<T>(
    uri: string,
    cb: (uri: URI, unit?: CompilationUnit) => Promise<T>,
  ) {
    await compilationUnitHandler.ready;
    return compilationUnitHandler.globalMutex.read(() => {
      const parsedUri = UriUtils.toUri(uri);
      const context = compilationUnitHandler.getWorkspaceFolderOf(parsedUri);
      const compilationUnit = context?.getCompilationUnit(parsedUri);
      if (!compilationUnit) {
        return cb(parsedUri, undefined);
      }
      return compilationUnit.mutex.read(async () => {
        return cb(parsedUri, compilationUnit);
      });
    });
  }

  connection.onInitialize(async (params) => {
    // init the plugin config provider in reverse folder order, last plugin config encountered will take precedence
    folders = params.workspaceFolders?.reverse() ?? [];
    return {
      capabilities: {
        workspace: {
          workspaceFolders: {
            supported: true,
          },
          fileOperations: {},
        },
        textDocumentSync: {
          change: TextDocumentSyncKind.Incremental,
          openClose: true,
        },
        completionProvider: {
          //When updating: update also TRIGGER_CHAR_LANG.
          triggerCharacters: [".", "%", '"'],
        },
        hoverProvider: true,
        renameProvider: true,
        definitionProvider: true,
        referencesProvider: true,
        codeActionProvider: {
          codeActionKinds: [
            CodeActionKind.QuickFix,
            CodeActionKind.SourceFixAll,
          ],
        },
        executeCommandProvider: {
          commands: [Commands.CREATE_CONFIG],
        },
        documentHighlightProvider: true,
        semanticTokensProvider: {
          legend: semanticTokenLegend,
          full: true,
          range: false,
        },
        documentSymbolProvider: true,
        workspaceSymbolProvider: true,
        experimental: {
          skippedPliCode: true,
        },
        signatureHelpProvider: {
          triggerCharacters: ["("],
          retriggerCharacters: [","],
        },
      },
    };
  });
  connection.onInitialized(async () => {
    connection.client.register(DidChangeWatchedFilesNotification.type, {
      watchers: [
        {
          // Watch all changes
          // Includes changes to any directory or file in the workspace
          globPattern: "**/*",
        },
      ],
    });
    const promises = folders
      .map(async (folder) =>
        compilationUnitHandler.initializeWorkspaceFolder(folder.uri),
      )
      .concat(
        //add more default schemes here if needed
        compilationUnitHandler.initializeFallbackFolder(),
      );
    await Promise.all(promises);
    compilationUnitHandler.markReady();
  });
  connection.onHover(async (params) => {
    const position = params.position;
    return withReadMutex(
      params.textDocument.uri,
      async (uri, compilationUnit) => {
        const textDocument = compilationUnit?.services.files.getDocument(uri);

        if (!textDocument || !compilationUnit) {
          return null;
        }

        const offset = textDocument.offsetAt(position);
        const response = hoverRequest(compilationUnit, uri, offset);
        if (!response) {
          return null;
        }

        return hoverResponseToLSP(textDocument, response);
      },
    );
  });
  connection.onSignatureHelp(async (params) => {
    const position = params.position;
    return withReadMutex(
      params.textDocument.uri,
      async (uri, compilationUnit) => {
        const textDocument = compilationUnit?.services.files.getDocument(uri);
        if (!textDocument || !compilationUnit) {
          return null;
        }
        const offset = textDocument.offsetAt(position);
        return signatureHelpRequest(compilationUnit, uri, offset);
      },
    );
  });
  type LANG_LIST = "pli" | "config";
  const TRIGGER_CHAR_LANG: Record<string, LANG_LIST> = {
    // PLI
    ".": "pli",
    "%": "pli",
    // CONFIG
    '"': "config",
  };
  function selectCompletionMode(
    triggerChar: string | undefined,
    docUri: string,
  ): LANG_LIST | undefined {
    const workspace = compilationUnitHandler.getWorkspaceFolderOf(docUri);
    if (!workspace) {
      return undefined;
    }
    const isConfigDocument = workspace.config.isPluginConfigDocumentUri(docUri);
    const triggerLang = triggerChar
      ? TRIGGER_CHAR_LANG[triggerChar]
      : undefined;
    if (
      (triggerLang === "config" && !isConfigDocument) ||
      (triggerLang === "pli" && isConfigDocument)
    ) {
      return undefined;
    }
    if (isConfigDocument) {
      return "config";
    } else {
      return "pli";
    }
  }
  connection.onCompletion(async (params) => {
    const docUri = UriUtils.toUri(params.textDocument.uri);
    const position = params.position;
    const completionMode = selectCompletionMode(
      params.context?.triggerCharacter,
      params.textDocument.uri,
    );
    if (!completionMode) {
      return [];
    } else if (completionMode === "pli") {
      return withReadMutex(
        params.textDocument.uri,
        async (uri, compilationUnit) => {
          const textDocument = compilationUnit?.services.files.getDocument(uri);
          if (!textDocument || !compilationUnit) {
            return [];
          }
          const offset = textDocument.offsetAt(position);
          const result = completionRequest(compilationUnit, uri, offset).map(
            (completionItem) =>
              completionItemToLSP(textDocument, completionItem),
          );
          return result;
        },
      );
    } else {
      const textDocument = await EditorDocuments.get(docUri);
      if (!textDocument) {
        return [];
      }
      const offset = textDocument.offsetAt(position);
      const workspace = compilationUnitHandler.getWorkspaceFolderOf(docUri);
      if (!workspace) {
        return [];
      }
      return configCompletionRequest(
        workspace.config,
        textDocument.getText(),
        offset,
        docUri,
      ).map((completionItem) =>
        completionItemToLSP(textDocument, completionItem),
      );
    }
  });
  connection.onDefinition(async (params) => {
    const position = params.position;
    return withReadMutex(
      params.textDocument.uri,
      async (uri, compilationUnit) => {
        const textDocument = compilationUnit?.services.files.getDocument(uri);
        if (!compilationUnit || !textDocument) {
          return [];
        }
        const offset = textDocument.offsetAt(position);
        const definition = definitionRequest(compilationUnit, uri, offset);
        const lspDefinitions: LocationLink[] = [];
        for (const def of definition) {
          const doc = compilationUnit.services.files.getDocument(def.uri);
          if (doc) {
            const range = rangeToLSP(doc, def.range);
            const sourceRange = def.source
              ? rangeToLSP(textDocument, def.source)
              : undefined;
            lspDefinitions.push({
              targetUri: def.uri,
              targetRange: range,
              targetSelectionRange: range,
              originSelectionRange: sourceRange,
            });
          }
        }
        return lspDefinitions;
      },
    );
  });
  connection.onReferences(async (params) => {
    const position = params.position;
    return withReadMutex(
      params.textDocument.uri,
      async (uri, compilationUnit) => {
        const textDocument = compilationUnit?.services.files.getDocument(uri);
        if (!textDocument || !compilationUnit) {
          return [];
        }
        const offset = textDocument.offsetAt(position);
        const definition = referencesRequest(compilationUnit, uri, offset);
        const lspDefinitions: Location[] = [];
        for (const def of definition) {
          const doc = compilationUnit.services.files.getDocument(def.uri);
          if (doc) {
            const range = rangeToLSP(doc, def.range);
            lspDefinitions.push({
              uri: def.uri,
              range,
            });
          }
        }
        return lspDefinitions;
      },
    );
  });
  connection.languages.semanticTokens.on(async (params) => {
    return withReadMutex(
      params.textDocument.uri,
      async (uri, compilationUnit) => {
        const textDocument = compilationUnit?.services.files.getDocument(uri);
        if (!compilationUnit || !textDocument) {
          return {
            data: [],
          };
        }
        return {
          data: semanticTokens(textDocument, compilationUnit),
        };
      },
    );
  });
  connection.onDocumentHighlight(async (params) => {
    const position = params.position;
    return withReadMutex(
      params.textDocument.uri,
      async (uri, compilationUnit) => {
        const textDocument = compilationUnit?.services.files.getDocument(uri);
        if (!textDocument || !compilationUnit) {
          return [];
        }
        const offset = textDocument.offsetAt(position);
        const definitions = getReferenceLocations(compilationUnit, uri, offset);
        return definitions
          .filter((e) => e.uri === uri.toString())
          .map((def) =>
            DocumentHighlight.create(rangeToLSP(textDocument, def.range)),
          );
      },
    );
  });
  connection.onRenameRequest(async (params) => {
    const position = params.position;
    return withReadMutex(
      params.textDocument.uri,
      async (uri, compilationUnit) => {
        const textDocument = compilationUnit?.services.files.getDocument(uri);
        if (!textDocument || !compilationUnit) {
          return null;
        }
        const offset = textDocument.offsetAt(position);
        const renameResult = renameRequest(compilationUnit, uri, offset);
        if (renameResult.kind === "generated") {
          // Surfaced by the client as an error in the rename UI.
          return new ResponseError(
            LSPErrorCodes.RequestFailed,
            `Cannot rename '${renameResult.name}': the symbol is generated by the preprocessor.`,
          );
        } else if (renameResult.kind === "builtin") {
          return new ResponseError(
            LSPErrorCodes.RequestFailed,
            `Cannot rename '${renameResult.name}': the symbol is a built-in and cannot be renamed.`,
          );
        }
        const changes: Record<string, TextEdit[]> = {};
        for (const [key, locations] of Object.entries(renameResult.changes)) {
          const textDocument = compilationUnit.services.files.getDocument(key);
          if (textDocument) {
            changes[key] = locations.map(
              (location) =>
                ({
                  range: rangeToLSP(textDocument, location.range),
                  newText: params.newName,
                }) satisfies TextEdit,
            );
          }
        }
        return { changes };
      },
    );
  });
  connection.onDocumentSymbol(async (params) => {
    return withReadMutex(
      params.textDocument.uri,
      async (uri, compilationUnit) => {
        const textDocument = compilationUnit?.services.files.getDocument(uri);
        if (!textDocument || !compilationUnit) {
          return [];
        }
        const requestResult = documentSymbolRequest(uri, compilationUnit);
        return requestResult.map((symbol) =>
          documentSymbolToLSP(textDocument, symbol),
        );
      },
    );
  });
  connection.onWorkspaceSymbol(async (params) => {
    return compilationUnitHandler.globalMutex.read(async () => {
      return workspaceSymbolRequest(
        params.query,
        compilationUnitHandler
          .getAllWorkspaceFolders()
          .flatMap((workspace) => workspace.getAllCompilationUnits()),
      );
    });
  });

  onNotification(
    connection,
    Messages.OnDidChangePluginConfigSettingsNotification,
    async () => {
      // Handle changes to the pli.pgm_conf and pli.proc_grps settings in vscode
      const promises = compilationUnitHandler
        .getAllWorkspaceFolders()
        .map(async (workspaceContext) => {
          await pluginConfigChanged(
            connection,
            compilationUnitHandler,
            workspaceContext,
          );
        });
      await Promise.all(promises);
    },
  );
  connection.onDidChangeWatchedFiles(async (params) => {
    await compilationUnitHandler.triggerOnFileChange(params, connection);
  });
  onRequest(connection, Messages.ExistingFile, (uriString: string): boolean => {
    const uri = UriUtils.toUri(uriString);
    const context = compilationUnitHandler.getWorkspaceFolderOf(uri);
    if (!context) {
      return false;
    }
    const compilationUnit = context.getCompilationUnit(uri);
    return compilationUnit !== undefined;
  });

  /**
   * Resolves a {@link JsonItemMeta} into a client-facing
   * {@link Messages.PluginConfigEntryLocation}.
   */
  async function resolveConfigEntryLocation(
    meta: JsonItemMeta | undefined,
  ): Promise<Messages.PluginConfigEntryLocation | null> {
    if (!meta) return null;
    const configDoc = await PliTextDocuments.get(meta.uri.toString());
    if (!configDoc) return null;

    const lspRange = rangeToLSP(configDoc, meta.range);
    return {
      uri: meta.uri.toString(),
      range: lspRange,
    };
  }

  /**
   * Resolves the {@link ProgramRecord} that applies to `uri`.
   *
   * `uri` may be an included file rather than a compilation unit's entry
   * point (e.g. a `%INCLUDE`d copybook opened directly in the editor).
   * `pgm_conf.json` only lists entry points, so looking up `uri` itself
   * would fail to find a match in that case. Instead, resolve the owning
   * compilation unit first (`compilationUnitHandler` already maps every
   * file that's part of a processed unit back to that unit - see
   * `CompilationUnitHandler.process`) and use its cached `programConfig`,
   * which was already resolved from the unit's actual entry-point URI.
   */
  function resolveProgramConfig(
    uri: URI,
    compilationUnit: CompilationUnit | undefined,
  ) {
    if (compilationUnit) {
      return compilationUnit.programConfig;
    }
    const workspace = compilationUnitHandler.getWorkspaceFolderOf(uri);
    return workspace?.config.getProgramConfig(uri);
  }

  onRequest(
    connection,
    Messages.GetProgramConfigLocation,
    (uriString: string): Promise<Messages.PluginConfigEntryLocation | null> =>
      withReadMutex(uriString, async (uri, compilationUnit) => {
        const programConfig = resolveProgramConfig(uri, compilationUnit);
        if (!programConfig) return null;

        return resolveConfigEntryLocation(programConfig.program.meta);
      }),
  );

  onRequest(
    connection,
    Messages.GetProcessGroupLocation,
    (uriString: string): Promise<Messages.PluginConfigEntryLocation | null> =>
      withReadMutex(uriString, async (uri, compilationUnit) => {
        const programConfig = resolveProgramConfig(uri, compilationUnit);
        if (!programConfig) return null;

        const workspace = compilationUnitHandler.getWorkspaceFolderOf(uri);
        const pgroupName = programConfig.pgroup.value;
        const groupConfig = workspace?.config.getProcessGroupConfig(pgroupName);
        if (!groupConfig) return null;

        return resolveConfigEntryLocation(groupConfig.meta);
      }),
  );

  onRequest(
    connection,
    Messages.GetPreprocessedText,
    (uriString: string): Promise<string | null> =>
      withReadMutex(
        uriString,
        async (_uri, compilationUnit) =>
          compilationUnit?.preprocessedText ?? null,
      ),
  );

  connection.onCodeAction(async (params) => {
    const requestedKinds = params.context.only;
    const isSourceActionRequest =
      requestedKinds?.includes(CodeActionKind.SourceFixAll) ||
      requestedKinds?.includes(CodeActionKind.Source);

    if (isSourceActionRequest) {
      const sourceActions = await applySourceActions(
        params.textDocument.uri,
        compilationUnitHandler,
      );
      return sourceActions || [];
    } else {
      const diagnostics = params.context.diagnostics as Diagnostic[];
      if (!diagnostics || !diagnostics.length) return [];
      const workspaceContext = compilationUnitHandler.getWorkspaceFolderOf(
        params.textDocument.uri,
      );
      if (workspaceContext === undefined) {
        return [];
      }
      const actions = await applyQuickFixes(
        diagnostics,
        workspaceContext,
        params.textDocument.uri,
      );
      return actions || [];
    }
  });

  connection.onExecuteCommand(async (params) => {
    switch (params.command) {
      case Commands.CREATE_CONFIG:
        assertType<string[]>(params.arguments);
        const workspaceContext = compilationUnitHandler.getWorkspaceFolderOf(
          params.arguments[0],
        );
        if (workspaceContext) {
          await commandCreateConfig(params, workspaceContext);
        }
        break;
    }
  });

  connection.listen();
}

export function onRequest<P, R>(
  connection: Connection,
  type: RequestType<P, R>,
  handler: (params: P) => R | Promise<R>,
): void {
  connection.onRequest(type.method, handler);
}

export function sendRequest<P, R>(
  connection: Connection,
  type: RequestType<P, R>,
  params: P,
): Promise<R> {
  return connection.sendRequest(type.method, params);
}

export function onNotification<P>(
  connection: Connection,
  type: NotificationType<P>,
  handler: (params: P) => void | Promise<void>,
): void {
  connection.onNotification(type.method, handler);
}

export function sendNotification<P>(
  connection: Connection,
  type: NotificationType<P>,
  params: P,
): void {
  connection.sendNotification(type.method, params);
}
