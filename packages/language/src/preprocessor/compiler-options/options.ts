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

import { Diagnostic, Range } from "../../language-server/types";
import { Token } from "../../parser/tokens";
import * as Pli from "./options-pli";
import * as Macro from "./options-macro";
import * as SQL from "./options-sql";
import * as CICS from "./options-cics";
import { NOT_CHARACTER } from "../../utils/const";

export type CompilerOptionsPP =
  | Pli.CompilerOptions
  | Macro.CompilerOptions
  | SQL.CompilerOptions
  | CICS.CompilerOptions;

export interface CompilerOptions extends Pli.CompilerOptions {
  macroOptions: Macro.CompilerOptions;
  sqlOptions: SQL.CompilerOptions;
  cicsOptions: CICS.CompilerOptions;
  /**
   * The source ranges of the PROCESS directives from which these compiler
   * options were parsed. Since the ranges are no longer needed for the
   * options themselves after parsing, they are kept primarily for LSP
   * requests (e.g. compiler-option completion).
   */
  ranges: Range[];
}

export interface CompilerOptionResult {
  options: CompilerOptions;
  tokens: Token[];
  comments: Token[];
  issues: Diagnostic[];
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
  export const PLI_CODEPAGE_SET = new Set([
    "01047",
    "01140",
    "01141",
    "01142",
    "01143",
    "01144",
    "01025",
    "01145",
    "01146",
    "01147",
    "01148",
    "01149",
    "00037",
    "01155",
    "00273",
    "00277",
    "00278",
    "00280",
    "00284",
    "00285",
    "00297",
    "00500",
    "00871",
    "00819",
    "00813",
    "00920",
  ]);
  export const PLI_STATEMENT_NAMES = [
    "ALLOCATE",
    "ASSERT",
    "ATTACH",
    "BEGIN",
    "CALL",
    "CLOSE",
    "DELAY",
    "DELETE",
    "DETACH",
    "DISPLAY",
    "EXIT",
    "FETCH",
    "FLUSH",
    "FREE",
    "GET",
    "GOTO",
    "ITERATE",
    "LEAVE",
    "LOCATE",
    "ON",
    "OPEN",
    "PUT",
    "READ",
    "RELEASE",
    "RESIGNAL",
    "REVERT",
    "REWRITE",
    "SIGNAL",
    "STOP",
    "WAIT",
    "WRITE",
  ] as const;
}

export function getDefaultCompilerOptions(): CompilerOptions {
  return {
    ...Pli.getDefaultCompilerOptions(),
    macroOptions: Macro.getDefaultCompilerOptions(),
    sqlOptions: SQL.getDefaultCompilerOptions(),
    cicsOptions: CICS.getDefaultCompilerOptions(),
    ranges: [],
  };
}
