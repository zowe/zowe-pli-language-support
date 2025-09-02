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

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////         "name": "default",
////         "lsp-options": {
////             "check-margins": true
////         }
////         }
////     ]
//// }

// @filename: main.pli
////*PROCESS GRAPHIC;
////*PROCESS NOGRAPHIC;
////*PROCESS NGR;
////*PROCESS GR;\r
//// STARTPR: PROCEDURE OPTIONS (MAIN);
//// END STARTPR;`;

verify.noDiagnosticsExcept([
  new RegExp(code.CompilerOptions.DupeOptionIssue.message("").substring(0, 20)),
  new RegExp(
    code.CompilerOptions.MutexOptionIssue.message("").substring(0, 20),
  ),
]);
