import { isRegExp } from "util/types";
import { Pl1Services } from "../pli-module";
import { PliTokenBuilder } from "./pli-token-builder";
import { TokenType, Lexer as ChevrotainLexer, IToken, createToken, createTokenInstance } from "chevrotain";
import { PliPreprocessorParser } from "./pli-preprocessor-parser";
import { PPDeclaration } from "./pli-preprocessor-ast";

export const PreprocessorTokens = {
    Declare: tokenType("declare", /DCL|DECLARE/yi),
    Eq: tokenType("eq", /=/yi),
    Builtin: tokenType("builtin", /BUILTIN/yi),
    Entry: tokenType("builtin", /ENTRY/yi),
    Character: tokenType("character", /CHAR(ACTER)?/yi),
    Internal: tokenType("internal", /INT(ERNAL)?/yi),
    External: tokenType("external", /EXT(ERNAL)?/yi),
    Scan: tokenType("scan", /SCAN/yi),
    Rescan: tokenType("rescan", /RESCAN/yi),
    Noscan: tokenType("noscan", /NOSCAN/yi),
    Fixed: tokenType("fixed", /FIXED/yi),
    LParen: tokenType("lparen", /\(/yi),
    RParen: tokenType("rparen", /\)/yi),
    Semicolon: tokenType("semicolon", /;/yi),
    Comma: tokenType("comma", /,/yi),
    Percentage: tokenType("percentage", /%/yi),
    String: tokenType("string", /("(""|\\.|[^"\\])*"|'(''|\\.|[^'\\])*')([xX]|[aA]|[eE]|[xX][uU]|[xX][nN]|[bB]4|[bB]3|[bB][xX]|[bB]|[gG][xX]|[gG]|[uU][xX]|[wW][xX]|[xX]|[iI])*/y),
    Id: tokenType("id", /[a-z_][a-z_0-9]*/yi),
};

const AllPreprocessorTokens = Object.values(PreprocessorTokens);

type Variable = {
    declaration: PPDeclaration;
    value: number|string|undefined;
};

export class PliPreprocessor {
    private readonly hiddenTokens: TokenType[];
    private readonly normalTokens: TokenType[];
    private readonly text: string;
    private index = 0;
    private line = 1;
    private column = 1;
    private tokens: IToken[] = [];
    private hidden: IToken[] = [];
    private variables = new Map<string, Variable>();

    constructor(services: Pl1Services, text: string) {
        const tokenBuilder = services.parser.TokenBuilder as PliTokenBuilder;
        const vocabulary = tokenBuilder.buildTokens(services.Grammar) as TokenType[];
        this.hiddenTokens = vocabulary.filter(v => v.GROUP === 'hidden' || v.GROUP === ChevrotainLexer.SKIPPED);
        this.normalTokens = vocabulary.filter(v => !this.hiddenTokens.includes(v));
        this.text = text;
    }

    start() {
        const resultHidden: IToken[] = [];
        const resultTokens: IToken[] = [];
        while(this.index < this.text.length) {
            const { tokens, hidden } = this.readStatement();
            resultTokens.push(...tokens);
            resultHidden.push(...hidden);
        }
        return {
            tokens: resultTokens,
            hidden: resultHidden,
        }
    }

    private readStatement() {
        this.skip();
        if(this.tryConsume(PreprocessorTokens.Percentage)) {
            const { tokens } = this.tokenizeUntilSemicolon(AllPreprocessorTokens);
            const statement = new PliPreprocessorParser(tokens).start();
            switch(statement.type) {
                case 'declareStatement': {
                    for (const declaration of statement.declarations) {
                        this.variables.set(declaration.name, {
                            declaration,
                            value: undefined
                        });
                    }
                    return {
                        tokens: [],
                        hidden: [],
                    };
                }
                case 'assignmentStatement': {
                    this.variables.get(statement.left)!.value = statement.right;
                    return {
                        tokens: [],
                        hidden: [],
                    };
                }
                default:
                    return {
                        tokens: [],
                        hidden: [],
                    };
            }
        } else {
            const { tokens, hidden } = this.tokenizeUntilSemicolon([PreprocessorTokens.Percentage].concat(this.normalTokens));
            //TODO expand variables
            return { tokens, hidden };
        }
    }

    private tokenizeUntilSemicolon(allowedTokens: TokenType[]) {
        this.tokens = [];
        this.hidden = [];
        while(true) {
            this.skip();
            if(allowedTokens.some(t => this.tryConsume(t))) {
                if(this.tokens.length == 0 || this.tokens[this.tokens.length-1].image === ';') {
                    break;
                }
            } else {
                break;
            }
        }
        return {
            tokens: this.tokens,
            hidden: this.hidden
        };
    }

    private advanceBy(scanned: string) {
        const NL = /\r?\n/y;
        for (let charIndex = 0; charIndex < scanned.length;) {
            NL.lastIndex = charIndex;
            const match = NL.exec(scanned);
            if (match) {
                this.index += match[0].length;
                this.line = this.line + 1;
                this.column = 1;
                charIndex += match[0].length;
            } else {
                charIndex++;
                this.column++;
                this.index++;
            }
        }
    }

    private emit(scanned: string, tokenType: TokenType) {
        const [startLine, startColumn, startOffset] = [this.line, this.column, this.index];
        this.advanceBy(scanned);
        const [endLine, endColumn, endOffset] = [this.line, this.column, this.index];
        const token = createTokenInstance(tokenType, scanned, startOffset, endOffset, startLine, endLine, startColumn, endColumn);
        if (tokenType.GROUP === "hidden" || tokenType.GROUP === ChevrotainLexer.SKIPPED) {
            this.hidden.push(token);
        } else {
            this.tokens.push(token);
        }
        return token;
    }

    private tryConsume(tokenType: TokenType) {
        const pattern = tokenType.PATTERN;
        if (pattern) {
            if (isRegExp(pattern)) {
                pattern.lastIndex = this.index;
                const match = pattern.exec(this.text);
                if (match) {
                    this.emit(match[0], tokenType);
                    return true;
                }
            } else if (typeof pattern === "string") {
                const image = this.text.substring(this.index, this.index + pattern.length);
                if (image.toLowerCase() === pattern.toLowerCase()) {
                    this.emit(image, tokenType);
                    return true;
                }
            }
        }
        return false;
    }

    private consume(tokenType: TokenType) {
        const pattern = tokenType.PATTERN;
        if (pattern) {
            if (isRegExp(pattern)) {
                pattern.lastIndex = this.index;
                const match = pattern.exec(this.text);
                if (match) {
                    return this.emit(match[0], tokenType);
                }
            } else if (typeof pattern === "string") {
                const image = this.text.substring(this.index, this.index + pattern.length);
                if (image.toLowerCase() === pattern.toLowerCase()) {
                    return this.emit(image, tokenType);
                }
            }
        }
        throw new Error(`Could not consume ${tokenType.name}.`);
    }

    private skip() {
        while (this.hiddenTokens.some(h => this.tryConsume(h)));
    }
}

function tokenType(name: string, pattern: string | RegExp) {
    return createToken({
        name,
        pattern,
    });
}