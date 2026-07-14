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

// When a process group mixes a resolvable wildcard lib with an unresolvable
// one, only the unresolvable entry is flagged (COPC01E) while includes served
// by the resolvable wildcard still resolve normally.
// See https://github.com/zowe/zowe-pli-language-support/issues/628

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "default",
////             "libs": [
////                 "**/inc",
////                 <|bad:"**/missing"|>
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// Resolvable via "**/inc"
// @filename: a/b/inc/lib.pli
//// DECLARE LIB_VAR FIXED;

// @filename: main.pli
//// %INCLUDE "lib.pli";

// The good wildcard still resolves the include...
preprocessor.expectTokens(`
  DECLARE LIB_VAR FIXED;
`);

// ...and only the unresolvable wildcard is flagged.
verify.expectDiagnosticsAt("bad", {
  message: code.LSP.PluginConfiguration.UnresolvedEntry.message("**/missing"),
});
