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

import { CompilationUnitHandler } from "../workspace/compilation-unit";
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
  TextEdit,
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
import { Mutex } from "../workspace/mutex";
import { applyQuickFixes } from "./code-actions/apply-quick-fixes";
import { applySourceActions } from "./code-actions/apply-source-actions";
import { commandCreateConfig, commandResolveInclude } from "./commands";
import { Commands, PluginConfiguration } from "./constants";
export { PluginConfiguration } from "./constants";

/**
 * Notification sent to the LS when the workspace's plugin configuration changes.
 */
export const WorkspaceDidChangePlipluginConfigNotification =
  "workspace/didChangePlipluginConfig";

export function startLanguageServer(connection: Connection): void {
  const compilationUnitHandler = new CompilationUnitHandler();
  compilationUnitHandler.listen(connection);

  connection.onInitialize(async (params) => {
    // init the plugin config provider in reverse folder order, last plugin config encountered will take precedence
    // TODO @montymxb Apr 23rd, 2025: Consider addressing multiple workspaces w/ multiple plugin configs
    for (const folder of params.workspaceFolders?.reverse() ?? []) {
      PluginConfigurationProviderInstance.init(folder.uri).then(
        (diagnostics) => {
          const ws = PluginConfigurationProviderInstance.getWorkspacePath();
          const wsPrefix = ws.endsWith("/") ? ws : ws + "/";
          connection.sendDiagnostics({
            uri: wsPrefix + PluginConfiguration.PROCESS_GROUP_FILE_PATH,
            diagnostics,
          });
        },
      );
    }

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
      },
    };
  });
  connection.onHover(async (params) => {
    return Mutex.read(async () => {
      const uri = params.textDocument.uri;
      const position = params.position;
      const parsedUri = URI.parse(uri);
      const compilationUnit =
        compilationUnitHandler.getCompilationUnit(parsedUri);
      const textDocument = compilationUnit?.services.files.getDocument(uri);

      if (!textDocument || !compilationUnit) {
        return null;
      }

      const offset = textDocument.offsetAt(position);
      const response = hoverRequest(compilationUnit, parsedUri, offset);
      if (!response) {
        return null;
      }

      return hoverResponseToLSP(textDocument, response);
    });
  });
  connection.onCompletion(async (params) => {
    return Mutex.read(async () => {
      const uri = params.textDocument.uri;
      const position = params.position;
      const parsedUri = URI.parse(uri);
      const compilationUnit =
        compilationUnitHandler.getCompilationUnit(parsedUri);
      const textDocument = compilationUnit?.services.files.getDocument(uri);
      if (textDocument && compilationUnit) {
        const offset = textDocument.offsetAt(position);
        const result = completionRequest(
          compilationUnit,
          parsedUri,
          offset,
        ).map((completionItem) =>
          completionItemToLSP(textDocument, completionItem),
        );

        return result;
      }
      return [];
    });
  });
  connection.onDefinition(async (params) => {
    return Mutex.read(async () => {
      const position = params.position;
      const uri = URI.parse(params.textDocument.uri);
      const compilationUnit = compilationUnitHandler.getCompilationUnit(uri);
      const textDocument = compilationUnit?.services.files.getDocument(uri);
      if (textDocument && compilationUnit) {
        const offset = textDocument.offsetAt(position);
        const definition = definitionRequest(compilationUnit, uri, offset);
        const lspDefinitions: Location[] = [];
        for (const def of definition) {
          const doc = compilationUnit?.services.files.getDocument(def.uri);
          if (doc) {
            const range = rangeToLSP(doc, def.range);
            lspDefinitions.push({
              uri: def.uri,
              range,
            });
          }
        }
        return lspDefinitions;
      }
      return [];
    });
  });
  connection.onReferences(async (params) => {
    return Mutex.read(async () => {
      const uri = params.textDocument.uri;
      const position = params.position;
      const parsedUri = URI.parse(uri);
      const compilationUnit =
        compilationUnitHandler.getCompilationUnit(parsedUri);
      const textDocument = compilationUnit?.services.files.getDocument(uri);
      if (textDocument && compilationUnit) {
        const offset = textDocument.offsetAt(position);
        const definition = referencesRequest(
          compilationUnit,
          parsedUri,
          offset,
        );
        const lspDefinitions: Location[] = [];
        for (const def of definition) {
          const doc = compilationUnit?.services.files.getDocument(def.uri);
          if (doc) {
            const range = rangeToLSP(doc, def.range);
            lspDefinitions.push({
              uri: def.uri,
              range,
            });
          }
        }
        return lspDefinitions;
      }
      return [];
    });
  });
  connection.languages.semanticTokens.on(async (params) => {
    return Mutex.read(async () => {
      const uri = params.textDocument.uri;
      const compilationUnit = compilationUnitHandler.getCompilationUnit(
        URI.parse(uri),
      );
      const textDocument = compilationUnit?.services.files.getDocument(uri);
      if (textDocument && compilationUnit) {
        return {
          data: semanticTokens(textDocument, compilationUnit),
        };
      }
      return {
        data: [],
      };
    });
  });
  connection.onDocumentHighlight(async (params) => {
    return Mutex.read(async () => {
      const uri = UriUtils.normalize(params.textDocument.uri);
      const position = params.position;
      const parsedUri = URI.parse(uri);
      const unit = compilationUnitHandler.getCompilationUnit(parsedUri);
      const textDocument = unit?.services.files.getDocument(uri);
      if (textDocument && unit) {
        const offset = textDocument.offsetAt(position);
        const definitions = getReferenceLocations(unit, parsedUri, offset);
        return definitions
          .filter((e) => e.uri === uri)
          .map((def) =>
            DocumentHighlight.create(rangeToLSP(textDocument, def.range)),
          );
      }
      return [];
    });
  });
  connection.onRenameRequest(async (params) => {
    return Mutex.read(async () => {
      const uri = params.textDocument.uri;
      const position = params.position;
      const parsedUri = URI.parse(uri);
      const unit = compilationUnitHandler.getCompilationUnit(parsedUri);
      const textDocument = unit?.services.files.getDocument(uri);
      if (textDocument && unit) {
        const offset = textDocument.offsetAt(position);
        const renameLocations = renameRequest(unit, parsedUri, offset);
        const changes: Record<string, TextEdit[]> = {};
        for (const [key, locations] of Object.entries(renameLocations)) {
          const textDocument = unit.services.files.getDocument(key);
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

        return {
          changes,
        };
      }

      return null;
    });
  });
  connection.onDocumentSymbol(async (params) => {
    return Mutex.read(async () => {
      const uri = params.textDocument.uri;
      const parsedUri = URI.parse(uri);
      const unit = compilationUnitHandler.getCompilationUnit(parsedUri);
      const textDocument = unit?.services.files.getDocument(uri);
      if (textDocument && unit) {
        const requestResult = documentSymbolRequest(parsedUri, unit);
        return requestResult.map((symbol) =>
          documentSymbolToLSP(textDocument, symbol),
        );
      }
      return [];
    });
  });
  connection.onWorkspaceSymbol(async (params) => {
    return Mutex.read(async () => {
      return workspaceSymbolRequest(
        params.query,
        compilationUnitHandler.getAllCompilationUnits(),
      );
    });
  });
  connection.onNotification(
    WorkspaceDidChangePlipluginConfigNotification,
    () => {
      Mutex.run(async () => {
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
        await compilationUnitHandler.reindex(
          connection,
          CancellationToken.None,
        );
      });
    },
  );

  connection.onCodeAction(async (params) => {
    return Mutex.read(async () => {
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
