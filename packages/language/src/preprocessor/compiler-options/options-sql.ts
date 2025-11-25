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
  ccsid0?: boolean;
  codepage?: boolean;
  deprecate?: string[];
  emptyDbrm?: boolean;
  hostCopy?: boolean;
  incOnly?: boolean;
  line?: CompilerOptions.Line;
  warnDecp?: boolean;
}

export namespace CompilerOptions {
  export type Line = "LINEONLY" | "LINEFILE";
}

const defaultCompilerOptions: CompilerOptions = {
  ccsid0: true,
  codepage: false,
  deprecate: [],
  emptyDbrm: false,
  hostCopy: true,
  incOnly: false,
  line: "LINEONLY",
  warnDecp: false,
};

export function getDefaultCompilerOptions(): CompilerOptions {
  return { ...defaultCompilerOptions };
}
