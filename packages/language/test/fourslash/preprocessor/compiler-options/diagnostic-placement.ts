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

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////         "name": "default",
////         "compiler-options": [
////             "AGGREGATE",
////             "MARGINS(2,7)"
////         ],
////         "pli-options": {
////            "SYSPARM": "'from process group'",
////            "SYSTEM": "MVS",
////            "MARGINS": "2,72"
////         },
////         "libs": [
////             "cpy"
////         ],
////         "include-extensions": [
////             ".pli",
////             ".cpy",
////             ".inc"
////         ]
////         }
////     ]
//// }

// @filename: main.pli
// @wrap: process
////*<|1:PROCESS|> NOPP;
////*PROCESS <|2:pp|>(cics(''));
////*PROCESS pp(<|3:include|>   /*Error4: no validation */
//// MPPROG: PROCEDURE OPTIONS (MAIN);
////    DCL TRUE BIT(1) INIT(1);
//// END MPPROG;

verify.expectDiagnosticsAt(1, {
  message:
    "PLI Plugin Config: " +
    code.CompilerOptions.DupeOptionIssue.message("MARGINS"),
});
verify.expectDiagnosticsAt(2, {
  message: code.CompilerOptions.MutexOptionIssue.message("PP"),
});
verify.expectDiagnosticsAt(3, {
  severity: constants.Severity.E,
  message: "Expecting token of type --> parenClose <-- but found --> '' <--",
});
