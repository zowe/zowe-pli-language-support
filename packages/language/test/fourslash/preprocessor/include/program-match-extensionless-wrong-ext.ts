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

// An extensionless entry ("KO/prog1") only assumes PL/I source extensions, so
// an unrelated ".cbl" file is NOT bound: with no program config, its include
// cannot resolve and reports the missing-configuration diagnostic.
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
////                 ".pli"
////             ]
////         }
////     ]
//// }

// @filename: cpy/lib.pli
//// DECLARE LIB_VAR FIXED;

// @filename: KO/prog1.cbl
//// %INCLUDE <|inc:"lib.pli"|>;

// The ".cbl" file matches no program entry, so the unit is unbound and the
// include cannot be resolved.
preprocessor.expectTokens("");
verify.expectDiagnosticsAt(
  "inc",
  code.LSP.IncludeResolution.MissingConfiguration,
);
