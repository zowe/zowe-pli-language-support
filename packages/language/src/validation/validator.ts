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
import { ReferencesCache } from "../linking/resolver";
import { Diagnostic, Range, Severity } from "../language-server/types";

export function collectCommonDiagnostics(sourceFile: SourceFile, lexerErrors: ILexingError[], parserErrors: IRecognitionException[]): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    diagnostics.push(...lexerErrorsToDiagnostics(lexerErrors));
    diagnostics.push(...parserErrorsToDiagnostics(parserErrors));
    diagnostics.push(...linkingErrorsToDiagnostics(sourceFile.references));
    return diagnostics;
}

export function lexerErrorsToDiagnostics(lexerErrors: ILexingError[]): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    for (const error of lexerErrors) {
        if (error.line && error.column) {
            diagnostics.push({
                uri: '',
                severity: Severity.E,
                range: {
                    start: error.offset,
                    end: error.offset + error.length
                },
                message: error.message,
                source: 'lexer'
            });
        }
    }
    return diagnostics;
}

export function parserErrorsToDiagnostics(parserErrors: IRecognitionException[]): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    for (const error of parserErrors) {
        let range: Range | undefined = undefined;
        if (isNaN(error.token.startOffset)) {
            if ('previousToken' in error) {
                const token = (error as MismatchedTokenException).previousToken;
                if (!isNaN(token.startOffset)) {
                    range = { start: token.startOffset, end: token.startOffset};
                } else {
                    // No valid prev token. Might be empty document or containing only hidden tokens.
                    // Point to document start
                    range = { start: 0, end: 0 };
                }
            }
        } else {
            range = {
                start: error.token.startOffset,
                end: error.token.startOffset
            };
        }
        if (range) {
            const diagnostic: Diagnostic = {
                uri: '',
                severity: Severity.E,
                range,
                message: error.message,
                source: 'parser',
            };
            diagnostics.push(diagnostic);
        }
    }
    return diagnostics;
}

export function linkingErrorsToDiagnostics(references: ReferencesCache): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    for (const reference of references.allReferences()) {
        if (reference.node === null) {
            const diagnostic: Diagnostic = {
                uri: '',
                severity: Severity.W,
                range: {
                    start: reference.token.startOffset,
                    end: reference.token.endOffset!
                },
                message: `Cannot find symbol '${reference.text}'`,
                source: 'linking'
            };
            diagnostics.push(diagnostic);
        }
    }
    return diagnostics;
}