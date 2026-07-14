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

// A literal lib (no wildcard) searches only that folder, NOT its subfolders.
// Recursion is opt-in via "**". An include in a nested subfolder of a literal
// lib does not resolve. See https://github.com/zowe/zowe-pli-language-support/issues/758

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "default",
////             "libs": [
////                 "cpy"
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// directly inside the literal lib -> resolvable
// @filename: cpy/direct.pli
//// DECLARE DIRECT_VAR FIXED;

// in a subfolder of the literal lib -> NOT resolvable (no recursion)
// @filename: cpy/sub/nested.pli
//// DECLARE NESTED_VAR FIXED;

// @filename: main.pli
//// %INCLUDE "direct.pli";
//// %INCLUDE "nested.pli";

// Only the direct copybook resolves; the nested include contributes no tokens.
preprocessor.expectTokens(`
  DECLARE DIRECT_VAR FIXED;
`);
