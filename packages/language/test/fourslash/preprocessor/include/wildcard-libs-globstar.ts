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

// A "**" globstar lib pattern matches a directory at any depth, including the
// workspace root. See https://github.com/zowe/zowe-pli-language-support/issues/628

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "default",
////             "libs": [
////                 "**/inc"
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// inc at the workspace root (globstar matches zero leading segments)
// @filename: inc/root.pli
//// DECLARE ROOT_VAR FIXED;

// inc one level deep
// @filename: a/inc/mid.pli
//// DECLARE MID_VAR FIXED;

// inc deeply nested
// @filename: a/b/c/inc/deep.pli
//// DECLARE DEEP_VAR FIXED;

// @filename: main.pli
//// %INCLUDE "root.pli";
//// %INCLUDE "mid.pli";
//// %INCLUDE "deep.pli";

preprocessor.expectTokens(`
  DECLARE ROOT_VAR FIXED;
  DECLARE MID_VAR FIXED;
  DECLARE DEEP_VAR FIXED;
`);
