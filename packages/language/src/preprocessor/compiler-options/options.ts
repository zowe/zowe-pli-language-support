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

import { Diagnostic, Range, Severity } from "../../language-server/types";
import { Token } from "../../parser/tokens";
import * as Pli from "./options-pli";
import * as Macro from "./options-macro";
import { NOT_CHARACTER } from "../../utils/const";

export type CompilerOptionsPP = Pli.CompilerOptions | Macro.CompilerOptions;

export interface CompilerOptions extends Pli.CompilerOptions {
  macroOptions: Macro.CompilerOptions;
}

export interface CompilerOptionResult {
  options: CompilerOptions;
  tokens: Token[];
  issues: CompilerOptionIssue[];
}

export interface CompilerOptionIssue {
  severity: Severity;
  message: string;
  range: Range;
}

export function compilerOptionIssueToDiagnostics(
  issue: CompilerOptionIssue,
  uri: string,
): Diagnostic {
  return {
    message: issue.message,
    range: issue.range,
    severity: issue.severity,
    uri,
  };
}

export namespace CompilerOptions {
  export const PLI_CHARACTER_REGEX = new RegExp(
    `[A-Za-z0-9 =+\\-*/()\\.,'"%;:&|<>_${NOT_CHARACTER}]`,
  );
  export const PLI_CHARACTER_SET = new Set(
    (
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 =+-*/().,'\"%;:&|<>_" +
      NOT_CHARACTER
    ).split(""),
  );
}

export function getDefaultCompilerOptions(): CompilerOptions {
  return {
    ...Pli.getDefaultCompilerOptions(),
    macroOptions: Macro.getDefaultCompilerOptions(),
  };
}
