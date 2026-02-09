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
////             "MARGINS(2,7)",
////             "AGGREGATE,"
////         ]
////         }
////     ]
//// }

// @filename: main.pli
////%<|process|> <|aggregate|>;
////  HELLO:
////    PROCEDURE OPTIONS(MAIN);
////    /*A PROGRAM TO OUTPUT HELLO WORLD*/  ;
////    PUT LIST ('HELLO, WELCOME TO PLI/1 WORLD ');
////  END HELLO;

verify.expectDiagnosticsAt("process", {
  message:
    "PLI Plugin Config: Expecting token of type --> value <-- but found --> '' <--",
});
verify.expectDiagnosticsAt("aggregate", {
  message: code.CompilerOptions.DupeOptionIssue.message("AGGREGATE"),
});
