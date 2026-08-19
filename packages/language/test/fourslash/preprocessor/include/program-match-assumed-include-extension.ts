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

// An extensionless entry assumes the bound process group's own
// include-extensions (not just the .pli/.pl1 fallback). The "iba" group
// declares ".cpy", so "KO/prog1" binds "KO/prog1.cpy" and its include resolves.
/// <reference path="../../framework.ts" />

// @filename: .pliplugin/pgm_conf.json
//// {
////   "pgms": [
////     {
////       "program": "KO/prog1",
////       "pgroup": "iba"
////     }
////   ]
//// }

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "iba",
////             "libs": [
////                 "cpy"
////             ],
////             "include-extensions": [
////                 ".cpy"
////             ]
////         }
////     ]
//// }

// @filename: cpy/lib.cpy
//// DECLARE LIB_VAR FIXED;

// @filename: KO/prog1.cpy
//// %INCLUDE "lib";

preprocessor.expectTokens(`
  DECLARE LIB_VAR FIXED;
`);
