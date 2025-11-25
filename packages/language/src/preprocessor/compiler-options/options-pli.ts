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
import { Token } from "../../parser/tokens";

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
  attributes?: CompilerOptions.Length | false;
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
  compile?: CompilerOptions.Compile;
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
  exit?: string | false;
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
  incPds?: CompilerOptions.IncPds | false;
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
  inSource?: CompilerOptions.InSource | false;
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
  margini?: string;
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
  maxinit?: number;
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
  maxmsg?: CompilerOptions.MaxMsg;
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
  maxStatic?: number;
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
  mDeck?: CompilerOptions.MDeck | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-msgsummary
   */
  msgSummary?: CompilerOptions.MsgSummary | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-name
   */
  name?: string | boolean;
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
  ppMacro?: CompilerOptions.PPValue | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-ppsql
   */
  ppSql?: CompilerOptions.PPValue | false;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-pptrace
   */
  ppTrace?: boolean;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-prectype
   */
  precType?: CompilerOptions.PrecType;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-prefix
   */
  prefix?: CompilerConditions.ConditionOptions;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-proceed
   */
  proceed?: CompilerOptions.Proceed;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-process
   */
  process?: CompilerOptions.Process | false;
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
  rtCheck?: CompilerOptions.RtCheck;
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
  spill?: number;
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
  stringOfGraphic?: CompilerOptions.StringOfGraphic;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-syntax
   */
  syntax?: CompilerOptions.Syntax;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-sysparm
   */
  sysParm: string;
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-system
   */
  system: CompilerOptions.System;
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
  unroll?: CompilerOptions.Unroll;
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
  export type Aggregate = "DECIMAL" | "HEXADEC";
  export type Assert = "ENTRY" | "CONDITION";
  export type Case = "UPPER" | "ASIS";
  export type CaseRules = "MIXED" | "UPPER" | "LOWER" | "START";
  export interface Check {
    storage?: "STORAGE" | "NOSTORAGE";
  }
  export type CMPat = "LE" | "V1" | "V2" | "V3";
  export interface Compile {
    noCompile: true | "E" | "W" | "S";
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
    // TODO ssmifi: check if these should really be accumulated or be overwritten per type.
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
    directories: string[];
  }

  export interface IncPds {
    pds: string[];
  }

  export type InitAuto = "SHORT" | "FULL" | false;
  export interface InSource {
    type?: "FULL" | "SHORT" | "ALL" | "FIRST";
  }
  export interface Json {
    case?: "UPPER" | "LOWER" | "ASIS";
    encoding?: "UTF8" | "EBCDIC" | "37" | "1047";
    get?: "HEEDCASE" | "IGNORECASE";
    trimr?: boolean;
    parse?: "V1" | "V2";
  }
  export type LangLvl = "OS" | "NOEXT";
  export interface Limits {
    extname?: number;
    fixedBin?: {
      min?: number;
      max?: number;
    };
    fixedDec?: {
      min?: number;
      max?: number;
    };
    name?: number;
    string?: number;
  }
  export type ListView =
    | "SOURCE"
    | "AFTERALL"
    | "AFTERCICS"
    | "AFTERMACRO"
    | "AFTERSQL";
  export interface Margini {
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
    c?: number;
  }
  export interface MaxMsg {
    severity: Flag;
    n: number;
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
  export type MDeck = "AFTERALL" | "AFTERMACRO";
  export type MsgSummary = "XREF" | "NOXREF";
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
  export type Optimize = 0 | 3;
  export type Options = "DOC" | "ALL" | false;
  export type PPOption = PP | false;

  export type PP = {
    items: PPItem[];

    /**
     * Effective PPINCLUDE option value (alt. include keyword)
     */
    ppInclude?: PPInclude;
  };

  export interface PPInclude {
    value: string;
  }

  export interface PPItem extends PPValue {
    name: "MACRO" | "SQL" | "CICS" | "INCLUDE";
  }
  export interface PPValue {
    value?: string;
    token?: Token;
  }
  export type PrecType = "ANS" | "DECDIGIT" | "DECRESULT";
  export type Proceed = {
    // *PROCESS NOPROCEED; actually results in NOPROCEED( I ); which stops
    // compilation after the preprocessors.
    noProceed: Flag;
  };
  export type Process = "DELETE" | "KEEP";
  export type Respect = {
    date?: boolean;
  };
  export type RtCheck = "NONULLPTR" | "NULLPTR" | "NULL370";
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-rules
   */
  export type Rules = {
    ibm?: "IBM" | "ANS";
    byName?: boolean;
    complex?: "ALL" | "SOURCE" | true;
    controlled?: boolean;
    decSize?: boolean;
    elseIf?: boolean;
    evenDec?: boolean;
    global?: "ALL" | "SOURCE" | true;
    globalDo?: boolean;
    goto?: "STRICT" | "LOOSE" | "LOOSEFORWARD" | true;
    laxBIf?: boolean;
    laxConv?: "ALL" | "SOURCE" | true;
    laxCtl?: boolean;
    laxDcl?: boolean;
    laxDef?: boolean;
    laxEntry?: "STRICT" | "LOOSE" | true;
    laxExports?: boolean;
    laxFields?: boolean;
    laxIf?: boolean;
    laxInOut?:
      | {
          source?: "ALL" | "SOURCE";
          strict?: "STRICT" | "LOOSE";
        }
      | true;
    laxInterface?: boolean;
    laxLink?: boolean;
    laxMargins?: "STRICT" | "XNUMERIC" | true;
    laxNested?: "ALL" | "SOURCE" | true;
    laxOptional?: "ALL" | "SOURCE" | true;
    laxPackage?: boolean;
    laxParms?: "ALL" | "SOURCE" | true;
    laxPunc?: boolean;
    laxQual?:
      | {
          source?: "ALL" | "FORCE";
          strict?: "STRICT" | "LOOSE" | "FULL";
        }
      | true;
    laxReturn?: boolean;
    laxScale?:
      | {
          source?: "ALL" | "SOURCE";
          strict?: "STRICT" | "LOOSE";
        }
      | true;
    laxSemi?: boolean;
    laxStg?: boolean;
    laxStmt?: "ALL" | "SOURCE" | true;
    laxStrz?: boolean;
    multiClose?: boolean;
    multiEntry?: "ALL" | "SOURCE" | true;
    multiExit?: "ALL" | "SOURCE" | true;
    multiSemi?: "ALL" | "SOURCE" | true;
    padding?:
      | {
          source?: "ALL" | "SOURCE";
          strict?: "STRICT" | "LOOSE";
        }
      | true;
    procEndOnly?: "ALL" | "SOURCE" | true;
    recursive?: boolean;
    selfAssign?: boolean;
    unref?: "ALL" | "SOURCE" | true;
    unrefBased?: "ALL" | "SOURCE" | true;
    unrefCtl?: "ALL" | "SOURCE" | true;
    unrefDefined?: "ALL" | "SOURCE" | true;
    unrefEntry?: "ALL" | "SOURCE" | true;
    unrefFile?: "ALL" | "SOURCE" | true;
    unrefStatic?: "ALL" | "SOURCE" | true;
    unrefValue?: "ALL" | "SOURCE" | true;
    unset?: boolean;
    yy?: boolean;
  };
  export type Semantic = {
    // *PROCESS NOSEMANTIC; actually results in NOSEMANTIC( I );
    noSemantic: Flag;
  };
  export type StringOfGraphic = "GRAPHIC" | "CHARACTER";
  export type Syntax = {
    // *PROCESS NOSYNTAX; actually results in NOSYNTAX( I );
    noSyntax: Flag;
  };
  export type System = "MVS" | "CICS" | "IMS" | "OS" | "TSO";
  export type TestLevel = "ALL" | "BLOCK" | "NONE" | "PATH" | "STMT";
  export type Test =
    | {
        level?: TestLevel;
        hook?: boolean;
        separate?: boolean;
        sepName?: boolean;
        source?: boolean;
        sym?: boolean;
      }
    | false;
  export type Unroll = "AUTO" | "NO";
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
        noWritable?: "FWS" | "PRV";
      };
  export type XInfo = {
    def?: boolean;
    msg?: boolean;
    sym?: boolean;
    syn?: boolean;
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
  export type XRef =
    | {
        length?: Length;
        structure?: "EXPLICIT" | "IMPLICIT";
      }
    | false;
}

export namespace CompilerConditions {
  export type Condition = {
    condition: string[];
    alwaysEnabled?: boolean;
  };

  export const PLI_CONDITIONS = [
    { condition: ["ANYCONDITION", "ANYCOND"], alwaysEnabled: true },
    { condition: ["AREA"], alwaysEnabled: true },
    { condition: ["ASSERTION"], alwaysEnabled: true },
    { condition: ["ATTENTION", "ATTN"], alwaysEnabled: true },
    { condition: ["CONDITION"], alwaysEnabled: true },
    { condition: ["CONFORMANCE"] },
    { condition: ["CONVERSION", "CONV"] },
    { condition: ["ENDFILE"], alwaysEnabled: true },
    { condition: ["ENDPAGE"], alwaysEnabled: true },
    { condition: ["ERROR"], alwaysEnabled: true },
    { condition: ["FINISH"], alwaysEnabled: true },
    { condition: ["FIXEDOVERFLOW", "FOFL"] },
    { condition: ["INVALIDOP"] },
    { condition: ["KEY"], alwaysEnabled: true },
    { condition: ["NAME"], alwaysEnabled: true },
    { condition: ["OVERFLOW", "OFL"] },
    { condition: ["RECORD"], alwaysEnabled: true },
    { condition: ["SIZE"] },
    { condition: ["STORAGE"], alwaysEnabled: true },
    { condition: ["STRINGRANGE", "STRNG"] },
    { condition: ["STRINGSIZE", "STRSZ"] },
    { condition: ["SUBSCRIPTRANGE", "SUBRG"] },
    { condition: ["TRANSMIT"], alwaysEnabled: true },
    { condition: ["UNDEFINEDFILE", "UNDF"], alwaysEnabled: true },
    { condition: ["UNDERFLOW", "UFL"] },
    { condition: ["ZERODIVIDE", "ZDIV"] },
  ] as const;

  export type All = (typeof PLI_CONDITIONS)[number];
  export type NotAlwaysEnabled = Exclude<All, { alwaysEnabled: true }>;
  export type AssignableConditions = NotAlwaysEnabled["condition"][0];
  export type ConditionOptions = {
    [K in Lowercase<AssignableConditions>]?: boolean;
  };
}

const $1K = 1024;
const $1M = 1024 * 1024;

const defaultCompilerOptions: CompilerOptions = {
  arch: 10,
  assert: "ENTRY",
  attributes: "FULL",
  aggregate: false,
  backreg: 5,
  bifprec: 31,
  blank: " ",
  blkoff: true,
  brackets: ["[", "]"],
  case: "UPPER",
  caserules: "MIXED",
  check: { storage: "NOSTORAGE" },
  cmpat: "V2",
  common: false,
  compile: { noCompile: "S" },
  csect: true,
  currency: "$",
  dbcs: false,
  dbrmlib: false,
  deprecate: { items: [] },
  deprecateNext: { items: [] },
  ddsql: "",
  decimal: {
    checkfloat: false,
    foflonadd: false,
    foflonasgn: true,
    foflondiv: false,
    foflonmult: false,
    forcedsign: false,
    keepminus: false,
    truncfloat: false,
  },
  decomp: false,
  default: {
    aligned: true,
    architecture: "IBM",
    encoding: "EBCDIC",
    assignable: true,
    bin1arg: true,
    allocator: "BYADDR",
    connected: false,
    desc: "LOCATOR",
    descriptor: true,
    dummy: {
      aligned: true,
    },
    e: {
      format: "HEXADEC",
    },
    evendec: true,
    format: "HEXADEC",
    initfill: false,
    inline: false,
    laxqual: false,
    linkage: {
      type: "OPTLINK",
    },
    inc: "LOWERINC",
    native: true,
    nativeAddr: true,
    nullinit: {
      type: "NULL",
    },
    nullsys: "NULL370",
    nullStrAddr: true,
    nullStrPtr: {
      type: "NULL",
    },
    order: "REORDER",
    ordinal: {
      type: "MIN",
    },
    overlap: false,
    padding: false,
    pseudodummy: true,
    recursive: false,
    retcode: false,
    returns: {
      type: "BYADDR",
    },
    short: {
      format: "HEXADEC",
    },
  },
  dll: false,
  dllInit: false,
  exit: false,
  extrn: "FULL",
  exportAll: true,
  fileRef: { hash: false },
  float: { dfp: false },
  floatInMath: { type: "ASIS" },
  goff: false,
  goNumber: false,
  json: {
    case: "UPPER",
    get: "HEEDCASE",
    parse: "V1",
    trimr: true,
  },
  limits: {
    extname: 7,
    fixedBin: {
      min: 31,
      max: 63,
    },
    fixedDec: {
      min: 15,
      max: 31,
    },
    name: 100,
    string: 32 * $1K,
  },
  lineCount: 31415,
  initAuto: "FULL",
  margini: " ",
  margins: {
    m: 2,
    n: 72,
  },
  maxbranch: 2000,
  maxinit: 64 * $1K,
  maxgen: 100000,
  maxmem: $1M,
  maxmsg: {
    severity: "W",
    n: 250,
  },
  maxnest: {
    block: 17,
    do: 17,
    if: 17,
  },
  maxRunOnIf: 10,
  maxStmt: {
    m: 4 * $1K,
    n: 8 * $1K,
  },
  maxTemp: 50000,
  mDeck: false,
  msgSummary: false,
  name: false,
  names: {
    extralingChar: "@#$",
    uppExtralingChar: "@#$",
  },
  natlang: "ENU",
  nest: false,
  nullDate: false,
  object: true,
  offset: false,
  offsetSize: 4,
  onSnap: false,
  optimize: 0,
  options: "DOC",
  pp: {
    items: [{ name: "MACRO" }, { name: "SQL" }],
  },
  precType: "ANS",
  prefix: {
    conformance: false,
    conversion: true,
    fixedoverflow: true,
    invalidop: true,
    overflow: true,
    size: false,
    stringrange: false,
    stringsize: false,
    subscriptrange: false,
    underflow: true,
    zerodivide: true,
  },
  proceed: { noProceed: "S" },
  process: "DELETE",
  quote: '"',
  reduce: true,
  rent: false,
  resExp: true,
  respect: { date: false },
  rtCheck: "NONULLPTR",
  rules: {
    ibm: "IBM",
    byName: true,
    complex: true,
    controlled: true,
    decSize: false,
    elseIf: true,
    evenDec: true,
    global: true,
    globalDo: true,
    goto: true,
    laxBIf: false,
    laxConv: true,
    laxCtl: false,
    laxDcl: false,
    laxDef: false,
    laxEntry: true,
    laxExports: true,
    laxFields: true,
    laxIf: false,
    laxInOut: true,
    laxInterface: true,
    laxLink: true,
    laxMargins: true,
    laxNested: true,
    laxOptional: true,
    laxPackage: true,
    laxParms: true,
    laxPunc: true,
    laxQual: true,
    laxReturn: true,
    laxScale: { source: "ALL", strict: "LOOSE" },
    laxSemi: true,
    laxStg: true,
    laxStmt: true,
    laxStrz: false,
    multiClose: false,
    multiEntry: true,
    multiExit: true,
    multiSemi: true,
    padding: true,
    procEndOnly: true,
    recursive: true,
    selfAssign: true,
    unref: true,
    unrefBased: true,
    unrefCtl: true,
    unrefDefined: true,
    unrefEntry: true,
    unrefFile: true,
    unrefStatic: true,
    unrefValue: true,
    unset: true,
    yy: true,
  },
  service: "",
  source: true,
  spill: 512,
  static: "SHORT",
  stdsys: false,
  stmt: false,
  storage: false,
  stringOfGraphic: "GRAPHIC",
  syntax: { noSyntax: "S" },
  sysParm: "",
  system: "MVS",
  terminal: true,
  test: false,
  unroll: "AUTO",
  usage: {
    hex: "SIZE",
    regex: {
      reset: true,
    },
    round: "IBM",
    substr: "STRICT",
    unspec: "IBM",
    uuid: "UPPER",
    validDate: "LOOSE",
  },
  widechar: "BIGENDIAN",
  window: 1950,
  writable: true,
  xInfo: {
    def: false,
    msg: false,
    sym: false,
    syn: false,
    xml: {
      hash: false,
    },
  },
  xml: {
    case: "UPPER",
    xmlAttr: "APOSTROPHE",
  },
  xRef: {
    length: "FULL",
    structure: "IMPLICIT",
  },
};

export function getDefaultCompilerOptions(): CompilerOptions {
  return { ...defaultCompilerOptions };
}
