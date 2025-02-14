/**
 * This file contains the abstract syntax tree for preprocessor statements and directives.
 */

export interface PPAstNode {
    type: string;
}

export interface PPDeclareStatement extends PPAstNode {
    type: 'declareStatement';
    declarations: PPDeclaration[];
}

export interface PPAssignmentStatement extends PPAstNode {
    type: 'assignmentStatement';
    left: string;
    right: PPExpression;
}

export interface PPDirective extends PPAstNode {
    type: 'directive';
    which: 'page'|'print'|'noprint'|'push'|'pop';
}

export interface PPIncludeStatement extends PPAstNode {
    type: 'includeStatement';
    identifier: string;
}

export interface PPSkipStatement extends PPAstNode {
    type: 'skipStatement',
    lineCount: number;
}

export interface PPCharacterLiteral extends PPAstNode {
    type: 'characterLiteral';
    value: string;
}

export interface PPFixedLiteral extends PPAstNode {
    type: 'fixedLiteral';
    value: number;
}

export type PPStatement = PPDeclareStatement | PPAssignmentStatement | PPDirective | PPSkipStatement | PPIncludeStatement;

export type PPExpression = PPCharacterLiteral | PPFixedLiteral;

export type VariableDataType = 'fixed' | 'character';
;

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