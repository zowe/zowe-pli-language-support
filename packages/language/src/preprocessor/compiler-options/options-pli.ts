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
  LP?: CompilerOptions.LP;
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
  options?: CompilerOptions.Options | false;
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
  ppList?: CompilerOptions.PPList;
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
  widechar?: CompilerOptions.WideChar;
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

export namespace CompilerOptions {
  // Enums
  export enum Length {
    SHORT,
    FULL,
  }

  export enum Aggregate {
    DECIMAL,
    HEXADEC,
  }

  export enum Assert {
    ENTRY,
    CONDITION,
  }

  export enum Case {
    UPPER,
    ASIS,
  }

  export enum CaseRules {
    MIXED,
    UPPER,
    LOWER,
    START,
  }

  export enum CheckStorage {
    STORAGE,
    NOSTORAGE,
  }

  export enum CMPat {
    LE,
    V1,
    V2,
    V3,
  }

  export enum Flag {
    W,
    I,
    E,
    S,
  }

  export enum FloatInMathType {
    ASIS,
    LONG,
    EXTENDED,
  }

  export enum Header {
    ALL,
    FILE,
    FIRST,
    SOURCE,
  }

  export enum IgnoreItem {
    ASSERT,
    DISPLAY,
    PUT,
  }

  export enum InitAuto {
    SHORT,
    FULL,
  }

  export enum InSourceType {
    FULL,
    SHORT,
    ALL,
    FIRST,
  }

  export enum JsonCase {
    UPPER,
    LOWER,
    ASIS,
  }

  export enum JsonEncoding {
    UTF8,
    EBCDIC,
    EBCDIC_37,
    EBCDIC_1047,
  }

  export enum JsonGet {
    HEEDCASE,
    IGNORECASE,
  }

  export enum JsonParse {
    V1,
    V2,
  }

  export enum LangLvl {
    OS,
    NOEXT,
  }

  export enum ListView {
    SOURCE,
    AFTERALL,
    AFTERCICS,
    AFTERMACRO,
    AFTERSQL,
  }

  export enum LP {
    LP32,
    LP64,
  }

  export enum MDeck {
    AFTERALL,
    AFTERMACRO,
  }

  export enum MsgSummary {
    XREF,
    NOXREF,
  }

  export enum NatLang {
    ENU,
    UEN,
  }

  export enum Options {
    DOC,
    ALL,
  }

  export enum PPItemName {
    MACRO,
    SQL,
    CICS,
    INCLUDE,
  }

  export enum PrecType {
    ANS,
    DECDIGIT,
    DECRESULT,
  }

  export enum Process {
    DELETE,
    KEEP,
  }

  export enum RtCheck {
    NONULLPTR,
    NULLPTR,
    NULL370,
  }

  export enum RulesIBM {
    IBM,
    ANS,
  }

  export enum RulesSource {
    ALL,
    SOURCE,
  }

  export enum RulesStrict {
    STRICT,
    LOOSE,
  }

  export enum RulesGoto {
    STRICT,
    LOOSE,
    LOOSEFORWARD,
  }

  export enum RulesEntry {
    STRICT,
    LOOSE,
  }

  export enum RulesQualSource {
    ALL,
    FORCE,
  }

  export enum RulesQualStrict {
    STRICT,
    LOOSE,
    FULL,
  }

  export enum RulesMargins {
    STRICT,
    XNUMERIC,
  }

  export enum DeprecateItemType {
    BUILTIN,
    ENTRY,
    INCLUDE,
    STMT,
    VARIABLE,
  }

  export enum StringOfGraphic {
    GRAPHIC,
    CHARACTER,
  }

  export enum System {
    MVS,
    CICS,
    IMS,
    OS,
    TSO,
  }

  export enum TestLevel {
    ALL,
    BLOCK,
    NONE,
    PATH,
    STMT,
  }

  export enum Unroll {
    AUTO,
    NO,
  }

  export enum UsageHex {
    SIZE,
    CURRENTSIZE,
  }

  export enum UsageRound {
    IBM,
    ANS,
  }

  export enum UsageSubstr {
    STRICT,
    LOOSE,
  }

  export enum UsageUnspec {
    IBM,
    ANS,
  }

  export enum UsageUuid {
    UPPER,
    LOWER,
  }

  export enum UsageValidDate {
    LOOSE,
    STRICT,
  }

  export enum WritableNoWritable {
    FWS,
    PRV,
  }

  export enum XMLCase {
    UPPER,
    ASIS,
  }

  export enum XMLAttr {
    APOSTROPHE,
    QUOTE,
  }

  export enum XRefStructure {
    EXPLICIT,
    IMPLICIT,
  }

  export enum PPList {
    KEEP,
    ERASE,
  }

  export enum WideChar {
    BIGENDIAN,
    LITTLEENDIAN,
  }

  export enum DefaultArchitecture {
    IBM,
    ANS,
  }

  export enum DefaultEncoding {
    EBCDIC,
    ASCII,
  }

  export enum DefaultAllocator {
    BYADDR,
    BYVALUE,
  }

  export enum DefaultDesc {
    LIST,
    LOCATOR,
  }

  export enum DefaultFormat {
    HEXADEC,
    IEEE,
  }

  export enum DefaultLinkageType {
    OPTLINK,
    SYSTEM,
  }

  export enum DefaultInc {
    LOWERINC,
    UPPERINC,
  }

  export enum DefaultNullInitType {
    NULL,
    SYSNULL,
  }

  export enum DefaultNullSys {
    NULL370,
    NULLSYS,
  }

  export enum DefaultNullStrPtrType {
    NULL,
    STRICT,
    SYSNULL,
  }

  export enum DefaultOrder {
    ORDER,
    REORDER,
  }

  export enum DefaultOrdinalType {
    MIN,
    MAX,
  }

  export enum DefaultReturnsType {
    BYADDR,
    BYVALUE,
  }

  // Interfaces and types
  export interface Check {
    storage?: CheckStorage;
  }
  export interface Compile {
    noCompile: true | Flag;
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
    architecture?: DefaultArchitecture;
    encoding?: DefaultEncoding;
    assignable?: boolean;
    bin1arg?: boolean;
    allocator?: DefaultAllocator;
    connected?: boolean;
    desc?: DefaultDesc;
    descriptor?: boolean;
    dummy?: {
      aligned?: boolean;
    };
    e?: {
      format?: DefaultFormat;
    };
    evendec?: boolean;
    format?: DefaultFormat;
    initfill?: string | false;
    inline?: boolean;
    laxqual?: boolean;
    linkage?: {
      type?: DefaultLinkageType;
    };
    inc?: DefaultInc;
    native?: boolean;
    nativeAddr?: boolean;
    nullinit?: {
      type?: DefaultNullInitType;
    };
    nullsys?: DefaultNullSys;
    nullStrAddr?: boolean;
    nullStrPtr?: {
      type?: DefaultNullStrPtrType;
    };
    order?: DefaultOrder;
    ordinal?: {
      type: DefaultOrdinalType;
    };
    overlap?: boolean;
    padding?: boolean;
    pseudodummy?: boolean;
    recursive?: boolean;
    retcode?: boolean;
    returns?: {
      type: DefaultReturnsType;
    };
    short?: {
      format?: DefaultFormat;
    };
  }
  export type Deprecate = {
    [K in keyof typeof DeprecateItemType]: Set<string>;
  };
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
  export interface Float {
    dfp?: boolean;
  }
  export interface FloatInMath {
    type: FloatInMathType;
  }
  export interface GoNumber {
    separate?: boolean;
  }
  export interface HGPR {
    preserve: boolean;
  }
  export interface Ignore {
    items?: IgnoreItem[];
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

  export interface InSource {
    type?: InSourceType;
  }
  export interface Json {
    case?: JsonCase;
    encoding?: JsonEncoding;
    get?: JsonGet;
    trimr?: boolean;
    parse?: JsonParse;
  }
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
  export type Names = {
    extralingChar?: string;
    uppExtralingChar?: string;
  };
  /**
   * ENU: All compiler messages, headers, and so on will be in mixedcase English.
   *
   * UEN: All compiler messages, headers, and so on will be in uppercase English.
   */
  export type OnSnap =
    | {
        stringRange?: boolean;
        stringSize?: boolean;
      }
    | false;
  export type Optimize = 0 | 3;
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
    name: PPItemName;
  }
  export interface PPValue {
    value?: string;
    token?: Token;
    // PP values are accumulated, e.g., by multiple directives or configurations.
    // However, they should be processed only once. This has to be done during the processing phase
    // and cannot be postponed to a later stage, because the options might depend on the concrete configuration.
    // Therefore, we keep track whether they have already been processed.
    processed?: boolean;
  }
  export type Proceed = {
    // *PROCESS NOPROCEED; actually results in NOPROCEED( I ); which stops
    // compilation after the preprocessors.
    noProceed: Flag;
  };
  export type Respect = {
    date?: boolean;
  };
  /**
   * https://www.ibm.com/docs/en/epfz/6.1?topic=descriptions-rules
   */
  export type Rules = {
    ibm?: RulesIBM;
    byName?: boolean;
    complex?: RulesSource | true;
    controlled?: boolean;
    decSize?: boolean;
    elseIf?: boolean;
    evenDec?: boolean;
    global?: RulesSource | true;
    globalDo?: boolean;
    goto?: RulesGoto | true;
    laxBIf?: boolean;
    laxConv?: RulesSource | true;
    laxCtl?: boolean;
    laxDcl?: boolean;
    laxDef?: boolean;
    laxEntry?: RulesEntry | true;
    laxExports?: boolean;
    laxFields?: boolean;
    laxIf?: boolean;
    laxInOut?:
      | {
          source?: RulesSource;
          strict?: RulesStrict;
        }
      | true;
    laxInterface?: boolean;
    laxLink?: boolean;
    laxMargins?: RulesMargins | true;
    laxNested?: RulesSource | true;
    laxOptional?: RulesSource | true;
    laxPackage?: boolean;
    laxParms?: RulesSource | true;
    laxPunc?: boolean;
    laxQual?:
      | {
          source?: RulesQualSource;
          strict?: RulesQualStrict;
        }
      | true;
    laxReturn?: boolean;
    laxScale?:
      | {
          source?: RulesSource;
          strict?: RulesStrict;
        }
      | true;
    laxSemi?: boolean;
    laxStg?: boolean;
    laxStmt?: RulesSource | true;
    laxStrz?: boolean;
    multiClose?: boolean;
    multiEntry?: RulesSource | true;
    multiExit?: RulesSource | true;
    multiSemi?: RulesSource | true;
    padding?:
      | {
          source?: RulesSource;
          strict?: RulesStrict;
        }
      | true;
    procEndOnly?: RulesSource | true;
    recursive?: boolean;
    selfAssign?: boolean;
    unref?: RulesSource | true;
    unrefBased?: RulesSource | true;
    unrefCtl?: RulesSource | true;
    unrefDefined?: RulesSource | true;
    unrefEntry?: RulesSource | true;
    unrefDefFile?: RulesSource | true;
    unrefStatic?: RulesSource | true;
    unrefValue?: RulesSource | true;
    unset?: RulesSource | true;
    yy?: boolean;
  };
  export type Semantic = {
    // *PROCESS NOSEMANTIC; actually results in NOSEMANTIC( I );
    noSemantic: Flag;
  };
  export type Syntax = {
    // *PROCESS NOSYNTAX; actually results in NOSYNTAX( I );
    noSyntax: Flag;
  };
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
  export type Usage = {
    hex?: UsageHex;
    regex?: {
      reset?: boolean;
    };
    round?: UsageRound;
    substr?: UsageSubstr;
    unspec?: UsageUnspec;
    uuid?: UsageUuid;
    validDate?: UsageValidDate;
  };
  export type Writable =
    | true
    | {
        noWritable?: WritableNoWritable;
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
    case?: XMLCase;
    xmlAttr?: XMLAttr;
  };
  export type XRef =
    | {
        length?: Length;
        structure?: XRefStructure;
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

export function getDefaultCompilerOptions(): CompilerOptions {
  return {
    arch: 10,
    assert: CompilerOptions.Assert.ENTRY,
    attributes: CompilerOptions.Length.FULL,
    aggregate: false,
    backreg: 5,
    bifprec: 31,
    blank: " ",
    blkoff: true,
    brackets: ["[", "]"],
    case: CompilerOptions.Case.UPPER,
    caserules: CompilerOptions.CaseRules.MIXED,
    check: { storage: CompilerOptions.CheckStorage.NOSTORAGE },
    cmpat: CompilerOptions.CMPat.V2,
    common: false,
    compile: { noCompile: CompilerOptions.Flag.S },
    csect: true,
    currency: "$",
    dbcs: false,
    dbrmlib: false,
    deprecate: undefined, // undef to quickly exit diagnostics by default
    deprecateNext: undefined,
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
      architecture: CompilerOptions.DefaultArchitecture.IBM,
      encoding: CompilerOptions.DefaultEncoding.EBCDIC,
      assignable: true,
      bin1arg: true,
      allocator: CompilerOptions.DefaultAllocator.BYADDR,
      connected: false,
      desc: CompilerOptions.DefaultDesc.LOCATOR,
      descriptor: true,
      dummy: {
        aligned: true,
      },
      e: {
        format: CompilerOptions.DefaultFormat.HEXADEC,
      },
      evendec: true,
      format: CompilerOptions.DefaultFormat.HEXADEC,
      initfill: false,
      inline: false,
      laxqual: false,
      linkage: {
        type: CompilerOptions.DefaultLinkageType.OPTLINK,
      },
      inc: CompilerOptions.DefaultInc.LOWERINC,
      native: true,
      nativeAddr: true,
      nullinit: {
        type: CompilerOptions.DefaultNullInitType.NULL,
      },
      nullsys: CompilerOptions.DefaultNullSys.NULL370,
      nullStrAddr: true,
      nullStrPtr: {
        type: CompilerOptions.DefaultNullStrPtrType.NULL,
      },
      order: CompilerOptions.DefaultOrder.REORDER,
      ordinal: {
        type: CompilerOptions.DefaultOrdinalType.MIN,
      },
      overlap: false,
      padding: false,
      pseudodummy: true,
      recursive: false,
      retcode: false,
      returns: {
        type: CompilerOptions.DefaultReturnsType.BYADDR,
      },
      short: {
        format: CompilerOptions.DefaultFormat.HEXADEC,
      },
    },
    dll: false,
    dllInit: false,
    exit: false,
    extrn: CompilerOptions.Length.FULL,
    exportAll: true,
    fileRef: { hash: false },
    float: { dfp: false },
    floatInMath: { type: CompilerOptions.FloatInMathType.ASIS },
    goff: false,
    goNumber: false,
    json: {
      case: CompilerOptions.JsonCase.UPPER,
      get: CompilerOptions.JsonGet.HEEDCASE,
      parse: CompilerOptions.JsonParse.V1,
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
    LP: CompilerOptions.LP.LP32,
    initAuto: CompilerOptions.InitAuto.FULL,
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
      severity: CompilerOptions.Flag.W,
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
    natlang: CompilerOptions.NatLang.ENU,
    nest: false,
    nullDate: false,
    object: true,
    offset: false,
    offsetSize: 4,
    onSnap: false,
    optimize: 0,
    options: CompilerOptions.Options.DOC,
    pp: {
      items: [
        { name: CompilerOptions.PPItemName.MACRO },
        { name: CompilerOptions.PPItemName.SQL },
        { name: CompilerOptions.PPItemName.CICS },
      ],
    },
    precType: CompilerOptions.PrecType.ANS,
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
    proceed: { noProceed: CompilerOptions.Flag.S },
    process: CompilerOptions.Process.DELETE,
    quote: '"',
    reduce: true,
    rent: false,
    resExp: true,
    respect: { date: false },
    rtCheck: CompilerOptions.RtCheck.NONULLPTR,
    rules: {
      ibm: CompilerOptions.RulesIBM.IBM,
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
      laxScale: {
        source: CompilerOptions.RulesSource.ALL,
        strict: CompilerOptions.RulesStrict.LOOSE,
      },
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
      unrefDefFile: true,
      unrefStatic: true,
      unrefValue: true,
      unset: true,
      yy: true,
    },
    service: "",
    source: true,
    spill: 512,
    static: CompilerOptions.Length.SHORT,
    stdsys: false,
    stmt: false,
    storage: false,
    stringOfGraphic: CompilerOptions.StringOfGraphic.GRAPHIC,
    syntax: { noSyntax: CompilerOptions.Flag.S },
    sysParm: "",
    system: CompilerOptions.System.MVS,
    terminal: true,
    test: false,
    unroll: CompilerOptions.Unroll.AUTO,
    usage: {
      hex: CompilerOptions.UsageHex.SIZE,
      regex: {
        reset: true,
      },
      round: CompilerOptions.UsageRound.IBM,
      substr: CompilerOptions.UsageSubstr.STRICT,
      unspec: CompilerOptions.UsageUnspec.IBM,
      uuid: CompilerOptions.UsageUuid.UPPER,
      validDate: CompilerOptions.UsageValidDate.LOOSE,
    },
    widechar: CompilerOptions.WideChar.BIGENDIAN,
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
      case: CompilerOptions.XMLCase.UPPER,
      xmlAttr: CompilerOptions.XMLAttr.APOSTROPHE,
    },
    xRef: {
      length: CompilerOptions.Length.FULL,
      structure: CompilerOptions.XRefStructure.IMPLICIT,
    },
  };
}

/**
 * Computes the effective INCLUDE-preprocessor alt-keyword, merging the
 * PPINCLUDE base value with any PP(INCLUDE(...)) override.
 * PPINCLUDE has no effect unless PP(INCLUDE) is also present.
 */
export function getEffectiveIncludeAlt(
  options: CompilerOptions,
): string | undefined {
  const pp = options.pp;
  if (!pp) {
    return undefined;
  }
  if (pp.ppInclude?.value) {
    // Explicit PP(INCLUDE('ID(...)')) override wins.
    return pp.ppInclude.value;
  }
  const includeActive = pp.items.some(
    (item) => item.name === CompilerOptions.PPItemName.INCLUDE,
  );
  if (!includeActive) {
    return undefined;
  }
  if (typeof options.ppInclude === "string") {
    // Fall back to the PPINCLUDE base value (bare PP(INCLUDE), no args).
    const match = options.ppInclude.match(/ID\(([^)]+)\)\s*$/);
    if (match) {
      return match[0].slice(3, -1).toUpperCase();
    }
  }
  return undefined;
}
