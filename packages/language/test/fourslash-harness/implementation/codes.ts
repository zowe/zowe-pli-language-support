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

import { CompilerOptionsCodes } from "../../../src/preprocessor/compiler-options/codes";
import { PliMarginsProcessor } from "../../../src/preprocessor/pli-margins-processor";
import { Severity } from "../../../src/language-server/types";
import {
  InternalCodes,
  TypeSystemCodes,
} from "../../../src/validation/internal-codes";
import { LspCodes } from "../../../src/validation/lsp-codes";
import { PLICodes } from "../../../src/validation/pli-codes";
import { HarnessTesterInterface } from "../harness-interface";

export const HarnessCodes: HarnessTesterInterface["code"] = {
  Severe: PLICodes.Severe,
  Warning: PLICodes.Warning,
  Information: PLICodes.Info,
  Error: PLICodes.Error,
  Internal: InternalCodes,
  LspCodes: LspCodes,
  Lexer: {
    Margins: {
      ErrorLeft: PliMarginsProcessor.MARGIN_ERROR_MESSAGE_LEFT,
      ErrorRight: PliMarginsProcessor.MARGIN_ERROR_MESSAGE_RIGHT,
    },
  },
  LSP: LspCodes,
  CompilerOptions: CompilerOptionsCodes,
  TypeSystem: TypeSystemCodes,
  Parser: {
    unexpectedToken: (tokenImage) => ({
      severity: Severity.S,
      message: new RegExp(`but found "${escapeRegExp(tokenImage)}"\\.$`),
    }),
  },
};

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
