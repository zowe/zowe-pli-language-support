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

import * as inst from "./instructions";
import * as ast from "../syntax-tree/ast";
import { assertType, getAttributes } from "./util";

interface GenerateInstructionContext {
  labels: Map<string, inst.InstructionNode>;
  nodes: Map<ast.SyntaxNode | null, inst.InstructionNode>;
  procedures: Map<string, inst.ProcedureInstructionContainer>;
  onFinish: (callback: () => void) => void;
}

export interface InstructionGeneratorResult {
  entryNode: inst.InstructionNode;
  procedures: Map<string, inst.ProcedureInstructionContainer>;
}

export function generateInstructions(
  statements: ast.Statement[],
): InstructionGeneratorResult {
  const callbacks: (() => void)[] = [];
  const context: GenerateInstructionContext = {
    labels: new Map(),
    nodes: new Map(),
    procedures: new Map(),
    onFinish: (callback) => {
      callbacks.push(callback);
    },
  };

  const list = generateInstructionList(statements, context);
  const last = list.last;
  if (last) {
    // Always halt on the last instruction
    last.next = inst.createHaltNode();
  }
  // Traverse callbacks in reverse order
  // This is required to correctly set the `next` nodes in the instruction chain
  for (let i = callbacks.length - 1; i >= 0; i--) {
    callbacks[i]();
  }
  return {
    entryNode: list.head ?? inst.createHaltNode(),
    procedures: context.procedures,
  };
}

function generateInstructionList(
  statements: ast.Statement[],
  context: GenerateInstructionContext,
): inst.LinkedInstructionList {
  const list = new inst.LinkedInstructionList();
  for (const statement of statements) {
    if (statement.value?.kind === ast.SyntaxKind.ProcedureStatement) {
      const procedure = generateProcedureInstructionContainer(statement);
      for (const name of procedure.names) {
        context.procedures.set(name, procedure);
      }
    } else {
      const node = generateInstructionForStatement(statement, context);
      if (node) {
        list.append(node);
      }
    }
  }
  return list;
}

function generateProcedureInstructionContainer(
  statement: ast.Statement,
): inst.ProcedureInstructionContainer {
  const names: string[] = [];
  const labels = new Map<string, ast.LabelPrefix>();
  const params: string[] = [];
  for (const label of statement.labels) {
    if (label.name) {
      names.push(label.name);
      labels.set(label.name, label);
    }
  }
  const procedure = statement.value as ast.ProcedureStatement;
  for (const param of procedure.parameters) {
    const name = param.ref?.text;
    if (name) {
      params.push(name);
    }
  }
  const statements = procedure.statements;
  const statementType = procedure.statement;
  const instructionList = generateInstructions(statements);
  return {
    names,
    labels,
    statement: statementType,
    parameters: params,
    node: instructionList.entryNode,
  };
}

function generateInstructionForStatement(
  statement: ast.Statement | null,
  context: GenerateInstructionContext,
): inst.InstructionNode | undefined {
  if (!statement) {
    return undefined; // No statement to generate instructions for
  }
  const value = statement.value;
  const labels: string[] = [];
  if (!value) {
    return undefined; // No value to generate instructions for
  }
  for (const label of statement.labels) {
    if (label.name) {
      labels.push(label.name);
    }
  }
  let instruction: inst.Instruction | undefined = undefined;
  switch (value.kind) {
    case ast.SyntaxKind.DeclareStatement:
      instruction = generateDeclareInstruction(value);
      break;
    case ast.SyntaxKind.ReturnStatement:
      instruction = generateReturnInstruction(value);
      break;
    case ast.SyntaxKind.IfStatement:
      instruction = generateIfInstruction(value, context);
      break;
    case ast.SyntaxKind.DoStatement:
      instruction = generateDoInstruction(value, context);
      break;
    case ast.SyntaxKind.IterateStatement:
      instruction = generateIterateInstruction(value, context);
      break;
    case ast.SyntaxKind.LeaveStatement:
      instruction = generateLeaveInstruction(value, context);
      break;
    case ast.SyntaxKind.GoToStatement:
      instruction = generateGotoInstruction(value, context);
      break;
    case ast.SyntaxKind.AssignmentStatement:
      instruction = generateAssignmentInstruction(value, context);
      break;
    case ast.SyntaxKind.IncludeDirective:
    case ast.SyntaxKind.IncludeAltDirective:
      instruction = generateIncludeInstruction(value);
      break;
    case ast.SyntaxKind.InscanDirective:
      instruction = generateInscanInstruction(value);
      break;
    case ast.SyntaxKind.ActivateStatement:
      instruction = generateActivateInstruction(value);
      break;
    case ast.SyntaxKind.DeactivateStatement:
      instruction = generateDeactivateInstruction(value);
      break;
    case ast.SyntaxKind.TokenStatement:
      instruction = generateTokenInstruction(value);
      break;
    case ast.SyntaxKind.NoteDirective:
      instruction = generateNoteInstruction(value);
      break;
    case ast.SyntaxKind.AnswerStatement:
      instruction = generateAnswerInstruction(value);
      break;
    case ast.SyntaxKind.CallStatement:
      instruction = generateCallInstruction(value, context);
      break;
    default:
      return undefined;
  }
  if (!instruction) {
    return undefined; // No instruction generated
  }
  const node: inst.InstructionNode = {
    labels,
    instruction,
  };
  context.nodes.set(statement, node);
  for (const label of labels) {
    context.labels.set(label, node);
  }
  return node;
}

function generateReturnInstruction(
  node: ast.ReturnStatement,
): inst.HaltInstruction {
  return {
    kind: inst.InstructionKind.Halt,
    value: generateExpressionInstruction(node.expression),
  };
}

function generateCallInstruction(
  node: ast.CallStatement,
  context: GenerateInstructionContext,
): inst.CallInstruction | undefined {
  if (!node.call?.procedure?.text) {
    return undefined; // No procedure to call
  }
  if (!node.call.procedure.text) {
    return undefined;
  }
  const args = (node.call.args1?.list ?? []).map((arg) => {
    assertType<ast.Expression>(arg);
    return (
      generateExpressionInstruction(arg) ??
      <inst.NumberInstruction>{ kind: inst.InstructionKind.Number, value: "0" }
    );
  });
  return {
    kind: inst.InstructionKind.Call,
    procedureName: node.call.procedure.text,
    args,
    node,
  };
}

function generateTokenInstruction(
  node: ast.TokenStatement,
): inst.TokensInstruction {
  return {
    kind: inst.InstructionKind.Tokens,
    tokens: node.tokens,
  };
}

const DefaultCode: inst.ExpressionInstruction = {
  kind: inst.InstructionKind.Number,
  value: "0",
};

function generateAnswerInstruction(
  node: ast.AnswerStatement,
): inst.AnswerInstruction | undefined {
  let expression: inst.ExpressionInstruction | undefined = undefined;
  if (node.expression) {
    expression = generateExpressionInstruction(node.expression);
  }
  let skip: inst.ExpressionInstruction | undefined = undefined;
  if (node.skip) {
    if (node.skip.type === ast.SkipModeType.Skip && node.skip.count) {
      skip = generateExpressionInstruction(node.skip.count);
    } else {
      // at least insert one line for a page break
      skip = { kind: inst.InstructionKind.Number, value: "1" };
    }
  }
  let column: inst.ExpressionInstruction | undefined = undefined;
  if (node.column) {
    column = generateExpressionInstruction(node.column);
  }
  let margins: inst.AnswerInstruction["margins"] = undefined;
  if (node.margins) {
    margins = {
      left: generateExpressionInstruction(node.margins.left),
      right: generateExpressionInstruction(node.margins.right),
    };
  }
  const scanMode = node.scanMode
    ? inst.ScanModeAstToInstruction[node.scanMode]
    : undefined;
  return {
    kind: inst.InstructionKind.Answer,
    expression,
    scanMode,
    skip,
    skipToken: node.skipToken,
    column,
    columnToken: node.columnToken,
    margins,
    marginsToken: node.marginsToken,
  };
}

function generateNoteInstruction(
  node: ast.NoteDirective,
): inst.NoteInstruction | undefined {
  const message = generateExpressionInstruction(node.message);
  const code = generateExpressionInstruction(node.code) || DefaultCode;
  return message && node.noteToken
    ? {
        kind: inst.InstructionKind.Note,
        noteToken: node.noteToken,
        message,
        code,
      }
    : undefined;
}

function generateActivateInstruction(
  node: ast.ActivateStatement,
): inst.Instruction | undefined {
  const instructions: inst.ActivateInstruction[] = [];
  for (const item of node.items) {
    if (!item.reference) {
      continue; // Skip items without a reference
    }
    const reference = generateReferenceItemInstruction(item.reference);
    let scanMode: inst.ScanMode = inst.ScanMode.Scan;
    if (item.scanMode === "RESCAN") {
      scanMode = inst.ScanMode.ReScan;
    } else if (item.scanMode === "NOSCAN") {
      scanMode = inst.ScanMode.NoScan;
    }
    instructions.push({
      kind: inst.InstructionKind.Activate,
      variable: reference,
      scanMode,
    });
  }
  return inst.createCompoundInstruction(instructions);
}

function generateDeactivateInstruction(
  node: ast.DeactivateStatement,
): inst.Instruction | undefined {
  const instructions: inst.DeactivateInstruction[] = [];
  for (const item of node.references) {
    const reference = generateReferenceItemInstruction(item);
    instructions.push({
      kind: inst.InstructionKind.Deactivate,
      variable: reference,
    });
  }
  return inst.createCompoundInstruction(instructions);
}

function generateDeclareInstruction(
  declaration: ast.DeclareStatement,
): inst.Instruction {
  const items = getAllDeclarations(declaration.items);
  const instructions: inst.Instruction[] = [];
  for (const item of items) {
    if (!item.name) {
      continue; // Skip variables without a name
    }
    const dimensions = getDimensions(item);
    // Generate an instruction for each declared variable
    const attributes = getAttributes(item);
    let type: inst.DeclaredType = inst.DeclaredType.Character;
    if (attributes.includes("FIXED")) {
      type = inst.DeclaredType.Fixed;
    }
    let scanMode: inst.ScanMode = inst.ScanMode.Scan;
    if (attributes.includes("RESCAN")) {
      scanMode = inst.ScanMode.ReScan;
    } else if (attributes.includes("NOSCAN")) {
      scanMode = inst.ScanMode.NoScan;
    }
    let visibility: inst.VariableVisibility | null = null;
    if (attributes.includes("INTERNAL")) {
      visibility = inst.VariableVisibility.Internal;
    } else if (attributes.includes("EXTERNAL")) {
      visibility = inst.VariableVisibility.External;
    }
    instructions.push(
      inst.createDeclareInstruction(
        item.name,
        dimensions,
        type,
        scanMode,
        visibility,
        item,
      ),
    );
  }
  return inst.createCompoundInstruction(instructions);
}

function getAllDeclarations(
  items: ast.DeclaredItemElement[],
): ast.DeclaredVariable[] {
  const declarations: ast.DeclaredVariable[] = [];
  for (const item of items) {
    if (item.kind === ast.SyntaxKind.DeclaredVariable) {
      declarations.push(item);
    } else if (item.kind === ast.SyntaxKind.DeclaredItem) {
      declarations.push(...getAllDeclarations(item.elements));
    }
  }
  return declarations;
}

function getDimensions(
  item: ast.DeclaredVariable,
): inst.DimensionBoundsInstruction[] | undefined {
  const container = item.container;
  if (
    container?.kind !== ast.SyntaxKind.DeclaredItem ||
    !container.attributes.length
  ) {
    return undefined;
  }
  const firstAttribute = container.attributes[0];
  if (
    firstAttribute.kind !== ast.SyntaxKind.DimensionsDataAttribute ||
    !firstAttribute.dimensions
  ) {
    return undefined; // No dimensions attribute found
  }
  const instructions: inst.DimensionBoundsInstruction[] = [];
  const dimensions = firstAttribute.dimensions.dimensions;
  for (const { lower, upper } of dimensions) {
    let upperBound: inst.ExpressionInstruction | undefined = undefined;
    if (upper && upper.expression && upper.expression !== "*") {
      upperBound = generateExpressionInstruction(upper.expression);
    }

    let lowerBound: inst.ExpressionInstruction | undefined = undefined;
    if (lower && lower.expression && lower.expression !== "*") {
      lowerBound = generateExpressionInstruction(lower.expression);
    }

    instructions.push({
      lowerBound: lowerBound ?? null,
      upperBound: upperBound ?? null,
    });
  }
  return instructions;
}

function generateIfInstruction(
  node: ast.IfStatement,
  context: GenerateInstructionContext,
): inst.IfInstruction | undefined {
  const condition = node.expression;
  if (!condition) {
    return undefined; // No condition to generate instructions for
  }
  const conditionInstruction = generateExpressionInstruction(condition) ?? {
    kind: inst.InstructionKind.Number,
    value: "0",
  };
  const trueBranch = generateInstructionForStatement(node.unit, context);
  const falseBranch = node.else
    ? generateInstructionForStatement(node.else, context)
    : undefined;
  const instruction: inst.IfInstruction = {
    kind: inst.InstructionKind.If,
    element: node,
    condition: conditionInstruction, // Assuming condition.value is the expression to evaluate
    trueBranch,
    falseBranch,
  };
  context.onFinish(() => {
    const instructionNode = context.nodes.get(node.container);
    // Both branches should point to the next instruction after the IF statement
    if (trueBranch) {
      trueBranch.next = instructionNode?.next;
    }
    if (falseBranch) {
      falseBranch.next = instructionNode?.next;
    }
  });
  return instruction;
}

function generateDoInstruction(
  node: ast.DoStatement,
  context: GenerateInstructionContext,
): inst.DoInstruction | undefined {
  if (node.skip) {
    return undefined;
  }
  const { head, last } = generateInstructionList(node.statements, context);
  if (!head || !last) {
    return undefined;
  }
  let doType1 = true;
  const doInstruction: inst.DoInstruction = {
    kind: inst.InstructionKind.Do,
    content: head,
    doType2: null,
    doType3: null,
    doType4: node.doType4,
  };
  if (node.doType2) {
    const until = generateExpressionInstruction(node.doType2.until) ?? null;
    const whileCond = generateExpressionInstruction(node.doType2.while) ?? null;
    doInstruction.doType2 = {
      until,
      while: whileCond,
    };
  }
  if (node.doType3) {
    if (!node.doType3.variable?.element) {
      return undefined;
    }
    const variable = generateReferenceItemInstruction(
      node.doType3.variable.element,
    );
    if (node.doType3.specifications.length !== 1) {
      return undefined; // Preprocessor %DO does require exactly one specification
    }
    const spec = node.doType3.specifications[0];
    if (spec.upthru || spec.downthru) {
      return undefined; // upthru and downthru are not supported
    }
    const specification: inst.DoType3Specification = {
      expression: generateExpressionInstruction(spec.expression) ?? null,
      repeat: generateExpressionInstruction(spec.repeat) ?? null,
      while: generateExpressionInstruction(spec.whileOrUntil?.while) ?? null,
      until: generateExpressionInstruction(spec.whileOrUntil?.until) ?? null,
      to: generateExpressionInstruction(spec.to) ?? null,
      by: generateExpressionInstruction(spec.by) ?? null,
    };
    doInstruction.doType3 = {
      variable,
      specification,
    };
  }
  if (node.doType2 || node.doType3 || node.doType4) {
    doType1 = false;
  }
  context.onFinish(() => {
    const instructionNode = context.nodes.get(node.container);
    if (instructionNode) {
      if (doType1) {
        // DoType1 will simply go to the next instruction
        last.next = instructionNode.next;
      } else {
        // Loop back to the do node
        last.next = instructionNode;
      }
    }
  });
  return doInstruction;
}

function generateIterateInstruction(
  node: ast.IterateStatement,
  context: GenerateInstructionContext,
): inst.GotoInstruction | undefined {
  const gotoInstruction: inst.GotoInstruction = {
    kind: inst.InstructionKind.Goto,
  };
  const label = node.label?.label?.text;
  context.onFinish(() => {
    const doNode = lookupDoNode(context, node, label);
    if (doNode) {
      // Go back to the start of the DO loop
      gotoInstruction.node = doNode;
    }
  });
  return gotoInstruction;
}

function generateLeaveInstruction(
  node: ast.LeaveStatement,
  context: GenerateInstructionContext,
): inst.GotoInstruction | undefined {
  const gotoInstruction: inst.GotoInstruction = {
    kind: inst.InstructionKind.Goto,
  };
  const label = node.label?.label?.text;
  context.onFinish(() => {
    const doNode = lookupDoNode(context, node, label);
    if (doNode) {
      // Go to the next node after the DO loop
      gotoInstruction.node = doNode.next;
    }
  });
  return gotoInstruction;
}

function generateGotoInstruction(
  node: ast.GoToStatement,
  context: GenerateInstructionContext,
): inst.GotoInstruction | undefined {
  const gotoInstruction: inst.GotoInstruction = {
    kind: inst.InstructionKind.Goto,
  };
  const label = node.label?.label?.text;
  if (label) {
    context.onFinish(() => {
      const nodeByLabel = context.labels.get(label);
      gotoInstruction.node = nodeByLabel;
    });
  }
  return gotoInstruction;
}

function generateAssignmentInstruction(
  node: ast.AssignmentStatement,
  context: GenerateInstructionContext,
): inst.AssignmentInstruction | undefined {
  if (!node.expression) {
    return undefined;
  }
  const value = generateExpressionInstruction(node.expression);
  if (!value) {
    return undefined; // Cannot generate instruction without a value
  }
  const refs = node.refs
    .map((ref) => generateLocatorCallInstruction(ref))
    .filter((e) => e !== undefined);
  if (refs.length === 0) {
    return undefined; // No references to assign
  }
  return {
    kind: inst.InstructionKind.Assignment,
    refs,
    operator: node.operator ?? "=",
    value,
  };
}

function generateIncludeInstruction(
  node: ast.IncludeDirective | ast.IncludeAltDirective,
): inst.IncludeInstruction | undefined {
  if (node.items.length === 0) {
    return undefined; // No files to include
  }
  return inst.createIncludeInstruction(node.items, node.idempotent);
}

function generateInscanInstruction(
  node: ast.InscanDirective,
): inst.InscanInstruction | undefined {
  if (!node.item) {
    return undefined;
  }
  const instruction: inst.InscanInstruction = {
    kind: inst.InstructionKind.Inscan,
    variable: generateReferenceItemInstruction(node.item),
    idempotent: node.idempotent,
    node,
  };
  return instruction;
}

function lookupDoNode(
  context: GenerateInstructionContext,
  node: ast.SyntaxNode | null,
  label?: string,
): inst.InstructionNode | undefined {
  while (node) {
    if (
      node.kind === ast.SyntaxKind.DoStatement &&
      node.container?.kind === ast.SyntaxKind.Statement
    ) {
      const instructionNode = context.nodes.get(node.container);
      if (!instructionNode) {
        return undefined;
      }
      if (!label || instructionNode.labels.includes(label)) {
        return instructionNode;
      }
    }
    node = node.container;
  }
  return undefined;
}

function generateExpressionInstruction(
  node: ast.Expression | undefined | null,
): inst.ExpressionInstruction | undefined {
  if (!node) {
    return undefined;
  }
  switch (node.kind) {
    case ast.SyntaxKind.Literal:
      switch (node.value?.kind) {
        case ast.SyntaxKind.NumberLiteral:
          return generateNumberInstruction(node.value);
        case ast.SyntaxKind.StringLiteral:
          return generateStringInstruction(node.value);
        default:
          return undefined; // Unsupported literal type
      }
    case ast.SyntaxKind.BinaryExpression:
      return generateBinaryExpressionInstruction(node);
    case ast.SyntaxKind.UnaryExpression:
      return generateUnaryExpressionInstruction(node);
    case ast.SyntaxKind.LocatorCall:
      return generateLocatorCallInstruction(node);
    default:
      return undefined; // Unsupported expression type
  }
}

function generateLocatorCallInstruction(
  node: ast.LocatorCall,
): inst.ReferenceItemInstruction | undefined {
  if (!node.element) {
    return undefined; // No element to generate instructions for
  }
  return generateMemberCallInstruction(node.element);
}

function generateMemberCallInstruction(
  member: ast.MemberCall,
): inst.ReferenceItemInstruction | undefined {
  const reference = member.element;
  if (!reference) {
    return undefined;
  }
  return generateReferenceItemInstruction(reference);
}

function generateNumberInstruction(
  node: ast.NumberLiteral,
): inst.NumberInstruction {
  return {
    kind: inst.InstructionKind.Number,
    value: node.value ?? "0",
  };
}

function generateStringInstruction(
  node: ast.StringLiteral,
): inst.StringInstruction {
  return {
    kind: inst.InstructionKind.String,
    value: node.value ?? "",
  };
}

function generateReferenceItemInstruction(
  node: ast.ReferenceItem,
): inst.ReferenceItemInstruction {
  const args: inst.ExpressionInstruction[] = [];
  if (node.dimensions) {
    for (const dimension of node.dimensions.dimensions) {
      const def: inst.StringInstruction = {
        kind: inst.InstructionKind.String,
        value: "",
      };
      if (dimension.upper?.expression && dimension.upper.expression !== "*") {
        const instruction = generateExpressionInstruction(
          dimension.upper.expression,
        );
        if (instruction) {
          args.push(instruction);
        } else {
          args.push(def);
        }
      } else {
        args.push(def);
      }
    }
  }
  return {
    kind: inst.InstructionKind.ReferenceItem,
    variable: node.ref?.text ?? "",
    reference: node.ref,
    args,
  };
}

function generateBinaryExpressionInstruction(
  node: ast.BinaryExpression,
): inst.BinaryExpressionInstruction | undefined {
  if (!node.left || !node.right || !node.op) {
    return undefined; // Cannot generate instruction without both sides and operator
  }
  const left = generateExpressionInstruction(node.left);
  const right = generateExpressionInstruction(node.right);
  if (!left || !right) {
    return undefined; // Cannot generate instruction without both sides
  }
  return {
    kind: inst.InstructionKind.BinaryExpression,
    left,
    right,
    operator: node.op,
  };
}

function generateUnaryExpressionInstruction(
  node: ast.UnaryExpression,
): inst.UnaryExpressionInstruction | undefined {
  if (!node.expr || !node.op) {
    return undefined;
  }
  const operand = generateExpressionInstruction(node.expr);
  if (!operand) {
    return undefined;
  }
  return {
    kind: inst.InstructionKind.UnaryExpression,
    operand,
    operator: node.op,
  };
}
