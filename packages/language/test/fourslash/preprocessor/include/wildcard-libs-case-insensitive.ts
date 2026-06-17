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

// Wildcard lib matching is case-insensitive, consistent with the rest of
// include resolution. A pattern written as "**/INC" still matches a directory
// named "inc" on disk.
// See https://github.com/zowe/zowe-pli-language-support/issues/628

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "default",
////             "libs": [
////                 "**/INC"
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// Directory casing ("inc") differs from the pattern casing ("INC"); the match
// must still succeed.
// @filename: a/inc/lib.pli
//// DECLARE LIB_VAR FIXED;

// @filename: main.pli
//// %INCLUDE "lib.pli";

preprocessor.expectTokens(`
  DECLARE LIB_VAR FIXED;
`);
