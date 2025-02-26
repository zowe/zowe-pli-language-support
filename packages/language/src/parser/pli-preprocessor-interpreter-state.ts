import { createTokenInstance, IToken, TokenType } from "chevrotain";
import { ScanMode, VariableDataType } from "./pli-preprocessor-ast";
import { PPInstruction } from "./pli-preprocessor-instructions";

export interface PreprocessorInterpreterState {
    currentInstruction: PPInstruction;
    halt: boolean;
    getOutput(): IToken[];
    goTo(next: (previousCounter: number) => number): void;
    activate(name: string, scanMode: ScanMode): void;
    deactivate(name: string): void;
    hasVariable(name: string): boolean;
    getVariable(name: string): PreprocessorVariable;
    assign(name: string, value: IToken[]): void;
    declare(name: string, variable: PreprocessorVariable): void;
    step(): void;
}

export class PliPreprocessorInterpreterState implements PreprocessorInterpreterState {
    private plainState: PlainPreprocessorInterpreterState;
    private idTokenType: TokenType;

    constructor(program: PPInstruction[], idTokenType: TokenType) {
        this.plainState = initializeInterpreterState(program);
        this.idTokenType = idTokenType;
    }

    getOutput(): IToken[] {
        return this.plainState.output;
    }

    goTo(next: (previousCounter: number) => number): void {
        const newCounter = next(this.plainState.programCounter);
        if (newCounter >= 0 && newCounter < this.plainState.program.length) {
            this.plainState = { ...this.plainState, programCounter: newCounter };
        }
    }

    get halt() {
        return this.currentInstruction.type === 'halt';
    }

    get currentInstruction() {
        return this.plainState.program[this.plainState.programCounter];
    }

    hasVariable(name: string): boolean {
        return Selectors.hasVariable(this.plainState, name);
    }

    getVariable(name: string): PreprocessorVariable {
        return Selectors.getVariable(this.plainState, name);
    }

    activate(name: string, scanMode: ScanMode = "rescan") {
        if (Selectors.hasVariable(this.plainState, name)) {
            const variable = Selectors.getVariable(this.plainState, name);
            Mutators.assignVariable(this.plainState, name, {
                ...variable,
                scanMode,
                active: true
            });
        } else {
            Mutators.assignVariable(this.plainState, name, {
                dataType: "character",
                scanMode,
                value: [],
                active: true
            });
        }
    }

    deactivate(name: string) {
        if (Selectors.hasVariable(this.plainState, name)) {
            const variable = Selectors.getVariable(this.plainState, name);
            Mutators.assignVariable(this.plainState, name, {
                ...variable,
                active: false
            });
        } else {
            Mutators.assignVariable(this.plainState, name, {
                dataType: "character",
                scanMode: "rescan",
                value: [],
                active: false
            });
        }
    }

    assign(name: string, value: IToken[]) {
        if (Selectors.hasVariable(this.plainState, name)) {
            const variable = Selectors.getVariable(this.plainState, name);
            Mutators.assignVariable(this.plainState, name, {
                ...variable,
                value
            });
        } else {
            Mutators.assignVariable(this.plainState, name, {
                dataType: typeof value === 'string' ? "character" : "fixed",
                scanMode: "rescan",
                value,
                active: false,
            });
        }
    }

    declare(name: string, variable: PreprocessorVariable) {
        Mutators.assignVariable(this.plainState, name, variable);
    }

    private isIdentifier(token: IToken) {
        return token.tokenType.name === "ID" || (token.tokenType.CATEGORIES && token.tokenType.CATEGORIES.findIndex(t => t.name === "ID") > -1);
    }

    step() {
        const instruction = this.currentInstruction;
        switch (instruction.type) {
            case 'set': {
                if(this.plainState.stack.length > 0) {
                    const tokens = this.plainState.stack.pop()!;
                    //TODO check type of variable and content of tokens?
                    if(!this.hasVariable(instruction.name)) {
                        this.plainState.variables[instruction.name] = {
                            active: false,
                            dataType: "character",
                            scanMode: "rescan",
                            value: [],
                        };
                    }
                    this.plainState.variables[instruction.name].value = tokens;
                }
                this.goTo(prev => prev + 1);
                break;
            }
            case 'push': {
                this.plainState.stack.push(instruction.tokens);
                this.goTo(prev => prev + 1);
                break;
            }
            case 'scan': {
                const tokens = this.plainState.stack.pop()!;
                this.plainState.stack.push(this.scan(tokens));
                this.goTo(prev => prev + 1);
                break;
            }
            case 'concat': {
                const rhs = this.plainState.stack.pop()!;
                const lhs = this.plainState.stack.pop()!;
                this.plainState.stack.push(this.concat(lhs, rhs));
                this.goTo(prev => prev + 1);
                break;
            }
            case "print": {
                if(this.plainState.stack.length > 0) {
                    const tokens = this.plainState.stack.pop()!;
                    this.plainState.output.push(...tokens);
                } //TODO else error?
                this.goTo(prev => prev + 1);
                break;
            }
        }
    }
    private concat(lhs: IToken[], rhs: IToken[]): IToken[] {
        if(lhs.length === 0) {
            return rhs;
        } else if(rhs.length === 0) {
            return lhs;
        } else {
            const last = lhs[lhs.length-1];
            const first = rhs[0];
            if(this.isIdentifier(last) && this.isIdentifier(first)) {
                const part1 = lhs.slice(0, lhs.length-1);
                const part2 = [createTokenInstance(this.idTokenType, last.image+first.image, 0,0,0,0,0,0)];
                const part3 = rhs.slice(1);
                return part1.concat(part2).concat(part3);
            } else {
                return lhs.concat(rhs);
            }
        }
    }
    private scan(tokens: IToken[]) {
        return tokens.flatMap(tk => {
            if (this.isIdentifier(tk) && this.hasVariable(tk.image)) {
                const variable = this.getVariable(tk.image);
                return variable.value;
            }
            return [tk];
        });
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
    value: IToken[];
};

export type PreprocessorScan = Readonly<{
    text: string;
    offset: number;
    line: number;
    column: number;
}>;

export type PlainPreprocessorInterpreterState = {
    program: PPInstruction[];
    stack: IToken[][];
    output: IToken[];
    programCounter: number,
    variables: Record<string, PreprocessorVariable>;
};

export const initializeInterpreterState: (program: PPInstruction[]) => PlainPreprocessorInterpreterState = (program) => ({
    program,
    stack: [],
    output: [],
    programCounter: 0,
    variables: {}
});

// SELECTORS

namespace Selectors {
    export function hasVariable(state: PlainPreprocessorInterpreterState, name: string): boolean {
        return name in state.variables;
    }
    export function getVariable(state: PlainPreprocessorInterpreterState, name: string): PreprocessorVariable {
        return state.variables[name]!;
    }
}

// MUTATORS

namespace Mutators {
    export function assignVariable(state: PlainPreprocessorInterpreterState, name: string, variable: PreprocessorVariable) {
        state.variables[name] = variable;
    }
}