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

import { ILexingError, IRecognitionException, MismatchedTokenException } from "chevrotain";
import { SourceFile } from "../workspace/source-file";
import { Diagnostic, Position, Range } from "vscode-languageserver-types";
import { ReferencesCache } from "../linking/resolver";

export function collectCommonDiagnostics(sourceFile: SourceFile, lexerErrors: ILexingError[], parserErrors: IRecognitionException[]): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    diagnostics.push(...lexerErrorsToDiagnostics(lexerErrors));
    diagnostics.push(...parserErrorsToDiagnostics(parserErrors));
    diagnostics.push(...linkingErrorsToDiagnostics(sourceFile.references));
    return diagnostics;
}

function lexerErrorsToDiagnostics(lexerErrors: ILexingError[]): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    for (const error of lexerErrors) {
        if (error.line && error.column) {
            diagnostics.push({
                severity: 1,
                range: {
                    start: {
                        line: error.line! - 1,
                        character: error.column! - 1
                    },
                    end: {
                        line: error.line! - 1,
                        character: error.column! + error.length - 1
                    }
                },
                message: error.message,
                source: 'lexer'
            });
        }
    }
    return diagnostics;
}

function parserErrorsToDiagnostics(parserErrors: IRecognitionException[]): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    for (const error of parserErrors) {
        let range: Range | undefined = undefined;
        if (isNaN(error.token.startOffset)) {
            if ('previousToken' in error) {
                const token = (error as MismatchedTokenException).previousToken;
                if (!isNaN(token.startOffset)) {
                    const position: Position = { line: token.endLine! - 1, character: token.endColumn! };
                    range = { start: position, end: position};
                } else {
                    // No valid prev token. Might be empty document or containing only hidden tokens.
                    // Point to document start
                    const position: Position = { line: 0, character: 0 };
                    range = { start: position, end: position};
                }
            }
        } else {
            const position: Position = { line: error.token.startLine! - 1, character: error.token.startColumn! };
            range = { start: position, end: position};
        }
        if (range) {
            const diagnostic: Diagnostic = {
                severity: 1,
                range,
                message: error.message,
                source: 'parser'
            };
            diagnostics.push(diagnostic);
        }
    }
    return diagnostics;
}

function linkingErrorsToDiagnostics(references: ReferencesCache): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    for (const reference of references.allReferences()) {
        if (reference.node === null) {
            const diagnostic: Diagnostic = {
                severity: 2,
                range: {
                    start: {
                        line: reference.token.startLine! - 1,
                        character: reference.token.startColumn! - 1,
                    },
                    end: {
                        line: reference.token.endLine! - 1,
                        character: reference.token.endColumn!
                    }
                },
                message: `Cannot find symbol '${reference.text}'`,
                source: 'linking'
            };
            diagnostics.push(diagnostic);
        }
    }
    return diagnostics;
}