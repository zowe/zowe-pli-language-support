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

// `.pliplugin/`-only mode: the global-config loader contributes NOTHING because
// no `.vscode/settings.json` / `user-settings.json` fixtures are present, so
// the harness builds an empty `TestGlobalConfigLoader`. The provider must fall
// back entirely to the project's `.pliplugin/` files: `pgm_conf.json` binds
// `main.pli` to `default`, and `proc_grps.json` gives `default` the resolvable
// `mylib` lib. The include only resolves if both `.pliplugin/` files drive the
// configuration on their own, with no settings backing them.

/// <reference path="../../framework.ts" />

// @filename: .pliplugin/pgm_conf.json
//// { "pgms": [{ "program": "*.pli", "pgroup": "default" }] }

// @filename: .pliplugin/proc_grps.json
//// { "pgroups": [{ "name": "default", "libs": ["mylib"], "include-extensions": [".pli"] }] }

// @filename: mylib/b.pli
//// DECLARE LIB_VAR FIXED;

// @filename: main.pli
// @noDefaultConfig
//// %INCLUDE "b.pli";

// Resolves purely via the project `.pliplugin/` config (empty global loader).
preprocessor.expectTokens(`
  DECLARE LIB_VAR FIXED;
`);
