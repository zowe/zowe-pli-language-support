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

// A wildcard lib pattern that matches no directory on disk is reported as an
// unresolved library entry (COPC01E) on proc_grps.json, just like a literal
// lib that doesn't exist.
// See https://github.com/zowe/zowe-pli-language-support/issues/628

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "default",
////             "libs": [
////                 <|bad:"**/missing"|>
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// A directory exists in the workspace, but none of its segments match the
// "**/missing" pattern, so the wildcard expands to nothing.
// @filename: src/code.pli
//// DECLARE X FIXED;

// @filename: main.pli
//// DECLARE Y FIXED;

verify.expectDiagnosticsAt("bad", {
  message: code.LSP.PluginConfiguration.UnresolvedEntry.message("**/missing"),
});
