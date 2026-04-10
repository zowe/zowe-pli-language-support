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
} from "../workspace/compilation-unit";
import {
  CancellationToken,
  Connection,
  DocumentHighlight,
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
import { PluginConfigurationProviderInstance } from "../workspace/plugin-configuration-provider";
import { completionRequest } from "./completion/completion-request";
import { hoverRequest } from "./hover-request";
import { applyQuickFixes } from "./code-actions/apply-quick-fixes";
import { applySourceActions } from "./code-actions/apply-source-actions";
import { commandCreateConfig, commandResolveInclude } from "./commands";
import { Commands, PluginConfiguration } from "./constants";
import { signatureHelpRequest } from "./signature-help-request";
export { PluginConfiguration } from "./constants";

/**
 * Notification sent to the LS when the workspace's plugin configuration changes.
 */
export const WorkspaceDidChangePlipluginConfigNotification =
  "workspace/didChangePlipluginConfig";

export const ExistingFileRequest = "pli/existingFileRequest";

export function startLanguageServer(connection: Connection): void {
  const compilationUnitHandler = new CompilationUnitHandler();
  compilationUnitHandler.listen(connection);
  let folders: WorkspaceFolder[] = [];

  async function withReadMutex<T>(
    uri: string,
    cb: (uri: URI, unit?: CompilationUnit) => Promise<T>,
  ) {
    await compilationUnitHandler.ready;
    return compilationUnitHandler.globalMutex.read(() => {
      const parsedUri = UriUtils.toUri(uri);
      const compilationUnit =
        compilationUnitHandler.getCompilationUnit(parsedUri);
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
          triggerCharacters: [".", "%"],
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
          commands: [Commands.RESOLVE_INCLUDE, Commands.CREATE_CONFIG],
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
        }
      },
    };
  });
  connection.onInitialized(async () => {
    const promises: Promise<void>[] = [];
    for (const folder of folders) {
      promises.push(
        PluginConfigurationProviderInstance.init(folder.uri).then(
          (diagnostics) => {
            const ws = PluginConfigurationProviderInstance.getWorkspacePath();
            const wsPrefix = ws.endsWith("/") ? ws : ws + "/";
            connection.sendDiagnostics({
              uri: wsPrefix + PluginConfiguration.PROCESS_GROUP_FILE_PATH,
              diagnostics,
            });
          },
        ),
      );
    }
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
  connection.onCompletion(async (params) => {
    const position = params.position;
    return withReadMutex(
      params.textDocument.uri,
      async (uri, compilationUnit) => {
        const textDocument = compilationUnit?.services.files.getDocument(uri);
        if (!textDocument || !compilationUnit) {
          return [];
        }
        const offset = textDocument.offsetAt(position);
        const result = completionRequest(compilationUnit, uri, offset).map(
          (completionItem) => completionItemToLSP(textDocument, completionItem),
        );

        return result;
      },
    );
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
        const renameLocations = renameRequest(compilationUnit, uri, offset);
        const changes: Record<string, TextEdit[]> = {};
        for (const [key, locations] of Object.entries(renameLocations)) {
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
        compilationUnitHandler.getAllCompilationUnits(),
      );
    });
  });
  connection.onNotification(
    WorkspaceDidChangePlipluginConfigNotification,
    async () => {
      // handle changes to the .pliplugin config folder's contents
      const diagnostics =
        await PluginConfigurationProviderInstance.reloadConfigurations();
      const ws = PluginConfigurationProviderInstance.getWorkspacePath();
      const wsPrefix = ws.endsWith("/") ? ws : ws + "/";
      connection.sendDiagnostics({
        uri: wsPrefix + PluginConfiguration.PROCESS_GROUP_FILE_PATH,
        diagnostics,
      });

      // reindex reachable compilation units
      await compilationUnitHandler.reindex(connection, CancellationToken.None);
    },
  );
  connection.onRequest(ExistingFileRequest, (uriString: string): boolean => {
    const uri = URI.parse(uriString);
    const compilationUnit = compilationUnitHandler.getCompilationUnit(uri);
    return compilationUnit !== undefined;
  });

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

      const actions = await applyQuickFixes(diagnostics);
      return actions || [];
    }
  });

  connection.onExecuteCommand(async (params) => {
    switch (params.command) {
      case Commands.RESOLVE_INCLUDE:
        await commandResolveInclude(params);
        break;
      case Commands.CREATE_CONFIG:
        await commandCreateConfig(params);
        break;
    }
  });

  connection.listen();
}
