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

import { TextDocument } from "vscode-languageserver-textdocument";
import { UriUtils } from "../utils/uri";

export const KNOWN_BUILTINS = "/* Known Builtins */";

/**
 * For CTRL+F: pli-builtin:///builtins.pli
 */

export const BuiltinsUriSchema = "pli-builtin";

export const BuiltinsBoolean = `
 /* Boolean built-in constants */
 DECLARE TRUE  BIT(1) INITIAL(1);
 DECLARE FALSE BIT(1) INITIAL(0);

`;

export const BuiltinsFiles = `
 /* Built-in files */
 DECLARE SYSIN    EXTERNAL STREAM INPUT;
 DECLARE SYSPRINT EXTERNAL STREAM OUTPUT PRINT;

`;

export const BuiltinsSqlcaName = "SQLCA";
export const BuiltinsSqlcaFile = BuiltinsSqlcaName.toLowerCase() + ".pli";
export const BuiltinsSqlcaUri = `${BuiltinsUriSchema}:/${BuiltinsSqlcaFile}`;
export const BuiltinsSqlca = ` DECLARE 1 SQLCA,
    2 SQLCAID CHAR(8),
    2 SQLCABC FIXED(31) BINARY,
    2 SQLCODE FIXED(31) BINARY,
    2 SQLERRM CHAR(70) VAR,
    2 SQLERRP CHAR(8),
    2 SQLERRD(6) FIXED(31) BINARY,
    2 SQLWARN,
      3 SQLWARN0 CHAR(1),
      3 SQLWARN1 CHAR(1),
      3 SQLWARN2 CHAR(1),
      3 SQLWARN3 CHAR(1),
      3 SQLWARN4 CHAR(1),
      3 SQLWARN5 CHAR(1),
      3 SQLWARN6 CHAR(1),
      3 SQLWARN7 CHAR(1),
    2 SQLEXT,
      3 SQLWARN8 CHAR(1),
      3 SQLWARN9 CHAR(1),
      3 SQLWARNA CHAR(1),
      3 SQLSTATE CHAR(5);
`;

export const BuiltinsSqlcaDocument = TextDocument.create(
  UriUtils.toUri(BuiltinsSqlcaUri).toString(),
  "pli",
  0,
  BuiltinsSqlca,
);

export const BuiltinsSqldaName = "SQLDA";
export const BuiltinsSqldaFile = BuiltinsSqldaName.toLowerCase() + ".pli";
export const BuiltinsSqldaUri = `${BuiltinsUriSchema}:/${BuiltinsSqldaFile}`;
export const BuiltinsSqlda = ` DECLARE
  1 SQLDA BASED(SQLDAPTR),
    2 SQLDAID CHAR(8),
    2 SQLDABC FIXED(31) BINARY,
    2 SQLN    FIXED(15) BINARY,
    2 SQLD    FIXED(15) BINARY,
    2 SQLVAR(SQLSIZE REFER(SQLN)),
      3 SQLTYPE  FIXED(15) BINARY,
      3 SQLLEN   FIXED(15) BINARY,
      3 SQLDATA  POINTER,
      3 SQLIND   POINTER,
      3 SQLNAME  CHAR(30)  VAR;
 /* */
 DECLARE
  1 SQLDA2 BASED(SQLDAPTR),
    2 SQLDAID2 CHAR(8),
    2 SQLDABC2 FIXED(31) BINARY,
    2 SQLN2    FIXED(15) BINARY,
    2 SQLD2    FIXED(15) BINARY,
    2 SQLVAR2(SQLSIZE REFER(SQLN2)),
      3 SQLBIGLEN,
        4 SQLLONGL FIXED(31) BINARY,
        4 SQLRSVDL FIXED(31) BINARY,
      3 SQLDATAL POINTER,
      3 SQLTNAME CHAR(30) VAR;
 /* */
 DECLARE SQLSIZE    FIXED(15) BINARY;
 DECLARE SQLDAPTR   POINTER;
 DECLARE SQLTRIPLED CHAR(1)   INITIAL('3');
 DECLARE SQLDOUBLED CHAR(1)   INITIAL('2');
 DECLARE SQLSINGLED CHAR(1)   INITIAL(' ');
`;

export const BuiltinsSqldaDocument = TextDocument.create(
  UriUtils.toUri(BuiltinsSqldaUri).toString(),
  "pli",
  0,
  BuiltinsSqlda,
);

export const BuiltinsTypeFunctions = `
 BIND: PROC (t, p); END;
 CAST: PROC (t, x); END;
 FIRST: PROC (t); END;
 LAST: PROC (t); END;
 NEW: PROC (t); END;
 RESPEC: PROC (t, x); END;
 SIZE: PROC (t); END;
 VALUE: PROC (t); END;
`;

export const BuiltinsFile = "builtins.pli";
export const BuiltinsUri = `${BuiltinsUriSchema}:/${BuiltinsFile}`;
export const Builtins =
  ` /* Arithmetic built-in functions */
 ABS: PROC (value) RETURNS ();
 END;

 CEIL: PROC (value) RETURNS ();
 END;

 COMPLEX: CPLX:  PROC (real, imag) RETURNS (COMPLEX);
 END;

 CONJG: PROC (value) RETURNS (COMPLEX);
 END;

 FLOOR: PROC (value) RETURNS ();
 END;

 IMAG: PROC (value) RETURNS ();
 END;

 MAX: PROC (value1, value2) RETURNS ();
 END;

 MAXVAL: PROC (array) RETURNS ();
 END;

 MIN: PROC (value1, value2) RETURNS ();
 END;

 MINVAL: PROC (array) RETURNS ();
 END;

 MOD: PROC (value1, value2) RETURNS ();
 END;

 RANDOM: PROC () RETURNS ();
 END;

 REAL: PROC (value) RETURNS ();
 END;

 REM: PROC (value1, value2) RETURNS ();
 END;

 ROUND: PROC (value) RETURNS ();
 END;

 // ROUNDDEC is a deprecated name for ROUNDAWAYFROMZERO
 ROUNDAWAYFROMZERO: ROUNDDEC: PROC (value) RETURNS ();
 END;

 ROUNDTOEVEN: PROC (value) RETURNS ();
 END;

 SIGN: PROC (value) RETURNS ();
 END;

 TRUNC: PROC (value) RETURNS ();
 END;

 /* Array handling functions */
 ALL: PROC (array) RETURNS ();
 END;

 ANY: PROC (array) RETURNS ();
 END;

 DIMENSION: DIM: PROC (array) RETURNS ();
 END;

 HBOUND: PROC (array) RETURNS ();
 END;

 HBOUNDACROSS: PROC (array) RETURNS ();
 END;

 INARRAY: PROC (array, value) RETURNS ();
 END;

 LBOUND: PROC (array) RETURNS ();
 END;

 LBOUNDACROSS: PROC (array) RETURNS ();
 END;

 POLY: PROC (array, value) RETURNS ();
 END;

 PROD: PROC (array) RETURNS ();
 END;

 QUICKSORT: PROC (array) RETURNS ();
 END;

 QUICKSORTX: PROC (array, fn) RETURNS ();
 END;

 SUM: PROC (array) RETURNS ();
 END;

 /* Buffer management functions */
 COMPARE: PROC (buffer1, buffer2) RETURNS ();
 END;

 HEXENCODE: PROC (buffer) RETURNS ();
 END;

 HEXENCODE8: PROC (buffer) RETURNS ();
 END;

 HEXIMAGE: PROC (buffer) RETURNS ();
 END;

 HEXIMAGE8: PROC (buffer) RETURNS ();
 END;

 MEMCONVERT: PROC (buffer, from, to) RETURNS ();
 END;

 MEMCOLLAPSE: PROC (buffer) RETURNS ();
 END;

 MEMCU12: PROC (buffer, target) RETURNS ();
 END;

 MEMCU14: PROC (buffer, target) RETURNS ();
 END;

 MEMCU21: PROC (buffer, target) RETURNS ();
 END;

 MEMCU24: PROC (buffer, target) RETURNS ();
 END;

 MEMCU41: PROC (buffer, target) RETURNS ();
 END;

 MEMCU42: PROC (buffer, target) RETURNS ();
 END;

 MEMINDEX: PROC (buffer, value) RETURNS ();
 END;

 MEMREPLACE: PROC (buffer, value, replacement) RETURNS ();
 END;

 MEMSEARCH: PROC (buffer, value) RETURNS ();
 END;

 MEMSEARCHR: PROC (buffer, value) RETURNS ();
 END;

 MEMSQUEEZE: PROC (buffer, target, replacement) RETURNS ();
 END;

 /** 
  * Searches for the first nonoccurrence of any one of the elements of 
  * a string within a buffer. 
  */
 MEMVERIFY: PROC (buffer, value) RETURNS ();
 END;

 MEMVERIFYR: PROC (buffer, value) RETURNS ();
 END;

 WHEREDIFF: PROC (buffer1, buffer2) RETURNS ();
 END;

 WSCOLLAPSE: PROC (buffer, target) RETURNS ();
 END;

 WSCOLLAPSE16: PROC (buffer, target) RETURNS ();
 END;

 WSREPLACE: PROC (buffer, target) RETURNS ();
 END;

 WSREPLACE16: PROC (buffer, target) RETURNS ();
 END;

 XMLCHAR: PROC (buffer) RETURNS ();
 END;

 XMLSCRUB: PROC (buffer) RETURNS ();
 END;

 XMLSCRUB16: PROC (buffer) RETURNS ();
 END;

 XMLUCHAR: PROC (buffer) RETURNS ();
 END;

 /* Condition handling builtins */
 DATAFIELD: PROC () RETURNS ();
 END;
 ONACTUAL: PROC () RETURNS ();
 END;
 ONAREA: PROC () RETURNS ();
 END;
 ONCHAR: PROC () RETURNS ();
 END;
 ONEXPECTED: PROC () RETURNS ();
 END;
 ONCODE: PROC () RETURNS ();
 END;
 ONCONDCOND: PROC () RETURNS ();
 END;
 ONCONDID: PROC () RETURNS ();
 END;
 ONCOUNT: PROC () RETURNS ();
 END;
 ONFILE: PROC () RETURNS ();
 END;
 ONGSOURCE: PROC () RETURNS ();
 END;
 ONHBOUND: PROC () RETURNS ();
 END;
 ONJSONNAME: PROC () RETURNS ();
 END;
 ONKEY: PROC () RETURNS ();
 END;
 ONLBOUND: PROC () RETURNS ();
 END;
 ONLINE: PROC () RETURNS ();
 END;
 ONLOC: PROC () RETURNS ();
 END;
 ONOFFSET: PROC () RETURNS ();
 END;
 ONOPERATOR: PROC () RETURNS ();
 END;
 ONPACKAGE: PROC () RETURNS ();
 END;
 ONPROCEDURE: ONPROC: PROC () RETURNS ();
 END;
 ONSOURCE: PROC () RETURNS ();
 END;
 ONSUBSCRIPT: PROC () RETURNS ();
 END;
 ONTEXT: PROC () RETURNS ();
 END;
 ONUCHAR: PROC () RETURNS ();
 END;
 ONUSOURCE: PROC () RETURNS ();
 END;
 ONWCHAR: PROC () RETURNS ();
 END;
 ONWSOURCE: PROC () RETURNS ();
 END;

 /* Date and time functions */
 DATE: PROC () RETURNS ();
 END;

 DATETIME: PROC () RETURNS ();
 END;

 DAYS: PROC () RETURNS ();
 END;

 DAYSTODATE: PROC (days) RETURNS ();
 END;

 DAYSTOMICROSECS: PROC (days) RETURNS ();
 END;

 DAYSTOSECS: PROC (days) RETURNS ();
 END;

 JULIANTOSMF: PROC (julian) RETURNS ();
 END;

 MAXDATE: PROC () RETURNS ();
 END;

 MICROSECS: PROC () RETURNS ();
 END;

 MICROSECSTODATE: PROC (microsecs) RETURNS ();
 END;

 MICROSECSTODAYS: PROC (microsecs) RETURNS ();
 END;

 MINDATE: PROC () RETURNS ();
 END;

 REPATTERN: PROC () RETURNS ();
 END;

 SECS: PROC () RETURNS ();
 END;

 SECSTODATE: PROC (secs) RETURNS ();
 END;

 SECSTODAYS: PROC (secs) RETURNS ();
 END;

 SMFTOJULIAN: PROC (smf) RETURNS ();
 END;

 STCKETODATE: PROC (stck) RETURNS ();
 END;

 STCKTODATE: PROC (stck) RETURNS ();
 END;

 TIME: PROC () RETURNS ();
 END;

 TIMESTAMP: PROC () RETURNS ();
 END;

 UTCDATETIME: PROC () RETURNS ();
 END;

 UTCMICROSECS: PROC () RETURNS ();
 END;

 UTCSECS: PROC () RETURNS ();
 END;

 VALIDDATE: PROC (date) RETURNS ();
 END;

 WEEKDAY: PROC (date) RETURNS ();
 END;

 Y4DATE: PROC (date) RETURNS ();
 END;

 Y4JULIAN: PROC (julian) RETURNS ();
 END;

 Y4YEAR: PROC (date) RETURNS ();
 END;

 /* Encoding and hashing functions */
 BASE64DECODE: PROC (buffer) RETURNS ();
 END;
 BASE64DECODE8: PROC (buffer) RETURNS ();
 END;
 BASE64DECODE16: PROC (buffer) RETURNS ();
 END;
 BASE64ENCODE: PROC (buffer) RETURNS ();
 END;
 BASE64ENCODE8: PROC (buffer) RETURNS ();
 END;
 BASE64ENCODE16: PROC (buffer) RETURNS ();
 END;
 CHECKSUM: PROC (buffer) RETURNS ();
 END;
 HEXDECODE: PROC (buffer) RETURNS ();
 END;
 HEXDECODE8: PROC (buffer) RETURNS ();
 END;
 SHA1DIGEST: PROC (buffer) RETURNS ();
 END;
 SHA1FINAL: PROC (buffer) RETURNS ();
 END;
 SHA1INIT: PROC (buffer) RETURNS ();
 END;
 SHA1UPDATE: PROC (buffer) RETURNS ();
 END;
 SHA2DIGEST224: PROC (buffer) RETURNS ();
 END;
 SHA2DIGEST256: PROC (buffer) RETURNS ();
 END;
 SHA2DIGEST384: PROC (buffer) RETURNS ();
 END;
 SHA2DIGEST512: PROC (buffer) RETURNS ();
 END;
 SHA2FINAL224: PROC (buffer) RETURNS ();
 END;
 SHA2FINAL256: PROC (buffer) RETURNS ();
 END;
 SHA2FINAL384: PROC (buffer) RETURNS ();
 END;
 SHA2FINAL512: PROC (buffer) RETURNS ();
 END;
 SHA2INIT224: PROC (buffer) RETURNS ();
 END;
 SHA2INIT256: PROC (buffer) RETURNS ();
 END;
 SHA2INIT384: PROC (buffer) RETURNS ();
 END;
 SHA2INIT512: PROC (buffer) RETURNS ();
 END;
 SHA2UPDATE224: PROC (buffer) RETURNS ();
 END;
 SHA2UPDATE256: PROC (buffer) RETURNS ();
 END;
 SHA2UPDATE384: PROC (buffer) RETURNS ();
 END;
 SHA2UPDATE512: PROC (buffer) RETURNS ();
 END;
 SHA3DIGEST224: PROC (buffer) RETURNS ();
 END;
 SHA3DIGEST256: PROC (buffer) RETURNS ();
 END;
 SHA3DIGEST384: PROC (buffer) RETURNS ();
 END;
 SHA3DIGEST512: PROC (buffer) RETURNS ();
 END;
 SHA3FINAL224: PROC (buffer) RETURNS ();
 END;
 SHA3FINAL256: PROC (buffer) RETURNS ();
 END;
 SHA3FINAL384: PROC (buffer) RETURNS ();
 END;
 SHA3FINAL512: PROC (buffer) RETURNS ();
 END;
 SHA3INIT224: PROC (buffer) RETURNS ();
 END;
 SHA3INIT256: PROC (buffer) RETURNS ();
 END;
 SHA3INIT384: PROC (buffer) RETURNS ();
 END;
 SHA3INIT512: PROC (buffer) RETURNS ();
 END;
 SHA3UPDATE224: PROC (buffer) RETURNS ();
 END;
 SHA3UPDATE256: PROC (buffer) RETURNS ();
 END;
 SHA3UPDATE384: PROC (buffer) RETURNS ();
 END;
 SHA3UPDATE512: PROC (buffer) RETURNS ();
 END;

 /* Floating point inquiry functions */
 EPSILON: PROC () RETURNS ();
 END;
 HUGE: PROC () RETURNS ();
 END;
 ISFINITE: PROC (value) RETURNS ();
 END;
 ISINF: PROC (value) RETURNS ();
 END;
 ISNAN: PROC (value) RETURNS ();
 END;
 ISNORMAL: PROC (value) RETURNS ();
 END;
 ISZERO: PROC (value) RETURNS ();
 END;
 MAXEXP: PROC () RETURNS ();
 END;
 MINEXP: PROC () RETURNS ();
 END;
 PLACES: PROC (value) RETURNS ();
 END;
 RADIX: PROC (value) RETURNS ();
 END;
 TINY: PROC () RETURNS ();
 END;
 EXPONENT: PROC (value) RETURNS ();
 END;
 PRED: PROC (value) RETURNS ();
 END;
 SCALE: PROC (value, radix) RETURNS ();
 END;
 SUCC: PROC (value) RETURNS ();
 END;

 /* INPUT/OUTPUT functions */
 COUNT: PROC (value) RETURNS (); END;
 ENDFILE: PROC (value) RETURNS (); END;
 FILEDDINT: PROC (value) RETURNS (); END;
 FILEDDTEST: PROC (value) RETURNS (); END;
 FILEDDWORD: PROC (value) RETURNS (); END;
 FILEID: PROC (value) RETURNS (); END;
 FILENEW: PROC (value) RETURNS (); END;
 FILEOPEN: PROC (value) RETURNS (); END;
 FILEREAD: PROC (value) RETURNS (); END;
 FILESEEK: PROC (value) RETURNS (); END;
 FILETELL: PROC (value) RETURNS (); END;
 FILEWRITE: PROC (value) RETURNS (); END;
 LINENO: PROC (value) RETURNS (); END;
 ONSUBCODE: PROC (value) RETURNS (); END;
 ONSUBCODE2: PROC (value) RETURNS (); END;
 PAGENO: PROC (value) RETURNS (); END;
 SAMEKEY: PROC (value) RETURNS (); END;

 /* Integer manipulation built-in functions */
 IAND: PROC (value) RETURNS (); END;
 ICLZ: PROC (value) RETURNS (); END;
 IEOR: PROC (value) RETURNS (); END;
 INOT: PROC (value) RETURNS (); END;
 IOR: PROC (value) RETURNS (); END;
 ISIGNED: PROC (value) RETURNS (); END;
 ISLL: PROC (value) RETURNS (); END;
 ISRL: PROC (value) RETURNS (); END;
 IUNSIGNED: PROC (value) RETURNS (); END;
 LOWER2: PROC (value) RETURNS (); END;
 RAISE2: PROC (value) RETURNS (); END;

 /* JSON built-in functions */
 JSONGETARRAYEND: PROC (value) RETURNS (); END;
 JSONGETARRAYSTART: PROC (value) RETURNS (); END;
 JSONGETCOLON: PROC (value) RETURNS (); END;
 JSONGETCOMMA: PROC (value) RETURNS (); END;
 JSONGETMEMBER: PROC (value) RETURNS (); END;
 JSONGETOBJECTEND: PROC (value) RETURNS (); END;
 JSONGETOBJECTSTART: PROC (value) RETURNS (); END;
 JSONGETVALUE: PROC (value) RETURNS (); END;
 JSONPUTARRAYEND: PROC (value) RETURNS (); END;
 JSONPUTARRAYSTART: PROC (value) RETURNS (); END;
 JSONPUTCOLON: PROC (value) RETURNS (); END;
 JSONPUTCOMMA: PROC (value) RETURNS (); END;
 JSONPUTMEMBER: PROC (value) RETURNS (); END;
 JSONPUTOBJECTEND: PROC (value) RETURNS (); END;
 JSONPUTOBJECTSTART: PROC (value) RETURNS (); END;
 JSONPUTVALUE: PROC (value) RETURNS (); END;
 JSONVALID: PROC (value) RETURNS (); END;

 /* Mathematical built-in functions */
 ACOS: PROC (value) RETURNS (); END;
 ASIN: PROC (value) RETURNS (); END;
 ATAN: PROC (value) RETURNS (); END;
 ATAND: PROC (value) RETURNS (); END;
 ATANH: PROC (value) RETURNS (); END;
 COS: PROC (value) RETURNS (); END;
 COSD: PROC (value) RETURNS (); END;
 COSH: PROC (value) RETURNS (); END;
 ERF: PROC (value) RETURNS (); END;
 ERFC: PROC (value) RETURNS (); END;
 EXP: PROC (value) RETURNS (); END;
 GAMMA: PROC (value) RETURNS (); END;
 LOG: PROC (value) RETURNS (); END;
 LOG10: PROC (value) RETURNS (); END;
 LOG2: PROC (value) RETURNS (); END;
 LOGGAMMA: PROC (value) RETURNS (); END;
 SIN: PROC (value) RETURNS (); END;
 SIND: PROC (value) RETURNS (); END;
 SINH: PROC (value) RETURNS (); END;
 SQRT: PROC (value) RETURNS (); END;
 SQRTF: PROC (value) RETURNS (); END;
 TAN: PROC (value) RETURNS (); END;
 TAND: PROC (value) RETURNS (); END;
 TANH: PROC (value) RETURNS (); END;

 /* Miscellaneous built-in functions */
 ALLCOMPARE: PROC (value) RETURNS (); END;
 BETWEEN: PROC (value) RETURNS (); END;
 BETWEENEXCLUSIVE: PROC (value) RETURNS (); END;
 BETWEENLEFTEXCLUSIVE: PROC (value) RETURNS (); END;
 BETWEENRIGHTEXCLUSIVE: PROC (value) RETURNS (); END;
 BINSEARCH: PROC (value) RETURNS (); END;
 BINSEARCHX: PROC (value) RETURNS (); END;
 BYTELENGTH: PROC (value) RETURNS (); END;
 CDS: PROC (value) RETURNS (); END;
 // BYTE is a synonym for CHARVAL
 CHARVAL: BYTE: PROC (value) RETURNS (); END;
 CODEPAGE: PROC (value) RETURNS (); END;
 COLLATE: PROC (value) RETURNS (); END;
 CS: PROC (value) RETURNS (); END;
 FOLDEDFULLMATCH: PROC (value) RETURNS (); END;
 FOLDEDSIMPLEMATCH: PROC (value) RETURNS (); END;
 GETENV: PROC (value) RETURNS (); END;
 GETJCLSYMBOL: PROC (value) RETURNS (); END;
 GETSYSINT: PROC (value) RETURNS (); END;
 GETSYSWORD: PROC (value) RETURNS (); END;
 GTCA: PROC (value) RETURNS (); END;
 HEX: PROC (value) RETURNS (); END;
 HEX8: PROC (value) RETURNS (); END;
 IFTHENELSE: PROC (value) RETURNS (); END;
 INDICATORS: PROC (value) RETURNS (); END;
 INLIST: PROC (value) RETURNS (); END;
 ISJCLSYMBOL: PROC (value) RETURNS (); END;
 ISMAIN: PROC (value) RETURNS (); END;
 MAINNAME: PROC (value) RETURNS (); END;
 OMITTED: PROC (value) RETURNS (); END;
 PACKAGENAME: PROC (value) RETURNS (); END;
 PLIRETV: PROC (value) RETURNS (); END;
 POPCNT: PROC (value) RETURNS (); END;
 PRESENT: PROC (value) RETURNS (); END;
 PROCEDURENAME: PROCNAME: PROC (value) RETURNS (); END;
 PUTENV: PROC (value) RETURNS (); END;
 RANK: PROC (value) RETURNS (); END;
 SOURCEFILE: PROC (value) RETURNS (); END;
 SOURCELINE: PROC (value) RETURNS (); END;
 STACKADDR: PROC (value) RETURNS (); END;
 STRING: PROC (value) RETURNS (); END;
 SYSTEM: PROC () RETURNS (); END;
 SYSPARM: PROC () RETURNS (); END;
 THREADID: PROC (value) RETURNS (); END;
 UNHEX: PROC (value) RETURNS (); END;
 UNSPEC: PROC (value) RETURNS (); END;
 UUID: PROC (value) RETURNS (); END;
 UUID4: PROC (value) RETURNS (); END;
 VALID: PROC (value) RETURNS (); END;
 VALIDVALUE: PROC (value) RETURNS (); END;
 WCHARVAL: PROC (value) RETURNS (); END;

 /* Ordinal-handling built-in functions */
 ORDINALNAME: PROC (value) RETURNS (); END;
 ORDINALPRED: PROC (value) RETURNS (); END;
 ORDINALSUCC: PROC (value) RETURNS (); END;

 /* Precision-handling built-in functions */
 ADD: PROC (value) RETURNS (); END;
 BINARY: PROC (value) RETURNS (); END;
 BIN: PROC (value) RETURNS (); END;
 DECIMAL: DEC: PROC (value) RETURNS (); END;
 DIVIDE: PROC (value) RETURNS (); END;
 FIXED: PROC (value) RETURNS (); END;
 FIXEDBIN: PROC (value) RETURNS (); END;
 FIXEDDEC: PROC (value) RETURNS (); END;
 FLOAT: PROC (value) RETURNS (); END;
 FLOATBIN: PROC (value) RETURNS (); END;
 FLOATDEC: PROC (value) RETURNS (); END;
 MULTIPLY: PROC (value) RETURNS (); END;
 PRECVAL: PROC (value) RETURNS (); END;
 PRECISION: PREC: PROC (value) RETURNS (); END;
 SCALEVAL: PROC (value) RETURNS (); END;
 SIGNED: PROC (value) RETURNS (); END;
 SUBTRACT: PROC (value) RETURNS (); END;
 UNSIGNED: PROC (value) RETURNS (); END;

 /* Pseudovariables: THESE ARE ALREADY DEFINED IN OTHER PLACES */
 /* ENTRYADDR: PROC (value) RETURNS (); END;
 IMAG: PROC (value) RETURNS (); END;
 ONCHAR: PROC (value) RETURNS (); END;
 ONGSOURCE: PROC (value) RETURNS (); END;
 ONSOURCE: PROC (value) RETURNS (); END;
 REAL: PROC (value) RETURNS (); END;
 STRING: PROC (value) RETURNS (); END;
 SUBSTR: PROC (value) RETURNS (); END;
 SUBTO: PROC (value) RETURNS (); END;
 ONUCHAR: PROC (value) RETURNS (); END;
 ONUSOURCE: PROC (value) RETURNS (); END;
 ONWCHAR: PROC (value) RETURNS (); END;
 ONWSOURCE: PROC (value) RETURNS (); END;
 TYPE: PROC (value) RETURNS (); END;
 UNSPEC: PROC (value) RETURNS (); END; */

 /* Storage control built-in functions */
 ADDR: PROC (value) RETURNS (); END;
 ADDRDATA: PROC (value) RETURNS (); END;
 ALLOC31: PROC (value) RETURNS (); END;
 ALLOCATE: PROC (value) RETURNS (); END;
 ALLOC: PROC (value) RETURNS (); END;
 ALLOCATION: PROC (value) RETURNS (); END;
 ALLOCN: PROC (value) RETURNS (); END;
 ALLOCNEXT: PROC (value) RETURNS (); END;
 ALLOCSIZE: PROC (value) RETURNS (); END;
 AUTOMATIC: PROC (value) RETURNS (); END;
 AUTO: PROC (value) RETURNS (); END;
 AVAILABLEAREA: PROC (value) RETURNS (); END;
 BINARYVALUE: PROC (value) RETURNS (); END;
 BINVALUE: PROC (value) RETURNS (); END;
 BITLOCATION: PROC (value) RETURNS (); END;
 BITLOC: PROC (value) RETURNS (); END;
 CHECKSTG: PROC (value) RETURNS (); END;
 CURRENTSIZE: PROC (value) RETURNS (); END;
 CURRENTSTORAGE: CSTG:  PROC (value) RETURNS (); END;
 CSTG: PROC (value) RETURNS (); END;
 EMPTY: PROC (value) RETURNS (); END;
 ENTRYADDR: PROC (value) RETURNS (); END;
 HANDLE: PROC (value) RETURNS (); END;
 LOCATION: LOC: PROC (value) RETURNS (); END;
 LOCSTG: PROC (value) RETURNS (); END;
 LOCVAL: PROC (value) RETURNS (); END;
 NULL: PROC (value) RETURNS (); END;
 NULLENTRY: PROC (value) RETURNS (); END;
 OFFSET: PROC (value) RETURNS (); END;
 OFFSETADD: PROC (value) RETURNS (); END;
 OFFSETDIFF: PROC (value) RETURNS (); END;
 OFFSETSUBTRACT: PROC (value) RETURNS (); END;
 OFFSETVALUE: PROC (value) RETURNS (); END;
 POINTER: PTR: PROC (value) RETURNS (); END;
 POINTERADD: PTRADD: PROC (value) RETURNS (); END;
 POINTERDIFF: PTRDIFF: PROC (value) RETURNS (); END;
 POINTERSUBTRACT: PTRSUBTRACT: PROC (value) RETURNS (); END;
 POINTERVALUE: PTRVALUE: PROC (value) RETURNS (); END;
 SIZE: PROC (value) RETURNS (); END;
 STORAGE: STG: PROC (value) RETURNS (); END;
 SYSNULL: PROC (value) RETURNS (); END; 
 TYPE: PROC (value) RETURNS (); END;
 UNALLOCATED: PROC (value) RETURNS (); END;
 VARGLIST: PROC (value) RETURNS (); END;
 VARGSIZE: PROC (value) RETURNS (); END;

 /* String-handling built-in functions */
 BIT: PROC (value) RETURNS (); END;
 BOOL: PROC (value) RETURNS (); END;
 CENTERLEFT: CENTRELEFT: CENTER: PROC (value) RETURNS (); END;
 CENTERRIGHT: CENTRERIGHT:  PROC (value) RETURNS (); END;
 CHARACTER: CHAR: PROC (value) RETURNS (); END;
 CHARGRAPHIC: CHARG: PROC (value) RETURNS (); END;
 COLLAPSE: PROC (value) RETURNS (); END;
 COPY: PROC (value) RETURNS (); END;
 EDIT: PROC (value) RETURNS (); END;
 GRAPHIC: PROC (value) RETURNS (); END;
 HIGH: PROC (value) RETURNS (); END;
 INDEX: PROC (value) RETURNS (); END;
 INDEXR: PROC (value) RETURNS (); END;
 LEFT: PROC (value) RETURNS (); END;
 LENGTH: PROC (value) RETURNS (); END;
 LOW: PROC (value) RETURNS (); END;
 LOWERASCII: PROC (value) RETURNS (); END;
 LOWERCASE: PROC (value) RETURNS (); END;
 LOWERLATIN1: PROC (value) RETURNS (); END;
 MAXLENGTH: PROC (value) RETURNS (); END;
 MPSTR: PROC (value) RETURNS (); END;
 PICSPEC: PROC (value) RETURNS (); END;
 REGEX: PROC (value) RETURNS (); END;
 REPEAT: PROC (value) RETURNS (); END;
 REPLACE: PROC (value) RETURNS (); END;
 REPLACEBY2: PROC (value) RETURNS (); END;
 REVERSE: PROC (value) RETURNS (); END;
 RIGHT: PROC (value) RETURNS (); END;
 SCRUBOUT: PROC (value) RETURNS (); END;
 SEARCH: PROC (value) RETURNS (); END;
 SEARCHR: PROC (value) RETURNS (); END;
 SQUEEZE: PROC (value) RETURNS (); END;
 SUBSTR: PROC (value) RETURNS (); END;
 SUBTO: PROC (value) RETURNS (); END;
 TALLY: PROC (value) RETURNS (); END;
 TRANSLATE: PROC (value) RETURNS (); END;
 TRIM: PROC (value) RETURNS (); END;
 UHIGH: PROC (value) RETURNS (); END;
 ULENGTH: PROC (value) RETURNS (); END;
 ULENGTH8: PROC (value) RETURNS (); END;
 ULENGTH16: PROC (value) RETURNS (); END;
 ULOW: PROC (value) RETURNS (); END;
 UPOS: PROC (value) RETURNS (); END;
 UPPERASCII: PROC (value) RETURNS (); END;
 UPPERCASE: PROC (value) RETURNS (); END;
 UPPERLATIN1: PROC (value) RETURNS (); END;
 USUBSTR: PROC (value) RETURNS (); END;
 USUPPLEMENTARY: PROC (value) RETURNS (); END;
 UTF8: PROC (value) RETURNS (); END;
 UTF8STG: PROC (value) RETURNS (); END;
 UTF8TOCHAR: PROC (value) RETURNS (); END;
 UTF8TOWCHAR: PROC (value) RETURNS (); END;
 UVALID: PROC (value) RETURNS (); END;
 UWIDTH: PROC (value) RETURNS (); END;
 VERIFY: PROC (value) RETURNS (); END;
 VERIFYR: PROC (value) RETURNS (); END;
 WHIGH: PROC (value) RETURNS (); END;
 WIDECHAR: WCHAR: PROC (value) RETURNS (); END;
 WLOW: PROC (value) RETURNS (); END;

 /* Subroutines */
 LOCNEWSPACE: PROC (value) RETURNS (); END;
 LOCNEWVALUE: PROC (value) RETURNS (); END;
 PLIASCII: PROC (value) RETURNS (); END;
 PLIATTN: PROC (value) RETURNS (); END;
 PLICANC: PROC (value) RETURNS (); END;
 PLICKPT: PROC (value) RETURNS (); END;
 PLIDELETE: PROC (value) RETURNS (); END;
 PLIDUMP: PROC (value) RETURNS (); END;
 PLIEBCDIC: PROC (value) RETURNS (); END;
 PLIFILL: PROC (value) RETURNS (); END;
 PLIFREE: PROC (value) RETURNS (); END;
 PLIMOVE: PROC (value) RETURNS (); END;
 PLIOVER: PROC (value) RETURNS (); END;
 PLIPARSE: PROC (value) RETURNS (); END;
 PLIREST: PROC (value) RETURNS (); END;
 PLIRETC: PROC (value) RETURNS (); END;
 PLISAXA: PROC (value) RETURNS (); END;
 PLISAXB: PROC (value) RETURNS (); END;
 PLISAXC: PROC (value) RETURNS (); END;
 PLISAXD: PROC (value) RETURNS (); END;
 PLISRTA: PROC (value) RETURNS (); END;
 PLISRTB: PROC (value) RETURNS (); END;
 PLISRTC: PROC (value) RETURNS (); END;
 PLISRTD: PROC (value) RETURNS (); END;
 PLISTCK: PROC (value) RETURNS (); END;
 PLISTCKE: PROC (value) RETURNS (); END;
 PLISTCKF: PROC (value) RETURNS (); END;
 PLISTCKLOCAL: PROC (value) RETURNS (); END;
 PLISTCKELOCAL: PROC (value) RETURNS (); END;
 PLISTCKP: PROC (value) RETURNS (); END;
 PLISTCKPLOCAL: PROC (value) RETURNS (); END;
 PLISTCKPUTC: PROC (value) RETURNS (); END;
 PLISTCKUTC: PROC (value) RETURNS (); END;
 PLISTCKEUTC: PROC (value) RETURNS (); END;
 PLITRANxy: PROC (value) RETURNS (); END;

 ${KNOWN_BUILTINS}

 define alias __SIGNED_INT signed fixed bin(31,0);
 define alias __UNSIGNED_INT unsigned fixed bin(32,0);
 ` +
  BuiltinsBoolean +
  BuiltinsFiles +
  BuiltinsTypeFunctions;

export const BuiltinsTextDocument = TextDocument.create(
  UriUtils.toUri(BuiltinsUri).toString(),
  "pli",
  0,
  Builtins,
);

export const BuiltinsMacroFile = "builtins-macro.pli";
export const BuiltinsMacroUri = `${BuiltinsUriSchema}:/${BuiltinsMacroFile}`;
export const BuiltinsMacro = ` /* Preprocessor built-ins */
 /**
  * \`COLLATE\` returns a \`CHARACTER\` string of length 256 comprising
  * the 256 possible character values one time each in the collating
  * order.
  * @returns {CHARACTER} string of length 256 comprising the
  *   256 possible character values one time each in the collating 
  *   order
  */
 COLLATE: PROC RETURNS(CHARACTER); END;

 /**
  * \`COMMENT\` converts a \`CHARACTER\` expression into a comment.
  * @param {CHARACTER} text Expression that is to be converted to a
  *   comment. \`text\` should have \`CHARACTER\` type, and if not,
  *   it is converted thereto.
  * @returns {CHARACTER} \`text\` is enclosed with a &#47;* and an 
  *   *&#47; If \`text\` contains &#47;* or *&#47; composite symbols,
  *   they are replaced by &#47;> and <&#47;, respectively.
  */
 COMMENT: PROC(text) RETURNS(CHARACTER);
   DECLARE text CHARACTER;
 END;

 /**
  * \`COMPILEDATE\` returns a \`CHARACTER\` string of length 17
  * containing the date and the time of the compilation.
  * The format of the string returned by \`COMPILEDATE\` is as follows:
  * | Format | Meaning |
  * |--------|---------|
  * | yyyy | current year |
  * | mm | current month |
  * | dd | current day |
  * | hh | current hour |
  * | mm | current minute |
  * | ss | current second |
  * | ttt | current millisecond |
  * 
  * A leading zero in the day of the month field is replaced by a
  * blank; no other leading zeros are suppressed.
  * 
  * If no timing facility is available, the last 8 characters of the
  * returned string are set to 00.00.00.
  * @returns {CHARACTER} string of length 17 containing the date and
  * the time of the compilation.
  */
 COMPILEDATE: PROC RETURNS(CHARACTER); END;

 /**
  * \`COMPILETIME\` returns a \`CHARACTER\` string of length 18
  * containing the date and the time of compilation.
  * 
  * The format of the string returned by \`COMPILETIME\` is as follows:
  * | Format | Meaning |
  * |--------|---------|
  * | DD | Day of the month |
  * | . | Period |
  * | MMM | Month in the form JAN, FEB, MAR, and so on |
  * | . | Period |
  * | YY | Year |
  * | b | Blank |
  * | HH | Hour |
  * | . | Period |
  * | MM | Minute |
  * | . | Period |
  * | SS | Second |
  * 
  * @returns {CHARACTER} string of length 18 containing the date and
  *   the time of compilation.
  */
 COMPILETIME: PROC RETURNS(CHARACTER); END;

 /**
  * \`COPY\` returns a \`CHARACTER\` string consisting of
  * \`n\` concatenated copies of the string \`string\`.
  * @param {CHARACTER} string Expression. \`string\` should have 
  *   \`CHARACTER\` type, and if not, it is converted thereto.
  * @param {FIXED} n Expression that specifies the number of 
  *   repetitions.
  * 
  *   \`n\` should have \`FIXED\` type, and if not, it is converted
  *   thereto.
  * 
  *   \`n\` must be nonnegative.
  * 
  *   If \`n\` is zero, the result is a null string.
  * @returns {CHARACTER} string consisting of \`n\` concatenated copies
  *   of the string \`string\`.
  */
 COPY: PROC(string, n) RETURNS(CHARACTER);
   DECLARE string CHARACTER;
   DECLARE n FIXED;
 END;

 /**
  * \`COUNTER\` returns a \`CHARACTER\` string of length 5 containing a
  * decimal number. The returned number is 00001 for the first
  * invocation, and increments by one on each successive invocation.
  * 
  * If \`COUNTER\` is invoked 99999 times, the next time it is invoked,
  * a diagnostic message is issued and 00000 is returned. The next
  * invocation after that is treated as the first.
  * 
  * The \`COUNTER\` built-in function can be used to generate unique
  * names, or for counting purposes.
  * @returns {CHARACTER} string of length 5 containing a decimal number
  */
 COUNTER: PROC RETURNS(CHARACTER); END;

 /**
  * \`DIMENSION\` returns a \`FIXED\` value specifying current extent
  * of dimension \`d\` of \`array\`.
  * @param {ANY(*)} array Array reference.
  *   \`array\` must not have less than \`d\` dimensions.
  * @param {FIXED} [d] Expression specifying a particular dimension 
  *   of \`array\`.
  * 
  *   \`d\` should have \`FIXED\` type, and if not, it will be
  *   converted thereto.
  * 
  *   \`d\` must be greater than or equal to 1.
  * 
  *   If \`d\` is not supplied, the default is 1.
  * 
  *   \`d\` can be omitted only if the array is one-dimensional.
  * @returns {FIXED} value specifying current extent of dimension
  *   \`d\` of \`array\`.
  */
 DIMENSION: DIM: PROC(array, d) RETURNS(FIXED);
   DECLARE array ANY(*);
   DECLARE d FIXED OPTIONAL INITIAL(1);
 END;

 /**
  * \`HBOUND\` returns a \`FIXED\` value specifying current upper bound
  * of dimension \`d\` of \`array\`.
  * @param {ANY(*)} array Array reference. \`array\` must not have less
  *   than \`d\` dimensions.
  * @param {FIXED} [d] Expression specifying a particular dimension
  *   of \`array\`.
  * 
  *   \`d\` should have \`FIXED\` type, and if not, it will be
  *   converted thereto.
  * 
  *   \`d\` must be greater than or equal to 1.
  * 
  *   If \`d\` is not supplied, the default is 1.
  * 
  *   \`d\` can be omitted only if the array is one-dimensional.
  * @returns {FIXED} value specifying current upper bound of
  *   dimension \`d\` of \`array\`.
  */
 HBOUND: PROC(array, d) RETURNS(FIXED);
   DECLARE array ANY(*);
   DECLARE d FIXED OPTIONAL INITIAL(1);
 END;

 /**
  * \`INDEX\` returns a \`FIXED\` value indicating the starting position
  * within \`haystack\` of a substring identical to \`needle\`. You can
  * also specify the location within \`haystack\` where processing
  * begins.
  * 
  * If \`needle\` does not occur in \`haystack\`, or if either
  * \`haystack\` or \`needle\` have zero length, the value zero is
  * returned.
  * 
  * \`offset\` must be greater than \`0\` and no greater than
  * \`1 + LENGTH(\`haystack\`)\`.
  * 
  * If \`\`offset\` = LENGTH(\`haystack\`) + 1\`, the result is zero.
  * @param {CHARACTER} haystack Expression to be searched.
  *   \`haystack\` should have \`CHARACTER\` type, and if not, it will
  *   be converted thereto.
  * @param {CHARACTER} needle Target expression of the search.
  *   \`needle\` should have \`CHARACTER\` type, and if not, it will
  *   be converted thereto.
  * @param {FIXED} [offset] \`offset\` specifies the location within
  *   \`haystack\` at which to begin processing.
  * 
  *   \`offset\` should have \`FIXED\` type, and if not, it will
  *   be converted thereto.
  * @returns {FIXED} value indicating the starting position within
  *   \`haystack\` of a substring identical to \`needle\`
  */
 INDEX: PROC(haystack, needle, offset) RETURNS(FIXED);
   DECLARE haystack CHARACTER;
   DECLARE needle CHARACTER;
   DECLARE offset FIXED OPTIONAL INITIAL(1);
 END;

 /**
  * \`LBOUND\` returns a \`FIXED\` value specifying current lower bound
  * of dimension \`d\` of \`array\`.
  * @param {ANY(*)} array Array reference. \`array\` must not have less
  *   than \`d\` dimensions.
  * @param {FIXED} [d] Expression specifying a particular dimension
  *   of \`array\`.
  * 
  *   \`d\` should have \`FIXED\` type, and if not, it will
  *   be converted thereto.
  * 
  *   \`d\` must be greater than or equal to 1.
  * 
  *   If \`d\` is not supplied, the default is 1.
  * 
  *   \`d\` can be omitted only if the array is one-dimensional.
  * @returns {FIXED} value specifying current lower bound of
  *   dimension \`d\` of \`array\`.
  */
 LBOUND: PROC(array, d) RETURNS(FIXED);
   DECLARE array ANY(*);
   DECLARE d FIXED OPTIONAL INITIAL(1);
 END;

 /**
  * \`LENGTH\` returns a \`FIXED\` value specifying the current length
  * of a given character expression.
  * @param {CHARACTER} string Expression. \`string\` should have
  *   \`CHARACTER\` type, and if not, it will be converted thereto.
  * @returns {FIXED} value specifying the current length of the
  *   character expression
  */
 LENGTH: PROC(string) RETURNS(FIXED);
   DECLARE string CHARACTER;
 END;

 /**
  * \`LOWERCASE\` returns a character string with all characters
  * converted to their lowercase equivalent.
  * 
  * \`LOWERCASE(string)\` is equivalent to
  * \`TRANSLATE(string, 'a...z', 'A...Z')\` and
  * \`LOWERCASE(string, codes)\` is equivalent to
  * \`TRANSLATE(string, lowerc, upperc)\`.
  * 
  * The values of \`lowerc\` and \`upperc\` are determined by the value
  * of the code page \`codes\`.
  * 
  * Specifying \`LOWERCASE(string, codes)\` will not only translate
  * alphabetic characters 'A...Z' to 'a...z', but also translate
  * characters such as uppercase Ä-umlaut('4a'x) to
  * lowercase ä-umlaut('c0'x).
  * @param {CHARACTER} string Expression. \`string\` should have
  *   \`CHARACTER\` type, and if not, it will be converted thereto.
  * @param {FIXED} [codes] Expression. Specifies the code page that
  *   will be lowercased.
  * @returns {CHARACTER} character string with all characters 
  *   converted to their lowercase equivalent
  */
 LOWERCASE: PROC(string, codes) RETURNS(CHARACTER);
   DECLARE string CHARACTER;
   DECLARE codes FIXED OPTIONAL;
 END;

 /**
  * \`MACCOL\` returns a \`FIXED\` value that represents the column
  * where the outermost macro invocation starts in the source text that
  * contains the macro invocation.
  * @returns {FIXED} The value returned is not affected by nested
  *   macro invocations.
  */
 MACCOL: PROC RETURNS(FIXED); END;

 /**
  * \`MACLMAR\` returns a \`FIXED\` value that represents the column
  * number of the left source margin in \`MARGINS\` compiler option.
  * 
  * See the information about the \`MARGINS\` option in the
  * Programming Guide.
  * @returns {FIXED} column number of the left source margin in
  *   \`MARGINS\` compiler option
  */
 MACLMAR: PROC RETURNS(FIXED); END;

 /**
  * \`MACNAME\` returns the name of the preprocessor procedure within
  * which it is invoked.
  * 
  * It is invalid to invoke \`MACNAME\` outside of a preprocessor
  * procedure.
  * @returns {CHARACTER} name of the preprocessor procedure
  */
 MACNAME: PROC RETURNS(CHARACTER); END;

 /**
  * \`MACRMAR\` returns a \`FIXED\` value that represents the column
  * number of the right source margin in \`MARGINS\` compiler option.
  * 
  * See the information about the \`MARGINS\` option in the
  * Programming Guide.
  * @returns {FIXED} column number of the right source margin in
  *   \`MARGINS\` compiler option
  */
 MACRMAR: PROC RETURNS(FIXED); END;

 /**
  * \`MAX\` returns the largest value from a set of two or more
  * expressions.
  * @param {FIXED} value1 First expression. \`value1\` should have
  *   \`FIXED\` type, and if not, it will be converted thereto.
  * @param {FIXED} valueN Second and subsequent expressions.
  *   Each \`valueN\` should have \`FIXED\` type, and if not, it will
  *   be converted thereto.
  * @returns {FIXED} largest value from a set of two or more
  *   expressions
  */
 MAX: PROC(value1, valueN) RETURNS(FIXED);
   DECLARE value1 FIXED;
   DECLARE valueN FIXED LIST;
 END;

 /**
  * \`MIN\` returns the smallest value from a set of two or more
  * expressions.
  * @param {FIXED} value1 First expression. \`value1\` should have
  *   \`FIXED\` type, and if not, it will be converted thereto.
  * @param {FIXED} valueN Second and subsequent expressions.
  *   Each \`valueN\` should have \`FIXED\` type, and if not, it will
  *   be converted thereto.
  * @returns {FIXED} smallest value from a set of two or
  *   more expressions
  */
 MIN: PROC(value1, valueN) RETURNS(FIXED);
   DECLARE value1 FIXED;
   DECLARE valueN FIXED LIST;
 END;

 /**
  * \`PARMSET\` returns a \`BIT\` value indicating if a specified
  * parameter was set on invocation of the procedure.
  * 
  * The \`PARMSET\` built-in function can be used only within a
  * preprocessor procedure.
  * 
  * \`PARMSET\` returns a bit value of \`'1'B\` if the parameter
  * \`parameter\` was explicitly set by the function reference that
  * invoked the procedure, and a bit value of \`'0'B\` if it was
  * not—that is, if the corresponding argument was omitted from the
  * function reference in a preprocessor expression, or was the null
  * string in a function reference from input text.
  * 
  * \`PARMSET\` can return \`'0'B\`, even if a matching argument does
  * appear in the reference, but the reference is in another
  * preprocessor procedure, as follows:
  * 
  * - If the argument is not itself a parameter of the invoking
  *   procedure, \`PARMSET\` returns the value \`'1'B\`.
  * - If the argument is a parameter of the invoking procedure,
  *   \`PARMSET\` returns the value for the specified parameter when
  *   the invoking procedure was itself invoked.
  * @param {ANY} parameter Must be a parameter of the preprocessor
  *   procedure.
  * @returns {FIXED} bit value indicating if a specified parameter
  *   was set on invocation of the procedure
  */
 PARMSET: PROC(parameter) RETURNS(FIXED);
   DECLARE parameter ANY;
 END;

 /**
  * \`QUOTE\` returns a \`CHARACTER\` string that represents x as a
  * valid quoted string.
  * 
  * If \`string\` contains single quotation marks, each is replaced by
  * two consecutive single quotation marks.
  * @param {CHARACTER} string Expression that is converted to a
  *   quoted string.
  * 
  *   \`string\` should have CHARACTER type, and if not, it is
  *   converted thereto.
  * @returns {CHARACTER} A valid quoted string.
  */
 QUOTE: PROC(string) RETURNS(CHARACTER);
   DECLARE string CHARACTER;
 END;

 /**
  * \`REPEAT\` returns a \`CHARACTER\` string consisting of
  * \`(n + 1)\` concatenated copies of the string \`string\`.
  * @param {CHARACTER} string Expression.
  * 
  *   \`string\` should have \`CHARACTER\` type, and if not,
  *   it is converted thereto.
  * @param {FIXED} n Expression that specifies the number of
  *   repetitions.
  * 
  *   \`n\` should have \`FIXED\` type, and if not, it is
  *   converted thereto.
  * 
  *   \`n\` must be nonnegative.
  * 
  *   If \`n\` is zero, the result is \`string\`
  *   (converted to character as necessary).
  * @returns {CHARACTER} A string consisting of
  *   \`(n + 1)\` concatenated copies of the string \`string\`.
  */
 REPEAT: PROC(string, n) RETURNS(CHARACTER);
   DECLARE string CHARACTER;
   DECLARE n FIXED;
 END;

 /**
  * \`SUBSTR\` returns a substring, specified by \`offset\` and
  * \`length\`, of \`string\`.
  * 
  * \`length\` must be nonnegative, and the values of \`offset\` and
  * \`length\` must be such that the substring lies entirely within
  * the current length of \`string\`.
  * 
  * If \`offset = LENGTH(string)+1\` and \`length = 0\`, the null
  * string is returned.
  * @param {CHARACTER} string Expression specifies the string from
  *   which the substring is extracted.
  * 
  *   \`string\` should have \`CHARACTER\` type, and if not, it is
  *   converted thereto.
  * @param {FIXED} offset Expression that specifies the starting
  *   position of the substring in \`string\`.
  * 
  *   \`offset\` should have \`FIXED\` type, and if not, it is
  *   converted thereto.
  * @param {FIXED} length Expression that specifies the length of the
  *   substring in \`string\`.
  * 
  *   \`length\` should have \`FIXED\` type, and if not, it is
  *   converted thereto.
  * @returns {CHARACTER} substring specified by \`offset\` and
  *   \`length\` of \`string\`
  */
 SUBSTR: PROC(string, offset, length) RETURNS(CHARACTER);
   DECLARE string CHARACTER;
   DECLARE offset FIXED;
   DECLARE length FIXED OPTIONAL;
 END;

 /**
  * \`SYSDIMSIZE\` returns a \`FIXED\` value that indicates the maximum
  * number of bytes that is needed to hold an index for an array
  * permitted under the compiler \`CMPAT\` option.
  * 
  * The possible return values are as follows:
  * - \`4\` under \`CMPAT(V2)\` and \`CMPAT(LE)\`
  * - \`8\` under \`CMPAT(V3)\`
  * @returns {FIXED} value that indicates the maximum number of bytes
  *   that is needed to hold an index for an array permitted under the
  *   compiler \`CMPAT\` option
  */
 SYSDIMSIZE: PROC RETURNS(FIXED); END;

 /**
  * \`SYSOFFSETSIZE\` returns a \`FIXED\` value that indicates the
  * number of bytes needed to hold an \`OFFSET\`.
  * 
  * Currently, \`SYSOFFSETSIZE\` returns 4.
  * @returns {FIXED} value that indicates the number of bytes needed
  *   to hold an \`OFFSET\`
  */
 SYSOFFSETSIZE: PROC RETURNS(FIXED); END;

 /**
  * \`SYSPARM\` returns the \`CHARACTER\` string value of the
  * \`SYSPARM\` compiler option.
  * 
  * The value returned is not translated to uppercase; the exact value
  * as specified in the compiler option is returned. See the
  * information about the \`SYSPARM\` compiler option in the
  * Programming Guide.
  * 
  * \`SYSPARM\` allows information external to the program to be
  * accessed without modifying the source program.
  * @returns {CHARACTER} string value of the \`SYSPARM\`
  *   compiler option
  */
 SYSPARM: PROC RETURNS(CHARACTER); END;

 /**
  * \`SYSPOINTERSIZE\` returns a \`FIXED\` value that indicates the
  * number of bytes needed to hold a \`POINTER\`.
  * 
  * Currently, \`SYSPOINTERSIZE\` returns 4. But under the
  * \`LP(64)\` option, the \`SYSPOINTERSIZE\` returns 8.
  * @returns {FIXED} value that indicates the number of bytes needed
  *   to hold a \`POINTER\`
  */
 SYSPOINTERSIZE: PROC RETURNS(FIXED); END;

 /**
  * \`SYSTEM\` returns a \`CHARACTER\` string that contains the
  * value of the \`SYSTEM\` compiler option that is in effect.
  * 
  * The value returned might contain leading and trailing blanks.
  * You can apply the \`TRIM\` built-in function to that value to make
  * it easier to test.
  * 
  * See the information about the \`SYSTEM\` compiler option in the
  * Programming Guide.
  * @returns {CHARACTER} string value of the \`SYSTEM\` compiler option
  */
 SYSTEM: PROC RETURNS(CHARACTER); END;

 /**
  * \`SYSVERSION\` returns a \`CHARACTER\` string containing the
  * product name as well as the version, release, and
  * modification level.
  * 
  * The result that \`SYSVERSION\` returns is a string of
  * length 22 in one of the following formats. Each string is
  * padded with blanks on the right to make it 22 in length.
  * @returns {CHARACTER} string containing the product name as well 
  *   as the version, release, and modification level
  */
 SYSVERSION: PROC RETURNS(CHARACTER); END;

 /**
  * \`TRANSLATE\` returns a \`CHARACTER\` string of the same length
  * as \`input\`, but with selected characters translated.
  * 
  * \`TRANSLATE\` operates on each character of \`input\` as follows:
  * 
  * If a character in \`input\` is found in \`search\`, the character
  * in \`replacement\` that corresponds to that in \`search\` is copied
  * to the result; otherwise, the character in \`input\` is copied
  * directly to the result. If \`search\` contains duplicates, the
  * leftmost occurrence is used.
  * 
  * \`replacement\` is padded with blanks, or truncated, on the
  * right to match the length of \`search\`.
  * @param {CHARACTER} input Expression to be searched for possible 
  *   translation of its characters.
  * 
  *   \`input\` should have \`CHARACTER\` type, and if not, it is
  *   converted thereto.
  * @param {CHARACTER} replacement Expression containing the
  *   translation values of characters.
  * 
  *   \`replacement\` should have \`CHARACTER\` type, and if not,
  *   it is converted thereto.
  * @param {CHARACTER} [search] Expression containing the characters
  *   that are to be translated. If \`search\` is omitted, the default
  *   is \`COLLATE\`.
  * 
  *   \`search\` should have \`CHARACTER\` type, and if not, it
  *   is converted thereto.
  * @returns {CHARACTER} string of the same length as \`input\`,
  *   but with selected characters translated
  */
 TRANSLATE: PROC(input, replacement, search) RETURNS(CHARACTER);
   DECLARE input CHARACTER;
   DECLARE replacement CHARACTER;
   DECLARE search CHARACTER OPTIONAL;
 END;

 /**
  * \`TRIM\` returns a \`CHARACTER\` string with characters trimmed
  * from one or both ends of an input string.
  * @param {CHARACTER} input is a \`CHARACTER\` string expression
  * @param {CHARACTER} [left] is a \`CHARACTER\` string expression,
  *   that should be trimmed from the left end of \`input\`.
  *   If \`left\` is omitted, the default is a single blank character.
  * @param {CHARACTER} [right] is a \`CHARACTER\` string expression,
  *   that should be trimmed from the right end of \`input\`.
  *   If \`right\` is omitted, the default is a single blank character.
  * @returns {CHARACTER} string with characters trimmed from one or
  *   both ends of an input string
  */
 TRIM: PROC(input, left, right) RETURNS(CHARACTER);
   DECLARE input CHARACTER;
   DECLARE left CHARACTER OPTIONAL INITIAL(' ');
   DECLARE right CHARACTER OPTIONAL INITIAL(' ');
 END;

 /**
  * UPPERCASE returns a character string with all characters converted
  * to their uppercase equivalent.
  * @param {CHARACTER} string Expression. If necessary, \`string\
  *   is converted to character.
  * @param {FIXED} [codes] Expression. Specifies the code page that
  *   will be uppercased.
  * @returns {CHARACTER} character string with all characters
  *   converted to their uppercase equivalent
  */
 UPPERCASE: PROC(string, codes) RETURNS(CHARACTER);
   DECLARE string CHARACTER;
   DECLARE codes FIXED OPTIONAL;
 END;

 /**
  * \`VERIFY\` returns a \`FIXED\` value indicating the position
  * in \`input\` of the leftmost character that is not in \`compare\`.
  * It also allows you to specify the location within \`input\` at
  * which to begin processing.
  * 
  * If all the characters in \`input\` do appear in \`compare\`,
  * a value of zero is returned. If \`input\` is a null string,
  * a value of zero is returned. If \`input\` is not a null string
  * and \`compare\` is a null string, the value of \`offset\` is
  * returned. The default value for \`offset\` is one.
  * 
  * \`offset\` must be greater than \`0\` and no greater
  * than \`1 + LENGTH(input)\`.
  * 
  * If \`offset = LENGTH(input) + 1\`, the result is zero.
  * @param {CHARACTER} input Expression. The string to be searched.
  * @param {CHARACTER} compare Expression. The string containing the
  *   characters to be verified against.
  * @param {FIXED} [offset] Expression. Specifies the position
  *   within \`input\` at which to begin processing.
  * @returns {FIXED} position in \`input\` of the leftmost character
  *   that is not in \`compare\`
  */
 VERIFY: PROC(input, compare, offset) RETURNS(FIXED);
   DECLARE input CHARACTER;
   DECLARE compare CHARACTER;
   DECLARE offset FIXED OPTIONAL;
 END;
`;

export const BuiltinsMacroTextDocument = TextDocument.create(
  UriUtils.toUri(BuiltinsMacroUri).toString(),
  "pli",
  0,
  BuiltinsMacro,
);
