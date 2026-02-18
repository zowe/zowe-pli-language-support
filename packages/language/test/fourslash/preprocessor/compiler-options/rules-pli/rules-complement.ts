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
////*PROCESS RULES(ANS);
////*PROCESS <|RULES|>(NOBYNAME);
////*PROCESS <|RULES|>(CONTROLLED);
////*PROCESS <|RULES|>(NODECSIZE);
////*PROCESS <|RULES|>(ELSEIF);
////*PROCESS <|RULES|>(EVENDEC);
////*PROCESS <|RULES|>(GLOBALDO);
////*PROCESS <|RULES|>(NOLAXBIF);
////*PROCESS <|RULES|>(NOLAXCTL);
////*PROCESS <|RULES|>(NOLAXDCL);
////*PROCESS <|RULES|>(NOLAXDEF);
////*PROCESS <|RULES|>(LAXEXPORTS);
////*PROCESS <|RULES|>(LAXFIELDS);
////*PROCESS <|RULES|>(NOLAXIF);
////*PROCESS <|RULES|>(LAXINTERFACE);
////*PROCESS <|RULES|>(LAXLINK);
////*PROCESS <|RULES|>(LAXPACKAGE);
////*PROCESS <|RULES|>(LAXPUNC);
////*PROCESS <|RULES|>(LAXRETURN);
////*PROCESS <|RULES|>(LAXSEMI);
////*PROCESS <|RULES|>(LAXSTG);
////*PROCESS <|RULES|>(LAXSTRZ);
////*PROCESS <|RULES|>(NOMULTICLOSE);
////*PROCESS <|RULES|>(RECURSIVE);
////*PROCESS <|RULES|>(SELFASSIGN);
////*PROCESS <|RULES|>(UNSET);
////*PROCESS <|RULES|>(YY);

verify.expectDiagnosticsAt("RULES", {
  message: code.CompilerOptions.DupeOptionIssue.message("RULES"),
});
verify.expectCompilerOptions({
  rules: {
    ibm: constants.CompilerOptions.RulesIBM.ANS,
    byName: false,
    controlled: true,
    decSize: false,
    elseIf: true,
    evenDec: true,
    globalDo: true,
    laxBIf: false,
    laxCtl: false,
    laxDcl: false,
    laxDef: false,
    laxExports: true,
    laxFields: true,
    laxIf: false,
    laxInterface: true,
    laxLink: true,
    laxPackage: true,
    laxPunc: true,
    laxReturn: true,
    laxSemi: true,
    laxStg: true,
    laxStrz: true,
    multiClose: false,
    recursive: true,
    selfAssign: true,
    unset: true,
    yy: true,
  },
});
