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

import { AnyDoGroup } from "./pli-preprocessor-ast";
import { PPInstruction, Label, PPIGoto } from "./pli-preprocessor-instructions";

export type PliPreprocessorProgram = {
  instructions: PPInstruction[];
};

export type DoGroupStackItem = {
  doGroup: AnyDoGroup;
  $start$: Label;
  $iterate$: Label;
  $leave$: Label;
};

export class PliPreprocessorProgramBuilder {
  private labelCounter = 0;
  private readonly labels: Record<string, Label> = {};
  private readonly doGroupStack: DoGroupStackItem[] = [];
  private readonly program: PliPreprocessorProgram;

  constructor() {
    this.program = { instructions: [] };
  }

  lookupDoGroup(doGroup: AnyDoGroup) {
    return this.doGroupStack.find((item) => item.doGroup === doGroup);
  }

  topDoGroup() {
    return this.doGroupStack.length > 0
      ? this.doGroupStack[this.doGroupStack.length - 1]
      : undefined;
  }

  pushInstruction(instruction: PPInstruction): void {
    this.program.instructions.push(instruction);
  }

  pushDoGroup(doGroup: AnyDoGroup) {
    const item = {
      doGroup,
      $start$: this.getOrCreateLabel(),
      $iterate$: this.getOrCreateLabel(),
      $leave$: this.getOrCreateLabel(),
    };
    this.doGroupStack.push(item);
    return item as {
      $iterate$: Label;
      $leave$: Label;
    };
  }

  getOrCreateLabel(label?: string, doGroup?: AnyDoGroup): Label {
    label ??= `$label${this.labelCounter++}$`;
    if (this.labels[label]) {
      return this.labels[label];
    }
    const newLabel: Label = { address: undefined, doGroup };
    this.labels[label] = newLabel;
    return newLabel;
  }

  pushLabel(label: Label): void {
    label.address = this.program.instructions.length;
  }

  popDoGroup(): void {
    this.doGroupStack.pop();
  }

  build(): PliPreprocessorProgram {
    return {
      instructions: this.program.instructions.map((instr) => {
        if (
          (instr.type === "goto" && typeof instr.address !== "number") ||
          (instr.type === "branchIfNEQ" && typeof instr.address !== "number")
        ) {
          return <PPIGoto>{
            ...instr,
            address: instr.address.address,
          };
        }
        return instr;
      }),
    };
  }
}
