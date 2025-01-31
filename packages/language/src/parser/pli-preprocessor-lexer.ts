import { Pl1Services } from "../pli-module";
import { PliTokenBuilder } from "./pli-token-builder";
import { TokenType, Lexer as ChevrotainLexer, IToken, createTokenInstance } from "chevrotain";
import { PliPreprocessorParser } from "./pli-preprocessor-parser";
import { isRegExp } from "util/types";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";
import { InitialPreprocessorState, PreprocessorAction, PreprocessorState, Selectors, translatePreprocessorState } from "./pli-preprocessor-state";

const AllPreprocessorTokens = Object.values(PreprocessorTokens);

export class PliPreprocessorLexer {
    private readonly hiddenTokenTypes: TokenType[];
    private readonly normalTokenTypes: TokenType[];
    private state: PreprocessorState;

    constructor(services: Pl1Services, text: string) {
        const tokenBuilder = services.parser.TokenBuilder as PliTokenBuilder;
        const vocabulary = tokenBuilder.buildTokens(services.Grammar) as TokenType[];
        this.hiddenTokenTypes = vocabulary.filter(v => v.GROUP === 'hidden' || v.GROUP === ChevrotainLexer.SKIPPED);
        this.normalTokenTypes = [PreprocessorTokens.Percentage].concat(vocabulary.filter(v => !this.hiddenTokenTypes.includes(v)));
        this.state = InitialPreprocessorState(text);
    }

    start() {
        const result: IToken[] = [];
        while(!Selectors.eof(this.state)) {
            this.skip();
            if(this.tryToReadPreprocessorStatement()) {
                continue;
            } else {
                let token: IToken|undefined;
                do {
                    token = this.scanInput();
                    if(token) {
                        result.push(token);
                    }
                } while(token && token.image !== ';');
            }
        }
        return {
            tokens: result
        }
    }

    private scanInput(): IToken|undefined {
        this.skip();
        for (const tokenType of this.normalTokenTypes) {
            const token = this.tryConsume(tokenType);
            if(!token) {
                continue;
            }
            if(this.isIdentifier(token) && Selectors.hasVariable(this.state, token.image)) {
                const variable = Selectors.getVariable(this.state, token.image);
                if(variable.active) {
                    this.applyAction({
                        type: 'replaceVariable',
                        text: variable.value?.toString() ?? ""
                    });
                    return this.scanInput();
                }
            }
            return token;
        }
        return undefined;
    }

    private tryToReadPreprocessorStatement(): boolean {
        if(Selectors.eof(this.state) || !this.tryConsume(PreprocessorTokens.Percentage)) {
            return false;
        }
        const tokens = this.tokenizeUntilSemicolon(AllPreprocessorTokens);
        const statement = new PliPreprocessorParser(tokens).start();
        switch(statement.type) {
            case 'declareStatement': {
                for (const declaration of statement.declarations) {
                    switch(declaration.type) {
                        case "builtin":
                        case "entry":
                            //TODO
                            break;
                        case "fixed":
                        case "character":
                            this.applyAction({
                                type: 'declare',
                                name: declaration.name,
                                dataType: declaration.type,
                                scanMode: declaration.scanMode,
                                value: undefined
                            });
                            break;
                    }
                }
                break;
            }
            case 'assignmentStatement': {
                this.applyAction({
                    type: 'assign',
                    name: statement.left,
                    value: statement.right.value
                })
                break;
            }
            default: {
                break;
            }
        }
        return true;
    }

    private isIdentifier(token: IToken) {
        return token.tokenType.name === "ID" || (token.tokenType.CATEGORIES && token.tokenType.CATEGORIES.findIndex(t => t.name === "ID") > -1);
    }

    private tokenizeUntilSemicolon(allowedTokenTypes: TokenType[]) {
        const result: IToken[] = [];
        let foundAny: boolean;
        do {
            foundAny = false;
            this.skip();
            for (const tokenType of allowedTokenTypes) {
                const token = this.tryConsume(tokenType);
                if(token) {
                    result.push(token);
                    foundAny = true;
                    if(token.image === ';') {
                        return result;
                    }
                    break;
                }
            }
        } while(foundAny);
        return result;
    }

    private emit(scanned: string, tokenType: TokenType) {
        const [startOffset, startLine, startColumn] = Selectors.position(this.state);
        this.applyAction({
            type: "advanceScan",
            scanned
        });
        const [endOffset, endLine, endColumn] = Selectors.position(this.state);
        return createTokenInstance(tokenType, scanned, startOffset, endOffset, startLine, endLine, startColumn, endColumn);
    }

    private tryConsume(tokenType: TokenType): IToken|undefined {
        if(Selectors.eof(this.state)) {
            return undefined;
        }
        const { index, text } = Selectors.top(this.state);
        const pattern = tokenType.PATTERN;
        if (pattern) {
            if (isRegExp(pattern)) {
                pattern.lastIndex = index;
                const match = pattern.exec(text);
                if (match) {
                    return this.emit(match[0], tokenType);
                }
            } else if (typeof pattern === "string") {
                const image = text.substring(index, index + pattern.length);
                if (image.toLowerCase() === pattern.toLowerCase()) {
                    return this.emit(image, tokenType);
                }
            }
        }
        return undefined;
    }

    private skip() {
        while (this.hiddenTokenTypes.some(h => this.tryConsume(h) !== undefined));
    }

    private applyAction(action: PreprocessorAction) {
        this.state = translatePreprocessorState(this.state, action);
    }
}