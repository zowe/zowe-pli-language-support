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
import { PLICodes, ParametricPLICode } from "../../validation/pli-codes";
import { CompilerOptions } from "./options";

export const CompilerOptionsCodes = {
  // At the moment, the actual codes are only used internally.
  // Only the message is presented to the user.
  UnknownOption: {
    ...PLICodes.Warning.IBM1159I,
    Severity: Severity.E,
  } as ParametricPLICode,

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
  } as ParametricPLICode,

  DupeOptionIssue: {
    code: "COOP02",
    severity: Severity.W,
    message: (name: string) => `Duplicate compiler option found for ${name}.`,
  } as ParametricPLICode,

  MutexOptionIssue: {
    code: "COOP03",
    severity: Severity.W,
    message: (name: string) =>
      `Mutually exclusive compiler options found for ${name}, only the last one will take effect.`,
  } as ParametricPLICode,

  ExpectedOption: {
    code: "COOP04",
    severity: Severity.E,
    message: () => `Expected a compiler option with arguments.`,
  } as ParametricPLICode,

  ExpectedPlain: {
    code: "COOP05",
    severity: Severity.E,
    message: () => `Expected a plain text value.`,
  } as ParametricPLICode,

  ExpectedString: {
    code: "COOP06",
    severity: Severity.E,
    message: () => `Expected a string value.`,
  } as ParametricPLICode,

  ExpectedPlainOrString: {
    code: "COOP07",
    severity: Severity.E,
    message: () => `Expected a plain text or string value.`,
  } as ParametricPLICode,

  ExpectedNumber: {
    code: "COOP08",
    severity: Severity.E,
    message: () => `Expected a number.`,
  } as ParametricPLICode,

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
  } as ParametricPLICode,

  ExpectedPlainNotEmpty: {
    code: "COOP10",
    severity: Severity.E,
    message: () => `Expected a value.`,
  } as ParametricPLICode,

  ExpectedInitializedValue: {
    code: "COOP11",
    severity: Severity.E,
    message: () => `Expected compiler option to be initialized before use.`,
  } as ParametricPLICode,

  ExpectedPlainTranslate: {
    code: "COOP12",
    severity: Severity.E,
    message: (...values: string[]) =>
      `Expected one of '${values.splice(1).join("', '")}', but received '${values[0]}'.`,
  } as ParametricPLICode,

  OptionNotSupported: {
    code: "COOP13",
    severity: Severity.W,
    message: (option: string) =>
      `The compiler option '${option}' is recognized but not supported by this preprocessor.`,
  } as ParametricPLICode,

  Assert: {
    InvalidParameter: {
      code: "COAS01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ENTRY" or "CONDITION", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Aggregate: {
    InvalidParameter: {
      code: "COAG01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "DECIMAL" or "BINARY", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Attributes: {
    InvalidParameter: {
      code: "COAT01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "FULL" or "SHORT", but received '${value}'.`,
    } as ParametricPLICode,
  },

  BackReg: {
    InvalidParameter: {
      code: "COBR01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "5" or "11", but received '${value}'.`,
    } as ParametricPLICode,
  },

  BiFPrec: {
    InvalidParameter: {
      code: "COBP01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "31" or "15", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Blank: {
    InvalidParameterLength: {
      code: "COBL01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a single character, but received '${value}'.`,
    } as ParametricPLICode,
    InvalidParameter: {
      code: "COBL02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a valid blank character from the PLI character set, but received '${value}'.`,
    } as ParametricPLICode,
  },

  Brackets: {
    InvalidParameterLength: {
      code: "COBR01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a two-character string, but received '${value}'.`,
    } as ParametricPLICode,
    InvalidParameter: {
      code: "COBR02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected valid bracket characters from the PLI character set, but received '${value}'.`,
    } as ParametricPLICode,
    InvalidEqualCharacters: {
      code: "COBR03",
      severity: Severity.E,
      message: (value: string) =>
        `Expected two different characters for brackets, but received '${value}'.`,
    } as ParametricPLICode,
  },

  Case: {
    InvalidParameter: {
      code: "COCA01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "UPPER" or "ASIS", but received '${value}'.`,
    } as ParametricPLICode,
  },

  CaseRules: {
    InvalidParameter: {
      code: "COCR01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "KEYWORD", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidKeywordParameter: {
      code: "COCR02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "MIXED", "UPPER", "LOWER" or "START", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Check: {
    InvalidParameter: {
      code: "COCH01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "STORAGE" or "NOSTORAGE", but received '${value}'.`,
    } as ParametricPLICode,
  },

  CmPat: {
    InvalidParameter: {
      code: "COCM01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "LE", "V1", "V2" or "V3", but received '${value}'.`,
    } as ParametricPLICode,
  },

  CodePage: {
    InvalidParameter: {
      code: "COCP01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected one of ${Array.from(CompilerOptions.PLI_CODEPAGE_SET).join(", ")}, but received '${value}'.`,
    } as ParametricPLICode,
  },

  Compile: {
    InvalidParameter: {
      code: "COCO01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected S, W or E, but received '${value}'.`,
    } as ParametricPLICode,
  },

  Copyright: {
    InvalidParameterLength: {
      code: "COCR01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a string up to 1000 characters long, but received length ${value.length}.`,
    } as ParametricPLICode,
  },

  CSectCut: {
    InvalidParameter: {
      code: "COCC01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a number between 0 and 7, but received '${value}.`,
    } as ParametricPLICode,
  },

  Currency: {
    InvalidParameterLength: {
      code: "COCU01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a single character, but received '${value}'.`,
    } as ParametricPLICode,
    // TODO ssm: Mainframe actually reports a warning IBM1105I, and truncates to the first character.
  },

  DBRMLib: {
    InvalidEmptyParameter: {
      code: PLICodes.Warning.IBM1172I.code,
      severity: Severity.E,
      message: () => PLICodes.Warning.IBM1172I.message("DBRMLIB"),
    } as ParametricPLICode,
  },

  DD: {
    InvalidParameter: {
      code: "CODD01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a text containing only letters, but received '${value}'.`,
    } as ParametricPLICode,
  },

  DDSQL: {
    InvalidParameter: {
      code: "CODS01",
      severity: Severity.E,
      message: () => `DDSQL option value cannot be empty without parentheses.`,
    } as ParametricPLICode,
  },

  Decimal: {
    InvalidParameter: {
      code: "CODE01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected one of 'CHECKFLOAT', 'NOCHECKFLOAT', 'FOFLONADD', 'NOFOFLONADD', 'FOFLONASGN', 'NOFOFLONASGN', 'FOFLONDIV', 'NOFOFLONDIV', 'FOFLONMULT', 'NOFOFLONMULT', 'FORCEDSIGN', 'NOFORCEDSIGN', 'KEEPMINUS', 'NOKEEPMINUS', 'TRUNCFLOAT', 'NOTRUNCFLOAT', but received '${value}'.`,
    } as ParametricPLICode,
  },

  Default: {
    InvalidParameter: {
      code: "CODF01",
      severity: Severity.E,
      message: (value: string) => `Invalid default option value: ${value}.`,
    } as ParametricPLICode,
    InvalidInitFillParameter: {
      code: "CODF02",
      severity: Severity.E,
      message: (value: string) =>
        `INITFILL expects a hex value, but received '${value}'.`,
    } as ParametricPLICode,
  },

  Deprecate: {
    InvalidParameter: {
      code: "CODP01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected one of BUILTIN, ENTRY, INCLUDE, STMT or VARIABLE, but received '${value}'.`,
    } as ParametricPLICode,
    InvalidStatementParameter: {
      code: "CODP02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a statement name, but received '${value}'.`,
    } as ParametricPLICode,
  },

  Display: {
    InvalidSTDParameter: {
      code: "CODI01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected STD or WTO, but received '${value}'.`,
    } as ParametricPLICode,
    InvalidWTOParameter: {
      code: "CODI02",
      severity: Severity.E,
      message: (value: string) => `Expected WTO, but received '${value}'.`,
    } as ParametricPLICode,
    InvalidRoutCDEParameter: {
      code: "CODI03",
      severity: Severity.E,
      message: (value: string) =>
        `Expected ROUTCDE, DESC or REPLY, but received '${value}'.`,
    } as ParametricPLICode,
    InvalidParameter: {
      code: "CODI04",
      severity: Severity.E,
      message: (value: string) => `Expected a text or an option.`,
    } as ParametricPLICode,
  },

  Exit: {
    InvalidEmptyParameter: {
      code: PLICodes.Warning.IBM1172I.code,
      severity: Severity.E,
      message: () => PLICodes.Warning.IBM1172I.message("EXIT"),
    } as ParametricPLICode,
    InvalidParameterLength: {
      code: "COEX02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a string exceeds 1023 character limit. Received ${value.length} characters.`,
    } as ParametricPLICode,
  },

  Extrn: {
    InvalidParameter: {
      code: "COET01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "FULL" or "SHORT", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Flag: {
    InvalidParameter: {
      code: "COFL01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected S, E, I or W, but received '${value}'.`,
    } as ParametricPLICode,
  },

  FileRef: {
    InvalidParameter: {
      code: "COFR01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "HASH" or "NOHASH", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Float: {
    InvalidParameter: {
      code: "COFL01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "DFP" or "NODFP", but received '${value}'.`,
    } as ParametricPLICode,
  },

  FloatInMath: {
    InvalidParameter: {
      code: "COFM01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ASIS", "LONG" or "EXTENDED", but received '${value}'.`,
    } as ParametricPLICode,
  },

  GoNumber: {
    InvalidParameter: {
      code: "COGN01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "SEPARATE" or "NOSEPARATE", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Header: {
    InvalidParameter: {
      code: "COHE01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ALL", "FILE", "FIRST" or "SOURCE", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Hgpr: {
    InvalidParameter: {
      code: "COHG01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "PRESERVE" or "NOPRESERVE", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Ignore: {
    InvalidParameter: {
      code: "COIG01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ASSERT", "DISPLAY" or "PUT", but received '${value}'.`,
    } as ParametricPLICode,
  },

  IncAfter: {
    InvalidParameter: {
      code: "COIA01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "PROCESS" option with a process name, but received '${value}'.`,
    } as ParametricPLICode,
  },

  InitAuto: {
    InvalidParameter: {
      code: "COIA01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "SHORT" or "FULL", but received '${value}'.`,
    } as ParametricPLICode,
  },

  InSource: {
    InvalidParameter: {
      code: "COIS01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "FULL", "SHORT", "ALL" or "FIRST", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Json: {
    InvalidParameter: {
      code: "COJS01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "CASE", "ENCODING", "GET", "PARSE" or "TRIMR", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidCaseParameter: {
      code: "COJS02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "UPPER", "LOWER" or "ASIS", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidEncodingParameter: {
      code: "COJS03",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "UTF8", "EBCDIC", "37" or "1047", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidGetParameter: {
      code: "COJS04",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "HEEDCASE" or "IGNORECASE", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidParseParameter: {
      code: "COJS05",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "V1" or "V2", but received '${value}'.`,
    } as ParametricPLICode,
  },

  LangLvl: {
    InvalidParameter: {
      code: "COLL01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "OS" or "NOEXT", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Limits: {
    InvalidParameter: {
      code: "COLI01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "EXTNAME", "FIXEDBIN", "FIXEDDEC", "NAME" or "STRING", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidFixedBinMinParameter: {
      code: "COLI02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "31" or "63", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidFixedBinMaxParameter: {
      code: "COLI03",
      severity: Severity.E,
      message: (value: string) => `Expected "63", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidFixedDecMinParameter: {
      code: "COLI04",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "15" or "31", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidFixedDecMaxParameter: {
      code: "COLI05",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "15" or "31", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidFixedDecRange: {
      code: "COLI06",
      severity: Severity.E,
      message: () =>
        `The minimum fixed decimal value must be less or equal to the maximum fixed decimal value.`,
    } as ParametricPLICode,
    InvalidStringParameter: {
      code: "COLI07",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "32K", "64K", "512K", "8M" or "128M", but received '${value}'.`,
    } as ParametricPLICode,
  },

  LineCount: {
    InvalidRange: {
      code: "COLC01",
      severity: Severity.E,
      message: (value: string) =>
        `The line count must be between 10 and 65535, or 0, but received '${value}'.`,
    } as ParametricPLICode,
  },

  ListView: {
    InvalidParameter: {
      code: "COLV01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "SOURCE", "AFTERALL", "AFTERCICS", "AFTERMACRO" or "AFTERSQL", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Lp: {
    InvalidParameter: {
      code: "COLP01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "32" or "64", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Margini: {
    InvalidParameter: {
      code: "COMI01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a single character, but received '${value}'.`,
    } as ParametricPLICode,
  },

  Margins: {
    InvalidMarginPosition: {
      code: "COMR01",
      severity: Severity.E,
      message: (value: string) =>
        `The left margin must be less than the right margin.`,
    } as ParametricPLICode,
    InvalidAnsPosition: {
      code: "COMR02",
      severity: Severity.E,
      message: (value: string) =>
        `The ANS character should be located outside of the values specified by m and n.`,
    } as ParametricPLICode,
  },

  MaxInit: {
    InvalidParameter: {
      code: "COMT01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a number followed by "K", "M" or "G", but received '${value}'.`,
    } as ParametricPLICode,
  },

  MaxNest: {
    InvalidParameter: {
      code: "COMN01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "BLOCK", "DO" or "IF", but received '${value}'.`,
    } as ParametricPLICode,
  },

  MaxStmt: {
    InvalidRange: {
      code: "COMS01",
      severity: Severity.E,
      message: () =>
        `The m statement count must be less or equal to the n statement count.`,
    } as ParametricPLICode,
  },

  MDeck: {
    InvalidParameter: {
      code: "COMD01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "AFTERALL" or "AFTERMACRO", but received '${value}'.`,
    } as ParametricPLICode,
  },

  MsgSummary: {
    InvalidParameter: {
      code: "COMS02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "XREF" or "NOXREF", but received '${value}'.`,
    } as ParametricPLICode,
  },

  NatLang: {
    InvalidParameter: {
      code: "COLN01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ENU" or "UEN", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Names: {
    CharacterAlreadyDefined: PLICodes.Warning.IBM1108I,
    InvalidParameterLengths: PLICodes.Warning.IBM1205I,
  },

  Not: {
    InvalidParameterLength: {
      code: "CONO01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected a single character, but received '${value}'.`,
    } as ParametricPLICode,
    InvalidParameterCharacter: {
      code: "CONO02",
      severity: Severity.W,
      message: (value: string) =>
        `Expected a valid not character, but received '${value}'.`,
    } as ParametricPLICode,
  },

  OffsetSize: {
    // [Warning] IBM1161I: The suboption 3 is not valid for the OFFSETSIZE compiler option.
    InvalidParameter: {
      code: "COOS01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "4" or "8", but received '${value}'.`,
    } as ParametricPLICode,
  },

  OnSnap: {
    InvalidParameter: {
      code: "COOS02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "STRINGRANGE" or "STRINGSIZE", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Optimize: {
    InvalidParameter: {
      code: "COOP01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "0", "2", "3" or "TIME", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Options: {
    InvalidParameter: {
      code: "COOP02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "DOC" or "ALL", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Or: {
    InvalidParameterLength: {
      code: "COOR01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected a single character, but received '${value}'.`,
    } as ParametricPLICode,
    InvalidParameterCharacter: {
      code: "COOR02",
      severity: Severity.W,
      message: (value: string) =>
        `Expected a valid or character, but received '${value}'.`,
    } as ParametricPLICode,
  },

  PP: {
    InvalidParameterType: {
      code: "COPP01",
      severity: Severity.E,
      message: () => `Expected plain or option value type.`,
    } as ParametricPLICode,
    InvalidParameter: {
      code: "COPP02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "CICS", "INCLUDE", "MACRO" or "SQL", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidOptionParameter: {
      code: "COPP03",
      severity: Severity.E,
      message: (pp: string, value: string) =>
        `Expected exactly one value for the ${pp} option, but received ${value}.`,
    } as ParametricPLICode,
  },

  PrecType: {
    InvalidParameter: {
      code: "COPT01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ANS", "DECDIGIT" or "DECRESULT", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Prefix: {
    InvalidParameter: {
      code: "COPX01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected one of the compiler condition "CONFORMANCE", "CONVERSION", "FIXEDOVERFLOW", "INVALIDOP", "OVERFLOW", "SIZE", "STRINGRANGE", "STRINGSIZE", "SUBSCRIPTRANGE", "UNDERFLOW" or "ZERODIVIDE", but received '${value}'.`,
    } as ParametricPLICode,
    ConditionIsAlwaysEnabled: {
      code: "COPX02",
      severity: Severity.E,
      message: (value: string) => `Condition '${value}' is always enabled.`,
    } as ParametricPLICode,
  },

  Proceed: {
    InvalidParameter: {
      code: "COPR01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "S", "E" or "W", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Process: {
    InvalidParameter: {
      code: "COPR02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "DELETE" or "KEEP", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Quote: {
    InvalidParameterLength: {
      code: "COQT01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a single character, but received '${value}'.`,
    } as ParametricPLICode,
    InvalidParameterCharacter: {
      code: "COQT02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected a valid quote character, but received '${value}'.`,
    } as ParametricPLICode,
  },

  Respect: {
    InvalidParameter: {
      code: "CORE01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "DATE" or an empty value, but received '${value}'.`,
    } as ParametricPLICode,
  },

  RtCheck: {
    InvalidParameter: {
      code: "CORT01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "NONULLPTR", "NULLPTR" or "NULL370", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Rules: {
    InvalidParameter: {
      code: "CORU01",
      severity: Severity.E,
      message: (value: string) =>
        `Received unknown RULES parameter: '${value}'.`,
    } as ParametricPLICode,
    ExpectAllSourceParameter: {
      code: "CORU02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ALL" or "SOURCE", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidGotoParameter: {
      code: "CORU03",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "STRICT", "LOOSE" or "LOOSEFORWARD", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidLaxEntryParameter: {
      code: "CORU04",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "STRICT" or "LOOSE", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidLaxInOutParameter: {
      code: "CORU05",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ALL", "SOURCE", "STRICT" or "LOOSE", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidLaxMarginsParameter: {
      code: "CORU06",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "STRICT" or "XNUMERIC", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidLaxQualParameter: {
      code: "CORU07",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ALL", "FORCE", "STRICT", "LOOSE" or "FULL", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidLaxScaleParameter: {
      code: "CORU08",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ALL", "SOURCE", "STRICT" or "LOOSE", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidPaddingParameter: {
      code: "CORU08",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ALL", "SOURCE", "STRICT" or "LOOSE", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Semantic: {
    InvalidParameter: {
      code: "COSE01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "S", "E" or "W", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Service: {
    InvalidParameterLength: {
      code: "COSR01",
      severity: Severity.E,
      message: (length: string) =>
        `Expected a maximum length of 64 characters, but received '${length}'.`,
    } as ParametricPLICode,
    InvalidEmptyPlainParameter: {
      code: "COSR02",
      severity: Severity.E,
      message: () =>
        `Expected a non-empty plain value. Use a string for empty text.`,
    } as ParametricPLICode,
  },

  Static: {
    InvalidParameter: {
      code: "COST01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "SHORT" or "FULL", but received '${value}'.`,
    } as ParametricPLICode,
  },

  StringOfGraphic: {
    InvalidParameter: {
      code: "COSG01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "GRAPHIC" or "CHARACTER", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Syntax: {
    InvalidParameter: {
      code: "COSY01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "S", "E" or "W", but received '${value}'.`,
    } as ParametricPLICode,
  },

  SysParm: {
    InvalidParameterLength: {
      code: "COSP01",
      severity: Severity.E,
      message: (value: string) =>
        `SYSPARM value exceeds maximum length of 1023 characters. Received '${value.length} characters.`,
    } as ParametricPLICode,
  },

  System: {
    InvalidParameter: {
      code: "COSY02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "MVS", "CICS", "IMS", "OS", or "TSO", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Test: {
    InvalidParameter: {
      code: "COTS01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "ALL", "BLOCK", "NONE", "PATH", "STMT", "HOOK", "NOHOOK", "SEPARATE", "NOSEPARATE", "SEPNAME", "NOSEPNAME", "SOURCE", "NOSOURCE", "SYM" or "NOSYM", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Unroll: {
    InvalidParameter: {
      code: "COUN01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "AUTO" or "NO", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Usage: {
    InvalidParameter: {
      code: "COUS01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "HEX", "REGEX", "ROUND", "SUBSTR", "UNSPEC", "UUID" or "VALIDDATE", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidHexParameter: {
      code: "COUS02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "SIZE" or "CURRENTSIZE", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidRegexParameter: {
      code: "COUS03",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "RESET" or "NORESET", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidRoundParameter: {
      code: "COUS04",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "IBM" or "ANS", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidSubstrParameter: {
      code: "COUS05",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "STRICT" or "LOOSE", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidUnspecParameter: {
      code: "COUS06",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "IBM" or "ANS", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidUuidParameter: {
      code: "COUS07",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "UPPER" or "LOWER", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidValidDateParameter: {
      code: "COUS08",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "LOOSE" or "STRICT", but received '${value}'.`,
    } as ParametricPLICode,
  },

  WideChar: {
    InvalidParameter: {
      code: "COWC01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "BIGENDIAN" or "LITTLEENDIAN", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Writable: {
    InvalidParameter: {
      code: "COWR01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "FWS" or "PRV", but received '${value}'.`,
    } as ParametricPLICode,
  },

  XInfo: {
    InvalidParameter: {
      code: "COXI01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "DEF", "NODEF", "MSG", "NOMSG", "SYM", "NOSYM", "SYN", "NOSYN", "XML", or "NOXML", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidXmlParameter: {
      code: "COXI06",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "HASH" or "NOHASH", but received '${value}'.`,
    } as ParametricPLICode,
  },

  Xml: {
    InvalidParameter: {
      code: "COXM01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "UPPER", "CASE" or "XMLATTR", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidCaseParameter: {
      code: "COXM02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "UPPER" or "ASIS", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidXmlAttrParameter: {
      code: "COXM03",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "APOSTROPHE" or "QUOTE", but received '${value}'.`,
    } as ParametricPLICode,
  },

  XRef: {
    InvalidParameter: {
      code: "COXR01",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "FULL", "SHORT", "IMPLICIT", or "EXPLICIT", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidLengthParameter: {
      code: "COXR02",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "FULL" or "SHORT", but received '${value}'.`,
    } as ParametricPLICode,
    InvalidStructureParameter: {
      code: "COXR03",
      severity: Severity.E,
      message: (value: string) =>
        `Expected "FULL", "SHORT", "IMPLICIT", or "EXPLICIT", but received '${value}'.`,
    } as ParametricPLICode,
  },

  PPMacro: {
    Case: {
      InvalidParameter: {
        code: "COPPMacro01",
        severity: Severity.E,
        message: (value: string) =>
          `Expected "UPPER" or "ASIS", but received '${value}'.`,
      } as ParametricPLICode,
    },

    Dbcs: {
      InvalidParameter: {
        code: "COPPMacro02",
        severity: Severity.E,
        message: (value: string) =>
          `Expected "EXACT" or "INEXACT", but received '${value}'.`,
      } as ParametricPLICode,
    },

    Deprecate: {
      InvalidSubOption: {
        code: "COPPMacro03",
        severity: Severity.E,
        message: (value: string) =>
          `Expected "ENTRY" suboption, but received '${value}'.`,
      } as ParametricPLICode,
    },

    Fixed: {
      InvalidParameter: {
        code: "COPPMacro04",
        severity: Severity.E,
        message: (value: string) =>
          `Expected "DECIMAL" or "BINARY", but received '${value}'.`,
      } as ParametricPLICode,
    },

    Ignore: {
      InvalidParameter: {
        code: "COPPMacro05",
        severity: Severity.E,
        message: (value: string) =>
          `Expected "NOPRINT", but received '${value}'.`,
      } as ParametricPLICode,
    },

    NamePrefix: {
      InvalidParameterLength: {
        code: "COPPMacro06",
        severity: Severity.E,
        message: (value: string) =>
          `Expected a single character, but received '${value}'.`,
      } as ParametricPLICode,
    },

    Rescan: {
      InvalidParameter: {
        code: "COPPMacro07",
        severity: Severity.E,
        message: (value: string) =>
          `Expected "UPPER" or "ASIS", but received '${value}'.`,
      } as ParametricPLICode,
    },
  },

  PPSQL: {
    Deprecate: {
      InvalidSubOption: {
        code: "COPPSQL01",
        severity: Severity.E,
        message: (value: string) =>
          `Expected "STMT" suboption, but received '${value}'.`,
      } as ParametricPLICode,

      InvalidSubStatement: {
        code: "COPPSQL02",
        severity: Severity.E,
        message: (value: string) =>
          `Expected "EXPLAIN", "GRANT", "REVOKE", or "SET_CURRENT_SQLID" suboption, but received '${value}'.`,
      } as ParametricPLICode,
    },
  },
};
