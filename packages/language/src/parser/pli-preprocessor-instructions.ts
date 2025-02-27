import { IToken } from "chevrotain";
import { ProcedureScope, ScanMode } from "./pli-preprocessor-ast";

export interface PPInstructionBase {
    type: string;
}

export interface PPActivate extends PPInstructionBase {
    type: 'activate';
    name: string;
    scanMode: ScanMode;
}

export interface PPDeactivate extends PPInstructionBase {
    type: 'deactivate';
    name: string;
}

export interface PPSet extends PPInstructionBase {
    type: 'set';
    name: string;
}

export interface PPHalt extends PPInstructionBase {
    type: 'halt';
}

export interface PPConcat extends PPInstructionBase {
    type: 'concat';
}

export interface PPScan extends PPInstructionBase {
    type: 'scan';
}

export interface PPPush extends PPInstructionBase {
    type: 'push';
    value: IToken[];
}

// export interface PPPop extends PPInstructionBase {
//     type: 'pop';
// }

export interface PPPrint extends PPInstructionBase {
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
  | PPScan
  | PPPrint
  | PPActivate
  | PPDeactivate
  | PPSet
  | PPPush
  | PPConcat
//   | PPCompute
  | PPHalt
//   | PPGoto
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