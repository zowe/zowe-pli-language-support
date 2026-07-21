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

// A project `.pliplugin/pgm_conf.json` entry must win over a broader user-scope
// `pli.pgm_conf` glob when binding a file to its process group. Here the user
// settings bind every file (`**/*`) to `DFLT` (which has no libs), while the
// project binds `*.pli` to `default` (which has the `cpyla` lib). `main.pli`
// must resolve against `default`, so the include is found — otherwise it would
// pick the empty settings group and fail with IBM1848I.
//
// Regression test for the include that "could not be found" even though the
// resolvable lib was listed in the project proc_grps.json.

/// <reference path="../../framework.ts" />

// @filename: .vscode/settings.json
//// {
////   "pli.pgm_conf": { "pgms": [{ "pgroup": "DFLT", "program": "**/*" }] },
////   "pli.proc_grps": { "pgroups": [{ "name": "DFLT", "libs": [], "include-extensions": [".pli"] }] }
//// }

// @filename: .pliplugin/pgm_conf.json
//// { "pgms": [{ "program": "*.pli", "pgroup": "default" }] }

// @filename: .pliplugin/proc_grps.json
//// {
////   "pgroups": [
////     {
////       "name": "default",
////       "libs": [<|missing:"cpy"|>, "cpyla"],
////       "include-extensions": [".pli"]
////     }
////   ]
//// }

// @filename: cpyla/b.pli
//// DECLARE LIB_VAR FIXED;

// @filename: main.pli
//// %INCLUDE "b.pli";

// The include resolves via the project `default` group (which lists `cpyla`),
// not the settings `DFLT` group (which has no libs).
preprocessor.expectTokens(`
  DECLARE LIB_VAR FIXED;
`);

// The project `default` group is the active source: its missing `cpy` lib is
// flagged on proc_grps.json, while `cpyla` resolves.
verify.expectDiagnosticsAt("missing", {
  message: code.LSP.PluginConfiguration.UnresolvedEntry.message("cpy"),
});
