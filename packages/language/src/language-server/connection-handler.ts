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
  Connection,
  DocumentHighlight,
  TextDocumentSyncKind,
} from "vscode-languageserver";
import { URI, UriUtils } from "../utils/uri";
import { definitionRequest } from "./definition-request";
import { referencesRequest } from "./references-request";
import { semanticTokenLegend, semanticTokens } from "./semantic-tokens";
import { Location, TextEdit } from "vscode-languageserver-types";
import { rangeToLSP } from "./types";
import { renameRequest } from "./rename-request";
import { mapValues } from "../utils/common";
import { getReferenceLocations } from "../linking/resolver";
import { documentSymbolRequest } from "./document-symbol-request";
import { workspaceSymbolRequest } from "./workspace-symbol-request";
import { PluginConfigurationProviderInstance } from "../workspace/plugin-configuration-provider";
import { completionRequest } from "./completion/completion-request";
import { BuiltinsTextDocument } from "../workspace/builtins";
import { BuiltinDocuments, TextDocuments } from "./text-documents";

export function startLanguageServer(connection: Connection): void {
  const compilationUnitHandler = new CompilationUnitHandler();
  compilationUnitHandler.listen(connection);
  connection.onInitialize((params) => {
    // init the plugin config provider in reverse folder order, last plugin config encountered will take precedence
    // TODO @montymxb Apr 23rd, 2025: Consider addressing multiple workspaces w/ multiple plugin configs
    for (const folder of params.workspaceFolders?.reverse() ?? []) {
      PluginConfigurationProviderInstance.init(folder.uri);
    }

    BuiltinDocuments.set(BuiltinsTextDocument);

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
        renameProvider: true,
        definitionProvider: true,
        referencesProvider: true,
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
  connection.onCompletion((params) => {
    const uri = params.textDocument.uri;
    const position = params.position;
    const textDocument = TextDocuments.get(uri);
    const parsedUri = URI.parse(uri);
    const compilationUnit =
      compilationUnitHandler.getCompilationUnit(parsedUri);
    if (textDocument && compilationUnit) {
      const offset = textDocument.offsetAt(position);
      return completionRequest(compilationUnit, parsedUri, offset);
    }
    return [];
  });
  connection.onDefinition((params) => {
    const position = params.position;
    const textDocument = TextDocuments.get(params.textDocument.uri);
    const uri = URI.parse(params.textDocument.uri);
    const compilationUnit = compilationUnitHandler.getCompilationUnit(uri);
    if (textDocument && compilationUnit) {
      const offset = textDocument.offsetAt(position);
      const definition = definitionRequest(compilationUnit, uri, offset);
      const lspDefinitions: Location[] = [];
      for (const def of definition) {
        const doc = TextDocuments.get(def.uri);
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
  connection.onReferences((params) => {
    const uri = params.textDocument.uri;
    const position = params.position;
    const textDocument = TextDocuments.get(uri);
    const parsedUri = URI.parse(uri);
    const compilationUnit =
      compilationUnitHandler.getCompilationUnit(parsedUri);
    if (textDocument && compilationUnit) {
      const offset = textDocument.offsetAt(position);
      const definition = referencesRequest(compilationUnit, parsedUri, offset);
      const lspDefinitions: Location[] = [];
      for (const def of definition) {
        const doc = TextDocuments.get(def.uri);
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
  connection.languages.semanticTokens.on((params) => {
    const uri = params.textDocument.uri;
    const textDocument = TextDocuments.get(uri);
    const compilationUnit = compilationUnitHandler.getCompilationUnit(
      URI.parse(uri),
    );
    if (textDocument && compilationUnit) {
      return {
        data: semanticTokens(textDocument, compilationUnit),
      };
    }
    return {
      data: [],
    };
  });
  connection.onDocumentHighlight((params) => {
    const uri = UriUtils.normalize(params.textDocument.uri);
    const position = params.position;
    const textDocument = TextDocuments.get(uri);
    const parsedUri = URI.parse(uri);
    const unit = compilationUnitHandler.getCompilationUnit(parsedUri);
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
  connection.onRenameRequest((params) => {
    const uri = params.textDocument.uri;
    const position = params.position;
    const textDocument = TextDocuments.get(uri);
    const parsedUri = URI.parse(uri);
    const unit = compilationUnitHandler.getCompilationUnit(parsedUri);
    if (textDocument && unit) {
      const offset = textDocument.offsetAt(position);
      const renameLocations = renameRequest(unit, parsedUri, offset);
      const changes = mapValues(renameLocations, (locations, key) => {
        const textDocument = TextDocuments.get(key);
        if (!textDocument) {
          return [];
        } else {
          return locations.map(
            (location) =>
              ({
                range: rangeToLSP(textDocument, location.range),
                newText: params.newName,
              }) satisfies TextEdit,
          );
        }
      });

      return {
        changes,
      };
    }

    return null;
  });
  connection.onDocumentSymbol((params) => {
    const uri = params.textDocument.uri;
    const textDocument = TextDocuments.get(uri);
    const parsedUri = URI.parse(uri);
    const unit = compilationUnitHandler.getCompilationUnit(parsedUri);

    if (textDocument && unit) {
      return documentSymbolRequest(parsedUri, unit);
    }
    return [];
  });
  connection.onWorkspaceSymbol((params) => {
    return workspaceSymbolRequest(
      params.query,
      compilationUnitHandler.getAllCompilationUnits(),
    );
  });
  connection.listen();
}
