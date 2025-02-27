import { IToken, TokenType } from "chevrotain";
import { PreprocessorError } from "./pli-preprocessor-parser";

export interface PreprocessorParserState {
    index: number;
    get current(): IToken|undefined;
    get last(): IToken|undefined;
    get eof(): boolean;
    canConsume(tokenType: TokenType): boolean;
    tryConsume(tokenType: TokenType): boolean;
    consume(tokenType: TokenType): IToken;
}

export class PliPreprocessorParserState implements PreprocessorParserState {
    private readonly tokens: IToken[]
    public index: number;

    constructor(tokens: IToken[]) {
        this.tokens = tokens;
        this.index = 0;
    }

    get current() {
        return this.eof ? undefined : this.tokens[this.index];
    }

    get last() {
        return this.eof ? this.tokens.length === 0 ? undefined : this.tokens[this.tokens.length-1] : this.tokens[this.index - 1];
    }

    get eof() { //end of statement
        return this.index >= this.tokens.length;
    }

    canConsume(tokenType: TokenType) {
        return this.current?.tokenType === tokenType;
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