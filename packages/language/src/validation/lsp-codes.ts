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

  UnknownIdentifier: {
    code: "UNKNOWN_IDENTIFIER",
    severity: Severity.E,
    message: (name: string) => `Unknown identifier '${name}'`,
  },

  BuiltinAttributes: {
    IsForbiddenUsage: {
      code: "BUILTIN_ATTRIBUTE_USAGE",
      severity: Severity.E,
      message: (attribute: string) =>
        `The attribute '${attribute}' is a builtin attribute and cannot be used in non-builtin files.`,
    },
    VariadicParameter: {
      IsNotLastParameter: {
        code: "VARIADIC_PARAMETER_NOT_LAST",
        severity: Severity.E,
        message: (name: string) =>
          `The variadic parameter '${name}' must be the last parameter in the parameter list.`,
      },
      HasMultipleParameters: {
        code: "VARIADIC_PARAMETER_MULTIPLE",
        severity: Severity.E,
        message: (name: string) =>
          `The variadic parameter '${name}' cannot be used because there is already another variadic parameter in the parameter list.`,
      },
      IsAFixedArray: {
        code: "VARIADIC_PARAMETER_IS_FIXED_ARRAY",
        severity: Severity.E,
        message: (name: string) =>
          `The variadic parameter '${name}' cannot be a fixed array. Variadic parameters must be declared with an assumed size (e.g. (*)) and cannot specify a size.`,
      },
      IsNotAnArray: {
        code: "VARIADIC_PARAMETER_NOT_AN_ARRAY",
        severity: Severity.E,
        message: (name: string) =>
          `The variadic parameter '${name}' must be an array. Variadic parameters must be declared with parentheses to indicate they are arrays (e.g. (*)).`,
      },
      IsNotAParameter: {
        code: "VARIADIC_NON_PARAMETER",
        severity: Severity.E,
        message: (name: string) =>
          `The variadic parameter '${name}' is not a parameter. Only parameters can be variadic.`,
      },
    },
  },
};
