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

export interface CompilerOptions {
  case?: {
    case: CompilerOptions.Case;
    explicitlySet: boolean;
  };
  dbcs?: CompilerOptions.Dbcs;
  deprecate?: Set<string>;
  deprecateNext?: Set<string>;
  eolComm?: boolean;
  fixed?: CompilerOptions.Fixed;
  id?: string;
  ignore?:
    | {
        noprint: boolean;
      }
    | false;
  incOnly?: boolean;
  namePrefix?:
    | {
        character: string;
      }
    | false;
  rescan?: CompilerOptions.Rescan;
}

export namespace CompilerOptions {
  export enum Case {
    UPPER,
    ASIS,
  }

  export enum Dbcs {
    EXACT,
    INEXACT,
  }

  export enum Fixed {
    DECIMAL,
    BINARY,
  }

  export enum Rescan {
    UPPER,
    ASIS,
  }
}

export function getDefaultCompilerOptions(): CompilerOptions {
  // Contrary to the spec, our current implementation and tests use UPPER as default for case and rescan.
  return {
    case: {
      case: CompilerOptions.Case.UPPER,
      explicitlySet: false,
    },
    dbcs: CompilerOptions.Dbcs.INEXACT,
    deprecate: new Set(),
    deprecateNext: new Set(),
    eolComm: true,
    fixed: CompilerOptions.Fixed.DECIMAL,
    id: "",
    ignore: false,
    incOnly: false,
    namePrefix: false,
    rescan: CompilerOptions.Rescan.UPPER,
  };
}
