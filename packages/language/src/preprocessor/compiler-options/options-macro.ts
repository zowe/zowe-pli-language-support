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

export interface CompilerOptions {
  case?: CompilerOptions.Case;
  dbcs?: CompilerOptions.Dbcs;
  deprecate?: Set<string>;
  deprecateNext?: Set<string>;
  eolComm?: boolean;
  fixed?: CompilerOptions.Fixed;
  id?: string;
  ignore?:
    | {
        noprint: boolean;
      }
    | false;
  incOnly?: boolean;
  namePrefix?:
    | {
        character: string;
      }
    | false;
  rescan?: CompilerOptions.Rescan;
}

export namespace CompilerOptions {
  export type Case = "UPPER" | "ASIS";
  export type Dbcs = "EXACT" | "INEXACT";
  export type Fixed = "DECIMAL" | "BINARY";
  export type Rescan = "UPPER" | "ASIS";
}

const defaultCompilerOptions: CompilerOptions = {
  case: "ASIS",
  dbcs: "INEXACT",
  deprecate: new Set(),
  deprecateNext: new Set(),
  eolComm: true,
  fixed: "DECIMAL",
  id: "",
  ignore: false,
  incOnly: false,
  namePrefix: false,
  rescan: "ASIS",
};

export function getDefaultCompilerOptions(): CompilerOptions {
  return { ...defaultCompilerOptions };
}
