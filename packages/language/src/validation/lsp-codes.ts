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

import { Severity } from "../language-server/types";

export const LspCodes = {
  IncludeResolution: {
    MissingConfiguration: {
      code: "LSPIR001",
      severity: Severity.E,
      message:
        "Could not resolve include directive. Plugin configuration is missing",
    },
    FileNotFound: {
      code: "LSPIR002",
      severity: Severity.S,
      message: (includefilename: string) =>
        `INCLUDE file "${includefilename}" not found.`,
    },
  },

  UpperCase: {
    code: "LSPUC001",
    severity: Severity.W,
    message: (token: string) => `Input text "${token}" must be uppercase.`,
  },

  SkipDirective: {
    InvalidSkip: {
      code: "LSPIS001",
      severity: Severity.W,
      message:
        "Standalone SKIP directive is not supported by the language server.",
    },
  },
};
