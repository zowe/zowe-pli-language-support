import { createTokenInstance, IToken, TokenType } from "chevrotain";
import { ScanMode, VariableDataType } from "./pli-preprocessor-ast";

export interface PreprocessorLexerState {
    currentChar(): number;
    eof(): boolean;
    position(): TextPosition;
    advanceScan(scanned: string): void;
    advanceLines(lineCount: number): void;
    tryConsume(tokenType: TokenType): IToken | undefined;
    canConsume(tokenType: TokenType): string | undefined;
    emit(image: string, tokenType: TokenType): IToken;
}

export class PliPreprocessorLexerState implements PreprocessorLexerState {
    private readonly plainState: PlainPreprocessorLexerState;

    constructor(text: string) {
        this.plainState = initializePreprocessorState(text);
    }

    currentChar(): number {
        return this.eof() ? -1 : this.plainState.text.charCodeAt(this.plainState.offset);
    }

    eof(): boolean {
        return Selectors.eof(this.plainState);
    }

    position(): TextPosition {
        return Selectors.position(this.plainState);
    }

    tryConsume(tokenType: TokenType): IToken | undefined {
        const image = this.canConsume(tokenType);
        if (!image) {
            return undefined;
        }
        return this.emit(image, tokenType);
    }

    emit(image: string, tokenType: TokenType) {
        const { offset: startOffset, line: startLine, column: startColumn } = Selectors.position(this.plainState);
        this.advanceScan(image);
        const { offset: endOffset, line: endLine, column: endColumn } = Selectors.position(this.plainState);
        //ATTENTION: mind the -1 for end offset and end column, we do not want to consume the next tokens range!
        return createTokenInstance(tokenType, image, startOffset, endOffset - 1, startLine, endLine, startColumn, endColumn - 1);
    }

    canConsume(tokenType: TokenType): string | undefined {
        if (Selectors.eof(this.plainState)) {
            return undefined;
        }
        const { offset: index, text } = this.plainState;
        const pattern = tokenType.PATTERN;
        if (pattern) {
            if (pattern instanceof RegExp) {
                pattern.lastIndex = index;
                const match = pattern.exec(text);
                if (match) {
                    return this.handleLongerAlternative(tokenType, match[0]);
                }
            } else if (typeof pattern === "string") {
                const image = text.substring(index, index + pattern.length);
                if (image.toLowerCase() === pattern.toLowerCase()) {
                    return this.handleLongerAlternative(tokenType, image);
                }
            }
        }
        return undefined;
    }

    handleLongerAlternative(tokenType: TokenType, match: string) {
        if (tokenType.LONGER_ALT) {
            //if a "longer" alternative can be detected, deny
            const alternatives = Array.isArray(tokenType.LONGER_ALT) ? tokenType.LONGER_ALT : [tokenType.LONGER_ALT];
            if (alternatives.some(a => this.hasLongerAlternative(a, match))) {
                return undefined;
            }
        }
        return match;
    }

    hasLongerAlternative(tokenType: TokenType, match: string): boolean {
        const alternative = this.canConsume(tokenType);
        return alternative !== undefined && alternative.length > match.length
            //TODO this last condition should be implicit. But actually there is a bug and this condition needs to be checked as well.
            && alternative.startsWith(match);
    }

    advanceLines(lineCount: number) {
        if (Selectors.eof(this.plainState)) {
            return;
        }
        const { text, ...oldPosition } = this.plainState;
        const newPosition = Mutators.countNewLinesWhile(oldPosition, text, oldPosition.offset, (newPosition) => newPosition.line - oldPosition.line < lineCount)
        Mutators.setPosition(this.plainState, newPosition);
    }

    advanceScan(scanned: string) {
        if (Selectors.eof(this.plainState)) {
            return;
        }
        const { text: _, ...oldPosition } = this.plainState;
        const newPosition = Mutators.countNewLinesWhile(oldPosition, scanned, 0, () => true);
        Mutators.setPosition(this.plainState, newPosition);
    }
}

// PLAIN STATE

export type TextPosition = {
    offset: number;
    line: number;
    column: number;
};

export type PreprocessorVariable = {
    scanMode: ScanMode;
    active: boolean;
    dataType: VariableDataType;
    value: number | string | undefined;
};

export type PreprocessorScan = {
    text: string;
    offset: number;
    line: number;
    column: number;
};

export type PlainPreprocessorLexerState = PreprocessorScan;

export const initializePreprocessorState: (text: string) => PlainPreprocessorLexerState = (text): PlainPreprocessorLexerState => ({
    column: 1,
    line: 1,
    offset: 0,
    text
});

// SELECTORS

namespace Selectors {
    export function eof(state: PlainPreprocessorLexerState): boolean {
        return state.offset >= state.text.length;
    }
    export function position(state: PlainPreprocessorLexerState): TextPosition {
        if (!eof(state)) {
            const { offset: index, line, column } = state;
            return {
                column,
                line,
                offset: index,
            }
        }
        return {
            offset: 0,
            column: 0,
            line: 0,
        };
    }
}

// MUTATORS

namespace Mutators {
    export function setPosition(state: PlainPreprocessorLexerState, newPosition: TextPosition) {
        if (Selectors.eof(state)) {
            return;
        }
        const frame = state;
        if (newPosition.offset <= frame.text.length) {
            frame.offset = newPosition.offset;
            frame.line = newPosition.line;
            frame.column = newPosition.column;
        }
    }
    export function countNewLinesWhile(initialPosition: TextPosition, text: string, startFrom: number, whilePredicate: (currentPosition: TextPosition, textOffset: number) => boolean): TextPosition {
        const NL = /\r?\n/y;
        let { offset, column, line } = initialPosition;
        for (let charIndex = startFrom; charIndex < text.length && whilePredicate({ offset, column, line }, charIndex);) {
            NL.lastIndex = charIndex;
            const match = NL.exec(text);
            if (match) {
                offset += match[0].length;
                line++;
                column = 1;
                charIndex += match[0].length;
            } else {
                charIndex++;
                column++;
                offset++;
            }
        }
        return { offset, column, line };
    }
}