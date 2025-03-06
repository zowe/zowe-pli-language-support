import { createTokenInstance, IToken } from "chevrotain";
import { ProcedureScope, ScanMode } from "./pli-preprocessor-ast";
import { assertUnreachable } from "langium";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";

export interface PPInstructionBase {
    type: string;
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

export type PPInstruction =
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
}

export namespace Instructions {
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

export function printProgram(program: PPInstruction[]) {
    const programText: string[] = [];
    program.forEach((instruction, index) => {
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
            default:
                assertUnreachable(instruction);
        }
        programText.push('\n');
    });
    console.log(programText.join(""));
}