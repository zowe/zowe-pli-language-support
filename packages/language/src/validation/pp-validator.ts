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
  CallStatement_checkArguments,
  MemberCall_checkArguments,
} from "./compiler/check-arguments";
import { IBM3970IS_IBM3971IS_check_pp_call_procedure } from "./compiler/IBM3970-IBM3971-call-procedure";
import { MACRO_Deprecate } from "./macro/deprecate";
import { MACRO_NamePrefix } from "./macro/nameprefix";
import { MACRO_Case } from "./macro/case";
import { ValidationAcceptor, ValidationChecks } from "./validator";
import { IBM1352IE_declared_item_pp_scan_repetition } from "./compiler/IBM1352IE-declare-item-scan-repetition";
import { LSPIS001_standalone_skip_directive_not_supported } from "./language-server/LSPIS001-skip-statement-not-supported";
import { DeprecateIncludes } from "./compiler/IBM2444Iff-deprecate";
import { typeCheck } from "./type-check-validator";
import { CompilationUnit } from "../workspace/compilation-unit";
import { IncludeDirective } from "../syntax-tree/ast";
import { DiagnosticCategory, DiagnosticCategoryToString } from "./diagnostics-store";
import { Severity } from "../language-server/types";

export function registerPreprocessorValidationChecks(): ValidationChecks {
  return {
    CallStatement: [
      CallStatement_checkArguments,
      IBM3970IS_IBM3971IS_check_pp_call_procedure,
    ],
    DeclaredItem: [IBM1352IE_declared_item_pp_scan_repetition, typeCheck],
    DeclaredVariable: [MACRO_NamePrefix, typeCheck],
    IncludeDirective: [DeprecateIncludes, PropagateIncludeErrors],
    Program: [MACRO_Case],
    ProcedureStatement: [MACRO_Deprecate, MACRO_NamePrefix],
    MemberCall: [MemberCall_checkArguments],
    SkipDirective: [LSPIS001_standalone_skip_directive_not_supported],
  };
}

function PropagateIncludeErrors(
  includeDirective: IncludeDirective,
  acceptor: ValidationAcceptor,
  compilationUnit: CompilationUnit,
): void {
  for (const item of includeDirective.items.filter((i) => i.filePath)) {
    for (const category of [DiagnosticCategory.Lexer, DiagnosticCategory.Parser, DiagnosticCategory.CompilerOptions]) {
      const errors = compilationUnit.diagnostics.getByUri(category, item.filePath!);
      if(errors.length > 0) {
        acceptor({
          uri: item.token?.uri?.toString(),
          range: item.range ?? undefined,
          message: `Included file '${item.relativeFilePath}' contains ${errors.length} ${DiagnosticCategoryToString[category]}.`,
          severity: Severity.E,
        });
      }
    }
  }
}