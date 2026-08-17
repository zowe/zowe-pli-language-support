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

// Sibling of `program-config-empty-file-blocks-fallback.ts`, covering the other
// "present but unusable" branch: a project `proc_grps.json` that fails to
// parse. A malformed file is still *present*, so it is selected for its tier
// and blocks the settings `proc_grps` fallback — a parse error must NOT be
// mistaken for a missing file.
//
// `pgm_conf` falls back to settings and binds `*.pli` -> `default`, but the
// `default` process group is undefined because the unparseable project
// `proc_grps.json` shadows the settings one, so the include cannot resolve.

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/proc_grps.json
//// { not valid json

// @filename: .vscode/settings.json
//// {
////   "pli.pgm_conf": { "pgms": [{ "pgroup": "default", "program": "*.pli" }] },
////   "pli.proc_grps": { "pgroups": [{ "name": "default", "libs": ["cpyla"], "include-extensions": [".pli"] }] }
//// }

// @filename: cpyla/b.pli
//// DECLARE LIB_VAR FIXED;

// @filename: main.pli
// @noDefaultConfig
//// %INCLUDE "b.pli";

// The unparseable project `proc_grps.json` blocks the settings fallback, so the
// include never resolves and `LIB_VAR` is not pulled in.
preprocessor.not.containsTokens("LIB_VAR");
