/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

import { Token } from "../parser/tokens";
import * as ast from "../syntax-tree/ast";
import { ScanMode } from "../syntax-tree/ast";

export interface InstructionNode {
  labels: string[];
  instruction: Instruction;
  next?: InstructionNode;
}

export class LinkedInstructionList {
  private _head?: InstructionNode;
  private _last?: InstructionNode;

  get head(): InstructionNode | undefined {
    return this._head;
  }

  get last(): InstructionNode | undefined {
    return this._last;
  }

  public append(newNode: InstructionNode): void {
    if (!this._head) {
      this._head = newNode;
      this._last = newNode;
    } else {
      this._last!.next = newNode;
      this._last = newNode;
    }
  }
}

export function getLastInstruction(node: InstructionNode): InstructionNode {
  const set = new Set<InstructionNode>();
  let current = node;
  while (current.next) {
    if (set.has(current.next)) {
      throw new Error("Circular reference detected in instruction nodes.");
    }
    set.add(current);
    current = current.next;
  }
  return current;
}

export interface CompoundInstruction {
  kind: InstructionKind.Compound;
  instructions: Instruction[];
}

export function createCompoundInstruction(
  instructions: Instruction[],
): CompoundInstruction {
  return {
    kind: InstructionKind.Compound,
    instructions,
  };
}

export enum InstructionKind {
  Halt,
  Compound,
  Tokens,
  Select,
  Do,
  Declare,
  Assignment,
  Activate,
  Answer,
  Call,
  Deactivate,
  Include,
  Inscan,
  Goto,
  Note,

  // Expression types
  BinaryExpression,
  UnaryExpression,
  Number,
  String,
  ReferenceItem,
  Repetition,
  MultipleExpression,
  Wildcard,
}

export type Instruction =
  | CompoundInstruction
  | HaltInstruction
  | SelectInstruction
  | TokensInstruction
  | AssignmentInstruction
  | AnswerInstruction
  | DoInstruction
  | GotoInstruction
  | IncludeInstruction
  | InscanInstruction
  | ActivateInstruction
  | DeactivateInstruction
  | DeclareInstruction
  | NoteInstruction
  | CallInstruction;

export interface ProcedureInstructionContainer {
  names: string[];
  labels: Map<string, ast.LabelPrefix>;
  parameters: string[];
  statement: boolean;
  node: InstructionNode;
}

export interface HaltInstruction {
  kind: InstructionKind.Halt;
  value?: ExpressionInstruction;
}

export const Halt: HaltInstruction = {
  kind: InstructionKind.Halt,
};

export function createHaltNode(): InstructionNode {
  return {
    labels: [],
    instruction: Halt,
  };
}

export interface AnswerInstruction {
  kind: InstructionKind.Answer;
  expression: ExpressionInstruction | undefined;
  skip: ExpressionInstruction | undefined;
  skipToken?: Token;
  column: ExpressionInstruction | undefined;
  columnToken?: Token;
  marginsToken?: Token;
  margins:
    | {
        left: ExpressionInstruction | undefined;
        right: ExpressionInstruction | undefined;
      }
    | undefined;
  scanMode: ScanMode | undefined;
}

export interface CallInstruction {
  kind: InstructionKind.Call;
  procedureName: string;
  args: ExpressionInstruction[];
  node: ast.CallStatement;
}

export interface NoteInstruction {
  kind: InstructionKind.Note;
  noteToken?: Token;
  message: ExpressionInstruction;
  code: ExpressionInstruction;
}

export interface SelectInstruction {
  kind: InstructionKind.Select;
  element: ast.SyntaxNode;
  /**
   * The expression to compare each case against.
   * If not provided, case conditions are compared to the "1" (true) value.
   */
  compare?: ExpressionInstruction;
  cases: Cases[];
}

export function createSelectInstruction(
  element: ast.SyntaxNode,
  compare: ExpressionInstruction | undefined,
  cases: Cases[],
): SelectInstruction {
  return {
    kind: InstructionKind.Select,
    element,
    compare,
    cases,
  };
}

export interface Cases {
  /**
   * Conditions for this case. If any condition matches, the body is executed.
   * No conditions means "default" case or "else" branch, and will be executed if no other case matches.
   */
  conditions: ExpressionInstruction[];
  /**
   * In some cases the body can be empty, for example in empty do statements.
   * If the empty body is returned during interpretation, the interpreter will just continue with the following instruction.
   */
  body?: InstructionNode;
}

export type ExpressionInstruction =
  | NumberInstruction
  | StringInstruction
  | ReferenceItemInstruction
  | BinaryExpressionInstruction
  | UnaryExpressionInstruction
  | RepetitionInstruction
  | MultipleExpressionInstruction
  | WildcardInstruction;

export interface WildcardInstruction {
  kind: InstructionKind.Wildcard;
}

export interface MultipleExpressionInstruction {
  kind: InstructionKind.MultipleExpression;
  instructions: ExpressionInstruction[];
}

export function createMultipleExpressionInstruction(
  instructions: ExpressionInstruction[],
): MultipleExpressionInstruction {
  return {
    kind: InstructionKind.MultipleExpression,
    instructions,
  };
}

export interface DimensionBoundsInstruction {
  lowerBound: ExpressionInstruction | null;
  upperBound: ExpressionInstruction | null;
}

export interface RepetitionInstruction {
  kind: InstructionKind.Repetition;
  expression: ExpressionInstruction;
  count: ExpressionInstruction;
}

export interface BinaryExpressionInstruction {
  kind: InstructionKind.BinaryExpression;
  left: ExpressionInstruction;
  right: ExpressionInstruction;
  operator: ast.BinaryExpression["op"];
}

export interface UnaryExpressionInstruction {
  kind: InstructionKind.UnaryExpression;
  operand: ExpressionInstruction;
  operator: ast.UnaryExpression["op"];
}

export interface NumberInstruction {
  kind: InstructionKind.Number;
  value: string; // Represents a numeric value as a string
}

export interface StringInstruction {
  kind: InstructionKind.String;
  value: string; // Represents a string value
}

export interface ReferenceItemInstruction {
  kind: InstructionKind.ReferenceItem;
  variable: string;
  reference: ast.Reference | null;
  args: ExpressionInstruction[];
}

export function createReferenceItemInstruction(
  variable: string,
  reference: ast.Reference | null,
  args: ExpressionInstruction[],
): ReferenceItemInstruction {
  return {
    kind: InstructionKind.ReferenceItem,
    variable,
    reference,
    args,
  };
}

export interface AssignmentInstruction {
  kind: InstructionKind.Assignment;
  refs: ReferenceItemInstruction[];
  operator: ast.AssignmentOperator;
  value: ExpressionInstruction;
}

export function createAssignmentInstruction(
  refs: ReferenceItemInstruction[],
  operator: ast.AssignmentOperator,
  value: ExpressionInstruction,
): AssignmentInstruction {
  return {
    kind: InstructionKind.Assignment,
    refs,
    operator,
    value,
  };
}

export interface TokensInstruction {
  kind: InstructionKind.Tokens;
  tokens: Token[];
}

export interface DoInstruction {
  kind: InstructionKind.Do;
  content: InstructionNode;
  doType2: DoType2Instruction | null;
  doType3: DoType3Instruction | null;
  doType4: boolean; // DO FOREVER;
}

export interface DoType2Instruction {
  until: ExpressionInstruction | null;
  while: ExpressionInstruction | null;
}

export interface DoType3Instruction {
  variable: ReferenceItemInstruction;
  specification: DoType3Specification;
}

export interface DoType3Specification {
  expression: ExpressionInstruction | null;
  repeat: ExpressionInstruction | null;
  while: ExpressionInstruction | null;
  until: ExpressionInstruction | null;
  to: ExpressionInstruction | null;
  by: ExpressionInstruction | null;
}

export enum DeclaredType {
  Character,
  Fixed,
}

export enum VariableVisibility {
  External,
  Internal,
}

export interface DeclareInstruction {
  kind: InstructionKind.Declare;
  name: string;
  node?: ast.SyntaxNode;
  /**
   * If defined, it contains the lower and upper bounds of the n-dimensional array
   */
  dimensions?: DimensionBoundsInstruction[];
  type: DeclaredType;
  mode: ScanMode;
  initial?: ExpressionInstruction[];
  /**
   * If defined, it indicates whether the variable is part of a PROCEDURE or not.
   *
   * However, this information is not used in the preprocessor, it is only used for error reporting.
   */
  visibility?: VariableVisibility;
}

export function createDeclareInstruction(
  name: string,
  dimensions: DimensionBoundsInstruction[] | undefined,
  type: DeclaredType,
  mode: ScanMode,
  initial: ExpressionInstruction[] | undefined,
  visibility: VariableVisibility | undefined,
  node: ast.SyntaxNode | undefined,
): DeclareInstruction {
  return {
    kind: InstructionKind.Declare,
    name,
    dimensions,
    type,
    mode,
    node,
    initial,
    visibility,
  };
}

export interface IncludeInstruction {
  kind: InstructionKind.Include;
  items: Array<ast.IncludeItemFile | ast.IncludeItemMember>;
  idempotent: boolean;
}

export function createIncludeInstruction(
  items: Array<ast.IncludeItemFile | ast.IncludeItemMember>,
  idempotent: boolean,
): IncludeInstruction {
  return {
    kind: InstructionKind.Include,
    items,
    idempotent,
  };
}

export interface InscanInstruction {
  kind: InstructionKind.Inscan;
  variable: ReferenceItemInstruction;
  node: ast.InscanDirective;
  idempotent: boolean;
}

export interface ActivateInstruction {
  kind: InstructionKind.Activate;
  variable: ReferenceItemInstruction;
  scanMode?: ScanMode;
}

export interface DeactivateInstruction {
  kind: InstructionKind.Deactivate;
  variable: ReferenceItemInstruction;
}

export interface GotoInstruction {
  kind: InstructionKind.Goto;
  node?: InstructionNode;
}
