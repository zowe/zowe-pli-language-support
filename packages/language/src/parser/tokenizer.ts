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

import { TokenType } from "chevrotain";
import { URI } from "../utils/uri";
import * as tokens from "./tokens";

interface TwoCharToken {
    char: string;
    tokenType: TokenType;
}

// Note: *, **, *=, **=, /, /=, |, || and ||= are handled separately
const TwoCharTokens: Record<string, TwoCharToken[]> = {
    '=': [{ char: '>', tokenType: tokens.EqualsGreaterThan }],
    '>': [{ char: '=', tokenType: tokens.GreaterThanEquals }],
    '<': [{ char: '=', tokenType: tokens.LessThanEquals }],
    '&': [{ char: '=', tokenType: tokens.AmpersandEquals }],
    '^': [
        { char: '=', tokenType: tokens.NotEquals },
        { char: '<', tokenType: tokens.NotLessThan },
        { char: '>', tokenType: tokens.NotGreaterThan }
    ],
    '+': [{ char: '=', tokenType: tokens.PlusEquals }],
    '-': [
        { char: '=', tokenType: tokens.MinusEquals },
        { char: '>', tokenType: tokens.MinusGreaterThan }
    ]
};


interface KeywordToken {
    image: string;
    kind: TokenType;
}

// const KeywordTokens: KeywordToken[] = [
//     { image: "IF", kind: TokenType.If },
//     { image: "THEN", kind: TokenType.Then },
//     { image: "ELSE", kind: TokenType.Else },
//     { image: "DO", kind: TokenType.Do },
//     { image: "UNTIL", kind: TokenType.Until },
//     { image: "WHILE", kind: TokenType.While },
//     { image: "FOREVER", kind: TokenType.Forever },
//     { image: "SKIP", kind: TokenType.Skip },
//     { image: "END", kind: TokenType.End }
// ];

// FNV Hash implementation
const FNV_OFFSET_BASIS = 0x00000100000001b3n;
const FNV_PRIME = 0xcbf29ce484222325n;

function fnvHash(str: string): bigint {
    let hash = FNV_OFFSET_BASIS;
    for (let i = 0; i < str.length; i++) {
        hash ^= BigInt(str.charCodeAt(i));
        hash *= FNV_PRIME;
    }
    return hash;
}

function generateKeywords(): Map<bigint, KeywordToken> {
    const keywords = new Map<bigint, KeywordToken>();
    for (const [image, kind] of tokens.keywordMap) {
        const hash = fnvHash(image);
        if (keywords.has(hash)) {
            const existing = keywords.get(hash)!;
            throw new Error(`FNV hash collision: ${image}, ${existing.image}`);
        }
        keywords.set(hash, { image, kind });
    }
    return keywords;
}

const Keywords = generateKeywords();

class TokenizerContext {
    public char: string = '';
    public input: string;
    public length: number;
    public index: number = 0;
    public uri: URI;

    constructor(input: string, uri: URI) {
        this.input = input;
        this.length = input.length;
        this.uri = uri;
    }
}

type TokenizeFunc = (context: TokenizerContext) => tokens.Token | undefined;

function tokenizeIdentifier(context: TokenizerContext): tokens.Token | undefined {
    const start = context.index;
    let hash = FNV_OFFSET_BASIS;
    let i = context.index;
    let char: string;
    let image = '';
    while (i < context.length) {
        char = context.input[i];
        if (!isLetter(char) && !isDigit(char) && char !== '_') {
            break;
        }
        let charCode = char.charCodeAt(0);
        if (charCode >= 97 && charCode <= 122) {
            // Lowercase character, must be uppercased
            charCode &= ~0x20;
        }
        image += String.fromCharCode(charCode);
        hash ^= BigInt(charCode);
        hash *= FNV_PRIME;
        i++;
    }
    let tokenType = tokens.ID;
    
    const keyword = Keywords.get(hash);
    if (keyword && keyword.image === image) {
        tokenType = keyword.kind;
    }
    
    context.index = i;
    return tokens.createTokenInstance(
        image,
        tokenType,
        start,
        i,
        context.uri
    );
}

function tokenizeString(context: TokenizerContext): tokens.Token | undefined {
    const quote = context.char;
    const start = context.index;
    let i = context.index + 1;
    
    while (i < context.length) {
        const char = context.input[i];
        if (char === quote) {
            i++;
            break;
        }
        i++;
    }
    
    context.index = i;
    return tokens.createTokenInstance(
        context.input.substring(start, i),
        tokens.STRING,
        start,
        i,
        context.uri
    );
}

function tokenizeNumber(context: TokenizerContext): tokens.Token | undefined {
    const start = context.index;
    let i = context.index;
    
    while (i < context.length) {
        const char = context.input[i];
        if (!isDigit(char) && char !== '.') {
            break;
        }
        i++;
    }
    
    context.index = i;
    return tokens.createTokenInstance(
        context.input.substring(start, i),
        tokens.NUMBER,
        start,
        i,
        context.uri
    );
}

function tokenizeOrSymbol(context: TokenizerContext): tokens.Token | undefined {
    const start = context.index;

    let nextChar = context.input[context.index + 1];
    if (nextChar === '|') {
        nextChar = context.input[context.index + 2];
        if (nextChar === '=') {
            context.index += 3;
            return tokens.createTokenInstance(
                context.input.substring(start, context.index),
                tokens.PipePipeEquals,
                start,
                context.index,
                context.uri
            );
        }
        context.index += 2;
        return tokens.createTokenInstance(
            context.input.substring(start, context.index),
            tokens.PipePipe,
            start,
            context.index,
            context.uri
        );
    }
    context.index++;
    return tokens.createTokenInstance(
        context.input.substring(start, context.index),
        tokens.Pipe,
        start,
        context.index,
        context.uri
    );
}

function tokenizeAsterisk(context: TokenizerContext): tokens.Token | undefined {
    const start = context.index;

    let nextChar = context.input[context.index + 1];
    if (nextChar === '*') {
        nextChar = context.input[context.index + 2];
        if (nextChar === '=') {
            context.index += 3;
            return tokens.createTokenInstance(
                context.input.substring(start, context.index),
                tokens.StarStarEquals,
                start,
                context.index,
                context.uri
            );
        }
        context.index += 2;
        return tokens.createTokenInstance(
            context.input.substring(start, context.index),
            tokens.StarStar,
            start,
            context.index,
            context.uri
        );
    }
    context.index++;
    return tokens.createTokenInstance(
        context.input.substring(start, context.index),
        tokens.Star,
        start,
        context.index,
        context.uri
    );
}

function tokenizeSlash(context: TokenizerContext): tokens.Token | undefined {
    const start = context.index;
    
    if (context.index + 1 < context.length) {
        const nextChar = context.input[context.index + 1];
        
        if (nextChar === '*') {
            // Block comment
            let i = context.index + 2;
            while (i < context.length - 1) {
                if (context.input[i] === '*' && context.input[i + 1] === '/') {
                    i += 2;
                    break;
                }
                i++;
            }
            context.index = i;
            return undefined;
        } else if (nextChar === '=') {
            context.index += 2;
            return tokens.createTokenInstance(
                context.input.substring(start, context.index),
                tokens.SlashEquals,
                start,
                context.index,
                context.uri
            );
        }
    }
    
    context.index++;
    return tokens.createTokenInstance(
        context.input.substring(start, context.index),
        tokens.Slash,
        start,
        context.index,
        context.uri
    );
}

function generateDoubleCharFunc(tokenType: TokenType, others: TwoCharToken[]): TokenizeFunc {
    return function(context: TokenizerContext): tokens.Token | undefined {
        const start = context.index;
        
        if (context.index + 1 < context.length) {
            const nextChar = context.input[context.index + 1];
            
            for (const follow of others) {
                if (nextChar === follow.char) {
                    context.index += 2;
                    return tokens.createTokenInstance(
                        context.input.substring(start, context.index),
                        follow.tokenType,
                        start,
                        start + 2,
                        context.uri
                    );
                }
            }
        }
        
        context.index++;
        return tokens.createTokenInstance(
            context.input.substring(start, context.index),
            tokenType,
            start,
            start + 1,
            context.uri
        );
    };
}

function generateSingleCharFunc(tokenType: TokenType): TokenizeFunc {
    return function(context: TokenizerContext): tokens.Token | undefined {
        const start = context.index;
        context.index++;
        return tokens.createTokenInstance(
            context.input.substring(start, context.index),
            tokenType,
            start,
            start + 1,
            context.uri
        );
    };
}

function tokenizeWhitespace(context: TokenizerContext): tokens.Token | undefined {
    context.index++;
    return undefined;
}

// Utility functions
function isLetter(char: string): boolean {
    return /[a-zA-Z]/.test(char);
}

function isDigit(char: string): boolean {
    return /[0-9]/.test(char);
}

// Function map
const funcs = new Map<string, TokenizeFunc>();

export function initLexer(): void {
    funcs.set('/', tokenizeSlash);
    funcs.set('"', tokenizeString);
    funcs.set("'", tokenizeString);
    funcs.set('*', tokenizeAsterisk);
    funcs.set('|', tokenizeOrSymbol);
    funcs.set('=', generateDoubleCharFunc(tokens.Equals, TwoCharTokens['=']));
    funcs.set('+', generateDoubleCharFunc(tokens.Plus, TwoCharTokens['+']));
    funcs.set('-', generateDoubleCharFunc(tokens.Minus, TwoCharTokens['-']));
    funcs.set('&', generateDoubleCharFunc(tokens.Ampersand, TwoCharTokens['&']));
    funcs.set('^', generateDoubleCharFunc(tokens.Not, TwoCharTokens['^']));
    funcs.set('<', generateDoubleCharFunc(tokens.LessThan, TwoCharTokens['<']));
    funcs.set('>', generateDoubleCharFunc(tokens.GreaterThan, TwoCharTokens['>']));
    funcs.set('(', generateSingleCharFunc(tokens.OpenParen));
    funcs.set(')', generateSingleCharFunc(tokens.CloseParen));
    funcs.set(';', generateSingleCharFunc(tokens.Semicolon));
    funcs.set(':', generateSingleCharFunc(tokens.Colon));
    funcs.set(',', generateSingleCharFunc(tokens.Comma));
    funcs.set('%', generateSingleCharFunc(tokens.Percent));
    funcs.set('.', generateSingleCharFunc(tokens.Dot));
    
    // Whitespace characters
    funcs.set(' ', tokenizeWhitespace);
    funcs.set('\t', tokenizeWhitespace);
    funcs.set('\r', tokenizeWhitespace);
    funcs.set('\n', tokenizeWhitespace);
    funcs.set('\f', tokenizeWhitespace);
    funcs.set('\v', tokenizeWhitespace);
    
    // Numbers
    for (let i = 0; i <= 9; i++) {
        funcs.set(i.toString(), tokenizeNumber);
    }
    
    // Letters
    for (let i = 97; i <= 122; i++) { // a-z
        funcs.set(String.fromCharCode(i), tokenizeIdentifier);
    }
    for (let i = 65; i <= 90; i++) { // A-Z
        funcs.set(String.fromCharCode(i), tokenizeIdentifier);
    }
    funcs.set('_', tokenizeIdentifier);
}

export function tokenize(input: string, uri: URI): tokens.Token[] {
    const context = new TokenizerContext(input, uri);
    const tokens: tokens.Token[] = [];
    
    while (context.index < context.length) {
        const char = input[context.index];
        context.char = char;
        
        const fn = funcs.get(char);
        if (fn) {
            const token = fn(context);
            if (token !== undefined) {
                tokens.push(token);
            }
        } else {
            console.log(`Unrecognized character: ${char} at position ${context.index}`);
            context.index++;
        }
    }
    
    return tokens;
}