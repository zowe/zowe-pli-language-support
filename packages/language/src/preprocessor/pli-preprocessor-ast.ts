/**
 * This file contains the abstract syntax tree for preprocessor statements and directives.
 */

import { IToken } from "chevrotain";
import { PreprocessorParserResult } from "./pli-preprocessor-parser";

export interface PPAstNode {
  type: string;
}

export interface PPLabeledStatement extends PPAstNode {
  type: "labeled";
  label: string;
  statement: PPStatement;
}

export interface PPGoTo extends PPAstNode {
  type: "goto";
  label: string;
}

export interface PPPliStatement extends PPAstNode {
  type: "pli";
  tokens: IToken[];
}

export interface PPDirective extends PPAstNode {
  type: "directive";
  which: "page" | "print" | "noprint" | "push" | "pop";
}

export type AnyDeclare = PPDeclareType1;

export interface PPDeclareType1 extends PPAstNode {
  type: "declare";
  declarations: PPDeclaration[];
}

export interface PPEmptyStatement extends PPAstNode {
  type: "empty";
}

export interface PPSkip extends PPAstNode {
  type: "skip";
  lineCount: number;
}

export interface PPAssign extends PPAstNode {
  type: "assign";
  name: string;
  value: PPExpression;
}

export interface PPInclude extends PPAstNode {
  type: "include";
  subProgram: PreprocessorParserResult;
}

export interface PPString extends PPAstNode {
  type: "string";
  value: IToken[];
}

export interface PPNumber extends PPAstNode {
  type: "number";
  value: number;
}

export interface PPVariableUsage extends PPAstNode {
  type: "variable-usage";
  variableName: string;
}

export interface PPBinaryExpression extends PPAstNode {
  type: "binary";
  lhs: PPExpression;
  rhs: PPExpression;
  operator:
    | "**"
    | "*"
    | "/"
    | "+"
    | "-"
    | "||"
    | "<"
    | "<="
    | ">"
    | ">="
    | "="
    | "<>"
    | "&"
    | "|";
}

export interface PPUnaryExpression extends PPAstNode {
  type: "unary";
  operand: PPExpression;
  operator: "+" | "-";
}

export type PPExpression =
  | PPString
  | PPNumber
  | PPBinaryExpression
  | PPVariableUsage;

export interface PPActivate extends PPAstNode {
  type: "activate";
  variables: Record<string, ScanMode | undefined>;
}

export interface PPDeactivate extends PPAstNode {
  type: "deactivate";
  variables: string[];
}

export interface PPIfStatement extends PPAstNode {
  type: "if";
  condition: PPExpression;
  thenUnit: PPStatement;
  elseUnit?: PPStatement;
}

export interface PPReturn extends PPAstNode {
  type: "return";
  value: PPExpression;
}

export interface PPDoGroup extends PPAstNode {
  type: "do";
  statements: PPStatement[];
}

export interface PPDoWhileUntil extends PPAstNode {
  type: "do-while-until";
  conditionWhile: PPExpression;
  conditionUntil?: PPExpression;
  body: PPStatement[];
}

export interface PPDoUntilWhile extends PPAstNode {
  type: "do-until-while";
  conditionUntil: PPExpression;
  conditionWhile?: PPExpression;
  body: PPStatement[];
}

interface PPDoType3Base extends PPAstNode {
  conditionUntil?: PPExpression;
  conditionWhile?: PPExpression;
  body: PPStatement[];
  first: "while" | "until";
}

export interface PPDoFromToBy extends PPDoType3Base {
  type: "do-from-to-by";
  fromValue: PPExpression;
  toValue: PPExpression;
  byValue: PPExpression;
}

export interface PPDoUpThru extends PPDoType3Base {
  type: "do-up-thru";
  left: PPExpression;
  right: PPExpression;
}

export interface PPDoDownThru extends PPDoType3Base {
  type: "do-down-thru";
  left: PPExpression;
  right: PPExpression;
}

export interface PPDoRepeat extends PPDoType3Base {
  type: "do-repeat";
  repeat: PPExpression;
}

export interface PPDoForever extends PPAstNode {
  type: "do-forever";
  body: PPStatement[];
}

export interface PPProcedure {
  type: "procedure";
  parameters: string[];
  isStatement: boolean;
  returnType: VariableDataType | undefined;
  body: PPStatement[];
}

export type AnyDoGroup =
  //TODO implement type 3 DO statements
  // | PPDoFromToBy
  // | PPDoRepeat
  // | PPDoDownThru
  // | PPDoUpThru
  PPDoGroup | PPDoWhileUntil | PPDoUntilWhile | PPDoForever;

export interface PPIterate extends PPAstNode {
  type: "iterate";
  label: string | undefined;
}

export interface PPLeave extends PPAstNode {
  type: "leave";
  label: string | undefined;
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
  | PPAssign
  | PPInclude
  | PPIfStatement
  | AnyDeclare
  | AnyDoGroup
  | PPLabeledStatement
  | PPGoTo
  | PPProcedure
  | PPReturn;

export type VariableDataType = "fixed" | "character";

export type PPDeclaration = {
  names: NameAndBounds[];
  attributes: Attributes;
};

export interface Attributes {
  scanMode: ScanMode;
  scope: ProcedureScope;
  type: VariableType;
}

export type ScanMode = "noscan" | "rescan" | "scan";
export type ProcedureScope = "internal" | "external";
export type ProcedureType = "builtin" | "entry";
export type VariableType = ProcedureType | VariableDataType;

export type Dimensions = UnboundedDimensions | BoundedDimensions;

export interface NameAndBounds {
  name: string;
  dimensions?: Dimensions;
}

export interface UnboundedDimensions {
  type: "unbounded-dimensions";
  count: number;
}

export interface BoundedDimensions {
  type: "bounded-dimensions";
  dimensions: DimensionBounds[];
}

export interface DimensionBounds {
  lowerBound?: PPExpression;
  upperBound: PPExpression;
}
