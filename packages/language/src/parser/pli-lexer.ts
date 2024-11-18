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

import { DefaultLexer, LexerResult } from "langium";

const NEWLINE = '\n'.charCodeAt(0);

export class Pl1Lexer extends DefaultLexer {

    override tokenize(text: string): LexerResult {
        const lines = this.splitLines(text);
        const adjustedLines = lines.map(line => this.adjustLine(line));
        const adjustedText = adjustedLines.join('');
        return super.tokenize(adjustedText);
    }

    private splitLines(text: string): string[] {
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

    private adjustLine(line: string): string {
        let eol = '';
        if (line.endsWith('\r\n')) {
            eol = '\r\n';
        } else if (line.endsWith('\n')) {
            eol = '\n';
        }
        const prefixLength = 1;
        const lineLength = line.length - eol.length;
        if (lineLength < prefixLength) {
            return ' '.repeat(lineLength) + eol;
        }
        const lineEnd = 72;
        const prefix = ' '.repeat(prefixLength);
        let postfix = '';
        if (lineLength > lineEnd) {
            postfix = ' '.repeat(lineLength - lineEnd);
        }
        return prefix + line.substring(prefixLength, Math.min(lineEnd, lineLength)) + postfix + eol;
    }

}
