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
import { TokenType, Lexer } from "chevrotain";
import * as ast from "../../syntax-tree/ast";
import { createToken } from "../token-type-factory";
import {
  registerCombination,
  KeywordType,
  controlTokens,
  registerOperator,
  createKeywordRegistry,
} from "./shared";

const { registerKeyword, keywordMap, keywords } = createKeywordRegistry();
export { keywordMap, keywords };

// used for ANY attribute (used for builtin procedures with parameters of any type)
export const DataTypes = registerCombination<ast.DataType>("DataTypes");

// Combination tokens (parser optimization)
export const DefineOrdinalAttribute =
  registerCombination<ast.DefineOrdinalAttribute>("DefineOrdinalAttribute");
export const ScanMode = registerCombination<ast.ScanMode>("ScanMode");
export const ProcedureOrder =
  registerCombination<ast.ProcedureOrder>("ProcedureOrder");
export const LinkageOption =
  registerCombination<ast.LinkageOption>("LinkageOption");
export const NoMapOption = registerCombination<ast.NoMapOption>("NoMapOption");
export const SimpleOptions =
  registerCombination<ast.SimpleOptions>("SimpleOptions");
export const Organization =
  registerCombination<ast.Organization>("Organization");
export const DefaultAttribute =
  registerCombination<ast.DefaultAttribute>("DefaultAttribute");
export const DefaultAttributeBinaryOperator =
  registerCombination<ast.DefaultAttributeBinaryOperator>(
    "DefaultAttributeBinaryOperator",
  );
export const BinaryOperator =
  registerCombination<ast.BinaryOperator>("BinaryOperator");
export const UnaryOperator =
  registerCombination<ast.UnaryOperator>("UnaryOperator");
export const ScopeAttribute =
  registerCombination<ast.ScopeAttribute>("ScopeAttribute");
export const AllocateAttributeType =
  registerCombination<ast.AllocateAttributeType>("AllocateAttributeType");
export const AssignmentOperator =
  registerCombination<ast.AssignmentOperator>("AssignmentOperator");
export const KeywordConditions =
  registerCombination<ast.KeywordConditions>("KeywordConditions");
export const FileReferenceConditions =
  registerCombination<ast.FileReferenceConditions>("FileReferenceConditions");
export const PutAttribute =
  registerCombination<ast.PutAttribute>("PutAttribute");
export const Varying = registerCombination<ast.Varying>("Varying");
export const CharType = registerCombination<ast.CharType>("Char");
export const ReadStatementType =
  registerCombination<ast.ReadStatementType>("ReadStatementType");
export const WriteStatementType =
  registerCombination<ast.WriteStatementType>("WriteStatementType");
export const RewriteStatementType =
  registerCombination<ast.RewriteStatementType>("RewriteStatementType");
export const BooleanType = registerCombination<ast.BooleanType>("BooleanType");
export const LocateType = registerCombination<ast.LocateType>("LocateType");
export const OpenOptionType =
  registerCombination<ast.OpenOptionType>("OpenOptionType");
export const VX = registerCombination<ast.VX>("VX");
export const TypeOrOrdinal =
  registerCombination<ast.TypeOrOrdinal>("TypeOrOrdinal");
export const BinaryType =
  registerCombination<ast.SqlAttributeBinaryType>("BinaryType");
export const LOB = registerCombination<ast.LOB>("LOB");
export const LOBLocator = registerCombination<ast.LOBLocator>("LOBLocator");
export const LOBFile = registerCombination<ast.SQLAttributeLobType>("LOBFile");
export const LOBSize = registerCombination<ast.SQLAttributeLobSize>("LOBSize");
export const CicsResponseCode =
  registerCombination<ast.CicsResponseCode>("CicsResponseCode");
export const RecordFormat =
  registerCombination<ast.RecordFormat>("RecordFormat");
export const EnvironmentOptionSymbolName =
  registerCombination<ast.EnvironmentOptionSymbolName>(
    "EnvironmentOptionSymbolName",
  );
export const EnvironmentOptionValueName =
  registerCombination<ast.EnvironmentOptionValueName>(
    "EnvironmentOptionValueName",
  );
/**
 * Combines the given token types into a lookup table for fast lookaheads.
 */

export function combine(...tokenTypes: TokenType[]): boolean[] {
  const result: boolean[] = [];
  for (const token of tokenTypes) {
    const id = token.tokenTypeIdx ?? -1;
    if (id >= 0) {
      result[id] = true;
    }
    if (token.categoryMatches) {
      for (const category of token.categoryMatches) {
        result[category] = true;
      }
    }
  }
  return result;
}
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
/**
 * Finds the end of an `EXEC SQL`/`EXEC CICS` statement body starting at `from`: the index
 * of the terminating `;` (or `text.length` if none follows). Skips PL/I-style quoted
 * strings - `'...'` and `"..."`, each escaped by doubling its own quote (`''`/`""`) and
 * never spanning a line break - so a `;` inside a string literal doesn't end the statement.
 * This mirrors the quote handling of the authoritative `scanExecFragments`/`findTerminator`
 * scan in `preprocessor-api` (both the CICS and DB2 delimiter configs use exactly these
 * quotes), keeping the token extent the tokenizer produces in sync with the range the
 * preprocessor later replaces. The embedded language's *comment* syntax (`--`, `*>`, ...)
 * is language-specific and not knowable at the tokenizer level, so a `;` inside such a
 * comment still (wrongly) ends the fragment here - an accepted residual mismatch.
 */
export function findExecFragmentEnd(text: string, from: number): number {
  let i = from;
  while (i < text.length) {
    const ch = text[i];
    if (ch === ";") {
      return i;
    }
    if (ch === "'" || ch === '"') {
      i++;
      while (i < text.length && text[i] !== "\n" && text[i] !== "\r") {
        if (text[i] === ch) {
          if (text[i + 1] === ch) {
            i += 2; // doubled-quote escape (`''`/`""`) - still inside the string
            continue;
          }
          i++; // closing quote
          break;
        }
        i++;
      }
      // An unterminated quote stops at the line break (or EOF), matching
      // `skipDelimited` in preprocessor-api's `context-utils.ts`.
      continue;
    }
    i++;
  }
  return text.length;
}

export const ExecFragment = createToken({
  name: "ExecFragment",
  line_breaks: true,
  start_chars_hint: ["C", "c", "S", "s"],
  pattern: (text, offset) => {
    // Prefix word after `EXEC`, then everything up to the terminating `;` - via
    // `findExecFragmentEnd`, so a `;` inside a quoted string doesn't end the statement
    // and an empty statement body (`EXEC SQL;`) still yields a fragment. Kept in sync
    // with the hand-written scan in `tokenizer/shared.ts` (`tokenizeIdentifier`).
    const regex = /(?<=EXEC\s*)[a-z]+/iy;
    regex.lastIndex = offset;
    const match = regex.exec(text);
    if (!match) {
      return null;
    }
    const end = findExecFragmentEnd(text, offset + match[0].length);
    return [text.substring(offset, end)];
  },
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
  group: "comments",
});
export const SL_COMMENT = createToken({
  name: "SL_COMMENT",
  pattern: /\/\/[^\n\r]*/y,
  group: "comments",
});
// Start of keywords
// Helper keywords outside of the PL/I specification
/**
 * Not part of the PL/I specification!
 * Helps declaring parameters of any type for builtin procedures
 */
export const ANY = registerKeyword({
  name: "ANY",
});
export const ARITHMETIC = registerKeyword({
  name: "ARITHMETIC",
  categories: [[DataTypes, ast.DataType.Arithmetic]],
});
export const NUMBER_KEYWORD = registerKeyword({
  name: "NUMBER",
  categories: [[DataTypes, ast.DataType.Arithmetic]],
});
export const UNKNOWN = registerKeyword({
  name: "UNKNOWN",
  categories: [[DataTypes, ast.DataType.Unknown]],
});

// Normal keywords
export const SUBSCRIPTRANGE = registerKeyword({
  name: "SUBSCRIPTRANGE",
  categories: [[KeywordConditions, ast.KeywordConditions.SUBSCRIPTRANGE]],
});
export const NOCHARGRAPHIC = registerKeyword({
  name: "NOCHARGRAPHIC",
  categories: [[SimpleOptions, ast.SimpleOptions.NOCHARGRAPHIC]],
});
export const NONASSIGNABLE = registerKeyword({
  name: ["NONASSIGNABLE", "NONASGN"],
  categories: [[DefaultAttribute, ast.DefaultAttribute.NONASSIGNABLE]],
});
export const FIXEDOVERFLOW = registerKeyword({
  name: ["FIXEDOVERFLOW", "FOFL"],
  categories: [[KeywordConditions, ast.KeywordConditions.FIXEDOVERFLOW]],
});
export const UNDEFINEDFILE = registerKeyword({
  name: ["UNDEFINEDFILE", "UNDF"],
  categories: [
    [FileReferenceConditions, ast.FileReferenceConditions.UNDEFINEDFILE],
  ],
});
export const VALUELISTFROM = registerKeyword({
  name: "VALUELISTFROM",
});
export const NODESCRIPTOR = registerKeyword({
  name: "NODESCRIPTOR",
  categories: [[SimpleOptions, ast.SimpleOptions.NODESCRIPTOR]],
});
export const NONCONNECTED = registerKeyword({
  name: "NONCONNECTED",
  categories: [[DefaultAttribute, ast.DefaultAttribute.NONCONNECTED]],
});
export const LITTLEENDIAN = registerKeyword({
  name: "LITTLEENDIAN",
  categories: [[DefaultAttribute, ast.DefaultAttribute.LITTLEENDIAN]],
});
export const ANYCONDITION = registerKeyword({
  name: ["ANYCONDITION", "ANYCOND"],
  categories: [[KeywordConditions, ast.KeywordConditions.ANYCONDITION]],
});
export const CHARGRAPHIC = registerKeyword({
  name: "CHARGRAPHIC",
  categories: [
    [SimpleOptions, ast.SimpleOptions.CHARGRAPHIC],
    [DefaultAttribute, ast.DefaultAttribute.CHARGRAPHIC],
  ],
});
export const IRREDUCIBLE = registerKeyword({
  name: ["IRREDUCIBLE", "IRRED"],
  categories: [
    [SimpleOptions, ast.SimpleOptions.IRREDUCIBLE],
    [DefaultAttribute, ast.DefaultAttribute.IRREDUCIBLE],
  ],
});
export const DLLINTERNAL = registerKeyword({
  name: "DLLINTERNAL",
  categories: [[SimpleOptions, ast.SimpleOptions.DLLINTERNAL]],
});
export const UNREACHABLE = registerKeyword({
  name: "UNREACHABLE",
});
export const ENVIRONMENT = registerKeyword({
  name: ["ENVIRONMENT", "ENV"],
});
export const BUFND = registerKeyword({
  name: "BUFND",
  categories: [
    [EnvironmentOptionValueName, ast.EnvironmentOptionValueName.BUFND],
  ],
});
export const BUFNI = registerKeyword({
  name: "BUFNI",
  categories: [
    [EnvironmentOptionValueName, ast.EnvironmentOptionValueName.BUFNI],
  ],
});
export const BUFSP = registerKeyword({
  name: "BUFSP",
  categories: [
    [EnvironmentOptionValueName, ast.EnvironmentOptionValueName.BUFSP],
  ],
});
export const BLKSIZE = registerKeyword({
  name: "BLKSIZE",
  categories: [
    [EnvironmentOptionValueName, ast.EnvironmentOptionValueName.BLKSIZE],
  ],
});
export const BUFFERS = registerKeyword({
  name: "BUFFERS",
  categories: [
    [EnvironmentOptionValueName, ast.EnvironmentOptionValueName.BUFFERS],
  ],
});
export const RECSIZE = registerKeyword({
  name: "RECSIZE",
  categories: [
    [EnvironmentOptionValueName, ast.EnvironmentOptionValueName.RECSIZE],
  ],
});
export const KEYLOC = registerKeyword({
  name: "KEYLOC",
  categories: [
    [EnvironmentOptionValueName, ast.EnvironmentOptionValueName.KEYLOC],
  ],
});
export const PASSWORD = registerKeyword({
  name: "PASSWORD",
  categories: [
    [EnvironmentOptionValueName, ast.EnvironmentOptionValueName.PASSWORD],
  ],
});
export const REGIONAL = registerKeyword({
  name: "REGIONAL",
  categories: [
    [EnvironmentOptionValueName, ast.EnvironmentOptionValueName.REGIONAL],
  ],
});
export const ORGANIZATION = registerKeyword({
  name: "ORGANIZATION",
});
export const BKWD = registerKeyword({
  name: "BKWD",
  categories: [
    [EnvironmentOptionSymbolName, ast.EnvironmentOptionSymbolName.BKWD],
  ],
});
export const TOTAL = registerKeyword({
  name: "TOTAL",
  categories: [
    [EnvironmentOptionSymbolName, ast.EnvironmentOptionSymbolName.TOTAL],
  ],
});
export const GENKEY = registerKeyword({
  name: "GENKEY",
  categories: [
    [EnvironmentOptionSymbolName, ast.EnvironmentOptionSymbolName.GENKEY],
  ],
});
export const REUSE = registerKeyword({
  name: "REUSE",
  categories: [
    [EnvironmentOptionSymbolName, ast.EnvironmentOptionSymbolName.REUSE],
  ],
});
export const VSAM = registerKeyword({
  name: "VSAM",
  categories: [
    [EnvironmentOptionSymbolName, ast.EnvironmentOptionSymbolName.VSAM],
  ],
});
export const SCALARVARYING = registerKeyword({
  name: "SCALARVARYING",
  categories: [
    [
      EnvironmentOptionSymbolName,
      ast.EnvironmentOptionSymbolName.SCALARVARYING,
    ],
  ],
});
export const REREAD = registerKeyword({
  name: "REREAD",
  categories: [
    [EnvironmentOptionSymbolName, ast.EnvironmentOptionSymbolName.REREAD],
  ],
});
export const CTLASA = registerKeyword({
  name: "CTLASA",
  categories: [
    [EnvironmentOptionSymbolName, ast.EnvironmentOptionSymbolName.CTLASA],
  ],
});
export const CTL360 = registerKeyword({
  name: "CTL360",
  categories: [
    [EnvironmentOptionSymbolName, ast.EnvironmentOptionSymbolName.CTL360],
  ],
});
export const CONSECUTIVE = registerKeyword({
  name: "CONSECUTIVE",
  categories: [
    [Organization, ast.Organization.Consecutive],
    [Organization, ast.EnvironmentOptionSymbolName.CONSECUTIVE],
  ],
});
export const INDEXED = registerKeyword({
  name: "INDEXED",
  categories: [
    [Organization, ast.Organization.Indexed],
    [EnvironmentOptionSymbolName, ast.EnvironmentOptionSymbolName.INDEXED],
  ],
});
export const RELATIVE = registerKeyword({
  name: "RELATIVE",
  categories: [[Organization, ast.Organization.Relative]],
});
export const DESCRIPTORS = registerKeyword({
  name: "DESCRIPTORS",
});
export const CONFORMANCE = registerKeyword({
  name: "CONFORMANCE",
  categories: [[KeywordConditions, ast.KeywordConditions.CONFORMANCE]],
});
export const STRINGRANGE = registerKeyword({
  name: "STRINGRANGE",
  categories: [[KeywordConditions, ast.KeywordConditions.STRINGRANGE]],
});
export const DESCRIPTOR = registerKeyword({
  name: "DESCRIPTOR",
  categories: [[SimpleOptions, ast.SimpleOptions.DESCRIPTOR]],
});
export const XMLCONTENT = registerKeyword({
  name: "XMLCONTENT",
  categories: [[DefaultAttribute, ast.DefaultAttribute.XMLCONTENT]],
});
export const JSONIGNORE = registerKeyword({
  name: "JSONIGNORE",
  categories: [[DefaultAttribute, ast.DefaultAttribute.JSONIGNORE]],
});
export const ASSIGNABLE = registerKeyword({
  name: "ASSIGNABLE",
  categories: [[DefaultAttribute, ast.DefaultAttribute.ASSIGNABLE]],
});
export const CONTROLLED = registerKeyword({
  name: ["CONTROLLED", "CTL"],
  categories: [[DefaultAttribute, ast.DefaultAttribute.CONTROLLED]],
});
export const NONVARYING = registerKeyword({
  name: ["NONVARYING", "NONVAR"],
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.NONVARYING],
    [Varying, ast.Varying.NONVARYING],
  ],
});
export const SEQUENTIAL = registerKeyword({
  name: ["SEQUENTIAL", "SEQL"],
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.SEQUENTIAL],
    [OpenOptionType, ast.OpenOptionType.SEQUENTIAL],
  ],
});
export const CONVERSION = registerKeyword({
  name: ["CONVERSION"],
  categories: [[KeywordConditions, ast.KeywordConditions.CONVERSION]],
});
export const STRINGSIZE = registerKeyword({
  name: "STRINGSIZE",
  categories: [[KeywordConditions, ast.KeywordConditions.STRINGSIZE]],
});
export const ZERODIVIDE = registerKeyword({
  name: ["ZERODIVIDE", "ZDIV"],
  categories: [[KeywordConditions, ast.KeywordConditions.ZERODIVIDE]],
});
export const INITACROSS = registerKeyword({
  name: "INITACROSS",
});
export const VALUERANGE = registerKeyword({
  name: "VALUERANGE",
});
export const XMLIGNORE = registerKeyword({
  name: "XMLIGNORE",
  categories: [[DefaultAttribute, ast.DefaultAttribute.XMLIGNORE]],
});
export const JSONTRIMR = registerKeyword({
  name: "JSONTRIMR",
  categories: [[DefaultAttribute, ast.DefaultAttribute.JSONTRIMR]],
});
export const NOEXECOPS = registerKeyword({
  name: "NOEXECOPS",
  categories: [[SimpleOptions, ast.SimpleOptions.NOEXECOPS]],
});
export const DEACTIVATE = registerKeyword({
  name: ["DEACTIVATE", "DEACT"],
});
export const REDUCIBLE = registerKeyword({
  name: ["REDUCIBLE", "RED"],
  categories: [
    [SimpleOptions, ast.SimpleOptions.REDUCIBLE],
    [DefaultAttribute, ast.DefaultAttribute.REDUCIBLE],
  ],
});
export const REENTRANT = registerKeyword({
  name: "REENTRANT",
  categories: [[SimpleOptions, ast.SimpleOptions.REENTRANT]],
});
export const FETCHABLE = registerKeyword({
  name: "FETCHABLE",
  categories: [[SimpleOptions, ast.SimpleOptions.FETCHABLE]],
});
export const FROMALIEN = registerKeyword({
  name: "FROMALIEN",
  categories: [[SimpleOptions, ast.SimpleOptions.FROMALIEN]],
});
export const ASSEMBLER = registerKeyword({
  name: ["ASSEMBLER", "ASM"],
  categories: [[SimpleOptions, ast.SimpleOptions.ASSEMBLER]],
});
export const RECURSIVE = registerKeyword({
  name: "RECURSIVE",
  categories: [[SimpleOptions, ast.SimpleOptions.RECURSIVE]],
});
export const PROCEDURE = registerKeyword({
  name: ["PROCEDURE", "PROC", "XPROCEDURE", "XPROC"],
});
export const STATEMENT = registerKeyword({
  name: ["STATEMENT", "STMT"],
});
export const CHARACTER = registerKeyword({
  name: ["CHARACTER", "CHAR"],
  categories: [
    [DataTypes, ast.DataType.String],
    [DefaultAttribute, ast.DefaultAttribute.CHARACTER],
    [AllocateAttributeType, ast.AllocateAttributeType.CHARACTER],
    [CharType, ast.CharType.CHARACTER],
  ],
});
export const DIMACROSS = registerKeyword({
  name: "DIMACROSS",
  categories: [[DefaultAttribute, ast.DefaultAttribute.DIMACROSS]],
});
export const AUTOMATIC = registerKeyword({
  name: ["AUTOMATIC", "AUTO"],
  categories: [[DefaultAttribute, ast.DefaultAttribute.AUTOMATIC]],
});
export const BACKWARDS = registerKeyword({
  name: "BACKWARDS",
  categories: [[DefaultAttribute, ast.DefaultAttribute.BACKWARDS]],
});
export const CONDITION = registerKeyword({
  name: ["CONDITION", "COND"],
  categories: [[DefaultAttribute, ast.DefaultAttribute.CONDITION]],
});
export const CONNECTED = registerKeyword({
  name: "CONNECTED",
  categories: [[DefaultAttribute, ast.DefaultAttribute.CONNECTED]],
});
export const EXCLUSIVE = registerKeyword({
  name: "EXCLUSIVE",
  categories: [[DefaultAttribute, ast.DefaultAttribute.EXCLUSIVE]],
});
export const NONNATIVE = registerKeyword({
  name: "NONNATIVE",
  categories: [[DefaultAttribute, ast.DefaultAttribute.NONNATIVE]],
});
export const PARAMETER = registerKeyword({
  name: "PARAMETER",
  categories: [[DefaultAttribute, ast.DefaultAttribute.PARAMETER]],
});
export const PRECISION = registerKeyword({
  name: ["PRECISION", "PREC"],
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.PRECISION],
    [DefineOrdinalAttribute, ast.DefineOrdinalAttribute.PRECISION],
  ],
});
export const STRUCTURE = registerKeyword({
  name: ["STRUCTURE", "STRUCT"],
  categories: [
    [DataTypes, ast.DataType.Structure],
    [DefaultAttribute, ast.DefaultAttribute.STRUCTURE],
  ],
});
export const TRANSIENT = registerKeyword({
  name: "TRANSIENT",
  categories: [[DefaultAttribute, ast.DefaultAttribute.TRANSIENT]],
});
export const UNALIGNED = registerKeyword({
  name: ["UNALIGNED", "UNAL"],
  categories: [[DefaultAttribute, ast.DefaultAttribute.UNALIGNED]],
});
export const BIGENDIAN = registerKeyword({
  name: "BIGENDIAN",
  categories: [[DefaultAttribute, ast.DefaultAttribute.BIGENDIAN]],
});
export const ASSERTION = registerKeyword({
  name: "ASSERTION",
  categories: [[KeywordConditions, ast.KeywordConditions.ASSERTION]],
});
export const ATTENTION = registerKeyword({
  name: "ATTENTION",
  categories: [[KeywordConditions, ast.KeywordConditions.ATTENTION]],
});
export const INVALIDOP = registerKeyword({
  name: "INVALIDOP",
  categories: [[KeywordConditions, ast.KeywordConditions.INVALIDOP]],
});
export const UNDERFLOW = registerKeyword({
  name: ["UNDERFLOW", "UFL"],
  categories: [[KeywordConditions, ast.KeywordConditions.UNDERFLOW]],
});
export const OTHERWISE = registerKeyword({
  name: ["OTHERWISE", "OTHER"],
  type: KeywordType.Control,
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
  categories: [[DefaultAttribute, ast.DefaultAttribute.JSONNAME]],
});
export const JSONNULL = registerKeyword({
  name: "JSONNULL",
  categories: [[DefaultAttribute, ast.DefaultAttribute.JSONNULL]],
});
export const JSONOMIT = registerKeyword({
  name: "JSONOMIT",
  categories: [[DefaultAttribute, ast.DefaultAttribute.JSONOMIT]],
});
export const NOMAPOUT = registerKeyword({
  name: "NOMAPOUT",
  categories: [[NoMapOption, ast.NoMapOption.NOMAPOUT]],
});
export const NOINLINE = registerKeyword({
  name: "NOINLINE",
  categories: [[SimpleOptions, ast.SimpleOptions.NOINLINE]],
});
export const NORETURN = registerKeyword({
  name: "NORETURN",
  categories: [[SimpleOptions, ast.SimpleOptions.NORETURN]],
});
export const EXTERNAL = registerKeyword({
  name: ["EXTERNAL", "EXT"],
  categories: [[DefaultAttribute, ast.DefaultAttribute.EXTERNAL]],
});
export const VARIABLE = registerKeyword({
  name: "VARIABLE",
  categories: [[DefaultAttribute, ast.DefaultAttribute.VARIABLE]],
});
export const ALLOCATE = registerKeyword({
  name: ["ALLOCATE", "ALLOC"],
});
export const WIDECHAR = registerKeyword({
  name: ["WIDECHAR", "WCHAR"],
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.WIDECHAR],
    [AllocateAttributeType, ast.AllocateAttributeType.WIDECHAR],
    [CharType, ast.CharType.WIDECHAR],
  ],
});
export const ABNORMAL = registerKeyword({
  name: "ABNORMAL",
  categories: [[DefaultAttribute, ast.DefaultAttribute.ABNORMAL]],
});
export const BUFFERED = registerKeyword({
  name: ["BUFFERED", "BUF"],
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.BUFFERED],
    [OpenOptionType, ast.OpenOptionType.BUFFERED],
  ],
});
export const UNBUFFERED = registerKeyword({
  name: ["UNBUFFERED", "UNBUF"],
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.UNBUFFERED],
    [OpenOptionType, ast.OpenOptionType.UNBUFFERED],
  ],
});
export const CONSTANT = registerKeyword({
  name: "CONSTANT",
  categories: [[DefaultAttribute, ast.DefaultAttribute.CONSTANT]],
});
export const INTERNAL = registerKeyword({
  name: "INTERNAL",
  categories: [[DefaultAttribute, ast.DefaultAttribute.INTERNAL]],
});
export const OPTIONAL = registerKeyword({
  name: "OPTIONAL",
  categories: [[DefaultAttribute, ast.DefaultAttribute.OPTIONAL]],
});
export const POSITION = registerKeyword({
  name: ["POSITION", "POS"],
  categories: [[DefaultAttribute, ast.DefaultAttribute.POSITION]],
});
export const RESERVED = registerKeyword({
  name: "RESERVED",
});
// Only used in the RESERVED attribute
export const IMPORTED = registerKeyword({
  name: "IMPORTED",
});
export const UNSIGNED = registerKeyword({
  name: "UNSIGNED",
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.UNSIGNED],
    [DefineOrdinalAttribute, ast.DefineOrdinalAttribute.UNSIGNED],
  ],
});
export const VARYING4 = registerKeyword({
  name: "VARYING4",
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.VARYING4],
    [Varying, ast.Varying.VARYING4],
  ],
});
export const VARYINGZ = registerKeyword({
  name: ["VARYINGZ", "VARZ"],
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.VARYINGZ],
    [Varying, ast.Varying.VARYINGZ],
  ],
});
export const DOWNTHRU = registerKeyword({
  name: "DOWNTHRU",
});
export const INCLUDE = registerKeyword({
  name: ["INCLUDE", "XINCLUDE"],
  type: KeywordType.Control,
});
export const INCLUDE_ALT = createToken({
  name: "INCLUDE_ALT",
  pattern: Lexer.NA,
});
// Manually adding the INCLUDE_ALT token here, due to special semantics
controlTokens.add(INCLUDE_ALT);
export const INSCAN = registerKeyword({
  name: ["INSCAN", "XINSCAN"],
  type: KeywordType.Control,
});
export const REPLACE = registerKeyword({
  name: "REPLACE",
});
export const NOPRINT = registerKeyword({
  name: "NOPRINT",
});
export const OVERFLOW = registerKeyword({
  name: ["OVERFLOW", "OFL"],
  categories: [[KeywordConditions, ast.KeywordConditions.OVERFLOW]],
});
export const TRANSMIT = registerKeyword({
  name: "TRANSMIT",
  categories: [[FileReferenceConditions, ast.FileReferenceConditions.TRANSMIT]],
});
export const LINESIZE = registerKeyword({
  name: "LINESIZE",
  categories: [[OpenOptionType, ast.OpenOptionType.LINESIZE]],
});
export const PAGESIZE = registerKeyword({
  name: "PAGESIZE",
  categories: [[OpenOptionType, ast.OpenOptionType.PAGESIZE]],
});
export const NULLINIT = registerKeyword({
  name: "NULLINIT",
  categories: [[DefaultAttribute, ast.DefaultAttribute.NULLINIT]],
});
export const PROCESS = registerKeyword({
  name: "PROCESS",
  type: KeywordType.Control,
});
export const PROCINC = registerKeyword({
  name: "PROCINC",
});
export const XMLNAME = registerKeyword({
  name: "XMLNAME",
  categories: [[DefaultAttribute, ast.DefaultAttribute.XMLNAME]],
});
export const XMLATTR = registerKeyword({
  name: "XMLATTR",
  categories: [[DefaultAttribute, ast.DefaultAttribute.XMLATTR]],
});
export const XMLOMIT = registerKeyword({
  name: "XMLOMIT",
  categories: [[DefaultAttribute, ast.DefaultAttribute.XMLOMIT]],
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
  categories: [[DefaultAttribute, ast.DefaultAttribute.OPTIONS]],
});
export const LINKAGE = registerKeyword({
  name: "LINKAGE",
});
export const OPTLINK = registerKeyword({
  name: "OPTLINK",
  categories: [[LinkageOption, ast.LinkageOption.OPTLINK]],
});
export const STDCALL = registerKeyword({
  name: "STDCALL",
  categories: [[LinkageOption, ast.LinkageOption.STDCALL]],
});
export const NOMAPIN = registerKeyword({
  name: "NOMAPIN",
  categories: [[NoMapOption, ast.NoMapOption.NOMAPIN]],
});
export const FORTRAN = registerKeyword({
  name: "FORTRAN",
  categories: [[SimpleOptions, ast.SimpleOptions.FORTRAN]],
});
export const BYVALUE = registerKeyword({
  name: "BYVALUE",
  categories: [
    [SimpleOptions, ast.SimpleOptions.BYVALUE],
    [DefaultAttribute, ast.DefaultAttribute.BYVALUE],
  ],
});
export const AMODE31 = registerKeyword({
  name: "AMODE31",
  categories: [[SimpleOptions, ast.SimpleOptions.AMODE31]],
});
export const AMODE64 = registerKeyword({
  name: "AMODE64",
  categories: [[SimpleOptions, ast.SimpleOptions.AMODE64]],
});
export const RETCODE = registerKeyword({
  name: "RETCODE",
  categories: [[SimpleOptions, ast.SimpleOptions.RETCODE]],
});
export const WINMAIN = registerKeyword({
  name: "WINMAIN",
  categories: [[SimpleOptions, ast.SimpleOptions.WINMAIN]],
});
export const DYNAMIC = registerKeyword({
  name: "DYNAMIC",
  categories: [[ScopeAttribute, ast.ScopeAttribute.DYNAMIC]],
});
export const LIMITED = registerKeyword({
  name: "LIMITED",
});
export const GRAPHIC = registerKeyword({
  name: "GRAPHIC",
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.GRAPHIC],
    [AllocateAttributeType, ast.AllocateAttributeType.GRAPHIC],
    [EnvironmentOptionSymbolName, ast.EnvironmentOptionSymbolName.GRAPHIC],
  ],
});
export const COMPARE = registerKeyword({
  name: "COMPARE",
});
export const DEFAULT = registerKeyword({
  name: ["DEFAULT", "DFT"],
});
export const ALIGNED = registerKeyword({
  name: "ALIGNED",
  categories: [[DefaultAttribute, ast.DefaultAttribute.ALIGNED]],
});
export const BUILTIN = registerKeyword({
  name: "BUILTIN",
  categories: [[DefaultAttribute, ast.DefaultAttribute.BUILTIN]],
});
export const COMPLEX = registerKeyword({
  name: "COMPLEX",
  categories: [[DefaultAttribute, ast.DefaultAttribute.COMPLEX]],
});
export const DECIMAL = registerKeyword({
  name: ["DECIMAL", "DEC"],
  categories: [[DefaultAttribute, ast.DefaultAttribute.DECIMAL]],
});
export const GENERIC = registerKeyword({
  name: "GENERIC",
});
export const HEXADEC = registerKeyword({
  name: "HEXADEC",
  categories: [[DefaultAttribute, ast.DefaultAttribute.HEXADEC]],
});
export const OUTONLY = registerKeyword({
  name: "OUTONLY",
  categories: [[DefaultAttribute, ast.DefaultAttribute.OUTONLY]],
});
export const POINTER = registerKeyword({
  name: ["POINTER", "PTR"],
  categories: [[DefaultAttribute, ast.DefaultAttribute.POINTER]],
});
export const VARYING = registerKeyword({
  name: ["VARYING", "VAR"],
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.VARYING],
    [Varying, ast.Varying.VARYING],
  ],
});
export const ORDINAL = registerKeyword({
  name: "ORDINAL",
  categories: [
    [DataTypes, ast.DataType.Ordinal],
    [TypeOrOrdinal, ast.TypeOrOrdinal.ORDINAL],
  ],
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
  categories: [[DefaultAttribute, ast.DefaultAttribute.NORESCAN]],
});
export const KEYFROM = registerKeyword({
  name: "KEYFROM",
  categories: [
    [WriteStatementType, ast.WriteStatementType.KEYFROM],
    [LocateType, ast.LocateType.KEYFROM],
  ],
});
export const STORAGE = registerKeyword({
  name: "STORAGE",
  categories: [[KeywordConditions, ast.KeywordConditions.STORAGE]],
});
export const ENDFILE = registerKeyword({
  name: "ENDFILE",
  categories: [
    [FileReferenceConditions, ast.FileReferenceConditions.ENDFILE],
    [CicsResponseCode, ast.CicsResponseCode.ENDFILE],
  ],
});
export const ENDPAGE = registerKeyword({
  name: "ENDPAGE",
  categories: [[FileReferenceConditions, ast.FileReferenceConditions.ENDPAGE]],
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
  categories: [[DataTypes, ast.DataType.Picture]],
});
export const WIDEPIC = registerKeyword({
  name: "WIDEPIC",
});
export const RETURNS = registerKeyword({
  name: "RETURNS",
});
export const SYSTEM = registerKeyword({
  name: "SYSTEM",
  categories: [[LinkageOption, ast.LinkageOption.SYSTEM]],
});
export const INLINE = registerKeyword({
  name: "INLINE",
  categories: [[SimpleOptions, ast.SimpleOptions.INLINE]],
});
export const BYADDR = registerKeyword({
  name: "BYADDR",
  categories: [
    [SimpleOptions, ast.SimpleOptions.BYADDR],
    [DefaultAttribute, ast.DefaultAttribute.BYADDR],
  ],
});
export const STATIC = registerKeyword({
  name: "STATIC",
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.STATIC],
    [ScopeAttribute, ast.ScopeAttribute.STATIC],
  ],
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
  name: ["BINARY", "BIN"],
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.BINARY],
    [BinaryType, ast.SqlAttributeBinaryType.BINARY],
  ],
});
export const VARBINARY = registerKeyword({
  name: "VARBINARY",
  categories: [[BinaryType, ast.SqlAttributeBinaryType.VARBINARY]],
});
export const FORMAT = registerKeyword({
  name: "FORMAT",
  categories: [
    [DataTypes, ast.DataType.Format],
    [DefaultAttribute, ast.DefaultAttribute.FORMAT],
  ],
});
export const NOINIT = registerKeyword({
  name: "NOINIT",
  categories: [[DefaultAttribute, ast.DefaultAttribute.NOINIT]],
});
export const INONLY = registerKeyword({
  name: "INONLY",
  categories: [[DefaultAttribute, ast.DefaultAttribute.INONLY]],
});
export const INDFOR = registerKeyword({
  name: "INDFOR",
});
export const MEMBER = registerKeyword({
  name: "MEMBER",
  categories: [[DefaultAttribute, ast.DefaultAttribute.MEMBER]],
});
export const NATIVE = registerKeyword({
  name: "NATIVE",
  categories: [[DefaultAttribute, ast.DefaultAttribute.NATIVE]],
});
export const NORMAL = registerKeyword({
  name: "NORMAL",
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.NORMAL],
    [CicsResponseCode, ast.CicsResponseCode.NORMAL],
  ],
});
export const OFFSET = registerKeyword({
  name: "OFFSET",
  categories: [[DefaultAttribute, ast.DefaultAttribute.OFFSET]],
});
export const OUTPUT = registerKeyword({
  name: "OUTPUT",
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.OUTPUT],
    [OpenOptionType, ast.OpenOptionType.OUTPUT],
  ],
});
export const RECORD = registerKeyword({
  name: "RECORD",
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.RECORD],
    [FileReferenceConditions, ast.FileReferenceConditions.RECORD],
    [OpenOptionType, ast.OpenOptionType.RECORD],
  ],
});
export const SIGNED = registerKeyword({
  name: "SIGNED",
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.SIGNED],
    [DefineOrdinalAttribute, ast.DefineOrdinalAttribute.SIGNED],
  ],
});
export const STREAM = registerKeyword({
  name: "STREAM",
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.STREAM],
    [OpenOptionType, ast.OpenOptionType.STREAM],
  ],
});
export const UPDATE = registerKeyword({
  name: "UPDATE",
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.UPDATE],
    [OpenOptionType, ast.OpenOptionType.UPDATE],
  ],
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
  categories: [[DataTypes, ast.DataType.String]],
});
export const NOSCAN = registerKeyword({
  name: "NOSCAN",
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.NOSCAN],
    [ScanMode, ast.ScanMode.NOSCAN],
  ],
});
export const RESCAN = registerKeyword({
  name: "RESCAN",
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.RESCAN],
    [ScanMode, ast.ScanMode.RESCAN],
  ],
});
export const LOCATE = registerKeyword({
  name: "LOCATE",
});
export const FINISH = registerKeyword({
  name: "FINISH",
  categories: [[KeywordConditions, ast.KeywordConditions.FINISH]],
});
export const DIRECT = registerKeyword({
  name: "DIRECT",
  categories: [
    [OpenOptionType, ast.OpenOptionType.DIRECT],
    [DefaultAttribute, ast.DefaultAttribute.DIRECT],
  ],
});
export const IGNORE = registerKeyword({
  name: "IGNORE",
  categories: [[ReadStatementType, ast.ReadStatementType.IGNORE]],
});
export const REINIT = registerKeyword({
  name: "REINIT",
});
export const RETURN = registerKeyword({
  name: "RETURN",
  type: KeywordType.Control,
});
export const SELECT = registerKeyword({
  name: "SELECT",
  type: KeywordType.Control,
});
export const SIGNAL = registerKeyword({
  name: "SIGNAL",
});
export const HANDLE = registerKeyword({
  name: "HANDLE",
});
export const CDECL = registerKeyword({
  name: "CDECL",
  categories: [[LinkageOption, ast.LinkageOption.CDECL]],
});
export const CMPAT = registerKeyword({
  name: "CMPAT",
});
export const NOMAP = registerKeyword({
  name: "NOMAP",
  categories: [[NoMapOption, ast.NoMapOption.NOMAP]],
});
export const ORDER = registerKeyword({
  name: ["ORDER"],
  categories: [
    [SimpleOptions, ast.SimpleOptions.ORDER],
    [ProcedureOrder, ast.ProcedureOrder.ORDER],
  ],
});
export const REORDER = registerKeyword({
  name: ["REORDER"],
  categories: [
    [SimpleOptions, ast.SimpleOptions.REORDER],
    [ProcedureOrder, ast.ProcedureOrder.REORDER],
  ],
});
export const COBOL = registerKeyword({
  name: "COBOL",
  categories: [[SimpleOptions, ast.SimpleOptions.COBOL]],
});
export const INTER = registerKeyword({
  name: "INTER",
  categories: [[SimpleOptions, ast.SimpleOptions.INTER]],
});
export const ENTRY = registerKeyword({
  name: "ENTRY",
  categories: [[DataTypes, ast.DataType.Entry]],
});
export const UCHAR = registerKeyword({
  name: "UCHAR",
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.UCHAR],
    [AllocateAttributeType, ast.AllocateAttributeType.UCHAR],
    [CharType, ast.CharType.UCHAR],
  ],
});
export const FALSE = registerKeyword({
  name: "FALSE",
  categories: [[BooleanType, ast.BooleanType.FALSE]],
});
export const BEGIN = registerKeyword({
  name: "BEGIN",
  type: KeywordType.Control,
});
export const CLOSE = registerKeyword({
  name: "CLOSE",
});
export const RANGE = registerKeyword({
  name: "RANGE",
  categories: [[DefaultAttribute, ast.DefaultAttribute.RANGE]],
});
export const BASED = registerKeyword({
  name: "BASED",
  categories: [[DefaultAttribute, ast.DefaultAttribute.BASED]],
});
export const EVENT = registerKeyword({
  name: "EVENT",
  categories: [[DefaultAttribute, ast.DefaultAttribute.EVENT]],
});
export const FIXED = registerKeyword({
  name: "FIXED",
  categories: [[DefaultAttribute, ast.DefaultAttribute.FIXED]],
});
export const FLOAT = registerKeyword({
  name: "FLOAT",
  categories: [[DefaultAttribute, ast.DefaultAttribute.FLOAT]],
});
export const INOUT = registerKeyword({
  name: "INOUT",
  categories: [[DefaultAttribute, ast.DefaultAttribute.INOUT]],
});
export const INPUT = registerKeyword({
  name: "INPUT",
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.INPUT],
    [OpenOptionType, ast.OpenOptionType.INPUT],
  ],
});
export const KEYED = registerKeyword({
  name: "KEYED",
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.KEYED],
    [OpenOptionType, ast.OpenOptionType.KEYED],
  ],
});
export const LABEL = registerKeyword({
  name: "LABEL",
  categories: [
    [DataTypes, ast.DataType.Label],
    [DefaultAttribute, ast.DefaultAttribute.LABEL],
  ],
});
export const PRINT = registerKeyword({
  name: "PRINT",
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.PRINT],
    [OpenOptionType, ast.OpenOptionType.PRINT],
  ],
});
export const UNION = registerKeyword({
  name: "UNION",
  categories: [
    [DataTypes, ast.DataType.Union],
    [DefaultAttribute, ast.DefaultAttribute.UNION],
  ],
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
  type: KeywordType.Control,
});
export const UNTIL = registerKeyword({
  name: "UNTIL",
});
export const FETCH = registerKeyword({
  name: "FETCH",
});
export const TITLE = registerKeyword({
  name: "TITLE",
  categories: [[OpenOptionType, ast.OpenOptionType.TITLE]],
});
export const FLUSH = registerKeyword({
  name: "FLUSH",
});
export const LEAVE = registerKeyword({
  name: "LEAVE",
  categories: [
    [EnvironmentOptionSymbolName, ast.EnvironmentOptionSymbolName.LEAVE],
  ],
});
export const ERROR = registerKeyword({
  name: "ERROR",
  categories: [[KeywordConditions, ast.KeywordConditions.ERROR]],
});
export const PUSH = registerKeyword({
  name: "PUSH",
});
export const KEYTO = registerKeyword({
  name: "KEYTO",
  categories: [
    [ReadStatementType, ast.ReadStatementType.KEYTO],
    [WriteStatementType, ast.WriteStatementType.KEYTO],
  ],
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
  categories: [[SimpleOptions, ast.SimpleOptions.MAIN]],
});
export const RENT = registerKeyword({
  name: "RENT",
  categories: [[SimpleOptions, ast.SimpleOptions.RENT]],
});
export const AREA = registerKeyword({
  name: "AREA",
  categories: [
    [DataTypes, ast.DataType.Area],
    [DefaultAttribute, ast.DefaultAttribute.AREA],
    [AllocateAttributeType, ast.AllocateAttributeType.AREA],
    [KeywordConditions, ast.KeywordConditions.AREA],
  ],
});
export const TRUE = registerKeyword({
  name: "TRUE",
  categories: [[BooleanType, ast.BooleanType.TRUE]],
});
export const TEXT = registerKeyword({
  name: "TEXT",
});
export const NAME = registerKeyword({
  name: "NAME",
  categories: [[FileReferenceConditions, ast.FileReferenceConditions.NAME]],
});
export const CALL = registerKeyword({
  name: "CALL",
});
export const FILE = registerKeyword({
  name: "FILE",
  categories: [
    [DataTypes, ast.DataType.File],
    [DefaultAttribute, ast.DefaultAttribute.FILE],
    [PutAttribute, ast.PutAttribute.FILE],
    [ReadStatementType, ast.ReadStatementType.FILE],
    [WriteStatementType, ast.WriteStatementType.FILE],
    [RewriteStatementType, ast.RewriteStatementType.FILE],
    [LocateType, ast.LocateType.FILE],
    [OpenOptionType, ast.OpenOptionType.FILE],
  ],
});
export const IEEE = registerKeyword({
  name: "IEEE",
  categories: [[DefaultAttribute, ast.DefaultAttribute.IEEE]],
});
export const LIST = registerKeyword({
  name: "LIST",
  categories: [[DefaultAttribute, ast.DefaultAttribute.LIST]],
});
export const REAL = registerKeyword({
  name: "REAL",
  categories: [[DefaultAttribute, ast.DefaultAttribute.REAL]],
});
export const TASK = registerKeyword({
  name: "TASK",
  categories: [
    [DataTypes, ast.DataType.Task],
    [DefaultAttribute, ast.DefaultAttribute.TASK],
  ],
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
  categories: [[PutAttribute, ast.PutAttribute.LINE]],
});
export const PAGE = registerKeyword({
  name: "PAGE",
  categories: [[PutAttribute, ast.PutAttribute.PAGE]],
});
export const SKIP = registerKeyword({
  name: "SKIP",
  categories: [
    [EnvironmentOptionSymbolName, ast.EnvironmentOptionSymbolName.SKIP],
    [PutAttribute, ast.PutAttribute.SKIP],
  ],
});
export const SCAN = registerKeyword({
  name: "SCAN",
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.SCAN],
    [ScanMode, ast.ScanMode.SCAN],
  ],
});
export const FREE = registerKeyword({
  name: "FREE",
});
export const COPY = registerKeyword({
  name: "COPY",
});
export const GOTO = registerKeyword({
  name: "GOTO",
  type: KeywordType.Control,
});
export const THEN = registerKeyword({
  name: "THEN",
  type: KeywordType.Control,
});
export const ELSE = registerKeyword({
  name: "ELSE",
  type: KeywordType.Control,
});
export const SNAP = registerKeyword({
  name: "SNAP",
});
export const SIZE = registerKeyword({
  name: "SIZE",
  categories: [[KeywordConditions, ast.KeywordConditions.SIZE]],
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
  categories: [[ReadStatementType, ast.ReadStatementType.INTO]],
});
export const FROM = registerKeyword({
  name: "FROM",
  categories: [
    [WriteStatementType, ast.WriteStatementType.FROM],
    [RewriteStatementType, ast.RewriteStatementType.FROM],
  ],
});
export const LOOP = registerKeyword({
  name: ["LOOP", "FOREVER"],
});
export const WHEN = registerKeyword({
  name: "WHEN",
  type: KeywordType.Control,
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
  categories: [[TypeOrOrdinal, ast.TypeOrOrdinal.TYPE]],
});
export const LIKE = registerKeyword({
  name: "LIKE",
});
export const SET = registerKeyword({
  name: "SET",
  categories: [
    [ReadStatementType, ast.ReadStatementType.SET],
    [LocateType, ast.LocateType.SET],
  ],
});
export const BIT = registerKeyword({
  name: "BIT",
  categories: [
    [DefaultAttribute, ast.DefaultAttribute.BIT],
    [AllocateAttributeType, ast.AllocateAttributeType.BIT],
  ],
});
export const PipePipeEquals = registerOperator({
  name: "||=",
  categories: [[AssignmentOperator, ast.AssignmentOperator.PipePipeEquals]],
});
export const StarStarEquals = registerOperator({
  name: "**=",
  categories: [[AssignmentOperator, ast.AssignmentOperator.StarStarEquals]],
});
export const END = registerKeyword({
  name: "END",
  type: KeywordType.Control,
});
export const AND = registerKeyword({
  name: "AND",
  categories: [
    [DefaultAttributeBinaryOperator, ast.DefaultAttributeBinaryOperator.AND],
  ],
});
export const NOT = registerKeyword({
  name: "NOT",
});
export const INT = registerKeyword({
  name: "INT",
  categories: [[DefaultAttribute, ast.DefaultAttribute.INT]],
});
export const KEY = registerKeyword({
  name: "KEY",
  categories: [
    [FileReferenceConditions, ast.FileReferenceConditions.KEY],
    [ReadStatementType, ast.ReadStatementType.KEY],
    [RewriteStatementType, ast.RewriteStatementType.KEY],
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
  categories: [[VX, ast.VX.V1]],
});
export const V2 = registerKeyword({
  name: "V2",
  categories: [[VX, ast.VX.V2]],
});
export const V3 = registerKeyword({
  name: "V3",
  categories: [[VX, ast.VX.V3]],
});
export const IN = registerKeyword({
  name: "IN",
});
export const BY = registerKeyword({
  name: "BY",
});
export const PlusEquals = registerOperator({
  name: "+=",
  categories: [[AssignmentOperator, ast.AssignmentOperator.PlusEquals]],
});
export const MinusEquals = registerOperator({
  name: "-=",
  categories: [[AssignmentOperator, ast.AssignmentOperator.MinusEquals]],
});
export const StarEquals = registerOperator({
  name: "*=",
  categories: [[AssignmentOperator, ast.AssignmentOperator.StarEquals]],
});
export const SlashEquals = registerOperator({
  name: "/=",
  categories: [[AssignmentOperator, ast.AssignmentOperator.SlashEquals]],
});
export const PipeEquals = registerOperator({
  name: "|=",
  categories: [[AssignmentOperator, ast.AssignmentOperator.PipeEquals]],
});
export const AmpersandEquals = registerOperator({
  name: "&=",
  categories: [[AssignmentOperator, ast.AssignmentOperator.AmpersandEquals]],
});
export const NotEquals = registerOperator({
  name: "^=",
  categories: [
    [AssignmentOperator, ast.AssignmentOperator.NotEquals],
    [BinaryOperator, ast.BinaryOperator.NotEquals],
  ],
});
export const LessThanGreaterThan = registerOperator({
  name: "<>",
  categories: [
    [AssignmentOperator, ast.AssignmentOperator.NotEquals],
    [BinaryOperator, ast.BinaryOperator.NotEquals],
  ],
});
export const OR = registerKeyword({
  name: "OR",
  categories: [
    [DefaultAttributeBinaryOperator, ast.DefaultAttributeBinaryOperator.OR],
  ],
});
export const DO = registerKeyword({
  name: "DO",
  type: KeywordType.Control,
});
export const TO = registerKeyword({
  name: "TO",
  type: KeywordType.Control,
});
export const GO = registerKeyword({
  name: "GO",
  type: KeywordType.Control,
});
export const IF = registerKeyword({
  name: "IF",
  type: KeywordType.Control,
});
export const ON = registerKeyword({
  name: "ON",
  type: KeywordType.Control,
});
export const NotLessThan = registerOperator({
  name: "^<",
  categories: [[BinaryOperator, ast.BinaryOperator.NotLessThan]],
});
export const LessThanEquals = registerOperator({
  name: "<=",
  categories: [[BinaryOperator, ast.BinaryOperator.LessThanEquals]],
});
export const GreaterThanEquals = registerOperator({
  name: ">=",
  categories: [[BinaryOperator, ast.BinaryOperator.GreaterThanEquals]],
});
export const NotGreaterThan = registerOperator({
  name: "^>",
  categories: [[BinaryOperator, ast.BinaryOperator.NotGreaterThan]],
});
export const PipePipe = registerOperator({
  name: "||",
  categories: [[BinaryOperator, ast.BinaryOperator.PipePipe]],
});
export const StarStar = registerOperator({
  name: "**",
  categories: [[BinaryOperator, ast.BinaryOperator.StarStar]],
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
export const OpenParenColon = createToken({
  name: "(:",
  pattern: Lexer.NA,
});
export const CloseParen = createToken({
  name: ")",
  pattern: Lexer.NA,
});
export const CloseParenColon = createToken({
  name: ":)",
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
export const Star = registerOperator({
  name: "*",
  categories: [[BinaryOperator, ast.BinaryOperator.Star]],
});
export const Equals = registerOperator({
  name: "=",
  categories: [
    [BinaryOperator, ast.BinaryOperator.Equals],
    [AssignmentOperator, ast.AssignmentOperator.Equals],
  ],
});
export const FB = registerKeyword({
  name: "FB",
  categories: [[RecordFormat, ast.RecordFormat.FB]],
});
export const FS = registerKeyword({
  name: "UFS",
  categories: [[RecordFormat, ast.RecordFormat.FS]],
});
export const FBS = registerKeyword({
  name: "FBS",
  categories: [[RecordFormat, ast.RecordFormat.FBS]],
});
export const VB = registerKeyword({
  name: "VB",
  categories: [[RecordFormat, ast.RecordFormat.VB]],
});
export const VS = registerKeyword({
  name: "VS",
  categories: [[RecordFormat, ast.RecordFormat.VS]],
});
export const VBS = registerKeyword({
  name: "VBS",
  categories: [[RecordFormat, ast.RecordFormat.VBS]],
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
  categories: [[RecordFormat, ast.RecordFormat.F]],
});
export const E = registerKeyword({
  name: "E",
});
export const G = registerKeyword({
  name: "G",
  categories: [[LOBSize, ast.SQLAttributeLobSize.G]],
});
export const K = registerKeyword({
  name: "K",
  categories: [[LOBSize, ast.SQLAttributeLobSize.K]],
});
export const M = registerKeyword({
  name: "M",
  categories: [[LOBSize, ast.SQLAttributeLobSize.M]],
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
export const U = registerKeyword({
  name: "U",
  categories: [[RecordFormat, ast.RecordFormat.U]],
});
export const V = registerKeyword({
  name: "V",
  categories: [[RecordFormat, ast.RecordFormat.V]],
});
export const X = registerKeyword({
  name: "X",
});
export const Pipe = registerOperator({
  name: "|",
  categories: [[BinaryOperator, ast.BinaryOperator.Pipe]],
});
export const Not = registerOperator({
  name: "^",
  categories: [
    [BinaryOperator, ast.BinaryOperator.Not],
    [UnaryOperator, ast.UnaryOperator.Not],
  ],
});
export const Ampersand = registerOperator({
  name: "&",
  categories: [[BinaryOperator, ast.BinaryOperator.Ampersand]],
});
export const LessThan = registerOperator({
  name: "<",
  categories: [[BinaryOperator, ast.BinaryOperator.LessThan]],
});
export const GreaterThan = registerOperator({
  name: ">",
  categories: [[BinaryOperator, ast.BinaryOperator.GreaterThan]],
});
export const Plus = registerOperator({
  name: "+",
  categories: [
    [BinaryOperator, ast.BinaryOperator.Plus],
    [UnaryOperator, ast.UnaryOperator.Plus],
  ],
});
export const Minus = registerOperator({
  name: "-",
  categories: [
    [BinaryOperator, ast.BinaryOperator.Minus],
    [UnaryOperator, ast.UnaryOperator.Minus],
  ],
});
export const Slash = registerOperator({
  name: "/",
  categories: [[BinaryOperator, ast.BinaryOperator.Slash]],
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
  categories: [[LOB, ast.LOB.BLOB]],
});
export const CLOB = registerKeyword({
  name: "CLOB",
  categories: [[LOB, ast.LOB.CLOB]],
});
export const DBCLOB = registerKeyword({
  name: "DBCLOB",
  categories: [[LOB, ast.LOB.DBCLOB]],
});
export const BLOB_LOCATOR = registerKeyword({
  name: "BLOB_LOCATOR",
  categories: [[LOBLocator, ast.LOBLocator.BLOB_LOCATOR]],
});
export const CLOB_LOCATOR = registerKeyword({
  name: "CLOB_LOCATOR",
  categories: [[LOBLocator, ast.LOBLocator.CLOB_LOCATOR]],
});
export const DBCLOB_LOCATOR = registerKeyword({
  name: "DBCLOB_LOCATOR",
  categories: [[LOBLocator, ast.LOBLocator.DBCLOB_LOCATOR]],
});
export const BLOB_FILE = registerKeyword({
  name: "BLOB_FILE",
  categories: [[LOBFile, ast.SQLAttributeLobType.BLOB]],
});
export const CLOB_FILE = registerKeyword({
  name: "CLOB_FILE",
  categories: [[LOBFile, ast.SQLAttributeLobType.CLOB]],
});
export const DBCLOB_FILE = registerKeyword({
  name: "DBCLOB_FILE",
  categories: [[LOBFile, ast.SQLAttributeLobType.DBCLOB]],
});
export const ROWID = registerKeyword({
  name: "ROWID",
});
export const TABLE = registerKeyword({
  name: "TABLE",
});
export const LOCATOR = registerKeyword({
  name: "LOCATOR",
  categories: [[DataTypes, ast.DataType.Locator]],
});
export const RESULT_SET_LOCATOR = registerKeyword({
  name: "RESULT_SET_LOCATOR",
});

// CICS Keywords
export const CICS = registerKeyword({
  name: "CICS",
});
export const DFHRESP = registerKeyword({
  name: "DFHRESP",
});
export const NOTFND = registerKeyword({
  name: "NOTFND",
  categories: [[CicsResponseCode, ast.CicsResponseCode.NOTFND]],
});
export const DUPREC = registerKeyword({
  name: "DUPREC",
  categories: [[CicsResponseCode, ast.CicsResponseCode.DUPREC]],
});
export const INVREQ = registerKeyword({
  name: "INVREQ",
  categories: [[CicsResponseCode, ast.CicsResponseCode.INVREQ]],
});
export const NOSPACE = registerKeyword({
  name: "NOSPACE",
  categories: [[CicsResponseCode, ast.CicsResponseCode.NOSPACE]],
});
export const NOTOPEN = registerKeyword({
  name: "NOTOPEN",
  categories: [[CicsResponseCode, ast.CicsResponseCode.NOTOPEN]],
});
export const LENGERR = registerKeyword({
  name: "LENGERR",
  categories: [[CicsResponseCode, ast.CicsResponseCode.LENGERR]],
});
export const QZERO = registerKeyword({
  name: "QZERO",
  categories: [[CicsResponseCode, ast.CicsResponseCode.QZERO]],
});
export const QBUSY = registerKeyword({
  name: "QBUSY",
  categories: [[CicsResponseCode, ast.CicsResponseCode.QBUSY]],
});
export const ITEMERR = registerKeyword({
  name: "ITEMERR",
  categories: [[CicsResponseCode, ast.CicsResponseCode.ITEMERR]],
});
export const PGMIDERR = registerKeyword({
  name: "PGMIDERR",
  categories: [[CicsResponseCode, ast.CicsResponseCode.PGMIDERR]],
});
export const ENDDATA = registerKeyword({
  name: "ENDDATA",
  categories: [[CicsResponseCode, ast.CicsResponseCode.ENDDATA]],
});
export const MAPFAIL = registerKeyword({
  name: "MAPFAIL",
  categories: [[CicsResponseCode, ast.CicsResponseCode.MAPFAIL]],
});
export const QIDERR = registerKeyword({
  name: "QIDERR",
  categories: [[CicsResponseCode, ast.CicsResponseCode.QIDERR]],
});
export const ENQBUSY = registerKeyword({
  name: "ENQBUSY",
  categories: [[CicsResponseCode, ast.CicsResponseCode.ENQBUSY]],
});
export const DISABLED = registerKeyword({
  name: "DISABLED",
  categories: [[CicsResponseCode, ast.CicsResponseCode.DISABLED]],
});
