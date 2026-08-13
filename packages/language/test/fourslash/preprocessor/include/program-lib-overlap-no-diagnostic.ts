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

// When the program entry matches ".pli" files but the lib's include-extensions
// only list ".inc", there is no overlapping include type, so no ambiguity
// warning (COPC05W) is emitted. The ".pli" files are only ever programs, never
// includes.

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
////                 ".inc"
////             ]
////         }
////     ]
//// }

// @filename: source/x.pli
//// DECLARE X FIXED;

// @filename: source/main.pli
//// DECLARE Y FIXED;

verify.noDiagnostics(
  "overlap",
  code.LSP.PluginConfiguration.AmbiguousProgramLibOverlap,
);
