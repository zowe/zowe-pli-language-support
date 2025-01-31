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

export interface PPCharacterLiteral extends PPAstNode {
    type: 'characterLiteral';
    value: string;
}

export interface PPFixedLiteral extends PPAstNode {
    type: 'fixedLiteral';
    value: number;
}

export type PPStatement = PPDeclareStatement|PPAssignmentStatement;

export type PPExpression = PPCharacterLiteral | PPFixedLiteral;

export type PPDeclaration = {
    name: string;
} & ({
    type: 'builtin' | 'entry';
} | {
    type: 'fixed' | 'character';
    scope: ProcedureScope;
    scanMode: ScanMode;
})

export type ScanMode = 'noscan' | 'rescan' | 'scan';
export type ProcedureScope = 'internal' | 'external';
export type VariableType = 'builtin' | 'entry' | 'fixed' | 'character';