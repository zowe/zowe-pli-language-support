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

import { Lexer } from "chevrotain";
import { createToken } from "../token-type-factory";
import { createKeywordRegistry, KeywordType } from "./shared";

// Based on:
// https://github.com/eclipse-che4z/che-che4z-lsp-for-cobol/blob/development/server/engine/src/main/antlr4/org/eclipse/lsp/cobol/implicitDialects/sql/Db2SqlExecLexer.g4

const { registerKeyword, keywordMap, keywords } = createKeywordRegistry();
export { keywordMap, keywords };

// Keywords
export const ABSOLUTE = registerKeyword({ name: "ABSOLUTE" });
export const ACCELERATION = registerKeyword({ name: "ACCELERATION" });
export const ACCELERATOR = registerKeyword({ name: "ACCELERATOR" });
export const ACCESS = registerKeyword({ name: "ACCESS" });
export const ACCESSCTRL = registerKeyword({ name: "ACCESSCTRL" });
export const ACCTNG = registerKeyword({ name: "ACCTNG" });
export const ACTION = registerKeyword({ name: "ACTION" });
export const ACTIVATE = registerKeyword({ name: "ACTIVATE" });
export const ACTIVE = registerKeyword({ name: "ACTIVE" });
export const ADD = registerKeyword({ name: "ADD" });
export const ADDRESS = registerKeyword({ name: "ADDRESS" });
export const AFTER = registerKeyword({ name: "AFTER" });
export const AGE = registerKeyword({ name: "AGE" });
export const ALGORITHM = registerKeyword({ name: "ALGORITHM" });
export const ALIAS = registerKeyword({ name: "ALIAS" });
export const ALL = registerKeyword({ name: "ALL" });
export const ALLOCATE = registerKeyword({
  name: "ALLOCATE",
  type: KeywordType.Control,
});
export const ALLOW = registerKeyword({ name: "ALLOW" });
export const ALTER = registerKeyword({
  name: "ALTER",
  type: KeywordType.Control,
});
export const ALTERIN = registerKeyword({ name: "ALTERIN" });
export const ALWAYS = registerKeyword({ name: "ALWAYS" });
export const AND = registerKeyword({ name: "AND" });
export const ANY = registerKeyword({ name: "ANY" });
export const APPEND = registerKeyword({ name: "APPEND" });
export const APPLCOMPAT = registerKeyword({ name: "APPLCOMPAT" });
export const APPLICATION = registerKeyword({ name: "APPLICATION" });
export const APPLNAME = registerKeyword({ name: "APPLNAME" });
export const ARCHIVE = registerKeyword({ name: "ARCHIVE" });
export const ARRAY = registerKeyword({ name: "ARRAY" });
export const ARRAY_EXISTS = registerKeyword({ name: "ARRAY_EXISTS" });
export const AS = registerKeyword({ name: "AS" });
export const ASC = registerKeyword({ name: "ASC" });
export const ASCII = registerKeyword({ name: "ASCII" });
export const ASENSITIVE = registerKeyword({ name: "ASENSITIVE" });
export const ASSOCIATE = registerKeyword({
  name: "ASSOCIATE",
  type: KeywordType.Control,
});
export const ASUTIME = registerKeyword({ name: "ASUTIME" });
export const AT = registerKeyword({ name: "AT" });
export const ATOMIC = registerKeyword({ name: "ATOMIC" });
export const ATTRIBUTES = registerKeyword({ name: "ATTRIBUTES" });
export const AUDIT = registerKeyword({ name: "AUDIT" });
export const AUTHENTICATION = registerKeyword({ name: "AUTHENTICATION" });
export const AUTHID = registerKeyword({ name: "AUTHID" });
export const AUTONOMOUS = registerKeyword({ name: "AUTONOMOUS" });
export const AUX = registerKeyword({ name: "AUX" });
export const AUXILIARY = registerKeyword({ name: "AUXILIARY" });
export const AVG = registerKeyword({ name: "AVG" });
export const BASED = registerKeyword({ name: "BASED" });
export const BEFORE = registerKeyword({ name: "BEFORE" });
export const BEGIN = registerKeyword({
  name: "BEGIN",
  type: KeywordType.Control,
});
export const BETWEEN = registerKeyword({ name: "BETWEEN" });
export const BIGINT = registerKeyword({ name: "BIGINT" });
export const BINARY = registerKeyword({ name: "BINARY" });
export const BIND = registerKeyword({
  name: "BIND",
  type: KeywordType.Control,
});
export const BINDADD = registerKeyword({ name: "BINDADD" });
export const BINDAGENT = registerKeyword({ name: "BINDAGENT" });
export const BIT = registerKeyword({ name: "BIT" });
export const BLOB = registerKeyword({ name: "BLOB" });
export const BOTH = registerKeyword({ name: "BOTH" });
export const BSDS = registerKeyword({ name: "BSDS" });
export const BUFFERPOOL = registerKeyword({ name: "BUFFERPOOL" });
export const BUFFERPOOLS = registerKeyword({ name: "BUFFERPOOLS" });
export const BUSINESS_TIME = registerKeyword({ name: "BUSINESS_TIME" });
export const BY = registerKeyword({ name: "BY" });
export const CACHE = registerKeyword({ name: "CACHE" });
export const CALL = registerKeyword({
  name: "CALL",
  type: KeywordType.Control,
});
export const CALLED = registerKeyword({ name: "CALLED" });
export const CALLER = registerKeyword({ name: "CALLER" });
export const CAPTURE = registerKeyword({ name: "CAPTURE" });
export const CARDINALITY = registerKeyword({ name: "CARDINALITY" });
export const CASCADE = registerKeyword({ name: "CASCADE" });
export const CASCADED = registerKeyword({ name: "CASCADED" });
export const CASE = registerKeyword({ name: "CASE" });
export const CAST = registerKeyword({ name: "CAST" });
export const CATALOG_NAME = registerKeyword({ name: "CATALOG_NAME" });
export const CCSID = registerKeyword({ name: "CCSID" });
export const CHANGE = registerKeyword({ name: "CHANGE" });
export const CHANGED = registerKeyword({ name: "CHANGED" });
export const CHANGES = registerKeyword({ name: "CHANGES" });
export const CHAR = registerKeyword({ name: "CHAR" });
export const CHARACTER = registerKeyword({ name: "CHARACTER" });
export const CHARACTER_LENGTH = registerKeyword({ name: "CHARACTER_LENGTH" });
export const CHAR_LENGTH = registerKeyword({ name: "CHAR_LENGTH" });
export const CHECK = registerKeyword({ name: "CHECK" });
export const CLAUSE = registerKeyword({ name: "CLAUSE" });
export const CLIENT = registerKeyword({ name: "CLIENT" });
export const CLIENT_ACCTNG = registerKeyword({ name: "CLIENT_ACCTNG" });
export const CLIENT_APPLNAME = registerKeyword({ name: "CLIENT_APPLNAME" });
export const CLIENT_CORR_TOKEN = registerKeyword({ name: "CLIENT_CORR_TOKEN" });
export const CLIENT_USERID = registerKeyword({ name: "CLIENT_USERID" });
export const CLIENT_WRKSTNNAME = registerKeyword({ name: "CLIENT_WRKSTNNAME" });
export const CLOB = registerKeyword({ name: "CLOB" });
export const CLONE = registerKeyword({ name: "CLONE" });
export const CLOSE = registerKeyword({
  name: "CLOSE",
  type: KeywordType.Control,
});
export const CLUSTER = registerKeyword({ name: "CLUSTER" });
export const COALESCE = registerKeyword({ name: "COALESCE" });
export const COLLECTION = registerKeyword({ name: "COLLECTION" });
export const COLLID = registerKeyword({ name: "COLLID" });
export const COLUMN = registerKeyword({ name: "COLUMN" });
export const COLUMNS = registerKeyword({ name: "COLUMNS" });
export const COMMENT = registerKeyword({ name: "COMMENT" });
export const COMMIT = registerKeyword({
  name: "COMMIT",
  type: KeywordType.Control,
});
export const COMMITTED = registerKeyword({ name: "COMMITTED" });
export const COMPATIBILITY = registerKeyword({ name: "COMPATIBILITY" });
export const COMPRESS = registerKeyword({ name: "COMPRESS" });
export const CONCAT = registerKeyword({ name: "CONCAT" });
export const CONCENTRATE = registerKeyword({ name: "CONCENTRATE" });
export const CONCURRENT = registerKeyword({ name: "CONCURRENT" });
export const CONDITION = registerKeyword({ name: "CONDITION" });
export const CONDITION_NUMBER = registerKeyword({ name: "CONDITION_NUMBER" });
export const CONNECT = registerKeyword({
  name: "CONNECT",
  type: KeywordType.Control,
});
export const CONNECTION = registerKeyword({ name: "CONNECTION" });
export const CONSTRAINT = registerKeyword({ name: "CONSTRAINT" });
export const CONTAINS = registerKeyword({ name: "CONTAINS" });
export const CONTEXT = registerKeyword({ name: "CONTEXT" });
export const CONTINUE = registerKeyword({ name: "CONTINUE" });
export const CONTROL = registerKeyword({ name: "CONTROL" });
export const COPY = registerKeyword({ name: "COPY" });
export const CORR = registerKeyword({ name: "CORR" });
export const CORRELATION = registerKeyword({ name: "CORRELATION" });
export const COUNT = registerKeyword({ name: "COUNT" });
export const COUNT_BIG = registerKeyword({ name: "COUNT_BIG" });
export const COVARIANCE = registerKeyword({ name: "COVARIANCE" });
export const CREATE = registerKeyword({
  name: "CREATE",
  type: KeywordType.Control,
});
export const CREATEALIAS = registerKeyword({ name: "CREATEALIAS" });
export const CREATEDBA = registerKeyword({ name: "CREATEDBA" });
export const CREATEDBC = registerKeyword({ name: "CREATEDBC" });
export const CREATEIN = registerKeyword({ name: "CREATEIN" });
export const CREATESG = registerKeyword({ name: "CREATESG" });
export const CREATETAB = registerKeyword({ name: "CREATETAB" });
export const CREATETMTAB = registerKeyword({ name: "CREATETMTAB" });
export const CREATETS = registerKeyword({ name: "CREATETS" });
export const CREATE_SECURE_OBJECT = registerKeyword({
  name: "CREATE_SECURE_OBJECT",
});
export const CROSS = registerKeyword({ name: "CROSS" });
export const CS = registerKeyword({ name: "CS" });
export const CUBE = registerKeyword({ name: "CUBE" });
export const CUME_DIST = registerKeyword({ name: "CUME_DIST" });
export const CURRENT = registerKeyword({ name: "CURRENT" });
export const CURRENTLY = registerKeyword({ name: "CURRENTLY" });
export const CURRENT_DATE = registerKeyword({ name: "CURRENT_DATE" });
export const CURRENT_LC_CTYPE = registerKeyword({ name: "CURRENT_LC_CTYPE" });
export const CURRENT_PATH = registerKeyword({ name: "CURRENT_PATH" });
export const CURRENT_SCHEMA = registerKeyword({ name: "CURRENT_SCHEMA" });
export const CURRENT_SERVER = registerKeyword({ name: "CURRENT_SERVER" });
export const CURRENT_TIME = registerKeyword({ name: "CURRENT_TIME" });
export const CURRENT_TIMESTAMP = registerKeyword({ name: "CURRENT_TIMESTAMP" });
export const CURRENT_TIMEZONE = registerKeyword({ name: "CURRENT_TIMEZONE" });
export const CURSOR = registerKeyword({ name: "CURSOR" });
export const CURSORS = registerKeyword({ name: "CURSORS" });
export const CURSOR_NAME = registerKeyword({ name: "CURSOR_NAME" });
export const CYCLE = registerKeyword({ name: "CYCLE" });
export const DATA = registerKeyword({ name: "DATA" });
export const DATAACCESS = registerKeyword({ name: "DATAACCESS" });
export const DATABASE = registerKeyword({ name: "DATABASE" });
export const DATACLAS = registerKeyword({ name: "DATACLAS" });
export const DATE = registerKeyword({ name: "DATE" });
export const DAY = registerKeyword({ name: "DAY" });
export const DAYOFMONTH = registerKeyword({ name: "DAYOFMONTH" });
export const DAYOFWEEK = registerKeyword({ name: "DAYOFWEEK" });
export const DAYOFYEAR = registerKeyword({ name: "DAYOFYEAR" });
export const DAYS = registerKeyword({ name: "DAYS" });
export const DB2 = registerKeyword({ name: "DB2" });
export const DB2SQL = registerKeyword({ name: "DB2SQL" });
export const DB2_AUTHENTICATION_TYPE = registerKeyword({
  name: "DB2_AUTHENTICATION_TYPE",
});
export const DB2_AUTHORIZATION_ID = registerKeyword({
  name: "DB2_AUTHORIZATION_ID",
});
export const DB2_CONNECTION_STATE = registerKeyword({
  name: "DB2_CONNECTION_STATE",
});
export const DB2_CONNECTION_STATUS = registerKeyword({
  name: "DB2_CONNECTION_STATUS",
});
export const DB2_ENCRYPTION_TYPE = registerKeyword({
  name: "DB2_ENCRYPTION_TYPE",
});
export const DB2_ERROR_CODE1 = registerKeyword({ name: "DB2_ERROR_CODE1" });
export const DB2_ERROR_CODE2 = registerKeyword({ name: "DB2_ERROR_CODE2" });
export const DB2_ERROR_CODE3 = registerKeyword({ name: "DB2_ERROR_CODE3" });
export const DB2_ERROR_CODE4 = registerKeyword({ name: "DB2_ERROR_CODE4" });
export const DB2_GET_DIAGNOSTICS_DIAGNOSTICS = registerKeyword({
  name: "DB2_GET_DIAGNOSTICS_DIAGNOSTICS",
});
export const DB2_INTERNAL_ERROR_POINTER = registerKeyword({
  name: "DB2_INTERNAL_ERROR_POINTER",
});
export const DB2_LAST_ROW = registerKeyword({ name: "DB2_LAST_ROW" });
export const DB2_LINE_NUMBER = registerKeyword({ name: "DB2_LINE_NUMBER" });
export const DB2_MESSAGE_ID = registerKeyword({ name: "DB2_MESSAGE_ID" });
export const DB2_MODULE_DETECTING_ERROR = registerKeyword({
  name: "DB2_MODULE_DETECTING_ERROR",
});
export const DB2_NUMBER_PARAMETER_MARKERS = registerKeyword({
  name: "DB2_NUMBER_PARAMETER_MARKERS",
});
export const DB2_NUMBER_RESULT_SETS = registerKeyword({
  name: "DB2_NUMBER_RESULT_SETS",
});
export const DB2_NUMBER_ROWS = registerKeyword({ name: "DB2_NUMBER_ROWS" });
export const DB2_ORDINAL_TOKEN1 = registerKeyword({
  name: "DB2_ORDINAL_TOKEN1",
});
export const DB2_ORDINAL_TOKEN2 = registerKeyword({
  name: "DB2_ORDINAL_TOKEN2",
});
export const DB2_ORDINAL_TOKEN3 = registerKeyword({
  name: "DB2_ORDINAL_TOKEN3",
});
export const DB2_ORDINAL_TOKEN4 = registerKeyword({
  name: "DB2_ORDINAL_TOKEN4",
});
export const DB2_PRODUCT_ID = registerKeyword({ name: "DB2_PRODUCT_ID" });
export const DB2_REASON_CODE = registerKeyword({ name: "DB2_REASON_CODE" });
export const DB2_RETURNED_SQLCODE = registerKeyword({
  name: "DB2_RETURNED_SQLCODE",
});
export const DB2_RETURN_STATUS = registerKeyword({ name: "DB2_RETURN_STATUS" });
export const DB2_ROW_NUMBER = registerKeyword({ name: "DB2_ROW_NUMBER" });
export const DB2_SERVER_CLASS_NAME = registerKeyword({
  name: "DB2_SERVER_CLASS_NAME",
});
export const DB2_SQLERRD1 = registerKeyword({ name: "DB2_SQLERRD1" });
export const DB2_SQLERRD2 = registerKeyword({ name: "DB2_SQLERRD2" });
export const DB2_SQLERRD3 = registerKeyword({ name: "DB2_SQLERRD3" });
export const DB2_SQLERRD4 = registerKeyword({ name: "DB2_SQLERRD4" });
export const DB2_SQLERRD5 = registerKeyword({ name: "DB2_SQLERRD5" });
export const DB2_SQLERRD6 = registerKeyword({ name: "DB2_SQLERRD6" });
export const DB2_SQLERRD_SET = registerKeyword({ name: "DB2_SQLERRD_SET" });
export const DB2_SQL_ATTR_CURSOR_HOLD = registerKeyword({
  name: "DB2_SQL_ATTR_CURSOR_HOLD",
});
export const DB2_SQL_ATTR_CURSOR_ROWSET = registerKeyword({
  name: "DB2_SQL_ATTR_CURSOR_ROWSET",
});
export const DB2_SQL_ATTR_CURSOR_SCROLLABLE = registerKeyword({
  name: "DB2_SQL_ATTR_CURSOR_SCROLLABLE",
});
export const DB2_SQL_ATTR_CURSOR_SENSITIVITY = registerKeyword({
  name: "DB2_SQL_ATTR_CURSOR_SENSITIVITY",
});
export const DB2_SQL_ATTR_CURSOR_TYPE = registerKeyword({
  name: "DB2_SQL_ATTR_CURSOR_TYPE",
});
export const DB2_SQL_NESTING_LEVEL = registerKeyword({
  name: "DB2_SQL_NESTING_LEVEL",
});
export const DB2_TOKEN_COUNT = registerKeyword({ name: "DB2_TOKEN_COUNT" });
export const DBADM = registerKeyword({ name: "DBADM" });
export const DBCLOB = registerKeyword({ name: "DBCLOB" });
export const DBCTRL = registerKeyword({ name: "DBCTRL" });
export const DBINFO = registerKeyword({ name: "DBINFO" });
export const DBMAINT = registerKeyword({ name: "DBMAINT" });
export const DEACTIVATE = registerKeyword({ name: "DEACTIVATE" });
export const DEALLOCATE = registerKeyword({
  name: "DEALLOCATE",
  type: KeywordType.Control,
});
export const DEBUG = registerKeyword({ name: "DEBUG" });
export const DEBUGSESSION = registerKeyword({ name: "DEBUGSESSION" });
export const DEC = registerKeyword({ name: "DEC" });
export const DECFLOAT = registerKeyword({ name: "DECFLOAT" });
export const DECIMAL = registerKeyword({ name: "DECIMAL" });
export const DECLARE = registerKeyword({
  name: "DECLARE",
  type: KeywordType.Control,
});
export const DEC_ROUND_CEILING = registerKeyword({ name: "DEC_ROUND_CEILING" });
export const DEC_ROUND_DOWN = registerKeyword({ name: "DEC_ROUND_DOWN" });
export const DEC_ROUND_FLOOR = registerKeyword({ name: "DEC_ROUND_FLOOR" });
export const DEC_ROUND_HALF_DOWN = registerKeyword({
  name: "DEC_ROUND_HALF_DOWN",
});
export const DEC_ROUND_HALF_EVEN = registerKeyword({
  name: "DEC_ROUND_HALF_EVEN",
});
export const DEC_ROUND_HALF_UP = registerKeyword({ name: "DEC_ROUND_HALF_UP" });
export const DEC_ROUND_UP = registerKeyword({ name: "DEC_ROUND_UP" });
export const DEFAULT = registerKeyword({ name: "DEFAULT" });
export const DEFAULTS = registerKeyword({ name: "DEFAULTS" });
export const DEFER = registerKeyword({ name: "DEFER" });
export const DEFERRED = registerKeyword({ name: "DEFERRED" });
export const DEFINE = registerKeyword({ name: "DEFINE" });
export const DEFINEBIND = registerKeyword({ name: "DEFINEBIND" });
export const DEFINER = registerKeyword({ name: "DEFINER" });
export const DEFINERUN = registerKeyword({ name: "DEFINERUN" });
export const DEGREE = registerKeyword({ name: "DEGREE" });
export const DELETE = registerKeyword({
  name: "DELETE",
  type: KeywordType.Control,
});
export const DENSE_RANK = registerKeyword({ name: "DENSE_RANK" });
export const DEPENDENT = registerKeyword({ name: "DEPENDENT" });
export const DESC = registerKeyword({ name: "DESC" });
export const DESCRIBE = registerKeyword({
  name: "DESCRIBE",
  type: KeywordType.Control,
});
export const DESCRIPTOR = registerKeyword({ name: "DESCRIPTOR" });
export const DETERMINISTIC = registerKeyword({ name: "DETERMINISTIC" });
export const DIAGNOSTICS = registerKeyword({ name: "DIAGNOSTICS" });
export const DISABLE = registerKeyword({ name: "DISABLE" });
export const DISALLOW = registerKeyword({ name: "DISALLOW" });
export const DISPATCH = registerKeyword({ name: "DISPATCH" });
export const DISPLAY = registerKeyword({
  name: "DISPLAY",
  type: KeywordType.Control,
});
export const DISPLAYDB = registerKeyword({
  name: "DISPLAYDB",
  type: KeywordType.Control,
});
export const DISTINCT = registerKeyword({ name: "DISTINCT" });
export const DOUBLE = registerKeyword({ name: "DOUBLE" });
export const DROP = registerKeyword({
  name: "DROP",
  type: KeywordType.Control,
});
export const DROPIN = registerKeyword({ name: "DROPIN" });
export const DSSIZE = registerKeyword({ name: "DSSIZE" });
export const DYNAMIC = registerKeyword({ name: "DYNAMIC" });
export const DYNAMICRULES = registerKeyword({ name: "DYNAMICRULES" });
export const EACH = registerKeyword({ name: "EACH" });
export const EBCDIC = registerKeyword({ name: "EBCDIC" });
export const EDITPROC = registerKeyword({ name: "EDITPROC" });
export const ELEMENT = registerKeyword({ name: "ELEMENT" });
export const ELIGIBLE = registerKeyword({ name: "ELIGIBLE" });
export const ELSE = registerKeyword({ name: "ELSE" });
export const EMPTY = registerKeyword({ name: "EMPTY" });
export const ENABLE = registerKeyword({ name: "ENABLE" });
export const ENCODING = registerKeyword({ name: "ENCODING" });
export const ENCRYPTION = registerKeyword({ name: "ENCRYPTION" });
export const END = registerKeyword({ name: "END", type: KeywordType.Control });
export const ENDING = registerKeyword({ name: "ENDING" });
export const ENFORCED = registerKeyword({ name: "ENFORCED" });
export const ENVIRONMENT = registerKeyword({ name: "ENVIRONMENT" });
export const ERASE = registerKeyword({ name: "ERASE" });
export const ESCAPE = registerKeyword({ name: "ESCAPE" });
export const EUR = registerKeyword({ name: "EUR" });
export const EVERY = registerKeyword({ name: "EVERY" });
export const EXCEPT = registerKeyword({ name: "EXCEPT" });
export const EXCHANGE = registerKeyword({ name: "EXCHANGE" });
export const EXCLUDE = registerKeyword({ name: "EXCLUDE" });
export const EXCLUDING = registerKeyword({ name: "EXCLUDING" });
export const EXCLUSIVE = registerKeyword({ name: "EXCLUSIVE" });
export const EXECUTE = registerKeyword({
  name: "EXECUTE",
  type: KeywordType.Control,
});
export const EXISTS = registerKeyword({ name: "EXISTS" });
export const EXIT = registerKeyword({
  name: "EXIT",
  type: KeywordType.Control,
});
export const EXPLAIN = registerKeyword({
  name: "EXPLAIN",
  type: KeywordType.Control,
});
export const EXTERNAL = registerKeyword({ name: "EXTERNAL" });
export const EXTRA = registerKeyword({ name: "EXTRA" });
export const EXTRACT = registerKeyword({ name: "EXTRACT" });
export const FAILBACK = registerKeyword({ name: "FAILBACK" });
export const FAILURE = registerKeyword({ name: "FAILURE" });
export const FAILURES = registerKeyword({ name: "FAILURES" });
export const FENCED = registerKeyword({ name: "FENCED" });
export const FETCH = registerKeyword({
  name: "FETCH",
  type: KeywordType.Control,
});
export const FIELDPROC = registerKeyword({ name: "FIELDPROC" });
export const FINAL = registerKeyword({ name: "FINAL" });
export const FIRST = registerKeyword({ name: "FIRST" });
export const FIXEDLENGTH = registerKeyword({ name: "FIXEDLENGTH" });
export const FLOAT = registerKeyword({ name: "FLOAT" });
export const FOR = registerKeyword({ name: "FOR" });
export const FOREIGN = registerKeyword({ name: "FOREIGN" });
export const FORMAT = registerKeyword({ name: "FORMAT" });
export const FOUND = registerKeyword({ name: "FOUND" });
export const FREE = registerKeyword({
  name: "FREE",
  type: KeywordType.Control,
});
export const FREEPAGE = registerKeyword({ name: "FREEPAGE" });
export const FROM = registerKeyword({ name: "FROM" });
export const FULL = registerKeyword({ name: "FULL" });
export const FUNCTION = registerKeyword({ name: "FUNCTION" });
export const FUNCTION_LEVEL_10 = registerKeyword({ name: "FUNCTION_LEVEL_10" });
export const FUNCTION_LEVEL_11 = registerKeyword({ name: "FUNCTION_LEVEL_11" });
export const FUNCTION_LEVEL_12 = registerKeyword({ name: "FUNCTION_LEVEL_12" });
export const GBPCACHE = registerKeyword({ name: "GBPCACHE" });
export const GENERAL = registerKeyword({ name: "GENERAL" });
export const GENERATE = registerKeyword({ name: "GENERATE" });
export const GENERATED = registerKeyword({ name: "GENERATED" });
export const GENERIC = registerKeyword({ name: "GENERIC" });
export const GET = registerKeyword({ name: "GET", type: KeywordType.Control });
export const GET_ACCEL_ARCHIVE = registerKeyword({ name: "GET_ACCEL_ARCHIVE" });
export const GLOBAL = registerKeyword({ name: "GLOBAL" });
export const GO = registerKeyword({ name: "GO" });
export const GOTO = registerKeyword({
  name: "GOTO",
  type: KeywordType.Control,
});
export const GRANT = registerKeyword({
  name: "GRANT",
  type: KeywordType.Control,
});
export const GRAPHIC = registerKeyword({ name: "GRAPHIC" });
export const GROUP = registerKeyword({ name: "GROUP" });
export const GROUPING = registerKeyword({ name: "GROUPING" });
export const HASH = registerKeyword({ name: "HASH" });
export const HAVING = registerKeyword({ name: "HAVING" });
export const HEX = registerKeyword({ name: "HEX" });
export const HIDDEN = registerKeyword({ name: "HIDDEN" });
export const HIGH = registerKeyword({ name: "HIGH" });
export const HINT = registerKeyword({ name: "HINT" });
export const HISTORY = registerKeyword({ name: "HISTORY" });
export const HOLD = registerKeyword({ name: "HOLD" });
export const HOUR = registerKeyword({ name: "HOUR" });
export const HOURS = registerKeyword({ name: "HOURS" });
export const HUFFMAN = registerKeyword({ name: "HUFFMAN" });
export const ID = registerKeyword({ name: "ID" });
export const IDENTITY = registerKeyword({ name: "IDENTITY" });
export const IGNORE = registerKeyword({ name: "IGNORE" });
export const IMAGCOPY = registerKeyword({
  name: "IMAGCOPY",
  type: KeywordType.Control,
});
export const IMMEDIATE = registerKeyword({ name: "IMMEDIATE" });
export const IMPLICITLY = registerKeyword({ name: "IMPLICITLY" });
export const IN = registerKeyword({ name: "IN" });
export const INCLUDE = registerKeyword({
  name: "INCLUDE",
  type: KeywordType.Control,
});
export const INCLUDING = registerKeyword({ name: "INCLUDING" });
export const INCLUSIVE = registerKeyword({ name: "INCLUSIVE" });
export const INCREMENT = registerKeyword({ name: "INCREMENT" });
export const INDEX = registerKeyword({ name: "INDEX" });
export const INDEXBP = registerKeyword({ name: "INDEXBP" });
export const INDICATOR = registerKeyword({ name: "INDICATOR" });
export const INHERIT = registerKeyword({ name: "INHERIT" });
export const INITIALLY = registerKeyword({ name: "INITIALLY" });
export const INLINE = registerKeyword({ name: "INLINE" });
export const INNER = registerKeyword({ name: "INNER" });
export const INOUT = registerKeyword({ name: "INOUT" });
export const INPUT = registerKeyword({ name: "INPUT" });
export const INSENSITIVE = registerKeyword({ name: "INSENSITIVE" });
export const INSERT = registerKeyword({
  name: "INSERT",
  type: KeywordType.Control,
});
export const INSTEAD = registerKeyword({ name: "INSTEAD" });
export const INT = registerKeyword({ name: "INT" });
export const INTEGER = registerKeyword({ name: "INTEGER" });
export const INTERSECT = registerKeyword({ name: "INTERSECT" });
export const INTO = registerKeyword({ name: "INTO" });
export const INVALID = registerKeyword({ name: "INVALID" });
export const INVOKEBIND = registerKeyword({ name: "INVOKEBIND" });
export const INVOKERUN = registerKeyword({ name: "INVOKERUN" });
export const IS = registerKeyword({ name: "IS" });
export const ISO = registerKeyword({ name: "ISO" });
export const ISOLATION = registerKeyword({ name: "ISOLATION" });
export const JAR = registerKeyword({ name: "JAR" });
export const JIS = registerKeyword({ name: "JIS" });
export const JOBNAME = registerKeyword({ name: "JOBNAME" });
export const JOIN = registerKeyword({ name: "JOIN" });
export const KEEP = registerKeyword({ name: "KEEP" });
export const KEY = registerKeyword({ name: "KEY" });
export const KEYS = registerKeyword({ name: "KEYS" });
export const LABEL = registerKeyword({ name: "LABEL" });
export const LABELS = registerKeyword({ name: "LABELS" });
export const LAG = registerKeyword({ name: "LAG" });
export const LANGUAGE = registerKeyword({ name: "LANGUAGE" });
export const LARGE = registerKeyword({ name: "LARGE" });
export const LAST = registerKeyword({ name: "LAST" });
export const LC_CTYPE = registerKeyword({ name: "LC_CTYPE" });
export const LEAD = registerKeyword({ name: "LEAD" });
export const LEFT = registerKeyword({ name: "LEFT" });
export const LENGTH = registerKeyword({ name: "LENGTH" });
export const LEVEL = registerKeyword({ name: "LEVEL" });
export const LIKE = registerKeyword({ name: "LIKE" });
export const LIMIT = registerKeyword({ name: "LIMIT" });
export const LITERALS = registerKeyword({ name: "LITERALS" });
export const LOAD = registerKeyword({
  name: "LOAD",
  type: KeywordType.Control,
});
export const LOB = registerKeyword({ name: "LOB" });
export const LOCAL = registerKeyword({ name: "LOCAL" });
export const LOCALE = registerKeyword({ name: "LOCALE" });
export const LOCATION = registerKeyword({ name: "LOCATION" });
export const LOCATOR = registerKeyword({ name: "LOCATOR" });
export const LOCATORS = registerKeyword({ name: "LOCATORS" });
export const LOCK = registerKeyword({
  name: "LOCK",
  type: KeywordType.Control,
});
export const LOCKED = registerKeyword({ name: "LOCKED" });
export const LOCKMAX = registerKeyword({ name: "LOCKMAX" });
export const LOCKS = registerKeyword({ name: "LOCKS" });
export const LOCKSIZE = registerKeyword({ name: "LOCKSIZE" });
export const LOCKPART = registerKeyword({ name: "LOCKPART" });
export const LOGGED = registerKeyword({ name: "LOGGED" });
export const LOW = registerKeyword({ name: "LOW" });
export const LOWER = registerKeyword({ name: "LOWER" });
export const MAIN = registerKeyword({ name: "MAIN" });
export const MAINTAINED = registerKeyword({ name: "MAINTAINED" });
export const MASK = registerKeyword({ name: "MASK" });
export const MATCHED = registerKeyword({ name: "MATCHED" });
export const MATERIALIZED = registerKeyword({ name: "MATERIALIZED" });
export const MAX = registerKeyword({ name: "MAX" });
export const MAXPARTITIONS = registerKeyword({ name: "MAXPARTITIONS" });
export const MAXROWS = registerKeyword({ name: "MAXROWS" });
export const MAXVALUE = registerKeyword({ name: "MAXVALUE" });
export const MEMBER = registerKeyword({ name: "MEMBER" });
export const MERGE = registerKeyword({
  name: "MERGE",
  type: KeywordType.Control,
});
export const MESSAGE_TEXT = registerKeyword({ name: "MESSAGE_TEXT" });
export const MGMTCLAS = registerKeyword({ name: "MGMTCLAS" });
export const MICROSECOND = registerKeyword({ name: "MICROSECOND" });
export const MICROSECONDS = registerKeyword({ name: "MICROSECONDS" });
export const MIN = registerKeyword({ name: "MIN" });
export const MINUTE = registerKeyword({ name: "MINUTE" });
export const MINUTES = registerKeyword({ name: "MINUTES" });
export const MINVALUE = registerKeyword({ name: "MINVALUE" });
export const MIXED = registerKeyword({ name: "MIXED" });
export const MODE = registerKeyword({ name: "MODE" });
export const MODIFIERS = registerKeyword({ name: "MODIFIERS" });
export const MODIFIES = registerKeyword({ name: "MODIFIES" });
export const MONITOR1 = registerKeyword({ name: "MONITOR1" });
export const MONITOR2 = registerKeyword({ name: "MONITOR2" });
export const MONTH = registerKeyword({ name: "MONTH" });
export const MONTHS = registerKeyword({ name: "MONTHS" });
export const MORE = registerKeyword({ name: "MORE" });
export const MOVE = registerKeyword({ name: "MOVE" });
export const MULTIPLIER = registerKeyword({ name: "MULTIPLIER" });
export const NAME = registerKeyword({ name: "NAME" });
export const NAMES = registerKeyword({ name: "NAMES" });
export const NAMESPACE = registerKeyword({ name: "NAMESPACE" });
export const NATIONAL = registerKeyword({ name: "NATIONAL" });
export const NCNAME = registerKeyword({ name: "NCNAME" });
export const NEW = registerKeyword({ name: "NEW" });
export const NEW_TABLE = registerKeyword({ name: "NEW_TABLE" });
export const NEXT = registerKeyword({ name: "NEXT" });
export const NO = registerKeyword({ name: "NO" });
export const NODEFER = registerKeyword({ name: "NODEFER" });
export const NONE = registerKeyword({ name: "NONE" });
export const NOT = registerKeyword({ name: "NOT" });
export const NTILE = registerKeyword({ name: "NTILE" });
export const NULL = registerKeyword({ name: "NULL" });
export const NULLS = registerKeyword({ name: "NULLS" });
export const NULTERM = registerKeyword({ name: "NULTERM" });
export const NUMBER = registerKeyword({ name: "NUMBER" });
export const NUMERIC = registerKeyword({ name: "NUMERIC" });
export const NUMPARTS = registerKeyword({ name: "NUMPARTS" });
export const OBID = registerKeyword({ name: "OBID" });
export const OBJECT = registerKeyword({ name: "OBJECT" });
export const OF = registerKeyword({ name: "OF" });
export const OFF = registerKeyword({ name: "OFF" });
export const OFFSET = registerKeyword({ name: "OFFSET" });
export const OLD = registerKeyword({ name: "OLD" });
export const OLD_TABLE = registerKeyword({ name: "OLD_TABLE" });
export const ON = registerKeyword({ name: "ON" });
export const ONCE = registerKeyword({ name: "ONCE" });
export const ONLY = registerKeyword({ name: "ONLY" });
export const OPEN = registerKeyword({
  name: "OPEN",
  type: KeywordType.Control,
});
export const OPERATION = registerKeyword({ name: "OPERATION" });
export const OPTHINT = registerKeyword({ name: "OPTHINT" });
export const OPTIMIZE = registerKeyword({ name: "OPTIMIZE" });
export const OPTIMIZATION = registerKeyword({ name: "OPTIMIZATION" });
export const OPTION = registerKeyword({ name: "OPTION" });
export const OPTIONAL = registerKeyword({ name: "OPTIONAL" });
export const OPTIONS = registerKeyword({ name: "OPTIONS" });
export const OR = registerKeyword({ name: "OR" });
export const ORDER = registerKeyword({ name: "ORDER" });
export const ORDINALITY = registerKeyword({ name: "ORDINALITY" });
export const ORGANIZE = registerKeyword({ name: "ORGANIZE" });
export const ORIGINAL = registerKeyword({ name: "ORIGINAL" });
export const OUT = registerKeyword({ name: "OUT" });
export const OUTCOME = registerKeyword({ name: "OUTCOME" });
export const OUTER = registerKeyword({ name: "OUTER" });
export const OUTPUT = registerKeyword({ name: "OUTPUT" });
export const OVER = registerKeyword({ name: "OVER" });
export const OVERLAPS = registerKeyword({ name: "OVERLAPS" });
export const OVERRIDING = registerKeyword({ name: "OVERRIDING" });
export const OWNER = registerKeyword({ name: "OWNER" });
export const OWNERSHIP = registerKeyword({ name: "OWNERSHIP" });
export const PACKADM = registerKeyword({ name: "PACKADM" });
export const PACKAGE = registerKeyword({ name: "PACKAGE" });
export const PACKAGESET = registerKeyword({ name: "PACKAGESET" });
export const PACKAGE_NAME = registerKeyword({ name: "PACKAGE_NAME" });
export const PACKAGE_SCHEMA = registerKeyword({ name: "PACKAGE_SCHEMA" });
export const PACKAGE_VERSION = registerKeyword({ name: "PACKAGE_VERSION" });
export const PADDED = registerKeyword({ name: "PADDED" });
export const PAGE = registerKeyword({ name: "PAGE" });
export const PAGENUM = registerKeyword({ name: "PAGENUM" });
export const PARALLEL = registerKeyword({ name: "PARALLEL" });
export const PARAMETER = registerKeyword({ name: "PARAMETER" });
export const PART = registerKeyword({ name: "PART" });
export const PARTITION = registerKeyword({ name: "PARTITION" });
export const PARTITIONED = registerKeyword({ name: "PARTITIONED" });
export const PARTITIONING = registerKeyword({ name: "PARTITIONING" });
export const PASSING = registerKeyword({ name: "PASSING" });
export const PASSWORD = registerKeyword({ name: "PASSWORD" });
export const PATH = registerKeyword({ name: "PATH" });
export const PCTFREE = registerKeyword({ name: "PCTFREE" });
export const PENDING = registerKeyword({ name: "PENDING" });
export const PERCENT_RANK = registerKeyword({ name: "PERCENT_RANK" });
export const PERIOD = registerKeyword({ name: "PERIOD" });
export const PERMISSION = registerKeyword({ name: "PERMISSION" });
export const PIECESIZE = registerKeyword({ name: "PIECESIZE" });
export const PLAN = registerKeyword({ name: "PLAN" });
export const PORTION = registerKeyword({ name: "PORTION" });
export const POSITION = registerKeyword({ name: "POSITION" });
export const POSITIONING = registerKeyword({ name: "POSITIONING" });
export const PRECISION = registerKeyword({ name: "PRECISION" });
export const PREPARE = registerKeyword({
  name: "PREPARE",
  type: KeywordType.Control,
});
export const PRESERVE = registerKeyword({ name: "PRESERVE" });
export const PREVIOUS = registerKeyword({ name: "PREVIOUS" });
export const PRIMARY = registerKeyword({ name: "PRIMARY" });
export const PRIOR = registerKeyword({ name: "PRIOR" });
export const PRIQTY = registerKeyword({ name: "PRIQTY" });
export const PRIVILEGES = registerKeyword({ name: "PRIVILEGES" });
export const PROCEDURE = registerKeyword({ name: "PROCEDURE" });
export const PROFILE = registerKeyword({ name: "PROFILE" });
export const PROGRAM = registerKeyword({ name: "PROGRAM" });
export const PUBLIC = registerKeyword({ name: "PUBLIC" });
export const QUALIFIER = registerKeyword({ name: "QUALIFIER" });
export const QUERY = registerKeyword({ name: "QUERY" });
export const QUERYNO = registerKeyword({ name: "QUERYNO" });
export const QUOTED_NONE = registerKeyword({ name: "QUOTED_NONE" });
export const RANDOM = registerKeyword({ name: "RANDOM" });
export const RANGE = registerKeyword({ name: "RANGE" });
export const RANK = registerKeyword({ name: "RANK" });
export const READ = registerKeyword({ name: "READ" });
export const READS = registerKeyword({ name: "READS" });
export const REAL = registerKeyword({ name: "REAL" });
export const RECOVER = registerKeyword({
  name: "RECOVER",
  type: KeywordType.Control,
});
export const RECOVERDB = registerKeyword({
  name: "RECOVERDB",
  type: KeywordType.Control,
});
export const REF = registerKeyword({ name: "REF" });
export const REFERENCES = registerKeyword({ name: "REFERENCES" });
export const REFERENCING = registerKeyword({ name: "REFERENCING" });
export const REFRESH = registerKeyword({
  name: "REFRESH",
  type: KeywordType.Control,
});
export const REGENERATE = registerKeyword({ name: "REGENERATE" });
export const REGISTERS = registerKeyword({ name: "REGISTERS" });
export const RELATIVE = registerKeyword({ name: "RELATIVE" });
export const RELEASE = registerKeyword({
  name: "RELEASE",
  type: KeywordType.Control,
});
export const REMOVE = registerKeyword({ name: "REMOVE" });
export const RENAME = registerKeyword({
  name: "RENAME",
  type: KeywordType.Control,
});
export const REOPT = registerKeyword({ name: "REOPT" });
export const REORG = registerKeyword({
  name: "REORG",
  type: KeywordType.Control,
});
export const REPAIR = registerKeyword({
  name: "REPAIR",
  type: KeywordType.Control,
});
export const REPEAT = registerKeyword({ name: "REPEAT" });
export const REPLACE = registerKeyword({ name: "REPLACE" });
export const REQUIRED = registerKeyword({ name: "REQUIRED" });
export const RESET = registerKeyword({ name: "RESET" });
export const RESIDENT = registerKeyword({ name: "RESIDENT" });
export const RESOLUTION = registerKeyword({ name: "RESOLUTION" });
export const RESPECT = registerKeyword({ name: "RESPECT" });
export const RESTART = registerKeyword({ name: "RESTART" });
export const RESTRICT = registerKeyword({ name: "RESTRICT" });
export const RESULT = registerKeyword({ name: "RESULT" });
export const RETAIN = registerKeyword({ name: "RETAIN" });
export const RETURN = registerKeyword({
  name: "RETURN",
  type: KeywordType.Control,
});
export const RETURNED_SQLSTATE = registerKeyword({ name: "RETURNED_SQLSTATE" });
export const RETURNING = registerKeyword({ name: "RETURNING" });
export const RETURNS = registerKeyword({ name: "RETURNS" });
export const REUSE = registerKeyword({ name: "REUSE" });
export const REVOKE = registerKeyword({
  name: "REVOKE",
  type: KeywordType.Control,
});
export const RIGHT = registerKeyword({ name: "RIGHT" });
export const ROLE = registerKeyword({ name: "ROLE" });
export const ROLLBACK = registerKeyword({
  name: "ROLLBACK",
  type: KeywordType.Control,
});
export const ROLLUP = registerKeyword({ name: "ROLLUP" });
export const ROTATE = registerKeyword({ name: "ROTATE" });
export const ROUNDING = registerKeyword({ name: "ROUNDING" });
export const ROUND_CEILING = registerKeyword({ name: "ROUND_CEILING" });
export const ROUND_DOWN = registerKeyword({ name: "ROUND_DOWN" });
export const ROUND_FLOOR = registerKeyword({ name: "ROUND_FLOOR" });
export const ROUND_HALF_DOWN = registerKeyword({ name: "ROUND_HALF_DOWN" });
export const ROUND_HALF_EVEN = registerKeyword({ name: "ROUND_HALF_EVEN" });
export const ROUND_HALF_UP = registerKeyword({ name: "ROUND_HALF_UP" });
export const ROUND_UP = registerKeyword({ name: "ROUND_UP" });
export const ROUTINE = registerKeyword({ name: "ROUTINE" });
export const ROW = registerKeyword({ name: "ROW" });
export const ROWID = registerKeyword({ name: "ROWID" });
export const ROWS = registerKeyword({ name: "ROWS" });
export const ROWSET = registerKeyword({ name: "ROWSET" });
export const ROW_COUNT = registerKeyword({ name: "ROW_COUNT" });
export const ROW_NUMBER = registerKeyword({ name: "ROW_NUMBER" });
export const RR = registerKeyword({ name: "RR" });
export const RS = registerKeyword({ name: "RS" });
export const RULES = registerKeyword({ name: "RULES" });
export const RUN = registerKeyword({ name: "RUN" });
export const SAVEPOINT = registerKeyword({
  name: "SAVEPOINT",
  type: KeywordType.Control,
});
export const SBCS = registerKeyword({ name: "SBCS" });
export const SCHEMA = registerKeyword({ name: "SCHEMA" });
export const SCHEME = registerKeyword({ name: "SCHEME" });
export const SCRATCHPAD = registerKeyword({ name: "SCRATCHPAD" });
export const SCROLL = registerKeyword({ name: "SCROLL" });
export const SECOND = registerKeyword({ name: "SECOND" });
export const SECONDS = registerKeyword({ name: "SECONDS" });
export const SECQTY = registerKeyword({ name: "SECQTY" });
export const SECTION = registerKeyword({ name: "SECTION" });
export const SECURED = registerKeyword({ name: "SECURED" });
export const SECURITY = registerKeyword({ name: "SECURITY" });
export const SEGSIZE = registerKeyword({ name: "SEGSIZE" });
export const SELECT = registerKeyword({
  name: "SELECT",
  type: KeywordType.Control,
});
export const SELECTIVITY = registerKeyword({ name: "SELECTIVITY" });
export const SENSITIVE = registerKeyword({ name: "SENSITIVE" });
export const SEQUENCE = registerKeyword({ name: "SEQUENCE" });
export const SERVAUTH = registerKeyword({ name: "SERVAUTH" });
export const SERVER = registerKeyword({ name: "SERVER" });
export const SERVER_NAME = registerKeyword({ name: "SERVER_NAME" });
export const SESSION = registerKeyword({ name: "SESSION" });
export const SESSION_USER = registerKeyword({ name: "SESSION_USER" });
export const SET = registerKeyword({ name: "SET", type: KeywordType.Control });
export const SETS = registerKeyword({ name: "SETS" });
export const SHARE = registerKeyword({ name: "SHARE" });
export const SIGNAL = registerKeyword({
  name: "SIGNAL",
  type: KeywordType.Control,
});
export const SIZE = registerKeyword({ name: "SIZE" });
export const SKIP = registerKeyword({ name: "SKIP" });
export const SMALLINT = registerKeyword({ name: "SMALLINT" });
export const SOME = registerKeyword({ name: "SOME" });
export const SOURCE = registerKeyword({ name: "SOURCE" });
export const SPACE = registerKeyword({ name: "SPACE" });
export const SPECIAL = registerKeyword({ name: "SPECIAL" });
export const SPECIFIC = registerKeyword({ name: "SPECIFIC" });
export const SQL = registerKeyword({ name: "SQL" });
export const SQLADM = registerKeyword({ name: "SQLADM" });
export const SQLCA = registerKeyword({ name: "SQLCA" });
export const SQLDA = registerKeyword({ name: "SQLDA" });
export const SQLERROR = registerKeyword({ name: "SQLERROR" });
export const SQLEXCEPTION = registerKeyword({ name: "SQLEXCEPTION" });
export const SQLID = registerKeyword({ name: "SQLID" });
export const SQLSTATE = registerKeyword({ name: "SQLSTATE" });
export const SQLWARNING = registerKeyword({ name: "SQLWARNING" });
export const STABILIZED = registerKeyword({ name: "STABILIZED" });
export const STACKED = registerKeyword({ name: "STACKED" });
export const START = registerKeyword({
  name: "START",
  type: KeywordType.Control,
});
export const STARTDB = registerKeyword({
  name: "STARTDB",
  type: KeywordType.Control,
});
export const STARTING = registerKeyword({ name: "STARTING" });
export const STATEMENT = registerKeyword({ name: "STATEMENT" });
export const STATEMENTS = registerKeyword({ name: "STATEMENTS" });
export const STATIC = registerKeyword({ name: "STATIC" });
export const STATS = registerKeyword({ name: "STATS" });
export const STAY = registerKeyword({ name: "STAY" });
export const STDDEV = registerKeyword({ name: "STDDEV" });
export const STMTCACHE = registerKeyword({ name: "STMTCACHE" });
export const STMTID = registerKeyword({ name: "STMTID" });
export const STMTTOKEN = registerKeyword({ name: "STMTTOKEN" });
export const STOGROUP = registerKeyword({ name: "STOGROUP" });
export const STOP = registerKeyword({
  name: "STOP",
  type: KeywordType.Control,
});
export const STOPALL = registerKeyword({ name: "STOPALL" });
export const STOPDB = registerKeyword({
  name: "STOPDB",
  type: KeywordType.Control,
});
export const STORAGE = registerKeyword({ name: "STORAGE" });
export const STORCLAS = registerKeyword({ name: "STORCLAS" });
export const STORES = registerKeyword({ name: "STORES" });
export const STOSPACE = registerKeyword({
  name: "STOSPACE",
  type: KeywordType.Control,
});
export const STRUCTURE = registerKeyword({ name: "STRUCTURE" });
export const STYLE = registerKeyword({ name: "STYLE" });
export const SUB = registerKeyword({ name: "SUB" });
export const SUBSTR = registerKeyword({ name: "SUBSTR" });
export const SUBSTRING = registerKeyword({ name: "SUBSTRING" });
export const SUM = registerKeyword({ name: "SUM" });
export const SYNONYM = registerKeyword({ name: "SYNONYM" });
export const SYSADM = registerKeyword({ name: "SYSADM" });
export const SYSCTRL = registerKeyword({ name: "SYSCTRL" });
export const SYSDEFLT = registerKeyword({ name: "SYSDEFLT" });
export const SYSIBM = registerKeyword({ name: "SYSIBM" });
export const SYSOPR = registerKeyword({ name: "SYSOPR" });
export const SYSTEM = registerKeyword({ name: "SYSTEM" });
export const SYSTEM_TIME = registerKeyword({ name: "SYSTEM_TIME" });
export const TABLE = registerKeyword({ name: "TABLE" });
export const TABLESPACE = registerKeyword({ name: "TABLESPACE" });
export const TEMPORAL = registerKeyword({ name: "TEMPORAL" });
export const TEMPORARY = registerKeyword({ name: "TEMPORARY" });
export const THEN = registerKeyword({ name: "THEN" });
export const TIME = registerKeyword({ name: "TIME" });
export const TIMESTAMP = registerKeyword({ name: "TIMESTAMP" });
export const TIMEZONE = registerKeyword({ name: "TIMEZONE" });
export const TO = registerKeyword({ name: "TO" });
export const TOKEN = registerKeyword({ name: "TOKEN" });
export const TRACE = registerKeyword({
  name: "TRACE",
  type: KeywordType.Control,
});
export const TRACKMOD = registerKeyword({ name: "TRACKMOD" });
export const TRANSACTION = registerKeyword({ name: "TRANSACTION" });
export const TRANSFER = registerKeyword({ name: "TRANSFER" });
export const TRANSLATE = registerKeyword({ name: "TRANSLATE" });
export const TRIGGER = registerKeyword({ name: "TRIGGER" });
export const TRIGGERS = registerKeyword({ name: "TRIGGERS" });
export const TRIM = registerKeyword({ name: "TRIM" });
export const TRUNCATE = registerKeyword({
  name: "TRUNCATE",
  type: KeywordType.Control,
});
export const TRUSTED = registerKeyword({ name: "TRUSTED" });
export const TYPE = registerKeyword({ name: "TYPE" });
export const TYPES = registerKeyword({ name: "TYPES" });
export const UNICODE = registerKeyword({ name: "UNICODE" });
export const UNION = registerKeyword({ name: "UNION" });
export const UNIQUE = registerKeyword({ name: "UNIQUE" });
export const UNNEST = registerKeyword({ name: "UNNEST" });
export const UNPACK = registerKeyword({ name: "UNPACK" });
export const UPDATE = registerKeyword({
  name: "UPDATE",
  type: KeywordType.Control,
});
export const UPON = registerKeyword({ name: "UPON" });
export const UPPER = registerKeyword({ name: "UPPER" });
export const UR = registerKeyword({ name: "UR" });
export const URL = registerKeyword({ name: "URL" });
export const USA = registerKeyword({ name: "USA" });
export const USAGE = registerKeyword({ name: "USAGE" });
export const USE = registerKeyword({ name: "USE" });
export const USER = registerKeyword({ name: "USER" });
export const USERID = registerKeyword({ name: "USERID" });
export const USING = registerKeyword({ name: "USING" });
export const VALIDATE = registerKeyword({ name: "VALIDATE" });
export const VALIDPROC = registerKeyword({ name: "VALIDPROC" });
export const VALUE = registerKeyword({ name: "VALUE" });
export const VALUES = registerKeyword({ name: "VALUES" });
export const VARBINARY = registerKeyword({ name: "VARBINARY" });
export const VARCHAR = registerKeyword({ name: "VARCHAR" });
export const VARGRAPHIC = registerKeyword({ name: "VARGRAPHIC" });
export const VARIABLE = registerKeyword({ name: "VARIABLE" });
export const VARIANCE = registerKeyword({ name: "VARIANCE" });
export const VARYING = registerKeyword({ name: "VARYING" });
export const VCAT = registerKeyword({ name: "VCAT" });
export const VERSION = registerKeyword({ name: "VERSION" });
export const VERSIONING = registerKeyword({ name: "VERSIONING" });
export const VERSIONS = registerKeyword({ name: "VERSIONS" });
export const VIEW = registerKeyword({ name: "VIEW" });
export const VOLATILE = registerKeyword({ name: "VOLATILE" });
export const VOLUMES = registerKeyword({ name: "VOLUMES" });
export const WAIT = registerKeyword({ name: "WAIT" });
export const WAITFORDATA = registerKeyword({ name: "WAITFORDATA" });
export const WHEN = registerKeyword({ name: "WHEN" });
export const WHENEVER = registerKeyword({
  name: "WHENEVER",
  type: KeywordType.Control,
});
export const WHERE = registerKeyword({ name: "WHERE" });
export const WITH = registerKeyword({ name: "WITH" });
export const WITHOUT = registerKeyword({ name: "WITHOUT" });
export const WLM = registerKeyword({ name: "WLM" });
export const WORK = registerKeyword({ name: "WORK" });
export const WORKFILE = registerKeyword({ name: "WORKFILE" });
export const WRAPPED = registerKeyword({ name: "WRAPPED" });
export const WRITE = registerKeyword({ name: "WRITE" });
export const WRKSTNNAME = registerKeyword({ name: "WRKSTNNAME" });
export const XML = registerKeyword({ name: "XML" });
export const XMLCAST = registerKeyword({ name: "XMLCAST" });
export const XMLNAMESPACES = registerKeyword({ name: "XMLNAMESPACES" });
export const XMLPATTERN = registerKeyword({ name: "XMLPATTERN" });
export const XMLQUERY = registerKeyword({ name: "XMLQUERY" });
export const XMLSCHEMA = registerKeyword({ name: "XMLSCHEMA" });
export const XMLTABLE = registerKeyword({ name: "XMLTABLE" });
export const YEAR = registerKeyword({ name: "YEAR" });
export const YEARS = registerKeyword({ name: "YEARS" });
export const YES = registerKeyword({ name: "YES" });
export const ZONE = registerKeyword({ name: "ZONE" });

// Symbol tokens
export const Dollar = createToken({
  name: "$",
  pattern: Lexer.NA,
});
export const LBracket = createToken({
  name: "[",
  pattern: Lexer.NA,
});
export const RBracket = createToken({
  name: "]",
  pattern: Lexer.NA,
});
export const QuestionMark = createToken({
  name: "?",
  pattern: Lexer.NA,
});
