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
// @wrap: process
////*PROCESS MARGINS(1, 72); xxx

verify.noDiagnostics();
verify.expectCompilerOptions({
  margins: {
    m: 1,
    n: 72,
  },
});
