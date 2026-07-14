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

// A wildcard on an ABSOLUTE lib path resolves against that absolute base, not
// the workspace. A trailing "**" includes the base folder's own files as well
// as everything nested beneath it.
// See https://github.com/zowe/zowe-pli-language-support/issues/758

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "default",
////             "libs": [
////                 "/abscpy/**"
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// directly inside the absolute base -> resolves because "**" includes the base
// @filename: /abscpy/base.pli
//// DECLARE BASE_VAR FIXED;

// nested beneath the absolute base -> resolves via the globstar
// @filename: /abscpy/sub/nested.pli
//// DECLARE NESTED_VAR FIXED;

// @filename: main.pli
//// %INCLUDE "base.pli";
//// %INCLUDE "nested.pli";

preprocessor.expectTokens(`
  DECLARE BASE_VAR FIXED;
  DECLARE NESTED_VAR FIXED;
`);
