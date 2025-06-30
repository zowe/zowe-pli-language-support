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

export interface InstructionNode {
  labels: string[];
  instruction: Instruction;
  next?: InstructionNode;
}

export function getLastInstruction(node: InstructionNode): InstructionNode {
  let current = node;
  while (current.next) {
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
  If,
  Do,
  Declare,
  Assignment,
  Activate,
  Deactivate,
  Include,
  Inscan,
  Goto,

  // Expression types
  BinaryExpression,
  UnaryExpression,
  Number,
  String,
  ReferenceItem,
}

export type Instruction =
  | CompoundInstruction
  | HaltInstruction
  | IfInstruction
  | TokensInstruction
  | AssignmentInstruction
  | DoInstruction
  | GotoInstruction
  | IncludeInstruction
  | InscanInstruction
  | ActivateInstruction
  | DeactivateInstruction
  | DeclareInstruction;

export interface HaltInstruction {
  kind: InstructionKind.Halt;
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

export interface IfInstruction {
  kind: InstructionKind.If;
  element: ast.IfStatement;
  condition: ExpressionInstruction;
  trueBranch?: InstructionNode;
  falseBranch?: InstructionNode;
}

export type ExpressionInstruction =
  | NumberInstruction
  | StringInstruction
  | ReferenceItemInstruction
  | BinaryExpressionInstruction
  | UnaryExpressionInstruction;

export interface BinaryExpressionInstruction {
  kind: InstructionKind.BinaryExpression;
  left: ExpressionInstruction;
  right: ExpressionInstruction;
  operator: string; // e.g., '+', '-', '*', '/'
}

export interface UnaryExpressionInstruction {
  kind: InstructionKind.UnaryExpression;
  operand: ExpressionInstruction;
  operator: string; // e.g., '!', '-', etc.
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
  token: Token | null;
  args: ExpressionInstruction[];
}

export interface AssignmentInstruction {
  kind: InstructionKind.Assignment;
  refs: ReferenceItemInstruction[];
  operator: string;
  value: ExpressionInstruction;
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
  specificationItems: DoType3SpecificationItem[];
}

export interface DoType3SpecificationItem {
  expression: ExpressionInstruction | null;
  upthru: ExpressionInstruction | null;
  downthru: ExpressionInstruction | null;
  repeat: ExpressionInstruction | null;
  whileOrUntil: ExpressionInstruction | null;
  to: ExpressionInstruction | null;
  by: ExpressionInstruction | null;
}

export enum DeclaredType {
  CHARACTER,
  FIXED,
}

export enum ScanMode {
  SCAN, // NORESCAN is a synonym for SCAN
  NOSCAN,
  RESCAN,
}

export enum VariableVisibility {
  EXTERNAL,
  INTERNAL,
}

export interface DeclareInstruction {
  kind: InstructionKind.Declare;
  name: string;
  type: DeclaredType;
  mode: ScanMode;
  visibility: VariableVisibility | null;
}

export function createDeclareInstruction(
  name: string,
  type: DeclaredType,
  mode: ScanMode,
  visibility?: VariableVisibility | null,
): DeclareInstruction {
  return {
    kind: InstructionKind.Declare,
    name,
    type,
    mode,
    visibility: visibility ?? null,
  };
}

export interface IncludeInstruction {
  kind: InstructionKind.Include;
  file: string;
  xInclude: boolean;
  token: Token | null; // Token for error reporting, if available
}

export interface InscanInstruction {
  kind: InstructionKind.Inscan;
  variable: ReferenceItemInstruction;
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
