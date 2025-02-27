/**
 * This file contains the abstract syntax tree for preprocessor statements and directives.
 */

export interface PPAstNode {
    type: string;
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
    value: string;
}

export interface PPNumber extends PPAstNode {
    type: 'number',
    value: number;
}

export type PPExpression = PPString | PPNumber;

// export interface PPCharacterLiteral extends PPAstNode {
//     type: 'characterLiteral';
//     value: string;
// }

// export interface PPFixedLiteral extends PPAstNode {
//     type: 'fixedLiteral';
//     value: number;
// }

// export interface PPLabeledStatement extends PPAstNode {
//     type: 'labeledStatement';
//     name: string;
//     statement: PPStatement;
// }

export interface PPActivate extends PPAstNode {
    type: 'activate';
    variables: Record<string, ScanMode|undefined>;
}

export interface PPDeactivate extends PPAstNode {
    type: 'deactivate';
    variables: string[];
}

export type PPStatement =
  | PPActivate
  | PPDeactivate
  | PPDirective
  | PPSkip
  | PPDeclare
  | PPAssign
//  | PPIncludeStatement
//  | PPLabeledStatement
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