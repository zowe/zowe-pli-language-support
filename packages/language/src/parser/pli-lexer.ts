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

import { IToken, TokenType, TokenTypeDictionary, Lexer as ChevrotainLexer, createTokenInstance, createToken } from "chevrotain";
import { Lexer, LexerResult } from "langium";
import { Pl1Services } from "../pli-module";
import { MarginsProcessor } from "./pli-margins-processor";
import { PliTokenBuilder } from "./pli-token-builder";
import { isRegExp } from "util/types";

export class Pl1Lexer implements Lexer {
    private readonly marginsProcessor: MarginsProcessor;
    private readonly tokenBuilder: PliTokenBuilder;
    private readonly hiddenTokens: TokenType[];
    private readonly normalTokens: TokenType[];

    constructor(services: Pl1Services) {
        this.marginsProcessor = services.parser.MarginsProcessor;
        this.tokenBuilder = services.parser.TokenBuilder as PliTokenBuilder;
        const vocabulary = this.tokenBuilder.buildTokens(services.Grammar) as TokenType[];
        this.hiddenTokens = vocabulary.filter(v => v.GROUP === 'hidden' || v.GROUP === ChevrotainLexer.SKIPPED);
        this.normalTokens = vocabulary.filter(v => !this.hiddenTokens.includes(v) && v !== this.percentageToken);
    }
    return lines;
  }

    get definition(): TokenTypeDictionary {
        return {};
    }

    tokenize(printerText: string): LexerResult {
        const text = this.marginsProcessor.processMargins(printerText);
        const tokens: IToken[] = [];
        const hidden: IToken[] = [];
        let line = 1;
        let column = 1;
        for(let index=0; index<text.length; ) {
            function advanceBy(scanned: string) {
                const NL = /\r?\n/y;
                for (let charIndex = 0; charIndex < scanned.length; ) {
                    NL.lastIndex = charIndex;
                    const match = NL.exec(scanned);
                    if(match) {
                        index += match[0].length;
                        line = line + 1;
                        column = 1;
                        charIndex += match[0].length;
                    } else {
                        charIndex++;
                        column++;
                        index++;
                    }
                }
            }

            function emit(scanned: string, tokenType: TokenType) {
                const [startLine, startColumn, startOffset] = [line, column, index];
                advanceBy(scanned);
                const [endLine, endColumn, endOffset] = [line, column, index];
                const token = createTokenInstance(tokenType, scanned, startOffset, endOffset, startLine, endLine, startColumn, endColumn);
                if(tokenType.GROUP === "hidden" || tokenType.GROUP === ChevrotainLexer.SKIPPED) {
                    hidden.push(token);
                } else {
                    tokens.push(token);
                }
            }

            function canConsume(tokenType: TokenType) {
                const pattern = tokenType.PATTERN;
                if(pattern) {
                    if(isRegExp(pattern)) {
                        pattern.lastIndex = index;
                        const match = pattern.exec(text);
                        if(match) {
                            emit(match[0], tokenType);
                            return true;
                        }
                    } else if(typeof pattern === "string") {
                        const image = text.substring(index, index + pattern.length);
                        if(image.toLowerCase() === pattern.toLowerCase()) {
                            emit(image, tokenType);
                            return true;
                        }
                    }
                }
                return false;
            }

            if(this.hiddenTokens.some(h => canConsume(h))) {
                continue;
            } else if(this.normalTokens.some(n => canConsume(n))) {
                continue;
            } else {
                if(text[index] === "%") {
                    index++;
                    console.log("PREPROCESSOR STATEMENT");
                    //TODO
                }
            }
        }
        return {
            tokens,
            errors: [],
            hidden,
            report: undefined!
        };
    }
}
