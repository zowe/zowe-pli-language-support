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
  deprecate?: Set<string>;
  emptyDbrm?: boolean;
  hostCopy?: boolean;
  incOnly?: boolean;
  line?: CompilerOptions.Line;
  warnDecp?: boolean;
}

export namespace CompilerOptions {
  export enum Line {
    LINEONLY,
    LINEFILE,
  }
}

export function getDefaultCompilerOptions(): CompilerOptions {
  return {
    ccsid0: true,
    codepage: false,
    deprecate: new Set(),
    emptyDbrm: false,
    hostCopy: true,
    incOnly: false,
    line: CompilerOptions.Line.LINEONLY,
    warnDecp: false,
  };
}
