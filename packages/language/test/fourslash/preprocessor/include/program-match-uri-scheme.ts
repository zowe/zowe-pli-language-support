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

// URI-scheme entries are keyed by path so a remote member matches the document
// it names. Without that, the entry is treated as workspace-relative and the
// include fails.
//
// User-scope settings (no `.pliplugin/`) so the fixture matches files that
// cannot use a project config. `@noDefaultConfig` stops the harness writing a
// default `.pliplugin/` that would win over these settings.
/// <reference path="../../framework.ts" />

// @filename: user-settings.json
//// {
////   "pli.pgm_conf": {
////     "pgms": [
////       {
////         "program": "zowe-ds:/profile/IBMUSER.SRC2",
////         "pgroup": "iba"
////       }
////     ]
////   },
////   "pli.proc_grps": {
////     "pgroups": [
////       {
////         "name": "iba",
////         "libs": [
////           "cpy"
////         ],
////         "include-extensions": [
////           ".pli"
////         ]
////       }
////     ]
////   }
//// }

// @filename: cpy/lib.pli
//// DECLARE LIB_VAR FIXED;

// @filename: zowe-ds:/profile/IBMUSER.SRC2
// @noDefaultConfig
//// %INCLUDE "lib.pli";

preprocessor.expectTokens(`
  DECLARE LIB_VAR FIXED;
`);
