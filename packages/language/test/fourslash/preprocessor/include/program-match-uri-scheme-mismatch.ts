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

// A URI-scheme entry names one remote member; a different member is unbound.
// User-scope settings, same as `program-match-uri-scheme.ts`.
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

// @filename: zowe-ds:/profile/IBMUSER.OTHER
// @noDefaultConfig
//// %INCLUDE <|inc:"lib.pli"|>;

preprocessor.expectTokens("");
verify.expectDiagnosticsAt(
  "inc",
  code.LSP.IncludeResolution.MissingConfiguration,
);
