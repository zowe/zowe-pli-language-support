import { createTokenInstance, IToken, TokenType } from "chevrotain";
import { ScanMode, VariableDataType } from "./pli-preprocessor-ast";

export interface PreprocessorLexerState {
    top(): PreprocessorScan | undefined;
    eof(): boolean;
    position(): TextPosition;
    advanceScan(scanned: string): void;
    advanceLines(lineCount: number): void;
    tryConsume(tokenType: TokenType): IToken | undefined;
    canConsume(tokenType: TokenType): string | undefined;
    emit(image: string, tokenType: TokenType): IToken;
    
    activate(name: string, active: boolean): void;
    hasVariable(name: string): boolean;
    getVariable(name: string): PreprocessorVariable;
    assign(name: string, value: number | string): void;
    declare(name: string, variable: PreprocessorVariable): void;
    replaceVariable(text: string): void;
}

export class PliPreprocessorLexerState implements PreprocessorLexerState {
    private plainState: PlainPreprocessorLexerState;

    constructor(text: string) {
        this.plainState = initializePreprocessorState(text);
    }

    top(): PreprocessorScan | undefined {
        return Selectors.top(this.plainState);
    }

    eof(): boolean {
        return Selectors.eof(this.plainState);
    }

    position(): TextPosition {
        return Selectors.position(this.plainState);
    }

    hasVariable(name: string): boolean {
        return Selectors.hasVariable(this.plainState, name);
    }

    getVariable(name: string): PreprocessorVariable {
        return Selectors.getVariable(this.plainState, name);
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
        const { offset: index, text } = Selectors.top(this.plainState)!;
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

    activate(name: string, active: boolean) {
        if (Selectors.hasVariable(this.plainState, name)) {
            const variable = Selectors.getVariable(this.plainState, name);
            this.plainState = Mutators.assignVariable(this.plainState, name, {
                ...variable,
                active
            });
        } else {
            this.plainState = Mutators.assignVariable(this.plainState, name, {
                dataType: "character",
                scanMode: "rescan",
                value: "",
                active
            });
        }
    }

    advanceLines(lineCount: number) {
        if (Selectors.eof(this.plainState)) {
            return;
        }
        const { text, ...oldPosition } = Selectors.top(this.plainState)!;
        const newPosition = Mutators.countNewLinesWhile(oldPosition, text, oldPosition.offset, (newPosition) => newPosition.line - oldPosition.line < lineCount)
        this.plainState = Mutators.alterTopOrPop(this.plainState, newPosition);
    }

    advanceScan(scanned: string) {
        if (Selectors.eof(this.plainState)) {
            return;
        }
        const { text: _, ...oldPosition } = Selectors.top(this.plainState)!;
        const newPosition = Mutators.countNewLinesWhile(oldPosition, scanned, 0, () => true);
        this.plainState = Mutators.alterTopOrPop(this.plainState, newPosition);
    }

    assign(name: string, value: number | string) {
        if (Selectors.hasVariable(this.plainState, name)) {
            const variable = Selectors.getVariable(this.plainState, name);
            this.plainState = Mutators.assignVariable(this.plainState, name, {
                ...variable,
                value
            });
        } else {
            this.plainState = Mutators.assignVariable(this.plainState, name, {
                dataType: typeof value === 'string' ? "character" : "fixed",
                scanMode: "rescan",
                value,
                active: false,
            });
        }
    }

    declare(name: string, variable: PreprocessorVariable) {
        this.plainState = Mutators.assignVariable(this.plainState, name, variable);
    }

    replaceVariable(text: string) {
        this.plainState = Mutators.push(this.plainState, text);
    }
}

// PLAIN STATE

export type TextPosition = {
    offset: number;
    line: number;
    column: number;
};

export type PreprocessorVariable = Readonly<{
    scanMode: ScanMode;
    active: boolean;
    dataType: VariableDataType;
    value: number | string | undefined;
}>;

export type PreprocessorScan = Readonly<{
    text: string;
    offset: number;
    line: number;
    column: number;
}>;

export type PlainPreprocessorLexerState = Readonly<{
    scanStack: PreprocessorScan[];
    variables: Readonly<Record<string, PreprocessorVariable>>;
}>;

export const initializePreprocessorState: (text: string) => PlainPreprocessorLexerState = (text) => ({
    scanStack: text.length === 0 ? [] : [{
        column: 1,
        line: 1,
        offset: 0,
        text
    }],
    variables: {}
});

// SELECTORS

namespace Selectors {
    export function top(state: PlainPreprocessorLexerState): PreprocessorScan | undefined {
        if (eof(state)) {
            return undefined;
        }
        return state.scanStack[state.scanStack.length - 1];
    }
    export function eof(state: PlainPreprocessorLexerState): boolean {
        return state.scanStack.length === 0;
    }
    export function position(state: PlainPreprocessorLexerState): TextPosition {
        if (!eof(state)) {
            const { offset: index, line, column } = top(state)!;
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
    export function hasVariable(state: PlainPreprocessorLexerState, name: string): boolean {
        return name in state.variables;
    }
    export function getVariable(state: PlainPreprocessorLexerState, name: string): PreprocessorVariable {
        return state.variables[name]!;
    }
}

// MUTATORS

namespace Mutators {
    export function assignVariable(state: PlainPreprocessorLexerState, name: string, variable: PreprocessorVariable) {
        return {
            ...state,
            variables: {
                ...state.variables,
                [name]: variable
            }
        };
    }
    export function push(state: PlainPreprocessorLexerState, text: string) {
        return {
            ...state,
            scanStack: state.scanStack.slice().concat(text.length > 0 ? [{
                text,
                offset: 0,
                column: 0,
                line: 0
            }] : [])
        };
    }
    export function alterTopOrPop(state: PlainPreprocessorLexerState, newPosition: TextPosition) {
        if (Selectors.eof(state)) {
            return state;
        }
        const { text } = Selectors.top(state)!;
        const poppedOnce = state.scanStack.slice(0, state.scanStack.length - 1);
        if (newPosition.offset < text.length) {
            const newFrame: PreprocessorScan = { text, ...newPosition };
            return {
                ...state,
                scanStack: poppedOnce.concat([newFrame])
            };
        } else {
            return {
                ...state,
                scanStack: poppedOnce
            };
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