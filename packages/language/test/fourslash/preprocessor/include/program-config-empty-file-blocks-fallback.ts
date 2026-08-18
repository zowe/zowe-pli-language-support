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

// Fallback only happens when a `.pliplugin/` config file is *entirely missing* —
// not when it exists but is empty. Here `.pliplugin/proc_grps.json` is present
// but declares no groups, so it wins its tier and blocks the workspace-settings
// `proc_grps` (which *would* have resolved the include via `cpyla`).
//
// `pgm_conf` is absent from `.pliplugin/`, so it still falls back to settings
// and binds `*.pli` to `default`; but the `default` process group is undefined
// because the empty project `proc_grps.json` shadows the settings one. The
// include therefore cannot resolve.
//
// Contrast with `program-config-precedence-workspace-over-user.ts`, where the
// project `proc_grps.json` is missing and the same settings group *does*
// resolve the include.

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/proc_grps.json
//// {
////     "pgroups": []
//// }

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

// The empty project `proc_grps.json` blocks the settings fallback, so the
// include never resolves and `LIB_VAR` is not pulled in.
preprocessor.not.containsTokens("LIB_VAR");
