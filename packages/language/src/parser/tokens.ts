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

import { createToken, Lexer, TokenType } from "chevrotain";
import { URI } from "../utils/uri";
import { CstNodeKind } from "../syntax-tree/cst";
import { SyntaxNode } from "../syntax-tree/ast";

export interface Token {
  image: string;
  originalImage: string;
  startOffset: number;
  endOffset: number;
  tokenTypeIdx: number;
  isInsertedInRecovery?: boolean;
  tokenType: TokenType;
  uri: URI | undefined;
  kind: CstNodeKind | undefined;
  element: SyntaxNode | undefined;
  immediateFollow: boolean;
}

class TokenImpl implements Token {
  image: string;
  originalImage: string;
  startOffset: number;
  endOffset: number;
  tokenTypeIdx: number;
  isInsertedInRecovery: boolean;
  tokenType: TokenType;
  uri: URI | undefined;
  kind: CstNodeKind | undefined;
  element: SyntaxNode | undefined;
  immediateFollow: boolean;
  constructor(
    image: string,
    originalImage: string,
    tokenType: TokenType,
    startOffset: number,
    endOffset: number,
    uri: URI | undefined,
  ) {
    this.image = image;
    this.originalImage = originalImage;
    this.startOffset = startOffset;
    this.endOffset = endOffset;
    this.tokenTypeIdx = tokenType.tokenTypeIdx!;
    this.tokenType = tokenType;
    this.uri = uri;
    this.kind = undefined;
    this.element = undefined;
    this.isInsertedInRecovery = false;
    this.immediateFollow = false;
  }
}

export function createTokenInstance(
  image: string,
  originalImage: string,
  tokenType: TokenType,
  startOffset: number,
  endOffset: number,
  uri: URI | undefined,
): Token {
  return new TokenImpl(
    image,
    originalImage,
    tokenType,
    startOffset,
    endOffset,
    uri,
  );
}

export const keywordMap = new Map<string, TokenType>();

function registerKeyword(
  config:
    | {
        name?: string;
        names: string[];
        categories?: TokenType[];
      }
    | {
        name: string;
        categories?: TokenType[];
      },
): TokenType {
  const names = "names" in config ? config.names : [config.name];
  const name = config.name ?? names[0];
  if (!name) {
    throw new Error("Keyword must have at least one name");
  }
  const tokenType = createToken({
    name,
    pattern: Lexer.NA,
    categories: [ID, ...(config.categories ?? [])],
  });
  for (const alias of names) {
    keywordMap.set(alias, tokenType);
  }
  return tokenType;
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
export const DBSize = createToken({
  name: "DBSize",
  pattern: Lexer.NA,
});
export const LOBType = createToken({
  name: "LOBType",
  pattern: Lexer.NA,
});
export const LOBFile = createToken({
  name: "LOBFile",
  pattern: Lexer.NA,
});
export const LOBLocator = createToken({
  name: "LOBLocator",
  pattern: Lexer.NA,
});
export const BinaryOrChar = createToken({
  name: "BinaryOrChar",
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
  DBSize,
  LOBType,
  LOBFile,
  LOBLocator,
  BinaryOrChar,
];

// Custom functions

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\\-]/g, "\\$&");
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
// Start of keywords
export const SUBSCRIPTRANGE = registerKeyword({
  name: "SUBSCRIPTRANGE",
  categories: [KeywordConditions],
});
export const NOCHARGRAPHIC = registerKeyword({
  name: "NOCHARGRAPHIC",
  categories: [SimpleOptions],
});
export const NONASSIGNABLE = registerKeyword({
  names: ["NONASSIGNABLE", "NONASGN"],
  categories: [DefaultAttribute],
});
export const FIXEDOVERFLOW = registerKeyword({
  names: ["FIXEDOVERFLOW", "FOFL"],
  categories: [KeywordConditions],
});
export const UNDEFINEDFILE = registerKeyword({
  names: ["UNDEFINEDFILE", "UNDF"],
  categories: [FileReferenceConditions],
});
export const VALUELISTFROM = registerKeyword({
  name: "VALUELISTFROM",
});
export const NODESCRIPTOR = registerKeyword({
  name: "NODESCRIPTOR",
  categories: [SimpleOptions],
});
export const NONCONNECTED = registerKeyword({
  name: "NONCONNECTED",
  categories: [DefaultAttribute],
});
export const LITTLEENDIAN = registerKeyword({
  name: "LITTLEENDIAN",
  categories: [DefaultAttribute],
});
export const ANYCONDITION = registerKeyword({
  names: ["ANYCONDITION", "ANYCOND"],
  categories: [KeywordConditions],
});
export const CHARGRAPHIC = registerKeyword({
  name: "CHARGRAPHIC",
  categories: [SimpleOptions],
});
export const IRREDUCIBLE = registerKeyword({
  names: ["IRREDUCIBLE", "IRRED"],
  categories: [SimpleOptions, DefaultAttribute],
});
export const DLLINTERNAL = registerKeyword({
  name: "DLLINTERNAL",
  categories: [SimpleOptions],
});
export const UNREACHABLE = registerKeyword({
  name: "UNREACHABLE",
});
export const ENVIRONMENT = registerKeyword({
  names: ["ENVIRONMENT", "ENV"],
});
export const DESCRIPTORS = registerKeyword({
  name: "DESCRIPTORS",
});
export const CONFORMANCE = registerKeyword({
  name: "CONFORMANCE",
  categories: [KeywordConditions],
});
export const STRINGRANGE = registerKeyword({
  name: "STRINGRANGE",
  categories: [KeywordConditions],
});
export const DESCRIPTOR = registerKeyword({
  name: "DESCRIPTOR",
  categories: [SimpleOptions],
});
export const XMLCONTENT = registerKeyword({
  name: "XMLCONTENT",
  categories: [DefaultAttribute],
});
export const JSONIGNORE = registerKeyword({
  name: "JSONIGNORE",
  categories: [DefaultAttribute],
});
export const ASSIGNABLE = registerKeyword({
  name: "ASSIGNABLE",
  categories: [DefaultAttribute],
});
export const CONTROLLED = registerKeyword({
  names: ["CONTROLLED", "CTL"],
  categories: [DefaultAttribute],
});
export const NONVARYING = registerKeyword({
  names: ["NONVARYING", "NONVAR"],
  categories: [DefaultAttribute, Varying],
});
export const SEQUENTIAL = registerKeyword({
  names: ["SEQUENTIAL", "SEQ"],
  categories: [DefaultAttribute, OpenOptionType],
});
export const CONVERSION = registerKeyword({
  names: ["CONVERSION"],
  categories: [ID, KeywordConditions],
});
export const STRINGSIZE = registerKeyword({
  name: "STRINGSIZE",
  categories: [KeywordConditions],
});
export const ZERODIVIDE = registerKeyword({
  names: ["ZERODIVIDE", "ZDIV"],
  categories: [KeywordConditions],
});
export const INITACROSS = registerKeyword({
  name: "INITACROSS",
});
export const VALUERANGE = registerKeyword({
  name: "VALUERANGE",
});
export const XMLIGNORE = registerKeyword({
  name: "XMLIGNORE",
  categories: [DefaultAttribute],
});
export const JSONTRIMR = registerKeyword({
  name: "JSONTRIMR",
  categories: [DefaultAttribute],
});
export const NOEXECOPS = registerKeyword({
  name: "NOEXECOPS",
  categories: [SimpleOptions],
});
export const DEACTIVATE = registerKeyword({
  names: ["DEACTIVATE", "DEACT"],
});
export const REDUCIBLE = registerKeyword({
  names: ["REDUCIBLE", "RED"],
  categories: [SimpleOptions],
});
export const REENTRANT = registerKeyword({
  name: "REENTRANT",
  categories: [SimpleOptions],
});
export const FETCHABLE = registerKeyword({
  name: "FETCHABLE",
  categories: [SimpleOptions],
});
export const FROMALIEN = registerKeyword({
  name: "FROMALIEN",
  categories: [SimpleOptions],
});
export const ASSEMBLER = registerKeyword({
  names: ["ASSEMBLER", "ASM"],
  categories: [SimpleOptions],
});
export const RECURSIVE = registerKeyword({
  name: "RECURSIVE",
  categories: [SimpleOptions],
});
export const PROCEDURE = registerKeyword({
  names: ["PROCEDURE", "PROC", "XPROCEDURE", "XPROC"],
});
export const STATEMENT = registerKeyword({
  name: "STATEMENT",
});
export const CHARACTER = registerKeyword({
  names: ["CHARACTER", "CHAR"],
  categories: [DefaultAttribute, AllocateAttributeType, BinaryOrChar],
});
export const DIMACROSS = registerKeyword({
  name: "DIMACROSS",
  categories: [DefaultAttribute],
});
export const AUTOMATIC = registerKeyword({
  names: ["AUTOMATIC", "AUTO"],
  categories: [DefaultAttribute],
});
export const BACKWARDS = registerKeyword({
  name: "BACKWARDS",
  categories: [DefaultAttribute],
});
export const CONDITION = registerKeyword({
  names: ["CONDITION", "COND"],
  categories: [DefaultAttribute],
});
export const CONNECTED = registerKeyword({
  name: "CONNECTED",
  categories: [DefaultAttribute],
});
export const EXCLUSIVE = registerKeyword({
  name: "EXCLUSIVE",
  categories: [DefaultAttribute],
});
export const NONNATIVE = registerKeyword({
  name: "NONNATIVE",
  categories: [DefaultAttribute],
});
export const PARAMETER = registerKeyword({
  name: "PARAMETER",
  categories: [DefaultAttribute],
});
export const PRECISION = registerKeyword({
  names: ["PRECISION", "PREC"],
  categories: [DefaultAttribute],
});
export const STRUCTURE = registerKeyword({
  names: ["STRUCTURE", "STRUCT"],
  categories: [DefaultAttribute],
});
export const TRANSIENT = registerKeyword({
  name: "TRANSIENT",
  categories: [DefaultAttribute],
});
export const UNALIGNED = registerKeyword({
  names: ["UNALIGNED", "UNAL"],
  categories: [DefaultAttribute],
});
export const BIGENDIAN = registerKeyword({
  name: "BIGENDIAN",
  categories: [DefaultAttribute],
});
export const ANSWER = registerKeyword({
  names: ["ANSWER", "ANS"],
});
export const MARGINS = registerKeyword({
  names: ["MARGINS", "MAR"],
});
export const ASSERTION = registerKeyword({
  name: "ASSERTION",
  categories: [KeywordConditions],
});
export const ATTENTION = registerKeyword({
  name: "ATTENTION",
  categories: [KeywordConditions],
});
export const INVALIDOP = registerKeyword({
  name: "INVALIDOP",
  categories: [KeywordConditions],
});
export const UNDERFLOW = registerKeyword({
  names: ["UNDERFLOW", "UFL"],
  categories: [KeywordConditions],
});
export const OTHERWISE = registerKeyword({
  names: ["OTHERWISE", "OTHER"],
});
export const DIMENSION = registerKeyword({
  names: ["DIMENSION", "DIM"],
});
export const VALUELIST = registerKeyword({
  name: "VALUELIST",
});
export const RESERVES = registerKeyword({
  name: "RESERVES",
});
export const JSONNAME = registerKeyword({
  name: "JSONNAME",
  categories: [DefaultAttribute],
});
export const JSONNULL = registerKeyword({
  name: "JSONNULL",
  categories: [DefaultAttribute],
});
export const JSONOMIT = registerKeyword({
  name: "JSONOMIT",
  categories: [DefaultAttribute],
});
export const NOMAPOUT = registerKeyword({
  name: "NOMAPOUT",
  categories: [NoMapOption],
});
export const NOINLINE = registerKeyword({
  name: "NOINLINE",
  categories: [SimpleOptions],
});
export const NORETURN = registerKeyword({
  name: "NORETURN",
  categories: [SimpleOptions],
});
export const EXTERNAL = registerKeyword({
  names: ["EXTERNAL", "EXT"],
  categories: [DefaultAttribute],
});
export const VARIABLE = registerKeyword({
  name: "VARIABLE",
  categories: [DefaultAttribute],
});
export const ALLOCATE = registerKeyword({
  names: ["ALLOCATE", "ALLOC"],
});
export const WIDECHAR = registerKeyword({
  names: ["WIDECHAR", "WCHAR"],
  categories: [DefaultAttribute, AllocateAttributeType],
});
export const ABNORMAL = registerKeyword({
  name: "ABNORMAL",
  categories: [DefaultAttribute],
});
export const BUFFERED = registerKeyword({
  names: ["BUFFERED", "BUF", "UNBUFFERED", "UNBUF"],
  categories: [DefaultAttribute, OpenOptionType],
});
export const CONSTANT = registerKeyword({
  name: "CONSTANT",
  categories: [DefaultAttribute],
});
export const INTERNAL = registerKeyword({
  name: "INTERNAL",
  categories: [DefaultAttribute],
});
export const OPTIONAL = registerKeyword({
  name: "OPTIONAL",
  categories: [DefaultAttribute],
});
export const POSITION = registerKeyword({
  names: ["POSITION", "POS"],
  categories: [DefaultAttribute],
});
export const RESERVED = registerKeyword({
  name: "RESERVED",
  categories: [DefaultAttribute],
});
export const UNSIGNED = registerKeyword({
  name: "UNSIGNED",
  categories: [DefaultAttribute],
});
export const VARYING4 = registerKeyword({
  name: "VARYING4",
  categories: [DefaultAttribute, Varying],
});
export const VARYINGZ = registerKeyword({
  names: ["VARYINGZ", "VARZ"],
  categories: [DefaultAttribute, Varying],
});
export const DOWNTHRU = registerKeyword({
  name: "DOWNTHRU",
});
export const INCLUDE = registerKeyword({
  names: ["INCLUDE", "XINCLUDE"],
});
export const INCLUDE_ALT = createToken({
  name: "INCLUDE_ALT",
  pattern: Lexer.NA,
});
export const INSCAN = registerKeyword({
  names: ["INSCAN", "XINSCAN"],
});
export const NOPRINT = registerKeyword({
  name: "NOPRINT",
});
export const OVERFLOW = registerKeyword({
  names: ["OVERFLOW", "OFL"],
  categories: [KeywordConditions],
});
export const TRANSMIT = registerKeyword({
  name: "TRANSMIT",
  categories: [FileReferenceConditions],
});
export const LINESIZE = registerKeyword({
  name: "LINESIZE",
  categories: [OpenOptionType],
});
export const PAGESIZE = registerKeyword({
  name: "PAGESIZE",
  categories: [OpenOptionType],
});
export const NULLINIT = registerKeyword({
  name: "NULLINIT",
  categories: [DefaultAttribute],
});
export const PROCESS = registerKeyword({
  name: "PROCESS",
});
export const PROCINC = registerKeyword({
  name: "PROCINC",
});
export const XMLNAME = registerKeyword({
  name: "XMLNAME",
  categories: [DefaultAttribute],
});
export const XMLATTR = registerKeyword({
  name: "XMLATTR",
  categories: [DefaultAttribute],
});
export const XMLOMIT = registerKeyword({
  name: "XMLOMIT",
  categories: [DefaultAttribute],
});
export const RESIGNAL = registerKeyword({
  name: "RESIGNAL",
});
export const PACKAGE = registerKeyword({
  name: "PACKAGE",
});
export const EXPORTS = registerKeyword({
  name: "EXPORTS",
});
export const OPTIONS = registerKeyword({
  name: "OPTIONS",
  categories: [DefaultAttribute],
});
export const LINKAGE = registerKeyword({
  name: "LINKAGE",
});
export const OPTLINK = registerKeyword({
  name: "OPTLINK",
  categories: [LinkageOption],
});
export const STDCALL = registerKeyword({
  name: "STDCALL",
  categories: [LinkageOption],
});
export const NOMAPIN = registerKeyword({
  name: "NOMAPIN",
  categories: [NoMapOption],
});
export const FORTRAN = registerKeyword({
  name: "FORTRAN",
  categories: [SimpleOptions],
});
export const BYVALUE = registerKeyword({
  name: "BYVALUE",
  categories: [SimpleOptions, DefaultAttribute],
});
export const AMODE31 = registerKeyword({
  name: "AMODE31",
  categories: [SimpleOptions],
});
export const AMODE64 = registerKeyword({
  name: "AMODE64",
  categories: [SimpleOptions],
});
export const RETCODE = registerKeyword({
  name: "RETCODE",
  categories: [SimpleOptions],
});
export const WINMAIN = registerKeyword({
  name: "WINMAIN",
  categories: [SimpleOptions],
});
export const DYNAMIC = registerKeyword({
  name: "DYNAMIC",
  categories: [ScopeAttribute],
});
export const LIMITED = registerKeyword({
  name: "LIMITED",
});
export const GRAPHIC = registerKeyword({
  name: "GRAPHIC",
  categories: [DefaultAttribute, AllocateAttributeType],
});
export const COMPARE = registerKeyword({
  name: "COMPARE",
});
export const DEFAULT = registerKeyword({
  names: ["DEFAULT", "DFT"],
});
export const ALIGNED = registerKeyword({
  name: "ALIGNED",
  categories: [DefaultAttribute],
});
export const BUILTIN = registerKeyword({
  name: "BUILTIN",
  categories: [DefaultAttribute],
});
export const COMPLEX = registerKeyword({
  name: "COMPLEX",
  categories: [DefaultAttribute],
});
export const DECIMAL = registerKeyword({
  names: ["DECIMAL", "DEC"],
  categories: [DefaultAttribute],
});
export const GENERIC = registerKeyword({
  name: "GENERIC",
});
export const HEXADEC = registerKeyword({
  name: "HEXADEC",
  categories: [DefaultAttribute],
});
export const OUTONLY = registerKeyword({
  name: "OUTONLY",
  categories: [DefaultAttribute],
});
export const POINTER = registerKeyword({
  names: ["POINTER", "PTR"],
  categories: [DefaultAttribute],
});
export const VARYING = registerKeyword({
  names: ["VARYING", "VAR"],
  categories: [DefaultAttribute, Varying],
});
export const ORDINAL = registerKeyword({
  name: "ORDINAL",
});
export const DISPLAY = registerKeyword({
  name: "DISPLAY",
});
export const ROUTCDE = registerKeyword({
  name: "ROUTCDE",
});
export const ITERATE = registerKeyword({
  name: "ITERATE",
});
export const ACTIVATE = registerKeyword({
  names: ["ACTIVATE", "ACT"],
});
export const NORESCAN = registerKeyword({
  name: "NORESCAN",
  categories: [DefaultAttribute],
});
export const KEYFROM = registerKeyword({
  name: "KEYFROM",
  categories: [WriteStatementType, LocateType],
});
export const STORAGE = registerKeyword({
  name: "STORAGE",
  categories: [KeywordConditions],
});
export const ENDFILE = registerKeyword({
  name: "ENDFILE",
  categories: [FileReferenceConditions],
});
export const ENDPAGE = registerKeyword({
  name: "ENDPAGE",
  categories: [FileReferenceConditions],
});
export const QUALIFY = registerKeyword({
  name: "QUALIFY",
});
export const RELEASE = registerKeyword({
  name: "RELEASE",
});
export const REWRITE = registerKeyword({
  name: "REWRITE",
});
export const INITIAL = registerKeyword({
  names: ["INITIAL", "INIT"],
});
export const DECLARE = registerKeyword({
  names: ["DECLARE", "DCL", "XDECLARE", "XDCL"],
});
export const PICTURE = registerKeyword({
  names: ["PICTURE", "PIC"],
});
export const WIDEPIC = registerKeyword({
  name: "WIDEPIC",
});
export const RETURNS = registerKeyword({
  name: "RETURNS",
});
export const SYSTEM = registerKeyword({
  name: "SYSTEM",
  categories: [LinkageOption],
});
export const INLINE = registerKeyword({
  name: "INLINE",
  categories: [SimpleOptions],
});
export const BYADDR = registerKeyword({
  name: "BYADDR",
  categories: [SimpleOptions, DefaultAttribute],
});
export const STATIC = registerKeyword({
  name: "STATIC",
  categories: [DefaultAttribute, ScopeAttribute],
});
export const ASSERT = registerKeyword({
  name: "ASSERT",
});
export const ATTACH = registerKeyword({
  name: "ATTACH",
});
export const THREAD = registerKeyword({
  name: "THREAD",
});
export const TSTACK = registerKeyword({
  name: "TSTACK",
});
export const CANCEL = registerKeyword({
  name: "CANCEL",
});
export const BINARY = registerKeyword({
  name: "BINARY",
  categories: [DefaultAttribute, BinaryOrChar],
});
export const BIN = registerKeyword({
  name: "BIN",
  categories: [DefaultAttribute],
});
export const FORMAT = registerKeyword({
  name: "FORMAT",
  categories: [DefaultAttribute],
});
export const NOINIT = registerKeyword({
  name: "NOINIT",
  categories: [DefaultAttribute],
});
export const INONLY = registerKeyword({
  name: "INONLY",
  categories: [DefaultAttribute],
});
export const INDFOR = registerKeyword({
  name: "INDFOR",
});
export const MEMBER = registerKeyword({
  name: "MEMBER",
  categories: [DefaultAttribute],
});
export const NATIVE = registerKeyword({
  name: "NATIVE",
  categories: [DefaultAttribute],
});
export const NORMAL = registerKeyword({
  name: "NORMAL",
  categories: [DefaultAttribute],
});
export const OFFSET = registerKeyword({
  name: "OFFSET",
  categories: [DefaultAttribute],
});
export const OUTPUT = registerKeyword({
  name: "OUTPUT",
  categories: [DefaultAttribute, OpenOptionType],
});
export const RECORD = registerKeyword({
  name: "RECORD",
  categories: [DefaultAttribute, FileReferenceConditions, OpenOptionType],
});
export const SIGNED = registerKeyword({
  name: "SIGNED",
  categories: [DefaultAttribute],
});
export const STREAM = registerKeyword({
  name: "STREAM",
  categories: [DefaultAttribute, OpenOptionType],
});
export const UPDATE = registerKeyword({
  name: "UPDATE",
  categories: [DefaultAttribute, OpenOptionType],
});
export const DEFINE = registerKeyword({
  names: ["DEFINE", "XDEFINE"],
});
export const DEFINED = registerKeyword({
  names: ["DEFINED", "DEF"],
});
export const DELETE = registerKeyword({
  name: "DELETE",
});
export const DETACH = registerKeyword({
  name: "DETACH",
});
export const UPTHRU = registerKeyword({
  name: "UPTHRU",
});
export const REPEAT = registerKeyword({
  name: "REPEAT",
});
export const COLUMN = registerKeyword({
  names: ["COLUMN", "COL"],
});
export const STRING = registerKeyword({
  name: "STRING",
});
export const NOSCAN = registerKeyword({
  name: "NOSCAN",
  categories: [DefaultAttribute],
});
export const RESCAN = registerKeyword({
  name: "RESCAN",
  categories: [DefaultAttribute],
});
export const LOCATE = registerKeyword({
  name: "LOCATE",
});
export const FINISH = registerKeyword({
  name: "FINISH",
  categories: [KeywordConditions],
});
export const DIRECT = registerKeyword({
  name: "DIRECT",
  categories: [OpenOptionType],
});
export const IGNORE = registerKeyword({
  name: "IGNORE",
  categories: [ReadStatementType],
});
export const REINIT = registerKeyword({
  name: "REINIT",
});
export const RETURN = registerKeyword({
  name: "RETURN",
});
export const SELECT = registerKeyword({
  name: "SELECT",
});
export const SIGNAL = registerKeyword({
  name: "SIGNAL",
});
export const HANDLE = registerKeyword({
  name: "HANDLE",
});
export const CDECL = registerKeyword({
  name: "CDECL",
  categories: [LinkageOption],
});
export const CMPAT = registerKeyword({
  name: "CMPAT",
});
export const NOMAP = registerKeyword({
  name: "NOMAP",
  categories: [NoMapOption],
});
export const ORDER = registerKeyword({
  names: ["ORDER", "REORDER"],
  categories: [SimpleOptions],
});
export const COBOL = registerKeyword({
  name: "COBOL",
  categories: [SimpleOptions],
});
export const INTER = registerKeyword({
  name: "INTER",
  categories: [SimpleOptions],
});
export const ENTRY = registerKeyword({
  name: "ENTRY",
});
export const UCHAR = registerKeyword({
  name: "UCHAR",
  categories: [DefaultAttribute, AllocateAttributeType, Char],
});
export const FALSE = registerKeyword({
  name: "FALSE",
  categories: [Boolean],
});
export const BEGIN = registerKeyword({
  name: "BEGIN",
});
export const CLOSE = registerKeyword({
  name: "CLOSE",
});
export const RANGE = registerKeyword({
  name: "RANGE",
  categories: [DefaultAttribute],
});
export const BASED = registerKeyword({
  name: "BASED",
  categories: [DefaultAttribute],
});
export const EVENT = registerKeyword({
  name: "EVENT",
  categories: [DefaultAttribute],
});
export const FIXED = registerKeyword({
  name: "FIXED",
  categories: [DefaultAttribute],
});
export const FLOAT = registerKeyword({
  name: "FLOAT",
  categories: [DefaultAttribute],
});
export const INOUT = registerKeyword({
  name: "INOUT",
  categories: [DefaultAttribute],
});
export const INPUT = registerKeyword({
  name: "INPUT",
  categories: [DefaultAttribute, OpenOptionType],
});
export const KEYED = registerKeyword({
  name: "KEYED",
  categories: [DefaultAttribute, OpenOptionType],
});
export const LABEL = registerKeyword({
  name: "LABEL",
  categories: [DefaultAttribute],
});
export const PRINT = registerKeyword({
  name: "PRINT",
  categories: [DefaultAttribute, OpenOptionType],
});
export const UNION = registerKeyword({
  name: "UNION",
  categories: [DefaultAttribute],
});
export const ALIAS = registerKeyword({
  name: "ALIAS",
});
export const VALUE = registerKeyword({
  name: "VALUE",
});
export const DELAY = registerKeyword({
  name: "DELAY",
});
export const REPLY = registerKeyword({
  name: "REPLY",
});
export const WHILE = registerKeyword({
  name: "WHILE",
});
export const UNTIL = registerKeyword({
  name: "UNTIL",
});
export const FETCH = registerKeyword({
  name: "FETCH",
});
export const TITLE = registerKeyword({
  name: "TITLE",
  categories: [OpenOptionType],
});
export const FLUSH = registerKeyword({
  name: "FLUSH",
});
export const LEAVE = registerKeyword({
  name: "LEAVE",
});
export const ERROR = registerKeyword({
  name: "ERROR",
  categories: [KeywordConditions],
});
export const PUSH = registerKeyword({
  name: "PUSH",
});
export const KEYTO = registerKeyword({
  name: "KEYTO",
  categories: [ReadStatementType, WriteStatementType],
});
export const REVERT = registerKeyword({
  name: "REVERT",
});
export const WRITE = registerKeyword({
  name: "WRITE",
});
export const REFER = registerKeyword({
  name: "REFER",
});
export const NOTE = registerKeyword({
  name: "NOTE",
});
export const MAIN = registerKeyword({
  name: "MAIN",
  categories: [SimpleOptions],
});
export const RENT = registerKeyword({
  name: "RENT",
  categories: [SimpleOptions],
});
export const AREA = registerKeyword({
  name: "AREA",
  categories: [DefaultAttribute, AllocateAttributeType, KeywordConditions],
});
export const TRUE = registerKeyword({
  name: "TRUE",
  categories: [Boolean],
});
export const TEXT = registerKeyword({
  name: "TEXT",
});
export const NAME = registerKeyword({
  name: "NAME",
  categories: [FileReferenceConditions],
});
export const CALL = registerKeyword({
  name: "CALL",
});
export const FILE = registerKeyword({
  name: "FILE",
  categories: [
    DefaultAttribute,
    PutAttribute,
    ReadStatementType,
    WriteStatementType,
    RewriteStatementType,
    LocateType,
    OpenOptionType,
  ],
});
export const IEEE = registerKeyword({
  name: "IEEE",
  categories: [DefaultAttribute],
});
export const LIST = registerKeyword({
  name: "LIST",
  categories: [DefaultAttribute],
});
export const REAL = registerKeyword({
  name: "REAL",
  categories: [DefaultAttribute],
});
export const TASK = registerKeyword({
  name: "TASK",
  categories: [DefaultAttribute],
});
export const DESC = registerKeyword({
  name: "DESC",
});
export const EXEC = registerKeyword({
  name: "EXEC",
});
export const EXIT = registerKeyword({
  name: "EXIT",
});
export const LINE = registerKeyword({
  name: "LINE",
  categories: [PutAttribute],
});
export const PAGE = registerKeyword({
  name: "PAGE",
  categories: [PutAttribute],
});
export const SKIP = registerKeyword({
  name: "SKIP",
  categories: [PutAttribute],
});
export const SCAN = registerKeyword({
  name: "SCAN",
  categories: [DefaultAttribute],
});
export const FREE = registerKeyword({
  name: "FREE",
});
export const COPY = registerKeyword({
  name: "COPY",
});
export const GOTO = registerKeyword({
  name: "GOTO",
});
export const THEN = registerKeyword({
  name: "THEN",
});
export const ELSE = registerKeyword({
  name: "ELSE",
});
export const SNAP = registerKeyword({
  name: "SNAP",
});
export const SIZE = registerKeyword({
  name: "SIZE",
  categories: [KeywordConditions],
});
export const OPEN = registerKeyword({
  name: "OPEN",
});
export const POP = registerKeyword({
  name: "POP",
});
export const DATA = registerKeyword({
  name: "DATA",
});
export const EDIT = registerKeyword({
  name: "EDIT",
});
export const READ = registerKeyword({
  name: "READ",
});
export const INTO = registerKeyword({
  name: "INTO",
  categories: [ReadStatementType],
});
export const FROM = registerKeyword({
  name: "FROM",
  categories: [WriteStatementType, RewriteStatementType],
});
export const LOOP = registerKeyword({
  names: ["LOOP", "FOREVER"],
});
export const WHEN = registerKeyword({
  name: "WHEN",
});
export const STOP = registerKeyword({
  name: "STOP",
});
export const WAIT = registerKeyword({
  name: "WAIT",
});
export const DATE = registerKeyword({
  name: "DATE",
});
export const TYPE = registerKeyword({
  name: "TYPE",
});
export const LIKE = registerKeyword({
  name: "LIKE",
});
export const SET = registerKeyword({
  name: "SET",
  categories: [ReadStatementType, LocateType],
});
export const BIT = registerKeyword({
  name: "BIT",
  categories: [DefaultAttribute, AllocateAttributeType],
});
export const PipePipeEquals = createToken({
  name: "||=",
  pattern: Lexer.NA,
  categories: [AssignmentOperator],
});
export const StarStarEquals = createToken({
  name: "**=",
  pattern: Lexer.NA,
  categories: [AssignmentOperator],
});
export const END = registerKeyword({
  name: "END",
});
export const AND = registerKeyword({
  name: "AND",
  categories: [DefaultAttributeBinaryOperator],
});
export const NOT = registerKeyword({
  name: "NOT",
});
export const HEX = registerKeyword({
  name: "HEX",
  categories: [DefaultAttribute],
});
export const INT = registerKeyword({
  name: "INT",
  categories: [DefaultAttribute],
});
export const KEY = registerKeyword({
  name: "KEY",
  categories: [
    FileReferenceConditions,
    ReadStatementType,
    RewriteStatementType,
  ],
});
export const GET = registerKeyword({
  name: "GET",
});
export const PUT = registerKeyword({
  name: "PUT",
});
export const VX = registerKeyword({
  name: "VX",
  names: ["V1", "V2", "V3"],
});
export const IN = registerKeyword({
  name: "IN",
});
export const BY = registerKeyword({
  name: "BY",
});
export const PlusEquals = createToken({
  name: "+=",
  pattern: Lexer.NA,
  categories: [AssignmentOperator],
});
export const MinusEquals = createToken({
  name: "-=",
  pattern: Lexer.NA,
  categories: [AssignmentOperator],
});
export const StarEquals = createToken({
  name: "*=",
  pattern: Lexer.NA,
  categories: [AssignmentOperator],
});
export const SlashEquals = createToken({
  name: "/=",
  pattern: Lexer.NA,
  categories: [AssignmentOperator],
});
export const PipeEquals = createToken({
  name: "|=",
  pattern: Lexer.NA,
  categories: [AssignmentOperator],
});
export const AmpersandEquals = createToken({
  name: "&=",
  pattern: Lexer.NA,
  categories: [AssignmentOperator],
});
export const NotEquals = createToken({
  name: "^=",
  pattern: Lexer.NA,
  categories: [AssignmentOperator, BinaryOperator],
});
export const LessThanGreaterThan = createToken({
  name: "<>",
  pattern: Lexer.NA,
  categories: [AssignmentOperator, BinaryOperator],
});
export const OR = registerKeyword({
  name: "OR",
  categories: [DefaultAttributeBinaryOperator],
});
export const DO = registerKeyword({
  name: "DO",
});
export const TO = registerKeyword({
  name: "TO",
});
export const GO = registerKeyword({
  name: "GO",
});
export const IF = registerKeyword({
  name: "IF",
});
export const ON = registerKeyword({
  name: "ON",
});
export const NotLessThan = createToken({
  name: "^<",
  pattern: Lexer.NA,
  categories: [BinaryOperator],
});
export const LessThanEquals = createToken({
  name: "<=",
  pattern: Lexer.NA,
  categories: [BinaryOperator],
});
export const GreaterThanEquals = createToken({
  name: ">=",
  pattern: Lexer.NA,
  categories: [BinaryOperator],
});
export const NotGreaterThan = createToken({
  name: "^>",
  pattern: Lexer.NA,
  categories: [BinaryOperator],
});
export const PipePipe = createToken({
  name: "||",
  pattern: Lexer.NA,
  categories: [BinaryOperator],
});
export const StarStar = createToken({
  name: "**",
  pattern: Lexer.NA,
  categories: [BinaryOperator],
});
export const MinusGreaterThan = createToken({
  name: "->",
  pattern: Lexer.NA,
});
export const EqualsGreaterThan = createToken({
  name: "=>",
  pattern: Lexer.NA,
});
export const Semicolon = createToken({
  name: ";",
  pattern: Lexer.NA,
});
export const OpenParen = createToken({
  name: "(",
  pattern: Lexer.NA,
});
export const CloseParen = createToken({
  name: ")",
  pattern: Lexer.NA,
});
export const Colon = createToken({
  name: ":",
  pattern: Lexer.NA,
});
export const Comma = createToken({
  name: ",",
  pattern: Lexer.NA,
});
export const Star = createToken({
  name: "*",
  pattern: Lexer.NA,
  categories: [BinaryOperator],
});
export const Equals = createToken({
  name: "=",
  pattern: Lexer.NA,
  categories: [BinaryOperator, AssignmentOperator],
});
export const A = registerKeyword({
  name: "A",
});
export const B = registerKeyword({
  name: "B",
});
export const C = registerKeyword({
  name: "C",
});
export const F = registerKeyword({
  name: "F",
});
export const E = registerKeyword({
  name: "E",
});
// G for Giga bytes. Used in DBSIZE and the G format option
export const G = registerKeyword({
  name: "G",
  categories: [DBSize],
});
// K for Kilo bytes. Exclusively used for DBSIZE
export const K = registerKeyword({
  name: "K",
  categories: [DBSize],
});
// M for Mega bytes. Exclusively used for DBSIZE
export const M = registerKeyword({
  name: "M",
  categories: [DBSize],
});
export const P = registerKeyword({
  name: "P",
});
export const L = registerKeyword({
  name: "L",
});
export const R = registerKeyword({
  name: "R",
});
export const V = registerKeyword({
  name: "V",
});
export const X = registerKeyword({
  name: "X",
});
export const Pipe = createToken({
  name: "|",
  pattern: Lexer.NA,
  categories: [BinaryOperator],
});
export const Not = createToken({
  name: "^",
  pattern: Lexer.NA,
  categories: [BinaryOperator, UnaryOperator],
});
export const Ampersand = createToken({
  name: "&",
  pattern: Lexer.NA,
  categories: [BinaryOperator],
});
export const LessThan = createToken({
  name: "<",
  pattern: Lexer.NA,
  categories: [BinaryOperator],
});
export const GreaterThan = createToken({
  name: ">",
  pattern: Lexer.NA,
  categories: [BinaryOperator],
});
export const Plus = createToken({
  name: "+",
  pattern: Lexer.NA,
  categories: [BinaryOperator, UnaryOperator],
});
export const Minus = createToken({
  name: "-",
  pattern: Lexer.NA,
  categories: [BinaryOperator, UnaryOperator],
});
export const Slash = createToken({
  name: "/",
  pattern: Lexer.NA,
  categories: [BinaryOperator],
});
export const Dot = createToken({
  name: ".",
  pattern: Lexer.NA,
});
export const Percent = createToken({
  name: "%",
  pattern: Lexer.NA,
});

// SQL host variable tokens
// Sourced from https://www.ibm.com/docs/en/db2-for-zos/12.0.0?topic=pli-host-variable-arrays-in
export const SQL = registerKeyword({
  name: "SQL",
});
export const IS = registerKeyword({
  name: "IS",
});
export const LARGE = registerKeyword({
  name: "LARGE",
});
export const VARBINARY = registerKeyword({
  name: "VARBINARY",
});
export const OBJECT = registerKeyword({
  name: "OBJECT",
});
export const XML = registerKeyword({
  name: "XML",
});
export const AS = registerKeyword({
  name: "AS",
});
export const BLOB = registerKeyword({
  name: "BLOB",
  categories: [LOBType],
});
export const CLOB = registerKeyword({
  name: "CLOB",
  categories: [LOBType],
});
export const DBCLOB = registerKeyword({
  name: "DBCLOB",
  categories: [LOBType],
});
export const BLOB_LOCATOR = registerKeyword({
  name: "BLOB_LOCATOR",
  categories: [LOBLocator],
});
export const CLOB_LOCATOR = registerKeyword({
  name: "CLOB_LOCATOR",
  categories: [LOBLocator],
});
export const DBCLOB_LOCATOR = registerKeyword({
  name: "DBCLOB_LOCATOR",
  categories: [LOBLocator],
});
export const BLOB_FILE = registerKeyword({
  name: "BLOB_FILE",
  categories: [LOBFile],
});
export const CLOB_FILE = registerKeyword({
  name: "CLOB_FILE",
  categories: [LOBFile],
});
export const DBCLOB_FILE = registerKeyword({
  name: "DBCLOB_FILE",
  categories: [LOBFile],
});
export const ROWID = registerKeyword({
  name: "ROWID",
});

const dbkeywords = [
  SQL,
  IS,
  LARGE,
  VARBINARY,
  OBJECT,
  XML,
  AS,
  BLOB,
  CLOB,
  DBCLOB,
  BLOB_LOCATOR,
  CLOB_LOCATOR,
  DBCLOB_LOCATOR,
  BLOB_FILE,
  CLOB_FILE,
  DBCLOB_FILE,
  ROWID,
];

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
  INCLUDE,
  INCLUDE_ALT,
  NOPRINT,
  OVERFLOW,
  TRANSMIT,
  LINESIZE,
  PAGESIZE,
  ACTIVATE,
  NORESCAN,
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
  MARGINS,
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
  ANSWER,
  SYSTEM,
  INSCAN,
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
  LOCATE,
  FINISH,
  DIRECT,
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
  ERROR,
  PUSH,
  KEYTO,
  REVERT,
  WRITE,
  REFER,
  NOTE,
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
  SQL,
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
  IS,
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
  K,
  M,
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
  ...dbkeywords,
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
