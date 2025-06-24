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

import {
  createToken,
  createTokenInstance,
  CustomPatternMatcherFunc,
  IToken,
  Lexer,
  TokenType,
} from "chevrotain";
import { CompilerOptions } from "../preprocessor/compiler-options/options";
import { URI } from "../utils/uri";
import { CstNodeKind } from "../syntax-tree/cst";
import { SyntaxNode } from "../syntax-tree/ast";

/**
 * Payload for a token, containing metadata about its syntax and element.
 */
export interface TokenPayload {
  /**
   * The URI associated with the token, if any.
   */
  uri: URI | undefined;

  /**
   * The kind of CST (Concrete Syntax Tree) node.
   */
  kind: CstNodeKind | undefined;

  /**
   * The syntax node associated with the token.
   */
  element: SyntaxNode | undefined;
}

export interface Token extends Omit<IToken, "endOffset" | "payload"> {
  endOffset: number;
  payload: TokenPayload;
}

export function createSyntheticTokenInstance(
  tokenType: TokenType,
  image: string,
): Token {
  const token = createTokenInstance(
    tokenType,
    image,
    NaN,
    NaN,
    NaN,
    NaN,
    NaN,
    NaN,
  ) as Token;
  token.payload = {
    uri: undefined,
    kind: undefined,
    element: undefined,
  };
  return token;
}

// Combination tokens (parser optimization)
export const LinkageOption = createToken({
  name: "LinkageOption",
  pattern: Lexer.NA,
});
export const NoMapOption = createToken({
  name: "NoMapOption",
  pattern: Lexer.NA,
});
export const SimpleOptions = createToken({
  name: "SimpleOptions",
  pattern: Lexer.NA,
});
export const DefaultAttribute = createToken({
  name: "DefaultAttribute",
  pattern: Lexer.NA,
});
export const DefaultAttributeBinaryOperator = createToken({
  name: "DefaultAttributeBinaryOperator",
  pattern: Lexer.NA,
});
export const BinaryOperator = createToken({
  name: "BinaryOperator",
  pattern: Lexer.NA,
});
export const UnaryOperator = createToken({
  name: "UnaryOperator",
  pattern: Lexer.NA,
});
export const ScopeAttribute = createToken({
  name: "ScopeAttribute",
  pattern: Lexer.NA,
});
export const AllocateAttributeType = createToken({
  name: "AllocateAttributeType",
  pattern: Lexer.NA,
});
export const AssignmentOperator = createToken({
  name: "AssignmentOperator",
  pattern: Lexer.NA,
});
export const KeywordConditions = createToken({
  name: "KeywordConditions",
  pattern: Lexer.NA,
});
export const FileReferenceConditions = createToken({
  name: "FileReferenceConditions",
  pattern: Lexer.NA,
});
export const PutAttribute = createToken({
  name: "PutAttribute",
  pattern: Lexer.NA,
});
export const Varying = createToken({
  name: "Varying",
  pattern: Lexer.NA,
});
export const Char = createToken({
  name: "Char",
  pattern: Lexer.NA,
});
export const ReadStatementType = createToken({
  name: "ReadStatementType",
  pattern: Lexer.NA,
});
export const WriteStatementType = createToken({
  name: "WriteStatementType",
  pattern: Lexer.NA,
});
export const RewriteStatementType = createToken({
  name: "RewriteStatementType",
  pattern: Lexer.NA,
});
export const Boolean = createToken({
  name: "Boolean",
  pattern: Lexer.NA,
});
export const LocateType = createToken({
  name: "LocateType",
  pattern: Lexer.NA,
});
export const OpenOptionType = createToken({
  name: "OpenOptionType",
  pattern: Lexer.NA,
});

export const combinations = [
  LinkageOption,
  NoMapOption,
  SimpleOptions,
  DefaultAttribute,
  DefaultAttributeBinaryOperator,
  BinaryOperator,
  UnaryOperator,
  ScopeAttribute,
  AllocateAttributeType,
  AssignmentOperator,
  KeywordConditions,
  FileReferenceConditions,
  PutAttribute,
  Varying,
  Char,
  ReadStatementType,
  WriteStatementType,
  Boolean,
  LocateType,
  OpenOptionType,
];

// Custom functions

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\\-]/g, "\\$&");
}

export function setCompilerOptions(options: CompilerOptions): void {
  const orChars = escapeRegExp(options.or || "|");
  const notChars = escapeRegExp(options.not || "¬^");
  or = new RegExp(`[${orChars}]`, "y");
  orEq = new RegExp(`[${orChars}]=`, "y");
  orDouble = new RegExp(`[${orChars}]{2}`, "y");
  orDoubleEq = new RegExp(`[${orChars}]{2}=`, "y");
  not = new RegExp(`[${notChars}]`, "y");
  notEq = new RegExp(`[${notChars}]=`, "y");
  notGT = new RegExp(`[${notChars}]>`, "y");
  notLT = new RegExp(`[${notChars}]<`, "y");
}

let or: RegExp;
let orEq: RegExp;
let orDouble: RegExp;
let orDoubleEq: RegExp;

let not: RegExp;
let notEq: RegExp;
let notGT: RegExp;
let notLT: RegExp;

setCompilerOptions({});

function tokenizeWithCompilerOption(
  getter: () => RegExp,
): CustomPatternMatcherFunc {
  return (text, offset) => {
    const regexp = getter();
    regexp.lastIndex = offset;
    return regexp.exec(text);
  };
}

// Lexer tokens
export const WS = createToken({
  name: "WS",
  pattern: /\s+/y,
  group: Lexer.SKIPPED,
});
export const ExecFragment = createToken({
  name: "ExecFragment",
  line_breaks: true,
  start_chars_hint: ["C", "c", "S", "s"],
  pattern: (text, offset) => {
    const regex = /(?<=EXEC\s*)[a-z]+\s[^;]*/iy;
    regex.lastIndex = offset;
    return regex.exec(text);
  },
});
export const ID = createToken({
  name: "ID",
  pattern: /[$@#_a-z][\w_$@#]*/iy,
});
export const NUMBER = createToken({
  name: "NUMBER",
  pattern:
    /((((([0-9][0-9_]*(\.[0-9_]+)?)|(\.[0-9_]+))([esdq][-+]?[0-9]+)?))[bi]*)/iy,
});
export const STRING_TERM = createToken({
  name: "STRING_TERM",
  pattern:
    /("(""|\\.|[^"\\])*"|'(''|\\.|[^'\\])*')(x[nu]?|a|e|b[43x]?|g[x]?|ux|wx|i|m)*/iy,
});
export const ML_COMMENT = createToken({
  name: "ML_COMMENT",
  pattern: /\/\*[\s\S]*?\*\//y,
  group: Lexer.SKIPPED,
});
export const SL_COMMENT = createToken({
  name: "SL_COMMENT",
  pattern: /\/\/[^\n\r]*/y,
  group: Lexer.SKIPPED,
});
export const SUBSCRIPTRANGE = createToken({
  name: "SUBSCRIPTRANGE",
  pattern: /SUBSCRIPTRANGE/iy,
  categories: [ID, KeywordConditions],
  longer_alt: ID,
});
export const NOCHARGRAPHIC = createToken({
  name: "NOCHARGRAPHIC",
  pattern: /NOCHARGRAPHIC/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const NONASSIGNABLE = createToken({
  name: "NONASSIGNABLE",
  pattern: /NONASSIGNABLE|NONASGN/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const FIXEDOVERFLOW = createToken({
  name: "FIXEDOVERFLOW",
  pattern: /FIXEDOVERFLOW|FOFL/iy,
  categories: [ID, KeywordConditions],
  longer_alt: ID,
});
export const UNDEFINEDFILE = createToken({
  name: "UNDEFINEDFILE",
  pattern: /UNDEFINEDFILE|UNDF/iy,
  categories: [ID, FileReferenceConditions],
  longer_alt: ID,
});
export const VALUELISTFROM = createToken({
  name: "VALUELISTFROM",
  pattern: /VALUELISTFROM/iy,
  categories: [ID],
  longer_alt: ID,
});
export const NODESCRIPTOR = createToken({
  name: "NODESCRIPTOR",
  pattern: /NODESCRIPTOR/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const NONCONNECTED = createToken({
  name: "NONCONNECTED",
  pattern: /NONCONNECTED/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const LITTLEENDIAN = createToken({
  name: "LITTLEENDIAN",
  pattern: /LITTLEENDIAN/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const ANYCONDITION = createToken({
  name: "ANYCONDITION",
  pattern: /ANYCOND(ITION)?/iy,
  categories: [ID, KeywordConditions],
  longer_alt: ID,
});
export const CHARGRAPHIC = createToken({
  name: "CHARGRAPHIC",
  pattern: /CHARGRAPHIC/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const IRREDUCIBLE = createToken({
  name: "IRREDUCIBLE",
  pattern: /IRRED(UCIBLE)?/iy,
  categories: [ID, SimpleOptions, DefaultAttribute],
  longer_alt: ID,
});
export const DLLINTERNAL = createToken({
  name: "DLLINTERNAL",
  pattern: /DLLINTERNAL/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const UNREACHABLE = createToken({
  name: "UNREACHABLE",
  pattern: /UNREACHABLE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const ENVIRONMENT = createToken({
  name: "ENVIRONMENT",
  pattern: /ENV(IRONMENT)?/iy,
  categories: [ID],
  longer_alt: ID,
});
export const DESCRIPTORS = createToken({
  name: "DESCRIPTORS",
  pattern: /DESCRIPTORS/iy,
  categories: [ID],
  longer_alt: ID,
});
export const CONFORMANCE = createToken({
  name: "CONFORMANCE",
  pattern: /CONFORMANCE/iy,
  categories: [ID, KeywordConditions],
  longer_alt: ID,
});
export const STRINGRANGE = createToken({
  name: "STRINGRANGE",
  pattern: /STRINGRANGE/iy,
  categories: [ID, KeywordConditions],
  longer_alt: ID,
});
export const DESCRIPTOR = createToken({
  name: "DESCRIPTOR",
  pattern: /DESCRIPTOR/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const XMLCONTENT = createToken({
  name: "XMLCONTENT",
  pattern: /XMLCONTENT/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const JSONIGNORE = createToken({
  name: "JSONIGNORE",
  pattern: /JSONIGNORE/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const ASSIGNABLE = createToken({
  name: "ASSIGNABLE",
  pattern: /ASSIGNABLE/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const CONTROLLED = createToken({
  name: "CONTROLLED",
  pattern: /CONTROLLED|CTL/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const NONVARYING = createToken({
  name: "NONVARYING",
  pattern: /NONVAR(YING)?/iy,
  categories: [ID, DefaultAttribute, Varying],
  longer_alt: ID,
});
export const SEQUENTIAL = createToken({
  name: "SEQUENTIAL",
  pattern: /SEQ(UENTIA)?L/iy,
  categories: [ID, DefaultAttribute, OpenOptionType],
  longer_alt: ID,
});
export const CONVERSION = createToken({
  name: "CONVERSION",
  pattern: /CONVERSION/iy,
  categories: [ID, KeywordConditions],
  longer_alt: ID,
});
export const STRINGSIZE = createToken({
  name: "STRINGSIZE",
  pattern: /STRINGSIZE/iy,
  categories: [ID, KeywordConditions],
  longer_alt: ID,
});
export const ZERODIVIDE = createToken({
  name: "ZERODIVIDE",
  pattern: /ZERODIVIDE|ZDIV/iy,
  categories: [ID, KeywordConditions],
  longer_alt: ID,
});
export const INITACROSS = createToken({
  name: "INITACROSS",
  pattern: /INITACROSS/iy,
  categories: [ID],
  longer_alt: ID,
});
export const VALUERANGE = createToken({
  name: "VALUERANGE",
  pattern: /VALUERANGE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const XMLIGNORE = createToken({
  name: "XMLIGNORE",
  pattern: /XMLIGNORE/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const JSONTRIMR = createToken({
  name: "JSONTRIMR",
  pattern: /JSONTRIMR/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const NOEXECOPS = createToken({
  name: "NOEXECOPS",
  pattern: /NOEXECOPS/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const DEACTIVATE = createToken({
  name: "DEACTIVATE",
  pattern: /DEACTIVATE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const REDUCIBLE = createToken({
  name: "REDUCIBLE",
  pattern: /RED(UCIBLE)?/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const REENTRANT = createToken({
  name: "REENTRANT",
  pattern: /REENTRANT/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const FETCHABLE = createToken({
  name: "FETCHABLE",
  pattern: /FETCHABLE/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const FROMALIEN = createToken({
  name: "FROMALIEN",
  pattern: /FROMALIEN/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const ASSEMBLER = createToken({
  name: "ASSEMBLER",
  pattern: /ASSEMBLER|ASM/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const RECURSIVE = createToken({
  name: "RECURSIVE",
  pattern: /RECURSIVE/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const PROCEDURE = createToken({
  name: "PROCEDURE",
  pattern: /X?PROC(EDURE)?/iy,
  categories: [ID],
  longer_alt: ID,
});
export const STATEMENT = createToken({
  name: "STATEMENT",
  pattern: /STATEMENT/iy,
  categories: [ID],
  longer_alt: ID,
});
export const CHARACTER = createToken({
  name: "CHARACTER",
  pattern: /CHAR(ACTER)?/iy,
  categories: [ID, DefaultAttribute, AllocateAttributeType],
  longer_alt: ID,
});
export const DIMACROSS = createToken({
  name: "DIMACROSS",
  pattern: /DIMACROSS/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const AUTOMATIC = createToken({
  name: "AUTOMATIC",
  pattern: /AUTO(MATIC)?/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const BACKWARDS = createToken({
  name: "BACKWARDS",
  pattern: /BACKWARDS/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const CONDITION = createToken({
  name: "CONDITION",
  pattern: /COND(ITION)?/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const CONNECTED = createToken({
  name: "CONNECTED",
  pattern: /CONNECTED/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const EXCLUSIVE = createToken({
  name: "EXCLUSIVE",
  pattern: /EXCLUSIVE/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const NONNATIVE = createToken({
  name: "NONNATIVE",
  pattern: /NONNATIVE/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const PARAMETER = createToken({
  name: "PARAMETER",
  pattern: /PARAMETER/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const PRECISION = createToken({
  name: "PRECISION",
  pattern: /PREC(ISION)?/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const STRUCTURE = createToken({
  name: "STRUCTURE",
  pattern: /STRUCT(URE)?/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const TRANSIENT = createToken({
  name: "TRANSIENT",
  pattern: /TRANSIENT/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const UNALIGNED = createToken({
  name: "UNALIGNED",
  pattern: /UNAL(IGNED)?/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const BIGENDIAN = createToken({
  name: "BIGENDIAN",
  pattern: /BIGENDIAN/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const ASSERTION = createToken({
  name: "ASSERTION",
  pattern: /ASSERTION/iy,
  categories: [ID, KeywordConditions],
  longer_alt: ID,
});
export const ATTENTION = createToken({
  name: "ATTENTION",
  pattern: /ATTENTION/iy,
  categories: [ID, KeywordConditions],
  longer_alt: ID,
});
export const INVALIDOP = createToken({
  name: "INVALIDOP",
  pattern: /INVALIDOP/iy,
  categories: [ID, KeywordConditions],
  longer_alt: ID,
});
export const UNDERFLOW = createToken({
  name: "UNDERFLOW",
  pattern: /UNDERFLOW|UFL/iy,
  categories: [ID, KeywordConditions],
  longer_alt: ID,
});
export const OTHERWISE = createToken({
  name: "OTHERWISE",
  pattern: /OTHER(WISE)?/iy,
  categories: [ID],
  longer_alt: ID,
});
export const DIMENSION = createToken({
  name: "DIMENSION",
  pattern: /DIM(ENSION)?/iy,
  categories: [ID],
  longer_alt: ID,
});
export const VALUELIST = createToken({
  name: "VALUELIST",
  pattern: /VALUELIST/iy,
  categories: [ID],
  longer_alt: ID,
});
export const RESERVES = createToken({
  name: "RESERVES",
  pattern: /RESERVES/iy,
  categories: [ID],
  longer_alt: ID,
});
export const JSONNAME = createToken({
  name: "JSONNAME",
  pattern: /JSONNAME/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const JSONNULL = createToken({
  name: "JSONNULL",
  pattern: /JSONNULL/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const JSONOMIT = createToken({
  name: "JSONOMIT",
  pattern: /JSONOMIT/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const NOMAPOUT = createToken({
  name: "NOMAPOUT",
  pattern: /NOMAPOUT/iy,
  categories: [ID, NoMapOption],
  longer_alt: ID,
});
export const NOINLINE = createToken({
  name: "NOINLINE",
  pattern: /NOINLINE/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const NORETURN = createToken({
  name: "NORETURN",
  pattern: /NORETURN/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const EXTERNAL = createToken({
  name: "EXTERNAL",
  pattern: /EXT(ERNAL)?/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const VARIABLE = createToken({
  name: "VARIABLE",
  pattern: /VARIABLE/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const ALLOCATE = createToken({
  name: "ALLOCATE",
  pattern: /ALLOC(ATE)?/iy,
  categories: [ID],
  longer_alt: ID,
});
export const WIDECHAR = createToken({
  name: "WIDECHAR",
  pattern: /W(IDE)?CHAR/iy,
  categories: [ID, DefaultAttribute, AllocateAttributeType],
  longer_alt: ID,
});
export const ABNORMAL = createToken({
  name: "ABNORMAL",
  pattern: /ABNORMAL/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const BUFFERED = createToken({
  name: "BUFFERED",
  pattern: /(UN)?BUF(FERED)?/iy,
  categories: [ID, DefaultAttribute, OpenOptionType],
  longer_alt: ID,
});
export const CONSTANT = createToken({
  name: "CONSTANT",
  pattern: /CONSTANT/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const INTERNAL = createToken({
  name: "INTERNAL",
  pattern: /INTERNAL/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const OPTIONAL = createToken({
  name: "OPTIONAL",
  pattern: /OPTIONAL/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const POSITION = createToken({
  name: "POSITION",
  pattern: /POS(ITION)?/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const RESERVED = createToken({
  name: "RESERVED",
  pattern: /RESERVED/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const UNSIGNED = createToken({
  name: "UNSIGNED",
  pattern: /UNSIGNED/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const VARYING4 = createToken({
  name: "VARYING4",
  pattern: /VARYING4/iy,
  categories: [ID, DefaultAttribute, Varying],
  longer_alt: ID,
});
export const VARYINGZ = createToken({
  name: "VARYINGZ",
  pattern: /VAR(YING)?Z/iy,
  categories: [ID, DefaultAttribute, Varying],
  longer_alt: ID,
});
export const DOWNTHRU = createToken({
  name: "DOWNTHRU",
  pattern: /DOWNTHRU/iy,
  categories: [ID],
  longer_alt: ID,
});
export const XINCLUDE = createToken({
  name: "XINCLUDE",
  pattern: /XINCLUDE/iy,
  categories: [ID],
});
export const INCLUDE = createToken({
  name: "INCLUDE",
  pattern: /INCLUDE/iy,
  categories: [ID],
});
export const NOPRINT = createToken({
  name: "NOPRINT",
  pattern: /NOPRINT/iy,
  categories: [ID],
});
export const OVERFLOW = createToken({
  name: "OVERFLOW",
  pattern: /OVERFLOW|OFL/iy,
  categories: [ID, KeywordConditions],
  longer_alt: ID,
});
export const TRANSMIT = createToken({
  name: "TRANSMIT",
  pattern: /TRANSMIT/iy,
  categories: [ID, FileReferenceConditions],
  longer_alt: ID,
});
export const LINESIZE = createToken({
  name: "LINESIZE",
  pattern: /LINESIZE/iy,
  categories: [ID, OpenOptionType],
  longer_alt: ID,
});
export const PAGESIZE = createToken({
  name: "PAGESIZE",
  pattern: /PAGESIZE/iy,
  categories: [ID, OpenOptionType],
  longer_alt: ID,
});
export const NULLINIT = createToken({
  name: "NULLINIT",
  pattern: /NULLINIT/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const PROCESS = createToken({
  name: "PROCESS",
  pattern: /[*%]PROCESS/iy,
  categories: [ID],
});
export const PROCINC = createToken({
  name: "PROCINC",
  pattern: /[*%]PROCINC/iy,
  categories: [ID],
});
export const XMLNAME = createToken({
  name: "XMLNAME",
  pattern: /XMLNAME/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const XMLATTR = createToken({
  name: "XMLATTR",
  pattern: /XMLATTR/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const XMLOMIT = createToken({
  name: "XMLOMIT",
  pattern: /XMLOMIT/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const RESIGNAL = createToken({
  name: "RESIGNAL",
  pattern: /RESIGNAL/iy,
  categories: [ID],
  longer_alt: ID,
});
export const PACKAGE = createToken({
  name: "PACKAGE",
  pattern: /PACKAGE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const EXPORTS = createToken({
  name: "EXPORTS",
  pattern: /EXPORTS/iy,
  categories: [ID],
  longer_alt: ID,
});
export const OPTIONS = createToken({
  name: "OPTIONS",
  pattern: /OPTIONS/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const LINKAGE = createToken({
  name: "LINKAGE",
  pattern: /LINKAGE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const OPTLINK = createToken({
  name: "OPTLINK",
  pattern: /OPTLINK/iy,
  categories: [ID, LinkageOption],
  longer_alt: ID,
});
export const STDCALL = createToken({
  name: "STDCALL",
  pattern: /STDCALL/iy,
  categories: [ID, LinkageOption],
  longer_alt: ID,
});
export const NOMAPIN = createToken({
  name: "NOMAPIN",
  pattern: /NOMAPIN/iy,
  categories: [ID, NoMapOption],
  longer_alt: ID,
});
export const FORTRAN = createToken({
  name: "FORTRAN",
  pattern: /FORTRAN/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const BYVALUE = createToken({
  name: "BYVALUE",
  pattern: /BYVALUE/iy,
  categories: [ID, SimpleOptions, DefaultAttribute],
  longer_alt: ID,
});
export const AMODE31 = createToken({
  name: "AMODE31",
  pattern: /AMODE31/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const AMODE64 = createToken({
  name: "AMODE64",
  pattern: /AMODE64/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const RETCODE = createToken({
  name: "RETCODE",
  pattern: /RETCODE/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const WINMAIN = createToken({
  name: "WINMAIN",
  pattern: /WINMAIN/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const DYNAMIC = createToken({
  name: "DYNAMIC",
  pattern: /DYNAMIC/iy,
  categories: [ID, ScopeAttribute],
  longer_alt: ID,
});
export const LIMITED = createToken({
  name: "LIMITED",
  pattern: /LIMITED/iy,
  categories: [ID],
  longer_alt: ID,
});
export const GRAPHIC = createToken({
  name: "GRAPHIC",
  pattern: /GRAPHIC/iy,
  categories: [ID, DefaultAttribute, AllocateAttributeType],
  longer_alt: ID,
});
export const COMPARE = createToken({
  name: "COMPARE",
  pattern: /COMPARE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const DEFAULT = createToken({
  name: "DEFAULT",
  pattern: /DEFAULT|DFT/iy,
  categories: [ID],
  longer_alt: ID,
});
export const ALIGNED = createToken({
  name: "ALIGNED",
  pattern: /ALIGNED/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const BUILTIN = createToken({
  name: "BUILTIN",
  pattern: /BUILTIN/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const COMPLEX = createToken({
  name: "COMPLEX",
  pattern: /COMPLEX/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const DECIMAL = createToken({
  name: "DECIMAL",
  pattern: /DEC(IMAL)?/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const GENERIC = createToken({
  name: "GENERIC",
  pattern: /GENERIC/iy,
  categories: [ID],
  longer_alt: ID,
});
export const HEXADEC = createToken({
  name: "HEXADEC",
  pattern: /HEXADEC/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const OUTONLY = createToken({
  name: "OUTONLY",
  pattern: /OUTONLY/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const POINTER = createToken({
  name: "POINTER",
  pattern: /POINTER|PTR/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const VARYING = createToken({
  name: "VARYING",
  pattern: /VAR(YING)?/iy,
  categories: [ID, DefaultAttribute, Varying],
  longer_alt: ID,
});
export const ORDINAL = createToken({
  name: "ORDINAL",
  pattern: /ORDINAL/iy,
  categories: [ID],
  longer_alt: ID,
});
export const DISPLAY = createToken({
  name: "DISPLAY",
  pattern: /DISPLAY/iy,
  categories: [ID],
  longer_alt: ID,
});
export const ROUTCDE = createToken({
  name: "ROUTCDE",
  pattern: /ROUTCDE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const ITERATE = createToken({
  name: "ITERATE",
  pattern: /ITERATE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const ACTIVATE = createToken({
  name: "ACTIVATE",
  pattern: /ACTIVATE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const KEYFROM = createToken({
  name: "KEYFROM",
  pattern: /KEYFROM/iy,
  categories: [ID, WriteStatementType, LocateType],
  longer_alt: ID,
});
export const STORAGE = createToken({
  name: "STORAGE",
  pattern: /STORAGE/iy,
  categories: [ID, KeywordConditions],
  longer_alt: ID,
});
export const ENDFILE = createToken({
  name: "ENDFILE",
  pattern: /ENDFILE/iy,
  categories: [ID, FileReferenceConditions],
  longer_alt: ID,
});
export const ENDPAGE = createToken({
  name: "ENDPAGE",
  pattern: /ENDPAGE/iy,
  categories: [ID, FileReferenceConditions],
  longer_alt: ID,
});
export const QUALIFY = createToken({
  name: "QUALIFY",
  pattern: /QUALIFY/iy,
  categories: [ID],
  longer_alt: ID,
});
export const RELEASE = createToken({
  name: "RELEASE",
  pattern: /RELEASE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const REWRITE = createToken({
  name: "REWRITE",
  pattern: /REWRITE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const INITIAL = createToken({
  name: "INITIAL",
  pattern: /INIT(IAL)?/iy,
  categories: [ID],
  longer_alt: ID,
});
export const DECLARE = createToken({
  name: "DECLARE",
  pattern: /X?(DECLARE|DCL)/iy,
  categories: [ID],
  longer_alt: ID,
});
export const PICTURE = createToken({
  name: "PICTURE",
  pattern: /PIC(TURE)?/iy,
  categories: [ID],
  longer_alt: ID,
});
export const WIDEPIC = createToken({
  name: "WIDEPIC",
  pattern: /WIDEPIC/iy,
  categories: [ID],
  longer_alt: ID,
});
export const RETURNS = createToken({
  name: "RETURNS",
  pattern: /RETURNS/iy,
  categories: [ID],
  longer_alt: ID,
});
export const SYSTEM = createToken({
  name: "SYSTEM",
  pattern: /SYSTEM/iy,
  categories: [ID, LinkageOption],
  longer_alt: ID,
});
export const INLINE = createToken({
  name: "INLINE",
  pattern: /INLINE/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const BYADDR = createToken({
  name: "BYADDR",
  pattern: /BYADDR/iy,
  categories: [ID, SimpleOptions, DefaultAttribute],
  longer_alt: ID,
});
export const STATIC = createToken({
  name: "STATIC",
  pattern: /STATIC/iy,
  categories: [ID, DefaultAttribute, ScopeAttribute],
  longer_alt: ID,
});
export const ASSERT = createToken({
  name: "ASSERT",
  pattern: /ASSERT/iy,
  categories: [ID],
  longer_alt: ID,
});
export const ATTACH = createToken({
  name: "ATTACH",
  pattern: /ATTACH/iy,
  categories: [ID],
  longer_alt: ID,
});
export const THREAD = createToken({
  name: "THREAD",
  pattern: /THREAD/iy,
  categories: [ID],
  longer_alt: ID,
});
export const TSTACK = createToken({
  name: "TSTACK",
  pattern: /TSTACK/iy,
  categories: [ID],
  longer_alt: ID,
});
export const CANCEL = createToken({
  name: "CANCEL",
  pattern: /CANCEL/iy,
  categories: [ID],
  longer_alt: ID,
});
export const BINARY = createToken({
  name: "BINARY",
  pattern: /BIN(ARY)?/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const FORMAT = createToken({
  name: "FORMAT",
  pattern: /FORMAT/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const NOINIT = createToken({
  name: "NOINIT",
  pattern: /NOINIT/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const INONLY = createToken({
  name: "INONLY",
  pattern: /INONLY/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const INDFOR = createToken({
  name: "INDFOR",
  pattern: /INDFOR/iy,
  categories: [ID],
  longer_alt: ID,
});
export const MEMBER = createToken({
  name: "MEMBER",
  pattern: /MEMBER/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const NATIVE = createToken({
  name: "NATIVE",
  pattern: /NATIVE/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const NORMAL = createToken({
  name: "NORMAL",
  pattern: /NORMAL/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const OFFSET = createToken({
  name: "OFFSET",
  pattern: /OFFSET/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const OUTPUT = createToken({
  name: "OUTPUT",
  pattern: /OUTPUT/iy,
  categories: [ID, DefaultAttribute, OpenOptionType],
  longer_alt: ID,
});
export const RECORD = createToken({
  name: "RECORD",
  pattern: /RECORD/iy,
  categories: [ID, DefaultAttribute, FileReferenceConditions, OpenOptionType],
  longer_alt: ID,
});
export const SIGNED = createToken({
  name: "SIGNED",
  pattern: /SIGNED/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const STREAM = createToken({
  name: "STREAM",
  pattern: /STREAM/iy,
  categories: [ID, DefaultAttribute, OpenOptionType],
  longer_alt: ID,
});
export const UPDATE = createToken({
  name: "UPDATE",
  pattern: /UPDATE/iy,
  categories: [ID, DefaultAttribute, OpenOptionType],
  longer_alt: ID,
});
export const DEFINE = createToken({
  name: "DEFINE",
  pattern: /X?DEFINE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const DEFINED = createToken({
  name: "DEFINED",
  pattern: /DEF(INED)?/iy,
  categories: [ID],
  longer_alt: [ID, DEFINE],
});
export const DELETE = createToken({
  name: "DELETE",
  pattern: /DELETE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const DETACH = createToken({
  name: "DETACH",
  pattern: /DETACH/iy,
  categories: [ID],
  longer_alt: ID,
});
export const UPTHRU = createToken({
  name: "UPTHRU",
  pattern: /UPTHRU/iy,
  categories: [ID],
  longer_alt: ID,
});
export const REPEAT = createToken({
  name: "REPEAT",
  pattern: /REPEAT/iy,
  categories: [ID],
  longer_alt: ID,
});
export const COLUMN = createToken({
  name: "COLUMN",
  pattern: /COL(UMN)?/iy,
  categories: [ID],
  longer_alt: ID,
});
export const STRING = createToken({
  name: "STRING",
  pattern: /STRING/iy,
  categories: [ID],
  longer_alt: ID,
});
export const NOSCAN = createToken({
  name: "NOSCAN",
  pattern: /NOSCAN/iy,
  categories: [ID],
  longer_alt: ID,
});
export const RESCAN = createToken({
  name: "RESCAN",
  pattern: /RESCAN/iy,
  categories: [ID],
  longer_alt: ID,
});
export const ddname = createToken({
  name: "ddname",
  pattern: /ddname/iy,
  categories: [ID],
  longer_alt: ID,
});
export const LOCATE = createToken({
  name: "LOCATE",
  pattern: /LOCATE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const FINISH = createToken({
  name: "FINISH",
  pattern: /FINISH/iy,
  categories: [ID, KeywordConditions],
  longer_alt: ID,
});
export const DIRECT = createToken({
  name: "DIRECT",
  pattern: /DIRECT/iy,
  categories: [ID, OpenOptionType],
  longer_alt: ID,
});
export const PercentPRINT = createToken({
  name: "%PRINT",
  pattern: /%PRINT/iy,
  categories: [ID],
});
export const IGNORE = createToken({
  name: "IGNORE",
  pattern: /IGNORE/iy,
  categories: [ID, ReadStatementType],
  longer_alt: ID,
});
export const REINIT = createToken({
  name: "REINIT",
  pattern: /REINIT/iy,
  categories: [ID],
  longer_alt: ID,
});
export const RETURN = createToken({
  name: "RETURN",
  pattern: /RETURN/iy,
  categories: [ID],
  longer_alt: ID,
});
export const SELECT = createToken({
  name: "SELECT",
  pattern: /SELECT/iy,
  categories: [ID],
  longer_alt: ID,
});
export const SIGNAL = createToken({
  name: "SIGNAL",
  pattern: /SIGNAL/iy,
  categories: [ID],
  longer_alt: ID,
});
export const HANDLE = createToken({
  name: "HANDLE",
  pattern: /HANDLE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const CDECL = createToken({
  name: "CDECL",
  pattern: /CDECL/iy,
  categories: [ID, LinkageOption],
  longer_alt: ID,
});
export const CMPAT = createToken({
  name: "CMPAT",
  pattern: /CMPAT/iy,
  categories: [ID],
  longer_alt: ID,
});
export const NOMAP = createToken({
  name: "NOMAP",
  pattern: /NOMAP/iy,
  categories: [ID, NoMapOption],
  longer_alt: ID,
});
export const ORDER = createToken({
  name: "ORDER",
  pattern: /(RE)?ORDER/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const COBOL = createToken({
  name: "COBOL",
  pattern: /COBOL/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const INTER = createToken({
  name: "INTER",
  pattern: /INTER/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const ENTRY = createToken({
  name: "ENTRY",
  pattern: /ENTRY/iy,
  categories: [ID],
  longer_alt: ID,
});
export const UCHAR = createToken({
  name: "UCHAR",
  pattern: /UCHAR/iy,
  categories: [ID, DefaultAttribute, AllocateAttributeType, Char],
  longer_alt: ID,
});
export const FALSE = createToken({
  name: "FALSE",
  pattern: /FALSE/iy,
  categories: [ID, Boolean],
  longer_alt: ID,
});
export const BEGIN = createToken({
  name: "BEGIN",
  pattern: /BEGIN/iy,
  categories: [ID],
  longer_alt: ID,
});
export const CLOSE = createToken({
  name: "CLOSE",
  pattern: /CLOSE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const RANGE = createToken({
  name: "RANGE",
  pattern: /RANGE/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const BASED = createToken({
  name: "BASED",
  pattern: /BASED/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const EVENT = createToken({
  name: "EVENT",
  pattern: /EVENT/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const FIXED = createToken({
  name: "FIXED",
  pattern: /FIXED/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const FLOAT = createToken({
  name: "FLOAT",
  pattern: /FLOAT/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const INOUT = createToken({
  name: "INOUT",
  pattern: /INOUT/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const INPUT = createToken({
  name: "INPUT",
  pattern: /INPUT/iy,
  categories: [ID, DefaultAttribute, OpenOptionType],
  longer_alt: ID,
});
export const KEYED = createToken({
  name: "KEYED",
  pattern: /KEYED/iy,
  categories: [ID, DefaultAttribute, OpenOptionType],
  longer_alt: ID,
});
export const LABEL = createToken({
  name: "LABEL",
  pattern: /LABEL/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const PRINT = createToken({
  name: "PRINT",
  pattern: /PRINT/iy,
  categories: [ID, DefaultAttribute, OpenOptionType],
  longer_alt: ID,
});
export const UNION = createToken({
  name: "UNION",
  pattern: /UNION/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const ALIAS = createToken({
  name: "ALIAS",
  pattern: /ALIAS/iy,
  categories: [ID],
  longer_alt: ID,
});
export const VALUE = createToken({
  name: "VALUE",
  pattern: /VALUE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const DELAY = createToken({
  name: "DELAY",
  pattern: /DELAY/iy,
  categories: [ID],
  longer_alt: ID,
});
export const REPLY = createToken({
  name: "REPLY",
  pattern: /REPLY/iy,
  categories: [ID],
  longer_alt: ID,
});
export const WHILE = createToken({
  name: "WHILE",
  pattern: /WHILE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const UNTIL = createToken({
  name: "UNTIL",
  pattern: /UNTIL/iy,
  categories: [ID],
  longer_alt: ID,
});
export const FETCH = createToken({
  name: "FETCH",
  pattern: /FETCH/iy,
  categories: [ID],
  longer_alt: ID,
});
export const TITLE = createToken({
  name: "TITLE",
  pattern: /TITLE/iy,
  categories: [ID, OpenOptionType],
  longer_alt: ID,
});
export const FLUSH = createToken({
  name: "FLUSH",
  pattern: /FLUSH/iy,
  categories: [ID],
  longer_alt: ID,
});
export const LEAVE = createToken({
  name: "LEAVE",
  pattern: /LEAVE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const PercentLINE = createToken({
  name: "%LINE",
  pattern: /%LINE/iy,
  categories: [ID],
});
export const PercentNOTE = createToken({
  name: "%NOTE",
  pattern: /%NOTE/iy,
  categories: [ID],
});
export const ERROR = createToken({
  name: "ERROR",
  pattern: /ERROR/iy,
  categories: [ID, KeywordConditions],
  longer_alt: ID,
});
export const PercentPAGE = createToken({
  name: "%PAGE",
  pattern: /%PAGE/iy,
  categories: [ID],
});
export const PUSH = createToken({
  name: "PUSH",
  pattern: /PUSH/iy,
  categories: [ID],
});
export const KEYTO = createToken({
  name: "KEYTO",
  pattern: /KEYTO/iy,
  categories: [ID, ReadStatementType, WriteStatementType],
  longer_alt: ID,
});
export const REVERT = createToken({
  name: "REVERT",
  pattern: /REVERT/iy,
  categories: [ID],
  longer_alt: ID,
});
export const PercentSKIP = createToken({
  name: "PercentSKIP",
  pattern: /%SKIP/iy,
  categories: [ID],
});
export const WRITE = createToken({
  name: "WRITE",
  pattern: /WRITE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const REFER = createToken({
  name: "REFER",
  pattern: /REFER/iy,
  categories: [ID],
  longer_alt: ID,
});
export const MAIN = createToken({
  name: "MAIN",
  pattern: /MAIN/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const RENT = createToken({
  name: "RENT",
  pattern: /RENT/iy,
  categories: [ID, SimpleOptions],
  longer_alt: ID,
});
export const AREA = createToken({
  name: "AREA",
  pattern: /AREA/iy,
  categories: [ID, DefaultAttribute, AllocateAttributeType, KeywordConditions],
  longer_alt: ID,
});
export const TRUE = createToken({
  name: "TRUE",
  pattern: /TRUE/iy,
  categories: [ID, Boolean],
  longer_alt: ID,
});
export const TEXT = createToken({
  name: "TEXT",
  pattern: /TEXT/iy,
  categories: [ID],
  longer_alt: ID,
});
export const NAME = createToken({
  name: "NAME",
  pattern: /NAME/iy,
  categories: [ID, FileReferenceConditions],
  longer_alt: ID,
});
export const CALL = createToken({
  name: "CALL",
  pattern: /CALL/iy,
  categories: [ID],
  longer_alt: ID,
});
export const FILE = createToken({
  name: "FILE",
  pattern: /FILE/iy,
  categories: [
    ID,
    DefaultAttribute,
    PutAttribute,
    ReadStatementType,
    WriteStatementType,
    RewriteStatementType,
    LocateType,
    OpenOptionType,
  ],
  longer_alt: ID,
});
export const IEEE = createToken({
  name: "IEEE",
  pattern: /IEEE/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const LIST = createToken({
  name: "LIST",
  pattern: /LIST/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const REAL = createToken({
  name: "REAL",
  pattern: /REAL/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const TASK = createToken({
  name: "TASK",
  pattern: /TASK/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const DESC = createToken({
  name: "DESC",
  pattern: /DESC/iy,
  categories: [ID],
  longer_alt: ID,
});
export const EXEC = createToken({
  name: "EXEC",
  pattern: /EXEC/iy,
  categories: [ID],
  longer_alt: ID,
});
export const EXIT = createToken({
  name: "EXIT",
  pattern: /EXIT/iy,
  categories: [ID],
  longer_alt: ID,
});
export const LINE = createToken({
  name: "LINE",
  pattern: /LINE/iy,
  categories: [ID, PutAttribute],
  longer_alt: ID,
});
export const PAGE = createToken({
  name: "PAGE",
  pattern: /PAGE/iy,
  categories: [ID, PutAttribute],
  longer_alt: ID,
});
export const SKIP = createToken({
  name: "SKIP",
  pattern: /SKIP/iy,
  categories: [ID, PutAttribute],
  longer_alt: ID,
});
export const SCAN = createToken({
  name: "SCAN",
  pattern: /SCAN/iy,
  categories: [ID],
  longer_alt: ID,
});
export const FREE = createToken({
  name: "FREE",
  pattern: /FREE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const COPY = createToken({
  name: "COPY",
  pattern: /COPY/iy,
  categories: [ID],
  longer_alt: ID,
});
export const GOTO = createToken({
  name: "GOTO",
  pattern: /GOTO/iy,
  categories: [ID],
  longer_alt: ID,
});
export const THEN = createToken({
  name: "THEN",
  pattern: /THEN/iy,
  categories: [ID],
  longer_alt: ID,
});
export const ELSE = createToken({
  name: "ELSE",
  pattern: /ELSE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const SNAP = createToken({
  name: "SNAP",
  pattern: /SNAP/iy,
  categories: [ID],
  longer_alt: ID,
});
export const SIZE = createToken({
  name: "SIZE",
  pattern: /SIZE/iy,
  categories: [ID, KeywordConditions],
  longer_alt: ID,
});
export const OPEN = createToken({
  name: "OPEN",
  pattern: /OPEN/iy,
  categories: [ID],
  longer_alt: ID,
});
export const POP = createToken({
  name: "POP",
  pattern: /POP/iy,
  categories: [ID],
  longer_alt: ID,
});
export const DATA = createToken({
  name: "DATA",
  pattern: /DATA/iy,
  categories: [ID],
  longer_alt: ID,
});
export const EDIT = createToken({
  name: "EDIT",
  pattern: /EDIT/iy,
  categories: [ID],
  longer_alt: ID,
});
export const READ = createToken({
  name: "READ",
  pattern: /READ/iy,
  categories: [ID],
  longer_alt: ID,
});
export const INTO = createToken({
  name: "INTO",
  pattern: /INTO/iy,
  categories: [ID, ReadStatementType],
  longer_alt: ID,
});
export const FROM = createToken({
  name: "FROM",
  pattern: /FROM/iy,
  categories: [ID, WriteStatementType, RewriteStatementType],
  longer_alt: ID,
});
export const LOOP = createToken({
  name: "LOOP",
  pattern: /LOOP|FOREVER/iy,
  categories: [ID],
  longer_alt: ID,
});
export const WHEN = createToken({
  name: "WHEN",
  pattern: /WHEN/iy,
  categories: [ID],
  longer_alt: ID,
});
export const STOP = createToken({
  name: "STOP",
  pattern: /STOP/iy,
  categories: [ID],
  longer_alt: ID,
});
export const WAIT = createToken({
  name: "WAIT",
  pattern: /WAIT/iy,
  categories: [ID],
  longer_alt: ID,
});
export const DATE = createToken({
  name: "DATE",
  pattern: /DATE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const TYPE = createToken({
  name: "TYPE",
  pattern: /TYPE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const LIKE = createToken({
  name: "LIKE",
  pattern: /LIKE/iy,
  categories: [ID],
  longer_alt: ID,
});
export const SET = createToken({
  name: "SET",
  pattern: /SET/iy,
  categories: [ID, ReadStatementType, LocateType],
  longer_alt: ID,
});
export const BIT = createToken({
  name: "BIT",
  pattern: /BIT/iy,
  categories: [ID, DefaultAttribute, AllocateAttributeType],
  longer_alt: ID,
});
export const PipePipeEquals = createToken({
  name: "||=",
  pattern: tokenizeWithCompilerOption(() => orDoubleEq),
  categories: [AssignmentOperator],
  line_breaks: false,
});
export const StarStarEquals = createToken({
  name: "**=",
  pattern: "**=",
  categories: [AssignmentOperator],
});
export const END = createToken({
  name: "END",
  pattern: /END/iy,
  categories: [ID],
  longer_alt: ID,
});
export const AND = createToken({
  name: "AND",
  pattern: /AND/iy,
  categories: [ID, DefaultAttributeBinaryOperator],
  longer_alt: ID,
});
export const NOT = createToken({
  name: "NOT",
  pattern: /NOT/iy,
  categories: [ID],
  longer_alt: ID,
});
export const HEX = createToken({
  name: "HEX",
  pattern: /HEX/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const INT = createToken({
  name: "INT",
  pattern: /INT/iy,
  categories: [ID, DefaultAttribute],
  longer_alt: ID,
});
export const KEY = createToken({
  name: "KEY",
  pattern: /KEY/iy,
  categories: [
    ID,
    FileReferenceConditions,
    ReadStatementType,
    RewriteStatementType,
  ],
  longer_alt: ID,
});
export const GET = createToken({
  name: "GET",
  pattern: /GET/iy,
  categories: [ID],
  longer_alt: ID,
});
export const PUT = createToken({
  name: "PUT",
  pattern: /PUT/iy,
  categories: [ID],
  longer_alt: ID,
});
export const VX = createToken({
  name: "VX",
  pattern: /V(1|2|3)/iy,
  categories: [ID],
  longer_alt: ID,
});
export const IN = createToken({
  name: "IN",
  pattern: /IN/iy,
  categories: [ID],
  longer_alt: ID,
});
export const BY = createToken({
  name: "BY",
  pattern: /BY/iy,
  categories: [ID],
  longer_alt: ID,
});
export const PlusEquals = createToken({
  name: "+=",
  pattern: "+=",
  categories: [AssignmentOperator],
});
export const MinusEquals = createToken({
  name: "-=",
  pattern: "-=",
  categories: [AssignmentOperator],
});
export const StarEquals = createToken({
  name: "*=",
  pattern: "*=",
  categories: [AssignmentOperator],
});
export const SlashEquals = createToken({
  name: "/=",
  pattern: "/=",
  categories: [AssignmentOperator],
});
export const PipeEquals = createToken({
  name: "|=",
  pattern: tokenizeWithCompilerOption(() => orEq),
  categories: [AssignmentOperator],
  line_breaks: false,
});
export const AmpersandEquals = createToken({
  name: "&=",
  pattern: "&=",
  categories: [AssignmentOperator],
});
export const NotEquals = createToken({
  name: "^=",
  pattern: tokenizeWithCompilerOption(() => notEq),
  categories: [AssignmentOperator, BinaryOperator],
  line_breaks: false,
});
export const LessThanGreaterThan = createToken({
  name: "<>",
  pattern: "<>",
  categories: [AssignmentOperator, BinaryOperator],
});
export const OR = createToken({
  name: "OR",
  pattern: /OR/iy,
  categories: [ID, DefaultAttributeBinaryOperator],
  longer_alt: ID,
});
export const DO = createToken({
  name: "DO",
  pattern: /DO/iy,
  categories: [ID],
  longer_alt: ID,
});
export const TO = createToken({
  name: "TO",
  pattern: /TO/iy,
  categories: [ID],
  longer_alt: ID,
});
export const GO = createToken({
  name: "GO",
  pattern: /GO/iy,
  categories: [ID],
  longer_alt: ID,
});
export const IF = createToken({
  name: "IF",
  pattern: /IF/iy,
  categories: [ID],
  longer_alt: ID,
});
export const ON = createToken({
  name: "ON",
  pattern: /ON/iy,
  categories: [ID],
  longer_alt: ID,
});
export const NotLessThan = createToken({
  name: "^<",
  pattern: tokenizeWithCompilerOption(() => notLT),
  categories: [BinaryOperator],
  line_breaks: false,
});
export const LessThanEquals = createToken({
  name: "<=",
  pattern: "<=",
  categories: [BinaryOperator],
});
export const GreaterThanEquals = createToken({
  name: ">=",
  pattern: ">=",
  categories: [BinaryOperator],
});
export const NotGreaterThan = createToken({
  name: "^>",
  pattern: tokenizeWithCompilerOption(() => notGT),
  categories: [BinaryOperator],
  line_breaks: false,
});
export const PipePipe = createToken({
  name: "||",
  pattern: tokenizeWithCompilerOption(() => orDouble),
  categories: [BinaryOperator],
  line_breaks: false,
});
export const StarStar = createToken({
  name: "**",
  pattern: "**",
  categories: [BinaryOperator],
});
export const MinusGreaterThan = createToken({
  name: "->",
  pattern: "->",
});
export const EqualsGreaterThan = createToken({
  name: "=>",
  pattern: "=>",
});
export const Semicolon = createToken({
  name: ";",
  pattern: ";",
});
export const OpenParen = createToken({
  name: "(",
  pattern: "(",
});
export const CloseParen = createToken({
  name: ")",
  pattern: ")",
});
export const Colon = createToken({
  name: ":",
  pattern: ":",
});
export const Comma = createToken({
  name: ",",
  pattern: ",",
});
export const Star = createToken({
  name: "*",
  pattern: "*",
  categories: [BinaryOperator],
});
export const Equals = createToken({
  name: "=",
  pattern: "=",
  categories: [BinaryOperator, AssignmentOperator],
});
export const A = createToken({
  name: "A",
  pattern: /A/iy,
  categories: [ID],
  longer_alt: ID,
});
export const B = createToken({
  name: "B",
  pattern: /B/iy,
  categories: [ID],
  longer_alt: ID,
});
export const C = createToken({
  name: "C",
  pattern: /C/iy,
  categories: [ID],
  longer_alt: ID,
});
export const F = createToken({
  name: "F",
  pattern: /F/iy,
  categories: [ID],
  longer_alt: ID,
});
export const E = createToken({
  name: "E",
  pattern: /E/iy,
  categories: [ID],
  longer_alt: ID,
});
export const G = createToken({
  name: "G",
  pattern: /G/iy,
  categories: [ID],
  longer_alt: ID,
});
export const P = createToken({
  name: "P",
  pattern: /P/iy,
  categories: [ID],
  longer_alt: ID,
});
export const L = createToken({
  name: "L",
  pattern: /L/iy,
  categories: [ID],
  longer_alt: ID,
});
export const R = createToken({
  name: "R",
  pattern: /R/iy,
  categories: [ID],
  longer_alt: ID,
});
export const V = createToken({
  name: "V",
  pattern: /V/iy,
  categories: [ID],
  longer_alt: ID,
});
export const X = createToken({
  name: "X",
  pattern: /X/iy,
  categories: [ID],
  longer_alt: ID,
});
// TODO: OR compiler option
export const Pipe = createToken({
  name: "|",
  pattern: tokenizeWithCompilerOption(() => or),
  categories: [BinaryOperator],
  line_breaks: false,
});
// TODO: NOT compiler option
export const Not = createToken({
  name: "^",
  pattern: tokenizeWithCompilerOption(() => not),
  categories: [BinaryOperator, UnaryOperator],
  line_breaks: false,
});
export const Ampersand = createToken({
  name: "&",
  pattern: "&",
  categories: [BinaryOperator],
});
export const LessThan = createToken({
  name: "<",
  pattern: "<",
  categories: [BinaryOperator],
});
export const GreaterThan = createToken({
  name: ">",
  pattern: ">",
  categories: [BinaryOperator],
});
export const Plus = createToken({
  name: "+",
  pattern: "+",
  categories: [BinaryOperator, UnaryOperator],
});
export const Minus = createToken({
  name: "-",
  pattern: "-",
  categories: [BinaryOperator, UnaryOperator],
});
export const Slash = createToken({
  name: "/",
  pattern: "/",
  categories: [BinaryOperator],
  longer_alt: [ML_COMMENT, SL_COMMENT],
});
export const Dot = createToken({
  name: ".",
  pattern: ".",
});
export const Percent = createToken({
  name: "%",
  pattern: "%",
});

export const terminals = [
  WS,
  ExecFragment,
  ID,
  NUMBER,
  STRING_TERM,
  ML_COMMENT,
  SL_COMMENT,
];

export const keywords = [
  SUBSCRIPTRANGE,
  NOCHARGRAPHIC,
  NONASSIGNABLE,
  FIXEDOVERFLOW,
  UNDEFINEDFILE,
  VALUELISTFROM,
  NODESCRIPTOR,
  NONCONNECTED,
  LITTLEENDIAN,
  ANYCONDITION,
  CHARGRAPHIC,
  IRREDUCIBLE,
  DLLINTERNAL,
  UNREACHABLE,
  ENVIRONMENT,
  DESCRIPTORS,
  CONFORMANCE,
  STRINGRANGE,
  DESCRIPTOR,
  XMLCONTENT,
  JSONIGNORE,
  ASSIGNABLE,
  CONTROLLED,
  NONVARYING,
  SEQUENTIAL,
  CONVERSION,
  STRINGSIZE,
  ZERODIVIDE,
  INITACROSS,
  VALUERANGE,
  DEACTIVATE,
  NOEXECOPS,
  XMLIGNORE,
  JSONTRIMR,
  REDUCIBLE,
  REENTRANT,
  STATEMENT,
  FETCHABLE,
  FROMALIEN,
  ASSEMBLER,
  RECURSIVE,
  PROCEDURE,
  CHARACTER,
  DIMACROSS,
  AUTOMATIC,
  BACKWARDS,
  CONDITION,
  CONNECTED,
  EXCLUSIVE,
  NONNATIVE,
  PARAMETER,
  PRECISION,
  STRUCTURE,
  TRANSIENT,
  UNALIGNED,
  BIGENDIAN,
  ASSERTION,
  ATTENTION,
  INVALIDOP,
  UNDERFLOW,
  OTHERWISE,
  DIMENSION,
  VALUELIST,
  RESERVES,
  JSONNAME,
  JSONOMIT,
  JSONNULL,
  NOMAPOUT,
  NOINLINE,
  NORETURN,
  EXTERNAL,
  VARIABLE,
  ALLOCATE,
  WIDECHAR,
  ABNORMAL,
  BUFFERED,
  CONSTANT,
  INTERNAL,
  OPTIONAL,
  POSITION,
  RESERVED,
  UNSIGNED,
  VARYING4,
  VARYINGZ,
  DOWNTHRU,
  RESIGNAL,
  XINCLUDE,
  INCLUDE,
  NOPRINT,
  OVERFLOW,
  TRANSMIT,
  LINESIZE,
  PAGESIZE,
  ACTIVATE,
  PROCESS,
  PROCINC,
  XMLNAME,
  XMLATTR,
  XMLOMIT,
  PACKAGE,
  EXPORTS,
  OPTIONS,
  LINKAGE,
  OPTLINK,
  STDCALL,
  NOMAPIN,
  FORTRAN,
  BYVALUE,
  AMODE31,
  AMODE64,
  RETCODE,
  WINMAIN,
  DYNAMIC,
  LIMITED,
  GRAPHIC,
  COMPARE,
  DEFAULT,
  ALIGNED,
  BUILTIN,
  COMPLEX,
  GENERIC,
  HEXADEC,
  OUTONLY,
  POINTER,
  VARYING,
  ORDINAL,
  DISPLAY,
  ROUTCDE,
  ITERATE,
  KEYFROM,
  STORAGE,
  ENDFILE,
  ENDPAGE,
  QUALIFY,
  RELEASE,
  REWRITE,
  INITIAL,
  DECLARE,
  DECIMAL,
  PICTURE,
  WIDEPIC,
  RETURNS,
  SYSTEM,
  INLINE,
  BYADDR,
  STATIC,
  ASSERT,
  ATTACH,
  THREAD,
  TSTACK,
  CANCEL,
  BINARY,
  FORMAT,
  INONLY,
  INDFOR,
  MEMBER,
  NATIVE,
  NORMAL,
  OFFSET,
  OUTPUT,
  RECORD,
  SIGNED,
  STREAM,
  UPDATE,
  DEFINE,
  DEFINED,
  DELETE,
  DETACH,
  UPTHRU,
  REPEAT,
  COLUMN,
  NOSCAN,
  RESCAN,
  STRING,
  ddname,
  LOCATE,
  FINISH,
  DIRECT,
  PercentPRINT,
  IGNORE,
  REINIT,
  RETURN,
  SELECT,
  SIGNAL,
  HANDLE,
  CDECL,
  CMPAT,
  NOMAP,
  ORDER,
  COBOL,
  INTER,
  ENTRY,
  UCHAR,
  FALSE,
  BEGIN,
  CLOSE,
  RANGE,
  BASED,
  EVENT,
  FIXED,
  FLOAT,
  INOUT,
  INPUT,
  KEYED,
  LABEL,
  PRINT,
  UNION,
  ALIAS,
  VALUE,
  DELAY,
  REPLY,
  WHILE,
  UNTIL,
  FETCH,
  TITLE,
  FLUSH,
  LEAVE,
  PercentLINE,
  PercentNOTE,
  ERROR,
  PercentPAGE,
  PUSH,
  KEYTO,
  REVERT,
  PercentSKIP,
  WRITE,
  REFER,
  MAIN,
  RENT,
  AREA,
  TRUE,
  TEXT,
  NAME,
  CALL,
  FILE,
  IEEE,
  LIST,
  REAL,
  TASK,
  DESC,
  EXEC,
  EXIT,
  LINE,
  PAGE,
  SKIP,
  SCAN,
  FREE,
  COPY,
  GOTO,
  THEN,
  ELSE,
  SNAP,
  SIZE,
  OPEN,
  DATA,
  EDIT,
  READ,
  INTO,
  FROM,
  LOOP,
  WHEN,
  STOP,
  WAIT,
  DATE,
  TYPE,
  LIKE,
  POP,
  SET,
  BIT,
  PipePipeEquals,
  StarStarEquals,
  END,
  AND,
  NOT,
  HEX,
  INT,
  KEY,
  GET,
  PUT,
  VX,
  IN,
  BY,
  PlusEquals,
  MinusEquals,
  StarEquals,
  SlashEquals,
  PipeEquals,
  AmpersandEquals,
  NotEquals,
  LessThanGreaterThan,
  OR,
  DO,
  TO,
  GO,
  IF,
  ON,
  NotLessThan,
  LessThanEquals,
  GreaterThanEquals,
  NotGreaterThan,
  PipePipe,
  StarStar,
  MinusGreaterThan,
  EqualsGreaterThan,
  Semicolon,
  OpenParen,
  CloseParen,
  Colon,
  Comma,
  Star,
  Equals,
  A,
  B,
  C,
  F,
  E,
  G,
  P,
  L,
  R,
  V,
  X,
  Pipe,
  Not,
  Ampersand,
  LessThan,
  GreaterThan,
  Plus,
  Minus,
  Slash,
  Dot,
  Percent,
];

export const all = [
  WS,
  ExecFragment,
  ...combinations,
  ...keywords,
  ID,
  NUMBER,
  STRING_TERM,
  ML_COMMENT,
  SL_COMMENT,
];

export const LexerInstance = new Lexer(all);
