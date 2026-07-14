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

// A recursive program pattern ("src\**\*.pli") binds PL/I files at ANY depth
// under "src" to its process group. A deeply nested program therefore picks up
// the group's libs, so its include resolves.
// See https://github.com/zowe/zowe-pli-language-support/issues/758

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/pgm_conf.json
//// {
////   "pgms": [
////     {
////       "program": "src\\**\\*.pli",
////       "pgroup": "grp"
////     }
////   ]
//// }

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "grp",
////             "libs": [
////                 "cpy"
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// @filename: cpy/lib.pli
//// DECLARE LIB_VAR FIXED;

// deeply nested program, matched by "src\**\*.pli"
// @filename: src/a/b/main.pli
//// %INCLUDE "lib.pli";

preprocessor.expectTokens(`
  DECLARE LIB_VAR FIXED;
`);
