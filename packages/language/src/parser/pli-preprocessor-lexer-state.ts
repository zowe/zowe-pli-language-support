import { createTokenInstance, IToken, TokenType } from "chevrotain";
import { ScanMode, VariableDataType } from "./pli-preprocessor-ast";


export class PreprocessorLexerState {
    private plainState: PlainPreprocessorLexerState;

    constructor(text: string) {
        this.plainState = initializePreprocessorState(text);
    }

    top(): PreprocessorScan {
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
        this.applyAction({
            type: "advanceScan",
            scanned: image
        });
        const { offset: endOffset, line: endLine, column: endColumn } = Selectors.position(this.plainState);
        //ATTENTION: mind the -1 for end offset and end column, we do not want to consume the next tokens range!
        return createTokenInstance(tokenType, image, startOffset, endOffset - 1, startLine, endLine, startColumn, endColumn - 1);
    }

    canConsume(tokenType: TokenType): string | undefined {
        if (Selectors.eof(this.plainState)) {
            return undefined;
        }
        const { offset: index, text } = Selectors.top(this.plainState);
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
                            const alternative = this.canConsume(a);
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

    applyAction(action: PreprocessorAction) {
        this.plainState = translatePreprocessorState(this.plainState, action);
    }
}

// STATE

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
    export function top(state: PlainPreprocessorLexerState): PreprocessorScan {
        return state.scanStack[state.scanStack.length - 1];
    }
    export function eof(state: PlainPreprocessorLexerState): boolean {
        return state.scanStack.length === 0;
    }
    export function position(state: PlainPreprocessorLexerState): TextPosition {
        if (!eof(state)) {
            const { offset: index, line, column } = top(state);
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

// ACTIONS

export interface PPAdvanceScan {
    type: "advanceScan",
    scanned: string;
}

export interface PPAdvanceLines {
    type: "advanceLines",
    lineCount: number;
}

export interface PPDeclareAction {
    type: "declare";
    name: string;
    scanMode: ScanMode;
    dataType: VariableDataType;
    value: number | string | undefined;
}

export interface PPActivateAction {
    type: "activate";
    name: string;
    active: boolean;
}

export interface PPAssignAction {
    type: "assign";
    name: string;
    value: number | string;
}

export interface PPReplaceVariableAction {
    type: "replaceVariable";
    text: string;
}

export type PreprocessorAction = PPDeclareAction | PPActivateAction | PPAssignAction | PPAdvanceScan | PPReplaceVariableAction | PPAdvanceLines;
export type PreprocessorActionType = PreprocessorAction['type'];

//REDUCER

type TranslateActions = {
    [actionType in PreprocessorActionType]: (state: PlainPreprocessorLexerState, action: Extract<PreprocessorAction, { type: actionType }>) => PlainPreprocessorLexerState;
};
const TranslateActions: TranslateActions = {
    activate: (state, action) => {
        const { name, active } = action;
        if (Selectors.hasVariable(state, name)) {
            const variable = Selectors.getVariable(state, name);
            return Mutators.assignVariable(state, name, {
                ...variable,
                active
            });
        } else {
            return Mutators.assignVariable(state, name, {
                dataType: "character",
                scanMode: "rescan",
                value: "",
                active
            });
        }
    },

    advanceLines: (state, action) => {
        if (Selectors.eof(state)) {
            return state;
        }
        const { lineCount } = action;
        const { text, ...oldPosition } = Selectors.top(state);
        const newPosition = Mutators.countNewLinesWhile(oldPosition, text, oldPosition.offset, (newPosition) => newPosition.line - oldPosition.line < lineCount)
        return Mutators.alterTopOrPop(state, newPosition);
    },

    advanceScan: (state, action) => {
        if (Selectors.eof(state)) {
            return state;
        }
        const { scanned } = action;
        const { text: _, ...oldPosition } = Selectors.top(state);
        const newPosition = Mutators.countNewLinesWhile(oldPosition, scanned, 0, () => true);
        return Mutators.alterTopOrPop(state, newPosition);
    },

    assign: (state, action) => {
        const { name, value } = action;
        if (Selectors.hasVariable(state, name)) {
            const variable = Selectors.getVariable(state, name);
            return Mutators.assignVariable(state, name, {
                ...variable,
                value
            });
        } else {
            return Mutators.assignVariable(state, name, {
                dataType: typeof value === 'string' ? "character" : "fixed",
                scanMode: "rescan",
                value,
                active: false,
            });
        }
    },

    declare: (state, action) => {
        const { type, name, ...remainder } = action;
        return Mutators.assignVariable(state, name, { ...remainder, active: true });
    },

    replaceVariable: (state, action) => {
        const { text } = action;
        return Mutators.push(state, text);
    }
};


export function translatePreprocessorState(state: PlainPreprocessorLexerState, action: PreprocessorAction): PlainPreprocessorLexerState {
    return TranslateActions[action.type](state, action as any);
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
        const { text } = Selectors.top(state);
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