import { TokenType, Lexer as ChevrotainLexer, TokenTypeDictionary, IToken } from "chevrotain";
import { AllPreprocessorTokens, PreprocessorTokens } from "./pli-preprocessor-tokens";
import { Pl1Services } from "../pli-module";
import { TokenPicker } from "./pli-token-picker-optimizer";
import { PreprocessorLexerState } from "./pli-preprocessor-lexer-state";

export class PliPreprocessorLexer {
    private readonly vocabulary: TokenType[];
    public readonly tokenTypeDictionary: TokenTypeDictionary;
    public readonly hiddenTokenTypes: TokenType[];
    public readonly numberTokenType: TokenType;
    public readonly idTokenType: TokenType;
    public readonly normalTokenTypePicker: TokenPicker;

    constructor(services: Pl1Services) {
        const tokenPickerOptimizer = services.parser.TokenPickerOptimizer;
        this.vocabulary = services.parser.TokenBuilder.buildTokens(services.Grammar, { caseInsensitive: true }) as TokenType[];
        this.tokenTypeDictionary = {};
        for (const token of this.vocabulary) {
            this.tokenTypeDictionary[token.name] = token;
        }
        this.hiddenTokenTypes = this.vocabulary.filter(v => v.GROUP === 'hidden' || v.GROUP === ChevrotainLexer.SKIPPED);

        const normalTokenTypes = [PreprocessorTokens.Percentage].concat(this.vocabulary.filter(v => !this.hiddenTokenTypes.includes(v)));
        this.numberTokenType = normalTokenTypes.find(tk => tk.name === "NUMBER")!;
        this.idTokenType = normalTokenTypes.find(tk => tk.name === "ID")!;
        this.normalTokenTypePicker = tokenPickerOptimizer.optimize(normalTokenTypes);
    }

    skipHiddenTokens(state: PreprocessorLexerState) {
        while (this.hiddenTokenTypes.some(h => state.tryConsume(h) !== undefined));
    }

    tokenizePliTokensUntilSemicolon(state: PreprocessorLexerState): IToken[] {
        let token: IToken | undefined = undefined;
        const list: IToken[] = [];
        do {
            token = this.getNextPliToken(state);
            if (token) {
                list.push(token);
            }
        } while (token && token.image !== ';');
        return list;
    }

    private getNextPliToken(state: PreprocessorLexerState): IToken | undefined {
        if (state.eof()) {
            return undefined;
        }
        for (const tokenType of this.hiddenTokenTypes.concat(...[PreprocessorTokens.Percentage], this.normalTokenTypePicker.pickTokenTypes(state.currentChar()))) {
            const token = state.tryConsume(tokenType);
            if (!token) {
                continue;
            }
            return token;
        }
        return undefined;
    };

    tokenizePreprocessorTokensUntilSemicolon(state: PreprocessorLexerState) {
        const result: IToken[] = [];
        let foundAny: boolean;
        do {
            foundAny = false;
            this.skipHiddenTokens(state);
            for (const tokenType of AllPreprocessorTokens) {
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