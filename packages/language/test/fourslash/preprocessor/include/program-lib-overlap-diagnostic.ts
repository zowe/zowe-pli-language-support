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

// A directory listed as a lib (with ".pli" in its include-extensions) that is
// also covered by a program entry matching ".pli" files is genuinely
// ambiguous: every ".pli" file there is compiled standalone AND offered as an
// include. This surfaces the ambiguity as a warning (COPC05W) attributed to
// the program entry in pgm_conf.json.

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/pgm_conf.json
//// {
////   "pgms": [
////     {
////       "program": <|overlap:"source/*.pli"|>,
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
////                 ".pli",
////                 ".inc"
////             ]
////         }
////     ]
//// }

// Two ".pli" files in the lib dir both match the program pattern; the warning
// must still be emitted exactly once (deduped per program-entry / lib-dir
// pair). `expectExclusiveDiagnosticsAt` asserts the label has *only* this one
// diagnostic, which is what pins the dedup guarantee.
// @filename: source/x.pli
//// DECLARE X FIXED;

// @filename: source/main.pli
//// DECLARE Y FIXED;

verify.expectExclusiveDiagnosticsAt("overlap", {
  message: code.LSP.PluginConfiguration.AmbiguousProgramLibOverlap.message(
    "source",
    ".pli",
    "default",
  ),
});
