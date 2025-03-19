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

import { createToken, Lexer } from 'chevrotain';

// Combination tokens (parser optimization)
export const LinkageOption = createToken({
    name: 'LinkageOption',
    pattern: Lexer.NA
});
export const NoMapOption = createToken({
    name: 'NoMapOption',
    pattern: Lexer.NA
});
export const SimpleOptions = createToken({
    name: 'SimpleOptions',
    pattern: Lexer.NA
});
export const DefaultAttribute = createToken({
    name: 'DefaultAttribute',
    pattern: Lexer.NA
});
export const DefaultAttributeBinaryOperator = createToken({
    name: 'DefaultAttributeBinaryOperator',
    pattern: Lexer.NA
});
export const BinaryOperator = createToken({
    name: 'BinaryOperator',
    pattern: Lexer.NA
});
export const UnaryOperator = createToken({
    name: 'UnaryOperator',
    pattern: Lexer.NA
});
export const ScopeAttribute = createToken({
    name: 'ScopeAttribute',
    pattern: Lexer.NA
});
export const AllocateAttributeType = createToken({
    name: 'AllocateAttributeType',
    pattern: Lexer.NA
});
export const AssignmentOperator = createToken({
    name: 'AssignmentOperator',
    pattern: Lexer.NA
});
export const KeywordConditions = createToken({
    name: 'KeywordConditions',
    pattern: Lexer.NA
});
export const FileReferenceConditions = createToken({
    name: 'FileReferenceConditions',
    pattern: Lexer.NA
});
export const PutAttribute = createToken({
    name: 'PutAttribute',
    pattern: Lexer.NA
});
export const Varying = createToken({
    name: 'Varying',
    pattern: Lexer.NA
});
export const Char = createToken({
    name: 'Char',
    pattern: Lexer.NA
});
export const ReadStatementType = createToken({
    name: 'ReadStatementType',
    pattern: Lexer.NA
});
export const WriteStatementType = createToken({
    name: 'WriteStatementType',
    pattern: Lexer.NA
});
export const RewriteStatementType = createToken({
    name: 'RewriteStatementType',
    pattern: Lexer.NA
});
export const Boolean = createToken({
    name: 'Boolean',
    pattern: Lexer.NA
});
export const LocateType = createToken({
    name: 'LocateType',
    pattern: Lexer.NA
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
    LocateType
];

// Lexer tokens
export const WS = createToken({
    name: 'WS',
    pattern: /\s+/,
    group: Lexer.SKIPPED
});
export const ExecFragment = createToken({
    name: 'ExecFragment',
    line_breaks: true,
    start_chars_hint: ['C', 'c', 'S', 's'],
    pattern: (text, offset) => {
        const regex = /(?<=EXEC\s*)[a-zA-Z]+\s[^;]*/y;
        regex.lastIndex = offset;
        return regex.exec(text);
    }
});
export const ID = createToken({
    name: 'ID',
    pattern: /[$@#_a-zA-Z][\w_$@#]*/
});
export const NUMBER = createToken({
    name: 'NUMBER',
    pattern: /((((([0-9][0-9_]*(\.[0-9_]+)?)|(\.[0-9_]+))([eEsSdDqQ][-+]?[0-9]+)?))([bB]|[iI])*)/
});
export const STRING_TERM = createToken({
    name: 'STRING_TERM',
    pattern: /("(""|\\.|[^"\\])*"|'(''|\\.|[^'\\])*')([xX][nN]|[xX][uU]|[xX]|[aA]|[eE]|[bB]4|[bB]3|[bB][xX]|[bB]|[gG][xX]|[gG]|[uU][xX]|[wW][xX]|[iI]|[mM])*/
});
export const ML_COMMENT = createToken({
    name: 'ML_COMMENT',
    pattern: /\/\*[\s\S]*?\*\//,
    group: Lexer.SKIPPED
});
export const SL_COMMENT = createToken({
    name: 'SL_COMMENT',
    pattern: /\/\/[^\n\r]*/,
    group: Lexer.SKIPPED
});
export const SUBSCRIPTRANGE = createToken({
    name: 'SUBSCRIPTRANGE',
    pattern: /SUBSCRIPTRANGE/i,
    categories: [ID, KeywordConditions],
    longer_alt: ID
});
export const NOCHARGRAPHIC = createToken({
    name: 'NOCHARGRAPHIC',
    pattern: /NOCHARGRAPHIC/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const NONASSIGNABLE = createToken({
    name: 'NONASSIGNABLE',
    pattern: /NONASSIGNABLE/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const FIXEDOVERFLOW = createToken({
    name: 'FIXEDOVERFLOW',
    pattern: /FIXEDOVERFLOW|FOFL/i,
    categories: [ID, KeywordConditions],
    longer_alt: ID
});
export const UNDEFINEDFILE = createToken({
    name: 'UNDEFINEDFILE',
    pattern: /UNDEFINEDFILE|UNDF/i,
    categories: [ID, FileReferenceConditions],
    longer_alt: ID
});
export const VALUELISTFROM = createToken({
    name: 'VALUELISTFROM',
    pattern: /VALUELISTFROM/i,
    categories: [ID],
    longer_alt: ID
});
export const NODESCRIPTOR = createToken({
    name: 'NODESCRIPTOR',
    pattern: /NODESCRIPTOR/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const NONCONNECTED = createToken({
    name: 'NONCONNECTED',
    pattern: /NONCONNECTED/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const LITTLEENDIAN = createToken({
    name: 'LITTLEENDIAN',
    pattern: /LITTLEENDIAN/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const ANYCONDITION = createToken({
    name: 'ANYCONDITION',
    pattern: /ANYCOND(ITION)?/i,
    categories: [ID, KeywordConditions],
    longer_alt: ID
});
export const CHARGRAPHIC = createToken({
    name: 'CHARGRAPHIC',
    pattern: /CHARGRAPHIC/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const IRREDUCIBLE = createToken({
    name: 'IRREDUCIBLE',
    pattern: /IRRED(UCIBLE)?/i,
    categories: [ID, SimpleOptions, DefaultAttribute],
    longer_alt: ID
});
export const DLLINTERNAL = createToken({
    name: 'DLLINTERNAL',
    pattern: /DLLINTERNAL/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const UNREACHABLE = createToken({
    name: 'UNREACHABLE',
    pattern: /UNREACHABLE/i,
    categories: [ID],
    longer_alt: ID
});
export const ENVIRONMENT = createToken({
    name: 'ENVIRONMENT',
    pattern: /ENV(IRONMENT)?/i,
    categories: [ID],
    longer_alt: ID
});
export const DESCRIPTORS = createToken({
    name: 'DESCRIPTORS',
    pattern: /DESCRIPTORS/i,
    categories: [ID],
    longer_alt: ID
});
export const CONFORMANCE = createToken({
    name: 'CONFORMANCE',
    pattern: /CONFORMANCE/i,
    categories: [ID, KeywordConditions],
    longer_alt: ID
});
export const STRINGRANGE = createToken({
    name: 'STRINGRANGE',
    pattern: /STRINGRANGE/i,
    categories: [ID, KeywordConditions],
    longer_alt: ID
});
export const DESCRIPTOR = createToken({
    name: 'DESCRIPTOR',
    pattern: /DESCRIPTOR/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const ASSIGNABLE = createToken({
    name: 'ASSIGNABLE',
    pattern: /ASSIGNABLE/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const CONTROLLED = createToken({
    name: 'CONTROLLED',
    pattern: /CONTROLLED|CTL/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const NONVARYING = createToken({
    name: 'NONVARYING',
    pattern: /NONVAR(YING)?/i,
    categories: [ID, DefaultAttribute, Varying],
    longer_alt: ID
});
export const SEQUENTIAL = createToken({
    name: 'SEQUENTIAL',
    pattern: /SEQ(UENTIA)?L/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const CONVERSION = createToken({
    name: 'CONVERSION',
    pattern: /CONVERSION/i,
    categories: [ID, KeywordConditions],
    longer_alt: ID
});
export const STRINGSIZE = createToken({
    name: 'STRINGSIZE',
    pattern: /STRINGSIZE/i,
    categories: [ID, KeywordConditions],
    longer_alt: ID
});
export const ZERODIVIDE = createToken({
    name: 'ZERODIVIDE',
    pattern: /ZERODIVIDE|ZDIV/i,
    categories: [ID, KeywordConditions],
    longer_alt: ID
});
export const INITACROSS = createToken({
    name: 'INITACROSS',
    pattern: /INITACROSS/i,
    categories: [ID],
    longer_alt: ID
});
export const VALUERANGE = createToken({
    name: 'VALUERANGE',
    pattern: /VALUERANGE/i,
    categories: [ID],
    longer_alt: ID
});
export const NOEXECOPS = createToken({
    name: 'NOEXECOPS',
    pattern: /NOEXECOPS/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const REDUCIBLE = createToken({
    name: 'REDUCIBLE',
    pattern: /RED(UCIBLE)?/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const REENTRANT = createToken({
    name: 'REENTRANT',
    pattern: /REENTRANT/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const FETCHABLE = createToken({
    name: 'FETCHABLE',
    pattern: /FETCHABLE/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const FROMALIEN = createToken({
    name: 'FROMALIEN',
    pattern: /FROMALIEN/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const ASSEMBLER = createToken({
    name: 'ASSEMBLER',
    pattern: /ASSEMBLER|ASM/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const RECURSIVE = createToken({
    name: 'RECURSIVE',
    pattern: /RECURSIVE/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const PROCEDURE = createToken({
    name: 'PROCEDURE',
    pattern: /(X)?PROC(EDURE)?/i,
    categories: [ID],
    longer_alt: ID
});
export const CHARACTER = createToken({
    name: 'CHARACTER',
    pattern: /CHAR(ACTER)?/i,
    categories: [ID, DefaultAttribute, AllocateAttributeType],
    longer_alt: ID
});
export const DIMACROSS = createToken({
    name: 'DIMACROSS',
    pattern: /DIMACROSS/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const AUTOMATIC = createToken({
    name: 'AUTOMATIC',
    pattern: /AUTO(MATIC)?/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const BACKWARDS = createToken({
    name: 'BACKWARDS',
    pattern: /BACKWARDS/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const CONDITION = createToken({
    name: 'CONDITION',
    pattern: /COND(ITION)?/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const CONNECTED = createToken({
    name: 'CONNECTED',
    pattern: /CONNECTED/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const EXCLUSIVE = createToken({
    name: 'EXCLUSIVE',
    pattern: /EXCLUSIVE/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const NONNATIVE = createToken({
    name: 'NONNATIVE',
    pattern: /NONNATIVE/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const PARAMETER = createToken({
    name: 'PARAMETER',
    pattern: /PARAMETER/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const PRECISION = createToken({
    name: 'PRECISION',
    pattern: /PREC(ISION)?/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const STRUCTURE = createToken({
    name: 'STRUCTURE',
    pattern: /STRUCT(URE)?/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const TRANSIENT = createToken({
    name: 'TRANSIENT',
    pattern: /TRANSIENT/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const UNALIGNED = createToken({
    name: 'UNALIGNED',
    pattern: /UNAL(IGNED)?/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const BIGENDIAN = createToken({
    name: 'BIGENDIAN',
    pattern: /BIGENDIAN/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const ASSERTION = createToken({
    name: 'ASSERTION',
    pattern: /ASSERTION/i,
    categories: [ID, KeywordConditions],
    longer_alt: ID
});
export const ATTENTION = createToken({
    name: 'ATTENTION',
    pattern: /ATTENTION/i,
    categories: [ID, KeywordConditions],
    longer_alt: ID
});
export const INVALIDOP = createToken({
    name: 'INVALIDOP',
    pattern: /INVALIDOP/i,
    categories: [ID, KeywordConditions],
    longer_alt: ID
});
export const UNDERFLOW = createToken({
    name: 'UNDERFLOW',
    pattern: /UNDERFLOW|UFL/i,
    categories: [ID, KeywordConditions],
    longer_alt: ID
});
export const OTHERWISE = createToken({
    name: 'OTHERWISE',
    pattern: /OTHER(WISE)?/i,
    categories: [ID],
    longer_alt: ID
});
export const DIMENSION = createToken({
    name: 'DIMENSION',
    pattern: /DIM(ENSION)?/i,
    categories: [ID],
    longer_alt: ID
});
export const VALUELIST = createToken({
    name: 'VALUELIST',
    pattern: /VALUELIST/i,
    categories: [ID],
    longer_alt: ID
});
export const RESERVES = createToken({
    name: 'RESERVES',
    pattern: /RESERVES/i,
    categories: [ID],
    longer_alt: ID
});
export const NOMAPOUT = createToken({
    name: 'NOMAPOUT',
    pattern: /NOMAPOUT/i,
    categories: [ID, NoMapOption],
    longer_alt: ID
});
export const NOINLINE = createToken({
    name: 'NOINLINE',
    pattern: /NOINLINE/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const NORETURN = createToken({
    name: 'NORETURN',
    pattern: /NORETURN/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const EXTERNAL = createToken({
    name: 'EXTERNAL',
    pattern: /EXT(ERNAL)?/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const VARIABLE = createToken({
    name: 'VARIABLE',
    pattern: /VARIABLE/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const ALLOCATE = createToken({
    name: 'ALLOCATE',
    pattern: /ALLOC(ATE)?/i,
    categories: [ID],
    longer_alt: ID
});
export const WIDECHAR = createToken({
    name: 'WIDECHAR',
    pattern: /W(IDE)?CHAR/i,
    categories: [ID, DefaultAttribute, AllocateAttributeType],
    longer_alt: ID
});
export const ABNORMAL = createToken({
    name: 'ABNORMAL',
    pattern: /ABNORMAL/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const BUFFERED = createToken({
    name: 'BUFFERED',
    pattern: /(UN)?BUF(FERED)?/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const CONSTANT = createToken({
    name: 'CONSTANT',
    pattern: /CONSTANT/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const INTERNAL = createToken({
    name: 'INTERNAL',
    pattern: /INTERNAL/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const OPTIONAL = createToken({
    name: 'OPTIONAL',
    pattern: /OPTIONAL/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const POSITION = createToken({
    name: 'POSITION',
    pattern: /POS(ITION)?/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const RESERVED = createToken({
    name: 'RESERVED',
    pattern: /RESERVED/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const UNSIGNED = createToken({
    name: 'UNSIGNED',
    pattern: /UNSIGNED/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const VARYING4 = createToken({
    name: 'VARYING4',
    pattern: /VARYING4/i,
    categories: [ID, DefaultAttribute, Varying],
    longer_alt: ID
});
export const VARYINGZ = createToken({
    name: 'VARYINGZ',
    pattern: /VAR(YING)?Z/i,
    categories: [ID, DefaultAttribute, Varying],
    longer_alt: ID
});
export const DOWNTHRU = createToken({
    name: 'DOWNTHRU',
    pattern: /DOWNTHRU/i,
    categories: [ID],
    longer_alt: ID
});
export const PercentINCLUDE = createToken({
    name: 'PercentINCLUDE',
    pattern: /%(X)?INCLUDE/i,
    categories: [ID]
});
export const PercentNOPRINT = createToken({
    name: 'PercentNOPRINT',
    pattern: /%NOPRINT/i,
    categories: [ID]
});
export const OVERFLOW = createToken({
    name: 'OVERFLOW',
    pattern: /OVERFLOW|OFL/i,
    categories: [ID, KeywordConditions],
    longer_alt: ID
});
export const TRANSMIT = createToken({
    name: 'TRANSMIT',
    pattern: /TRANSMIT/i,
    categories: [ID, FileReferenceConditions],
    longer_alt: ID
});
export const LINESIZE = createToken({
    name: 'LINESIZE',
    pattern: /LINESIZE/i,
    categories: [ID],
    longer_alt: ID
});
export const PAGESIZE = createToken({
    name: 'PAGESIZE',
    pattern: /PAGESIZE/i,
    categories: [ID],
    longer_alt: ID
});
export const PROCESS = createToken({
    name: 'PROCESS',
    pattern: /[*%]PROCESS/i,
    categories: [ID]
});
export const PROCINC = createToken({
    name: 'PROCINC',
    pattern: /[*%]PROCINC/i,
    categories: [ID]
});
export const RESIGNAL = createToken({
    name: 'RESIGNAL',
    pattern: /RESIGNAL/i,
    categories: [ID],
    longer_alt: ID
});
export const PACKAGE = createToken({
    name: 'PACKAGE',
    pattern: /PACKAGE/i,
    categories: [ID],
    longer_alt: ID
});
export const EXPORTS = createToken({
    name: 'EXPORTS',
    pattern: /EXPORTS/i,
    categories: [ID],
    longer_alt: ID
});
export const OPTIONS = createToken({
    name: 'OPTIONS',
    pattern: /OPTIONS/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const LINKAGE = createToken({
    name: 'LINKAGE',
    pattern: /LINKAGE/i,
    categories: [ID],
    longer_alt: ID
});
export const OPTLINK = createToken({
    name: 'OPTLINK',
    pattern: /OPTLINK/i,
    categories: [ID, LinkageOption],
    longer_alt: ID
});
export const STDCALL = createToken({
    name: 'STDCALL',
    pattern: /STDCALL/i,
    categories: [ID, LinkageOption],
    longer_alt: ID
});
export const NOMAPIN = createToken({
    name: 'NOMAPIN',
    pattern: /NOMAPIN/i,
    categories: [ID, NoMapOption],
    longer_alt: ID
});
export const FORTRAN = createToken({
    name: 'FORTRAN',
    pattern: /FORTRAN/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const BYVALUE = createToken({
    name: 'BYVALUE',
    pattern: /BYVALUE/i,
    categories: [ID, SimpleOptions, DefaultAttribute],
    longer_alt: ID
});
export const AMODE31 = createToken({
    name: 'AMODE31',
    pattern: /AMODE31/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const AMODE64 = createToken({
    name: 'AMODE64',
    pattern: /AMODE64/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const RETCODE = createToken({
    name: 'RETCODE',
    pattern: /RETCODE/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const WINMAIN = createToken({
    name: 'WINMAIN',
    pattern: /WINMAIN/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const DYNAMIC = createToken({
    name: 'DYNAMIC',
    pattern: /DYNAMIC/i,
    categories: [ID, ScopeAttribute],
    longer_alt: ID
});
export const LIMITED = createToken({
    name: 'LIMITED',
    pattern: /LIMITED/i,
    categories: [ID],
    longer_alt: ID
});
export const GRAPHIC = createToken({
    name: 'GRAPHIC',
    pattern: /GRAPHIC/i,
    categories: [ID, DefaultAttribute, AllocateAttributeType],
    longer_alt: ID
});
export const COMPARE = createToken({
    name: 'COMPARE',
    pattern: /COMPARE/i,
    categories: [ID],
    longer_alt: ID
});
export const DEFAULT = createToken({
    name: 'DEFAULT',
    pattern: /DEFAULT|DFT/i,
    categories: [ID],
    longer_alt: ID
});
export const ALIGNED = createToken({
    name: 'ALIGNED',
    pattern: /ALIGNED/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const BUILTIN = createToken({
    name: 'BUILTIN',
    pattern: /BUILTIN/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const COMPLEX = createToken({
    name: 'COMPLEX',
    pattern: /COMPLEX/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const DECIMAL = createToken({
    name: 'DECIMAL',
    pattern: /DEC(IMAL)?/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const GENERIC = createToken({
    name: 'GENERIC',
    pattern: /GENERIC/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const HEXADEC = createToken({
    name: 'HEXADEC',
    pattern: /HEXADEC/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const NONASGN = createToken({
    name: 'NONASGN',
    pattern: /NONASGN/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const OUTONLY = createToken({
    name: 'OUTONLY',
    pattern: /OUTONLY/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const POINTER = createToken({
    name: 'POINTER',
    pattern: /POINTER|PTR/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const VARYING = createToken({
    name: 'VARYING',
    pattern: /VAR(YING)?/i,
    categories: [ID, DefaultAttribute, Varying],
    longer_alt: ID
});
export const ORDINAL = createToken({
    name: 'ORDINAL',
    pattern: /ORDINAL/i,
    categories: [ID],
    longer_alt: ID
});
export const DISPLAY = createToken({
    name: 'DISPLAY',
    pattern: /DISPLAY/i,
    categories: [ID],
    longer_alt: ID
});
export const ROUTCDE = createToken({
    name: 'ROUTCDE',
    pattern: /ROUTCDE/i,
    categories: [ID],
    longer_alt: ID
});
export const ITERATE = createToken({
    name: 'ITERATE',
    pattern: /ITERATE/i,
    categories: [ID],
    longer_alt: ID
});
export const KEYFROM = createToken({
    name: 'KEYFROM',
    pattern: /KEYFROM/i,
    categories: [ID, WriteStatementType, LocateType],
    longer_alt: ID
});
export const STORAGE = createToken({
    name: 'STORAGE',
    pattern: /STORAGE/i,
    categories: [ID, KeywordConditions],
    longer_alt: ID
});
export const ENDFILE = createToken({
    name: 'ENDFILE',
    pattern: /ENDFILE/i,
    categories: [ID, FileReferenceConditions],
    longer_alt: ID
});
export const ENDPAGE = createToken({
    name: 'ENDPAGE',
    pattern: /ENDPAGE/i,
    categories: [ID, FileReferenceConditions],
    longer_alt: ID
});
export const QUALIFY = createToken({
    name: 'QUALIFY',
    pattern: /QUALIFY/i,
    categories: [ID],
    longer_alt: ID
});
export const RELEASE = createToken({
    name: 'RELEASE',
    pattern: /RELEASE/i,
    categories: [ID],
    longer_alt: ID
});
export const REWRITE = createToken({
    name: 'REWRITE',
    pattern: /REWRITE/i,
    categories: [ID],
    longer_alt: ID
});
export const INITIAL = createToken({
    name: 'INITIAL',
    pattern: /INIT(IAL)?/i,
    categories: [ID],
    longer_alt: ID
});
export const DECLARE = createToken({
    name: 'DECLARE',
    pattern: /DECLARE|DCL|XDECLARE|XDCL/i,
    categories: [ID],
    longer_alt: ID
});
export const PICTURE = createToken({
    name: 'PICTURE',
    pattern: /PIC(TURE)?/i,
    categories: [ID],
    longer_alt: ID
});
export const WIDEPIC = createToken({
    name: 'WIDEPIC',
    pattern: /WIDEPIC/i,
    categories: [ID],
    longer_alt: ID
});
export const RETURNS = createToken({
    name: 'RETURNS',
    pattern: /RETURNS/i,
    categories: [ID],
    longer_alt: ID
});
export const SYSTEM = createToken({
    name: 'SYSTEM',
    pattern: /SYSTEM/i,
    categories: [ID, LinkageOption],
    longer_alt: ID
});
export const INLINE = createToken({
    name: 'INLINE',
    pattern: /INLINE/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const BYADDR = createToken({
    name: 'BYADDR',
    pattern: /BYADDR/i,
    categories: [ID, SimpleOptions, DefaultAttribute],
    longer_alt: ID
});
export const STATIC = createToken({
    name: 'STATIC',
    pattern: /STATIC/i,
    categories: [ID, DefaultAttribute, ScopeAttribute],
    longer_alt: ID
});
export const ASSERT = createToken({
    name: 'ASSERT',
    pattern: /ASSERT/i,
    categories: [ID],
    longer_alt: ID
});
export const ATTACH = createToken({
    name: 'ATTACH',
    pattern: /ATTACH/i,
    categories: [ID],
    longer_alt: ID
});
export const THREAD = createToken({
    name: 'THREAD',
    pattern: /THREAD/i,
    categories: [ID],
    longer_alt: ID
});
export const TSTACK = createToken({
    name: 'TSTACK',
    pattern: /TSTACK/i,
    categories: [ID],
    longer_alt: ID
});
export const CANCEL = createToken({
    name: 'CANCEL',
    pattern: /CANCEL/i,
    categories: [ID],
    longer_alt: ID
});
export const BINARY = createToken({
    name: 'BINARY',
    pattern: /BIN(ARY)?/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const FORMAT = createToken({
    name: 'FORMAT',
    pattern: /FORMAT/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const INONLY = createToken({
    name: 'INONLY',
    pattern: /INONLY/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const MEMBER = createToken({
    name: 'MEMBER',
    pattern: /MEMBER/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const NATIVE = createToken({
    name: 'NATIVE',
    pattern: /NATIVE/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const NORMAL = createToken({
    name: 'NORMAL',
    pattern: /NORMAL/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const OFFSET = createToken({
    name: 'OFFSET',
    pattern: /OFFSET/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const OUTPUT = createToken({
    name: 'OUTPUT',
    pattern: /OUTPUT/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const RECORD = createToken({
    name: 'RECORD',
    pattern: /RECORD/i,
    categories: [ID, DefaultAttribute, FileReferenceConditions],
    longer_alt: ID
});
export const SIGNED = createToken({
    name: 'SIGNED',
    pattern: /SIGNED/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const STREAM = createToken({
    name: 'STREAM',
    pattern: /STREAM/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const UPDATE = createToken({
    name: 'UPDATE',
    pattern: /UPDATE/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const DEFINE = createToken({
    name: 'DEFINE',
    pattern: /(X)?DEFINE/i,
    categories: [ID],
    longer_alt: ID
});
export const DEFINED = createToken({
    name: 'DEFINED',
    pattern: /DEF(INED)?/i,
    categories: [ID],
    longer_alt: [ID, DEFINE]
});
export const DELETE = createToken({
    name: 'DELETE',
    pattern: /DELETE/i,
    categories: [ID],
    longer_alt: ID
});
export const DETACH = createToken({
    name: 'DETACH',
    pattern: /DETACH/i,
    categories: [ID],
    longer_alt: ID
});
export const UPTHRU = createToken({
    name: 'UPTHRU',
    pattern: /UPTHRU/i,
    categories: [ID],
    longer_alt: ID
});
export const REPEAT = createToken({
    name: 'REPEAT',
    pattern: /REPEAT/i,
    categories: [ID],
    longer_alt: ID
});
export const COLUMN = createToken({
    name: 'COLUMN',
    pattern: /COL(UMN)?/i,
    categories: [ID],
    longer_alt: ID
});
export const STRING = createToken({
    name: 'STRING',
    pattern: /STRING/i,
    categories: [ID],
    longer_alt: ID
});
export const ddname = createToken({
    name: 'ddname',
    pattern: /ddname/i,
    categories: [ID],
    longer_alt: ID
});
export const LOCATE = createToken({
    name: 'LOCATE',
    pattern: /LOCATE/i,
    categories: [ID],
    longer_alt: ID
});
export const FINISH = createToken({
    name: 'FINISH',
    pattern: /FINISH/i,
    categories: [ID, KeywordConditions],
    longer_alt: ID
});
export const DIRECT = createToken({
    name: 'DIRECT',
    pattern: /DIRECT/i,
    categories: [ID],
    longer_alt: ID
});
export const PercentPRINT = createToken({
    name: 'PercentPRINT',
    pattern: /%PRINT/i,
    categories: [ID]
});
export const IGNORE = createToken({
    name: 'IGNORE',
    pattern: /IGNORE/i,
    categories: [ID, ReadStatementType],
    longer_alt: ID
});
export const REINIT = createToken({
    name: 'REINIT',
    pattern: /REINIT/i,
    categories: [ID],
    longer_alt: ID
});
export const RETURN = createToken({
    name: 'RETURN',
    pattern: /RETURN/i,
    categories: [ID],
    longer_alt: ID
});
export const SELECT = createToken({
    name: 'SELECT',
    pattern: /SELECT/i,
    categories: [ID],
    longer_alt: ID
});
export const SIGNAL = createToken({
    name: 'SIGNAL',
    pattern: /SIGNAL/i,
    categories: [ID],
    longer_alt: ID
});
export const HANDLE = createToken({
    name: 'HANDLE',
    pattern: /HANDLE/i,
    categories: [ID],
    longer_alt: ID
});
export const CDECL = createToken({
    name: 'CDECL',
    pattern: /CDECL/i,
    categories: [ID, LinkageOption],
    longer_alt: ID
});
export const CMPAT = createToken({
    name: 'CMPAT',
    pattern: /CMPAT/i,
    categories: [ID],
    longer_alt: ID
});
export const NOMAP = createToken({
    name: 'NOMAP',
    pattern: /NOMAP/i,
    categories: [ID, NoMapOption],
    longer_alt: ID
});
export const ORDER = createToken({
    name: 'ORDER',
    pattern: /(RE)?ORDER/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const COBOL = createToken({
    name: 'COBOL',
    pattern: /COBOL/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const INTER = createToken({
    name: 'INTER',
    pattern: /INTER/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const ENTRY = createToken({
    name: 'ENTRY',
    pattern: /ENTRY/i,
    categories: [ID],
    longer_alt: ID
});
export const UCHAR = createToken({
    name: 'UCHAR',
    pattern: /UCHAR/i,
    categories: [ID, DefaultAttribute, AllocateAttributeType, Char],
    longer_alt: ID
});
export const FALSE = createToken({
    name: 'FALSE',
    pattern: /FALSE/i,
    categories: [ID, Boolean],
    longer_alt: ID
});
export const BEGIN = createToken({
    name: 'BEGIN',
    pattern: /BEGIN/i,
    categories: [ID],
    longer_alt: ID
});
export const CLOSE = createToken({
    name: 'CLOSE',
    pattern: /CLOSE/i,
    categories: [ID],
    longer_alt: ID
});
export const RANGE = createToken({
    name: 'RANGE',
    pattern: /RANGE/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const BASED = createToken({
    name: 'BASED',
    pattern: /BASED/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const EVENT = createToken({
    name: 'EVENT',
    pattern: /EVENT/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const FIXED = createToken({
    name: 'FIXED',
    pattern: /FIXED/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const FLOAT = createToken({
    name: 'FLOAT',
    pattern: /FLOAT/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const INOUT = createToken({
    name: 'INOUT',
    pattern: /INOUT/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const INPUT = createToken({
    name: 'INPUT',
    pattern: /INPUT/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const KEYED = createToken({
    name: 'KEYED',
    pattern: /KEYED/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const LABEL = createToken({
    name: 'LABEL',
    pattern: /LABEL/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const PRINT = createToken({
    name: 'PRINT',
    pattern: /PRINT/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const UNION = createToken({
    name: 'UNION',
    pattern: /UNION/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const ALIAS = createToken({
    name: 'ALIAS',
    pattern: /ALIAS/i,
    categories: [ID],
    longer_alt: ID
});
export const VALUE = createToken({
    name: 'VALUE',
    pattern: /VALUE/i,
    categories: [ID],
    longer_alt: ID
});
export const DELAY = createToken({
    name: 'DELAY',
    pattern: /DELAY/i,
    categories: [ID],
    longer_alt: ID
});
export const REPLY = createToken({
    name: 'REPLY',
    pattern: /REPLY/i,
    categories: [ID],
    longer_alt: ID
});
export const WHILE = createToken({
    name: 'WHILE',
    pattern: /WHILE/i,
    categories: [ID],
    longer_alt: ID
});
export const UNTIL = createToken({
    name: 'UNTIL',
    pattern: /UNTIL/i,
    categories: [ID],
    longer_alt: ID
});
export const FETCH = createToken({
    name: 'FETCH',
    pattern: /FETCH/i,
    categories: [ID],
    longer_alt: ID
});
export const TITLE = createToken({
    name: 'TITLE',
    pattern: /TITLE/i,
    categories: [ID],
    longer_alt: ID
});
export const FLUSH = createToken({
    name: 'FLUSH',
    pattern: /FLUSH/i,
    categories: [ID],
    longer_alt: ID
});
export const LEAVE = createToken({
    name: 'LEAVE',
    pattern: /LEAVE/i,
    categories: [ID],
    longer_alt: ID
});
export const PercentLINE = createToken({
    name: 'PercentLINE',
    pattern: /%LINE/i,
    categories: [ID]
});
export const PercentNOTE = createToken({
    name: 'PercentNOTE',
    pattern: /%NOTE/i,
    categories: [ID]
});
export const ERROR = createToken({
    name: 'ERROR',
    pattern: /ERROR/i,
    categories: [ID, KeywordConditions],
    longer_alt: ID
});
export const PercentPAGE = createToken({
    name: 'PercentPAGE',
    pattern: /%PAGE/i,
    categories: [ID]
});
export const PercentPUSH = createToken({
    name: 'PercentPUSH',
    pattern: /%PUSH/i,
    categories: [ID]
});
export const KEYTO = createToken({
    name: 'KEYTO',
    pattern: /KEYTO/i,
    categories: [ID, ReadStatementType, WriteStatementType],
    longer_alt: ID
});
export const REVERT = createToken({
    name: 'REVERT',
    pattern: /REVERT/i,
    categories: [ID],
    longer_alt: ID
});
export const PercentSKIP = createToken({
    name: 'PercentSKIP',
    pattern: /%SKIP/i,
    categories: [ID]
});
export const WRITE = createToken({
    name: 'WRITE',
    pattern: /WRITE/i,
    categories: [ID],
    longer_alt: ID
});
export const REFER = createToken({
    name: 'REFER',
    pattern: /REFER/i,
    categories: [ID],
    longer_alt: ID
});
export const MAIN = createToken({
    name: 'MAIN',
    pattern: /MAIN/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const RENT = createToken({
    name: 'RENT',
    pattern: /RENT/i,
    categories: [ID, SimpleOptions],
    longer_alt: ID
});
export const AREA = createToken({
    name: 'AREA',
    pattern: /AREA/i,
    categories: [ID, DefaultAttribute, AllocateAttributeType, KeywordConditions],
    longer_alt: ID
});
export const TRUE = createToken({
    name: 'TRUE',
    pattern: /TRUE/i,
    categories: [ID, Boolean],
    longer_alt: ID
});
export const TEXT = createToken({
    name: 'TEXT',
    pattern: /TEXT/i,
    categories: [ID],
    longer_alt: ID
});
export const NAME = createToken({
    name: 'NAME',
    pattern: /NAME/i,
    categories: [ID, FileReferenceConditions],
    longer_alt: ID
});
export const CALL = createToken({
    name: 'CALL',
    pattern: /CALL/i,
    categories: [ID],
    longer_alt: ID
});
export const FILE = createToken({
    name: 'FILE',
    pattern: /FILE/i,
    categories: [ID, DefaultAttribute, PutAttribute, ReadStatementType, WriteStatementType, RewriteStatementType, LocateType],
    longer_alt: ID
});
export const IEEE = createToken({
    name: 'IEEE',
    pattern: /IEEE/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const LIST = createToken({
    name: 'LIST',
    pattern: /LIST/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const REAL = createToken({
    name: 'REAL',
    pattern: /REAL/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const TASK = createToken({
    name: 'TASK',
    pattern: /TASK/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const DESC = createToken({
    name: 'DESC',
    pattern: /DESC/i,
    categories: [ID],
    longer_alt: ID
});
export const EXEC = createToken({
    name: 'EXEC',
    pattern: /EXEC/i,
    categories: [ID],
    longer_alt: ID
});
export const EXIT = createToken({
    name: 'EXIT',
    pattern: /EXIT/i,
    categories: [ID],
    longer_alt: ID
});
export const LINE = createToken({
    name: 'LINE',
    pattern: /LINE/i,
    categories: [ID, PutAttribute],
    longer_alt: ID
});
export const PAGE = createToken({
    name: 'PAGE',
    pattern: /PAGE/i,
    categories: [ID, PutAttribute],
    longer_alt: ID
});
export const SKIP = createToken({
    name: 'SKIP',
    pattern: /SKIP/i,
    categories: [ID, PutAttribute],
    longer_alt: ID
});
export const FREE = createToken({
    name: 'FREE',
    pattern: /FREE/i,
    categories: [ID],
    longer_alt: ID
});
export const COPY = createToken({
    name: 'COPY',
    pattern: /COPY/i,
    categories: [ID],
    longer_alt: ID
});
export const GOTO = createToken({
    name: 'GOTO',
    pattern: /GOTO/i,
    categories: [ID],
    longer_alt: ID
});
export const THEN = createToken({
    name: 'THEN',
    pattern: /THEN/i,
    categories: [ID],
    longer_alt: ID
});
export const ELSE = createToken({
    name: 'ELSE',
    pattern: /ELSE/i,
    categories: [ID],
    longer_alt: ID
});
export const SNAP = createToken({
    name: 'SNAP',
    pattern: /SNAP/i,
    categories: [ID],
    longer_alt: ID
});
export const SIZE = createToken({
    name: 'SIZE',
    pattern: /SIZE/i,
    categories: [ID, KeywordConditions],
    longer_alt: ID
});
export const OPEN = createToken({
    name: 'OPEN',
    pattern: /OPEN/i,
    categories: [ID],
    longer_alt: ID
});
export const PercentPOP = createToken({
    name: 'PercentPOP',
    pattern: /%POP/i,
    categories: [ID]
});
export const TODO = createToken({
    name: 'TODO',
    pattern: /TODO/i,
    categories: [ID],
    longer_alt: ID
});
export const DATA = createToken({
    name: 'DATA',
    pattern: /DATA/i,
    categories: [ID],
    longer_alt: ID
});
export const EDIT = createToken({
    name: 'EDIT',
    pattern: /EDIT/i,
    categories: [ID],
    longer_alt: ID
});
export const READ = createToken({
    name: 'READ',
    pattern: /READ/i,
    categories: [ID],
    longer_alt: ID
});
export const INTO = createToken({
    name: 'INTO',
    pattern: /INTO/i,
    categories: [ID, ReadStatementType],
    longer_alt: ID
});
export const FROM = createToken({
    name: 'FROM',
    pattern: /FROM/i,
    categories: [ID, WriteStatementType, RewriteStatementType],
    longer_alt: ID
});
export const WHEN = createToken({
    name: 'WHEN',
    pattern: /WHEN/i,
    categories: [ID],
    longer_alt: ID
});
export const STOP = createToken({
    name: 'STOP',
    pattern: /STOP/i,
    categories: [ID],
    longer_alt: ID
});
export const WAIT = createToken({
    name: 'WAIT',
    pattern: /WAIT/i,
    categories: [ID],
    longer_alt: ID
});
export const DATE = createToken({
    name: 'DATE',
    pattern: /DATE/i,
    categories: [ID],
    longer_alt: ID
});
export const TYPE = createToken({
    name: 'TYPE',
    pattern: /TYPE/i,
    categories: [ID],
    longer_alt: ID
});
export const LIKE = createToken({
    name: 'LIKE',
    pattern: /LIKE/i,
    categories: [ID],
    longer_alt: ID
});
export const SET = createToken({
    name: 'SET',
    pattern: /SET/i,
    categories: [ID, ReadStatementType, LocateType],
    longer_alt: ID
});
export const BIT = createToken({
    name: 'BIT',
    pattern: /BIT/i,
    categories: [ID, DefaultAttribute, AllocateAttributeType],
    longer_alt: ID
});
export const PipePipeEquals = createToken({
    name: 'PipePipeEquals',
    pattern: '||=',
    categories: [AssignmentOperator]
});
export const StarStarEquals = createToken({
    name: 'StarStarEquals',
    pattern: '**=',
    categories: [AssignmentOperator]
});
export const END = createToken({
    name: 'END',
    pattern: /END/i,
    categories: [ID],
    longer_alt: ID
});
export const AND = createToken({
    name: 'AND',
    pattern: /AND/i,
    categories: [ID, DefaultAttributeBinaryOperator],
    longer_alt: ID
});
export const NOT = createToken({
    name: 'NOT',
    pattern: /NOT/i,
    categories: [ID],
    longer_alt: ID
});
export const HEX = createToken({
    name: 'HEX',
    pattern: /HEX/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const INT = createToken({
    name: 'INT',
    pattern: /INT/i,
    categories: [ID, DefaultAttribute],
    longer_alt: ID
});
export const KEY = createToken({
    name: 'KEY',
    pattern: /KEY/i,
    categories: [ID, FileReferenceConditions, ReadStatementType, RewriteStatementType],
    longer_alt: ID
});
export const GET = createToken({
    name: 'GET',
    pattern: /GET/i,
    categories: [ID],
    longer_alt: ID
});
export const PUT = createToken({
    name: 'PUT',
    pattern: /PUT/i,
    categories: [ID],
    longer_alt: ID
});
export const VX = createToken({
    name: 'VX',
    pattern: /V(1|2|3)/i,
    categories: [ID],
    longer_alt: ID
});
export const IN = createToken({
    name: 'IN',
    pattern: /IN/i,
    categories: [ID],
    longer_alt: ID
});
export const BY = createToken({
    name: 'BY',
    pattern: /BY/i,
    categories: [ID],
    longer_alt: ID
});
export const PlusEquals = createToken({
    name: 'PlusEquals',
    pattern: '+=',
    categories: [AssignmentOperator]
});
export const MinusEquals = createToken({
    name: 'MinusEquals',
    pattern: '-=',
    categories: [AssignmentOperator]
});
export const StarEquals = createToken({
    name: 'StarEquals',
    pattern: '*=',
    categories: [AssignmentOperator]
});
export const SlashEquals = createToken({
    name: 'SlashEquals',
    pattern: '/=',
    categories: [AssignmentOperator]
});
export const PipeEquals = createToken({
    name: 'PipeEquals',
    pattern: '|=',
    categories: [AssignmentOperator]
});
export const AmpersandEquals = createToken({
    name: 'AmpersandEquals',
    pattern: '&=',
    categories: [AssignmentOperator]
});
export const NotEquals = createToken({
    name: 'NotEquals',
    pattern: /¬=|\^=/,
    categories: [AssignmentOperator, BinaryOperator]
});
export const LessThanGreaterThan = createToken({
    name: 'LessThanGreaterThan',
    pattern: '<>',
    categories: [AssignmentOperator]
});
export const OR = createToken({
    name: 'OR',
    pattern: /OR/i,
    categories: [ID, DefaultAttributeBinaryOperator],
    longer_alt: ID
});
export const DO = createToken({
    name: 'DO',
    pattern: /DO/i,
    categories: [ID],
    longer_alt: ID
});
export const TO = createToken({
    name: 'TO',
    pattern: /TO/i,
    categories: [ID],
    longer_alt: ID
});
export const GO = createToken({
    name: 'GO',
    pattern: /GO/i,
    categories: [ID],
    longer_alt: ID
});
export const IF = createToken({
    name: 'IF',
    pattern: /IF/i,
    categories: [ID],
    longer_alt: ID
});
export const ON = createToken({
    name: 'ON',
    pattern: /ON/i,
    categories: [ID],
    longer_alt: ID
});
export const NotLessThan = createToken({
    name: 'NotLessThan',
    pattern: /¬<|\^</,
    categories: [BinaryOperator]
});
export const LessThanEquals = createToken({
    name: 'LessThanEquals',
    pattern: '<=',
    categories: [BinaryOperator]
});
export const GreaterThanEquals = createToken({
    name: 'GreaterThanEquals',
    pattern: '>=',
    categories: [BinaryOperator]
});
export const NotGreaterThan = createToken({
    name: 'NotGreaterThan',
    pattern: /¬>|\^>/,
    categories: [BinaryOperator]
});
export const PipePipe = createToken({
    name: 'PipePipe',
    pattern: '||',
    categories: [BinaryOperator]
});
export const ExclamationMarkExclamationMark = createToken({
    name: 'ExclamationMarkExclamationMark',
    pattern: '!!',
    categories: [BinaryOperator]
});
export const StarStar = createToken({
    name: 'StarStar',
    pattern: '**',
    categories: [BinaryOperator]
});
export const MinusGreaterThan = createToken({
    name: 'MinusGreaterThan',
    pattern: '->'
});
export const EqualsGreaterThan = createToken({
    name: 'EqualsGreaterThan',
    pattern: '=>'
});
export const Semicolon = createToken({
    name: 'Semicolon',
    pattern: ';'
});
export const OpenParen = createToken({
    name: 'OpenParen',
    pattern: '('
});
export const CloseParen = createToken({
    name: 'CloseParen',
    pattern: ')'
});
export const Colon = createToken({
    name: 'Colon',
    pattern: ':'
});
export const Comma = createToken({
    name: 'Comma',
    pattern: ','
});
export const Star = createToken({
    name: 'Star',
    pattern: '*',
    categories: [BinaryOperator]
});
export const Equals = createToken({
    name: 'Equals',
    pattern: '=',
    categories: [BinaryOperator, AssignmentOperator]
});
export const A = createToken({
    name: 'A',
    pattern: /A/i,
    categories: [ID],
    longer_alt: ID
});
export const B = createToken({
    name: 'B',
    pattern: /B/i,
    categories: [ID],
    longer_alt: ID
});
export const C = createToken({
    name: 'C',
    pattern: /C/i,
    categories: [ID],
    longer_alt: ID
});
export const F = createToken({
    name: 'F',
    pattern: /F/i,
    categories: [ID],
    longer_alt: ID
});
export const E = createToken({
    name: 'E',
    pattern: /E/i,
    categories: [ID],
    longer_alt: ID
});
export const G = createToken({
    name: 'G',
    pattern: /G/i,
    categories: [ID],
    longer_alt: ID
});
export const P = createToken({
    name: 'P',
    pattern: /P/i,
    categories: [ID],
    longer_alt: ID
});
export const L = createToken({
    name: 'L',
    pattern: /L/i,
    categories: [ID],
    longer_alt: ID
});
export const R = createToken({
    name: 'R',
    pattern: /R/i,
    categories: [ID],
    longer_alt: ID
});
export const V = createToken({
    name: 'V',
    pattern: /V/i,
    categories: [ID],
    longer_alt: ID
});
export const X = createToken({
    name: 'X',
    pattern: /X/i,
    categories: [ID],
    longer_alt: ID
});
export const Pipe = createToken({
    name: 'Pipe',
    pattern: '|',
    categories: [BinaryOperator]
});
export const Not = createToken({
    name: 'Not',
    pattern: /¬|\^/,
    categories: [BinaryOperator, UnaryOperator]
});
export const Ampersand = createToken({
    name: 'Ampersand',
    pattern: '&',
    categories: [BinaryOperator]
});
export const LessThan = createToken({
    name: 'LessThan',
    pattern: '<',
    categories: [BinaryOperator]
});
export const GreaterThan = createToken({
    name: 'GreaterThan',
    pattern: '>',
    categories: [BinaryOperator]
});
export const Plus = createToken({
    name: 'Plus',
    pattern: '+',
    categories: [BinaryOperator, UnaryOperator]
});
export const Minus = createToken({
    name: 'Minus',
    pattern: '-',
    categories: [BinaryOperator, UnaryOperator]
});
export const Slash = createToken({
    name: 'Slash',
    pattern: '/',
    categories: [BinaryOperator],
    longer_alt: [ML_COMMENT, SL_COMMENT]
});
export const Dot = createToken({
    name: 'Dot',
    pattern: '.'
});

export const terminals = [
    WS,
    ExecFragment,
    ID,
    NUMBER,
    STRING_TERM,
    ML_COMMENT,
    SL_COMMENT
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
    ASSIGNABLE,
    CONTROLLED,
    NONVARYING,
    SEQUENTIAL,
    CONVERSION,
    STRINGSIZE,
    ZERODIVIDE,
    INITACROSS,
    VALUERANGE,
    NOEXECOPS,
    REDUCIBLE,
    REENTRANT,
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
    PercentINCLUDE,
    PercentNOPRINT,
    OVERFLOW,
    TRANSMIT,
    LINESIZE,
    PAGESIZE,
    PROCESS,
    PROCINC,
    RESIGNAL,
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
    NONASGN,
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
    PercentPUSH,
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
    FREE,
    COPY,
    GOTO,
    THEN,
    ELSE,
    SNAP,
    SIZE,
    OPEN,
    PercentPOP,
    TODO,
    DATA,
    EDIT,
    READ,
    INTO,
    FROM,
    WHEN,
    STOP,
    WAIT,
    DATE,
    TYPE,
    LIKE,
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
    ExclamationMarkExclamationMark,
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
    Dot
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
    SL_COMMENT
];

export const LexerInstance = new Lexer(all);
