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

// A wildcard on a Windows ABSOLUTE lib path with backslash separators
// ("C:\workspace\cpy\**") is normalized and resolved against that absolute
// base. The trailing "**" includes the base folder's own files and everything
// nested beneath it.
// See https://github.com/zowe/zowe-pli-language-support/issues/758

/// <reference path="../../framework.ts" />

// @filename: C:\workspace\.pliplugin\pgm_conf.json
//// {
////   "pgms": [
////     {
////       "program": "C:\\workspace\\*.pli",
////       "pgroup": "default"
////     }
////   ]
//// }

// @filename: C:\workspace\.pliplugin\proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "default",
////             "libs": [
////                 "C:\\workspace\\cpy\\**"
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// directly inside the absolute base -> resolves because "**" includes the base
// @filename: C:\workspace\cpy\base.pli
//// DECLARE BASE_VAR FIXED;

// nested beneath the absolute base -> resolves via the globstar
// @filename: C:\workspace\cpy\sub\nested.pli
//// DECLARE NESTED_VAR FIXED;

// @filename: C:\workspace\main.pli
//// %INCLUDE "base.pli";
//// %INCLUDE "nested.pli";

preprocessor.expectTokens(`
  DECLARE BASE_VAR FIXED;
  DECLARE NESTED_VAR FIXED;
`);
