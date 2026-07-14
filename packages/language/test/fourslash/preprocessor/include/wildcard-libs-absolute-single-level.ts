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

// An absolute pattern with a single-level wildcard ("/absroot/copy/*/books")
// matches "books" folders with EXACTLY one folder between them and "copy". The
// depth boundary excludes both shallower (zero) and deeper (two+) matches.
// See https://github.com/zowe/zowe-pli-language-support/issues/758

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "default",
////             "libs": [
////                 "/absroot/copy/*/books"
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// exactly one folder between "copy" and "books" -> resolves
// @filename: /absroot/copy/mid/books/hit.pli
//// DECLARE HIT_VAR FIXED;

// zero folders between "copy" and "books" -> NOT resolvable ("*" needs one)
// @filename: /absroot/copy/books/too-shallow.pli
//// DECLARE SHALLOW_VAR FIXED;

// two folders between "copy" and "books" -> NOT resolvable (beyond boundary)
// @filename: /absroot/copy/a/b/books/too-deep.pli
//// DECLARE DEEP_VAR FIXED;

// @filename: main.pli
//// %INCLUDE "hit.pli";
//// %INCLUDE "too-shallow.pli";
//// %INCLUDE "too-deep.pli";

// Only the exactly-one-level copybook resolves.
preprocessor.expectTokens(`
  DECLARE HIT_VAR FIXED;
`);
