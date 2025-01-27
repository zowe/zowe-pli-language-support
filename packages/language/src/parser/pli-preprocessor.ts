import { isRegExp } from "util/types";
import { Pl1Services } from "../pli-module";
import { PliTokenBuilder } from "./pli-token-builder";
import { TokenType, Lexer as ChevrotainLexer, IToken, createToken, createTokenInstance } from "chevrotain";

const PreprocessorTokens = {
    Declare: tokenType("declare", /DCL|DECLARE/yi),
    Builtin: tokenType("builtin", /BUILTIN/yi),
    Entry: tokenType("builtin", /ENTRY/yi),
    Character: tokenType("character", /CHAR(ACTER)?/yi),
    Internal: tokenType("internal", /INT(ERNAL)?/yi),
    External: tokenType("external", /EXT(ERNAL)?/yi),
    LParen: tokenType("lparen", /\(/yi),
    RParen: tokenType("rparen", /\)/yi),
    Semicolon: tokenType("semicolon", /;/yi),
    Comma: tokenType("comma", /,/yi),
    Percentage: tokenType("percentage", /%/yi),
    Id: tokenType("ID", /[a-z_][a-z_0-9]*/yi),
};

export class PliPreprocessor {
    private readonly hiddenTokens: TokenType[];
    private readonly normalTokens: TokenType[];
    private readonly text: string;
    private index = 0;
    private line = 1;
    private column = 1;
    private isNewLine = true;
    private tokens: IToken[] = [];
    private hidden: IToken[] = [];

    constructor(services: Pl1Services, text: string) {
        const tokenBuilder = services.parser.TokenBuilder as PliTokenBuilder;
        const vocabulary = tokenBuilder.buildTokens(services.Grammar) as TokenType[];
        this.hiddenTokens = vocabulary.filter(v => v.GROUP === 'hidden' || v.GROUP === ChevrotainLexer.SKIPPED);
        this.normalTokens = vocabulary.filter(v => !this.hiddenTokens.includes(v));
        this.text = text;
    }

    public start() {

        
        for (this.index = 0; this.index < this.text.length;) {
            this.skip();
            if (this.skipAndTryConsumeOneOf(...this.normalTokens)) {
                this.isNewLine = false;
                continue;
            } else {
                if (this.text[this.index] === "%") {
                    this.index++;
                    if (this.isNewLine) {
                        //I am a preprocessor statement!
                        this.declaration();
                    } else {
                        //I am a preprocessor expression that needs to be expanded!
                    }
                }
            }
        }
        return {
            tokens: this.tokens,
            hidden: this.hidden,
        }
    }

    declaration() {
        if (this.skipAndTryConsumeOneOf(PreprocessorTokens.Declare)) {
            this.identifierDescription();
            return true;
        } else {
            return false;
        }
    }

    identifierDescription() {
        if(this.skipAndTryConsumeOneOf(PreprocessorTokens.LParen)) {
          

        } else {
            const id = this.skipAndConsume(PreprocessorTokens.Id);
            
        }
    }

    private advanceBy(scanned: string) {
        const NL = /\r?\n/y;
        for (let charIndex = 0; charIndex < scanned.length;) {
            NL.lastIndex = charIndex;
            const match = NL.exec(scanned);
            if (match) {
                this.index += match[0].length;
                this.line = this.line + 1;
                this.isNewLine = true;
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

    private skipAndTryConsumeOneOf(...tokenTypes: TokenType[]) {
        this.skip();
        return tokenTypes.some(t => this.tryConsume(t));
    }
    private skipAndConsume(tokenType: TokenType) {
        this.skip();
        return this.consume(tokenType);
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