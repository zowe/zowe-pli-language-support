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
 * A single program referencing an unknown process group is flagged with
 * COPC04E, anchored to the offending value in pgm_conf.json, carrying the
 * "Unknown process group '<name>'." message.
 */

// @filename: .pliplugin/pgm_conf.json
//// {
////   "pgms": [
////     { "program": "*.pli", "pgroup": <|bad:"doesnotexist"|> }
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

verify.expectDiagnosticsAt("bad", {
  message: code.LSP.PluginConfiguration.UnknownProcessGroup.message(
    "doesnotexist",
  ),
});
