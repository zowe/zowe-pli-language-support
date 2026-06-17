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

// When a literal lib entry and a wildcard lib entry both resolve to the SAME
// directory, expansion deduplicates the overlap: the include still resolves
// exactly once, and neither entry is reported as unresolved.
// See https://github.com/zowe/zowe-pli-language-support/issues/628

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "default",
////             "libs": [
////                 "sub/inc",
////                 "*/inc"
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// Resolvable via BOTH the literal "sub/inc" and the wildcard "*/inc".
// @filename: sub/inc/shared.pli
//// DECLARE SHARED_VAR FIXED;

// @filename: main.pli
//// %INCLUDE "shared.pli";

// The overlapping libs collapse to a single computed entry: the include
// resolves once (one DECLARE), with no duplicate tokens.
preprocessor.expectTokens(`
  DECLARE SHARED_VAR FIXED;
`);

// Both lib entries resolve to a real directory, so neither is flagged as an
// unresolved entry (COPC01E).
verify.noDiagnostics();
