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

import { TextDocuments } from "../language-server/text-documents";
import { Token } from "../parser/tokens";
import { URI, UriUtils } from "../utils/uri";
import { CompilationUnitTokens } from "../workspace/compilation-unit";
import { FileSystemProviderInstance } from "../workspace/file-system-provider";
import { PluginConfigurationProviderInstance } from "../workspace/plugin-configuration-provider";
import { CompilerOptionResult } from "./compiler-options/options";
import { generateInstructions } from "./instruction-generator";
import * as inst from "./instructions";
import * as ast from "../syntax-tree/ast";
import { LexingError } from "./pli-lexer";
import { MarginsProcessor } from "./pli-margins-processor";
import { PreprocessorError } from "./pli-preprocessor-error";
import { PliPreprocessorLexer } from "./pli-preprocessor-lexer";
import { PliPreprocessorLexerState } from "./pli-preprocessor-lexer-state";
import { PliPreprocessorParser } from "./pli-preprocessor-parser";
import { CstNodeKind } from "../syntax-tree/cst";

interface Variable {
  name: string;
  value: Value;
  declarationNode?: ast.SyntaxNode | null;
  mode: inst.ScanMode;
  active: boolean;
}

interface Value {
  // Preprocessor variables are always strings or numbers.
  // We store them as strings for simplicity and convert them as needed based on the type.
  value: string;
  type: inst.DeclaredType;
}

function generateVariable(instruction: inst.DeclareInstruction): Variable {
  return {
    name: instruction.name,
    // Initial value is empty or 0 (for numbers)
    value: {
      value: instruction.type === inst.DeclaredType.Character ? "" : "0",
      type: instruction.type,
    },
    declarationNode: instruction.node,
    mode: instruction.mode,
    // NOSCAN means the variable is not active
    active: instruction.mode !== inst.ScanMode.NoScan,
  };
}

export enum IfEvaluationResult {
  True = 1,
  False = 2,
  Both = 3,
}

export interface EvaluationResults {
  ifStatements: Map<ast.IfStatement, IfEvaluationResult>;
}

interface InterpreterContext {
  uri?: URI;
  variables: Map<string, Variable>;
  result: CompilationUnitTokens;
  errors: LexingError[];
  counter: Map<inst.InstructionNode, number>;
  references: ast.Reference[];
  evaluations: EvaluationResults;
  xIncludes: Set<string>;
  uris: string[];
  options: InterpreterOptions;
}

export type InstructionInterpreterResult = CompilationUnitTokens & {
  evaluationResults: EvaluationResults;
  errors: LexingError[];
  references: ast.Reference[];
};

// TODO: We need this just because those services aren't functions yet
// Eventually, these should become functions as well
export interface InterpreterOptions {
  compilerOptions: CompilerOptionResult | undefined;
  marginsProcessor: MarginsProcessor;
  parser: PliPreprocessorParser;
}

export function runInstructions(
  uri: URI,
  start: inst.InstructionNode,
  options: InterpreterOptions,
): InstructionInterpreterResult {
  const context: InterpreterContext = {
    uri,
    uris: [uri.toString()],
    errors: [],
    xIncludes: new Set(),
    variables: new Map(),
    references: [],
    evaluations: {
      ifStatements: new Map(),
    },
    result: {
      all: [],
      fileTokens: {},
    },
    options,
    counter: new Map(),
  };

  const tokenResult = doRunInstructions(context, start);
  return {
    ...tokenResult,
    evaluationResults: context.evaluations,
    errors: context.errors,
    references: context.references,
  };
}

const MAX_INSTRUCTION_COUNTER = 5000;

export function doRunInstructions(
  context: InterpreterContext,
  start: inst.InstructionNode,
): CompilationUnitTokens {
  let currentNode: inst.InstructionNode | undefined = start;
  while (currentNode) {
    const value = context.counter.get(currentNode) || 0;
    // Prevent infinite loops by limiting the number of iterations
    if (value > MAX_INSTRUCTION_COUNTER) {
      console.log("Long running preprocessor code detected. Stopping.");
      return context.result;
    }
    context.counter.set(currentNode, value + 1);
    currentNode = runInstructionNode(currentNode, context);
  }
  return context.result;
}

function runInstructionNode(
  node: inst.InstructionNode,
  context: InterpreterContext,
): inst.InstructionNode | undefined {
  const instruction = node.instruction;
  let result = node.next;
  try {
    if (node.instruction.kind === inst.InstructionKind.Halt) {
      return undefined; // Stop execution
    }
    const instructionResult = runInstruction(instruction, context);
    if (instructionResult) {
      result = instructionResult;
    }
  } catch (err) {
    handleInstructionError(err, context);
  }
  return result;
}

function handleInstructionError(err: any, context: InterpreterContext): void {
  if (err instanceof PreprocessorError) {
    context.errors.push(err);
  } else {
    console.error("Unhandled error in instruction interpreter:", err);
  }
}

function runInstruction(
  instruction: inst.Instruction,
  context: InterpreterContext,
): inst.InstructionNode | undefined {
  switch (instruction.kind) {
    case inst.InstructionKind.Assignment:
      runAssignmentInstruction(instruction, context);
      break;
    case inst.InstructionKind.Tokens:
      runTokenInstruction(instruction, context);
      break;
    case inst.InstructionKind.Compound:
      runCompoundInstruction(instruction, context);
      break;
    case inst.InstructionKind.Goto:
      return instruction.node;
    case inst.InstructionKind.If:
      return runIfInstruction(instruction, context);
    case inst.InstructionKind.Do:
      return runDoInstruction(instruction, context);
    case inst.InstructionKind.Include:
      runIncludeInstruction(instruction, context);
      break;
    case inst.InstructionKind.Inscan:
      runInscanInstruction(instruction, context);
      break;
    case inst.InstructionKind.Declare:
      runDeclareInstruction(instruction, context);
      break;
    case inst.InstructionKind.Activate:
      runActivateInstruction(instruction, context);
      break;
    case inst.InstructionKind.Deactivate:
      runDeactivateInstruction(instruction, context);
      break;
  }
  return undefined;
}

function runDoInstruction(
  instruction: inst.DoInstruction,
  context: InterpreterContext,
): inst.InstructionNode | undefined {
  let condition = true;
  if (instruction.doType2) {
    const type2 = instruction.doType2;
    if (type2.until) {
      // If UNTIL is specified, we don't run the instruction if it evaluates to true
      condition &&= !valueToBool(evaluateExpression(type2.until, context));
    }
    if (type2.while) {
      // If WHILE is specified, we only run the instruction if it evaluates to true
      condition &&= valueToBool(evaluateExpression(type2.while, context));
    }
  }
  if (instruction.doType3) {
    throw new Error("DoType3 instructions are not implemented yet!");
  }
  if (condition) {
    return instruction.content;
  }
  return undefined;
}

function runAssignmentInstruction(
  instruction: inst.AssignmentInstruction,
  context: InterpreterContext,
): void {
  const value = evaluateExpression(instruction.value, context);
  for (const ref of instruction.refs) {
    let variable = context.variables.get(ref.variable);
    if (!variable) {
      variable = {
        name: ref.variable,
        declarationNode: ref.reference?.owner,
        value,
        active: false, // Implicitly declared variables are inactive by default
        mode: inst.ScanMode.Scan,
      };
      context.variables.set(ref.variable, variable);
    } else {
      // Currently, we simply assume that a user has used `=` as the assignment operator
      // TODO: Add more assignment operators in a separate PR.
      variable.value = value;
    }
  }
}

function runIfInstruction(
  instruction: inst.IfInstruction,
  context: InterpreterContext,
): inst.InstructionNode | undefined {
  const condition = evaluateExpression(instruction.condition, context);
  const existing = context.evaluations.ifStatements.get(instruction.element);
  if (valueToBool(condition)) {
    context.evaluations.ifStatements.set(
      instruction.element,
      existing ? IfEvaluationResult.Both : IfEvaluationResult.True,
    );
    return instruction.trueBranch;
  } else {
    context.evaluations.ifStatements.set(
      instruction.element,
      existing ? IfEvaluationResult.Both : IfEvaluationResult.False,
    );
    return instruction.falseBranch;
  }
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

type ValueOperation = (left: Value, right: Value) => Value;

function intOperation(
  callback: (left: number, right: number) => number,
): ValueOperation {
  return (left: Value, right: Value) => {
    return valueToNumber(
      callback(parseInt(left.value), parseInt(right.value)).toString(),
    );
  };
}

function intBoolOperation(
  callback: (left: number, right: number) => boolean,
): ValueOperation {
  return (left: Value, right: Value) => {
    return boolToValue(callback(parseInt(left.value), parseInt(right.value)));
  };
}

function stringOperation(
  callback: (left: string, right: string) => string,
): ValueOperation {
  return (left: Value, right: Value) => {
    return valueToString(callback(left.value, right.value));
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
const equals = intBoolOperation((left, right) => left === right);
const lessThanEquals = intBoolOperation((left, right) => left <= right);
const greaterThanEquals = intBoolOperation((left, right) => left >= right);
const notEquals = intBoolOperation((left, right) => left !== right);
const and = intOperation((left, right) => left & right);
const or = intOperation((left, right) => left | right);
const xor = intOperation((left, right) => left ^ right);
const notGreaterThan = lessThanEquals;
const notLessThan = greaterThanEquals;

function evaluateBinaryExpression(
  expression: inst.BinaryExpressionInstruction,
  context: InterpreterContext,
): Value {
  const left = evaluateExpression(expression.left, context);
  const right = evaluateExpression(expression.right, context);
  switch (expression.operator) {
    case "+":
      return plus(left, right);
    case "-":
      return minus(left, right);
    case "*":
      return multiply(left, right);
    case "/":
      return divide(left, right);
    case "**":
      return exponentiate(left, right);
    case "||":
      return concat(left, right);
    case "<":
      return lessThan(left, right);
    case "<=":
      return lessThanEquals(left, right);
    case ">":
      return greaterThan(left, right);
    case ">=":
      return greaterThanEquals(left, right);
    case "=":
      return equals(left, right);
    case "^=":
    case "<>":
      return notEquals(left, right);
    case "&":
      return and(left, right);
    case "|":
      return or(left, right);
    case "^":
      return xor(left, right);
    case "^<":
      return notLessThan(left, right);
    case "^>":
      return notGreaterThan(left, right);
  }
  return valueToNumber("0");
}

function evaluateUnaryExpression(
  expression: inst.UnaryExpressionInstruction,
  context: InterpreterContext,
): Value {
  const operand = evaluateExpression(expression.operand, context);
  switch (expression.operator) {
    case "+":
      return operand;
    case "-":
      return valueToNumber((-parseInt(operand.value)).toString());
    case "^":
      return boolToValue(!valueToBool(operand));
  }
  return valueToNumber("0");
}

function evaluateReferenceExpression(
  expression: inst.ReferenceItemInstruction,
  context: InterpreterContext,
): Value {
  const variable = context.variables.get(expression.variable);
  return variable
    ? variable.value
    : {
        type: inst.DeclaredType.Character,
        value: "",
      };
}

function evaluateLiteralExpression(
  expression: inst.NumberInstruction | inst.StringInstruction,
  context: InterpreterContext,
): Value {
  return {
    type:
      expression.kind === inst.InstructionKind.String
        ? inst.DeclaredType.Character
        : inst.DeclaredType.Fixed,
    value: expression.value,
  };
}

function boolToString(value: boolean): string {
  return value ? "1" : "0";
}

function boolToValue(value: boolean): Value {
  return {
    type: inst.DeclaredType.Fixed,
    value: boolToString(value),
  };
}

function valueToBool(value: Value): boolean {
  if (value.type === inst.DeclaredType.Fixed) {
    return parseInt(value.value) !== 0;
  } else if (value.type === inst.DeclaredType.Character) {
    return value.value.trim() !== "";
  }
  return false;
}

function valueToNumber(value: string): Value {
  return {
    type: inst.DeclaredType.Fixed,
    value,
  };
}

function valueToString(value: string): Value {
  return {
    type: inst.DeclaredType.Character,
    value,
  };
}

function runDeclareInstruction(
  instruction: inst.DeclareInstruction,
  context: InterpreterContext,
): void {
  const variable = generateVariable(instruction);
  context.variables.set(variable.name, variable);
}

function runActivateInstruction(
  instruction: inst.ActivateInstruction,
  context: InterpreterContext,
): void {
  const variable = context.variables.get(instruction.variable.variable);
  if (variable) {
    if (instruction.scanMode !== undefined) {
      variable.mode = instruction.scanMode;
    }
    variable.active = true;
  }
}

function runDeactivateInstruction(
  instruction: inst.DeactivateInstruction,
  context: InterpreterContext,
): void {
  const variable = context.variables.get(instruction.variable.variable);
  if (variable) {
    variable.active = false;
  }
}

function runCompoundInstruction(
  instruction: inst.CompoundInstruction,
  context: InterpreterContext,
): void {
  for (const subInstruction of instruction.instructions) {
    try {
      const result = runInstruction(subInstruction, context);
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
  const replacedTokens = replaceTokensInText(instruction.tokens, context);
  const prefix = context.result.all[context.result.all.length - 1];
  if (prefix && prefix.immediateFollow) {
    // Remove the last token if it was immediately followed by the new tokens
    context.result.all.pop();
    // In the next step, we need to merge them again
    const firstToken = replacedTokens.shift();
    const mergedTokens = lex(prefix.image + (firstToken?.image ?? ""));
    setImmediateFollowProperty(firstToken, mergedTokens);
    // Push merged and new tokens to the stack
    largePush(context.result.all, mergedTokens);
    largePush(context.result.all, replacedTokens);
  } else {
    // If there is no need to merge the tokens, simply push them to the output
    largePush(context.result.all, replacedTokens);
  }
}

function largePush<T>(target: T[], source: T[]): void {
  // This is a workaround for the V8 engine's limit on the number of arguments
  // that can be passed to a function. We use this to push large arrays into
  // the result array.
  for (const item of source) {
    target.push(item);
  }
}

const lexer = new PliPreprocessorLexer();

function replaceTokensInText(
  tokens: Token[],
  context: InterpreterContext,
): Token[] {
  const tokenList: Token[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const result = performTokenScan(token, context);
    if (result) {
      // Replace the token with the scan result
      // i.e. the variable content, recursively replaced
      tokenList.push(...result);
    } else {
      // If the scan found no active variable, push the original token
      tokenList.push(token);
    }
  }
  return tokenList;
}

function performTokenScan(
  token: Token,
  context: InterpreterContext,
): Token[] | undefined {
  const image = token.image;
  const variable = context.variables.get(image);
  // If there is no active variable with that name, return undefined
  // The caller side will simply push the token to the output
  if (!variable?.active) {
    return undefined;
  } else if (token.payload.uri && variable.declarationNode) {
    // If the token has a URI, we assume it actually exists in the source code
    // We can now create a synthetic reference to the variable for it
    token.payload.element = generateSyntheticRefItem(
      token,
      variable.declarationNode,
      context,
    );
    token.payload.kind = CstNodeKind.ReferenceItem_Ref;
  }
  const variableValue = variable.value;
  const tokens = lex(variableValue.value);
  setImmediateFollowProperty(token, tokens);
  return replaceTokensInText(tokens, context);
}

function generateSyntheticRefItem(
  token: Token,
  targetNode: ast.SyntaxNode,
  context: InterpreterContext,
): ast.ReferenceItem {
  const refItem = ast.createReferenceItem();
  const ref = ast.createReference<ast.NamedElement>(refItem, token, true);
  ref.node = targetNode as ast.NamedElement;
  refItem.ref = ref;
  context.references.push(ref);
  return refItem;
}

function lex(text: string): Token[] {
  const lexerState = new PliPreprocessorLexerState(text, undefined);
  return lexer.tokenize(lexerState);
}

function setImmediateFollowProperty(
  token: Token | undefined,
  tokens: Token[],
): void {
  if (token?.immediateFollow && tokens.length > 0) {
    // The last token inherits the immediateFollow property of the original token
    tokens[tokens.length - 1].immediateFollow = true;
  }
}

function runInscanInstruction(
  instruction: inst.InscanInstruction,
  context: InterpreterContext,
): void {
  const value = evaluateReferenceExpression(instruction.variable, context);
  runInclude(
    {
      // No item is provided here, which is only availble in the IncludeInstruction
      item: null,
      fileName: value.value,
      token: instruction.variable.reference?.token,
      idempotent: instruction.idempotent,
    },
    context,
  );
}

function runIncludeInstruction(
  instruction: inst.IncludeInstruction,
  context: InterpreterContext,
): void {
  runInclude(instruction, context);
}

interface IncludeItem {
  fileName: string;
  item: ast.IncludeItem | null;
  token?: Token | null;
  idempotent: boolean;
}

function runInclude(item: IncludeItem, context: InterpreterContext): void {
  const uri = resolveIncludeFileUri(item, context);

  function failToResolve(error?: any): never {
    if (error) {
      console.log("Failed to resolve include file:", error);
    }
    throw new PreprocessorError(
      `Cannot resolve include file '${item.fileName}'`,
      item.token,
      context.uri,
    );
  }

  if (!uri) {
    failToResolve();
  }

  if (item.item) {
    // Set the resolved file path on the item
    // This will be used later in the LSP definition provider
    item.item.filePath = uri.toString();
  }

  if (item.idempotent && context.xIncludes.has(uri.toString())) {
    // Do nothing
    // TODO: Display a warning?
    return;
  }

  context.xIncludes.add(uri.toString());

  if (context.uris.includes(uri.toString())) {
    throw new PreprocessorError(
      `Circular include detected: ${uri.toString(true)}`,
      item.token,
      context.uri,
    );
  }

  try {
    const content = TextDocuments.get(uri)?.getText() ?? "";
    const processedContent = context.options.marginsProcessor.processMargins({
      result: context.options.compilerOptions,
      text: content,
    });
    const subState = context.options.parser.initializeState(
      processedContent,
      uri,
    );
    const subProgram = context.options.parser.parse(subState);
    context.result.fileTokens[uri.toString()] = subProgram.tokens;
    context.errors.push(...subProgram.errors);
    const instruction = generateInstructions(subProgram.statements);
    const newContext: InterpreterContext = {
      ...context,
      uri: uri,
      uris: [uri.toString(), ...context.uris],
    };
    doRunInstructions(newContext, instruction);
  } catch (err) {
    failToResolve(err);
  }
}

/**
 * Attempts to resolve the URI of an include file factoring in process group libs, relative & absolute paths
 *
 * @param item Include item to resolve a URI for
 * @param state Current PP state, used to resolve relative paths, program configs, and report errors
 * @returns URI of the included file if found, otherwise undefined
 */
function resolveIncludeFileUri(
  item: IncludeItem,
  context: InterpreterContext,
): URI | undefined {
  if (!item.fileName) {
    throw new Error("Include item does not have a file specified.");
  }

  if (!context.uri) {
    return undefined;
  }

  // check to validate include extension, if a program config & process group is available
  const programConfig = PluginConfigurationProviderInstance.getProgramConfig(
    context.uri.toString(true),
  );
  const pgroup = programConfig
    ? PluginConfigurationProviderInstance.getProcessGroupConfig(
        programConfig.pgroup,
      )
    : undefined;
  const ext = UriUtils.extname(URI.parse(item.fileName));
  if (
    ext !== "" &&
    programConfig &&
    pgroup &&
    (!pgroup["include-extensions"]?.includes(ext) ||
      !pgroup["include-extensions"])
  ) {
    const msg = pgroup["include-extensions"]?.length
      ? `expected one of: ${pgroup["include-extensions"]?.join(", ")}`
      : `expected no extension`;
    throw new PreprocessorError(
      `Unsupported include extension for included file, '${item.fileName}', ${msg}`,
      item.token,
      context.uri,
    );
  }

  // TODO @montymxb Jun 24th, 2025: Disabled relative & absolute pathing per request, however mainframe tests do show this works w/ the right JCL config
  // temporarily retaining here until we know we won't need this going forward, or we decide to re-enable it based on some configuration setting
  /*
  const absPathRegex = /^\/|[A-Z]:|~/i;
  const relativePathRegex = /^\.\.\/|^\.\//;
  if (absPathRegex.test(item.file)) {
    // absolute path, use as is
    return URI.parse(item.file);
  } else if (relativePathRegex.test(item.file)) {
    // relative path, combine with currentDir
    return UriUtils.joinPath(currentDir, item.file);
  } else ....
  */

  if (programConfig && pgroup) {
    // lib file as either a string or a member from a known process group
    for (const lib of pgroup.libs ?? []) {
      const libFileUri = UriUtils.joinPath(
        URI.parse(PluginConfigurationProviderInstance.getWorkspacePath()),
        lib,
        item.fileName,
      );
      if (FileSystemProviderInstance.fileExistsSync(libFileUri)) {
        // match found in this lib, take it
        return libFileUri;
      } else {
        // Perform additional lookup using the new glob method
        const patt = `${libFileUri.path}\\.*`;
        const matches = FileSystemProviderInstance.findFilesByGlobSync(patt);
        if (matches.length > 0) {
          // ensure this extension is allowed
          const ext = matches[0].match(/\.\w+$/);
          if (
            ext &&
            ext?.length &&
            pgroup["include-extensions"]?.includes(ext[0].toLowerCase())
          ) {
            return URI.file(matches[0]);
          }
        }
      }
    }
    // no match
    return undefined;
  } else {
    // no recognized process group or program config, nothing to lookup
    return undefined;
  }
}
