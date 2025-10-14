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

// Test that specifying an absolute path to a library in proc_grps.json works correctly

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/pgm_conf.json
//// {
////   "pgms": [
////     {
////       "program": "/progs/*.pli",
////       "pgroup": "default"
////     }
////   ]
//// }

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "default",
////             "libs": [
////                 "/tmp/cpy"
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// @filename: /tmp/cpy/lib.pli
//// DECLARE LIB_VAR FIXED;

// @filename: /progs/main.pli
//// %INCLUDE "lib.pli";

preprocessor.expectTokens(`
  DECLARE LIB_VAR FIXED;
`);
