import { TokenType, Lexer as ChevrotainLexer, IToken, createTokenInstance, TokenTypeDictionary } from "chevrotain";
import { PliPreprocessorParser } from "./pli-preprocessor-parser";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";
import { initializePreprocessorState, PreprocessorAction, Selectors, translatePreprocessorState } from "./pli-preprocessor-lexer-state";
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
        const hiddenTokenTypes = this.hiddenTokenTypes;
        const normalTokenTypes = this.normalTokenTypes;
        const idTokenType = this.idTokenType;
        const preprocessorParser = this.preprocessorParser;
        const result: IToken[] = [];

        let state = initializePreprocessorState(text);
        while (!Selectors.eof(state)) {
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
                const token = tryConsume(tokenType);
                if (!token) {
                    continue;
                }
                if (isIdentifier(token) && Selectors.hasVariable(state, token.image)) {
                    const variable = Selectors.getVariable(state, token.image);
                    if (variable.active) {
                        applyAction({
                            type: 'replaceVariable',
                            text: variable.value?.toString() ?? ""
                        });
                        let left = scanInput();
                        while (left && left.tokenType === PreprocessorTokens.Percentage) {
                            left = scanInput();
                        }
                        if (left && canConsume(PreprocessorTokens.Percentage)) {
                            while (canConsume(PreprocessorTokens.Percentage)) {
                                emit("%", PreprocessorTokens.Percentage);
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
            while (hiddenTokenTypes.some(h => tryConsume(h) !== undefined));
        };
    
        function tryToReadPreprocessorStatement(): boolean {
            if (Selectors.eof(state) || !tryConsume(PreprocessorTokens.Percentage)) {
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
                                applyAction({
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
                    applyAction({
                        type: 'assign',
                        name: statement.left,
                        value: statement.right.value
                    })
                    break;
                }
                case 'skipStatement': {
                    applyAction({
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
                    const token = tryConsume(tokenType);
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
    
        function tryConsume(tokenType: TokenType): IToken | undefined {
            const image = canConsume(tokenType);
            if (!image) {
                return undefined;
            }
            return emit(image, tokenType);
        }
    
        function emit(image: string, tokenType: TokenType) {
            const { offset: startOffset, line: startLine, column: startColumn} = Selectors.position(state);
            applyAction({
                type: "advanceScan",
                scanned: image
            });
            const {offset: endOffset, line: endLine, column: endColumn} = Selectors.position(state);
            //ATTENTION: mind the -1 for end offset and end column, we do not want to consume the next tokens range!
            return createTokenInstance(tokenType, image, startOffset, endOffset - 1, startLine, endLine, startColumn, endColumn - 1);
        }
    
        function canConsume(tokenType: TokenType): string | undefined {
            if (Selectors.eof(state)) {
                return undefined;
            }
            const { offset: index, text } = Selectors.top(state);
            const pattern = tokenType.PATTERN;
            if (pattern) {
                if (pattern instanceof RegExp) {
                    pattern.lastIndex = index;
                    const match = pattern.exec(text);
                    if (match) {
                        if (tokenType.LONGER_ALT) {
                            //if a "longer" alternative can be detected, deny
                            const alternatives = Array.isArray(tokenType.LONGER_ALT) ? tokenType.LONGER_ALT : [tokenType.LONGER_ALT];
                            if (alternatives.some(a => {
                                const alternative = canConsume(a);
                                if (alternative && alternative.length > match[0].length) {
                                    return alternative;
                                }
                                return undefined;
                            })) {
                                return undefined;
                            }
                        }
                        return match[0];
                    }
                } else if (typeof pattern === "string") {
                    const image = text.substring(index, index + pattern.length);
                    if (image.toLowerCase() === pattern.toLowerCase()) {
                        return image;
                    }
                }
            }
            return undefined;
        }
    
        function applyAction(action: PreprocessorAction) {
            state = translatePreprocessorState(state, action);
        }
    }
}