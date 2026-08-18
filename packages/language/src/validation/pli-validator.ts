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

import { IBM1219I_leave_exits_noniterative_do } from "./compiler/IBM1219I-leave-exits-noniterative-do";
import { IBM1324IE_name_occurs_more_than_once_within_exports_clause } from "./compiler/IBM1324IE-name-occurs-more-than-once-within-exports-clause.js";
import { IBM1388IE_NODESCRIPTOR_attribute_is_invalid_when_any_parameter_has_NONCONNECTED_attribute } from "./compiler/IBM1388IE-NODESCRIPTOR-attribute-is-invalid-when-any-parameter-has-NONCONNECTED-attribute.js";
import { IBM2615I_do_loops_execute_once } from "./compiler/IBM2615I-do-loops-execute-once";
import { ValidationChecks } from "./validator";
import { IBM2412I_IBM2410I_IBM2409I_handle_return_stmt_and_returns_att } from "./compiler/IBM2412I-IBM2410I-IBM2409I-handle-return-stmt-and-returns-att";
import { typeCheck } from "./type-check-validator";
import { checkImplicitBuiltins } from "./language-server/implicit-builtins";
import { IBM1376IE_attributes_in_declaration_lists } from "./compiler/IBM1376IE-attributes-in-declaration-lists";
import {
  CallStatement_checkArguments,
  MemberCall_checkArguments,
} from "./compiler/check-arguments";
import { IBM1352IE_declared_item_pli_scan_repetition } from "./compiler/IBM1352IE-declare-item-scan-repetition";
import {
  DeprecateStatements,
  DeprecateVariables,
} from "./compiler/IBM2444Iff-deprecate";
import { IBM1213I_unreferenced_procedure } from "./compiler/IBM1213I-unreferenced-procedure";
import { checkProcedureCallsDimensions } from "./language-server/call-dimensions";
import { checkLabelPrefixSyntax } from "./language-server/label-prefix-syntax";
import { checkProcedureEnd } from "./language-server/procedure-end";

/**
 * A function that accepts a diagnostic for PL/I validation
 */

/**
 * Register custom validation checks.
 */
export function registerPliValidationChecks(): ValidationChecks {
  return {
    CallStatement: [CallStatement_checkArguments],
    DeclaredItem: [IBM1352IE_declared_item_pli_scan_repetition, typeCheck],
    DeclareStatement: [IBM1376IE_attributes_in_declaration_lists, typeCheck],
    DeclaredVariable: [DeprecateVariables, typeCheck],
    DefineAliasStatement: [typeCheck],
    DefineOrdinalStatement: [typeCheck],
    DoStatement: [IBM2615I_do_loops_execute_once],
    Exports: [IBM1324IE_name_occurs_more_than_once_within_exports_clause],
    LeaveStatement: [IBM1219I_leave_exits_noniterative_do],
    // TODO @montymxb Mar. 27th, 2025: Needs to have a way to readily access the containing 'document' (SourceFile) to compare the offsets (see def)
    // MemberCall: [IBM1747IS_Function_cannot_be_used_before_the_functions_descriptor_list_has_been_scanned],
    MemberCall: [MemberCall_checkArguments],
    ProcedureStatement: [
      IBM1388IE_NODESCRIPTOR_attribute_is_invalid_when_any_parameter_has_NONCONNECTED_attribute,
      IBM2412I_IBM2410I_IBM2409I_handle_return_stmt_and_returns_att,
      IBM1213I_unreferenced_procedure,
      checkProcedureEnd,
    ],
    ReferenceItem: [
      checkImplicitBuiltins,
      checkProcedureCallsDimensions,
      checkLabelPrefixSyntax,
    ],
    Statement: [DeprecateStatements],
    // TODO @wagner-laranjeiras -> When adding ReturnStatement to this list, make sure to include comment about IBM2412/10/09I.
  };
}
