import { createTokenInstance, IToken, TokenType } from "chevrotain";
import { ScanMode, VariableDataType } from "./pli-preprocessor-ast";
import { URI } from "../utils/uri";

export interface PreprocessorLexerState {
    currentChar(): number;
    eof(): boolean;
    position(): number;
    advanceScan(scanned: string): void;
    advanceLines(lineCount: number): void;
    tryConsume(tokenType: TokenType): IToken | undefined;
    canConsume(tokenType: TokenType): string | undefined;
    emit(image: string, tokenType: TokenType): IToken;
}

export class PliPreprocessorLexerState implements PreprocessorLexerState {
    private readonly plainState: PlainPreprocessorLexerState;

    constructor(text: string, uri: URI) {
        this.plainState = initializePreprocessorState(text, uri);
    }

    currentChar(): number {
        return this.eof() ? -1 : this.plainState.text.charCodeAt(this.plainState.offset);
    }

    eof(): boolean {
        return Selectors.eof(this.plainState);
    }

    position(): number {
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
        const startOffset = Selectors.position(this.plainState);
        this.advanceScan(image);
        const endOffset = Selectors.position(this.plainState);
        // ATTENTION: mind the -1 for end offset, we do not want to consume the next tokens range!
        // Note that we don't need line/column information for our LSP implementation
        const token = createTokenInstance(tokenType, image, startOffset, endOffset - 1, NaN, NaN, NaN, NaN);
        token.payload = {
            uri: this.plainState.uri,
            kind: -1,
            element: null
        };
        return token;
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
        const { text, offset } = this.plainState;
        const newPosition = Mutators.advanceLines(offset, text, lineCount);
        Mutators.advanceCharacters(this.plainState, newPosition - offset);
    }

    advanceScan(scanned: string) {
        Mutators.advanceCharacters(this.plainState, scanned.length);
        // const offset = this.plainState.offset;
        // const { text: _, ...oldPosition } = this.plainState;
        // const newPosition = Mutators.countNewLinesWhile(oldPosition.offset, scanned, () => true);
        // Mutators.setPosition(this.plainState, newPosition);
    }
}

// PLAIN STATE

export type PreprocessorVariable = {
    scanMode: ScanMode;
    active: boolean;
    dataType: VariableDataType;
    value: number | string | undefined;
};

export type PreprocessorScan = {
    length: number;
    offset: number;
    text: string;
    uri: URI;
};

export type PlainPreprocessorLexerState = PreprocessorScan;

export const initializePreprocessorState: (text: string, uri: URI) => PlainPreprocessorLexerState = (text, uri) => {
    return {
        tokens: [],
        text,
        length: text.length,
        offset: 0,
        uri
    };
};

// SELECTORS

namespace Selectors {
    export function eof(state: PlainPreprocessorLexerState): boolean {
        return state.offset >= state.text.length;
    }
    export function position(state: PlainPreprocessorLexerState): number {
        return state.offset;
    }
}

// MUTATORS

namespace Mutators {
    export function advanceCharacters(state: PlainPreprocessorLexerState, length: number): void {
        state.offset += length;
    }

    const nl = '\n'.charCodeAt(0);
    export function advanceLines(offset: number, text: string, lineCount: number): number {
        while (true) {
            const char = text.charCodeAt(offset);
            if (char === nl) {
                lineCount--;
                if (lineCount <= 0) {
                    return offset + 1;
                }
            }
            if (isNaN(char)) {
                // Reached EOF
                return offset;
            }
            offset++;
        }
    }

    /** TODO: what is this supposed to do? */
    export function countNewLinesWhile(offset: number, text: string, whilePredicate: (currentPosition: number) => boolean): number {
        const NL = /\r?\n/y;
        for (;offset < text.length && whilePredicate(offset);) {
            NL.lastIndex = offset;
            const match = NL.exec(text);
            if (match) {
                offset += match[0].length;
            } else {
                offset++;
            }
        }
        return offset;
    }
}