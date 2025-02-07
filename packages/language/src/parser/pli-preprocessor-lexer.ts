import { TokenType, Lexer as ChevrotainLexer, IToken, createTokenInstance, TokenTypeDictionary } from "chevrotain";
import { PliPreprocessorParser } from "./pli-preprocessor-parser";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";
import { PreprocessorLexerState } from "./pli-preprocessor-lexer-state";
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

    /**
     * This method contains a state machine. In order to make the class stateless, state was manifested in a plain object and state changes
     * are made via reducer pattern. This requires to change the state variable multiple times. All subroutines that manipulate state are
     * included in this method.
     * @param text to be tokenized
     * @returns a set of tokens without preprocessor tokens
     */
    tokenize(text: string) {
        const result: IToken[] = [];
        const normalTokenTypes = this.normalTokenTypes;
        const hiddenTokenTypes = this.hiddenTokenTypes;
        const idTokenType = this.idTokenType;
        const preprocessorParser = this.preprocessorParser;

        let state = new PreprocessorLexerState(text);
        while (!state.eof()) {
            skipHiddenTokens();
            if (tryToReadPreprocessorStatement()) {
                continue;
            } else {
                let token: IToken | undefined;
                do {
                    token = scanInput();
                    if (token) {
                        result.push(token);
                    }
                } while (token && token.image !== ';');
            }
        }
        return {
            tokens: result
        };

        function scanInput(): IToken | undefined {
            skipHiddenTokens();
            for (const tokenType of normalTokenTypes) {
                const token = state.tryConsume(tokenType);
                if (!token) {
                    continue;
                }
                if (isIdentifier(token) && state.hasVariable(token.image)) {
                    const variable = state.getVariable(token.image);
                    if (variable.active) {
                        state.applyAction({
                            type: 'replaceVariable',
                            text: variable.value?.toString() ?? ""
                        });
                        let left = scanInput();
                        while (left && left.tokenType === PreprocessorTokens.Percentage) {
                            left = scanInput();
                        }
                        if (left && state.canConsume(PreprocessorTokens.Percentage)) {
                            while (state.canConsume(PreprocessorTokens.Percentage)) {
                                state.emit("%", PreprocessorTokens.Percentage);
                                const keepInMind = state;
                                const right = scanInput();
                                if (right && isIdentifier(right)) {
                                    left = createTokenInstance(idTokenType, left.image + right.image, 0, 0, 0, 0, 0, 0);
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

        function skipHiddenTokens() {
            while (hiddenTokenTypes.some(h => state.tryConsume(h) !== undefined));
        };
    
        function tryToReadPreprocessorStatement(): boolean {
            if (state.eof() || !state.tryConsume(PreprocessorTokens.Percentage)) {
                return false;
            }
            const tokens = tokenizeUntilSemicolon(AllPreprocessorTokens);
            const parserState = preprocessorParser.initializeState(tokens);
            const statement = preprocessorParser.start(parserState);
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
                                state.applyAction({
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
                    state.applyAction({
                        type: 'assign',
                        name: statement.left,
                        value: statement.right.value
                    })
                    break;
                }
                case 'skipStatement': {
                    state.applyAction({
                        type: "advanceLines",
                        //+1 also skip the current line!
                        lineCount: statement.lineCount + 1
                    });
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
    
        function isIdentifier(token: IToken) {
            return token.tokenType.name === "ID" || (token.tokenType.CATEGORIES && token.tokenType.CATEGORIES.findIndex(t => t.name === "ID") > -1);
        }
    
        function tokenizeUntilSemicolon(allowedTokenTypes: TokenType[]) {
            const result: IToken[] = [];
            let foundAny: boolean;
            do {
                foundAny = false;
                skipHiddenTokens();
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
}