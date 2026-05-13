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

/// <reference path="../../framework.ts" />

/**
 * An empty pgroup value ("") is still an unknown process group, and the
 * offending value spans two characters (the quotes). That is wide enough
 * for the handler's "real range" guard, so the "Change to ..." quick fix
 * is offered and rewrites the empty value in pgm_conf.json.
 */

// @filename: .pliplugin/pgm_conf.json
//// {
////   "pgms": [
////     { "program": "*.pli", "pgroup": <|bad:""|> }
////   ]
//// }

// @filename: .pliplugin/proc_grps.json
//// {
////   "pgroups": [
////     {
////       "name": "default",
////       "compiler-options": [],
////       "libs": []
////     }
////   ]
//// }

// @filename: main.pli
// @wrap: main
//// DCL A CHAR(8);

verify.expectDiagnosticsAt(
  "bad",
  code.LSP.PluginConfiguration.UnknownProcessGroup,
);
await verify.expectCodeActionCountAt("bad", 1);
await verify.expectCodeActionAt(
  "bad",
  `Change to "default"`,
  `{
  "pgms": [
    { "program": "*.pli", "pgroup": "default" }
  ]
}`,
);
