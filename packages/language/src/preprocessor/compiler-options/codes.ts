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
import { ParametricPLICode } from "../../validation/messages/pli-codes";

export const CompilerOptionsCodes = {
  WrongParameterCount: {
    code: "_COOP01",
    severity: Severity.W,
    message: (received: string, min: string, max?: string) => {
      if (min === max) {
        return `Expected ${min} arguments, but received ${received}.`;
      } else if (max === "") {
        return `Expected at least ${min} arguments, but received ${received}.`;
      } else {
        return `Expected between ${min} and ${max} arguments, but received ${received}.`;
      }
    },
    fullCode: "_COOP01W",
  } as ParametricPLICode,

  DupeOptionIssue: {
    code: "_COOP02",
    severity: Severity.W,
    message: (name: string) => `Duplicate compiler option ${name}`,
    fullCode: "_COOP02W",
  } as ParametricPLICode,

  MutexOptionIssue: {
    code: "_COOP03",
    severity: Severity.W,
    message: (name: string) =>
      `Mutually exclusive compiler options found for ${name}, only the last one will take effect.`,
    fullCode: "_COOP03W",
  } as ParametricPLICode,

  ExpectedOption: {
    code: "_COOP04",
    severity: Severity.W,
    message: (name: string) => `Expected a compiler option with arguments.`,
    fullCode: "_COOP04W",
  } as ParametricPLICode,

  ExpectedPlain: {
    code: "_COOP05",
    severity: Severity.W,
    message: (name: string) => `Expected a plain text value.`,
    fullCode: "_COOP05W",
  } as ParametricPLICode,

  ExpectedString: {
    code: "_COOP06",
    severity: Severity.W,
    message: (name: string) => `Expected a string value.`,
    fullCode: "_COOP06W",
  } as ParametricPLICode,

  ExpectedPlainOrString: {
    code: "_COOP07",
    severity: Severity.W,
    message: (name: string) => `Expected a plain text or string value.`,
    fullCode: "_COOP07W",
  } as ParametricPLICode,

  gonumber: {
    WrongParameter: {
      code: "_COGN01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "SEPARATE" or "NOSEPARATE", but received '${value}'.`,
      fullCode: "_COGN01W",
    } as ParametricPLICode,
  },

  header: {
    WrongParameter: {
      code: "_COHE01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "ALL", "FILE", "FIRST" or "SOURCE", but received '${value}'.`,
      fullCode: "_COHE01W",
    } as ParametricPLICode,
  },

  hgpr: {
    WrongParameter: {
      code: "_COHG01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "PRESERVE" or "NOPRESERVE", but received '${value}'.`,
      fullCode: "_COHG01W",
    } as ParametricPLICode,
  },

  ignore: {
    WrongParameter: {
      code: "_COIG01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "ASSERT", "DISPLAY" or "PUT", but received '${value}'.`,
      fullCode: "_COIG01W",
    } as ParametricPLICode,
  },

  initAuto: {
    WrongParameter: {
      code: "_COIA01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "SHORT" or "FULL", but received '${value}'.`,
      fullCode: "_COIA01W",
    } as ParametricPLICode,
  },

  inSource: {
    WrongParameter: {
      code: "_COIS01",
      severity: Severity.W,
      message: (value: string) =>
        `Expected "FULL", "SHORT", "ALL" or "FIRST", but received '${value}'.`,
      fullCode: "_COIS01W",
    } as ParametricPLICode,
  },
};
