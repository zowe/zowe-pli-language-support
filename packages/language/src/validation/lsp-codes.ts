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

  /**
   * Member name validation codes
   */
  MemberValidation: {
    /**
     * Member name exceeds 8 characters
     */
    ExceedsMaxLength: {
      code: "LSPMV001",
      severity: Severity.E,
      message: "Member exceeds 8 characters.",
    },

    /**
     * Member name contains invalid characters (when validation is enabled)
     */
    InvalidName: {
      code: "LSPMV002",
      severity: Severity.E,
      message:
        "Member must start with a letter, followed by letters, numbers, @, #, _, or $.",
    },
  },
};
