import { ScanMode, VariableDataType } from "./pli-preprocessor-ast";

// STATE

export type PreprocessorVariable = Readonly<{
    scanMode: ScanMode;
    active: boolean;
    dataType: VariableDataType;
    value: number|string|undefined;
}>;

export type PreprocessorScan = Readonly<{
    text: string;
    index: number;
    line: number;
    column: number;
}>;

export type PreprocessorState = Readonly<{
    scanStack: PreprocessorScan[];
    variables: Readonly<Record<string, PreprocessorVariable>>;
}>;

export const InitialPreprocessorState: (text: string) => PreprocessorState = (text) => ({
    scanStack: [{
        column: 1,
        line: 1,
        index: 0,
        text
    }],
    variables: {}
});

// SELECTORS

export namespace Selectors {
    export function top(state: PreprocessorState): PreprocessorScan {
        return state.scanStack[state.scanStack.length-1];
    }
    export function eof(state: PreprocessorState): boolean {
        return state.scanStack.length === 0;
    }
    export function position(state: PreprocessorState): [number, number, number] {
        if(!eof(state)) {
            const { index, line, column } = top(state);
            return [index, line, column] as const;
        }
        return [0, 0, 0] as const;
    }
    export function hasVariable(state: PreprocessorState, name: string): boolean {
        return name in state.variables;
    }
    export function getVariable(state: PreprocessorState, name: string): PreprocessorVariable {
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
    value: number|string|undefined;
}

export interface PPActivateAction {
    type: "activate";
    name: string;
    active: boolean;
}

export interface PPAssignAction {
    type: "assign";
    name: string;
    value: number|string;
}

export interface PPReplaceVariableAction {
    type: "replaceVariable";
    text: string;
}

export type PreprocessorAction = PPDeclareAction | PPActivateAction | PPAssignAction | PPAdvanceScan | PPReplaceVariableAction | PPAdvanceLines;

//REDUCER
const NL = /\r?\n/y;
export function translatePreprocessorState(state: PreprocessorState, action: PreprocessorAction): PreprocessorState {
    switch(action.type) {
        case "declare": {
            const {type, name, ...remainder} = action;
            return {
                ...state,
                variables: {
                    ...state.variables,
                    [name]: {
                        active: true,
                        ...remainder
                    }
                }
            };
        }
        case "assign": {
            const { name, value } = action;
            if(state.variables[name]) {
                return {
                    ...state,
                    variables: {
                        ...state.variables,
                        [name]: {
                            ...state.variables[name],
                            value
                        }
                    }
                };
            } else {
                return {
                    ...state,
                    variables: {
                        ...state.variables,
                        [name]: {
                            dataType: typeof value === 'string' ? "character" : "fixed",
                            scanMode: "rescan",
                            value,
                            active: false,
                        }
                    }
                };
            }
        }
        case "activate": {
            const {name, active} = action;
            if(state.variables[name]) {
                return {
                    ...state,
                    variables: {
                        ...state.variables,
                        [name]: {
                            ...state.variables[name],
                            active
                        }
                    }
                };
            } else {
                return {
                    ...state,
                    variables: {
                        ...state.variables,
                        [name]: {
                            dataType: "character",
                            scanMode: "rescan",
                            value: "",
                            active
                        }
                    }
                };
            }
        }
        case "replaceVariable": {
            const { text } = action;
            return {
                ...state,
                scanStack: state.scanStack.slice().concat([{
                    text,
                    index: 0,
                    column: 1,
                    line: 1
                }])
            };
        }
        case "advanceScan": {
            if(Selectors.eof(state)) {
                return state;
            }
            const { scanned } = action;
            let { index, column, line, text } = Selectors.top(state);
            for (let charIndex = 0; charIndex < scanned.length;) {
                NL.lastIndex = charIndex;
                const match = NL.exec(scanned);
                if (match) {
                    index += match[0].length;
                    line++;
                    column = 1;
                    charIndex += match[0].length;
                } else {
                    charIndex++;
                    column++;
                    index++;
                }
            }
            const poppedOnce = state.scanStack.slice(0, state.scanStack.length - 1);
            if(index < text.length) {
                const newFrame: PreprocessorScan = { text, index, column, line };
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
        case 'advanceLines': {
            if(Selectors.eof(state)) {
                return state;
            }
            let { lineCount } = action;
            let { index, column, line, text } = Selectors.top(state);
            for(; !Selectors.eof(state) && lineCount > 0 && index < text.length; ) {
                NL.lastIndex = index;
                const match = NL.exec(text);
                if (match) {
                    index += match[0].length;
                    line++;
                    lineCount--;
                    column = 1;
                } else {
                    column++;
                    index++;
                }
            }
            const poppedOnce = state.scanStack.slice(0, state.scanStack.length - 1);
            if(index < text.length) {
                const newFrame: PreprocessorScan = { text, index, column, line };
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
        default: {
            return state;
        }
    }
}

