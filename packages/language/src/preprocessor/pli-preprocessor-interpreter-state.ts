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

import { TokenType } from "chevrotain";
import { PPInstruction, Values } from "./pli-preprocessor-instructions";
import { PreprocessorTokens } from "./pli-preprocessor-tokens";
import { CompilationUnitTokens } from "../workspace/compilation-unit";
import * as ast from "../syntax-tree/ast";
import { assertUnreachable } from "../utils/common";
import { createSyntheticTokenInstance, Token } from "../parser/tokens";

export type EvaluationResults = Map<ast.IfStatement, boolean | undefined>;

export interface PreprocessorInterpreterState {
  currentInstruction: PPInstruction;
  halt: boolean;
  getOutput(): CompilationUnitTokens;
  goTo(next: (previousCounter: number) => number): void;
  activate(name: string, scanMode: ast.ScanMode): void;
  deactivate(name: string): void;
  hasVariable(name: string): boolean;
  getVariable(name: string): PreprocessorVariable;
  assign(name: string, value: Token[]): void;
  declare(name: string, variable: PreprocessorVariable): void;
  step(): void;
  getEvaluationResults(): EvaluationResults;
}

const MAX_GO_TO_COUNT = 5000;

export class PliPreprocessorInterpreterState
  implements PreprocessorInterpreterState
{
  private plainState: PlainPreprocessorInterpreterState;
  private idTokenType: TokenType;
  private evaluationResults: EvaluationResults;
  private goToCounter = new Map<number, number>();
  private _halt = false;

  constructor(program: PPInstruction[], idTokenType: TokenType) {
    this.plainState = initializeInterpreterState(program);
    this.idTokenType = idTokenType;
    this.evaluationResults = new Map();
  }

  getOutput(): CompilationUnitTokens {
    return this.plainState.output;
  }

  goTo(next: (previousCounter: number) => number): void {
    const newCounter = next(this.plainState.programCounter);
    if (newCounter >= 0 && newCounter < this.plainState.program.length) {
      this.plainState = { ...this.plainState, programCounter: newCounter };
      const instructionCount = this.goToCounter.get(newCounter) ?? 0;
      this.goToCounter.set(newCounter, instructionCount + 1);
      // Ensure that we don't run into an infinite loop
      if (instructionCount > MAX_GO_TO_COUNT) {
        this._halt = true;
        console.log("Long running preprocessor code detected. Stopping.");
      }
    }
  }

  get halt() {
    return this._halt || this.currentInstruction.type === "halt";
  }

  get currentInstruction() {
    return this.plainState.program[this.plainState.programCounter];
  }

  hasVariable(name: string): boolean {
    return Selectors.hasVariable(this.plainState, name);
  }

  getVariable(name: string): PreprocessorVariable {
    return Selectors.getVariable(this.plainState, name);
  }

  activate(name: string, scanMode: ast.ScanMode = "RESCAN") {
    if (Selectors.hasVariable(this.plainState, name)) {
      const variable = Selectors.getVariable(this.plainState, name);
      Mutators.assignVariable(this.plainState, name, {
        ...variable,
        scanMode,
        active: true,
      });
    } else {
      Mutators.assignVariable(this.plainState, name, {
        dataType: "CHARACTER",
        scanMode,
        value: [],
        active: true,
      });
    }
  }

  deactivate(name: string) {
    if (Selectors.hasVariable(this.plainState, name)) {
      const variable = Selectors.getVariable(this.plainState, name);
      Mutators.assignVariable(this.plainState, name, {
        ...variable,
        active: false,
      });
    } else {
      Mutators.assignVariable(this.plainState, name, {
        dataType: "CHARACTER",
        scanMode: "RESCAN",
        value: [],
        active: false,
      });
    }
  }

  assign(name: string, value: Token[]) {
    if (Selectors.hasVariable(this.plainState, name)) {
      const variable = Selectors.getVariable(this.plainState, name);
      Mutators.assignVariable(this.plainState, name, {
        ...variable,
        value,
      });
    } else {
      Mutators.assignVariable(this.plainState, name, {
        dataType: typeof value === "string" ? "CHARACTER" : "FIXED",
        scanMode: "RESCAN",
        value,
        active: false,
      });
    }
  }

  declare(name: string, variable: PreprocessorVariable) {
    Mutators.assignVariable(this.plainState, name, variable);
  }

  private isIdentifier(token: Token) {
    // TODO: optimize this!
    return (
      token.tokenType.name === "ID" ||
      (token.tokenType.CATEGORIES &&
        token.tokenType.CATEGORIES.some((t) => t.name === "ID"))
    );
  }

  step() {
    const instruction = this.currentInstruction;
    switch (instruction.type) {
      case "halt":
        break;
      case "activate": {
        if (this.hasVariable(instruction.name)) {
          const variable = this.plainState.variables[instruction.name];
          variable.active = true;
          if (instruction.scanMode) {
            variable.scanMode = instruction.scanMode;
          }
        } else {
          this.plainState.variables[instruction.name] = {
            active: true,
            dataType: "CHARACTER",
            scanMode: instruction.scanMode ?? "RESCAN",
            value: [],
          };
        }
        this.goTo((prev) => prev + 1);
        break;
      }
      case "deactivate": {
        if (this.hasVariable(instruction.name)) {
          this.plainState.variables[instruction.name].active = false;
        } else {
          this.plainState.variables[instruction.name] = {
            active: false,
            dataType: "CHARACTER",
            scanMode: "RESCAN",
            value: [],
          };
        }
        this.goTo((prev) => prev + 1);
        break;
      }
      case "compute": {
        if (this.plainState.stack.length >= 2) {
          const rhs = this.plainState.stack.pop()!;
          const lhs = this.plainState.stack.pop()!;
          let value: Token[] = [];
          switch (instruction.operator) {
            case "+":
              value = Values.add(lhs, rhs);
              break;
            case "-":
              value = Values.subtract(lhs, rhs);
              break;
            case "*":
              value = Values.multiply(lhs, rhs);
              break;
            case "/":
              value = Values.divide(lhs, rhs);
              break;
            case "**":
              value = Values.power(lhs, rhs);
              break;
            case "||":
              value = Values.concat(lhs, rhs);
              break;
            case "<":
              value = Values.lt(lhs, rhs);
              break;
            case "<=":
              value = Values.le(lhs, rhs);
              break;
            case ">":
              value = Values.gt(lhs, rhs);
              break;
            case ">=":
              value = Values.ge(lhs, rhs);
              break;
            case "=":
              value = Values.eq(lhs, rhs);
              break;
            case "<>":
              value = Values.neq(lhs, rhs);
              break;
            case "&":
              value = Values.and(lhs, rhs);
              break;
            case "|":
              value = Values.or(lhs, rhs);
              break;
            default:
              console.log(
                "Found unexpected preprocessor operator: ",
                instruction.operator,
              );
          }
          this.plainState.stack.push(value);
        }
        this.goTo((prev) => prev + 1);
        break;
      }
      case "get": {
        if (instruction.variableName in this.plainState.variables) {
          this.plainState.stack.push(
            this.plainState.variables[instruction.variableName].value,
          );
        }
        this.goTo((prev) => prev + 1);
        break;
      }
      case "set": {
        if (this.plainState.stack.length > 0) {
          const tokens = this.plainState.stack.pop()!;
          //TODO check type of variable and content of tokens?
          if (!this.hasVariable(instruction.name)) {
            this.plainState.variables[instruction.name] = {
              active: false,
              dataType: "CHARACTER",
              scanMode: "RESCAN",
              value: [],
            };
          }
          this.plainState.variables[instruction.name].value = tokens;
        }
        this.goTo((prev) => prev + 1);
        break;
      }
      case "push": {
        this.plainState.stack.push(instruction.value);
        this.goTo((prev) => prev + 1);
        break;
      }
      case "scan": {
        const tokens = this.plainState.stack.pop()!;
        this.plainState.stack.push(this.scan(tokens));
        this.goTo((prev) => prev + 1);
        break;
      }
      case "concat": {
        const rhs = this.plainState.stack.pop()!;
        const lhs = this.plainState.stack.pop()!;
        this.plainState.stack.push(this.concat(lhs, rhs));
        this.goTo((prev) => prev + 1);
        break;
      }
      case "print": {
        if (this.plainState.stack.length > 0) {
          const tokens = this.plainState.stack.pop()!;
          this.plainState.output.all.push(...tokens);
        } //TODO else error?
        this.goTo((prev) => prev + 1);
        break;
      }
      case "goto": {
        this.goTo(() => instruction.address as number);
        break;
      }
      case "branchIfNEQ": {
        const rhs = this.plainState.stack.pop()!;
        const lhs = this.plainState.stack.pop()!;
        if (this.areEqual(lhs, rhs)) {
          this.goTo((prev) => prev + 1);
          if (instruction.ifStatement) {
            this.evaluationResults.set(instruction.ifStatement, true);
          }
        } else {
          this.goTo(() => instruction.address as number);
          if (instruction.ifStatement) {
            this.evaluationResults.set(instruction.ifStatement, false);
          }
        }
        break;
      }
      case "return": {
        // TODO
        break;
      }
      default:
        assertUnreachable(instruction);
    }
  }

  getEvaluationResults(): EvaluationResults {
    return this.evaluationResults;
  }

  private areEqual(lhs: Token[], rhs: Token[]): boolean {
    if (lhs.length !== rhs.length) {
      return false;
    }
    return lhs.every((lv, index) => {
      const rv = rhs[index];
      return (
        lv.image === rv.image &&
        lv.tokenType.name.toLowerCase() === rv.tokenType.name.toLowerCase()
      );
    });
  }

  private concat(lhs: Token[], rhs: Token[]): Token[] {
    if (lhs.length === 0) {
      return rhs;
    } else if (rhs.length === 0) {
      return lhs;
    } else {
      const last = lhs[lhs.length - 1];
      const first = rhs[0];
      if (
        this.isIdentifier(last) &&
        (this.isIdentifier(first) ||
          Values.sameType(first.tokenType, PreprocessorTokens.Number))
      ) {
        const part1 = lhs.slice(0, lhs.length - 1);
        const token = createSyntheticTokenInstance(
          this.idTokenType,
          last.image + first.image,
        );

        const part2 = [token];
        const part3 = rhs.slice(1);
        return part1.concat(part2).concat(part3);
      } else {
        return lhs.concat(rhs);
      }
    }
  }
  private scan(tokens: Token[]) {
    const activeScanVariables = new Set<string>();
    const activeRescanVariables = new Set<string>();

    const simpleScan = (
      tokens: Token[],
      activeVariables: Set<string>,
    ): Token[] => {
      return tokens.flatMap((tk) => {
        if (this.isIdentifier(tk) && activeVariables.has(tk.image)) {
          const variable = this.getVariable(tk.image);
          return simpleScan(variable.value, activeRescanVariables);
        }
        return [tk];
      });
    };

    for (const [name, variable] of Object.entries(this.plainState.variables)) {
      if (variable.active) {
        activeScanVariables.add(name);
        if (variable.scanMode === "RESCAN") {
          activeRescanVariables.add(name);
        }
      }
    }
    return simpleScan(tokens, activeScanVariables);
  }
}

// PLAIN STATE

export type TextPosition = {
  offset: number;
  line: number;
  column: number;
};

export type PreprocessorVariable = {
  scanMode: ast.ScanMode;
  active: boolean;
  dataType: "CHARACTER" | "FIXED";
  value: Token[];
};

export type PreprocessorScan = Readonly<{
  text: string;
  offset: number;
  line: number;
  column: number;
}>;

export type PlainPreprocessorInterpreterState = {
  program: PPInstruction[];
  stack: Token[][];
  output: CompilationUnitTokens;
  programCounter: number;
  variables: Record<string, PreprocessorVariable>;
};

export const initializeInterpreterState: (
  program: PPInstruction[],
) => PlainPreprocessorInterpreterState = (program) => ({
  program,
  stack: [],
  output: {
    all: [],
    fileTokens: {},
  },
  programCounter: 0,
  variables: {},
});

// SELECTORS

namespace Selectors {
  export function hasVariable(
    state: PlainPreprocessorInterpreterState,
    name: string,
  ): boolean {
    return name in state.variables;
  }
  export function getVariable(
    state: PlainPreprocessorInterpreterState,
    name: string,
  ): PreprocessorVariable {
    return state.variables[name]!;
  }
}

// MUTATORS

namespace Mutators {
  export function assignVariable(
    state: PlainPreprocessorInterpreterState,
    name: string,
    variable: PreprocessorVariable,
  ) {
    state.variables[name] = variable;
  }
}
