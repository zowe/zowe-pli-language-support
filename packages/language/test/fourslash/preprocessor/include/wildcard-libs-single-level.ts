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

// A single "*" segment lib pattern ("*/inc") matches exactly one directory
// level: it does NOT match an "inc" at the workspace root, nor a more deeply
// nested "inc". See https://github.com/zowe/zowe-pli-language-support/issues/628

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "default",
////             "libs": [
////                 "*/inc"
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// matches "*/inc" -> resolvable
// @filename: sub/inc/found.pli
//// DECLARE FOUND_VAR FIXED;

// root-level "inc" has no leading segment -> NOT matched by "*/inc"
// @filename: inc/atroot.pli
//// DECLARE ATROOT_VAR FIXED;

// two levels deep -> NOT matched by single-segment "*/inc"
// @filename: a/b/inc/toodeep.pli
//// DECLARE TOODEEP_VAR FIXED;

// @filename: main.pli
//// %INCLUDE "found.pli";
//// %INCLUDE "atroot.pli";
//// %INCLUDE "toodeep.pli";

// Only the one-level-deep copybook resolves; the unresolved includes simply
// contribute no tokens.
preprocessor.expectTokens(`
  DECLARE FOUND_VAR FIXED;
`);
