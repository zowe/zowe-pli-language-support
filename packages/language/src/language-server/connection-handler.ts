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

import { Connection, TextDocumentSyncKind } from "vscode-languageserver";
import { SourceFileHandler } from "../workspace/source-file";
import { TextDocuments } from "./text-documents";
import { definitionRequest } from "./definition-request";
import { URI } from "../utils/uri";
import { rangeToLSP } from "./types";
import { referencesRequest } from "./references-request";

export function startLanguageServer(connection: Connection): void {
    const sourceFileHandler = new SourceFileHandler();
    sourceFileHandler.listen(connection);
    connection.onInitialize(params => {
        return {
            capabilities: {
                workspace: {
                    workspaceFolders: {
                        supported: true
                    },
                    fileOperations: {

                    }
                },
                textDocumentSync: {
                    change: TextDocumentSyncKind.Incremental,
                    openClose: true
                },
                definitionProvider: true,
                referencesProvider: true
            }
        }
    });
    connection.onDefinition((params) => {
        const uri = params.textDocument.uri;
        const position = params.position;
        const textDocument = TextDocuments.get(uri);
        const sourceFile = sourceFileHandler.getSourceFile(URI.parse(uri));
        if (textDocument && sourceFile) {
            const offset = textDocument.offsetAt(position);
            const definition = definitionRequest(sourceFile, offset);
            return definition.map(def => {
                return {
                    uri: def.uri,
                    range: rangeToLSP(textDocument, def.range)
                }
            });
        }
        return [];
    });
    connection.onReferences((params) => {
        const uri = params.textDocument.uri;
        const position = params.position;
        const textDocument = TextDocuments.get(uri);
        const sourceFile = sourceFileHandler.getSourceFile(URI.parse(uri));
        if (textDocument && sourceFile) {
            const offset = textDocument.offsetAt(position);
            const definition = referencesRequest(sourceFile, offset);
            return definition.map(def => {
                return {
                    uri: def.uri,
                    range: rangeToLSP(textDocument, def.range)
                }
            });
        }
        return [];
    })
    connection.listen();
}
