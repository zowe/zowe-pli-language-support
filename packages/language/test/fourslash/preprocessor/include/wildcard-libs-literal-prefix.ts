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

// A lib pattern with a literal prefix and a single "*" segment
// ("example/*/inc") only matches directories that have the literal prefix,
// exactly one intermediate segment, and the literal trailing segment. It does
// not match a different prefix, a too-shallow path, or a too-deep path.
// See https://github.com/zowe/zowe-pli-language-support/issues/628

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "default",
////             "libs": [
////                 "example/*/inc"
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// "example/foo/inc" -> matches "example/*/inc"
// @filename: example/foo/inc/in-foo.pli
//// DECLARE IN_FOO_VAR FIXED;

// "example/bar/inc" -> also matches (the "*" can be any single segment)
// @filename: example/bar/inc/in-bar.pli
//// DECLARE IN_BAR_VAR FIXED;

// "other/foo/inc" -> NOT matched: literal prefix is "example", not "other"
// @filename: other/foo/inc/in-other.pli
//// DECLARE IN_OTHER_VAR FIXED;

// "example/inc" -> NOT matched: the "*" must consume exactly one segment, so a
// two-segment path is too shallow for the three-segment pattern.
// @filename: example/inc/in-shallow.pli
//// DECLARE IN_SHALLOW_VAR FIXED;

// "example/foo/bar/inc" -> NOT matched: "*" matches a single segment only, so a
// four-segment path is too deep.
// @filename: example/foo/bar/inc/in-deep.pli
//// DECLARE IN_DEEP_VAR FIXED;

// @filename: main.pli
//// %INCLUDE "in-foo.pli";
//// %INCLUDE "in-bar.pli";
//// %INCLUDE "in-other.pli";
//// %INCLUDE "in-shallow.pli";
//// %INCLUDE "in-deep.pli";

// Only the two directories matching "example/*/inc" resolve; the wrong-prefix,
// too-shallow, and too-deep includes contribute no tokens.
preprocessor.expectTokens(`
  DECLARE IN_FOO_VAR FIXED;
  DECLARE IN_BAR_VAR FIXED;
`);
