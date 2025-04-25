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

import * as ast from "../syntax-tree/ast";
import { PPInstruction, Label, PPIGoto } from "./pli-preprocessor-instructions";

export type PliPreprocessorProgram = {
  instructions: PPInstruction[];
};

export type DoGroupStackItem = {
  doGroup: ast.DoStatement;
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

  lookupDoGroup(doGroup: ast.DoStatement) {
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

  pushDoGroup(doGroup: ast.DoStatement) {
    const item = {
      doGroup,
      $start$: this.createLabel(),
      $iterate$: this.createLabel(),
      $leave$: this.createLabel(),
    };
    this.doGroupStack.push(item);
    return item as {
      $iterate$: Label;
      $leave$: Label;
    };
  }

  createLabel(): Label {
    const labelName = `$label${this.labelCounter++}$`;
    const label: Label = { address: undefined, doGroup: undefined };
    this.labels[labelName] = label;
    return label;
  }

  createNamedLabel(label: ast.LabelPrefix, doGroup?: ast.DoStatement): Label {
    if (label.name) {
      const name = label.name;
      const newLabel: Label = { address: undefined, doGroup };
      this.labels[name] = newLabel;
      return newLabel;
    } else {
      return this.createLabel();
    }
  }

  resolveLabel(label: ast.LabelReference): Label | undefined {
    if (label.label?.text) {
      return this.labels[label.label.text];
    }
    return undefined;
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
