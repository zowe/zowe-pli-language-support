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
import { TextDocument } from "vscode-languageserver-textdocument";
import * as lsp from "vscode-languageserver-types";

export interface Location {
    uri: string;
    range: Range;
}

export interface Range {
    start: number;
    end: number;
}

export function offsetToPosition(textDocument: TextDocument, offset: number): lsp.Position {
    const pos = textDocument.positionAt(offset);
    return {
        line: pos.line,
        character: pos.character
    };
}

export function positionToOffset(textDocument: TextDocument, position: lsp.Position): number {
    return textDocument.offsetAt(position);
}

export function rangeToLSP(textDocument: TextDocument, range: Range): lsp.Range {
    return {
        start: offsetToPosition(textDocument, range.start),
        end: offsetToPosition(textDocument, range.end)
    };
}

export function tokenToRange(token: IToken): Range {
    return {
        start: token.startOffset,
        end: token.endOffset! + 1
    };
}
