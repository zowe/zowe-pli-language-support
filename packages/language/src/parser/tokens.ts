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

import { createToken, ITokenConfig, Lexer, TokenType } from "chevrotain";
import { URI } from "../utils/uri";
import { CstNodeKind } from "../syntax-tree/cst";
import * as ast from "../syntax-tree/ast";

export interface Token {
  /**
   * The unique ID of the token.
   * This is assigned when the token is created.
   *
   * The ID is required to uniquely identify objects that are built from tokens.
   * This is mainly useful in the context of linking to identify duplicate qualified syntax nodes.
   *
   * Note that the ID may be `undefined` in some edge cases,
   * such as when tokens are created during the parser recovery.
   */
  id: number | undefined;
  image: string;
  originalImage: string;
  startOffset: number;
  startLine: number;
  startColumn: number;
  endOffset: number;
  endLine: number;
  endColumn: number;
  tokenTypeIdx: number;
  isInsertedInRecovery?: boolean;
  tokenType: TokenType;
  uri: URI | undefined;
  kind: CstNodeKind | undefined;
  element: ast.SyntaxNode | undefined;
  immediateFollow: boolean;
}

class TokenImpl implements Token {
  image: string;
  originalImage: string;
  id: number = 0;
  startOffset: number;
  startLine: number;
  startColumn: number;
  endOffset: number;
  endLine: number;
  endColumn: number;
  tokenTypeIdx: number;
  isInsertedInRecovery: boolean;
  tokenType: TokenType;
  uri: URI | undefined;
  kind: CstNodeKind | undefined;
  element: ast.SyntaxNode | undefined;
  immediateFollow: boolean;
  constructor(
    image: string,
    originalImage: string,
    id: number,
    tokenType: TokenType,
    startOffset: number,
    startLine: number,
    startColumn: number,
    endOffset: number,
    endLine: number,
    endColumn: number,
    uri: URI | undefined,
  ) {
    this.image = image;
    this.originalImage = originalImage;
    this.id = id;
    this.startOffset = startOffset;
    this.startLine = startLine;
    this.startColumn = startColumn;
    this.endOffset = endOffset;
    this.endLine = endLine;
    this.endColumn = endColumn;
    this.tokenTypeIdx = tokenType.tokenTypeIdx!;
    this.tokenType = tokenType;
    this.uri = uri;
    this.kind = undefined;
    this.element = undefined;
    this.isInsertedInRecovery = false;
    this.immediateFollow = false;
  }
}

/**
 * A simple incrementing ID generator for tokens.
 * Theoretically, this could overflow. However, the maximum safe integer in JavaScript is 2^53 - 1.
 * This would require a the language server to chew through that many tokens in a single session, which would likely take years.
 */
let nextTokenId = 1;

export function createTokenInstance(
  image: string,
  originalImage: string,
  tokenType: TokenType,
  startOffset: number,
  startLine: number,
  startColumn: number,
  endOffset: number,
  endLine: number,
  endColumn: number,
  uri: URI | undefined,
): Token {
  return new TokenImpl(
    image,
    originalImage,
    nextTokenId++,
    tokenType,
    startOffset,
    startLine,
    startColumn,
    endOffset,
    endLine,
    endColumn,
    uri,
  );
}

export const keywordMap = new Map<string, TokenType>();
const keywords: TokenType[] = [];
//combination name -> {mapTo: keyword name -> enum value, mapFrom: enum value -> keyword name}
const mappings = new Map<TokenType, {
  mapTo: Map<string, number>;
  mapFrom: Map<number, string>;
}>();

interface KeywordConfig {
  /**
   * The keyword name or names (aliases). The first name is the canonical name.
   */
  name: string | string[];
  //TODO change to [TokenType, number][] after AST enum migration
  categories?: TokenType[];
}

function registerKeyword(config: KeywordConfig): TokenType {
  const names = Array.isArray(config.name) ? config.name : [config.name];
  const name = names[0];
  if (!name) {
    throw new Error("Keyword must have at least one, non-empty name");
  }
  const tokenType = createToken({
    name,
    pattern: Lexer.NA,
    categories: [ID, ...(config.categories ?? []).map(([category]) => category)],
  });
  for (const alias of names) {
    keywordMap.set(alias, tokenType);
  }
  for (const [category, enumValue] of config.categories ?? []) {
    const mapping = mappings.get(category)!;
    for (const alias of names) {
      mapping.mapTo.set(alias, enumValue);
    }
    mapping.mapFrom.set(enumValue, names[0]);
  }
  keywords.push(tokenType);
  return tokenType;
}

const combinations: TokenType[] = [];

export type MappableTokenType<TEnum extends number=number> = TokenType & {
  mapToEnumLiteral(image: string): TEnum;
  mapFromEnumLiteral(value: TEnum): string;
};

function createTokenWithParser<TEnum extends number=number>(config: ITokenConfig): MappableTokenType<TEnum> {
  const tokenType = createToken(config);
  mappings.set(tokenType, {
    mapTo: new Map<string, number>(),
    mapFrom: new Map<number, string>(),
  });
  return {
    ...tokenType,
    mapToEnumLiteral(image: string): TEnum {
      const mapping = mappings.get(tokenType)!;
      return mapping.mapTo.get(image) as TEnum;
    },
    mapFromEnumLiteral(value: TEnum): string {
      const mapsTo = mappings.get(tokenType)!;
      return mapsTo.mapFrom.get(value)!;
    }
  };
}

function registerCombination<TEnum extends number = number>(name: string) {
  const tokenType = createTokenWithParser<TEnum>({
    name,
    pattern: Lexer.NA,
  });
  combinations.push(tokenType);
  return tokenType;
}

// Combination tokens (parser optimization)
export const LinkageOption = registerCombination("LinkageOption");
export const NoMapOption = registerCombination("NoMapOption");
export const SimpleOptions = registerCombination("SimpleOptions");
export const DefaultAttribute = registerCombination<ast.DefaultAttribute>("DefaultAttribute");
export const DefaultAttributeBinaryOperator = registerCombination(
  "DefaultAttributeBinaryOperator",
);
export const BinaryOperator = registerCombination("BinaryOperator");
export const UnaryOperator = registerCombination("UnaryOperator");
export const ScopeAttribute = registerCombination("ScopeAttribute");
export const AllocateAttributeType = registerCombination(
  "AllocateAttributeType",
);
export const AssignmentOperator = registerCombination("AssignmentOperator");
export const KeywordConditions = registerCombination("KeywordConditions");
export const FileReferenceConditions = registerCombination(
  "FileReferenceConditions",
);
export const PutAttribute = registerCombination("PutAttribute");
export const Varying = registerCombination("Varying");
export const Char = registerCombination("Char");
export const ReadStatementType = registerCombination("ReadStatementType");
export const WriteStatementType = registerCombination("WriteStatementType");
export const RewriteStatementType = registerCombination("RewriteStatementType");
export const Boolean = registerCombination("Boolean");
export const LocateType = registerCombination("LocateType");
export const OpenOptionType = registerCombination("OpenOptionType");
export const VX = registerCombination("VX");
export const CharOrBinary = registerCombination("CharOrBinary");
export const TypeOrOrdinal = registerCombination("TypeOrOrdinal");
export const LOB = registerCombination("LOB");
export const LOBLocator = registerCombination("LOBLocator");
export const LOBFile = registerCombination("LOBFile");
export const LOBSize = registerCombination("LOBSize");

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
  name: ["NONASSIGNABLE", "NONASGN"],
  categories: [DefaultAttribute],
});
export const FIXEDOVERFLOW = registerKeyword({
  name: ["FIXEDOVERFLOW", "FOFL"],
  categories: [KeywordConditions],
});
export const UNDEFINEDFILE = registerKeyword({
  name: ["UNDEFINEDFILE", "UNDF"],
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
  name: ["ANYCONDITION", "ANYCOND"],
  categories: [KeywordConditions],
});
export const CHARGRAPHIC = registerKeyword({
  name: "CHARGRAPHIC",
  categories: [SimpleOptions],
});
export const IRREDUCIBLE = registerKeyword({
  name: ["IRREDUCIBLE", "IRRED"],
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
  name: ["ENVIRONMENT", "ENV"],
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
  name: ["CONTROLLED", "CTL"],
  categories: [DefaultAttribute],
});
export const NONVARYING = registerKeyword({
  name: ["NONVARYING", "NONVAR"],
  categories: [DefaultAttribute, Varying],
});
export const SEQUENTIAL = registerKeyword({
  name: ["SEQUENTIAL", "SEQ"],
  categories: [DefaultAttribute, OpenOptionType],
});
export const CONVERSION = registerKeyword({
  name: ["CONVERSION"],
  categories: [ID, KeywordConditions],
});
export const STRINGSIZE = registerKeyword({
  name: "STRINGSIZE",
  categories: [KeywordConditions],
});
export const ZERODIVIDE = registerKeyword({
  name: ["ZERODIVIDE", "ZDIV"],
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
  name: ["DEACTIVATE", "DEACT"],
});
export const REDUCIBLE = registerKeyword({
  name: ["REDUCIBLE", "RED"],
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
  name: ["ASSEMBLER", "ASM"],
  categories: [SimpleOptions],
});
export const RECURSIVE = registerKeyword({
  name: "RECURSIVE",
  categories: [SimpleOptions],
});
export const PROCEDURE = registerKeyword({
  name: ["PROCEDURE", "PROC", "XPROCEDURE", "XPROC"],
});
export const STATEMENT = registerKeyword({
  name: ["STATEMENT", "STMT"],
});
export const CHARACTER = registerKeyword({
  name: ["CHARACTER", "CHAR"],
  categories: [DefaultAttribute, AllocateAttributeType, Char, CharOrBinary],
});
export const DIMACROSS = registerKeyword({
  name: "DIMACROSS",
  categories: [DefaultAttribute],
});
export const AUTOMATIC = registerKeyword({
  name: ["AUTOMATIC", "AUTO"],
  categories: [DefaultAttribute],
});
export const BACKWARDS = registerKeyword({
  name: "BACKWARDS",
  categories: [DefaultAttribute],
});
export const CONDITION = registerKeyword({
  name: ["CONDITION", "COND"],
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
  name: ["PRECISION", "PREC"],
  categories: [DefaultAttribute],
});
export const STRUCTURE = registerKeyword({
  name: ["STRUCTURE", "STRUCT"],
  categories: [DefaultAttribute],
});
export const TRANSIENT = registerKeyword({
  name: "TRANSIENT",
  categories: [DefaultAttribute],
});
export const UNALIGNED = registerKeyword({
  name: ["UNALIGNED", "UNAL"],
  categories: [DefaultAttribute],
});
export const BIGENDIAN = registerKeyword({
  name: "BIGENDIAN",
  categories: [DefaultAttribute],
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
  name: ["UNDERFLOW", "UFL"],
  categories: [KeywordConditions],
});
export const OTHERWISE = registerKeyword({
  name: ["OTHERWISE", "OTHER"],
});
export const DIMENSION = registerKeyword({
  name: ["DIMENSION", "DIM"],
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
  name: ["EXTERNAL", "EXT"],
  categories: [DefaultAttribute],
});
export const VARIABLE = registerKeyword({
  name: "VARIABLE",
  categories: [DefaultAttribute],
});
export const ALLOCATE = registerKeyword({
  name: ["ALLOCATE", "ALLOC"],
});
export const WIDECHAR = registerKeyword({
  name: ["WIDECHAR", "WCHAR"],
  categories: [DefaultAttribute, AllocateAttributeType, Char],
});
export const ABNORMAL = registerKeyword({
  name: "ABNORMAL",
  categories: [DefaultAttribute],
});
export const BUFFERED = registerKeyword({
  name: ["BUFFERED", "BUF"],
  categories: [DefaultAttribute, OpenOptionType],
});
export const UNBUFFERED = registerKeyword({
  name: ["UNBUFFERED", "UNBUF"],
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
  name: ["POSITION", "POS"],
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
  name: ["VARYINGZ", "VARZ"],
  categories: [DefaultAttribute, Varying],
});
export const DOWNTHRU = registerKeyword({
  name: "DOWNTHRU",
});
export const INCLUDE = registerKeyword({
  name: ["INCLUDE", "XINCLUDE"],
});
export const INCLUDE_ALT = createToken({
  name: "INCLUDE_ALT",
  pattern: Lexer.NA,
});
export const INSCAN = registerKeyword({
  name: ["INSCAN", "XINSCAN"],
});
export const REPLACE = registerKeyword({
  name: "REPLACE",
});
export const NOPRINT = registerKeyword({
  name: "NOPRINT",
});
export const OVERFLOW = registerKeyword({
  name: ["OVERFLOW", "OFL"],
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
  name: ["DEFAULT", "DFT"],
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
  name: ["DECIMAL", "DEC"],
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
  name: ["POINTER", "PTR"],
  categories: [DefaultAttribute],
});
export const VARYING = registerKeyword({
  name: ["VARYING", "VAR"],
  categories: [DefaultAttribute, Varying],
});
export const ORDINAL = registerKeyword({
  name: "ORDINAL",
  categories: [TypeOrOrdinal],
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
  name: ["ACTIVATE", "ACT"],
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
  name: ["INITIAL", "INIT"],
});
export const DECLARE = registerKeyword({
  name: ["DECLARE", "DCL", "XDECLARE", "XDCL"],
});
export const PICTURE = registerKeyword({
  name: ["PICTURE", "PIC"],
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
export const ANSWER = registerKeyword({
  name: ["ANSWER", "ANS"],
});
export const MARGINS = registerKeyword({
  name: ["MARGINS", "MAR"],
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
  categories: [DefaultAttribute, CharOrBinary],
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
  name: ["DEFINE", "XDEFINE"],
});
export const DEFINED = registerKeyword({
  name: ["DEFINED", "DEF"],
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
  name: ["COLUMN", "COL"],
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
  name: ["ORDER", "REORDER"],
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
export const WITH = registerKeyword({
  name: "WITH",
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
  name: ["LOOP", "FOREVER"],
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
  categories: [TypeOrOrdinal],
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
export const V1 = registerKeyword({
  name: "V1",
  categories: [VX],
});
export const V2 = registerKeyword({
  name: "V2",
  categories: [VX],
});
export const V3 = registerKeyword({
  name: "V3",
  categories: [VX],
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
export const G = registerKeyword({
  name: "G",
  categories: [LOBSize],
});
export const K = registerKeyword({
  name: "K",
  categories: [LOBSize],
});
export const M = registerKeyword({
  name: "M",
  categories: [LOBSize],
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

// "SQL TYPE IS" attribute tokens
// https://www.ibm.com/docs/en/db2-for-zos/12.0.0?topic=pli-host-variable-arrays-in
export const SQL = registerKeyword({
  name: "SQL",
});
export const IS = registerKeyword({
  name: "IS",
});
export const XML = registerKeyword({
  name: "XML",
});
export const AS = registerKeyword({
  name: "AS",
});
export const LARGE = registerKeyword({
  name: "LARGE",
});
export const OBJECT = registerKeyword({
  name: "OBJECT",
});
export const BLOB = registerKeyword({
  name: "BLOB",
  categories: [LOB],
});
export const CLOB = registerKeyword({
  name: "CLOB",
  categories: [LOB],
});
export const DBCLOB = registerKeyword({
  name: "DBCLOB",
  categories: [LOB],
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

/**
 * Characters which start a preprocessor directive.
 * Used as start/stop points for the token statement
 */
export const PPSignifier = [Percent, INCLUDE_ALT, SQL];

export const terminals = [
  WS,
  ExecFragment,
  ID,
  NUMBER,
  STRING_TERM,
  ML_COMMENT,
  SL_COMMENT,
];

export const operators = [
  INCLUDE_ALT,
  PipePipeEquals,
  StarStarEquals,
  PlusEquals,
  MinusEquals,
  StarEquals,
  SlashEquals,
  PipeEquals,
  AmpersandEquals,
  NotEquals,
  LessThanGreaterThan,
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
  ...operators,
  ID,
  NUMBER,
  STRING_TERM,
  ML_COMMENT,
  SL_COMMENT,
];

export const LexerInstance = new Lexer(all);
