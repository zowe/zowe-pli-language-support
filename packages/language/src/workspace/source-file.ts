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

import { IToken } from "chevrotain";
import { PliProgram, SyntaxKind } from "../syntax-tree/ast.js";
import { URI } from "../utils/uri.js";
import { Diagnostic } from "vscode-languageserver-types";
import { createSymbolTable, SymbolTable } from "../linking/symbol-table.js";
import { TextDocuments } from "../language-server/text-documents.js";
import { LexerInstance } from "../parser/tokens.js";
import { PliParserInstance } from "../parser/parser.js";
import { Connection } from "vscode-languageserver";
import { collectCommonDiagnostics } from "../validation/validator.js";

export interface SourceFile {
    uri: URI;
    ast: PliProgram;
    tokens: IToken[];
    symbols: SymbolTable;
    diagnostics: Diagnostic[];
}

export function createSourceFile(uri: URI): SourceFile {
    return {
        uri,
        ast: {
            kind: SyntaxKind.PliProgram,
            container: null,
            statements: []
        },
        tokens: [],
        symbols: new SymbolTable(),
        diagnostics: []
    }
}

export class SourceFileHandler {

    private sourceFiles: Map<string, SourceFile> = new Map();

    getSourceFile(uri: URI): SourceFile | undefined {
        return this.sourceFiles.get(uri.toString());
    }

    getOrCreateSourceFile(uri: URI): SourceFile {
        return this.sourceFiles.get(uri.toString()) || this.addSourceFile(uri);
    }

    addSourceFile(uri: URI): SourceFile {
        const sourceFile = createSourceFile(uri);
        this.sourceFiles.set(uri.toString(), sourceFile);
        return sourceFile;
    }

    deleteSourceFile(uri: URI): boolean {
        return this.sourceFiles.delete(uri.toString());
    }

    listen(connection: Connection): void {
        const textDocuments = TextDocuments;
        textDocuments.listen(connection);
        textDocuments.onDidChangeContent(event => {
            console.time('document');
            const sourceFile = this.getOrCreateSourceFile(URI.parse(event.document.uri));
            const lexerResult = LexerInstance.tokenize(event.document.getText());
            sourceFile.tokens = lexerResult.tokens;
            PliParserInstance.input = sourceFile.tokens;
            const ast = PliParserInstance.PliProgram();
            sourceFile.ast = ast;
            sourceFile.diagnostics = collectCommonDiagnostics(sourceFile, lexerResult.errors, PliParserInstance.errors);
            connection.sendDiagnostics({
                uri: event.document.uri,
                diagnostics: sourceFile.diagnostics
            });
            sourceFile.symbols = createSymbolTable(ast);
            console.timeEnd('document');
        });
        textDocuments.onDidClose(event => {
            this.sourceFiles.delete(event.document.uri);
        });
    }

}
