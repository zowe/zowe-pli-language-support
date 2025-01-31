import { Pl1Services } from "../pli-module";
import { PliTokenBuilder } from "./pli-token-builder";
import { TokenType, Lexer as ChevrotainLexer, IToken, createTokenInstance } from "chevrotain";
import { PliPreprocessorParser } from "./pli-preprocessor-parser";
import { PPDeclaration } from "./pli-preprocessor-ast";
import { isRegExp } from "util/types";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";

const AllPreprocessorTokens = Object.values(PreprocessorTokens);

type Variable = {
    declaration: PPDeclaration;
    value: number|string|undefined;
};

export class PliPreprocessorLexer {
    private readonly hiddenTokens: TokenType[];
    private readonly normalTokens: TokenType[];
    private readonly text: string;
    private index = 0;
    private line = 1;
    private column = 1;
    private tokens: IToken[] = [];
    private hidden: IToken[] = [];
    private variables = new Map<string, Variable>();
    private readonly idToken: TokenType;

    constructor(services: Pl1Services, text: string) {
        const tokenBuilder = services.parser.TokenBuilder as PliTokenBuilder;
        const vocabulary = tokenBuilder.buildTokens(services.Grammar) as TokenType[];
        this.hiddenTokens = vocabulary.filter(v => v.GROUP === 'hidden' || v.GROUP === ChevrotainLexer.SKIPPED);
        this.normalTokens = vocabulary.filter(v => !this.hiddenTokens.includes(v));
        this.idToken = this.normalTokens.find(v => v.name === 'ID')!;
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
            //preprocessor statement
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
                    this.variables.get(statement.left)!.value = statement.right.value;
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
            //normal statement
            const { tokens, hidden } = this.tokenizeUntilSemicolon([PreprocessorTokens.Percentage].concat(this.normalTokens));
            return {
                tokens: this.expandVariables(tokens), 
                hidden
            };
        }
    }
    
    isIdenifier(token: IToken) {
        return token.tokenType.name === "ID" || (token.tokenType.CATEGORIES && token.tokenType.CATEGORIES.findIndex(t => t.name === "ID") > -1);
    }

    expandVariables(tokens: IToken[]) {
        const result: IToken[] = [];
        for (let index = 0; index < tokens.length; ) {
            let token = tokens[index];
            if(this.isIdenifier(token)) {
                const { startOffset, startColumn, startLine } = token;
                let { endOffset, endColumn, endLine } = token;
                const name: string[] = [this.tryExpandVariables(token)];
                index++;
                if(tokens[index].tokenType === PreprocessorTokens.Percentage) {
                    do {
                        index++;
                        token = tokens[index];
                        ({ endOffset, endColumn, endLine } = token);
                        name.push(this.tryExpandVariables(token))
                        index++;
                    } while(tokens[index].tokenType === PreprocessorTokens.Percentage);
                    result.push(createTokenInstance(this.idToken, name.join(""), startOffset, endOffset!, startLine!, endLine!, startColumn!, endColumn!));
                } else {
                    result.push(createTokenInstance(token.tokenType, name[0], startOffset, endOffset!, startLine!, endLine!, startColumn!, endColumn!));
                }
            } else {
                result.push(token);
                index++;
            }
        }
        return result;
    }
    tryExpandVariables(token: IToken): string {
        if(this.variables.has(token.image)) {
            const variable = this.variables.get(token.image)!;
            if(typeof variable.value === 'number') {
                return variable.value.toString();
            } else {
                return variable.value ?? "";
            }
        } else {
            return token.image;
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

    private skip() {
        while (this.hiddenTokens.some(h => this.tryConsume(h)));
    }
}