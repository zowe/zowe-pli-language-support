/**
 * This file contains the abstract syntax tree for preprocessor statements and directives.
 */

import { IToken } from "chevrotain";

export interface PPAstNode {
    type: string;
}

export interface PPPliStatement extends PPAstNode {
    type: 'pli';
    tokens: IToken[];
}

export interface PPDirective extends PPAstNode {
    type: 'directive';
    which: 'page'|'print'|'noprint'|'push'|'pop';
}

// export interface PPIncludeStatement extends PPAstNode {
//     type: 'includeStatement';
//     identifier: string;
// }

export interface PPDeclare extends PPAstNode {
    type: 'declare';
    declarations: PPDeclaration[];
}
export interface PPSkip extends PPAstNode {
    type: 'skip',
    lineCount: number;
}

export interface PPAssign extends PPAstNode {
    type: 'assign',
    name: string;
    value: PPExpression;
}

export interface PPString extends PPAstNode {
    type: 'string',
    value: IToken[];
}

export interface PPNumber extends PPAstNode {
    type: 'number',
    value: number;
}

export interface PPVariableUsage extends PPAstNode {
    type: 'variable-usage',
    variableName: string;
}

export interface PPBinaryExpression extends PPAstNode {
    type: 'binary',
    lhs: PPExpression;
    rhs: PPExpression;
    operator: '+'|'-';
}

export type PPExpression = PPString | PPNumber | PPBinaryExpression | PPVariableUsage;

export interface PPActivate extends PPAstNode {
    type: 'activate';
    variables: Record<string, ScanMode|undefined>;
}

export interface PPDeactivate extends PPAstNode {
    type: 'deactivate';
    variables: string[];
}

export interface PPIfStatement extends PPAstNode {
    type: "if",
    condition: PPExpression;
    thenUnit: PPStatement;
    elseUnit?: PPStatement;
}

export interface PPDoGroup extends PPAstNode {
    type: "do",
    statements: PPStatement[];
}

export type PPStatement =
  | PPPliStatement
  | PPActivate
  | PPDeactivate
  | PPDirective
  | PPSkip
  | PPDeclare
  | PPAssign
  | PPIfStatement
  | PPDoGroup
  ;

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

export type ScanMode = 'noscan' | 'rescan' | 'scan';
export type ProcedureScope = 'internal' | 'external';
export type VariableType = 'builtin' | 'entry' | VariableDataType;