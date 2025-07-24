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

/**
 * https://www.ibm.com/docs/en/epfz/6.1?topic=facilities-compile-time-option-descriptions
 */
export interface CompilerOptions {
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-aggregate
   */
  aggregate?: CompilerOptions.Aggregate | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-arch
   */
  arch?: number;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-assert
   */
  assert?: CompilerOptions.Assert;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-attributes
   */
  attributes?: CompilerOptions.Attributes;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-backreg
   */
  backreg?: number;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-bifprec
   */
  bifprec?: number;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-blank
   */
  blank?: string;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-blkoff
   */
  blkoff?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-brackets
   */
  brackets?: [string, string];
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-case
   */
  case?: CompilerOptions.Case;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-caserules
   */
  caserules?: CompilerOptions.CaseRules;
  /**
   * TODO: The syntax diagram for the `check` option is incorrect or does not make sense.
   *
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-check
   */
  check?: CompilerOptions.Check;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-cmpat
   */
  cmpat?: CompilerOptions.CMPat;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-codepage
   */
  codepage?: string;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-common
   */
  common?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-compile
   */
  compile?: CompilerOptions.Compile | true;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-copyright
   */
  copyright?: string | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-csect
   */
  csect?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-csectcut
   */
  csectcut?: number;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-currency
   */
  currency?: string;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-dbcs
   */
  dbcs?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-dbrmlib
   */
  dbrmlib?: string | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-dd
   */
  dd?: CompilerOptions.DD;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-ddsql
   */
  ddsql?: string;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-decimal
   */
  decimal?: CompilerOptions.Decimal;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-decomp
   */
  decomp?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-default
   */
  default?: CompilerOptions.Default;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-deprecate
   */
  deprecate?: CompilerOptions.Deprecate;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-deprecatenext
   */
  deprecateNext?: CompilerOptions.Deprecate;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-display
   */
  display?: CompilerOptions.Display;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-dll
   */
  dll?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-dllinit
   */
  dllInit?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-exit
   */
  exit?: CompilerOptions.Exit | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-exportall
   */
  exportAll?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-extrn
   */
  extrn?: CompilerOptions.Length;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-fileref
   */
  fileRef?: CompilerOptions.FileRef | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-flag
   */
  flag?: CompilerOptions.Flag;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-float
   */
  float?: CompilerOptions.Float;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-floatinmath
   */
  floatInMath?: CompilerOptions.FloatInMath;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-goff
   */
  goff?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-gonumber
   */
  goNumber?: CompilerOptions.GoNumber | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-graphic
   */
  graphic?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-header
   */
  header?: CompilerOptions.Header;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-hgpr
   */
  hgpr?: CompilerOptions.HGPR;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-ignore
   */
  ignore?: CompilerOptions.Ignore | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-incafter
   */
  incAfter?: CompilerOptions.IncAfter;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-incdir
   */
  incDir?: CompilerOptions.IncDir | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-include
   */
  include?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-incpds
   */
  incPds?: string | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-initauto
   */
  initAuto?: CompilerOptions.InitAuto | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-initbased
   */
  initBased?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-initctl
   */
  initCtl?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-initstatic
   */
  initStatic?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-insource
   */
  inSource?: CompilerOptions.InSource;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-interrupt
   */
  interrupt?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-json
   */
  json?: CompilerOptions.Json;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-langlvl
   */
  langlvl?: CompilerOptions.LangLvl;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-limits
   */
  limits?: CompilerOptions.Limits;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-linecount
   */
  lineCount?: number;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-linedir
   */
  lineDir?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-list
   */
  list?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-listview
   */
  listView?: CompilerOptions.ListView;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-lp
   */
  LP?: "32" | "64";
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-macro
   */
  macro?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-map
   */
  map?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-margini
   */
  margini?: CompilerOptions.Margini;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-margins
   */
  margins?: CompilerOptions.Margins | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-maxbranch
   */
  maxbranch?: number;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-maxinit
   */
  maxinit?: string;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-maxgen
   */
  maxgen?: number;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-maxmem
   */
  maxmem?: number;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-maxmsg
   */
  maxmsg?: (CompilerOptions.Flag | number)[];
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-maxnest
   */
  maxnest?: CompilerOptions.MaxNest;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-maxrunonif
   */
  maxRunOnIf?: number;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-maxstatic
   */
  maxStatic?: string;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-maxstmt
   */
  maxStmt?: CompilerOptions.MaxStatement;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-maxtemp
   */
  maxTemp?: number;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-mdeck
   */
  mDeck?: CompilerOptions.MDeck;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-msgsummary
   */
  msgSummary?: CompilerOptions.MsgSummary;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-name
   */
  name?: string | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-names
   */
  names?: CompilerOptions.Names;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-natlang
   */
  natlang?: CompilerOptions.NatLang;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-nest
   */
  nest?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-not
   */
  not?: string;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-nulldate
   */
  nullDate?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-object
   */
  object?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-offset
   */
  offset?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-offsetsize
   */
  offsetSize?: number;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-onsnap
   */
  onSnap?: CompilerOptions.OnSnap;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-optimize
   */
  optimize?: CompilerOptions.Optimize;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-options
   */
  options?: CompilerOptions.Options;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-
   */
  or?: string;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-pp
   */
  pp?: CompilerOptions.PP;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-ppcics
   */
  ppCics?: string | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-ppinclude
   */
  ppInclude?: string | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-pplist
   */
  ppList?: "KEEP" | "ERASE";
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-ppmacro
   */
  ppMacro?: string | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-ppsql
   */
  ppSql?: string | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-pptrace
   */
  ppTrace?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-prectype
   */
  precType?: "ANS" | "DECDIGIT" | "DECRESULT";
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-prefix
   */
  prefix?: string[];
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-proceed
   */
  proceed?: CompilerOptions.Proceed;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-process
   */
  process?: "DELETE" | "KEEP" | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-quote
   */
  quote?: string;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-reduce
   */
  reduce?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-rent
   */
  rent?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-resexp
   */
  resExp?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-respect
   */
  respect?: CompilerOptions.Respect;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-rtcheck
   */
  rtCheck?: "NONULLPTR" | "NULLPTR" | "NULL370";
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-rules
   */
  rules?: CompilerOptions.Rules;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-semantic
   */
  semantic?: CompilerOptions.Semantic;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-service
   */
  service?: string | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-source
   */
  source?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-spill
   */
  spill?: string;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-static
   */
  static?: CompilerOptions.Length;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-stdsys
   */
  stdsys?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-stmt
   */
  stmt?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-storage
   */
  storage?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-stringofgraphic
   */
  stringOfGraphic?: "GRAPHIC" | "CHARACTER";
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-syntax
   */
  syntax?: CompilerOptions.Syntax;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-sysparm
   */
  sysParm?: string;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-system
   */
  system?: CompilerOptions.System;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-terminal
   */
  terminal?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-test
   */
  test?: CompilerOptions.Test;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-unroll
   */
  unroll?: "AUTO" | "NO";
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-usage
   */
  usage?: CompilerOptions.Usage;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-widechar
   */
  widechar?: "BIGENDIAN" | "LITTLEENDIAN";
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-window
   */
  window?: number;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-writable
   */
  writable?: CompilerOptions.Writable;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-xinfo
   */
  xInfo?: CompilerOptions.XInfo;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-xml
   */
  xml?: CompilerOptions.XML;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-xref
   */
  xRef?: CompilerOptions.XRef;
}

export declare namespace CompilerOptions {
  export type Length = "SHORT" | "FULL";
  export interface Attributes {
    include?: boolean;
    identifiers?: Length;
  }
  export interface Aggregate {
    offsets?: "DECIMAL" | "HEXADEC";
  }
  export type Assert = "ENTRY" | "CONDITION";
  export type Case = "UPPER" | "ASIS";
  export type CaseRules = "MIXED" | "UPPER" | "LOWER" | "START";
  export interface Check {
    storage?: "STORAGE" | "NOSTORAGE";
  }
  export type CMPat = "LE" | "V1" | "V2" | "V3";
  export interface Compile {
    severity?: "ERROR" | "WARNING" | "SEVERE";
  }
  export interface DD {
    sysprint?: string;
    sysin?: string;
    syslib?: string;
    syspunch?: string;
    syslin?: string;
    sysadata?: string;
    sysxmlsd?: string;
    sysdebug?: string;
  }
  export interface Decimal {
    checkfloat?: boolean;
    foflonadd?: boolean;
    foflonasgn?: boolean;
    foflondiv?: boolean;
    foflonmult?: boolean;
    forcedsign?: boolean;
    keepminus?: boolean;
    truncfloat?: boolean;
  }
  export interface Default {
    aligned?: boolean;
    architecture?: "IBM" | "ANS";
    encoding?: "EBCDIC" | "ASCII";
    assignable?: boolean;
    bin1arg?: boolean;
    allocator?: "BYADDR" | "BYVALUE";
    connected?: boolean;
    desc?: "LIST" | "LOCATOR";
    descriptor?: boolean;
    dummy?: {
      aligned?: boolean;
    };
    e?: {
      format?: "HEXADEC" | "IEEE";
    };
    evendec?: boolean;
    format?: "HEXADEC" | "IEEE";
    initfill?: string | false;
    inline?: boolean;
    laxqual?: boolean;
    linkage?: {
      type?: "OPTLINK" | "SYSTEM";
    };
    inc?: "LOWERINC" | "UPPERINC";
    native?: boolean;
    nativeAddr?: boolean;
    nullinit?: {
      type?: "NULL" | "SYSNULL";
    };
    nullsys?: "NULL370" | "NULLSYS";
    nullStrAddr?: boolean;
    nullStrPtr?: {
      type?: "NULL" | "STRICT" | "SYSNULL";
    };
    order?: "ORDER" | "REORDER";
    ordinal?: {
      type: "MIN" | "MAX";
    };
    overlap?: boolean;
    padding?: boolean;
    pseudodummy?: boolean;
    recursive?: boolean;
    retcode?: boolean;
    returns?: {
      type: "BYADDR" | "BYVALUE";
    };
    short?: {
      format?: "HEXADEC" | "IEEE";
    };
  }
  export interface Deprecate {
    items: DeprecateItem[];
  }
  export interface DeprecateItem {
    type: "BUILTIN" | "ENTRY" | "INCLUDE" | "STMT" | "VARIABLE";
    value: string;
  }
  export interface Display {
    std?: boolean;
    wto?: boolean;
    routcde?: string[];
    desc?: string[];
    reply?: string[];
  }
  export interface Exit {
    inparm?: string;
  }
  export interface FileRef {
    hash: boolean;
  }
  export type Flag = "W" | "I" | "E" | "S";
  export interface Float {
    dfp?: boolean;
  }
  export interface FloatInMath {
    type: "ASIS" | "LONG" | "EXTENDED";
  }
  export interface GoNumber {
    separate?: boolean;
  }
  export type Header = "ALL" | "FILE" | "FIRST" | "SOURCE";
  export interface HGPR {
    preserve: boolean;
  }
  export interface Ignore {
    items?: ("ASSERT" | "DISPLAY" | "PUT")[];
  }
  export interface IncAfter {
    process?: string;
    token?: Token;
  }
  export interface IncDir {
    directory: string;
  }
  export interface InitAuto {
    length?: Length;
  }
  export interface InSource {
    type: "FULL" | "SHORT" | "ALL" | "FIRST";
  }
  export interface Json {
    case?: "UPPER" | "LOWER" | "ASIS";
    encoding?: "UTF8" | "EBCDIC" | "37" | "1047";
    get?: "HEEDCASE" | "IGNORECASE";
    trimr?: boolean;
    parse?: "V1" | "V2";
  }
  export interface LangLvl {
    os?: boolean;
    noext?: boolean;
  }
  export interface Limits {
    extname?: number;
    fixedDec?: {
      max?: number;
      min?: number;
    };
    name?: number;
    string?: string;
  }
  export type ListView =
    | "SOURCE"
    | "AFTERALL"
    | "AFTERCICS"
    | "AFTERMACRO"
    | "AFTERSQL";
  export interface Margini {
    active: boolean;
    character: string;
  }
  export interface Margins {
    m: number;
    n: number;
    /**
     * The column number of the ANS printer control character.
     * It must not exceed 200, and it should be outside the values specified for m and n.
     * A value of 0 for c indicates that no ANS control character is present.
     * Only the following control characters can be used:
     * * **(blank)** Skip one line before printing
     * * **0** Skip two lines before printing
     * * **-** skip three lines before printing
     * * **+** No skip before printing
     * * **1** Start new page
     *
     * Any other character is an error and is replaced by a blank.
     *
     * Do not use a value of c that is greater than the maximum length of a source record,
     * because this causes the format of the listing to be unpredictable.
     * To avoid this problem, put the carriage control characters to the left
     * of the source margins for variable-length records.
     *
     * Specifying MARGINS(,,c) is an alternative to using %PAGE and %SKIP statements .
     */
    c?: string;
  }
  export interface MaxNest {
    /**
     * Default: 17
     */
    block?: number;
    /**
     * Default: 17
     */
    do?: number;
    /**
     * Default: 17
     */
    if?: number;
  }
  export interface MaxStatement {
    /**
     * Specifies the cutoff value for OPT(2).
     * Default: 4096
     */
    m: number;
    /**
     * Optional. Specifies the cutoff value for OPT(3). The default is 8192.
     */
    n?: number;
  }
  export type MDeck =
    | {
        type?: "AFTERALL" | "AFTERMACRO";
      }
    | false;
  export type MsgSummary =
    | {
        xref?: boolean;
      }
    | false;
  export type Names = {
    extralingChar?: string;
    uppExtralingChar?: string;
  };
  /**
   * ENU: All compiler messages, headers, and so on will be in mixedcase English.
   *
   * UEN: All compiler messages, headers, and so on will be in uppercase English.
   */
  export type NatLang = "ENU" | "UEN";
  export type OnSnap =
    | {
        stringRange?: boolean;
        stringSize?: boolean;
      }
    | false;
  export type Optimize =
    | {
        level?: 0 | 2 | 3 | "TIME";
      }
    | false;
  export type Options =
    | {
        all?: boolean;
        doc?: boolean;
      }
    | false;
  export type PP = PPItem[] | false;
  export interface PPItem {
    name: string;
    value?: string;
  }
  export type Proceed =
    | {
        flag?: Flag;
      }
    | true;
  export type Respect = {
    date?: boolean;
  };
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-rules
   */
  export type Rules = {
    ibm?: boolean;
    ans?: boolean;
    yy?: boolean;
    byname?: boolean;
    complex?:
      | true
      | {
          value?: "ALL" | "SOURCE";
        };
    controlled?: boolean;
    decsize?: boolean;
    elseif?: boolean;
    evendec?: boolean;
    global?:
      | true
      | {
          value?: "ALL" | "SOURCE";
        };
    globalDo?: boolean;
    goto?:
      | true
      | {
          value?: "STRICT" | "LOOSE" | "LOOSEFORWARD";
        };
    laxbif?: boolean;
    laxconv?:
      | true
      | {
          value?: "ALL" | "SOURCE";
        };
    laxctl?: boolean;
    laxdef?: boolean;
    laxExports?: boolean;
    laxFields?: boolean;
    laxInterface?: boolean;
    laxEntry?:
      | true
      | {
          value?: "STRICT" | "LOOSE";
        };
    laxIf?: boolean;
    laxInOut?:
      | true
      | {
          source?: "ALL" | "SOURCE";
          strict?: "STRICT" | "LOOSE";
        };
    laxLink?: boolean;
    laxMargins?:
      | true
      | {
          strict?: "STRICT" | "XNUMERIC";
        };
    laxNested?:
      | true
      | {
          source?: "ALL" | "SOURCE";
        };
    laxOptional?:
      | true
      | {
          source?: "ALL" | "SOURCE";
        };
    laxPackage?: boolean;
    laxParams?:
      | true
      | {
          source?: "ALL" | "SOURCE";
        };
    laxPunc?: boolean;
    laxQual?:
      | true
      | {
          strict?: "LOOSE" | "STRICT" | "FULL";
          force?: "ALL" | "FORCE";
        };
    laxReturn?: boolean;
    laxScale?:
      | true
      | {
          strict?: "LOOSE" | "STRICT";
          source?: "ALL" | "SOURCE";
        };
    laxSemi?: boolean;
    laxStg?: boolean;
    laxStmt?:
      | true
      | {
          source?: "ALL" | "SOURCE";
        };
    laxStrz?: boolean;
    multiClose?: boolean;
    multiEntry?:
      | true
      | {
          source?: "ALL" | "SOURCE";
        };
    multiExit?:
      | true
      | {
          source?: "ALL" | "SOURCE";
        };
    multiSemi?:
      | true
      | {
          source?: "ALL" | "SOURCE";
        };
    padding?:
      | true
      | {
          source?: "ALL" | "SOURCE";
          strict?: "STRICT" | "LOOSE";
        };
    procEndOnly?:
      | true
      | {
          source?: "ALL" | "SOURCE";
        };
    recursive?: boolean;
    selfAssign?: boolean;
    unref?:
      | true
      | {
          source?: "ALL" | "SOURCE";
        };
    unrefBased?:
      | true
      | {
          source?: "ALL" | "SOURCE";
        };
    unrefCtl?:
      | true
      | {
          source?: "ALL" | "SOURCE";
        };
    unrefDefined?:
      | true
      | {
          source?: "ALL" | "SOURCE";
        };
    unrefEntry?:
      | true
      | {
          source?: "ALL" | "SOURCE";
        };
    unrefDefFile?:
      | true
      | {
          source?: "ALL" | "SOURCE";
        };
    unrefStatic?:
      | true
      | {
          source?: "ALL" | "SOURCE";
        };
    unrefValue?:
      | true
      | {
          source?: "ALL" | "SOURCE";
        };
    unset?:
      | true
      | {
          source?: "ALL" | "SOURCE";
        };
  };
  export type Semantic =
    | true
    | {
        flag?: CompilerOptions.Flag;
      };
  export type Syntax =
    | true
    | {
        flag?: CompilerOptions.Flag;
      };
  export type System = "MVS" | "CICS" | "IMS" | "OS" | "TSO";
  export type Test =
    | false
    | {
        level?: "ALL" | "BLOCK" | "NONE" | "PATH" | "STMT";
        hook?: boolean;
        separate?: boolean;
        sepName?: boolean;
        source?: boolean;
        sym?: boolean;
      };
  export type Usage = {
    hex?: "SIZE" | "CURRENTSIZE";
    regex?: {
      reset?: boolean;
    };
    round?: "IBM" | "ANS";
    substr?: "STRICT" | "LOOSE";
    unspec?: "IBM" | "ANS";
    uuid?: "UPPER" | "LOWER";
    validDate?: "LOOSE" | "STRICT";
  };
  export type Writable =
    | true
    | {
        value?: "FWS" | "PRV";
      };
  export type XInfo = {
    def?: boolean;
    msg?: boolean;
    sym?: boolean;
    xml?:
      | false
      | {
          hash?: boolean;
        };
  };
  export type XML = {
    case?: "UPPER" | "ASIS";
    xmlAttr?: "APOSTROPHE" | "QUOTE";
  };
  export type XRef = {
    length?: Length;
    structure?: "EXPLICIT" | "IMPLICIT";
  };
}
