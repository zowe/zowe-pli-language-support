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

// Fallback reaches user-scope settings when neither `.pliplugin/` nor
// workspace-scope settings provide configuration. Only `user-settings.json`
// defines `pgm_conf`/`proc_grps` here, and `main.pli` resolves its include via
// the user `default` group.
//
// This is the lowest tier of the precedence chain
// (`.pliplugin/` > workspace settings > user settings) and proves the fallback
// keeps descending until it finds a source that exists.

/// <reference path="../../framework.ts" />

// @filename: user-settings.json
//// {
////   "pli.pgm_conf": { "pgms": [{ "pgroup": "default", "program": "*.pli" }] },
////   "pli.proc_grps": { "pgroups": [{ "name": "default", "libs": ["cpyla"], "include-extensions": [".pli"] }] }
//// }

// @filename: cpyla/b.pli
//// DECLARE LIB_VAR FIXED;

// @filename: main.pli
// @noDefaultConfig
//// %INCLUDE "b.pli";

// The include resolves via the user `default` group.
preprocessor.expectTokens(`
  DECLARE LIB_VAR FIXED;
`);
