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

// An absolute pattern with a globstar in the MIDDLE ("/absroot/copy/**/books")
// matches every "books" folder at any depth under "copy" (including directly
// under it), but NOT "copy" itself: a file living directly in "copy" does not
// resolve. See https://github.com/zowe/zowe-pli-language-support/issues/758

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "default",
////             "libs": [
////                 "/absroot/copy/**/books"
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// "books" directly under "copy" (zero intermediate dirs) -> resolves
// @filename: /absroot/copy/books/one.pli
//// DECLARE ONE_VAR FIXED;

// "books" nested deeper under "copy" -> resolves
// @filename: /absroot/copy/mid/books/two.pli
//// DECLARE TWO_VAR FIXED;

// directly inside "copy" itself -> NOT resolvable ("copy" is not a matched lib)
// @filename: /absroot/copy/top.pli
//// DECLARE TOP_VAR FIXED;

// @filename: main.pli
//// %INCLUDE "one.pli";
//// %INCLUDE "two.pli";
//// %INCLUDE "top.pli";

// Only the two "books" copybooks resolve; the file directly in "copy" does not.
preprocessor.expectTokens(`
  DECLARE ONE_VAR FIXED;
  DECLARE TWO_VAR FIXED;
`);
