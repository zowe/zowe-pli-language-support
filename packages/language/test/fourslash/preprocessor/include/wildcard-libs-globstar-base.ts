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

// A trailing "**" globstar ("copybooks/**") includes the base folder's OWN files
// as well as everything nested beneath it. "minimatch" does not match the base
// directory against "copybooks/**" on its own, so the expander adds it explicitly.
// See https://github.com/zowe/zowe-pli-language-support/issues/758

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "default",
////             "libs": [
////                 "copybooks/**"
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// directly inside the base folder -> resolves because "**" includes the base
// @filename: copybooks/base.pli
//// DECLARE BASE_VAR FIXED;

// nested beneath the base folder -> resolves via the globstar
// @filename: copybooks/sub/nested.pli
//// DECLARE NESTED_VAR FIXED;

// @filename: main.pli
//// %INCLUDE "base.pli";
//// %INCLUDE "nested.pli";

preprocessor.expectTokens(`
  DECLARE BASE_VAR FIXED;
  DECLARE NESTED_VAR FIXED;
`);
