import { test } from "vitest";
import { readFileSync } from "fs";
import { performance } from 'perf_hooks';

interface Range {
    start: number;
    end: number;
}

class Token {
    public image: string;
    public type: TokenType;
    public range: Range;
    public uri: string;
    public kind: number;
    public element: any;
    public immediateFollow: boolean;

    constructor(
        image: string = '',
        type: TokenType = TokenType.Id,
        range: Range | null = null,
        uri: string = '',
        kind: number = 0,
        element: any = null,
        immediateFollow: boolean = false
    ) {
        this.image = image;
        this.type = type;
        this.range = range || { start: 0, end: 0 };
        this.uri = uri;
        this.kind = kind;
        this.element = element;
        this.immediateFollow = immediateFollow;
    }
}

enum TokenType {
    Id = 1,
    Num,
    StringTerm,
    Comment,
    ExecFragment,
    If,
    Then,
    Else,
    Do,
    Until,
    While,
    Forever,
    Skip,
    End,
    PlusEqualsOp,        // +=
    MinusEqualsOp,       // -=
    MultEqualsOp,        // *=
    DivEqualsOp,         // /=
    OrEqualsOp,          // |=
    AndEqualsOp,         // &=
    NotEqualsOp,         // ^= AND <> NOTE: The former is subject to the NOT compiler option
    NotLessThanOp,       // ^<
    LessThanEqualsOp,    // <=
    GreaterThanEqualsOp, // >=
    NotGreaterThanOp,    // ^>
    ConcatOp,            // ||
    ExpOp,               // **
    Locator,             // ->
    EqualsGreaterThanOp, // =>
    Semicolon,           // ;
    OpenParen,           // (
    CloseParen,          // )
    Colon,               // :
    Comma,               // ,
    MultOp,              // *
    EqualsOp,            // =
    OrOp,                // |
    NotOp,               // ^
    AndOp,               // &
    LessThanOp,          // <
    GreaterThanOp,       // >
    PlusOp,              // +
    MinusOp,             // -
    DivOp,               // /
    Dot,                 // .
    Percent              // %
}

interface TwoCharToken {
    char: string;
    tokenType: TokenType;
}

const TwoCharTokens: Record<string, TwoCharToken[]> = {
    '=': [{ char: '>', tokenType: TokenType.EqualsGreaterThanOp }],
    '>': [{ char: '=', tokenType: TokenType.GreaterThanEqualsOp }],
    '<': [{ char: '=', tokenType: TokenType.LessThanEqualsOp }],
    '|': [
        { char: '=', tokenType: TokenType.OrEqualsOp },
        { char: '|', tokenType: TokenType.ConcatOp }
    ],
    '&': [{ char: '=', tokenType: TokenType.AndEqualsOp }],
    '^': [
        { char: '=', tokenType: TokenType.NotEqualsOp },
        { char: '<', tokenType: TokenType.NotLessThanOp },
        { char: '>', tokenType: TokenType.NotGreaterThanOp }
    ],
    '+': [{ char: '=', tokenType: TokenType.PlusEqualsOp }],
    '-': [
        { char: '=', tokenType: TokenType.MinusEqualsOp },
        { char: '>', tokenType: TokenType.Locator }
    ],
    '*': [
        { char: '=', tokenType: TokenType.MultEqualsOp },
        { char: '*', tokenType: TokenType.ExpOp }
    ],
    '/': [{ char: '=', tokenType: TokenType.DivEqualsOp }]
};

interface KeywordToken {
    image: string;
    kind: TokenType;
}

const KeywordTokens: KeywordToken[] = [
    { image: "IF", kind: TokenType.If },
    { image: "THEN", kind: TokenType.Then },
    { image: "ELSE", kind: TokenType.Else },
    { image: "DO", kind: TokenType.Do },
    { image: "UNTIL", kind: TokenType.Until },
    { image: "WHILE", kind: TokenType.While },
    { image: "FOREVER", kind: TokenType.Forever },
    { image: "SKIP", kind: TokenType.Skip },
    { image: "END", kind: TokenType.End }
];

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
    for (const token of KeywordTokens) {
        keywords.set(fnvHash(token.image), token);
    }
    return keywords;
}

const Keywords = generateKeywords();

class TokenizerContext {
    public char: string = '';
    public input: string;
    public length: number;
    public index: number = 0;
    public uri: string;

    constructor(input: string, uri: string) {
        this.input = input;
        this.length = input.length;
        this.uri = uri;
    }
}

type TokenizeFunc = (context: TokenizerContext) => Token | undefined;

function tokenizeIdentifier(context: TokenizerContext): Token | undefined {
    const start = context.index;
    let hash = FNV_OFFSET_BASIS;
    let i = context.index;
    
    while (i < context.length) {
        const char = context.input[i];
        if (!isLetter(char) && !isDigit(char) && char !== '_') {
            break;
        }
        hash ^= BigInt(char.charCodeAt(0));
        hash *= FNV_PRIME;
        i++;
    }
    
    const image = context.input.substring(start, i);
    let tokenType = TokenType.Id;
    
    const keyword = Keywords.get(hash);
    if (keyword && keyword.image === image) {
        tokenType = keyword.kind;
    }
    
    context.index = i;
    return new Token(
        image,
        tokenType,
        { start, end: i },
        context.uri
    );
}

function tokenizeString(context: TokenizerContext): Token | undefined {
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
    return new Token(
        context.input.substring(start, i),
        TokenType.StringTerm,
        { start, end: i },
        context.uri
    );
}

function tokenizeNumber(context: TokenizerContext): Token | undefined {
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
    return new Token(
        context.input.substring(start, i),
        TokenType.Num,
        { start, end: i },
        context.uri
    );
}

function tokenizeSlash(context: TokenizerContext): Token | undefined {
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
            return new Token(
                context.input.substring(start, context.index),
                TokenType.DivEqualsOp,
                { start, end: context.index },
                context.uri
            );
        }
    }
    
    context.index++;
    return new Token(
        context.input.substring(start, context.index),
        TokenType.DivOp,
        { start, end: context.index },
        context.uri
    );
}

function generateDoubleCharFunc(tokenType: TokenType, others: TwoCharToken[]): TokenizeFunc {
    return function(context: TokenizerContext): Token | undefined {
        const start = context.index;
        
        if (context.index + 1 < context.length) {
            const nextChar = context.input[context.index + 1];
            
            for (const follow of others) {
                if (nextChar === follow.char) {
                    context.index += 2;
                    return new Token(
                        context.input.substring(start, context.index),
                        follow.tokenType,
                        { start, end: context.index },
                        context.uri
                    );
                }
            }
        }
        
        context.index++;
        return new Token(
            context.input.substring(start, context.index),
            tokenType,
            { start, end: context.index },
            context.uri
        );
    };
}

function generateSingleCharFunc(tokenType: TokenType): TokenizeFunc {
    return function(context: TokenizerContext): Token | undefined {
        const start = context.index;
        context.index++;
        return new Token(
            context.input.substring(start, context.index),
            tokenType,
            { start, end: context.index },
            context.uri
        );
    };
}

function tokenizeWhitespace(context: TokenizerContext): Token | undefined {
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

function initLexer(): void {
    funcs.set('/', tokenizeSlash);
    funcs.set('"', tokenizeString);
    funcs.set("'", tokenizeString);
    funcs.set('=', generateDoubleCharFunc(TokenType.EqualsOp, TwoCharTokens['=']));
    funcs.set('+', generateDoubleCharFunc(TokenType.PlusOp, TwoCharTokens['+']));
    funcs.set('-', generateDoubleCharFunc(TokenType.MinusOp, TwoCharTokens['-']));
    funcs.set('*', generateDoubleCharFunc(TokenType.MultOp, TwoCharTokens['*']));
    funcs.set('&', generateDoubleCharFunc(TokenType.AndOp, TwoCharTokens['&']));
    funcs.set('^', generateDoubleCharFunc(TokenType.NotOp, TwoCharTokens['^']));
    funcs.set('|', generateDoubleCharFunc(TokenType.OrOp, TwoCharTokens['|']));
    funcs.set('<', generateDoubleCharFunc(TokenType.LessThanOp, TwoCharTokens['<']));
    funcs.set('>', generateDoubleCharFunc(TokenType.GreaterThanOp, TwoCharTokens['>']));
    funcs.set('(', generateSingleCharFunc(TokenType.OpenParen));
    funcs.set(')', generateSingleCharFunc(TokenType.CloseParen));
    funcs.set(';', generateSingleCharFunc(TokenType.Semicolon));
    funcs.set(':', generateSingleCharFunc(TokenType.Colon));
    funcs.set(',', generateSingleCharFunc(TokenType.Comma));
    funcs.set('%', generateSingleCharFunc(TokenType.Percent));
    funcs.set('.', generateSingleCharFunc(TokenType.Dot));
    
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

function tokenize(input: string, uri: string = ''): Token[] {
    const context = new TokenizerContext(input, uri);
    const tokens: Token[] = [];
    
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
/**
 * Binary search to find token at or containing the given position
 * @param tokens Array of tokens to search
 * @param pos Position to find
 * @returns Index of token at position, or length if position is after all tokens
 */
function binarySearch(tokens: Token[], pos: number): number {
    const length = tokens.length;
    
    if (length === 0) {
        return 0;
    }
    
    if (tokens[length - 1].range.end <= pos) {
        return length;
    }
    
    let low = 0;
    let high = length - 1;
    
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        
        if (tokens[mid].range.start <= pos && tokens[mid].range.end > pos) {
            return mid;
        } else if (tokens[mid].range.start > pos) {
            high = mid - 1;
        } else {
            if (mid + 1 < length && tokens[mid + 1].range.start > pos) {
                return mid;
            }
            low = mid + 1;
        }
    }
    
    return -1; // Not found
}

interface TextDelta {
    range: Range;
    text: string;
}

/**
 * Retokenizes text after a delta change, reusing existing tokens where possible
 * @param delta The text change that was applied
 * @param input The updated input text
 * @param uri URI of the document
 * @param tokens Original tokens before the change
 * @returns New token array with changes applied
 */
export function retokenize(delta: TextDelta, input: string, uri: string, tokens: Token[]): Token[] {
    const offsetDelta = delta.range.start - delta.range.end + delta.text.length;
    let start = 0;
    const length = input.length;
    const tokenLength = tokens.length;
    const tokenIndex = binarySearch(tokens, delta.range.start);
    
    let newTokens: Token[];
    
    if (tokenIndex === tokenLength) {
        start = delta.range.start;
        newTokens = [...tokens]; // Create a copy
    } else if (tokenIndex >= 0) {
        start = tokens[tokenIndex].range.start;
        // Create new tokens array with tokens before the affected range
        newTokens = tokens.slice(0, tokenIndex);
    } else {
        // Handle case where tokenIndex is -1 (not found)
        start = 0;
        newTokens = [];
    }
    
    const context: TokenizerContext = {
        input: input,
        index: start,
        length: length,
        uri: uri,
        char: ''
    };
    
    let currentTokenIndex = tokenIndex + 1;
    
    // Tokenize from the start position until we can reuse existing tokens
    outer: while (context.index < length) {
        const char = input[context.index];
        context.char = char;
        
        const fn = funcs.get(char);
        if (fn) {
            const token = fn(context);
            if (token !== undefined) {
                newTokens.push(token);
            }
        } else {
            console.log(`Unrecognized character: ${char} at position ${context.index}`);
            context.index++;
        }
        
        const transformedOffset = context.index - offsetDelta;
        
        // Check if we can start reusing existing tokens
        while (currentTokenIndex < tokenLength) {
            const startOffset = tokens[currentTokenIndex].range.start;
            
            if (startOffset < transformedOffset) {
                currentTokenIndex++;
            } else if (startOffset === transformedOffset) {
                // Found a token that starts at the transformed offset - we can reuse from here
                break outer;
            } else {
                break;
            }
        }
    }
    
    // Add remaining tokens with adjusted positions
    const remainingTokens = tokens.slice(currentTokenIndex);
    for (const token of remainingTokens) {
        token.range.start += offsetDelta;
        token.range.end += offsetDelta;
        newTokens.push(token);
    }
    
    return newTokens;
}

// Initialize the lexer
initLexer();

test('perf', () => {
    let text = readFileSync(process.cwd() + '/code_samples/RXGIM.pli', 'utf-8');
    while (text.length < 500_000) {
        text += text;
    }
    console.log('Lexing ' + text.length + ' characters');
    let tokens: Token[] = [];
    const items: number[] = [];
    for (let i = 0; i < 5; i++) {
        const start = performance.now();
        tokens = tokenize(text, '');
        const end = performance.now();
        items.push(end - start);
    }
    items.push(-1);
    const mainOffset = text.indexOf('MAIN');
    const delta: TextDelta = {
        text: 'NEW_MAIN',
        range: {
            start: mainOffset,
            end: mainOffset + 4
        }
    }
    const newText = text.substring(0, mainOffset) + delta.text + text.substring(mainOffset + 4);
    let newTokens: Token[] = [];
    for (let i = 0; i < 5; i++) {
        const start = performance.now();
        newTokens = retokenize(delta, newText, '', tokens);
        const end = performance.now();
        items.push(end - start);
    }
    console.log('done');
}, 100000);