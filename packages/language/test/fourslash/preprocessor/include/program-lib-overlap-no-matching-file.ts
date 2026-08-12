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

// The detection is file-based: even though ".pli" is both a program-entry
// extension and an include extension, the lib directory contains no ".pli"
// file (only a ".inc" one), so there is no real ambiguity yet and no warning
// (COPC05W) is emitted.

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
////                 ".pli"
////             ]
////         }
////     ]
//// }

// Only a ".inc" file lives in the lib — no ".pli" file to be ambiguous.
// @filename: source/only.inc
//// DECLARE Z FIXED;

verify.noDiagnostics(
  "overlap",
  code.LSP.PluginConfiguration.AmbiguousProgramLibOverlap,
);
