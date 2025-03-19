import { ILexingError, IToken } from "chevrotain";

export class PreprocessorError extends Error implements ILexingError {
    private readonly token: IToken;
    public readonly uri: string;
    constructor(message: string, token: IToken, uri: string) {
        super(message);
        this.token = token;
        this.uri = uri;
    }
    readonly type = 'error';
    get offset(): number { return this.token.startOffset; }
    get line(): number | undefined { return this.token.startLine; }
    get column(): number | undefined { return this.token.startColumn; }
    get length(): number { return this.token.image.length; }
}
