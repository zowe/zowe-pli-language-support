import { TextDocuments } from "../language-server/text-documents";
import { Token } from "../parser/tokens";
import { URI, UriUtils } from "../utils/uri";
import { CompilationUnitTokens } from "../workspace/compilation-unit";
import { FileSystemProviderInstance } from "../workspace/file-system-provider";
import { PluginConfigurationProviderInstance } from "../workspace/plugin-configuration-provider";
import { CompilerOptionResult } from "./compiler-options/options";
import { generateInstructions } from "./instruction-generator";
import * as inst from "./instructions";
import { LexingError } from "./pli-lexer";
import { MarginsProcessor } from "./pli-margins-processor";
import { PreprocessorError } from "./pli-preprocessor-error";
import { PliPreprocessorLexer } from "./pli-preprocessor-lexer";
import { PliPreprocessorLexerState } from "./pli-preprocessor-lexer-state";
import { PliPreprocessorParser } from "./pli-preprocessor-parser";

interface Variable {
  name: string;
  value: Value;
  mode: inst.ScanMode;
  active: boolean;
}

interface Value {
  // Preprocessor variables are always strings or numbers.
  // We store them as strings for simplicity and convert them as needed.
  value: string;
  type: inst.DeclaredType;
}

function generateVariable(instruction: inst.DeclareInstruction): Variable {
  return {
    name: instruction.name,
    // Initial value is empty or 0 (for numbers)
    value: {
      value: instruction.type === inst.DeclaredType.CHARACTER ? "" : "0",
      type: instruction.type
    }, 
    mode: instruction.mode,
    // NOSCAN means the variable is not active
    active: instruction.mode !== inst.ScanMode.NOSCAN,
  };
}

interface InterpreterContext {
  uri?: URI;
  variables: Map<string, Variable>;
  result: CompilationUnitTokens;
  errors: LexingError[];
  xIncludes: Set<string>;
  options: InterpreterOptions;
}

// TODO: We need this just because those services aren't functions yet
// Eventually, these should become functions as well
export interface InterpreterOptions {
  compilerOptions: CompilerOptionResult | undefined;
  marginsProcessor: MarginsProcessor;
  parser: PliPreprocessorParser;
}

export function runInstructions(uri: URI, start: inst.InstructionNode, options: InterpreterOptions): CompilationUnitTokens {
  const context: InterpreterContext = {
    uri,
    errors: [],
    xIncludes: new Set(),
    variables: new Map(),
    result: {
      all: [],
      fileTokens: {}
    },
    options
  };

  return doRunInstructions(uri, context, start);
}

export function doRunInstructions(uri: URI, context: InterpreterContext, start: inst.InstructionNode): CompilationUnitTokens {
  let currentNode: inst.InstructionNode | undefined = start;
  while (currentNode) {
    currentNode = runInstructionNode(currentNode, context);
  }
  return context.result;
}

function runInstructionNode(node: inst.InstructionNode, context: InterpreterContext): inst.InstructionNode | undefined {
  const instruction = node.instruction;
  let result = node.next;
  try {
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
    console.error('Unhandled error in instruction interpreter:', err);
  }
}

function runInstruction(instruction: inst.Instruction, context: InterpreterContext): inst.InstructionNode | undefined {
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

function runAssignmentInstruction(instruction: inst.AssignmentInstruction, context: InterpreterContext): void {
  const value = evaluateExpression(instruction.value, context);
  for (const ref of instruction.refs) {
    let variable = context.variables.get(ref.variable);
    if (!variable) {
      variable = { name: ref.variable, value, active: true, mode: inst.ScanMode.SCAN };
      context.variables.set(ref.variable, variable);
    } else {
      variable.value = value;
    }
  }
}

function runIfInstruction(instruction: inst.IfInstruction, context: InterpreterContext): inst.InstructionNode | undefined {
  const condition = evaluateExpression(instruction.condition, context);
  if (valueToBool(condition)) {
    return instruction.trueBranch;
  } else {
    return instruction.falseBranch;
  }
}

function evaluateExpression(expression: inst.ExpressionInstruction, context: InterpreterContext): Value {
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

function evaluateBinaryExpression(expression: inst.BinaryExpressionInstruction, context: InterpreterContext): Value {
  const left = evaluateExpression(expression.left, context);
  const right = evaluateExpression(expression.right, context);
  switch (expression.operator) {
    case "+": return valueToNumber((parseInt(left.value) + parseInt(right.value)).toString());
    case "-": return valueToNumber((parseInt(left.value) - parseInt(right.value)).toString());
    case "*": return valueToNumber((parseInt(left.value) * parseInt(right.value)).toString());
    case "/": return valueToNumber((parseInt(left.value) / parseInt(right.value)).toString());
    case "**": return valueToNumber((parseInt(left.value) ** parseInt(right.value)).toString());
    case "||": return valueToString(left.value + right.value);
    case "<": return valueToNumber(boolToString(parseInt(left.value) < parseInt(right.value)));
    case "<=": return valueToNumber(boolToString(parseInt(left.value) <= parseInt(right.value)));
    case ">": return valueToNumber(boolToString(parseInt(left.value) > parseInt(right.value)));
    case ">=": return valueToNumber(boolToString(parseInt(left.value) >= parseInt(right.value)));
    case "=": return valueToNumber(boolToString(left.value === right.value));
    case "^=":
    case "<>": return valueToNumber(boolToString(left !== right));
    case "&": return valueToNumber((parseInt(left.value) & parseInt(right.value)).toString());
    case "|": return valueToNumber((parseInt(left.value) | parseInt(right.value)).toString());
  }
  return valueToNumber("0");
}

function evaluateUnaryExpression(expression: inst.UnaryExpressionInstruction, context: InterpreterContext): Value {
  const operand = evaluateExpression(expression.operand, context);
  switch (expression.operator) {
    case "+": return operand; // Unary plus, no change
    case "-": return valueToNumber((-parseInt(operand.value)).toString());
    case "!": return valueToNumber(boolToString(operand.value === "0"));
  }
  return valueToNumber("0");
}

function evaluateReferenceExpression(expression: inst.ReferenceItemInstruction, context: InterpreterContext): Value {
  const variable = context.variables.get(expression.variable);
  return variable ? variable.value : {
    type: inst.DeclaredType.CHARACTER,
    value: ""
  };
}

function evaluateLiteralExpression(expression: inst.NumberInstruction | inst.StringInstruction, context: InterpreterContext): Value {
  return {
    type: expression.kind === inst.InstructionKind.String ? inst.DeclaredType.CHARACTER : inst.DeclaredType.FIXED,
    value: expression.value
  };
}

function boolToString(value: boolean): string {
  return value ? '1' : '0';
}

function valueToBool(value: Value): boolean {
  if (value.type === inst.DeclaredType.FIXED) {
    return parseInt(value.value) !== 0;
  } else if (value.type === inst.DeclaredType.CHARACTER) {
    return value.value.trim() !== '';
  }
  return false;
}

function valueToNumber(value: string): Value {
  return {
    type: inst.DeclaredType.FIXED,
    value
  };
}

function valueToString(value: string): Value {
  return {
    type: inst.DeclaredType.CHARACTER,
    value
  };
}

function runDeclareInstruction(instruction: inst.DeclareInstruction, context: InterpreterContext): void {
  const variable = generateVariable(instruction);
  context.variables.set(variable.name, variable);
}

function runActivateInstruction(instruction: inst.ActivateInstruction, context: InterpreterContext): void {
  const variable = context.variables.get(instruction.variable.variable);
  if (variable) {
    if (instruction.scanMode !== undefined) {
      variable.mode = instruction.scanMode;
    }
    variable.active = true;
  }
}

function runDeactivateInstruction(instruction: inst.DeactivateInstruction, context: InterpreterContext): void {
  const variable = context.variables.get(instruction.variable.variable);
  if (variable) {
    variable.active = false;
  }
}

function runCompoundInstruction(instruction: inst.CompoundInstruction, context: InterpreterContext): void {
  for (const subInstruction of instruction.instructions) {
    try {
      const result = runInstruction(subInstruction, context);
      if (result) {
        throw new Error(`Only non-jump instructions are allowed in a compound instruction. Found: ${subInstruction.kind}`);
      }
    } catch (err) {
      handleInstructionError(err, context);
    }
  }
}

function runTokenInstruction(instruction: inst.TokensInstruction, context: InterpreterContext): void {
  context.result.all.push(...replaceTokensInText(instruction.tokens, context));
}

const lexer = new PliPreprocessorLexer();

function replaceTokensInText(tokens: Token[], context: InterpreterContext): Token[] {
  const tokenList: Token[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const result = performTokenScan(token, context);
    if (result) {
      tokenList.push(...result);
    } else {
      tokenList.push(token);
    }
  }
  return tokenList;
}

function performTokenScan(token: Token, context: InterpreterContext): Token[] | undefined {
  const image = token.image;
  const variable = context.variables.get(image);
  if (!variable || !variable.active) {
    return undefined;
  }
  const variableValue = variable.value;
  const lexerState = new PliPreprocessorLexerState(variableValue.value, undefined);
  const tokens = lexer.tokenize(lexerState);
  return replaceTokensInText(tokens, context);
}

function runInscanInstruction(instruction: inst.InscanInstruction, context: InterpreterContext): void {
  const value = evaluateReferenceExpression(instruction.variable, context);
  runInclude({
    file: value.value,
    token: instruction.variable.token,
    xInclude: false
  }, context);
}

function runIncludeInstruction(instruction: inst.IncludeInstruction, context: InterpreterContext): void {
  runInclude(instruction, context);
}

interface IncludeItem {
  file: string;
  token: Token | null;
  xInclude: boolean;
}

function runInclude(item: IncludeItem, context: InterpreterContext): void {
const uri = resolveIncludeFileUri(item, context);

  function failToResolve(): never {
    throw new PreprocessorError(`Cannot resolve include file '${item.file}' at '${context.uri?.toString(true)}'.`, item.token, context.uri);
  }

  if (!uri) {
    failToResolve();
  }

  if (item.xInclude && context.xIncludes.has(uri.toString())) {
    // Do nothing
    // TODO: Display a warning?
    return;
  }

  context.xIncludes.add(uri.toString());

  try {
    const content = TextDocuments.get(uri)?.getText() ?? '';
    const processedContent = context.options.marginsProcessor.processMargins({
      result: context.options.compilerOptions,
      text: content
    });
    const subState = context.options.parser.initializeState(processedContent, uri);
    const subProgram = context.options.parser.parse(subState);
    for (const [uri, tokens] of Object.entries(subState.perFileTokens)) {
      context.result.fileTokens[uri] = tokens;
    }
    context.errors.push(...subProgram.errors);
    const instruction = generateInstructions(subProgram.statements);
    const newContext: InterpreterContext = {
      ...context,
      uri: uri
    };
    doRunInstructions(uri, newContext, instruction);
  } catch {
    failToResolve();
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
  const absPathRegex = /^\/|[A-Z]:|~/i;
  const relativePathRegex = /^\.\.\/|^\.\//;

  if (!context.uri) {
    return undefined;
  }

  const currentDir = UriUtils.dirname(context.uri);

  if (!item.file) {
    throw new Error("Include item does not have a file specified.");
  }

  // check to validate copybook extension, if a program config & process group is available
  const programConfig = PluginConfigurationProviderInstance.getProgramConfig(
    context.uri.toString(),
  );
  const pgroup = programConfig
    ? PluginConfigurationProviderInstance.getProcessGroupConfig(
        programConfig.pgroup,
      )
    : undefined;
  const ext = UriUtils.extname(URI.parse(item.file));
  if (
    ext !== "" &&
    programConfig &&
    pgroup &&
    (!pgroup["copybook-extensions"]?.includes(ext) ||
      !pgroup["copybook-extensions"])
  ) {
    const msg = pgroup["copybook-extensions"]?.length
      ? `expected one of: ${pgroup["copybook-extensions"]?.join(", ")}`
      : `expected no extension`;
    throw new PreprocessorError(
      `Unsupported copybook extension for included file, '${item.file}', ${msg}`,
      item.token,
      context.uri,
    );
  }

  if (absPathRegex.test(item.file)) {
    // absolute path, use as is
    return URI.parse(item.file);
  } else if (relativePathRegex.test(item.file)) {
    // relative path, combine with currentDir
    return UriUtils.joinPath(currentDir, item.file);
  } else if (programConfig && pgroup) {
    // lib file as either a string or a member from a known process group
    for (const lib of pgroup.libs ?? []) {
      if (lib === "*") {
        // wildcard lib, use currentDir
        return UriUtils.joinPath(currentDir, item.file);
      } else {
        const libFileUri = UriUtils.joinPath(
          URI.parse(PluginConfigurationProviderInstance.getWorkspacePath()),
          lib,
          item.file,
        );
        if (FileSystemProviderInstance.fileExistsSync(libFileUri)) {
          // match found in this lib, take it
          return libFileUri;
        } else {
          // Perform additional lookup using the new glob method
          const patt = `${libFileUri.path}\\.*`;
          const matches = FileSystemProviderInstance.findFilesByGlobSync(patt);
          if (matches.length > 0) {
            // Return the first match found
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
