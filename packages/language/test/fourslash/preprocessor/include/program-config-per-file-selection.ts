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

// Source selection happens per config FILE, not all-or-nothing across the whole
// `.pliplugin/` folder. Here the project provides `pgm_conf.json` but no
// `proc_grps.json`:
//
//   - `pgm_conf` -> project is selected: `main.pli` binds `*.pli` -> `grpA`,
//     and the settings `pli.pgm_conf` (`**/*` -> `grpZ`) is ignored.
//   - `proc_grps` -> project file is missing, so it falls back to the settings
//     `pli.proc_grps`, which defines `grpA` with the resolvable `cpyla` lib.
//
// The include only resolves if `main.pli` is bound to `grpA` (project pgm_conf)
// AND `grpA`'s libs come from settings (proc_grps fallback) — i.e. the two
// files were selected from different sources independently. If the settings
// `pgm_conf` had won, `main.pli` would bind `grpZ` (undefined here) and fail.

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/pgm_conf.json
//// { "pgms": [{ "program": "*.pli", "pgroup": "grpA" }] }

// @filename: .vscode/settings.json
//// {
////   "pli.pgm_conf": { "pgms": [{ "pgroup": "grpZ", "program": "**/*" }] },
////   "pli.proc_grps": { "pgroups": [{ "name": "grpA", "libs": ["cpyla"], "include-extensions": [".pli"] }] }
//// }

// @filename: cpyla/b.pli
//// DECLARE LIB_VAR FIXED;

// @filename: main.pli
// @noDefaultConfig
//// %INCLUDE "b.pli";

// pgm_conf from the project (binds grpA), proc_grps from settings (grpA has
// cpyla) -> the include resolves.
preprocessor.expectTokens(`
  DECLARE LIB_VAR FIXED;
`);
