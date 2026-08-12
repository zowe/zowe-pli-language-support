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

// The overlap warning (COPC05W) fires for an EXACT program entry too, not just
// globs: an exact "source/plifs01s.pli" entry pointing at a ".pli" file inside
// a lib whose include-extensions list ".pli" is just as ambiguous.

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/pgm_conf.json
//// {
////   "pgms": [
////     {
////       "program": <|overlap:"source/plifs01s.pli"|>,
////       "pgroup": "default"
////     }
////   ]
//// }

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": [
////         {
////             "name": "default",
////             "libs": [
////                 "source"
////             ],
////             "include-extensions": [
////                 ".pli"
////             ]
////         }
////     ]
//// }

// @filename: source/plifs01s.pli
//// DECLARE X FIXED;

verify.expectExclusiveDiagnosticsAt("overlap", {
  message: code.LSP.PluginConfiguration.AmbiguousProgramLibOverlap.message(
    "source",
    ".pli",
    "default",
  ),
});
