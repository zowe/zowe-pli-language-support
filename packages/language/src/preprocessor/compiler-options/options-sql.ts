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
  apost?: CompilerOptions.QuoteChar;
  apostSql?: CompilerOptions.QuoteChar;
  attach?: CompilerOptions.Attach;
  ccsid?: number;
  ccsid0?: boolean;
  codepage?: boolean;
  comma?: CompilerOptions.DecimalPoint;
  connect?: 1 | 2;
  date?: CompilerOptions.Date;
  dec?: 15 | 31;
  decp?: string;
  deprecate?: Set<string>;
  emptyDbrm?: boolean;
  flag?: CompilerOptions.Flag;
  float?: CompilerOptions.Float;
  graphic?: boolean;
  host?: CompilerOptions.Host;
  hostCopy?: boolean;
  incOnly?: boolean;
  level?: string;
  line?: CompilerOptions.Line;
  lineCount?: number;
  margins?: { m: number; n: number; c?: number };
  newFun?: CompilerOptions.NewFun;
  noFor?: boolean;
  onePass?: boolean;
  printOptions?: boolean;
  source?: boolean;
  sqlLevel?: string;
  stdSql?: boolean;
  time?: CompilerOptions.Time;
  warnDecp?: boolean;
  xref?: boolean;
}

export namespace CompilerOptions {
  export enum Line {
    LINEONLY,
    LINEFILE,
  }

  export enum QuoteChar {
    APOST,
    QUOTE,
  }

  export enum Attach {
    TSO,
    CAF,
    RRSAF,
    ULI,
  }

  export enum DecimalPoint {
    COMMA,
    PERIOD,
  }

  export enum Date {
    ISO,
    USA,
    EUR,
    JIS,
    LOCAL,
  }

  export enum Time {
    ISO,
    USA,
    EUR,
    JIS,
    LOCAL,
  }

  export enum Float {
    S390,
    IEEE,
  }

  export enum Flag {
    I,
    W,
    E,
    S,
  }

  export enum NewFun {
    V8,
    V9,
    V10,
    V11,
    V12,
  }

  export enum HostLanguage {
    ASM,
    C,
    CPP,
    IBMCOB,
    PLI,
    FORTRAN,
    SQL,
    SQLPL,
  }

  export interface Host {
    language: HostLanguage;
  }
}

export function getDefaultCompilerOptions(): CompilerOptions {
  return {
    apost: CompilerOptions.QuoteChar.APOST,
    apostSql: CompilerOptions.QuoteChar.APOST,
    attach: CompilerOptions.Attach.TSO,
    ccsid0: true,
    codepage: false,
    connect: 2,
    decp: "DSNHDECP",
    deprecate: new Set(),
    emptyDbrm: false,
    flag: CompilerOptions.Flag.I,
    float: CompilerOptions.Float.S390,
    graphic: undefined,
    host: { language: CompilerOptions.HostLanguage.PLI },
    hostCopy: true,
    incOnly: false,
    line: CompilerOptions.Line.LINEONLY,
    lineCount: 60,
    noFor: false,
    onePass: true,
    printOptions: true,
    source: false,
    stdSql: undefined,
    warnDecp: false,
    xref: false,
  };
}
