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

// Because a present `.pliplugin/pgm_conf.json` is selected as the sole pgm_conf
// source, the settings `pli.pgm_conf` is ignored even when it is an EXACT path
// match for the file. Here the settings bind `main.pli` (exact) to `DFLT` (no
// libs), while the project binds `*.pli` (glob) to `default` (has the `cpyla`
// lib).
//
// This is the harder sibling of `program-config-precedence-over-settings.ts`:
// under a per-key merge, a plain `Map.get(uri)` direct lookup could return the
// settings exact-path entry and the include would fail with IBM1848I. With
// per-file source selection the settings entry is never loaded at all, so the
// project glob binds `main.pli` and the include resolves.

/// <reference path="../../framework.ts" />

// @filename: .vscode/settings.json
//// {
////   "pli.pgm_conf": { "pgms": [{ "pgroup": "DFLT", "program": "main.pli" }] },
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
// not the settings `DFLT` group that exact-matches `main.pli` with no libs.
preprocessor.expectTokens(`
  DECLARE LIB_VAR FIXED;
`);

// The project `default` group is the active source: its missing `cpy` lib is
// flagged on proc_grps.json, while `cpyla` resolves.
verify.expectDiagnosticsAt("missing", {
  message: code.LSP.PluginConfiguration.UnresolvedEntry.message("cpy"),
});
