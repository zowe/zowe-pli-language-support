import { createTokenInstance, IToken, TokenType } from "chevrotain";
import { PPBinaryExpression, ProcedureScope, ScanMode } from "./pli-preprocessor-ast";
import { assertUnreachable } from "langium";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";
import { PreprocessorInterpreterState } from "./pli-preprocessor-interpreter-state";
import { PliPreprocessorProgram } from "./pli-preprocessor-generator";

export interface PPInstructionBase {
    type: string;
}

export interface PPICompute extends PPInstructionBase {
    type: 'compute',
    operator: PPBinaryExpression['operator'],
}

export interface PPIActivate extends PPInstructionBase {
    type: 'activate';
    name: string;
    scanMode: ScanMode | undefined;
}

export interface PPIDeactivate extends PPInstructionBase {
    type: 'deactivate';
    name: string;
}

export interface PPISet extends PPInstructionBase {
    type: 'set';
    name: string;
}

export interface PPIHalt extends PPInstructionBase {
    type: 'halt';
}

export interface PPIConcat extends PPInstructionBase {
    type: 'concat';
}

export interface PPIScan extends PPInstructionBase {
    type: 'scan';
}

export interface PPIPush extends PPInstructionBase {
    type: 'push';
    value: IToken[];
}

// export interface PPPop extends PPInstructionBase {
//     type: 'pop';
// }

export interface PPIPrint extends PPInstructionBase {
    type: 'print';
}

export interface PPIGoto extends PPInstructionBase {
    type: 'goto';
    address: number;
}

// export interface PPCompute extends PPInstructionBase {
//     //operation on FIXED
//     type: 'compute';
//     op: '+'|'-'|'*'|'/';
//     //TODO more?
// }

export interface PPIBranchIfNotEqual extends PPInstructionBase {
    type: 'branchIfNEQ',
    address: number;
}

export interface PPIGet extends PPInstructionBase {
    type: 'get',
    variableName: string;
}

export type PPInstruction =
    | PPIGet
    | PPICompute
    | PPIScan
    | PPIPrint
    | PPIActivate
    | PPIDeactivate
    | PPISet
    | PPIPush
    | PPIConcat
    | PPIBranchIfNotEqual
    | PPIGoto
    | PPIHalt
    ;

export type PPProgram = PPInstruction[];

export type VariableDataType = 'fixed' | 'character';

export type PPDeclaration = {
    name: string;
} & ({
    type: 'builtin' | 'entry';
} | {
    type: VariableDataType;
    scope: ProcedureScope;
    scanMode: ScanMode;
});

export namespace Values {
    export function Number(value: number): IToken[] {
        return [createTokenInstance(PreprocessorTokens.Number, value.toString(), 0, 0, 0, 0, 0, 0)];
    }
    export function True(): IToken[] {
        return Number(1);
    }
    export function False(): IToken[] {
        return Number(0);
    }
    export function sameType(lhs: TokenType, rhs: TokenType) {
        return lhs.name.toLocaleUpperCase() === rhs.name.toLocaleUpperCase();
    }
    export const add = numericArithmticOp((lhs, rhs) => lhs+rhs);
    export const subtract = numericArithmticOp((lhs, rhs) => lhs-rhs);
    export const multiply = numericArithmticOp((lhs, rhs) => lhs*rhs);
    export const divide = numericArithmticOp((lhs, rhs) => lhs/rhs);
    export const power = numericArithmticOp((lhs, rhs) => Math.pow(lhs, rhs));
    export const concat = (lhs: IToken[], rhs: IToken[]) => lhs.concat(rhs);
    export const lt = numericComparisonOp((lhs, rhs) => lhs < rhs);
    export const le = numericComparisonOp((lhs, rhs) => lhs <= rhs);
    export const gt = numericComparisonOp((lhs, rhs) => lhs > rhs);
    export const ge = numericComparisonOp((lhs, rhs) => lhs >= rhs);
    export const eq = numericComparisonOp((lhs, rhs) => lhs === rhs);
    export const neq = numericComparisonOp((lhs, rhs) => lhs !== rhs);
    export const and = numericArithmticOp((lhs, rhs) => lhs & rhs);
    export const or = numericArithmticOp((lhs, rhs) => lhs | rhs);

    function numericComparisonOp(op: (lhs: number, rhs: number) => boolean) {
        return function func(lhs: IToken[], rhs: IToken[]) {
            if(lhs.length !== 1 || !sameType(lhs[0].tokenType, PreprocessorTokens.Number)) {
                return [];
            }
            const left = parseFloat(lhs[0].image);
            if(rhs.length !== 1 || !sameType(rhs[0].tokenType, PreprocessorTokens.Number)) {
                return [];
            }
            const right = parseFloat(rhs[0].image);
            return op(left, right) ? Values.True() : Values.False();
        };
    }

    function numericArithmticOp(op: (lhs: number, rhs: number) => number) {
        return function func(lhs: IToken[], rhs: IToken[]) {
            if(lhs.length !== 1 || !sameType(lhs[0].tokenType, PreprocessorTokens.Number)) {
                return [];
            }
            const left = parseFloat(lhs[0].image);
            if(rhs.length !== 1 || !sameType(rhs[0].tokenType, PreprocessorTokens.Number)) {
                return [];
            }
            const right = parseFloat(rhs[0].image);
            return Number(op(left, right));
        };
    }
}

export namespace Instructions {
    export function compute(operator: PPBinaryExpression['operator']): PPICompute {
        return {
            type: "compute",
            operator
        };
    }
    export function get(variableName: string): PPIGet {
        return {
            type: "get",
            variableName
        };
    }
    export function scan(): PPIScan {
        return {
            type: "scan"
        };
    }
    export function print(): PPIPrint {
        return {
            type: "print"
        };
    }
    export function activate(name: string, scanMode?: ScanMode): PPIActivate {
        return {
            type: 'activate',
            name,
            scanMode,
        };
    }
    export function deactivate(name: string): PPIDeactivate {
        return {
            type: "deactivate",
            name,
        };
    }
    export function set(name: string): PPISet {
        return {
            type: 'set',
            name
        };
    }
    export function concat(): PPIConcat {
        return {
            type: "concat"
        };
    }
    export function push(value: IToken[]): PPIPush {
        return {
            type: "push",
            value
        };
    }
    export function halt(): PPIHalt {
        return {
            type: "halt",
        };
    }
    export function branchIfNotEqual(address: number): PPIBranchIfNotEqual {
        return {
            type: "branchIfNEQ",
            address
        };
    }
    export function goto(address: number): PPIGoto {
        return {
            type: "goto",
            address
        };
    }
}

export function printProgram(program: PliPreprocessorProgram) {
    const programText: string[] = [];
    program.instructions.forEach((instruction, index) => {
        programText.push(index.toString().padStart(4, ' ')+': ');
        programText.push(instruction.type.toUpperCase());
        switch (instruction.type) {
            case 'activate':
                programText.push(...' ', instruction.name);
                if (instruction.scanMode) {
                    programText.push(...' ', instruction.scanMode.toUpperCase());
                }
                break;
            case 'deactivate':
                programText.push(...' ', instruction.name);
                break;
            case 'concat':
            case 'scan':
            case 'print':
            case 'halt':
                //nothing to print
                break;
            case 'set':
                programText.push(...' ', instruction.name);
                break;
            case 'push':
                programText.push(...' ', '[', instruction.value.map(tk => tk.image + ':' + tk.tokenType.name).join(', '), ']');
                break;
            case 'goto':
            case 'branchIfNEQ':
                programText.push(...' ', '@', instruction.address.toString());
                break;
            case 'get':
                programText.push(...' ', instruction.variableName);
                break;
            case 'compute':
                programText.push(...' ', instruction.operator);
                break;
            default:
                assertUnreachable(instruction);
        }
        programText.push('\n');
    });
    console.log(programText.join(""));
}

export function printInstruction(instruction: PPInstruction, state: PreprocessorInterpreterState) {
    const programText: string[] = [];
    programText.push(instruction.type.toUpperCase());
    switch (instruction.type) {
        case 'activate':
            programText.push(...' ', instruction.name);
            if (instruction.scanMode) {
                programText.push(...' ', instruction.scanMode.toUpperCase());
            }
            break;
        case 'deactivate':
            programText.push(...' ', instruction.name);
            break;
        case 'concat':
        case 'scan':
        case 'print':
        case 'halt':
            //nothing to print
            break;
        case 'set':
            programText.push(...' ', instruction.name);
            break;
        case 'push':
            programText.push(...' ', '[', instruction.value.map(tk => tk.image + ':' + tk.tokenType.name).join(', '), ']');
            break;
        case 'goto':
        case 'branchIfNEQ':
            programText.push(...' ', '@', instruction.address.toString());
            break;
        case 'get':
            programText.push(...' ', instruction.variableName);
            break;
        case 'compute':
            programText.push(...' ', instruction.operator);
            break;
        default:
            assertUnreachable(instruction);
    }
    programText.push('\n');
    return programText.join("");
}