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
  Connection,
  DocumentHighlight,
  TextDocumentSyncKind,
} from "vscode-languageserver";
import { URI } from "../utils/uri";
import { SourceFileHandler } from "../workspace/source-file";
import { definitionRequest } from "./definition-request";
import { referencesRequest } from "./references-request";
import { semanticTokenLegend, semanticTokens } from "./semantic-tokens";
import { Location } from "vscode-languageserver-types";
import { TextDocuments } from "./text-documents";
import { rangeToLSP } from "./types";
import { renameRequest } from "./rename-request";
import { mapValues } from "../utils/common";
import { getReferenceLocations } from "../linking/resolver";

export function startLanguageServer(connection: Connection): void {
  const sourceFileHandler = new SourceFileHandler();
  sourceFileHandler.listen(connection);
  connection.onInitialize((params) => {
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
        renameProvider: true,
        definitionProvider: true,
        referencesProvider: true,
        documentHighlightProvider: true,
        semanticTokensProvider: {
          legend: semanticTokenLegend,
          full: true,
          range: false,
        },
      },
    };
  });
  connection.onDefinition((params) => {
    const position = params.position;
    const textDocument = TextDocuments.get(params.textDocument.uri);
    const uri = URI.parse(params.textDocument.uri);
    const sourceFile = sourceFileHandler.getSourceFile(uri);
    if (textDocument && sourceFile) {
      const offset = textDocument.offsetAt(position);
      const definition = definitionRequest(sourceFile, uri, offset);
      const lspDefinitions: Location[] = [];
      for (const def of definition) {
        const doc = TextDocuments.get(def.uri);
        if (doc) {
          const range = rangeToLSP(doc, def.range);
          lspDefinitions.push({
            uri: def.uri,
            range
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
    const sourceFile = sourceFileHandler.getSourceFile(parsedUri);
    if (textDocument && sourceFile) {
      const offset = textDocument.offsetAt(position);
      const definition = referencesRequest(sourceFile, parsedUri, offset);
      const lspDefinitions: Location[] = [];
      for (const def of definition) {
        const doc = TextDocuments.get(def.uri);
        if (doc) {
          const range = rangeToLSP(doc, def.range);
          lspDefinitions.push({
            uri: def.uri,
            range
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
    const sourceFile = sourceFileHandler.getSourceFile(URI.parse(uri));
    if (textDocument && sourceFile) {
      return {
        data: semanticTokens(textDocument, sourceFile),
      };
    }
    return {
      data: [],
    };
  });
  connection.onDocumentHighlight((params) => {
    const uri = params.textDocument.uri;
    const position = params.position;
    const textDocument = TextDocuments.get(uri);
    const sourceFile = sourceFileHandler.getSourceFile(URI.parse(uri));

    if (textDocument && sourceFile) {
      const offset = textDocument.offsetAt(position);
      const definitions = getReferenceLocations(sourceFile, offset);
      return definitions.map((def) =>
        DocumentHighlight.create(rangeToLSP(textDocument, def.range)),
      );
    }
    return [];
  });
  connection.onRenameRequest((params) => {
    const uri = params.textDocument.uri;
    const position = params.position;
    const textDocument = TextDocuments.get(uri);
    const sourceFile = sourceFileHandler.getSourceFile(URI.parse(uri));

    if (textDocument && sourceFile) {
      const offset = textDocument.offsetAt(position);
      const renameLocations = renameRequest(sourceFile, offset);
      const changes = mapValues(renameLocations, (locations) =>
        locations.map((location) => ({
          range: rangeToLSP(textDocument, location.range),
          newText: params.newName,
        })),
      );

      return {
        changes,
      };
    }

    return null;
  });
  connection.listen();
}
