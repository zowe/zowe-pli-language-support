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
  cics?: boolean;
  cpsm?: boolean;
  debug?: boolean;
  dli?: boolean;
  edf?: boolean;
  exci?: boolean;
  fepi?: boolean;
  flag?: CompilerOptions.Flag;
  graphic?: boolean;
  length?: boolean;
  lineCount?: number;
  margins?: CompilerOptions.Margins;
  natLang?: CompilerOptions.NatLang;
  opMargins?: CompilerOptions.Margins;
  opSequence?: CompilerOptions.Sequence | false;
  options?: boolean;
  sequence?: CompilerOptions.Sequence | false;
  source?: boolean;
  sp?: boolean;
  spie?: boolean;
  sysEib?: boolean;
  vbref?: boolean;
}

export namespace CompilerOptions {
  export enum Flag {
    I,
    W,
    E,
    S,
  }

  export enum NatLang {
    EN,
    KA,
  }

  export interface Margins {
    m: number;
    n: number;
    c?: number;
  }

  export interface Sequence {
    m: number;
    n: number;
  }
}

export function getDefaultCompilerOptions(): CompilerOptions {
  return {
    cics: true,
    cpsm: false,
    debug: true,
    dli: false,
    edf: true,
    exci: false,
    fepi: false,
    flag: CompilerOptions.Flag.W,
    graphic: false,
    length: true,
    lineCount: 60,
    margins: { m: 2, n: 72, c: 0 },
    natLang: CompilerOptions.NatLang.EN,
    opMargins: { m: 2, n: 72, c: 0 },
    opSequence: { m: 73, n: 80 },
    options: true,
    sequence: { m: 73, n: 80 },
    source: true,
    sp: false,
    spie: true,
    sysEib: false,
    vbref: false,
  };
}
