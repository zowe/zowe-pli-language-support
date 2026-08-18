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

// When `.pliplugin/` is missing entirely, configuration falls back to VS Code
// settings, and workspace-scope settings (`.vscode/settings.json`) win over
// user-scope settings (`user-settings.json`) — mirroring VS Code's native
// scope precedence.
//
// Both scopes bind `*.pli` to `default`, but the workspace `default` lists the
// resolvable `cpyla` lib while the user `default` has no libs. `main.pli` must
// resolve its include via the workspace group — otherwise it would pick the
// empty user group and fail.
//
// `@noDefaultConfig` (on the last file block) stops the harness from
// materializing default `.pliplugin/` files, which would otherwise be
// "present" and block the fallback. The workspace root defaults to the test
// root, so no `.pliplugin/` anchor file is needed.

/// <reference path="../../framework.ts" />

// @filename: .vscode/settings.json
//// {
////   "pli.pgm_conf": { "pgms": [{ "pgroup": "default", "program": "*.pli" }] },
////   "pli.proc_grps": { "pgroups": [{ "name": "default", "libs": ["cpyla"], "include-extensions": [".pli"] }] }
//// }

// @filename: user-settings.json
//// {
////   "pli.pgm_conf": { "pgms": [{ "pgroup": "default", "program": "*.pli" }] },
////   "pli.proc_grps": { "pgroups": [{ "name": "default", "libs": [], "include-extensions": [".pli"] }] }
//// }

// @filename: cpyla/b.pli
//// DECLARE LIB_VAR FIXED;

// @filename: main.pli
// @noDefaultConfig
//// %INCLUDE "b.pli";

// The include resolves via the workspace `default` group (which lists `cpyla`),
// not the user `default` group (which has no libs).
preprocessor.expectTokens(`
  DECLARE LIB_VAR FIXED;
`);
