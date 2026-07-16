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

import { Severity } from "../../language-server/types";
import { PLICodes } from "../../validation/pli-codes";
import { CompilerOptions } from "./options";

export const CompilerOptionsCodes = {
  // At the moment, the actual codes are only used internally.
  // Only the message is presented to the user.
  UnknownOption: {
    ...PLICodes.Warning.IBM1159I,
    severity: Severity.E,
  },

  InvalidParameterCount: {
    code: "COOP01",
    severity: Severity.E,
    message: (received: number, min: number, max?: number) => {
      if (min === max) {
        return `Expected ${min} argument${min === 1 ? "" : "s"}, but received ${received}.`;
      } else if (max === undefined) {
        return `Expected at least ${min} argument${min === 1 ? "" : "s"}, but received ${received}.`;
      } else {
        return `Expected between ${min} and ${max} argument${max === 1 ? "" : "s"}, but received ${received}.`;
      }
    },
  },

  DupeOptionIssue: {
    code: "COOP02",
    severity: Severity.W,
    message: (name: string) => `Duplicate compiler option found for ${name}.`,
  },

  MutexOptionIssue: {
    code: "COOP03",
    severity: Severity.W,
    message: (name: string) =>
      `Mutually exclusive compiler options found for ${name}, only the last one will take effect.`,
  },

  ExpectedOption: {
    code: "COOP04",
    severity: Severity.E,
    message: () => `Expected a compiler option with arguments.`,
  },

  ExpectedPlain: {
    code: "COOP05",
    severity: Severity.E,
    message: () => `Expected a plain text value.`,
  },

  ExpectedString: {
    code: "COOP06",
    severity: Severity.E,
    message: () => `Expected a string value.`,
  },

  ExpectedPlainOrString: {
    code: "COOP07",
    severity: Severity.E,
    message: () => `Expected a plain text or string value.`,
  },

  ExpectedNumber: {
    code: "COOP08",
    severity: Severity.E,
    message: () => `Expected a number.`,
  },

  ExpectedNumberRange: {
    code: "COOP09",
    severity: Severity.E,
    message: (
      number: number,
      min: number | undefined,
      max: number | undefined,
    ) => {
      if (min !== undefined && max !== undefined) {
        return `Expected a number between ${min} and ${max}, but received ${number}.`;
      } else if (min !== undefined) {
        return `Expected a number greater than or equal to ${min}, but received ${number}.`;
      } else if (max !== undefined) {
        return `Expected a number less than or equal to ${max}, but received ${number}.`;
      } else {
        throw new Error("At least one of min or max must be defined");
      }
    },
  },

  ExpectedPlainNotEmpty: {
    code: "COOP10",
    severity: Severity.E,
    message: () => `Expected a value.`,
  },

  ExpectedInitializedValue: {
    code: "COOP11",
    severity: Severity.E,
    message: () => `Expected compiler option to be initialized before use.`,
  },

  ExpectedPlainTranslate: {
    code: "COOP12",
    severity: Severity.E,
    message: (...values: string[]) =>
      `Expected one of '${values.splice(1).join("', '")}', but received '${values[0]}'.`,
  },

  OptionNotSupported: {
    code: "COOP13",
    severity: Severity.W,
    message: (option: string) =>
      `The compiler option '${option}' is recognized but not supported by this preprocessor.`,
  },

  Assert: {
    InvalidParameter: {
      code: "COAS01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ENTRY" or "CONDITION", but received '${value}'.`,
    },
  },

  Aggregate: {
    InvalidParameter: {
      code: "COAG01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "DECIMAL" or "HEXADEC", but received '${value}'.`,
    },
  },

  Attributes: {
    InvalidParameter: {
      code: "COAT01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "FULL" or "SHORT", but received '${value}'.`,
    },
  },

  BackReg: {
    InvalidParameter: {
      code: "COBR01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "5" or "11", but received '${value}'.`,
    },
  },

  BiFPrec: {
    InvalidParameter: {
      code: "COBP01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "31" or "15", but received '${value}'.`,
    },
  },

  Blank: {
    InvalidParameterLength: {
      code: "COBL01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a single character, but received '${value}'.`,
    },
    InvalidParameter: {
      code: "COBL02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a valid blank character from the PLI character set, but received '${value}'.`,
    },
  },

  Brackets: {
    InvalidParameterLength: {
      code: "COBR01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a two-character string, but received '${value}'.`,
    },
    InvalidParameter: {
      code: "COBR02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected valid bracket characters from the PLI character set, but received '${value}'.`,
    },
    InvalidEqualCharacters: {
      code: "COBR03",
      severity: Severity.E,
      message: (value: string) =>
        `Expected two different characters for brackets, but received '${value}'.`,
    },
  },

  Case: {
    InvalidParameter: {
      code: "COCA01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "UPPER" or "ASIS", but received '${value}'.`,
    },
  },

  CaseRules: {
    InvalidParameter: {
      code: "COCR01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "KEYWORD", but received '${value}'.`,
    },
    InvalidKeywordParameter: {
      code: "COCR02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "MIXED", "UPPER", "LOWER" or "START", but received '${value}'.`,
    },
  },

  Check: {
    InvalidParameter: {
      code: "COCH01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "STORAGE" or "NOSTORAGE", but received '${value}'.`,
    },
  },

  CmPat: {
    InvalidParameter: {
      code: "COCM01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "LE", "V1", "V2" or "V3", but received '${value}'.`,
    },
  },

  CodePage: {
    InvalidParameter: {
      code: "COCP01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected one of ${Array.from(CompilerOptions.PLI_CODEPAGE_SET).join(", ")}, but received '${value}'.`,
    },
  },

  Compile: {
    InvalidParameter: {
      code: "COCO01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected S, W or E, but received '${value}'.`,
    },
  },

  Copyright: {
    InvalidParameterLength: {
      code: "COCR01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a string up to 1000 characters long, but received length ${value.length}.`,
    },
  },

  CSectCut: {
    InvalidParameter: {
      code: "COCC01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a number between 0 and 7, but received '${value}.`,
    },
  },

  Currency: {
    InvalidParameterLength: {
      code: "COCU01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a single character, but received '${value}'.`,
    },
    // TODO ssm: Mainframe actually reports a warning IBM1105I, and truncates to the first character.
  },

  DBRMLib: {
    InvalidEmptyParameter: {
      code: PLICodes.Warning.IBM1172I.code,
      severity: Severity.E,
      message: () => PLICodes.Warning.IBM1172I.message("DBRMLIB"),
    },
  },

  DD: {
    InvalidParameter: {
      code: "CODD01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a text containing only letters, but received '${value}'.`,
    },
  },

  DDSQL: {
    InvalidParameter: {
      code: "CODS01",
      severity: Severity.E,
      message: () => `DDSQL option value cannot be empty without parentheses.`,
    },
  },

  Decimal: {
    InvalidParameter: {
      code: "CODE01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected one of 'CHECKFLOAT', 'NOCHECKFLOAT', 'FOFLONADD', 'NOFOFLONADD', 'FOFLONASGN', 'NOFOFLONASGN', 'FOFLONDIV', 'NOFOFLONDIV', 'FOFLONMULT', 'NOFOFLONMULT', 'FORCEDSIGN', 'NOFORCEDSIGN', 'KEEPMINUS', 'NOKEEPMINUS', 'TRUNCFLOAT', 'NOTRUNCFLOAT', but received '${value}'.`,
    },
  },

  Default: {
    InvalidParameter: {
      code: "CODF01",
      severity: Severity.E,
      message: (value: string) => `Invalid default option value: ${value}.`,
    },
    InvalidInitFillParameter: {
      code: "CODF02",
      severity: Severity.E,
      message: (value: string) =>
        `INITFILL expects a hex value, but received '${value}'.`,
    },
  },

  Deprecate: {
    InvalidParameter: {
      code: "CODP01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected one of BUILTIN, ENTRY, INCLUDE, STMT or VARIABLE, but received '${value}'.`,
    },
    InvalidStatementParameter: {
      code: "CODP02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a statement name, but received '${value}'.`,
    },
  },

  Display: {
    InvalidSTDParameter: {
      code: "CODI01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected STD or WTO, but received '${value}'.`,
    },
    InvalidWTOParameter: {
      code: "CODI02",
      severity: Severity.E,
      message: (value: string) => `Expected WTO, but received '${value}'.`,
    },
    InvalidRoutCDEParameter: {
      code: "CODI03",
      severity: Severity.E,
      message: (value: string) =>
        `Expected ROUTCDE, DESC or REPLY, but received '${value}'.`,
    },
    InvalidParameter: {
      code: "CODI04",
      severity: Severity.E,
      message: () => `Expected a text or an option.`,
    },
  },

  Exit: {
    InvalidEmptyParameter: {
      code: PLICodes.Warning.IBM1172I.code,
      severity: Severity.E,
      message: () => PLICodes.Warning.IBM1172I.message("EXIT"),
    },
    InvalidParameterLength: {
      code: "COEX02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a string exceeds 1023 character limit. Received ${value.length} characters.`,
    },
  },

  Extrn: {
    InvalidParameter: {
      code: "COET01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "FULL" or "SHORT", but received '${value}'.`,
    },
  },

  Flag: {
    InvalidParameter: {
      code: "COFL01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected S, E, I or W, but received '${value}'.`,
    },
  },

  FileRef: {
    InvalidParameter: {
      code: "COFR01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "HASH" or "NOHASH", but received '${value}'.`,
    },
  },

  Float: {
    InvalidParameter: {
      code: "COFL01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "DFP" or "NODFP", but received '${value}'.`,
    },
  },

  FloatInMath: {
    InvalidParameter: {
      code: "COFM01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ASIS", "LONG" or "EXTENDED", but received '${value}'.`,
    },
  },

  GoNumber: {
    InvalidParameter: {
      code: "COGN01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "SEPARATE" or "NOSEPARATE", but received '${value}'.`,
    },
  },

  Header: {
    InvalidParameter: {
      code: "COHE01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ALL", "FILE", "FIRST" or "SOURCE", but received '${value}'.`,
    },
  },

  Hgpr: {
    InvalidParameter: {
      code: "COHG01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "PRESERVE" or "NOPRESERVE", but received '${value}'.`,
    },
  },

  Ignore: {
    InvalidParameter: {
      code: "COIG01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ASSERT", "DISPLAY" or "PUT", but received '${value}'.`,
    },
  },

  IncAfter: {
    InvalidParameter: {
      code: "COIA01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "PROCESS" option with a process name, but received '${value}'.`,
    },
  },

  InitAuto: {
    InvalidParameter: {
      code: "COIA01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "SHORT" or "FULL", but received '${value}'.`,
    },
  },

  InSource: {
    InvalidParameter: {
      code: "COIS01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "FULL", "SHORT", "ALL" or "FIRST", but received '${value}'.`,
    },
  },

  Json: {
    InvalidParameter: {
      code: "COJS01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "CASE", "ENCODING", "GET", "PARSE" or "TRIMR", but received '${value}'.`,
    },
    InvalidCaseParameter: {
      code: "COJS02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "UPPER", "LOWER" or "ASIS", but received '${value}'.`,
    },
    InvalidEncodingParameter: {
      code: "COJS03",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "UTF8", "EBCDIC", "37" or "1047", but received '${value}'.`,
    },
    InvalidGetParameter: {
      code: "COJS04",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "HEEDCASE" or "IGNORECASE", but received '${value}'.`,
    },
    InvalidParseParameter: {
      code: "COJS05",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "V1" or "V2", but received '${value}'.`,
    },
  },

  LangLvl: {
    InvalidParameter: {
      code: "COLL01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "OS" or "NOEXT", but received '${value}'.`,
    },
  },

  Limits: {
    InvalidParameter: {
      code: "COLI01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "EXTNAME", "FIXEDBIN", "FIXEDDEC", "NAME" or "STRING", but received '${value}'.`,
    },
    InvalidFixedBinMinParameter: {
      code: "COLI02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "31" or "63", but received '${value}'.`,
    },
    InvalidFixedBinMaxParameter: {
      code: "COLI03",
      severity: Severity.E,
      message: (value: string) => `Expected "63", but received '${value}'.`,
    },
    InvalidFixedDecMinParameter: {
      code: "COLI04",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "15" or "31", but received '${value}'.`,
    },
    InvalidFixedDecMaxParameter: {
      code: "COLI05",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "15" or "31", but received '${value}'.`,
    },
    InvalidFixedDecRange: {
      code: "COLI06",
      severity: Severity.E,
      message: () =>
        `The minimum fixed decimal value must be less or equal to the maximum fixed decimal value.`,
    },
    InvalidStringParameter: {
      code: "COLI07",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "32K", "64K", "512K", "8M" or "128M", but received '${value}'.`,
    },
  },

  LineCount: {
    InvalidRange: {
      code: "COLC01",
      severity: Severity.E,
      message: (value: string) =>
        `The line count must be between 10 and 65535, or 0, but received '${value}'.`,
    },
  },

  ListView: {
    InvalidParameter: {
      code: "COLV01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "SOURCE", "AFTERALL", "AFTERCICS", "AFTERMACRO" or "AFTERSQL", but received '${value}'.`,
    },
  },

  Lp: {
    InvalidParameter: {
      code: "COLP01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "32" or "64", but received '${value}'.`,
    },
  },

  Margini: {
    InvalidParameter: {
      code: "COMI01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a single character, but received '${value}'.`,
    },
  },

  Margins: {
    InvalidMarginPosition: {
      code: "COMR01",
      severity: Severity.E,
      message: () => `The left margin must be less than the right margin.`,
    },
    InvalidAnsPosition: {
      code: "COMR02",
      severity: Severity.E,
      message: () =>
        `The ANS character should be located outside of the values specified by m and n.`,
    },
  },

  MaxInit: {
    InvalidParameter: {
      code: "COMT01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a number followed by "K", "M" or "G", but received '${value}'.`,
    },
  },

  MaxNest: {
    InvalidParameter: {
      code: "COMN01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "BLOCK", "DO" or "IF", but received '${value}'.`,
    },
  },

  MaxStmt: {
    InvalidRange: {
      code: "COMS01",
      severity: Severity.E,
      message: () =>
        `The m statement count must be less or equal to the n statement count.`,
    },
  },

  MDeck: {
    InvalidParameter: {
      code: "COMD01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "AFTERALL" or "AFTERMACRO", but received '${value}'.`,
    },
  },

  MsgSummary: {
    InvalidParameter: {
      code: "COMS02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "XREF" or "NOXREF", but received '${value}'.`,
    },
  },

  NatLang: {
    InvalidParameter: {
      code: "COLN01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ENU" or "UEN", but received '${value}'.`,
    },
  },

  Names: {
    CharacterAlreadyDefined: PLICodes.Warning.IBM1108I,
    InvalidParameterLengths: PLICodes.Warning.IBM1205I,
  },

  Not: {
    InvalidParameterLength: {
      code: "CONO01",
      severity: Severity.W,
      message: (value: number) =>
        `Expected up to seven characters, but received ${value} characters.`,
    },
    InvalidParameterCharacter: {
      code: "CONO02",
      severity: Severity.W,
      message: (value: string) =>
        `Expected a valid not character, but received '${value}'.`,
    },
  },

  OffsetSize: {
    // [Warning] IBM1161I: The suboption 3 is not valid for the OFFSETSIZE compiler option.
    InvalidParameter: {
      code: "COOS01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "4" or "8", but received '${value}'.`,
    },
  },

  OnSnap: {
    InvalidParameter: {
      code: "COOS02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "STRINGRANGE" or "STRINGSIZE", but received '${value}'.`,
    },
  },

  Optimize: {
    InvalidParameter: {
      code: "COOP01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "0", "2", "3" or "TIME", but received '${value}'.`,
    },
  },

  Options: {
    InvalidParameter: {
      code: "COOP02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "DOC" or "ALL", but received '${value}'.`,
    },
  },

  Or: {
    InvalidParameterLength: {
      code: "COOR01",
      severity: Severity.W,
      message: (value: number) =>
        `Expected up to seven characters, but received ${value} characters.`,
    },
    InvalidParameterCharacter: {
      code: "COOR02",
      severity: Severity.W,
      message: (value: string) =>
        `Expected a valid or character, but received '${value}'.`,
    },
  },

  PP: {
    InvalidParameterType: {
      code: "COPP01",
      severity: Severity.E,
      message: () => `Expected plain or option value type.`,
    },
    InvalidParameter: {
      code: "COPP02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "CICS", "INCLUDE", "MACRO" or "SQL", but received '${value}'.`,
    },
    InvalidOptionParameter: {
      code: "COPP03",
      severity: Severity.E,
      message: (pp: string, value: number) =>
        `Expected exactly one value for the ${pp} option, but received ${value}.`,
    },
    MacroImplicitlyAdded: {
      code: "COPP04",
      severity: Severity.W,
      message: () =>
        `The MACRO option was specified, so the MACRO preprocessor is added to the beginning of the PP option's preprocessor list.`,
    },
    TooManyPreprocessorSteps: {
      code: "COPP05",
      severity: Severity.E,
      message: (count: number) =>
        `A maximum of 31 preprocessor steps can be specified, but received ${count}.`,
    },
    CicsInvokedMoreThanOnce: {
      code: "COPP06",
      severity: Severity.E,
      message: () => `The CICS preprocessor must be invoked at most once.`,
    },
    SqlInvokedTooManyTimes: {
      code: "COPP07",
      severity: Severity.E,
      message: () => `The SQL preprocessor must be invoked no more than twice.`,
    },
    SqlSecondInvocationRequiresIncOnly: {
      code: "COPP08",
      severity: Severity.E,
      message: () =>
        `The SQL preprocessor can only be invoked twice if the first invocation specifies INCONLY as its option.`,
    },
  },

  PrecType: {
    InvalidParameter: {
      code: "COPT01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ANS", "DECDIGIT" or "DECRESULT", but received '${value}'.`,
    },
  },

  Prefix: {
    InvalidParameter: {
      code: "COPX01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected one of the compiler condition "CONFORMANCE", "CONVERSION", "FIXEDOVERFLOW", "INVALIDOP", "OVERFLOW", "SIZE", "STRINGRANGE", "STRINGSIZE", "SUBSCRIPTRANGE", "UNDERFLOW" or "ZERODIVIDE", but received '${value}'.`,
    },
    ConditionIsAlwaysEnabled: {
      code: "COPX02",
      severity: Severity.E,
      message: (value: string) => `Condition '${value}' is always enabled.`,
    },
  },

  Proceed: {
    InvalidParameter: {
      code: "COPR01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "S", "E" or "W", but received '${value}'.`,
    },
  },

  Process: {
    InvalidParameter: {
      code: "COPR02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "DELETE" or "KEEP", but received '${value}'.`,
    },
  },

  Quote: {
    InvalidParameterLength: {
      code: "COQT01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a single character, but received '${value}'.`,
    },
    InvalidParameterCharacter: {
      code: "COQT02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a valid quote character, but received '${value}'.`,
    },
  },

  Respect: {
    InvalidParameter: {
      code: "CORE01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "DATE" or an empty value, but received '${value}'.`,
    },
  },

  RtCheck: {
    InvalidParameter: {
      code: "CORT01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "NONULLPTR", "NULLPTR" or "NULL370", but received '${value}'.`,
    },
  },

  Rules: {
    InvalidParameter: {
      code: "CORU01",
      severity: Severity.E,
      message: (value: string) =>
        `Received unknown RULES parameter: '${value}'.`,
    },
    InvalidSubParameter: {
      code: "CORU02",
      severity: Severity.E,
      message: (value: string) =>
        `The sub-option does not expect multiple values and will ignore '${value}'.`,
    },
    ExpectAllSourceParameter: {
      code: "CORU03",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ALL" or "SOURCE", but received '${value}'.`,
    },
    InvalidGotoParameter: {
      code: "CORU04",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "STRICT", "LOOSE" or "LOOSEFORWARD", but received '${value}'.`,
    },
    InvalidLaxEntryParameter: {
      code: "CORU05",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "STRICT" or "LOOSE", but received '${value}'.`,
    },
    InvalidLaxInOutParameter: {
      code: "CORU06",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ALL", "SOURCE", "STRICT" or "LOOSE", but received '${value}'.`,
    },
    InvalidLaxMarginsParameter: {
      code: "CORU07",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "STRICT" or "XNUMERIC", but received '${value}'.`,
    },
    InvalidLaxQualParameter: {
      code: "CORU08",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ALL", "FORCE", "STRICT", "LOOSE" or "FULL", but received '${value}'.`,
    },
    InvalidLaxScaleParameter: {
      code: "CORU09",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ALL", "SOURCE", "STRICT" or "LOOSE", but received '${value}'.`,
    },
    InvalidPaddingParameter: {
      code: "CORU10",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ALL", "SOURCE", "STRICT" or "LOOSE", but received '${value}'.`,
    },
  },

  Semantic: {
    InvalidParameter: {
      code: "COSE01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "S", "E" or "W", but received '${value}'.`,
    },
  },

  Service: {
    InvalidParameterLength: {
      code: "COSR01",
      severity: Severity.E,
      message: (length: number) =>
        `Expected a maximum length of 64 characters, but received '${length}'.`,
    },
    InvalidEmptyPlainParameter: {
      code: "COSR02",
      severity: Severity.E,
      message: () =>
        `Expected a non-empty plain value. Use a string for empty text.`,
    },
  },

  Static: {
    InvalidParameter: {
      code: "COST01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "SHORT" or "FULL", but received '${value}'.`,
    },
  },

  StringOfGraphic: {
    InvalidParameter: {
      code: "COSG01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "GRAPHIC" or "CHARACTER", but received '${value}'.`,
    },
  },

  Syntax: {
    InvalidParameter: {
      code: "COSY01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "S", "E" or "W", but received '${value}'.`,
    },
  },

  SysParm: {
    InvalidParameterLength: {
      code: "COSP01",
      severity: Severity.E,
      message: (value: string) =>
        `SYSPARM value exceeds maximum length of 1023 characters. Received '${value.length} characters.`,
    },
  },

  System: {
    InvalidParameter: {
      code: "COSY02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "MVS", "CICS", "IMS", "OS", or "TSO", but received '${value}'.`,
    },
  },

  Test: {
    InvalidParameter: {
      code: "COTS01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ALL", "BLOCK", "NONE", "PATH", "STMT", "HOOK", "NOHOOK", "SEPARATE", "NOSEPARATE", "SEPNAME", "NOSEPNAME", "SOURCE", "NOSOURCE", "SYM" or "NOSYM", but received '${value}'.`,
    },
  },

  Unroll: {
    InvalidParameter: {
      code: "COUN01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "AUTO" or "NO", but received '${value}'.`,
    },
  },

  Usage: {
    InvalidParameter: {
      code: "COUS01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "HEX", "REGEX", "ROUND", "SUBSTR", "UNSPEC", "UUID" or "VALIDDATE", but received '${value}'.`,
    },
    InvalidHexParameter: {
      code: "COUS02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "SIZE" or "CURRENTSIZE", but received '${value}'.`,
    },
    InvalidRegexParameter: {
      code: "COUS03",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "RESET" or "NORESET", but received '${value}'.`,
    },
    InvalidRoundParameter: {
      code: "COUS04",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "IBM" or "ANS", but received '${value}'.`,
    },
    InvalidSubstrParameter: {
      code: "COUS05",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "STRICT" or "LOOSE", but received '${value}'.`,
    },
    InvalidUnspecParameter: {
      code: "COUS06",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "IBM" or "ANS", but received '${value}'.`,
    },
    InvalidUuidParameter: {
      code: "COUS07",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "UPPER" or "LOWER", but received '${value}'.`,
    },
    InvalidValidDateParameter: {
      code: "COUS08",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "LOOSE" or "STRICT", but received '${value}'.`,
    },
  },

  WideChar: {
    InvalidParameter: {
      code: "COWC01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "BIGENDIAN" or "LITTLEENDIAN", but received '${value}'.`,
    },
  },

  Writable: {
    InvalidParameter: {
      code: "COWR01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "FWS" or "PRV", but received '${value}'.`,
    },
  },

  XInfo: {
    InvalidParameter: {
      code: "COXI01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "DEF", "NODEF", "MSG", "NOMSG", "SYM", "NOSYM", "SYN", "NOSYN", "XML", or "NOXML", but received '${value}'.`,
    },
    InvalidXmlParameter: {
      code: "COXI06",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "HASH" or "NOHASH", but received '${value}'.`,
    },
  },

  Xml: {
    InvalidParameter: {
      code: "COXM01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "UPPER", "CASE" or "XMLATTR", but received '${value}'.`,
    },
    InvalidCaseParameter: {
      code: "COXM02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "UPPER" or "ASIS", but received '${value}'.`,
    },
    InvalidXmlAttrParameter: {
      code: "COXM03",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "APOSTROPHE" or "QUOTE", but received '${value}'.`,
    },
  },

  XRef: {
    InvalidParameter: {
      code: "COXR01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "FULL", "SHORT", "IMPLICIT", or "EXPLICIT", but received '${value}'.`,
    },
    InvalidLengthParameter: {
      code: "COXR02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "FULL" or "SHORT", but received '${value}'.`,
    },
    InvalidStructureParameter: {
      code: "COXR03",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "FULL", "SHORT", "IMPLICIT", or "EXPLICIT", but received '${value}'.`,
    },
  },

  PPInclude: {
    InvalidParameterLength: {
      code: "COPPInclude01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a string up to 1000 characters long, but received length ${value.length}.`,
    },
  },

  PPMacro: {
    Case: {
      InvalidParameter: {
        code: "COPPMacro01",
        severity: Severity.E,
        message: (value: string) =>
          `Expected "UPPER" or "ASIS", but received '${value}'.`,
      },
    },

    Dbcs: {
      InvalidParameter: {
        code: "COPPMacro02",
        severity: Severity.E,
        message: (value: string) =>
          `Expected "EXACT" or "INEXACT", but received '${value}'.`,
      },
    },

    Deprecate: {
      InvalidSubOption: {
        code: "COPPMacro03",
        severity: Severity.E,
        message: (value: string) =>
          `Expected "ENTRY" suboption, but received '${value}'.`,
      },
    },

    Fixed: {
      InvalidParameter: {
        code: "COPPMacro04",
        severity: Severity.E,
        message: (value: string) =>
          `Expected "DECIMAL" or "BINARY", but received '${value}'.`,
      },
    },

    Ignore: {
      InvalidParameter: {
        code: "COPPMacro05",
        severity: Severity.E,
        message: (value: string) =>
          `Expected "NOPRINT", but received '${value}'.`,
      },
    },

    NamePrefix: {
      InvalidParameterLength: {
        code: "COPPMacro06",
        severity: Severity.E,
        message: (value: string) =>
          `Expected a single character, but received '${value}'.`,
      },
    },

    Rescan: {
      InvalidParameter: {
        code: "COPPMacro07",
        severity: Severity.E,
        message: (value: string) =>
          `Expected "UPPER" or "ASIS", but received '${value}'.`,
      },
    },
  },

  PPSQL: {
    Deprecate: {
      InvalidSubOption: {
        code: "COPPSQL01",
        severity: Severity.E,
        message: (value: string) =>
          `Expected "STMT" suboption, but received '${value}'.`,
      },

      InvalidSubStatement: {
        code: "COPPSQL02",
        severity: Severity.E,
        message: (value: string) =>
          `Expected "EXPLAIN", "GRANT", "REVOKE", or "SET_CURRENT_SQLID" suboption, but received '${value}'.`,
      },
    },
  },

  PPCICS: {
    Flag: {
      InvalidParameter: {
        code: "COPPICS01",
        severity: Severity.E,
        message: (value: string) =>
          `Expected "I", "W", "E" or "S", but received '${value}'.`,
      },
    },

    NatLang: {
      InvalidParameter: {
        code: "COPPICS02",
        severity: Severity.E,
        message: (value: string) =>
          `Expected "EN" or "KA", but received '${value}'.`,
      },
    },

    Margins: {
      InvalidMarginPosition: {
        code: "COPPICS03",
        severity: Severity.E,
        message: () => `The left margin must be less than the right margin.`,
      },

      InvalidAnsPosition: {
        code: "COPPICS04",
        severity: Severity.E,
        message: () =>
          `The ANS character should be located outside of the values specified by m and n.`,
      },
    },
  },
};
