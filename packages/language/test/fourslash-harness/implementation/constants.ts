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

import { HarnessTesterInterface } from "../harness-interface";
import { CompletionKeywords } from "../../../src/language-server/completion/keywords";
import { Severity } from "../../../src/language-server/types";
import { DefaultAttribute } from "../../../src/syntax-tree/ast";
import { CompilerOptions as PliCompilerOptions } from "../../../src/preprocessor/compiler-options/options-pli";
import { CompilerOptions as MacroCompilerOptions } from "../../../src/preprocessor/compiler-options/options-macro";
import { CompilerOptions as SQLCompilerOptions } from "../../../src/preprocessor/compiler-options/options-sql";
import { CompilerOptions as CICSCompilerOptions } from "../../../src/preprocessor/compiler-options/options-cics";

export const HarnessConstants: HarnessTesterInterface["constants"] = {
  CompletionKeywords,
  Severity,
  DefaultAttribute,
  CompilerOptions: Object.assign(PliCompilerOptions, {
    Macro: MacroCompilerOptions,
    SQL: SQLCompilerOptions,
    CICS: CICSCompilerOptions,
  }),
};
