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
import { URI } from "../utils/uri";

/**
 * For CTRL+F: pli-builtin:///builtins.pli
 */

export const BuiltinsUriSchema = "pli-builtin";
export const BuiltinsUri = `${BuiltinsUriSchema}:///builtins.pli`;
export const Builtins = ` /* Arithmetic built-in functions */
 ABS: PROC (value) RETURNS ();
 END;

 CEIL: PROC (value) RETURNS ();
 END;

 COMPLEX: PROC (real, imag) RETURNS (COMPLEX);
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

 ROUNDAWAYFROMZERO: PROC (value) RETURNS ();
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

 DIMENSION: PROC (array) RETURNS ();
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
 ONPROCEDURE: PROC () RETURNS ();
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

 DATEIME: PROC () RETURNS ();
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
 SHA2DIGESTx: PROC (buffer) RETURNS ();
 END;
 SHA2FINALx: PROC (buffer) RETURNS ();
 END;
 SHA2INITx: PROC (buffer) RETURNS ();
 END;
 SHA2UPDATEx: PROC (buffer) RETURNS ();
 END;
 SHA3DIGESTx: PROC (buffer) RETURNS ();
 END;
 SHA3FINALx: PROC (buffer) RETURNS ();
 END;
 SHA3INITx: PROC (buffer) RETURNS ();
 END;
 SHA3UPDATEx: PROC (buffer) RETURNS ();
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
 BYTE: PROC (value) RETURNS (); END;
 BYTELENGTH: PROC (value) RETURNS (); END;
 CDS: PROC (value) RETURNS (); END;
 CHARVAL: PROC (value) RETURNS (); END;
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
 PROCEDURENAME: PROC (value) RETURNS (); END;
 PUTENV: PROC (value) RETURNS (); END;
 RANK: PROC (value) RETURNS (); END;
 SOURCEFILE: PROC (value) RETURNS (); END;
 SOURCELINE: PROC (value) RETURNS (); END;
 STACKADDR: PROC (value) RETURNS (); END;
 STRING: PROC (value) RETURNS (); END;
 SYSTEM: PROC (value) RETURNS (); END;
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
 DECIMAL: PROC (value) RETURNS (); END;
 DIVIDE: PROC (value) RETURNS (); END;
 FIXED: PROC (value) RETURNS (); END;
 FIXEDBIN: PROC (value) RETURNS (); END;
 FIXEDDEC: PROC (value) RETURNS (); END;
 FLOAT: PROC (value) RETURNS (); END;
 FLOATBIN: PROC (value) RETURNS (); END;
 FLOATDEC: PROC (value) RETURNS (); END;
 MULTIPLY: PROC (value) RETURNS (); END;
 PRECVAL: PROC (value) RETURNS (); END;
 PRECISION: PROC (value) RETURNS (); END;
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
 ALLOCATION: PROC (value) RETURNS (); END;
 ALLOCNEXT: PROC (value) RETURNS (); END;
 ALLOCSIZE: PROC (value) RETURNS (); END;
 AUTOMATIC: PROC (value) RETURNS (); END;
 AVAILABLEAREA: PROC (value) RETURNS (); END;
 BINARYVALUE: PROC (value) RETURNS (); END;
 BITLOCATION: PROC (value) RETURNS (); END;
 CHECKSTG: PROC (value) RETURNS (); END;
 CURRENTSIZE: PROC (value) RETURNS (); END;
 CURRENTSTORAGE: PROC (value) RETURNS (); END;
 EMPTY: PROC (value) RETURNS (); END;
 ENTRYADDR: PROC (value) RETURNS (); END;
 HANDLE: PROC (value) RETURNS (); END;
 LOCATION: PROC (value) RETURNS (); END;
 LOCSTG: PROC (value) RETURNS (); END;
 LOCVAL: PROC (value) RETURNS (); END;
 NULL: PROC (value) RETURNS (); END;
 NULLENTRY: PROC (value) RETURNS (); END;
 OFFSET: PROC (value) RETURNS (); END;
 OFFSETADD: PROC (value) RETURNS (); END;
 OFFSETDIFF: PROC (value) RETURNS (); END;
 OFFSETSUBTRACT: PROC (value) RETURNS (); END;
 OFFSETVALUE: PROC (value) RETURNS (); END;
 POINTER: PROC (value) RETURNS (); END;
 POINTERADD: PROC (value) RETURNS (); END;
 POINTERDIFF: PROC (value) RETURNS (); END;
 POINTERSUBTRACT: PROC (value) RETURNS (); END;
 POINTERVALUE: PROC (value) RETURNS (); END;
 SIZE: PROC (value) RETURNS (); END;
 STORAGE: PROC (value) RETURNS (); END;
 SYSNULL: PROC (value) RETURNS (); END; 
 TYPE: PROC (value) RETURNS (); END;
 UNALLOCATED: PROC (value) RETURNS (); END;
 VARGLIST: PROC (value) RETURNS (); END;
 VARGSIZE: PROC (value) RETURNS (); END;

 /* String-handling built-in functions */
 BIT: PROC (value) RETURNS (); END;
 BOOL: PROC (value) RETURNS (); END;
 CENTERLEFT: PROC (value) RETURNS (); END;
 CENTERRIGHT: PROC (value) RETURNS (); END;
 CENTRELEFT: PROC (value) RETURNS (); END;
 CENTRERIGHT: PROC (value) RETURNS (); END;
 CHARACTER: PROC (value) RETURNS (); END;
 CHARGRAPHIC: PROC (value) RETURNS (); END;
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
 WIDECHAR: PROC (value) RETURNS (); END;
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


 define alias __SIGNED_INT signed fixed bin(31,0);
 define alias __UNSIGNED_INT unsigned fixed bin(32,0);
 `;

export const BuiltinsTextDocument = TextDocument.create(
  URI.parse(BuiltinsUri).toString(),
  "pli",
  0,
  Builtins,
);
