import { IToken, TokenType } from "chevrotain";
import { PreprocessorError } from "./pli-preprocessor-parser";
import { PliPreprocessorLexer } from "./pli-preprocessor-lexer";
import { PliPreprocessorLexerState, PreprocessorLexerState } from "./pli-preprocessor-lexer-state";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";

type ParserLocation = 'in-statement' | 'in-procedure';

export interface PreprocessorParserState {
    index: number;
    get current(): IToken | undefined;
    get last(): IToken | undefined;
    get eof(): boolean;
    canConsume(tokenType: TokenType, k?: number): boolean;
    tryConsume(tokenType: TokenType): boolean;
    consume(tokenType: TokenType): IToken;
    consumeUntil(predicate: (token: IToken) => boolean): IToken[];
    advanceLines(lineCount: number): void;
    push(location: ParserLocation): void;
    pop(): void;
    isOnlyInStatement(): boolean;
    isInProcedure(): boolean;
}


export class PliPreprocessorParserState implements PreprocessorParserState {
    private readonly lexer: PliPreprocessorLexer;
    private readonly lexerState: PreprocessorLexerState;
    private readonly tokens: IToken[]
    public index: number;
    private location: ParserLocation[] = [];

    constructor(lexer: PliPreprocessorLexer, text: string) {
        this.lexer = lexer;
        this.lexerState = new PliPreprocessorLexerState(text);
        this.tokens = [];
        this.index = 0;
    }

    consumeUntil(predicate: (token: IToken) => boolean): IToken[] {
        const result: IToken[] = [];
        while(!this.eof && this.current && !predicate(this.current)) {
            result.push(this.current);
            this.index++;
        }
        if(this.current && predicate(this.current)) {
            result.push(this.current);
            this.index++;
        }
        return result;
    }

    advanceLines(lineCount: number): void {
        this.lexerState.advanceLines(lineCount);
    }
    push(location: ParserLocation): void {
        this.location.push(location);
    }
    top(): ParserLocation | undefined {
        if (this.location.length > 0) {
            return this.location[this.location.length - 1];
        }
        return undefined;
    }
    pop(): void {
        this.location.pop();
    }

    get current() {
        return this.eof ? undefined : this.tokens[this.index];
    }

    get last() {
        return this.eof ? this.tokens.length === 0 ? undefined : this.tokens[this.tokens.length - 1] : this.tokens[this.index - 1];
    }

    get eof() { //end of statement
        if (this.index >= this.tokens.length && !this.lexerState.eof()) {
            this.fetchNextChunkOfTokens();
        }
        return this.index >= this.tokens.length;
    }

    canConsume(tokenType: TokenType, k?: number) {
        k ??= 1;
        k = k - 1;
        if (this.index + k >= this.tokens.length) {
            if (!this.lexerState.eof()) {
                this.fetchNextChunkOfTokens();
            }
        }
        const current = this.index + k >= this.tokens.length ? undefined : this.tokens[this.index + k]
        return current?.tokenType.name.toLowerCase() === tokenType.name.toLowerCase();
    }

    private fetchNextChunkOfTokens() {
        this.lexer.skipHiddenTokens(this.lexerState);
        if (this.isInProcedure()) {
            //only fetch preprocessor tokens until the first semicolon
            const newTokens = this.lexer.tokenizePreprocessorTokensUntilSemicolon(this.lexerState);
            this.tokens.push(...newTokens);
        } else if (this.isOnlyInStatement()) {
            //if an percentage occurs, fetch preprocessor tokens. Otherwise only % and PL/I tokens
            //until the first semicolon
            if (this.lexerState.canConsume(PreprocessorTokens.Percentage)) {
                const newTokens = this.lexer.tokenizePreprocessorTokensUntilSemicolon(this.lexerState);
                this.tokens.push(...newTokens);
            } else {
                const newTokens = this.lexer.tokenizePliTokensUntilSemicolon(this.lexerState);
                this.tokens.push(...newTokens);
            }
        }
    }

    isOnlyInStatement() {
        return this.location.length === 0 || this.location.every(l => l === 'in-statement');
    }

    isInProcedure() {
        return this.location.some(l => l === 'in-procedure');
    }

    tryConsume(tokenType: TokenType): boolean {
        if (!this.canConsume(tokenType)) {
            return false;
        }
        this.index++;
        return true;
    }

    consume(tokenType: TokenType) {
        const token = this.current!;
        if (!this.canConsume(tokenType)) {
            const message = `Expected token type '${tokenType.name}', got '${this.current?.tokenType.name ?? '???'}' instead.`;
            throw new PreprocessorError(message, token);
        }
        this.index++;
        return token;
    }
}