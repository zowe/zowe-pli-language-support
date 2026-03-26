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
import {
  IBM3323I_IBM3324I_check_argument_count,
  MemberCall_checkArgumentCount,
} from "./compiler/check-argument-count";
import { IBM3970IS_IBM3971IS_check_pp_call_procedure } from "./compiler/IBM3970-IBM3971-call-procedure";
import { MACRO_Deprecate } from "./macro/deprecate";
import { MACRO_NamePrefix } from "./macro/nameprefix";
import { MACRO_Case } from "./macro/case";
import { ValidationChecks } from "./validator";
import { IBM1352IE_declared_item_pp_scan_repetition } from "./compiler/IBM1352IE-declare-item-scan-repetition";
import { LSPIS001_standalone_skip_directive_not_supported } from "./language-server/LSPIS001-skip-statement-not-supported";
import { DeprecateIncludes } from "./compiler/IBM2444Iff-deprecate";
import {
  BUILTIN_NoMultipleVariadicParameters,
  typeCheck,
} from "./type-check-validator";

export function registerPreprocessorValidationChecks(): ValidationChecks {
  return {
    CallStatement: [
      IBM3323I_IBM3324I_check_argument_count,
      IBM3970IS_IBM3971IS_check_pp_call_procedure,
    ],
    DeclaredItem: [IBM1352IE_declared_item_pp_scan_repetition, typeCheck],
    DeclaredVariable: [MACRO_NamePrefix, typeCheck],
    IncludeDirective: [DeprecateIncludes],
    Program: [MACRO_Case],
    ProcedureStatement: [
      MACRO_Deprecate,
      MACRO_NamePrefix,
      BUILTIN_NoMultipleVariadicParameters,
    ],
    MemberCall: [MemberCall_checkArgumentCount],
    SkipDirective: [LSPIS001_standalone_skip_directive_not_supported],
  };
}
