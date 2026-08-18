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

/// <reference path="../framework.ts" />

/**
 * An unresolved lib in a VS Code settings `pli.proc_grps` is flagged inside the
 * settings file itself. `.pliplugin/proc_grps.json` is absent, so proc_grps
 * falls back to the settings source; `.pliplugin/pgm_conf.json` is present only
 * to anchor the workspace root, and `@noDefaultConfig` (on the last file block)
 * keeps the harness from materializing a default `.pliplugin/proc_grps.json`
 * that would block the fallback.
 */

// @filename: .vscode/settings.json
//// {
////   "pli.proc_grps": { "pgroups": [{ "name": "from-settings", "libs": [<|missing:"nope"|>] }] }
//// }

// @filename: .pliplugin/pgm_conf.json
//// { "pgms": [] }

// @filename: main.pli
// @wrap: main
// @noDefaultConfig
//// DCL A CHAR(8);

verify.expectDiagnosticsAt(
  "missing",
  code.LSP.PluginConfiguration.UnresolvedEntry,
);
