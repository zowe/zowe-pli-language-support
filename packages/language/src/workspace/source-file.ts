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
import { iterateSymbols, SymbolTable } from "../linking/symbol-table.js";
import { TextDocuments } from "../language-server/text-documents.js";
import { LexerInstance } from "../parser/tokens.js";
import { PliParserInstance } from "../parser/parser.js";
import { Connection } from "vscode-languageserver";
import { collectCommonDiagnostics } from "../validation/validator.js";
import { ReferencesCache, resolveReferences } from "../linking/resolver.js";

export interface SourceFile {
    uri: URI;
    ast: PliProgram;
    tokens: IToken[];
    symbols: SymbolTable;
    references: ReferencesCache
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
        references: new ReferencesCache(),
        diagnostics: []
    }
}

export class SourceFileHandler {

    private sourceFiles: Map<string, SourceFile> = new Map();

    getSourceFile(uri: URI): SourceFile | undefined {
        return this.sourceFiles.get(uri.toString());
    }

    getOrCreateSourceFile(uri: URI): SourceFile {
        return this.sourceFiles.get(uri.toString()) || this.createSourceFile(uri);
    }

    createSourceFile(uri: URI): SourceFile {
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
            const sourceFile = this.createSourceFile(URI.parse(event.document.uri));
            sourceFileLifecycle(sourceFile, event.document.getText());
            connection.sendDiagnostics({
                uri: event.document.uri,
                diagnostics: sourceFile.diagnostics
            });
        });
        textDocuments.onDidClose(event => {
            this.sourceFiles.delete(event.document.uri);
        });
    }
}

function sourceFileLifecycle(sourceFile: SourceFile, text: string): void {
    console.time('document');
    // Tokenize
    console.time('parse');
    const lexerResult = LexerInstance.tokenize(adjustMargins(text));
    sourceFile.tokens = lexerResult.tokens;
    PliParserInstance.input = sourceFile.tokens;
    // Parse
    const ast = PliParserInstance.PliProgram();
    sourceFile.ast = ast;
    console.timeEnd('parse');
    // Index all symbols
    console.time('index');
    iterateSymbols(sourceFile);
    console.timeEnd('index');
    // Resolve all references
    console.time('resolve');
    resolveReferences(sourceFile);
    console.timeEnd('resolve');
    // Generate diagnostics
    console.time('diagnostics');
    sourceFile.diagnostics = collectCommonDiagnostics(sourceFile, lexerResult.errors, PliParserInstance.errors);
    console.timeEnd('diagnostics');
    console.timeEnd('document');
}

// TODO: margins
function adjustMargins(text: string): string {
    const lines = splitLines(text);
    const adjustedLines = lines.map((line) => adjustLine(line));
    const adjustedText = adjustedLines.join("");
    return adjustedText;
}

const NEWLINE = "\n".charCodeAt(0);

function splitLines(text: string): string[] {
    const lines: string[] = [];
    for (let i = 0; i < text.length; i++) {
        const start = i;
        while (i < text.length && text.charCodeAt(i) !== NEWLINE) {
            i++;
        }
        lines.push(text.substring(start, i + 1));
    }
    return lines;
}

const start = 1;
const end = 72;

function adjustLine(line: string): string {
    let eol = "";
    if (line.endsWith("\r\n")) {
        eol = "\r\n";
    } else if (line.endsWith("\n")) {
        eol = "\n";
    }
    const prefixLength = start;
    const lineLength = line.length - eol.length;
    if (lineLength < prefixLength) {
        return " ".repeat(lineLength) + eol;
    }
    const lineEnd = end;
    const prefix = " ".repeat(prefixLength);
    let postfix = "";
    if (lineLength > lineEnd) {
        postfix = " ".repeat(lineLength - lineEnd);
    }
    return (
        prefix +
        line.substring(prefixLength, Math.min(lineEnd, lineLength)) +
        postfix +
        eol
    );
}
