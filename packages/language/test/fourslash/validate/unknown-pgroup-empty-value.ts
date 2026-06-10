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
 * An empty pgroup value ("") should be flagged as unknown — there is
 * no special-case suppression for it.
 */

// @filename: .pliplugin/pgm_conf.json
//// {
////   "pgms": [
////     { "program": "*.pli", "pgroup": <|1:""|> }
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
  "1",
  code.LSP.PluginConfiguration.UnknownProcessGroup,
);
