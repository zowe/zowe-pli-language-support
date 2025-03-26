import { TokenType } from "chevrotain";
import { charCodeToOptimizedIndex } from "./regexp/chevrotain-regexp";
import { analyzeTokenTypes } from "./regexp/chevrotain-lexer";

export interface TokenPicker {
    pickTokenTypes(charCode: number): TokenType[];
}

export interface TokenPickerOptimizer {
    optimize(tokenTypes: TokenType[]): TokenPicker;
}

export class PliNaiveTokenPickerOptimizer implements TokenPickerOptimizer {
    optimize(tokenTypes: TokenType[]): TokenPicker {
        return ({
            pickTokenTypes() {
                return tokenTypes;
            }
        });
    }
}

export class PliSmartTokenPickerOptimizer implements TokenPickerOptimizer {
    optimize(tokenTypes: TokenType[]): TokenPicker {
        const { charCodeToPatternIdxToConfig } = analyzeTokenTypes(tokenTypes, { useSticky: true });

        return ({
            pickTokenTypes: (charCode) => {
                const optimizedCharIdx = charCodeToOptimizedIndex(charCode);
                const possiblePatterns = charCodeToPatternIdxToConfig[optimizedCharIdx];
                if (possiblePatterns === undefined) {
                    return [];
                } else {
                    return possiblePatterns;
                }
            }
        });
    }
}
