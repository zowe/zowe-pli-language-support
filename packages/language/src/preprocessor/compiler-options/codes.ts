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
import { PLICodes } from "../../validation/messages";
import { ParametricPLICode } from "../../validation/messages/pli-codes";

export const CompilerOptionsCodes = {
  // At the moment, the actual codes are only used internally.
  // Only the message is presented to the user.
  InvalidParameterCount: {
    code: "COOP01",
    severity: Severity.W,
    message: (received: number, min: number, max?: number) => {
      if (min === max) {
        return `Expected ${min} argument${min === 1 ? "" : "s"}, but received ${received}.`;
      } else if (max === undefined) {
        return `Expected at least ${min} argument${min === 1 ? "" : "s"}, but received ${received}.`;
      } else {
        return `Expected between ${min} and ${max} argument${max === 1 ? "" : "s"}, but received ${received}.`;
      }
    },
    fullCode: "COOP01W",
  } as ParametricPLICode,

  DupeOptionIssue: {
    code: "COOP02",
    severity: Severity.W,
    message: (name: string) => `Duplicate compiler option ${name}`,
    fullCode: "COOP02W",
  } as ParametricPLICode,

  MutexOptionIssue: {
    code: "COOP03",
    severity: Severity.W,
    message: (name: string) =>
      `Mutually exclusive compiler options found for ${name}, only the last one will take effect.`,
    fullCode: "COOP03W",
  } as ParametricPLICode,

  ExpectedOption: {
    code: "COOP04",
    severity: Severity.W,
    message: () => `Expected a compiler option with arguments.`,
    fullCode: "COOP04W",
  } as ParametricPLICode,

  ExpectedPlain: {
    code: "COOP05",
    severity: Severity.W,
    message: () => `Expected a plain text value.`,
    fullCode: "COOP05W",
  } as ParametricPLICode,

  ExpectedString: {
    code: "COOP06",
    severity: Severity.W,
    message: () => `Expected a string value.`,
    fullCode: "COOP06W",
  } as ParametricPLICode,

  ExpectedPlainOrString: {
    code: "COOP07",
    severity: Severity.W,
    message: () => `Expected a plain text or string value.`,
    fullCode: "COOP07W",
  } as ParametricPLICode,

  ExpectedNumber: {
    code: "COOP08",
    severity: Severity.W,
    message: () => `Expected a number.`,
    fullCode: "COOP08W",
  } as ParametricPLICode,

  ExpectedNumberRange: {
    code: "COOP09",
    severity: Severity.W,
    message: (number: number, min: number, max: number) => {
      if (min !== undefined && max !== undefined) {
        return `Expected a number between ${min} and ${max}, but received ${number}.`;
      } else if (min) {
        return `Expected a number greater than or equal to ${min}, but received ${number}.`;
      } else {
        return `Expected a number less than or equal to ${max}, but received ${number}.`;
      }
    },
    fullCode: "COOP09W",
  } as ParametricPLICode,

  ExpectedPlainNotEmpty: {
    code: "COOP10",
    severity: Severity.W,
    message: () => `Expected a value.`,
    fullCode: "COOP10W",
  } as ParametricPLICode,

  GoNumber: {
    InvalidParameter: {
      code: "COGN01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "SEPARATE" or "NOSEPARATE", but received '${value}'.`,
      fullCode: "COGN01W",
    } as ParametricPLICode,
  },

  Header: {
    InvalidParameter: {
      code: "COHE01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "ALL", "FILE", "FIRST" or "SOURCE", but received '${value}'.`,
      fullCode: "COHE01W",
    } as ParametricPLICode,
  },

  Hgpr: {
    InvalidParameter: {
      code: "COHG01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "PRESERVE" or "NOPRESERVE", but received '${value}'.`,
      fullCode: "COHG01W",
    } as ParametricPLICode,
  },

  Ignore: {
    InvalidParameter: {
      code: "COIG01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "ASSERT", "DISPLAY" or "PUT", but received '${value}'.`,
      fullCode: "COIG01W",
    } as ParametricPLICode,
  },

  InitAuto: {
    InvalidParameter: {
      code: "COIA01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "SHORT" or "FULL", but received '${value}'.`,
      fullCode: "COIA01W",
    } as ParametricPLICode,
  },

  InSource: {
    InvalidParameter: {
      code: "COIS01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "FULL", "SHORT", "ALL" or "FIRST", but received '${value}'.`,
      fullCode: "COIS01W",
    } as ParametricPLICode,
  },

  Json: {
    InvalidParameter: {
      code: "COJS01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "CASE", "ENCODING", "GET", "PARSE" or "TRIMR", but received '${value}'.`,
      fullCode: "COJS01W",
    } as ParametricPLICode,
    InvalidCaseParameter: {
      code: "COJS02",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "UPPER", "LOWER" or "ASIS", but received '${value}'.`,
      fullCode: "COJS02W",
    } as ParametricPLICode,
    InvalidEncodingParameter: {
      code: "COJS03",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "UTF8", "EBCDIC", "37" or "1047", but received '${value}'.`,
      fullCode: "COJS03W",
    } as ParametricPLICode,
    InvalidGetParameter: {
      code: "COJS04",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "HEEDCASE" or "IGNORECASE", but received '${value}'.`,
      fullCode: "COJS04W",
    } as ParametricPLICode,
    InvalidParseParameter: {
      code: "COJS05",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "V1" or "V2", but received '${value}'.`,
      fullCode: "COJS05W",
    } as ParametricPLICode,
  },

  LangLvl: {
    InvalidParameter: {
      code: "COLL01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "OS" or "NOEXT", but received '${value}'.`,
      fullCode: "COLL01W",
    } as ParametricPLICode,
  },

  Limits: {
    InvalidParameter: {
      code: "COLI01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "EXTNAME", "FIXEDBIN", "FIXEDDEC", "NAME" or "STRING", but received '${value}'.`,
      fullCode: "COLI01W",
    } as ParametricPLICode,
    InvalidFixedBinMinParameter: {
      code: "COLI02",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "31" or "63", but received '${value}'.`,
      fullCode: "COLI02W",
    } as ParametricPLICode,
    InvalidFixedBinMaxParameter: {
      code: "COLI03",
      severity: Severity.W,
      message: (value: string) => `Expected "63", but received '${value}'.`,
      fullCode: "COLI03W",
    } as ParametricPLICode,
    InvalidFixedDecMinParameter: {
      code: "COLI04",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "15" or "31", but received '${value}'.`,
      fullCode: "COLI04W",
    } as ParametricPLICode,
    InvalidFixedDecMaxParameter: {
      code: "COLI05",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "15" or "31", but received '${value}'.`,
      fullCode: "COLI05W",
    } as ParametricPLICode,
    InvalidFixedDecRange: {
      code: "COLI06",
      severity: Severity.W,
      message: () =>
        `The minimum fixed decimal value must be less or equal to the maximum fixed decimal value.`,
      fullCode: "COLI06W",
    } as ParametricPLICode,
    InvalidStringParameter: {
      code: "COLI07",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "32K", "64K", "512K", "8M" or "128M", but received '${value}'.`,
      fullCode: "COLI07W",
    } as ParametricPLICode,
  },

  LineCount: {
    InvalidRange: {
      code: "COLC01",
      severity: Severity.W,
      message: (value: string) =>
        `The line count must be between 10 and 65535, or 0, but received '${value}'.`,
      fullCode: "COLC01W",
    } as ParametricPLICode,
  },

  ListView: {
    InvalidParameter: {
      code: "COLV01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "SOURCE", "AFTERALL", "AFTERCICS", "AFTERMACRO" or "AFTERSQL", but received '${value}'.`,
      fullCode: "COLV01W",
    } as ParametricPLICode,
  },

  Lp: {
    InvalidParameter: {
      code: "COLP01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "32" or "64", but received '${value}'.`,
      fullCode: "COLP01W",
    } as ParametricPLICode,
  },

  Margini: {
    InvalidParameter: {
      code: "COMI01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected a single character, but received '${value}'.`,
      fullCode: "COMI01W",
    } as ParametricPLICode,
  },

  // TODO ssmifi: Add codes for margins.

  MaxInit: {
    InvalidParameter: {
      code: "COMT01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected a number followed by "K", "M" or "G", but received '${value}'.`,
      fullCode: "COMT01W",
    } as ParametricPLICode,
  },

  MaxNest: {
    InvalidParameter: {
      code: "COMN01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "BLOCK", "DO" or "IF", but received '${value}'.`,
      fullCode: "COMN01W",
    } as ParametricPLICode,
  },

  MaxStmt: {
    InvalidRange: {
      code: "COMS01",
      severity: Severity.W,
      message: () =>
        `The m statement count must be less or equal to the n statement count.`,
      fullCode: "COMS01W",
    } as ParametricPLICode,
  },

  MDeck: {
    InvalidParameter: {
      code: "COMD01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "AFTERALL" or "AFTERMACRO", but received '${value}'.`,
      fullCode: "COMD01W",
    } as ParametricPLICode,
  },

  MsgSummary: {
    InvalidParameter: {
      code: "COMS02",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "XREF" or "NOXREF", but received '${value}'.`,
      fullCode: "COMS02W",
    } as ParametricPLICode,
  },

  NatLang: {
    InvalidParameter: {
      code: "COLN01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "ENU" or "UEN", but received '${value}'.`,
      fullCode: "COLN01W",
    } as ParametricPLICode,
  },

  Names: {
    CharacterAlreadyDefined: PLICodes.Warning.IBM1108I,
    InvalidParameterLengths: PLICodes.Warning.IBM1205I,
  },

  OffsetSize: {
    // [Warning] IBM1161I: The suboption 3 is not valid for the OFFSETSIZE compiler option.
    InvalidParameter: {
      code: "COOS01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "4" or "8", but received '${value}'.`,
      fullCode: "COOS01W",
    } as ParametricPLICode,
  },

  OnSnap: {
    InvalidParameter: {
      code: "COOS02",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "STRINGRANGE" or "STRINGSIZE", but received '${value}'.`,
      fullCode: "COOS02W",
    } as ParametricPLICode,
  },

  Optimize: {
    InvalidParameter: {
      code: "COOP01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "0", "2", "3" or "TIME", but received '${value}'.`,
      fullCode: "COOP01W",
    } as ParametricPLICode,
  },

  Options: {
    InvalidParameter: {
      code: "COOP02",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "DOC" or "ALL", but received '${value}'.`,
      fullCode: "COOP02W",
    } as ParametricPLICode,
  },

  PrecType: {
    InvalidParameter: {
      code: "COPT01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "ANS", "DECDIGIT" or "DECRESULT", but received '${value}'.`,
      fullCode: "COPT01W",
    } as ParametricPLICode,
  },

  Proceed: {
    InvalidParameter: {
      code: "COPR01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "S", "E" or "W", but received '${value}'.`,
      fullCode: "COPR01W",
    } as ParametricPLICode,
  },

  Process: {
    InvalidParameter: {
      code: "COPR02",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "DELETE" or "KEEP", but received '${value}'.`,
      fullCode: "COPR02W",
    } as ParametricPLICode,
  },

  Quote: {
    InvalidParameterLength: {
      code: "COQT01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected a single character, but received '${value}'.`,
      fullCode: "COQT01W",
    } as ParametricPLICode,
    InvalidParameterCharacter: {
      code: "COQT02",
      severity: Severity.W,
      message: (value: string) =>
        `Expected a valid quote character, but received '${value}'.`,
      fullCode: "COQT02W",
    } as ParametricPLICode,
  },

  Respect: {
    InvalidParameter: {
      code: "CORE01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "DATE" or an empty value, but received '${value}'.`,
      fullCode: "CORE01W",
    } as ParametricPLICode,
  },

  RtCheck: {
    InvalidParameter: {
      code: "CORT01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "NONULLPTR", "NULLPTR" or "NULL370", but received '${value}'.`,
      fullCode: "CORT01W",
    } as ParametricPLICode,
  },

  Semantic: {
    InvalidParameter: {
      code: "COSE01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "S", "E" or "W", but received '${value}'.`,
      fullCode: "COSE01W",
    } as ParametricPLICode,
  },

  Service: {
    InvalidParameterLength: {
      code: "COSR01",
      severity: Severity.W,
      message: (length: string) =>
        `Expected a maximum length of 64 characters, but received '${length}'.`,
      fullCode: "COSR01W",
    } as ParametricPLICode,
    InvalidEmptyPlainParameter: {
      code: "COSR02",
      severity: Severity.W,
      message: () =>
        `Expected a non-empty plain value. Use a string for empty text.`,
      fullCode: "COSR02W",
    } as ParametricPLICode,
  },

  Static: {
    InvalidParameter: {
      code: "COST01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "SHORT" or "FULL", but received '${value}'.`,
      fullCode: "COST01W",
    } as ParametricPLICode,
  },

  StringOfGraphic: {
    InvalidParameter: {
      code: "COSG01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "GRAPHIC" or "CHARACTER", but received '${value}'.`,
      fullCode: "COSG01W",
    } as ParametricPLICode,
  },

  Syntax: {
    InvalidParameter: {
      code: "COSY01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "S", "E" or "W", but received '${value}'.`,
      fullCode: "COSY01W",
    } as ParametricPLICode,
  },
};
