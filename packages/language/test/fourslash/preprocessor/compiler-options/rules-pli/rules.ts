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

/// <reference path="../../../framework.ts" />

// @wrap: process
////*PROCESS <|0:RULES|>;
////*PROCESS <|d1:RULES|>(<|1:)|>;
////*PROCESS <|d2:RULES|>(<|2:INVALID|>);
////*PROCESS <|d3:RULES|>(IBM, <|3:BYNAME|>);
////*PROCESS <|d4:RULES|>(ANS <|4:NOBYNAME|>);
////*PROCESS <|d5:RULES|>(NOCONTROLLED);
////*PROCESS <|d6:RULES|>(DECSIZE);
////*PROCESS <|d7:RULES|>(NOELSEIF);
////*PROCESS <|d8:RULES|>(NOEVENDEC);
////*PROCESS <|d9:RULES|>(NOGLOBALDO);
////*PROCESS <|d10:RULES|>(LAXBIF);
////*PROCESS <|d11:RULES|>(LAXCTL);
////*PROCESS <|d12:RULES|>(LAXDCL);
////*PROCESS <|d13:RULES|>(LAXDEF);
////*PROCESS <|d14:RULES|>(NOLAXEXPORTS);
////*PROCESS <|d15:RULES|>(NOLAXFIELDS);
////*PROCESS <|d16:RULES|>(LAXIF);
////*PROCESS <|d17:RULES|>(NOLAXINTERFACE);
////*PROCESS <|d18:RULES|>(NOLAXLINK);
////*PROCESS <|d19:RULES|>(NOLAXPACKAGE);
////*PROCESS <|d20:RULES|>(NOLAXPUNC);
////*PROCESS <|d21:RULES|>(NOLAXRETURN);
////*PROCESS <|d22:RULES|>(NOLAXSEMI);
////*PROCESS <|d23:RULES|>(NOLAXSTG);
////*PROCESS <|d24:RULES|>(NOLAXSTRZ);
////*PROCESS <|d25:RULES|>(MULTICLOSE);
////*PROCESS <|d26:RULES|>(NORECURSIVE);
////*PROCESS <|d27:RULES|>(NOSELFASSIGN);
////*PROCESS <|d28:RULES|>(NOUNSET);
////*PROCESS <|d29:RULES|>(NOYY);

verify.expectDiagnosticsAt(0, {
  message: code.CompilerOptions.InvalidParameterCount.message(0, 1),
});
verify.expectDiagnosticsAt(
  Array.from({ length: 28 }, (_, i) => `d${i + 1}`),
  {
    message: code.CompilerOptions.DupeOptionIssue.message("RULES"),
  },
);
verify.expectDiagnosticsAt(1, {
  message: code.CompilerOptions.ExpectedPlainNotEmpty.message(),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.Rules.InvalidParameter.message("INVALID"),
});
verify.noDiagnostics([3, 4]);
verify.expectCompilerOptions({
  rules: {
    ibm: constants.CompilerOptions.RulesIBM.ANS,
    byName: false,
    controlled: false,
    decSize: true,
    elseIf: false,
    evenDec: false,
    globalDo: false,
    laxBIf: true,
    laxCtl: true,
    laxDcl: true,
    laxDef: true,
    laxExports: false,
    laxFields: false,
    laxIf: true,
    laxInterface: false,
    laxLink: false,
    laxPackage: false,
    laxPunc: false,
    laxReturn: false,
    laxSemi: false,
    laxStg: false,
    laxStrz: false,
    multiClose: true,
    recursive: false,
    selfAssign: false,
    unset: constants.CompilerOptions.RulesSource.ALL,
    yy: false,
  },
});
