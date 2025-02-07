import { IToken, TokenType } from "chevrotain";

export class PreprocessorParserState {
    private readonly tokens: IToken[]
    public index: number;

    constructor(tokens: IToken[]) {
        this.tokens = tokens;
        this.index = 0;
    }

    get current() {
        return this.eos ? undefined : this.tokens[this.index];
    }

    get last() {
        return this.eos ? this.tokens[this.tokens.length] : this.tokens[this.index - 1];
    }

    get eos() { //end of statement
        return this.index >= this.tokens.length;
    }

    canConsume(tokenType: TokenType) {
        return this.current?.tokenType === tokenType;
    }

    tryConsume(tokenType: TokenType): boolean {
        if (this.current?.tokenType !== tokenType) {
            return false;
        }
        this.index++;
        return true;
    }

    consume(tokenType: TokenType) {
        if (this.current?.tokenType !== tokenType) {
            throw new Error(`Expected token type '${tokenType.name}', got '${this.current?.tokenType.name ?? '???'}' instead.`);
        }
        const token = this.current;
        this.index++;
        return token;
    }
}