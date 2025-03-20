/**
 * This file contains the abstract syntax tree for preprocessor statements and directives.
 */

import { IToken } from "chevrotain";
import { PreprocessorParserResult } from "./pli-preprocessor-parser";
import { ProgramAddressOrPlaceholder } from "./pli-preprocessor-instructions";

export interface PPAstNode {
    type: string;
}

export interface PPLabeledStatement extends PPAstNode {
    type: 'labeled',
    label: string;
    statement: PPStatement;
}

export interface PPGoTo extends PPAstNode {
    type: 'goto',
    label: string;
}

export interface PPPliStatement extends PPAstNode {
    type: 'pli';
    tokens: IToken[];
}

export interface PPDirective extends PPAstNode {
    type: 'directive';
    which: 'page'|'print'|'noprint'|'push'|'pop';
}

export interface PPDeclare extends PPAstNode {
    type: 'declare';
    declarations: PPDeclaration[];
}

export interface PPEmptyStatement extends PPAstNode {
    type: 'empty',
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

export interface PPInclude extends PPAstNode {
    type: 'include',
    subProgram: PreprocessorParserResult;
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
    operator:
      | '**'
      | '*' | '/'
      | '+' | '-'
      | '||'
      | '<' | '<=' | '>' | '>=' | '=' | '<>'
      | '&'
      | '|'
      ;
}

export interface PPUnaryExpression extends PPAstNode {
    type: 'unary',
    operand: PPExpression;
    operator: '+' | '-';
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

export interface PPDoWhileUntil extends PPAstNode {
    type: 'do-while-until',
    conditionWhile: PPExpression;
    conditionUntil?: PPExpression;
    body: PPStatement[];
}

export interface PPDoUntilWhile extends PPAstNode {
    type: 'do-until-while',
    conditionUntil: PPExpression;
    conditionWhile?: PPExpression;
    body: PPStatement[];
}

interface PPDoType3Base extends PPAstNode {
    conditionUntil?: PPExpression;
    conditionWhile?: PPExpression;
    body: PPStatement[];
    first: 'while' | 'until';
}

export interface PPDoFromToBy extends PPDoType3Base {
    type: 'do-from-to-by',
    fromValue: PPExpression;
    toValue: PPExpression;
    byValue: PPExpression;
}

export interface PPDoUpThru extends PPDoType3Base {
    type: 'do-up-thru',
    left: PPExpression;
    right: PPExpression;
}

export interface PPDoDownThru extends PPDoType3Base {
    type: 'do-down-thru',
    left: PPExpression;
    right: PPExpression;
}

export interface PPDoRepeat extends PPDoType3Base {
    type: 'do-repeat',
    repeat: PPExpression;
}

export interface PPDoForever extends PPAstNode {
    type: 'do-forever',
    body: PPStatement[];
}

export type AnyDoGroup = PPDoFromToBy | PPDoRepeat | PPDoDownThru | PPDoUpThru | PPDoGroup | PPDoWhileUntil | PPDoUntilWhile | PPDoForever;

export interface PPIterate extends PPAstNode {
    type: 'iterate',
    label: string|undefined;
}

export interface PPLeave extends PPAstNode {
    type: 'leave',
    label: string|undefined;
}

export type PPStatement =
  | PPLeave
  | PPIterate
  | PPPliStatement
  | PPEmptyStatement
  | PPActivate
  | PPDeactivate
  | PPDirective
  | PPSkip
  | PPDeclare
  | PPAssign
  | PPInclude
  | PPIfStatement
  | AnyDoGroup
  | PPLabeledStatement
  | PPGoTo
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