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

// When both `.pliplugin/` and VS Code settings provide a config file, the
// project file is selected and the settings file is ignored (no merge). Here
// both `pgm_conf.json` and `proc_grps.json` exist under `.pliplugin/`, so the
// settings `pli.pgm_conf`/`pli.proc_grps` are dropped entirely: `main.pli`
// binds `*.pli` -> `default` (which has the `cpyla` lib) and the include is
// found — the settings `**/*` -> `DFLT` (no libs) never applies.
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
