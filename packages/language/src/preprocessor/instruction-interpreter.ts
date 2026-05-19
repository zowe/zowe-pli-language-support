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

import { tokenMatcher, TokenType } from "chevrotain";
import { TextDocuments } from "../language-server/text-documents";
import { Diagnostic, diagnosticFromCode } from "../language-server/types";
import { preprocessorParse } from "../parser/parser-entry";
import { ParserState } from "../parser/parser-state";
import { tokenize } from "../parser/tokenizer";
import {
  createTokenInstance,
  EXEC_VARIABLE_MARKER,
  Token,
} from "../parser/tokens";
import * as ast from "../syntax-tree/ast";
import { CstNodeKind } from "../syntax-tree/cst";
import { URI, UriUtils } from "../utils/uri";
import { LspCodes } from "../validation/lsp-codes";
import { PLICodes } from "../validation/pli-codes";
import { CompilationUnit } from "../workspace/compilation-unit";
import {
  getFileNameOrPartialName,
  IncludeItem,
  isFileIncludeItem,
  isMemberIncludeItem,
  resolveIncludeFileUri,
} from "./include-resolver";
import { CompilerOptionResult } from "./compiler-options/options";
import { CompilerOptions as MacroCompilerOptions } from "./compiler-options/options-macro";
import { CompilerOptions as PliCompilerOptions } from "./compiler-options/options-pli";
import {
  generateInstructions,
  InstructionGeneratorResult,
} from "./instruction-generator";
import * as inst from "./instructions";
import { MarginsProcessor } from "./pli-margins-processor";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";

interface Variable {
  name: string;
  value: Value;
  declarationNode?: ast.SyntaxNode | null;
  mode: ast.ScanMode;
  active: boolean;
}

type Value = ScalarValue | ArrayValue;

interface ScalarValue {
  // Scalar preprocessor variables are always strings or numbers.
  // We store them as strings for simplicity and convert them as needed based on the type.
  readonly value: string;
  readonly type: inst.DeclaredType;
}

function isScalarValue(value: Value): value is ScalarValue {
  return "value" in value && "type" in value;
}

function copyScalarValue(value: ScalarValue): ScalarValue {
  return {
    value: value.value,
    type: value.type,
  };
}

interface ArrayValue {
  readonly array: Value[];
  readonly lower: number;
  readonly upper: number;
}

function isArrayValue(value: Value): value is ArrayValue {
  return "array" in value && "lower" in value && "upper" in value;
}

function copyArrayValue(value: ArrayValue): ArrayValue {
  return {
    array: value.array.map(copyValue),
    lower: value.lower,
    upper: value.upper,
  };
}

function copyValue(value: Value): Value {
  if (isArrayValue(value)) {
    return copyArrayValue(value);
  } else {
    return copyScalarValue(value);
  }
}

function boolToString(value: boolean): string {
  return value ? "1" : "0";
}

function boolToValue(value: boolean): ScalarValue {
  return {
    type: inst.DeclaredType.Fixed,
    value: boolToString(value),
  };
}

function valueToBool(value: ScalarValue): boolean {
  if (value.type === inst.DeclaredType.Fixed) {
    return parseInt(value.value) !== 0;
  } else if (value.type === inst.DeclaredType.Character) {
    return value.value.trim() !== "";
  }
  return false;
}

function numberToValue(value: string | number): ScalarValue {
  return {
    type: inst.DeclaredType.Fixed,
    value: value.toString(),
  };
}

function stringToValue(value: string): ScalarValue {
  return {
    type: inst.DeclaredType.Character,
    value,
  };
}

function valueToNumber(value?: Value): number | undefined;
function valueToNumber(value: Value | undefined, defaultNum: number): number;
function valueToNumber(value?: Value, defaultNum?: number): number | undefined {
  if (!value || !isScalarValue(value)) {
    return defaultNum;
  }
  const num = parseInt(value.value, 10);
  if (isNaN(num)) {
    return defaultNum;
  }
  return num;
}

function valueToString(value?: Value): string | undefined;
function valueToString(value: Value | undefined, defaultStr: string): string;
function valueToString(value?: Value, defaultStr?: string): string | undefined {
  if (!value || !isScalarValue(value)) {
    return defaultStr;
  }
  return value.value;
}

function getVariable(
  context: InterpreterContext,
  name: string,
): Variable | undefined {
  let table: SymbolTable | null = context.symbols;
  while (table) {
    if (table.variables.has(name)) {
      return table.variables.get(name);
    }
    table = table.parent;
  }
  return undefined;
}

function setVariable(context: InterpreterContext, variable: Variable): void {
  let table: SymbolTable | null = context.symbols;
  while (table) {
    if (table.variables.has(variable.name)) {
      table.variables.set(variable.name, variable);
      return;
    }
    table = table.parent;
  }
  context.symbols.variables.set(variable.name, variable);
}

function generateVariable(
  instruction: inst.DeclareInstruction,
  context: InterpreterContext,
): Variable {
  return {
    name: instruction.name,
    value: generateVariableValue(instruction, context),
    declarationNode: instruction.node,
    mode: instruction.mode,
    // NOSCAN means the variable is not active
    active: instruction.mode !== ast.ScanMode.NOSCAN,
  };
}

function generateVariableValue(
  instruction: inst.DeclareInstruction,
  context: InterpreterContext,
): Value {
  let value: Value;
  // Initial value is empty or 0 (for numbers)
  if (instruction.type === inst.DeclaredType.Character) {
    value = defaultEmptyValue;
  } else {
    value = zero;
  }
  if (instruction.dimensions && instruction.dimensions.length > 0) {
    // Evaluate the dimensions in reverse order to construct the nested array correctly
    for (const { lowerBound, upperBound } of instruction.dimensions.reverse()) {
      let lower = 1;
      if (lowerBound) {
        const evaluatedLower = evaluateExpression(lowerBound, context);
        lower = valueToNumber(evaluatedLower, 1);
      }
      let upper = 1;
      if (upperBound) {
        const evaluatedUpper = evaluateExpression(upperBound, context);
        upper = valueToNumber(evaluatedUpper, 1);
      }
      const length = upper - lower + 1;
      const array: Value[] = [];
      for (let i = 0; i < length; i++) {
        // Initialize the array with the copied value
        array.push(copyValue(value));
      }
      value = {
        array,
        lower,
        upper,
      };
    }
  }
  if (instruction.initial) {
    // Currently only supports scalar initial values for simple arrays or scalar variables
    if (isArrayValue(value)) {
      for (
        let i = 0;
        i < value.array.length && i < instruction.initial.length;
        i++
      ) {
        const expr = instruction.initial[i];
        const evaluated = evaluateExpression(expr, context);
        value.array[i] = evaluated;
      }
    } else if (instruction.initial.length > 0) {
      const expr = instruction.initial[0];
      const evaluated = evaluateExpression(expr, context);
      value = evaluated;
    }
  }
  return value;
}

export interface EvaluationResults {
  branchExecutions: Map<ast.SyntaxNode, Set<number>>;
}

interface SymbolTable {
  variables: Map<string, Variable>;
  doType3: Map<inst.InstructionNode, DoType3Context>;
  parent: SymbolTable | null;
}

interface InterpreterContext {
  unit: CompilationUnit;
  currentUri: URI;
  entryUri: URI;
  /**
   * When symbols.parent === null: These are global variables that are defined on the root level of the preprocessor
   * Otherwise: Local variables only exist within the scope of a procedure.
   */
  symbols: SymbolTable;
  global: SymbolTable;
  statements: ast.Statement[];
  tokens: Token[];
  diagnostics: Diagnostic[];
  procedures: Map<string, inst.ProcedureInstructionContainer>;
  activeProcedures: Set<string>;
  counter: Map<inst.InstructionNode, number>;
  references: ast.Reference[];
  evaluations: EvaluationResults;
  xIncludes: Set<string>;
  uris: string[];
  options: InterpreterOptions;
  returnValue: Value;
  counterValue: number;
  generationCache: GenerationCache;
  /**
   * MACNAME returns the name of the preprocessor procedure within which it is invoked.
   * It is invalid to invoke MACNAME outside of a preprocessor procedure.
   */
  macname: string;
  instructionCounterLimit: number;
}

interface GenerationCache {
  lastProcedureTokenIndex: number;
  entries: Map<number, GenerationCacheEntry>;
}

interface GenerationCacheEntry {
  hasSqlLobFile: boolean;
  hasCicsExec: boolean;
  sqlLobSizes: Set<number>;
}

interface DoType3Context {
  toValue?: ScalarValue;
  byValue?: ScalarValue;
}

export type InstructionInterpreterResult = {
  all: Token[];
  evaluationResults: EvaluationResults;
  errors: Diagnostic[];
  statements: ast.Statement[];
  references: ast.Reference[];
};

// TODO: We need this just because those services aren't functions yet
// Eventually, these should become functions as well
export interface InterpreterOptions {
  compilerOptions: CompilerOptionResult | undefined;
  marginsProcessor: MarginsProcessor;
}

export const MAX_INSTRUCTION_COUNTER = 5000;

export async function runInstructions(
  unit: CompilationUnit,
  uri: URI,
  instruction: InstructionGeneratorResult,
  options: InterpreterOptions,
): Promise<InstructionInterpreterResult> {
  const global = {
    variables: new Map(),
    doType3: new Map(),
    parent: null,
  };
  const context: InterpreterContext = {
    symbols: global,
    global,
    unit,
    currentUri: uri,
    entryUri: uri,
    uris: [uri.toString()],
    diagnostics: [],
    statements: [],
    xIncludes: new Set(),
    procedures: new Map(),
    activeProcedures: new Set(),
    references: [],
    evaluations: {
      branchExecutions: new Map(),
    },
    tokens: [],
    options,
    counter: new Map(),
    returnValue: defaultEmptyValue,
    counterValue: 1,
    generationCache: {
      lastProcedureTokenIndex: 0,
      entries: new Map(),
    },
    macname: "",
    instructionCounterLimit:
      unit.processGroup?.lspOptions.instructionCounterLimit.value ??
      MAX_INSTRUCTION_COUNTER,
  };
  for (const [key, value] of instruction.procedures.entries()) {
    context.procedures.set(key, value);
  }

  await doRunInstructions(context, instruction.entryNode);
  return {
    all: context.tokens,
    evaluationResults: context.evaluations,
    errors: context.diagnostics,
    references: context.references,
    statements: context.statements,
  };
}

async function doRunInstructions(
  context: InterpreterContext,
  start: inst.InstructionNode,
): Promise<void> {
  let currentNode: inst.InstructionNode | undefined = start;
  while (currentNode) {
    const value = context.counter.get(currentNode) || 0;
    // Prevent infinite loops by limiting the number of iterations
    if (value > context.instructionCounterLimit) {
      console.log("Long running preprocessor code detected. Stopping.");
      return;
    }
    context.counter.set(currentNode, value + 1);
    currentNode = await runInstructionNode(currentNode, context);
  }
}

async function runInstructionNode(
  node: inst.InstructionNode,
  context: InterpreterContext,
): Promise<inst.InstructionNode | undefined> {
  const instruction = node.instruction;
  let result = node.next;
  try {
    const instructionResult = await runInstruction(instruction, context, node);
    if (instructionResult) {
      result = instructionResult;
    }
  } catch (err) {
    handleInstructionError(err, context);
  }
  if (node.instruction.kind === inst.InstructionKind.Halt) {
    return undefined; // Stop execution
  }
  return result;
}

function doRunInstructionsSync(
  context: InterpreterContext,
  start: inst.InstructionNode,
): void {
  let currentNode: inst.InstructionNode | undefined = start;
  while (currentNode) {
    const value = context.counter.get(currentNode) || 0;
    // Prevent infinite loops by limiting the number of iterations
    if (value > MAX_INSTRUCTION_COUNTER) {
      console.log("Long running preprocessor code detected. Stopping.");
      return;
    }
    context.counter.set(currentNode, value + 1);
    currentNode = runInstructionNodeSync(currentNode, context);
  }
}

function runInstructionNodeSync(
  node: inst.InstructionNode,
  context: InterpreterContext,
): inst.InstructionNode | undefined {
  const instruction = node.instruction;
  let result = node.next;
  try {
    const instructionResult = runInstructionSync(instruction, context, node);
    if (instructionResult) {
      result = instructionResult;
    }
  } catch (err) {
    handleInstructionError(err, context);
  }
  if (node.instruction.kind === inst.InstructionKind.Halt) {
    return undefined; // Stop execution
  }
  return result;
}

function handleInstructionError(err: any, context: InterpreterContext): void {
  console.error("Unhandled error in instruction interpreter:", err);
}

async function runInstruction(
  instruction: inst.Instruction,
  context: InterpreterContext,
  node: inst.InstructionNode,
): Promise<inst.InstructionNode | undefined> {
  switch (instruction.kind) {
    case inst.InstructionKind.Include:
      await runIncludeInstruction(instruction, context);
      break;
    case inst.InstructionKind.Inscan:
      await runInscanInstruction(instruction, context);
      break;
    default:
      return runInstructionSync(instruction, context, node);
  }
  return undefined;
}

/**
 * Cannot run the `INCLUDE` and `INSCAN` instructions in synchronous mode
 * because they require asynchronous file system access.
 * However, top level instructions should be evaluated using runInstrution (async) anyway
 */
function runInstructionSync(
  instruction: inst.Instruction,
  context: InterpreterContext,
  node: inst.InstructionNode,
): inst.InstructionNode | undefined {
  switch (instruction.kind) {
    case inst.InstructionKind.Assignment:
      runAssignmentInstruction(instruction, context);
      break;
    case inst.InstructionKind.Tokens:
      runTokenInstruction(instruction, context);
      break;
    case inst.InstructionKind.Compound:
      runCompoundInstruction(instruction, context, node);
      break;
    case inst.InstructionKind.Goto:
      return instruction.node;
    case inst.InstructionKind.Select:
      return runSelectInstruction(instruction, context);
    case inst.InstructionKind.Do:
      return runDoInstruction(instruction, context, node);
    case inst.InstructionKind.Include:
      throw new Error("INCLUDE instruction cannot be run in synchronous mode.");
    case inst.InstructionKind.Inscan:
      throw new Error("INSCAN instruction cannot be run in synchronous mode.");
    case inst.InstructionKind.Declare:
      runDeclareInstruction(instruction, context);
      break;
    case inst.InstructionKind.Activate:
      runActivateInstruction(instruction, context);
      break;
    case inst.InstructionKind.Deactivate:
      runDeactivateInstruction(instruction, context);
      break;
    case inst.InstructionKind.Note:
      runNoteInstruction(instruction, context);
      break;
    case inst.InstructionKind.Answer:
      runAnswerInstruction(instruction, context);
      break;
    case inst.InstructionKind.Call:
      runCallInstruction(instruction, context);
      break;
    case inst.InstructionKind.Halt:
      runHaltInstruction(instruction, context);
      break;
    case inst.InstructionKind.CicsResponseCode:
      runCicsResponseInstruction(instruction, context);
      break;
    case inst.InstructionKind.ExecStatement:
      runExecInstruction(instruction, context);
      break;
    case inst.InstructionKind.SqlAttribute:
      runSqlAttributeInstruction(instruction, context);
      break;
  }
  return undefined;
}

function runCicsResponseInstruction(
  instruction: inst.CicsResponseInstruction,
  context: InterpreterContext,
): void {
  const codeValue = instruction.code.toString();
  context.tokens.push(...lex(codeValue));
}

function getGenerationCacheEntry(
  context: InterpreterContext,
  offset: number,
): GenerationCacheEntry {
  let entry = context.generationCache.entries.get(offset);
  if (!entry) {
    entry = {
      hasSqlLobFile: false,
      hasCicsExec: false,
      sqlLobSizes: new Set(),
    };
    context.generationCache.entries.set(offset, entry);
  }
  return entry;
}

function emitMarker(
  context: InterpreterContext,
  token: Token,
  type: TokenType,
): void {
  const { startOffset, startLine, startColumn } = token;
  // Generate a marker token for the PL/I parser
  // This token is used to identify the ID as a host variable
  const varMarkerToken = createTokenInstance(
    "",
    "",
    type,
    startOffset,
    startLine,
    startColumn,
    // Start and end position are the same
    startOffset,
    startLine,
    startColumn,
    undefined,
  );
  // Emit both tokens now
  context.tokens.push(varMarkerToken, token);
}

function runExecVariableInstruction(
  instruction: inst.ExecVariableInstruction,
  context: InterpreterContext,
): void {
  emitMarker(context, instruction.token, EXEC_VARIABLE_MARKER);
}

const LOCATOR_TYPE = "FIXED BIN(31)";
const ROWID_TYPE = "CHAR(40) VARYING";
const LOB_FILE_TYPE = "LIKE SQL_LOB_FILE";
const LOB_TYPE = (length: number) => `LIKE SQL_LOB${length}`;

function runSqlAttributeInstruction(
  instruction: inst.SqlAttributeInstruction,
  context: InterpreterContext,
): void {
  const body = instruction.attribute.body;
  if (!body) {
    return;
  }
  if (
    // All locator types simply generate the same static attributes
    body.kind === ast.SyntaxKind.SqlAttributeLobLocator ||
    body.kind === ast.SyntaxKind.SqlAttributeTableLocator ||
    body.kind === ast.SyntaxKind.SqlAttributeResultSetLocator
  ) {
    context.tokens.push(...lex(LOCATOR_TYPE));
  } else if (body.kind === ast.SyntaxKind.SqlAttributeRowId) {
    context.tokens.push(...lex(ROWID_TYPE));
  } else if (body.kind === ast.SyntaxKind.SqlAttributeBinary) {
    const length = computeLobLength(body);
    const varAttribute =
      body.type === ast.SqlAttributeBinaryType.VARBINARY
        ? "VARYING"
        : "NONVARYING";
    context.tokens.push(...lex(`CHAR(${length}) ${varAttribute}`));
  } else {
    // The LOB_FILE and LOB attributes require additional declarations to be inserted
    // They are always inserted after the semicolon of the procedure statement
    const procSemicolonIndex = findProcSemicolon(context);
    if (procSemicolonIndex === undefined) {
      return;
    }
    const entry = getGenerationCacheEntry(context, procSemicolonIndex);
    if (body.kind === ast.SyntaxKind.SqlAttributeLobFile) {
      if (!entry.hasSqlLobFile) {
        entry.hasSqlLobFile = true;
        insertSqlAttributeLobFileTokens(context, procSemicolonIndex);
      }
      context.tokens.push(...lex(LOB_FILE_TYPE));
    } else if (body.kind === ast.SyntaxKind.SqlAttributeLob) {
      const computedLength = computeLobLength(body);
      if (!entry.sqlLobSizes.has(computedLength)) {
        entry.sqlLobSizes.add(computedLength);
        insertSqlAttributeLobTokens(
          context,
          procSemicolonIndex,
          computedLength,
        );
      }
      context.tokens.push(...lex(LOB_TYPE(computedLength)));
    }
  }
}

function computeLobLength(
  lob: ast.SqlAttributeLob | ast.SqlAttributeBinary,
): number {
  if (lob.length !== null) {
    let givenLength = lob.length;
    switch (lob.size) {
      case ast.SQLAttributeLobSize.G:
        givenLength *= 1024;
      // fallthrough
      case ast.SQLAttributeLobSize.M:
        givenLength *= 1024;
      // fallthrough
      case ast.SQLAttributeLobSize.K:
        givenLength *= 1024;
    }
    return givenLength;
  }
  return 0;
}

function insertSqlAttributeLobFileTokens(
  context: InterpreterContext,
  offset: number,
): void {
  // These declarations aren't documented anywhere
  // They are extracted from the PL/I code after running through the SQL preprocessor
  context.tokens.splice(
    offset,
    0,
    ...lex(`
    DCL
      1 SQL_LOB_FILE BASED,
        2 SQL_LOB_FILE_NAME_LEN FIXED BIN(31),
        2 SQL_LOB_FILE_DATA_LEN FIXED BIN(31),
        2 SQL_LOB_FILE_OPTIONS FIXED BIN(31),
        2 SQL_LOB_FILE_NAME CHAR(256);

    DCL SQL_FILE_READ      FIXED BIN(31) VALUE(2);
    DCL SQL_FILE_CREATE    FIXED BIN(31) VALUE(8);
    DCL SQL_FILE_OVERWRITE FIXED BIN(31) VALUE(16);
    DCL SQL_FILE_APPEND    FIXED BIN(31) VALUE(32);
  `),
  );
}

function runExecInstruction(
  instruction: inst.ExecInstruction,
  context: InterpreterContext,
): void {
  for (const instr of instruction.variables) {
    runExecVariableInstruction(instr, context);
  }
  // Emit replacement text or a simple DO; END; statement to ensure that the main parser always receives a valid statement
  const replacementText = instruction.replaceWithText ?? "DO; END;";
  context.tokens.push(...lex(replacementText));
  if (instruction.preprocessorType === ast.PreprocessorType.CICS) {
    const procSemicolonIndex = findProcSemicolon(context);
    if (procSemicolonIndex === undefined) {
      return;
    }
    const entry = getGenerationCacheEntry(context, procSemicolonIndex);
    if (!entry.hasCicsExec) {
      entry.hasCicsExec = true;
      insertCicsExecTokens(context, procSemicolonIndex);
    }
  }
}

function insertCicsExecTokens(
  context: InterpreterContext,
  offset: number,
): void {
  // These declarations aren't documented anywhere
  // They are extracted from the PL/I code after running through the CICS preprocessor
  context.tokens.splice(
    offset,
    0,
    ...lex(`
      DCL 
        1 DFHCNSTS STATIC,
          2 DFHLDVER CHAR(22) INIT('LD TABLE DFHEITAB 730.'),
          2 DFHEIB0 FIXED BIN(15) INIT(0),
          2 DFHEID0 FIXED DEC(7) INIT(0),
          2 DFHEICB CHAR(8) INIT('        ');
      DCL DFHEPI ENTRY, DFHEIPTR PTR;
      DCL 
        1 DFHEIBLK BASED (DFHEIPTR),
          2 EIBTIME  FIXED DEC(7),
          2 EIBDATE  FIXED DEC(7),
          2 EIBTRNID CHAR(4),
          2 EIBTASKN FIXED DEC(7),
          2 EIBTRMID CHAR(4),
          2 EIBFIL01 FIXED BIN(15),
          2 EIBCPOSN FIXED BIN(15),
          2 EIBCALEN FIXED BIN(15),
          2 EIBAID   CHAR(1),
          2 EIBFN    CHAR(2),
          2 EIBRCODE CHAR(6),
          2 EIBDS    CHAR(8),
          2 EIBREQID CHAR(8),
          2 EIBRSRCE CHAR(8),
          2 EIBSYNC  CHAR(1),
          2 EIBFREE  CHAR(1),
          2 EIBRECV  CHAR(1),
          2 EIBFIL02 CHAR(1),
          2 EIBATT   CHAR(1),
          2 EIBEOC   CHAR(1),
          2 EIBFMH   CHAR(1),
          2 EIBCOMPL CHAR(1),
          2 EIBSIG   CHAR(1),
          2 EIBCONF  CHAR(1),
          2 EIBERR   CHAR(1),
          2 EIBERRCD CHAR(4),
          2 EIBSYNRB CHAR(1),
          2 EIBNODAT CHAR(1),
          2 EIBRESP  FIXED BIN(31),
          2 EIBRESP2 FIXED BIN(31),
          2 EIBRLDBK CHAR(1);
      DCL 
        1 DFHCNTBS  STATIC,
          2  DFHLDTBS CHAR(22) INIT('LD TABLE DFHEITBS 730.');
      DCL DFHDUMMY STATIC FIXED BIN(15) INIT(0);
      DCL DFHEI0 ENTRY VARIABLE INIT(DFHEI01) AUTO OPTIONS(INTER ASSEMBLER);
      DCL DFHEI01 ENTRY OPTIONS(INTER ASSEMBLER);
    `),
  );
}

function insertSqlAttributeLobTokens(
  context: InterpreterContext,
  offset: number,
  length: number,
): void {
  context.tokens.splice(
    offset,
    0,
    ...lex(`
    DCL
      1 SQL_LOB${length} BASED,
        2 SQL_LOB_LEN FIXED BIN(31),
        2 SQL_LOB_BUF(10) CHAR(1);
  `),
  );
}

/**
 * Searches for the nearest procedure semicolon token before the current position
 */
function findProcSemicolon(context: InterpreterContext): number | undefined {
  const min = context.generationCache.lastProcedureTokenIndex;
  const max = context.tokens.length - 1;
  for (let i = max; i >= min; i--) {
    const token = context.tokens[i];
    if (token.tokenTypeIdx === PreprocessorTokens.Procedure.tokenTypeIdx) {
      context.generationCache.lastProcedureTokenIndex = i;
      for (let j = i + 1; j <= max; j++) {
        const nextToken = context.tokens[j].tokenTypeIdx;
        if (nextToken === PreprocessorTokens.Semicolon.tokenTypeIdx) {
          return j + 1;
        }
      }
      return undefined;
    }
  }
  return undefined;
}

function runCallInstruction(
  instruction: inst.CallInstruction,
  context: InterpreterContext,
): void {
  const procedure = context.procedures.get(instruction.procedureName);
  if (!procedure) {
    return;
  }
  const args = instruction.args;
  evaluateProcedure(procedure, args, context);
}

function runAnswerInstruction(
  instruction: inst.AnswerInstruction,
  context: InterpreterContext,
): void {
  let breakCount = 0;
  if (instruction.skip) {
    const skipValue = evaluateExpression(instruction.skip, context);
    breakCount =
      tryValueToNumber(context, instruction.skipToken, skipValue) ?? 0;
  }
  if (instruction.expression) {
    const expression = evaluateExpression(instruction.expression, context);
    const text = valueToString(expression) ?? "";
    let tokens = lex(text);
    if (tokens.length > 0) {
      const lastToken = tokens[tokens.length - 1];
      lastToken.immediateFollow = lastToken.endOffset + 1 === text.length;
    }
    if (instruction.scanMode !== ast.ScanMode.NOSCAN) {
      tokens = replaceTokensInText(tokens, context);
    }
    if (breakCount > 0) {
      context.tokens.push(...tokens);
    } else {
      mergePush(context.tokens, tokens, true);
    }
  }
  if (instruction.column) {
    const columnValue = evaluateExpression(instruction.column, context);
    tryValueToNumber(context, instruction.columnToken, columnValue);
  }
  if (instruction.margins) {
    if (instruction.margins.left) {
      const leftValue = evaluateExpression(instruction.margins.left, context);
      tryValueToNumber(context, instruction.marginsToken, leftValue);
    }
    if (instruction.margins.right) {
      const rightValue = evaluateExpression(instruction.margins.right, context);
      tryValueToNumber(context, instruction.marginsToken, rightValue);
    }
  }
}

function tryValueToNumber(
  context: InterpreterContext,
  token: Token | undefined,
  value: Value,
) {
  //TODO move this check to the future type system
  const numericValue = valueToNumber(value);
  if (typeof numericValue === "number") {
    return numericValue;
  }
  token &&
    context.diagnostics.push(
      diagnosticFromCode(PLICodes.Severe.IBM3948I, token, "CONVERSION", "612"),
    );
  return undefined;
}

function runNoteInstruction(
  instruction: inst.NoteInstruction,
  context: InterpreterContext,
): void {
  const message = valueToString(
    evaluateExpression(instruction.message, context),
  );
  const codeValue = evaluateExpression(instruction.code, context);
  const code = valueToNumber(codeValue);
  if (message) {
    /**
     * Attention! This implementation follows the documentation of "%NOTE statement", not of "%NOTE directive"
     * @see https://www.ibm.com/docs/en/epfz/6.2.0?topic=statements-note-statement
     * @see https://www.ibm.com/docs/en/epfz/6.2.0?topic=directives-note-directive
     */
    let error: Diagnostic;
    switch (code) {
      case undefined:
      case 0:
      case 1:
      case 2:
      case 3:
        error = diagnosticFromCode(
          PLICodes.Info.IBM1040I,
          instruction.noteToken,
          message,
        );
        break;
      case 4:
      case 5:
      case 6:
      case 7:
        error = diagnosticFromCode(
          PLICodes.Warning.IBM1157I,
          instruction.noteToken,
          message,
        );
        break;
      case 8:
      case 9:
      case 10:
      case 11:
        error = diagnosticFromCode(
          PLICodes.Error.IBM1390I,
          instruction.noteToken,
          message,
        );
        break;
      case 12:
      case 13:
      case 14:
      case 15:
        error = diagnosticFromCode(
          PLICodes.Severe.IBM1940I,
          instruction.noteToken,
          message,
        );
        break;
      default:
        error = diagnosticFromCode(
          PLICodes.Severe.IBM1941I,
          instruction.noteToken,
          message,
        );
        break;
    }
    context.diagnostics.push(error);
  }
}

function runHaltInstruction(
  instruction: inst.HaltInstruction,
  context: InterpreterContext,
): void {
  // Every return statement in a procedure generates a halt statement with a `value`
  // Simply evaluate it and set it as the return value of the current context
  if (instruction.value) {
    const value = evaluateExpression(instruction.value, context);
    context.returnValue = value;
  }
}

function runDoInstruction(
  instruction: inst.DoInstruction,
  context: InterpreterContext,
  node: inst.InstructionNode,
): inst.InstructionNode | undefined {
  let condition = true;
  if (instruction.doType2) {
    condition = runDoType2Instruction(instruction.doType2, context);
  } else if (instruction.doType3) {
    condition = runDoType3Instruction(instruction.doType3, context, node);
  }
  if (condition) {
    return instruction.content;
  }
  return undefined;
}

function runDoType2Instruction(
  doType2: inst.DoType2Instruction,
  context: InterpreterContext,
): boolean {
  let condition = true;
  if (doType2.until) {
    const untilConditionValue = evaluateExpression(doType2.until, context);
    if (!isScalarValue(untilConditionValue)) {
      // Condition cannot be evaluated, don't run the instruction
      condition = false;
    } else {
      // If UNTIL is specified, we don't run the instruction if it evaluates to true
      condition &&= !valueToBool(untilConditionValue);
    }
  }
  if (doType2.while) {
    const whileConditionValue = evaluateExpression(doType2.while, context);
    if (!isScalarValue(whileConditionValue)) {
      // Condition cannot be evaluated, don't run the instruction
      condition = false;
    } else {
      // If WHILE is specified, we only run the instruction if it evaluates to true
      condition &&= valueToBool(whileConditionValue);
    }
  }
  return condition;
}

function getDoType3Context(
  node: inst.InstructionNode,
  context: InterpreterContext,
): DoType3Context | undefined {
  let table: SymbolTable | null = context.symbols;
  while (table) {
    if (table.doType3.has(node)) {
      return table.doType3.get(node);
    }
    table = table.parent;
  }
  return undefined;
}

function setDoType3Context(
  node: inst.InstructionNode,
  context: InterpreterContext,
  doContext: DoType3Context,
): void {
  let table: SymbolTable | null = context.symbols;
  while (table) {
    if (table.doType3.has(node)) {
      table.doType3.set(node, doContext);
      return;
    }
    table = table.parent;
  }
  context.symbols.doType3.set(node, doContext);
}

function runDoType3Instruction(
  doType3: inst.DoType3Instruction,
  context: InterpreterContext,
  node: inst.InstructionNode,
): boolean {
  let condition = true;

  // Get current do-type3 state
  const doType3Context = getDoType3Context(node, context);

  if (!doType3Context) {
    // Store all expressions that must be evaluated at the start of the loop
    condition &&= runDoType3Initialization(doType3, context, node);
  } else {
    // Subsequent iterations
    condition &&= runDoType3UntilCheck(doType3, context);
    condition &&= runDoType3VariableUpdate(doType3, context, doType3Context);
  }

  // Check WHILE condition before do-group execution
  condition &&= runDoType3WhileCheck(doType3, context);

  return condition;
}

function runDoType3Initialization(
  doType3: inst.DoType3Instruction,
  context: InterpreterContext,
  node: inst.InstructionNode,
): boolean {
  const { variable } = doType3;
  const varName = variable.variable;
  const spec = doType3.specification;

  // Initial expression is required
  if (!spec.expression) {
    return false;
  }
  const start = evaluateExpression(spec.expression, context);
  if (!isScalarValue(start)) {
    return false;
  }

  let loopVar = getVariable(context, varName);

  // Implicitly declare the loop variable if it doesn't exist, or update existing variable
  if (!loopVar) {
    loopVar = {
      name: varName,
      declarationNode: variable.reference?.owner,
      value: {
        value: start.value,
        type: inst.DeclaredType.Fixed,
      },
      active: false,
      mode: ast.ScanMode.SCAN,
    };
    setVariable(context, loopVar);
  } else {
    // Update existing variable to the start value
    loopVar.value = {
      value: start.value,
      type: inst.DeclaredType.Fixed,
    };
  }

  // Evaluate and save TO and BY expressions at entry to the specification
  let toValue: ScalarValue | undefined;
  let byValue: ScalarValue | undefined;

  if (spec.to) {
    const value = evaluateExpression(spec.to, context);
    if (!isScalarValue(value)) {
      return false;
    }
    toValue = value;
  }

  if (spec.by) {
    const value = evaluateExpression(spec.by, context);
    if (!isScalarValue(value)) {
      return false;
    }
    byValue = value;
  } else if (spec.to) {
    byValue = numberToValue("1");
  }

  const doType3Context = {
    toValue,
    byValue,
  };

  setDoType3Context(node, context, doType3Context);
  return true;
}

function runDoType3WhileCheck(
  doType3: inst.DoType3Instruction,
  context: InterpreterContext,
): boolean {
  const spec = doType3.specification;

  if (spec.while) {
    const whileCondition = evaluateExpression(spec.while, context);
    if (!isScalarValue(whileCondition)) {
      return false;
    }
    return valueToBool(whileCondition);
  }

  return true;
}

function runDoType3UntilCheck(
  doType3: inst.DoType3Instruction,
  context: InterpreterContext,
): boolean {
  const spec = doType3.specification;

  if (spec.until) {
    const untilCondition = evaluateExpression(spec.until, context);
    if (!isScalarValue(untilCondition)) {
      return false;
    }
    return !valueToBool(untilCondition);
  }

  return true;
}

function runDoType3VariableUpdate(
  doType3: inst.DoType3Instruction,
  context: InterpreterContext,
  doType3Context: DoType3Context,
): boolean {
  const { variable } = doType3;
  const varName = variable.variable;
  const spec = doType3.specification;

  const loopVar = getVariable(context, varName);
  if (!loopVar) {
    return false;
  }

  if (spec.repeat) {
    const repeatValue = evaluateExpression(spec.repeat, context);
    if (!isScalarValue(repeatValue)) {
      return false;
    }
    loopVar.value = {
      value: repeatValue.value,
      type: inst.DeclaredType.Fixed,
    };
    // No range check needed for REPEAT-only loops
    return true;
  } else if (spec.to) {
    if (!doType3Context?.toValue || !doType3Context?.byValue) {
      return false;
    }

    const end = parseInt(doType3Context.toValue.value);
    const step = parseInt(doType3Context.byValue.value);

    if (!isScalarValue(loopVar.value)) {
      return false;
    }

    const currentValue = parseInt(loopVar.value.value);
    const nextValue = currentValue + step;

    // Update the variable
    loopVar.value = {
      value: nextValue.toString(),
      type: inst.DeclaredType.Fixed,
    };

    // Check if the updated value is still within range
    return (step > 0 && nextValue <= end) || (step < 0 && nextValue >= end);
  } else {
    // unsupported DO type3 clause
    return false;
  }
}

function runAssignmentInstruction(
  instruction: inst.AssignmentInstruction,
  context: InterpreterContext,
): void {
  let value = evaluateExpression(instruction.value, context);
  for (const ref of instruction.refs) {
    let variable = getVariable(context, ref.variable);
    if (!variable) {
      if (ref.args.length > 0) {
        // This seems to write into an undeclared array variable
        // Array variables cannot be implicitly declared, so we simply return
        // TODO: We should report an error here
        return;
      }
      variable = {
        name: ref.variable,
        declarationNode: ref.reference?.owner,
        value,
        active: false, // Implicitly declared variables are inactive by default
        mode: ast.ScanMode.SCAN,
      };
      setVariable(context, variable);
    } else {
      const operator = ast.assignmentToBinaryOperator(instruction.operator);
      if (operator !== null) {
        // Update the value by applying the binary operator
        const currentValue = variable.value;
        if (isScalarValue(currentValue) && isScalarValue(value)) {
          value = applyBinaryOperation(currentValue, value, operator);
        }
      }
      evaluateValueAccess(variable, ref.args, context).setter(value);
    }
  }
}

function runSelectInstruction(
  instruction: inst.SelectInstruction,
  context: InterpreterContext,
): inst.InstructionNode | undefined {
  // If there is no compare expression, we always take the first case that evaluates to "1" (true).
  let condition: Value = {
    type: inst.DeclaredType.Fixed,
    value: "1",
  };
  if (instruction.compare) {
    condition = evaluateExpression(instruction.compare, context);
  }
  if (!isScalarValue(condition)) {
    // Condition cannot be evaluated, simply skip the whole if instruction
    return undefined;
  }
  const set =
    context.evaluations.branchExecutions.get(instruction.element) ?? new Set();
  context.evaluations.branchExecutions.set(instruction.element, set);
  for (let i = 0; i < instruction.cases.length; i++) {
    const selectCase = instruction.cases[i];
    // No conditions indicates that this is the OTHERWISE/false branch
    // If we have arrived here, we can safely return the branch
    if (selectCase.conditions.length === 0) {
      set.add(i);
      return selectCase.body;
    }
    for (const caseCondition of selectCase.conditions) {
      const caseValue = evaluateExpression(caseCondition, context);
      if (!isScalarValue(caseValue)) {
        // Condition cannot be evaluated, skip this case
        continue;
      }
      if (condition.value === caseValue.value) {
        set.add(i);
        return selectCase.body;
      }
    }
  }
  return undefined;
}

function evaluateExpression(
  expression: inst.ExpressionInstruction,
  context: InterpreterContext,
): Value {
  switch (expression.kind) {
    case inst.InstructionKind.String:
    case inst.InstructionKind.Number:
      return evaluateLiteralExpression(expression, context);
    case inst.InstructionKind.BinaryExpression:
      return evaluateBinaryExpression(expression, context);
    case inst.InstructionKind.UnaryExpression:
      return evaluateUnaryExpression(expression, context);
    case inst.InstructionKind.ReferenceItem:
      return evaluateReferenceExpression(expression, context);
  }
}

type ValueOperation = (left: ScalarValue, right: ScalarValue) => ScalarValue;

function intOperation(
  callback: (left: number, right: number) => number,
): ValueOperation {
  return (left: ScalarValue, right: ScalarValue) => {
    return numberToValue(
      callback(parseInt(left.value, 10), parseInt(right.value, 10)).toString(),
    );
  };
}

function intBoolOperation(
  callback: (left: number, right: number) => boolean,
): ValueOperation {
  return (left: ScalarValue, right: ScalarValue) => {
    return boolToValue(
      callback(parseInt(left.value, 10), parseInt(right.value, 10)),
    );
  };
}

function stringOperation(
  callback: (left: string, right: string) => string,
): ValueOperation {
  return (left: ScalarValue, right: ScalarValue) => {
    return stringToValue(callback(left.value, right.value));
  };
}

function stringBoolOperation(
  callback: (left: string, right: string) => boolean,
): ValueOperation {
  return (left: ScalarValue, right: ScalarValue) => {
    return boolToValue(callback(left.value, right.value));
  };
}

const plus = intOperation((left, right) => left + right);
const minus = intOperation((left, right) => left - right);
const multiply = intOperation((left, right) => left * right);
const divide = intOperation((left, right) => left / right);
const exponentiate = intOperation((left, right) => left ** right);
const concat = stringOperation((left, right) => left + right);
const lessThan = intBoolOperation((left, right) => left < right);
const greaterThan = intBoolOperation((left, right) => left > right);
const equals = stringBoolOperation((left, right) => left === right);
const lessThanEquals = intBoolOperation((left, right) => left <= right);
const greaterThanEquals = intBoolOperation((left, right) => left >= right);
const notEquals = stringBoolOperation((left, right) => left !== right);
const and = intOperation((left, right) => left & right);
const or = intOperation((left, right) => left | right);
const xor = intOperation((left, right) => left ^ right);
const notGreaterThan = lessThanEquals;
const notLessThan = greaterThanEquals;

function evaluateBinaryExpression(
  expression: inst.BinaryExpressionInstruction,
  context: InterpreterContext,
): ScalarValue {
  const left = evaluateExpression(expression.left, context);
  const right = evaluateExpression(expression.right, context);
  if (!isScalarValue(left) || !isScalarValue(right)) {
    return defaultEmptyValue;
  }
  return applyBinaryOperation(left, right, expression.operator);
}

function applyBinaryOperation(
  left: ScalarValue,
  right: ScalarValue,
  operator: ast.BinaryOperator | null,
): ScalarValue {
  switch (operator) {
    case ast.BinaryOperator.Plus:
      return plus(left, right);
    case ast.BinaryOperator.Minus:
      return minus(left, right);
    case ast.BinaryOperator.Star:
      return multiply(left, right);
    case ast.BinaryOperator.Slash:
      return divide(left, right);
    case ast.BinaryOperator.StarStar:
      return exponentiate(left, right);
    case ast.BinaryOperator.PipePipe:
      return concat(left, right);
    case ast.BinaryOperator.LessThan:
      return lessThan(left, right);
    case ast.BinaryOperator.LessThanEquals:
      return lessThanEquals(left, right);
    case ast.BinaryOperator.GreaterThan:
      return greaterThan(left, right);
    case ast.BinaryOperator.GreaterThanEquals:
      return greaterThanEquals(left, right);
    case ast.BinaryOperator.Equals:
      return equals(left, right);
    case ast.BinaryOperator.NotEquals:
      return notEquals(left, right);
    case ast.BinaryOperator.Ampersand:
      return and(left, right);
    case ast.BinaryOperator.Pipe:
      return or(left, right);
    case ast.BinaryOperator.Not:
      return xor(left, right);
    case ast.BinaryOperator.NotLessThan:
      return notLessThan(left, right);
    case ast.BinaryOperator.NotGreaterThan:
      return notGreaterThan(left, right);
  }
  return zero;
}

function evaluateUnaryExpression(
  expression: inst.UnaryExpressionInstruction,
  context: InterpreterContext,
): ScalarValue {
  const operand = evaluateExpression(expression.operand, context);
  if (!isScalarValue(operand)) {
    // TODO: report error for array operand in unary expression
    // Thought: Maybe as part of the type system instead?
    return defaultEmptyValue;
  }
  switch (expression.operator) {
    case ast.UnaryOperator.Plus:
      return operand;
    case ast.UnaryOperator.Minus:
      return numberToValue(-valueToNumber(operand, 0));
    case ast.UnaryOperator.Not:
      return boolToValue(!valueToBool(operand));
  }
  return zero;
}

const defaultEmptyValue: ScalarValue = {
  type: inst.DeclaredType.Character,
  value: "",
};
const unsetVariable: ScalarValue = {
  type: inst.DeclaredType.Character,
  value: "",
};
const zero = numberToValue(0);

function evaluateReferenceExpression(
  expression: inst.ReferenceItemInstruction,
  context: InterpreterContext,
): Value {
  const variable = getVariable(context, expression.variable);
  if (!variable) {
    // Get user declared procedures
    const procedure = context.procedures.get(expression.variable);
    if (!procedure) {
      // It might still be a builtin procedure
      const builtin = builtinImplementations.get(expression.variable);
      if (builtin) {
        return evaluateBuiltin(builtin, expression.args, context);
      }
      return defaultEmptyValue;
    }
    return evaluateProcedure(procedure, expression.args, context);
  }
  return evaluateValueAccess(variable, expression.args, context).getter();
}

function evaluateBuiltin(
  builtin: PreprocessorBuiltin,
  args: inst.ExpressionInstruction[],
  context: InterpreterContext,
): Value {
  const evaluatedArgs = args.map((e) => evaluateExpression(e, context));
  return builtin(context, evaluatedArgs);
}

interface ValueAccess {
  getter: () => Value;
  setter: (value: Value) => void;
}

function evaluateValueAccess(
  variable: Variable,
  args: inst.ExpressionInstruction[],
  context: InterpreterContext,
): ValueAccess {
  const empty: ValueAccess = {
    getter: () => defaultEmptyValue,
    setter: () => {}, // Do nothing
  };
  if (args.length === 0) {
    // If there are no args, we simply return the variable value
    return {
      getter: () => variable.value,
      setter: (val) => {
        variable.value = val;
      },
    };
  } else {
    // Note: If any arguments are specified for the variable, we need to go through all of them
    // In case the variable is a "shorter" or "longer" array (i.e. the arguments don't fit), simply return *empty*
    // The type system should report the error on the type level
    if (!isArrayValue(variable.value)) {
      // If the variable is not an array, we cannot index into it
      return empty;
    }
    let variableValue = variable.value;
    for (let i = 0; i < args.length; i++) {
      const arg = evaluateExpression(args[i], context);
      const numValue = valueToNumber(arg);
      if (numValue === undefined) {
        // If the argument is not a number, we cannot index into the array
        // It seems like the compiler reports IBM3948I in that case
        return empty;
      }
      if (numValue < variableValue.lower) {
        // TODO: Report IBM3789I
        return empty;
      } else if (numValue > variableValue.upper) {
        // TODO: Report IBM3790I
        return empty;
      }
      const indexedValue = variableValue.array[numValue - variableValue.lower];
      // If we have evaluated all arguments
      if (i === args.length - 1) {
        if (isArrayValue(indexedValue)) {
          // TODO: Report IBM3793I (in the type system?)
          return empty;
        } else {
          return {
            getter: () => indexedValue,
            setter: (val) => {
              variableValue.array[numValue - variableValue.lower] = val;
            },
          };
        }
      } else if (isScalarValue(indexedValue)) {
        // TODO: Report IBM3794I (in the type system?)
        return empty;
      } else {
        variableValue = indexedValue;
      }
    }
    return empty;
  }
}

function evaluateProcedure(
  procedure: inst.ProcedureInstructionContainer,
  args: inst.ExpressionInstruction[],
  context: InterpreterContext,
): Value {
  const procArgs = args.map((e) => evaluateExpression(e, context));
  const localContext = createLocalContext(context, procedure);
  return runProcedure(procedure, procArgs, localContext);
}

function createLocalContext(
  context: InterpreterContext,
  procedure: inst.ProcedureInstructionContainer,
): InterpreterContext {
  return {
    ...context,
    symbols: {
      variables: new Map(),
      doType3: new Map(),
      parent: context.symbols,
    },
    macname: procedure.names[0] || "",
  };
}

function runProcedure(
  procedure: inst.ProcedureInstructionContainer,
  args: Value[],
  context: InterpreterContext,
): Value {
  if (!context.symbols.parent) {
    throw new Error(
      "Local variables map is not initialized! Use the createLocalContext function before calling runProcedure!",
    );
  }

  // Note that in case a procedure has received too many arguments, the excess ones are ignored
  for (let i = 0; i < procedure.parameters.length; i++) {
    const param = procedure.parameters[i];
    // In case a variable hasn't been supplied, use the special "unsetVariable"
    const arg = args[i] ?? unsetVariable;
    const variable: Variable = {
      name: param,
      value: arg,
      active: false,
      mode: ast.ScanMode.NOSCAN,
      declarationNode: null,
    };
    context.symbols.variables.set(variable.name, variable);
  }
  doRunInstructionsSync(context, procedure.node);
  const returnValue = context.returnValue;
  context.returnValue = defaultEmptyValue;
  return returnValue;
}

function evaluateLiteralExpression(
  expression: inst.NumberInstruction | inst.StringInstruction,
  context: InterpreterContext,
): ScalarValue {
  return {
    type:
      expression.kind === inst.InstructionKind.String
        ? inst.DeclaredType.Character
        : inst.DeclaredType.Fixed,
    value: expression.value,
  };
}

function runDeclareInstruction(
  instruction: inst.DeclareInstruction,
  context: InterpreterContext,
): void {
  // If a declaration like `DCL PROC_NAME ENTRY` appears, simply activate the procedure
  if (context.procedures.has(instruction.name)) {
    context.activeProcedures.add(instruction.name);
    return;
  }
  // Consider variables declared in a procedure call
  // and don't override existing variables
  const variables = context.symbols.variables;
  if (!variables.has(instruction.name)) {
    const variable = generateVariable(instruction, context);
    variables.set(variable.name, variable);
  }
}

function runActivateInstruction(
  instruction: inst.ActivateInstruction,
  context: InterpreterContext,
): void {
  const name = instruction.variable.variable;
  // ACTIVATE only works on global variables
  const variable = context.global.variables.get(name);
  if (variable) {
    if (instruction.scanMode !== undefined) {
      variable.mode = instruction.scanMode;
    }
    // TODO: Report IBM3530I if the variable is an array
    variable.active = true;
  } else if (context.procedures.has(name)) {
    // Only activate the specified procedure name, even if the procedure has multiple names
    // The compiler will not activate the other names of the procedure
    context.activeProcedures.add(name);
  }
}

function runDeactivateInstruction(
  instruction: inst.DeactivateInstruction,
  context: InterpreterContext,
): void {
  const name = instruction.variable.variable;
  // DEACTIVATE only works on global variables
  const variable = context.global.variables.get(name);
  context.activeProcedures.delete(name);
  if (variable) {
    variable.active = false;
  }
}

function runCompoundInstruction(
  instruction: inst.CompoundInstruction,
  context: InterpreterContext,
  node: inst.InstructionNode,
): void {
  for (const subInstruction of instruction.instructions) {
    try {
      const result = runInstructionSync(subInstruction, context, node);
      if (result) {
        throw new Error(
          `Only non-jump instructions are allowed in a compound instruction. Found: ${subInstruction.kind}`,
        );
      }
    } catch (err) {
      handleInstructionError(err, context);
    }
  }
}

function runTokenInstruction(
  instruction: inst.TokensInstruction,
  context: InterpreterContext,
): void {
  const tokens = instruction.tokens;
  let i = 0;
  const length = tokens.length;
  while (i < length) {
    const result = performTokenScan(tokens, i, context);
    if (result) {
      // Replace the token with the scan result
      // i.e. the variable content, recursively replaced
      mergePush(context.tokens, result.tokens, i === 0);
      i += result.advance;
    } else {
      // If the scan found no active variable, push the original token
      mergePush(context.tokens, [tokens[i]], i === 0);
      i++;
    }
  }
}

function mergePush(target: Token[], source: Token[], firstSource: boolean) {
  if (firstSource && source.length > 0) {
    const prefix = target[target.length - 1];
    if (prefix && prefix.immediateFollow) {
      target.pop();
      const firstToken = source.shift();
      const mergedTokens = lex(prefix.image + (firstToken?.image ?? ""));
      setImmediateFollowProperty(firstToken?.immediateFollow, mergedTokens);
      largePush(target, mergedTokens);
      largePush(target, source);
      return;
    }
  }
  largePush(target, source);
}

function largePush<T>(target: T[], source: T[]): void {
  if (source.length < 100_100) {
    // If the source array is small enough, we can use the spread operator
    // to push the items into the target array
    target.push(...source);
  } else {
    // This is a workaround for the V8 engine's limit on the number of arguments
    // that can be passed to a function. We use this to push large arrays into
    // the result array.
    for (const item of source) {
      target.push(item);
    }
  }
}

function replaceTokensInText(
  tokens: Token[],
  context: InterpreterContext,
): Token[] {
  let i = 0;
  const length = tokens.length;
  const tokenList: Token[] = [];
  while (i < length) {
    const result = performTokenScan(tokens, i, context);
    if (result) {
      // Replace the token with the scan result
      // i.e. the variable content, recursively replaced
      largePush(tokenList, result.tokens);
      i += result.advance;
    } else {
      // If the scan found no active variable, push the original token
      tokenList.push(tokens[i++]);
    }
  }
  return tokenList;
}

interface TokenScanResult {
  tokens: Token[];
  advance: number;
}

function performTokenScan(
  tokens: Token[],
  index: number,
  context: InterpreterContext,
): TokenScanResult | undefined {
  const callToken = tokens[index];
  const image = callToken.image;
  const procedure = context.procedures.get(image);
  // Token scan can only take global variables into account (because it cannot run inside of a procedure)
  const variable = context.global.variables.get(image);
  let refNode: ast.SyntaxNode | undefined = undefined;
  let value: Value | undefined = undefined;
  let advance: number = 1;
  let immediateFollow = callToken.immediateFollow;
  if (procedure && context.activeProcedures.has(image)) {
    const label = procedure.labels.get(image);
    refNode = label;
    const procedureParseResult = parseAndEvaluateProcedure(
      tokens,
      index,
      procedure,
      context,
    );
    value = procedureParseResult.value;
    advance = procedureParseResult.advance;
    immediateFollow = procedureParseResult.immediateFollow;
  } else if (variable?.active) {
    refNode = variable.declarationNode ?? undefined;
    value = variable.value;
  }
  if (callToken.uri && refNode) {
    // If the token has a URI, we assume it actually exists in the source code
    // We can now create a synthetic reference to the variable/procedure for it
    callToken.element = generateSyntheticRefItem(callToken, refNode, context);
    callToken.kind = CstNodeKind.ReferenceItem_Ref;
  }
  if (!value || !isScalarValue(value)) {
    // Cannot replace tokens for array variables
    // TODO: There is a warning/error for this, that should be reported
    return undefined;
  }
  if (advance < 1) {
    throw new Error("Advance must be at least 1");
  }
  return {
    tokens: replaceTokenWithValue(value.value, immediateFollow, context),
    advance,
  };
}

interface InlineProcedureEvaluationResult {
  value: Value | undefined;
  advance: number;
  immediateFollow: boolean;
}

function parseAndEvaluateProcedure(
  tokens: Token[],
  index: number,
  procedure: inst.ProcedureInstructionContainer,
  context: InterpreterContext,
): InlineProcedureEvaluationResult {
  let evaluatedArgs: Value[];
  let advance = 1;
  let immediateFollow = tokens[index].immediateFollow;
  if (!procedure.statement) {
    const parseResult = parseInlineProcedureInvocation(tokens, index);
    advance = parseResult.advance;
    immediateFollow = parseResult.immediateFollow;
    evaluatedArgs = evaluatePositionalArguments(parseResult.args, context);
  } else {
    const parseResult = parseInlineStatementProcedureInvocation(tokens, index);
    advance = parseResult.advance;
    immediateFollow = parseResult.immediateFollow;
    evaluatedArgs = evaluatePositionalArguments(
      parseResult.positionalArgs,
      context,
    );
    evaluateNamedArguments(
      evaluatedArgs,
      parseResult.namedArgs,
      procedure.parameters,
      context,
    );
  }
  const localContext = createLocalContext(context, procedure);
  let value = runProcedure(procedure, evaluatedArgs, localContext);
  const tokenAfterProcedureCall = tokens[index + advance];
  if (isScalarValue(value) && immediateFollow && tokenAfterProcedureCall) {
    // Add the token after the procedure call to the value, as it was immediately following the procedure call
    // Otherwise, the token will be treated separately, which is not the intended behavior
    value = stringToValue(value.value + tokenAfterProcedureCall.originalImage);
    advance++;
    immediateFollow = tokenAfterProcedureCall.immediateFollow;
  }
  return {
    value,
    advance,
    immediateFollow,
  };
}

function evaluatePositionalArguments(
  args: InlineProcedureArgument[],
  context: InterpreterContext,
): Value[] {
  const evaluatedArgs: Value[] = [];
  for (const argTokens of args) {
    const replacedTokens = replaceTokensInText(argTokens, context);
    const text = stringifyTokens(replacedTokens);
    evaluatedArgs.push(stringToValue(text));
  }
  return evaluatedArgs;
}

function evaluateNamedArguments(
  args: Value[],
  namedArgs: Map<string, InlineProcedureNamedArgument>,
  procParams: string[],
  context: InterpreterContext,
): void {
  const usedParams = new Set<string>();
  for (let i = 0; i < procParams.length; i++) {
    const param = procParams[i];
    usedParams.add(param);
    const argTokens = namedArgs.get(param);
    if (argTokens) {
      const replacedTokens = replaceTokensInText(argTokens.tokens, context);
      const text = stringifyTokens(replacedTokens);
      args[i] = stringToValue(text);
    } else if (i >= args.length) {
      // No argument specified for this parameter, use the unset variable
      args[i] = unsetVariable;
    }
  }
  for (const [name, argTokens] of namedArgs) {
    // If the named argument doesn't match any parameter, report an error
    if (!usedParams.has(name)) {
      context.diagnostics.push(
        diagnosticFromCode(
          PLICodes.Error.IBM3581I,
          argTokens.nameToken,
          argTokens.nameToken.image,
        ),
      );
    }
  }
}

function stringifyTokens(tokens: Token[]): string {
  let text = "";
  for (const token of tokens) {
    text += token.image;
    if (!token.immediateFollow) {
      text += " ";
    }
  }
  return text.trimEnd();
}

type InlineProcedureArgument = Token[];

interface InlineProcedureParseResult {
  args: InlineProcedureArgument[];
  advance: number;
  immediateFollow: boolean;
}

function parseInlineProcedureInvocation(
  tokens: Token[],
  index: number,
): InlineProcedureParseResult {
  const args: InlineProcedureArgument[] = [];
  let currentArg: Token[] = [];
  let advance = 1;
  let immediateFollow = false;
  let parenDepth = 1;
  let i = index + 1; // Start after the procedure name
  const nextToken = tokens[i++];
  if (!nextToken || !tokenMatcher(nextToken, PreprocessorTokens.LParen)) {
    // No opening parenthesis, so no arguments
    return {
      args: [],
      advance,
      immediateFollow: tokens[index].immediateFollow,
    };
  }
  // Opening parenthesis found, start parsing arguments
  advance++;
  const length = tokens.length;
  while (i < length) {
    const token = tokens[i];
    advance++;
    if (tokenMatcher(token, PreprocessorTokens.LParen)) {
      parenDepth++;
    } else if (tokenMatcher(token, PreprocessorTokens.RParen)) {
      if (--parenDepth === 0) {
        // Closing parenthesis at the top level, end of argument list
        args.push(currentArg);
        immediateFollow = token.immediateFollow;
        i++;
        break;
      }
    }
    if (tokenMatcher(token, PreprocessorTokens.Comma) && parenDepth === 1) {
      // Argument separator at the top level
      args.push(currentArg);
      currentArg = [];
    } else {
      currentArg.push(token);
    }
    i++;
  }
  return {
    args,
    advance,
    immediateFollow,
  };
}

interface InlineProcedureNamedArgument {
  nameToken: Token;
  tokens: Token[];
}

interface InlineStatementProcedureParseResult {
  positionalArgs: InlineProcedureArgument[];
  namedArgs: Map<string, InlineProcedureNamedArgument>;
  advance: number;
  immediateFollow: boolean;
}

function parseInlineStatementProcedureInvocation(
  tokens: Token[],
  index: number,
): InlineStatementProcedureParseResult {
  const positionalParseResult = parseInlineProcedureInvocation(tokens, index);
  // Advance by the amount of tokens consumed by the positional argument parser
  index += positionalParseResult.advance;
  // We can now start parsing named arguments
  const namedArgs: Map<string, InlineProcedureNamedArgument> = new Map();
  let advance = positionalParseResult.advance;
  let immediateFollow = positionalParseResult.immediateFollow;
  let i = index;
  const length = tokens.length;
  while (i < length) {
    const nextToken = tokens[i++];
    if (nextToken && tokenMatcher(nextToken, PreprocessorTokens.Semicolon)) {
      // End of procedure invocation
      immediateFollow = nextToken.immediateFollow;
      advance++;
      break;
    }
    if (!nextToken || !tokenMatcher(nextToken, PreprocessorTokens.Id)) {
      // Named argument must start with an identifier
      break;
    }
    advance++;
    immediateFollow = nextToken.immediateFollow;
    const openParenToken = tokens[i++];
    if (
      !openParenToken ||
      !tokenMatcher(openParenToken, PreprocessorTokens.LParen)
    ) {
      // Named argument must have an opening parenthesis after the name
      // If there is no opening parenthesis, we assume the argument has an empty value
      namedArgs.set(nextToken.image, {
        nameToken: nextToken,
        tokens: [],
      });
      break;
    }
    advance++;
    // Begin parsing the argument tokens until the closing parenthesis
    let parenDepth = 1;
    const argTokens: Token[] = [];
    while (i < length) {
      const token = tokens[i];
      if (tokenMatcher(token, PreprocessorTokens.LParen)) {
        parenDepth++;
      } else if (tokenMatcher(token, PreprocessorTokens.RParen)) {
        if (--parenDepth === 0) {
          // End of argument
          immediateFollow = token.immediateFollow;
          i++;
          advance++;
          break;
        }
      }
      argTokens.push(token);
      i++;
      advance++;
    }
    namedArgs.set(nextToken.image, {
      nameToken: nextToken,
      tokens: argTokens,
    });
  }
  return {
    positionalArgs: positionalParseResult.args,
    namedArgs,
    advance,
    immediateFollow,
  };
}

function replaceTokenWithValue(
  value: string,
  immediateFollow: boolean,
  context: InterpreterContext,
): Token[] {
  const tokens = lex(
    value,
    context.unit.compilerOptions.macroOptions?.rescan !==
      MacroCompilerOptions.Rescan.ASIS,
  );
  setImmediateFollowProperty(immediateFollow, tokens);
  return replaceTokensInText(tokens, context);
}

function generateSyntheticRefItem(
  token: Token,
  targetNode: ast.SyntaxNode,
  context: InterpreterContext,
): ast.ReferenceItem {
  const refItem = ast.createReferenceItem();
  // Set the container to the preprocessor AST
  // This ensures that the isPreprocessorNode check works correctly
  refItem.container = context.unit.preprocessorAst;
  const ref = ast.createReference<ast.NamedVariable>(
    refItem,
    token,
    ast.ReferenceType.Variable,
  );
  ref.node = targetNode as ast.NamedVariable;
  refItem.ref = ref;
  context.references.push(ref);
  return refItem;
}

function lex(text: string, caseUpper: boolean = true): Token[] {
  return tokenize(text, undefined, caseUpper).tokens;
}

function setImmediateFollowProperty(
  immediateFollow: boolean | undefined,
  tokens: Token[],
): void {
  if (immediateFollow && tokens.length > 0) {
    // The last token inherits the immediateFollow property of the original token
    tokens[tokens.length - 1].immediateFollow = true;
  }
}

async function runInscanInstruction(
  instruction: inst.InscanInstruction,
  context: InterpreterContext,
): Promise<void> {
  const value = evaluateReferenceExpression(instruction.variable, context);
  if (!isScalarValue(value)) {
    // Inscan cannot be used with array variables
    return Promise.resolve();
  }
  const filePath = await runInclude(
    {
      fileName: value.value,
      token: instruction.variable.reference?.token,
      idempotent: instruction.idempotent,
      sql: false,
    },
    context,
  );
  setFilePath(instruction.node, filePath, context);
}

async function runIncludeInstruction(
  instruction: inst.IncludeInstruction,
  context: InterpreterContext,
): Promise<void> {
  for (const item of instruction.items) {
    let includeItem: IncludeItem;
    if (ast.isIncludeItemFile(item)) {
      includeItem = {
        fileName: item.fileName,
        token: item.token,
        idempotent: instruction.idempotent,
        sql: item.sql,
      };
    } else if (ast.isIncludeItemMember(item)) {
      includeItem = {
        memberName: item.memberName,
        ddname: item.ddname,
        ddnameTokens: item.ddnameTokens,
        token: item.token,
        idempotent: instruction.idempotent,
      };
    } else {
      // not a valid include item (neither member nor fileName is present), skip it
      continue;
    }

    const filePath = await runInclude(includeItem, context);
    setFilePath(item, filePath, context);
  }
}

/**
 * Sets the filePath & relativeFilePath of the given item, if a filePath is provided
 * The relativeFilePath is calculated based on the currentUri in the context
 *
 * @param item Item to set the file paths for
 * @param filePath File path to set, if null, no changes are made
 * @param context Used for currentUri to calculate relative paths
 */
function setFilePath(
  item: { filePath: string | null; relativeFilePath: string | null },
  filePath: string | null,
  context: InterpreterContext,
): void {
  if (!filePath) return;
  item.filePath = filePath;
  if (!context.currentUri) return;
  const workspace = context.unit.services.workspace.config.getWorkspacePath();
  item.relativeFilePath = UriUtils.composeRelativePath(
    workspace.path,
    filePath,
  );
}

async function runInclude(
  item: IncludeItem,
  context: InterpreterContext,
): Promise<string | null> {
  const uri = await resolveIncludeFileUri(item, context);

  function failToResolve(error?: any): void {
    if (error) {
      console.log("Failed to resolve include file:", error);
    }
    let diagnostic: Diagnostic;
    if (!context.unit.processGroup && !context.unit.programConfig) {
      diagnostic = diagnosticFromCode(
        LspCodes.IncludeResolution.MissingConfiguration,
        item.token,
      );
    } else {
      // TODO: @wagner-laranjeiras - in case we have a config file with the right program but the wrong pgroup,
      // it triggers IBM1848I instead of offering to create a new config.
      diagnostic = diagnosticFromCode(
        PLICodes.Severe.IBM1848I,
        item.token,
        getFileNameOrPartialName(item)!,
      );
    }
    // check to set optional diagnostic data iff we have a valid fileName/memberName to work with
    if (isFileIncludeItem(item)) {
      // item w/ valid fileName
      diagnostic.data = {
        unresolvedFile: item.fileName,
        entryUri: context.entryUri.toString(),
      };
    } else if (isMemberIncludeItem(item)) {
      // item w/ memberName & optional ddname
      diagnostic.data = {
        unresolvedFile: getFileNameOrPartialName(item)!,
        entryUri: context.entryUri.toString(),
      };
    }
    context.diagnostics.push(diagnostic);
  }

  if (!uri) {
    failToResolve();
    return null;
  }

  if (item.idempotent && context.xIncludes.has(uri.toString())) {
    // Do nothing
    // TODO: Display a warning?
    return uri.toString();
  }

  context.xIncludes.add(uri.toString());

  if (context.uris.includes(uri.toString())) {
    failToResolve();
    return null;
  }

  try {
    const document = await TextDocuments.get(uri);

    if (!document) {
      throw new Error("Document not found after URI resolution.");
    }
    const content = document.getText();
    const cachedResult = await context.unit.instructionCache.get(
      uri,
      content,
      async () => {
        const processedContent =
          context.options.marginsProcessor.processMargins(
            {
              result: context.options.compilerOptions,
              text: content,
            },
            uri,
            context.unit.services.workspace,
          );
        const tokenizeResult = tokenize(processedContent, uri);
        const subState = new ParserState(tokenizeResult.tokens);
        const subProgram = await preprocessorParse(
          subState,
          document,
          context.options.compilerOptions?.options,
        );
        subProgram.diagnostics.push(...tokenizeResult.diagnostics);
        const result = generateInstructions(subProgram.statements);
        return {
          tokens: tokenizeResult.tokens,
          comments: tokenizeResult.comments,
          diagnostics: subProgram.diagnostics,
          statements: subProgram.statements,
          result,
        };
      },
    );
    context.statements.push(...cachedResult.statements);
    context.unit.services.files.set({
      textDocument: document,
      tokens: cachedResult.tokens,
      comments: cachedResult.comments,
      uri,
    });
    context.diagnostics.push(...cachedResult.diagnostics);
    for (const [key, value] of cachedResult.result.procedures.entries()) {
      context.procedures.set(key, value);
    }
    const newContext: InterpreterContext = {
      ...context,
      currentUri: uri,
      uris: [uri.toString(), ...context.uris],
    };
    await doRunInstructions(newContext, cachedResult.result.entryNode);
  } catch (err) {
    failToResolve(err);
  }
  return uri.toString();
}

type PreprocessorBuiltin = (
  context: InterpreterContext,
  // Use the correct typing to ensure that we always handle the case in which an argument is not provided
  args: (Value | undefined)[],
) => Value;

const builtinImplementations = new Map<string, PreprocessorBuiltin>();

let collate = "";
for (let i = 0; i < 256; i++) {
  collate += String.fromCharCode(i);
}
const collateValue = stringToValue(collate);
builtinImplementations.set("COLLATE", () => collateValue);

const commentRegex = /\/\*|\*\//g;
builtinImplementations.set("COMMENT", (_, args) => {
  const text = args[0];
  if (!text || !isScalarValue(text)) {
    return defaultEmptyValue;
  }
  // /* inside of comments should be replaced with />
  // */ inside of comments should be replaced with </
  const replacedText = text.value.replace(commentRegex, (match) =>
    match.charAt(0) === "/" ? "/>" : "</",
  );
  // The final comment should be surrounded by comment markers
  return stringToValue(`/*${replacedText}*/`);
});

// Simply use UNIX epoch time
// PLI expects no delimiters between the values
const compiledDate = ["1970", "01", "01", "00", "00", "00", "000"].join("");
builtinImplementations.set("COMPILEDDATE", () => stringToValue(compiledDate));

// From the reference: A leading zero in the day of the month field is replaced by a blank; no other leading zeros are suppressed.
const compileTime = " 1.JAN.70 00.00.00";
builtinImplementations.set("COMPILETIME", () => stringToValue(compileTime));

function copy(
  value: Value | undefined,
  repetitions: Value | undefined,
  plus: number,
): Value {
  if (!value || !isScalarValue(value) || !repetitions) {
    return defaultEmptyValue;
  }
  const repeatCount = valueToNumber(repetitions, 0) + plus;
  if (repeatCount === 0) {
    return defaultEmptyValue;
  }
  const repeatedText = value.value.repeat(repeatCount);
  return stringToValue(repeatedText);
}

builtinImplementations.set("COPY", (_, args) => {
  return copy(args[0], args[1], 0);
});

const maxCountVariable = 99999;
builtinImplementations.set("COUNTER", (context) => {
  const counterValue = context.counterValue++;
  if (counterValue >= maxCountVariable) {
    // Reset the counter
    context.counterValue = 1;
  }
  // Pad with leading zeroes
  // The counter value should be a 5-digit string
  const stringValue = counterValue.toString().padStart(5, "0");
  return stringToValue(stringValue);
});

function getArrayAtDim(
  value: Value,
  dimension: number,
): ArrayValue | undefined {
  while (dimension > 1) {
    if (isArrayValue(value)) {
      value = value.array[0];
      dimension--;
    } else {
      return undefined;
    }
  }
  if (isArrayValue(value)) {
    return value;
  }
  return undefined;
}

function getDim(value?: Value): number {
  let dimension = 1;
  if (value) {
    dimension = valueToNumber(value, 1);
    if (dimension < 1) {
      dimension = 1;
    }
  }
  return dimension;
}

builtinImplementations.set("DIMENSION", (_, args) => {
  const [arrayRef, dimension] = args;
  if (!arrayRef) {
    return zero;
  }
  const arrayValue = getArrayAtDim(arrayRef, getDim(dimension));
  if (arrayValue) {
    return numberToValue(arrayValue.array.length);
  } else {
    return zero;
  }
});

builtinImplementations.set("HBOUND", (_, args) => {
  const [arrayRef, dimension] = args;
  if (!arrayRef) {
    return zero;
  }
  const arrayValue = getArrayAtDim(arrayRef, getDim(dimension));
  if (arrayValue) {
    return numberToValue(arrayValue.upper);
  } else {
    return zero;
  }
});

builtinImplementations.set("INDEX", (_, args) => {
  const [target, search, start] = args;
  if (!target || !search) {
    return zero;
  }
  let startIndex = 0;
  if (start) {
    startIndex = valueToNumber(start, 1) - 1;
  }
  const targetValue = valueToString(target, "");
  const searchValue = valueToString(search, "");
  // The spec says: If y does not occur in x, or if either x or y have zero length, the value zero is returned.
  if (targetValue.length === 0 || searchValue.length === 0) {
    return zero;
  }
  // The index is 1-based in PLI
  const indexOfValue = targetValue.indexOf(searchValue, startIndex) + 1;
  return numberToValue(indexOfValue);
});

builtinImplementations.set("LBOUND", (_, args) => {
  const [arrayRef, dimension] = args;
  if (!arrayRef) {
    return zero;
  }
  const arrayValue = getArrayAtDim(arrayRef, getDim(dimension));
  if (arrayValue) {
    return numberToValue(arrayValue.lower);
  } else {
    return zero;
  }
});

builtinImplementations.set("LENGTH", (_, args) => {
  const arg = args[0];
  const stringValue = valueToString(arg, "");
  return numberToValue(stringValue.length);
});

builtinImplementations.set("LOWERCASE", (_, args) => {
  const arg = args[0];
  const stringValue = valueToString(arg, "");
  return stringToValue(stringValue.toLowerCase());
});

builtinImplementations.set("MACCOL", () => {
  // TODO: MACCOL returns a FIXED value that represents the column where the outermost macro invocation starts in the source text that contains the macro invocation.
  return zero;
});

builtinImplementations.set("MACLMAR", (context) => {
  const margins = context.unit.compilerOptions.margins;
  if (margins) {
    return numberToValue(margins.m);
  }
  return numberToValue(2);
});

builtinImplementations.set("MACNAME", (context) => {
  return stringToValue(context.macname);
});

builtinImplementations.set("MACRMAR", (context) => {
  const margins = context.unit.compilerOptions.margins;
  if (margins) {
    return numberToValue(margins.n);
  }
  return numberToValue(72);
});

builtinImplementations.set("MAX", (_, args) => {
  const numbers: number[] = [];
  for (const arg of args) {
    if (arg) {
      const num = valueToNumber(arg);
      if (num !== undefined) {
        numbers.push(num);
      }
    }
  }
  if (numbers.length === 0) {
    return zero;
  }
  return numberToValue(Math.max(...numbers));
});

builtinImplementations.set("MIN", (_, args) => {
  const numbers: number[] = [];
  for (const arg of args) {
    if (arg) {
      const num = valueToNumber(arg);
      if (num !== undefined) {
        numbers.push(num);
      }
    }
  }
  if (numbers.length === 0) {
    return zero;
  }
  return numberToValue(Math.min(...numbers));
});

builtinImplementations.set("PARMSET", (_, args) => {
  // PARMSET returns a BIT value indicating if a specified parameter was set on invocation of the procedure.
  const paramName = args[0];
  if (!paramName || paramName === unsetVariable) {
    return zero;
  } else {
    return boolToValue(true);
  }
});

builtinImplementations.set("QUOTE", (_, args) => {
  const value = args[0];
  if (!value) {
    return stringToValue('""');
  }
  const textValue = valueToString(value, "").replace(/"/g, '""');
  return stringToValue(`"${textValue}"`);
});

builtinImplementations.set("REPEAT", (_, args) => {
  // Same as copy, but with an additional repetition
  return copy(args[0], args[1], 1);
});

builtinImplementations.set("SUBSTR", (_, args) => {
  const [value, start, length] = args;
  if (!value || !isScalarValue(value)) {
    return defaultEmptyValue;
  }
  // SUBSTR is 1-based
  const startIndex = valueToNumber(start, 1) - 1;
  const lengthValue = length ? valueToNumber(length) : undefined;
  const end = lengthValue !== undefined ? startIndex + lengthValue : undefined;
  const stringValue = valueToString(value, "");
  const substring = stringValue.substring(startIndex, end);
  return stringToValue(substring);
});

builtinImplementations.set("SYSDIMSIZE", (context) => {
  // SYSDIMSIZE returns a FIXED value that indicates the maximum number of bytes that is needed to hold an index for an array permitted under the compiler CMPAT option.
  // The possible return values are as follows:
  // * 4 under CMPAT(V2) and CMPAT(LE)
  // * 8 under CMPAT(V3)
  const cmpat = context.unit.compilerOptions.cmpat;
  return numberToValue(cmpat === PliCompilerOptions.CMPat.V3 ? 8 : 4);
});

builtinImplementations.set("SYSOFFSETSIZE", () => {
  // SYSOFFSETSIZE returns a FIXED value that indicates the number of bytes needed to hold an OFFSET.
  // ALWAYS returns 4.
  return numberToValue(4);
});

builtinImplementations.set("SYSPARM", (context) => {
  const symparm = context.unit.compilerOptions.sysParm;
  return stringToValue(symparm);
});

builtinImplementations.set("SYSPOINTERSIZE", (context) => {
  const lp = context.unit.compilerOptions.LP;
  return numberToValue(lp === PliCompilerOptions.LP.LP64 ? 8 : 4);
});

builtinImplementations.set("SYSTEM", (context) => {
  const systemInfo = context.unit.compilerOptions.system;
  return stringToValue(PliCompilerOptions.System[systemInfo]);
});

builtinImplementations.set("SYSVERSION", () => {
  // SYSVERSION returns a CHARACTER string containing the product name as well as the version, release, and modification level.
  return stringToValue("PL/I for z/OS V6.R1.M0");
});

builtinImplementations.set("TRANSLATE", (_, args) => {
  const [toTranslate, toCharset, fromCharset] = args;
  const toTranslateValue = valueToString(toTranslate);
  if (!toTranslateValue) {
    return defaultEmptyValue;
  }
  const toCharsetValue = valueToString(toCharset, "");
  const fromCharsetValue = valueToString(fromCharset, "") || collate;
  const translationMap = new Map<string, string>();
  for (let i = 0; i < fromCharsetValue.length; i++) {
    const from = fromCharsetValue[i];
    if (!translationMap.has(from)) {
      const to = toCharsetValue[i] || " ";
      translationMap.set(from, to);
    }
  }
  let result = "";
  for (let i = 0; i < toTranslateValue.length; i++) {
    const char = toTranslateValue[i];
    const translatedChar = translationMap.get(char) || char;
    result += translatedChar;
  }
  return stringToValue(result);
});

builtinImplementations.set("TRIM", (_, args) => {
  const [value, start, end] = args;
  if (!value || !isScalarValue(value)) {
    return defaultEmptyValue;
  }
  const startTrimChars = valueToString(start, " ");
  const endTrimChars = valueToString(end, " ");
  const startSet = new Set(startTrimChars.split(""));
  const endSet = new Set(endTrimChars.split(""));
  const stringValue = valueToString(value, "");
  let startIndex = 0;
  let endIndex = stringValue.length;
  while (startIndex < endIndex && startSet.has(stringValue[startIndex])) {
    startIndex++;
  }
  while (endIndex > startIndex && endSet.has(stringValue[endIndex - 1])) {
    endIndex--;
  }
  const trimmed = stringValue.substring(startIndex, endIndex);
  return stringToValue(trimmed);
});

builtinImplementations.set("UPPERCASE", (_, args) => {
  const arg = args[0];
  const stringValue = valueToString(arg, "");
  return stringToValue(stringValue.toUpperCase());
});

builtinImplementations.set("VERIFY", (_, args) => {
  // VERIFY returns a FIXED value indicating the position in x of the leftmost character that is not in y.
  // It also allows you to specify the location within x at which to begin processing.
  const [x, y, n] = args;
  const xValue = valueToString(x, "");
  const yValue = valueToString(y, "");
  const nValue = valueToNumber(n, 1) - 1;
  const ySet = new Set(yValue.split(""));
  for (let i = nValue; i < xValue.length; i++) {
    if (!ySet.has(xValue[i])) {
      // String indices are 1-based in PLI
      return numberToValue(i + 1);
    }
  }
  return zero;
});
