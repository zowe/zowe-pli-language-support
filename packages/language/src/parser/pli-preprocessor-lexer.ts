import { TokenType, Lexer as ChevrotainLexer, IToken, createTokenInstance, TokenTypeDictionary } from "chevrotain";
import { PliPreprocessorParser } from "./pli-preprocessor-parser";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";
import { PliPreprocessorLexerState, PreprocessorLexerState } from "./pli-preprocessor-lexer-state";
import { Pl1Services } from "../pli-module";

const AllPreprocessorTokens = Object.values(PreprocessorTokens);

export class PliPreprocessorLexer {
    private readonly hiddenTokenTypes: TokenType[];
    private readonly normalTokenTypes: TokenType[];
    private readonly idTokenType: TokenType;
    private readonly vocabulary: TokenType[];
    private readonly preprocessorParser: PliPreprocessorParser;
    public readonly tokenTypeDictionary: TokenTypeDictionary;

    constructor(services: Pl1Services) {
        this.preprocessorParser = services.parser.PreprocessorParser;
        this.vocabulary = services.parser.TokenBuilder.buildTokens(services.Grammar) as TokenType[];
        this.tokenTypeDictionary = {};
        for (const token of this.vocabulary) {
            this.tokenTypeDictionary[token.name] = token;
        }
        this.hiddenTokenTypes = this.vocabulary.filter(v => v.GROUP === 'hidden' || v.GROUP === ChevrotainLexer.SKIPPED);
        this.normalTokenTypes = [PreprocessorTokens.Percentage].concat(this.vocabulary.filter(v => !this.hiddenTokenTypes.includes(v)));
        this.idTokenType = this.normalTokenTypes.find(t => t.name === "ID")!;
    }

    tokenize(text: string) {
        const result: IToken[] = [];
        let state: PreprocessorLexerState = new PliPreprocessorLexerState(text);
        while (!state.eof()) {
            this.skipHiddenTokens(state);
            if (this.tryToReadPreprocessorStatement(state)) {
                continue;
            } else {
                let token: IToken | undefined;
                do {
                    token = this.scanInput(state);
                    if (token) {
                        result.push(token);
                    }
                } while (token && token.image !== ';');
            }
        }
        return {
            tokens: result
        };
    }

    protected scanInput(state: PreprocessorLexerState): IToken | undefined {
        this.skipHiddenTokens(state);
        for (const tokenType of this.normalTokenTypes) {
            const token = state.tryConsume(tokenType);
            if (!token) {
                continue;
            }
            if (this.isIdentifier(token) && state.hasVariable(token.image)) {
                const variable = state.getVariable(token.image);
                if (variable.active) {
                    state.replaceVariable(variable.value?.toString() ?? "");
                    let left = this.scanInput(state);
                    while (left && left.tokenType === PreprocessorTokens.Percentage) {
                        left = this.scanInput(state);
                    }
                    if (left && state.canConsume(PreprocessorTokens.Percentage)) {
                        while (state.canConsume(PreprocessorTokens.Percentage)) {
                            state.emit("%", PreprocessorTokens.Percentage);
                            const keepInMind = state;
                            const right = this.scanInput(state);
                            if (right && this.isIdentifier(right)) {
                                left = createTokenInstance(this.idTokenType, left.image + right.image, 0, 0, 0, 0, 0, 0);
                            } else {
                                state = keepInMind;
                                return left;
                            }
                        }
                        return left;
                    } else {
                        return left;
                    }
                }
            }
            return token;
        }
        return undefined;
    };

    protected skipHiddenTokens(state: PreprocessorLexerState) {
        while (this.hiddenTokenTypes.some(h => state.tryConsume(h) !== undefined));
    };

    protected tryToReadPreprocessorStatement(state: PreprocessorLexerState): boolean {
        if (state.eof() || !state.tryConsume(PreprocessorTokens.Percentage)) {
            return false;
        }
        const tokens = this.tokenizeUntilSemicolon(state, AllPreprocessorTokens);
        const parserState = this.preprocessorParser.initializeState(tokens);
        const statement = this.preprocessorParser.start(parserState);
        switch (statement.type) {
            case 'declareStatement': {
                for (const declaration of statement.declarations) {
                    switch (declaration.type) {
                        case "builtin":
                        case "entry":
                            //TODO
                            break;
                        case "fixed":
                        case "character":
                            state.declare(declaration.name, {
                                dataType: declaration.type,
                                scanMode: declaration.scanMode,
                                value: undefined,
                                active: true
                            });
                            break;
                    }
                }
                break;
            }
            case 'assignmentStatement': {
                state.assign(statement.left, statement.right.value);
                break;
            }
            case 'skipStatement': {
                //+1 also skip the current line!
                state.advanceLines(statement.lineCount + 1);
                break;
            }
            case 'pageDirective':
            case 'includeStatement': //TODO
            default: {
                //nothing to do
                break;
            }
        }
        return true;
    }

    protected isIdentifier(token: IToken) {
        return token.tokenType.name === "ID" || (token.tokenType.CATEGORIES && token.tokenType.CATEGORIES.findIndex(t => t.name === "ID") > -1);
    }

    protected tokenizeUntilSemicolon(state: PreprocessorLexerState, allowedTokenTypes: TokenType[]) {
        const result: IToken[] = [];
        let foundAny: boolean;
        do {
            foundAny = false;
            this.skipHiddenTokens(state);
            for (const tokenType of allowedTokenTypes) {
                const token = state.tryConsume(tokenType);
                if (token) {
                    result.push(token);
                    foundAny = true;
                    if (token.image === ';') {
                        return result;
                    }
                    break;
                }
            }
        } while (foundAny);
        return result;
    }
}