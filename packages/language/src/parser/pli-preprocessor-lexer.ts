import { TokenType, Lexer as ChevrotainLexer, IToken, createTokenInstance, TokenTypeDictionary } from "chevrotain";
import { PliPreprocessorParser, PreprocessorError } from "./pli-preprocessor-parser";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";
import { PliPreprocessorLexerState, PreprocessorLexerState } from "./pli-preprocessor-lexer-state";
import { Pl1Services } from "../pli-module";
import { TokenPicker } from "./pli-token-picker-optimizer";

const AllPreprocessorTokens = Object.values(PreprocessorTokens);

export class PliPreprocessorLexer {
    private readonly hiddenTokenTypes: TokenType[];
    private readonly normalTokenTypePicker: TokenPicker;
    private readonly idTokenType: TokenType;
    private readonly vocabulary: TokenType[];
    private readonly preprocessorParser: PliPreprocessorParser;
    public readonly tokenTypeDictionary: TokenTypeDictionary;

    constructor(services: Pl1Services) {
        const tokenPickerOptimizer = services.parser.TokenPickerOptimizer;
        this.preprocessorParser = services.parser.PreprocessorParser;
        this.vocabulary = services.parser.TokenBuilder.buildTokens(services.Grammar, {caseInsensitive: true}) as TokenType[];
        this.tokenTypeDictionary = {};
        for (const token of this.vocabulary) {
            this.tokenTypeDictionary[token.name] = token;
        }
        this.hiddenTokenTypes = this.vocabulary.filter(v => v.GROUP === 'hidden' || v.GROUP === ChevrotainLexer.SKIPPED);
        
        const normalTokenTypes = [PreprocessorTokens.Percentage].concat(this.vocabulary.filter(v => !this.hiddenTokenTypes.includes(v)));
        this.idTokenType = normalTokenTypes.find(t => t.name === "ID")!;
        this.normalTokenTypePicker = tokenPickerOptimizer.optimize(normalTokenTypes);
    }

    tokenize(text: string) {
        const tokens: IToken[] = [];
        let state: PreprocessorLexerState = new PliPreprocessorLexerState(text);
        while (!state.eof()) {
            this.skipHiddenTokens(state);
            if (this.tryToHandlePreprocessorStatement(state)) {
                continue;
            } else {
                let token: IToken | undefined;
                do {
                    token = this.scanInput(state);
                    if (token) {
                        tokens.push(token);
                    }
                } while (token && token.image !== ';');
            }
        }
        return {
            tokens,
            errors: state.errors()
        };
    }

    protected scanInput(state: PreprocessorLexerState): IToken | undefined {
        this.skipHiddenTokens(state);
        if(state.eof()) {
            return undefined;
        }
        const topFrame = state.top()!;
        for (const tokenType of this.normalTokenTypePicker.pickTokenTypes(topFrame.text.charCodeAt(topFrame.offset))) {
            const token = state.tryConsume(tokenType);
            if (!token) {
                continue;
            }
            if (this.isIdentifier(token) && state.hasVariable(token.image)) {
                const variable = state.getVariable(token.image);
                if (variable.active) {
                    state.replaceVariable(variable.value?.toString() ?? "");
                    let left = this.scanInput(state);
                    //ATTENTION: PreprocessorTokens.Percentage is different from any token type within NormalTokenTypes; that is why name is checked
                    while (left && left.tokenType.name === PreprocessorTokens.Percentage.name) {
                        left = this.scanInput(state);
                    }
                    if (left && state.canConsume(PreprocessorTokens.Percentage)) {
                        while (state.tryConsume(PreprocessorTokens.Percentage)) {
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

    protected tryToHandlePreprocessorStatement(state: PreprocessorLexerState): boolean {
        if (state.eof() || !state.tryConsume(PreprocessorTokens.Percentage)) {
            return false;
        }
        const tokens = this.tokenizeUntilSemicolon(state, AllPreprocessorTokens);
        const parserState = this.preprocessorParser.initializeState(tokens);
        const statement = this.preprocessorParser.start(parserState);
        if(statement instanceof PreprocessorError) {
            state.addError(statement);
            return true;
        }
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
            case 'directive':
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