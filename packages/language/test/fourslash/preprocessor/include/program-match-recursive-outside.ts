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

// A recursive "KO/**/*" glob is scoped to the KO directory: a file elsewhere
// ("other/x.pli") is NOT bound, so the unit has no configuration and its
// include cannot resolve.
/// <reference path="../../framework.ts" />

// @filename: .pliplugin/pgm_conf.json
//// {
////   "pgms": [
////     {
////       "program": "KO/**/*",
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
////                 ".pli"
////             ]
////         }
////     ]
//// }

// @filename: cpy/lib.pli
//// DECLARE LIB_VAR FIXED;

// @filename: other/x.pli
//// %INCLUDE <|inc:"lib.pli"|>;

preprocessor.expectTokens("");
verify.expectDiagnosticsAt(
  "inc",
  code.LSP.IncludeResolution.MissingConfiguration,
);
