import { IToken } from "chevrotain";
import { ProcedureScope, ScanMode } from "./pli-preprocessor-ast";

export interface PPInstructionBase {
    type: string;
}

export interface PPIActivate extends PPInstructionBase {
    type: 'activate';
    name: string;
    scanMode: ScanMode|undefined;
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

// export interface PPGoto extends PPInstructionBase {
//     type: 'goto';
//     newCounter: number;
// }

// export interface PPCompute extends PPInstructionBase {
//     //operation on FIXED
//     type: 'compute';
//     op: '+'|'-'|'*'|'/';
//     //TODO more?
// }

export type PPInstruction =
  | PPIScan
  | PPIPrint
  | PPIActivate
  | PPIDeactivate
  | PPISet
  | PPIPush
  | PPIConcat
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
}