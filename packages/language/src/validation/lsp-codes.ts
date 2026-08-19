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
    code: "LSPUI001",
    severity: Severity.E,
    message: (name: string) => `Unknown identifier '${name}'`,
  },

  MissingEnd: {
    code: "LSPME001",
    severity: Severity.S,
    message: () => `Missing END statement for procedure.`,
  },

  TooLarge: {
    code: "LSPTL001",
    severity: Severity.W,
    message: (max: number) =>
      `Dimensions exceed the maximum allowed size of ${max}.`,
  },

  BuiltinAttributes: {
    IsForbiddenUsage: {
      code: "LSPTS001",
      severity: Severity.E,
      message: (attribute: string) =>
        `The attribute '${attribute}' is a builtin attribute and cannot be used in non-builtin files.`,
    },
  },

  PluginConfiguration: {
    UnresolvedEntry: {
      code: "COPC01",
      severity: Severity.E,
      message: (lib: string, reason?: string) =>
        `Plugin Configuration failed to resolve library entry '${lib}'.` +
        (reason ? ` ${reason}` : ""),
    },

    ParseError: {
      code: "COPC02",
      severity: Severity.E,
      message: (fileName: string, parseErrorCode: string) =>
        `Plugin Configuration parse error in ${fileName}: ${parseErrorCode}`,
    },

    InvalidStructure: {
      code: "COPC03",
      severity: Severity.E,
      message: (fileName: string, expected: string) =>
        `Plugin Configuration expected '${expected}' in ${fileName}.`,
    },

    UnknownProcessGroup: {
      code: "COPC04",
      severity: Severity.E,
      message: (pgroup: string) => `Unknown process group '${pgroup}'.`,
    },

    AmbiguousProgramLibOverlap: {
      code: "COPC05",
      severity: Severity.W,
      message: (dir: string, ext: string, pgroup: string) =>
        `Directory '${dir}' is both a library in process group '${pgroup}' and a program-entry location for '${ext}' files. ` +
        `Files ending in '${ext}' there are compiled as standalone programs and also used as includes, which is ambiguous. ` +
        `Consider using a separate directory for includes, or removing '${ext}' from this group's include-extensions.`,
    },
  },

  Cics: {
    DuplicatedSpecification: {
      code: "CICS001",
      severity: Severity.E,
      message: (specName: string) =>
        `Duplicated CICS specification: ${specName}.`,
    },
  },
};
