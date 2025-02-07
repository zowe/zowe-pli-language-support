import { IToken, TokenType } from "chevrotain";

export class PreprocessorParserState {
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
        if (!this.canConsume(tokenType)) {
            throw new Error(`Expected token type '${tokenType.name}', got '${this.current?.tokenType.name ?? '???'}' instead.`);
        }
        const token = this.current!;
        this.index++;
        return token;
    }
}