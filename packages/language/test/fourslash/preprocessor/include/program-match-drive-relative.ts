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

// "C:foo" looks like a URI, but a single-letter scheme is a drive letter, so
// the entry must still resolve relative to the workspace.
//
// Stays on `.pliplugin/`: the harness infers the Windows root from
// `pgm_conf.json`. User settings alone would `init` `file:///` and `"C:foo"`
// would not join onto `C:\workspace`.
/// <reference path="../../framework.ts" />

// @filename: C:\workspace\.pliplugin\pgm_conf.json
//// {
////   "pgms": [
////     {
////       "program": "C:foo",
////       "pgroup": "iba"
////     }
////   ]
//// }

// @filename: C:\workspace\.pliplugin\proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "iba",
////             "libs": [
////                 "C:\\workspace\\cpy"
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// @filename: C:\workspace\cpy\lib.pli
//// DECLARE LIB_VAR FIXED;

// @filename: C:\workspace\C:foo
//// %INCLUDE "lib.pli";

preprocessor.expectTokens(`
  DECLARE LIB_VAR FIXED;
`);
