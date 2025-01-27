export interface PPStatementBase {
    type: string;
}

export interface PPDeclareStatement extends PPStatementBase {
    type: 'declareStatement';
    declarations: PPDeclaration[];
}

export interface PPAssignmentStatement extends PPStatementBase {
    type: 'assignmentStatement';
    left: string;
    right: PPExpression;
}

export type PPStatement = PPDeclareStatement|PPAssignmentStatement;

export type PPStringLiteral = string;

export type PPExpression = PPStringLiteral;

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