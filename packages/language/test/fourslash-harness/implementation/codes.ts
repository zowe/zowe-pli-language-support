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

import { InternalCodes } from "../../../src/validation/internal-codes";
import { HarnessTesterInterface } from "../harness-interface";
import { PliMarginsProcessor } from "../../../src/preprocessor/pli-margins-processor";
import { CompilerOptionsCodes } from "../../../src/preprocessor/compiler-options/codes";
import { TypeSystemCodes } from "../../../src/validation/internal-codes";
import { PLICodes } from "../../../src/validation/pli-codes";

export const HarnessCodes: HarnessTesterInterface["code"] = {
  Severe: PLICodes.Severe,
  Warning: PLICodes.Warning,
  Information: PLICodes.Info,
  Error: PLICodes.Error,
  Internal: InternalCodes,
  Lexer: {
    Margins: {
      ErrorLeft: PliMarginsProcessor.MARGIN_ERROR_MESSAGE_LEFT,
      ErrorRight: PliMarginsProcessor.MARGIN_ERROR_MESSAGE_RIGHT,
    },
  },
  CompilerOptions: CompilerOptionsCodes,
  TypeSystem: TypeSystemCodes,
};
