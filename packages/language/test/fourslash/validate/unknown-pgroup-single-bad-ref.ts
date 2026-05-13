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
 * A program that references a non-existent process group must produce
 * an UnknownProcessGroup diagnostic (COPC04E).
 *
 * The diagnostic targets pgm_conf.json (not the PL/I source), so we
 * use noDiagnosticsExcept to prove COPC04E is the only diagnostic
 * present in the compilation unit.
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

// The diagnostic targets the offending pgroup value in pgm_conf.json,
// carrying the COPC04E code and the offender in its message.
verify.expectExclusiveDiagnosticsAt("bad", {
  code: code.LSP.PluginConfiguration.UnknownProcessGroup.code,
  message: `Unknown process group 'doesnotexist'.`,
  severity: constants.Severity.E,
});

// COPC04E is the only diagnostic in the whole compilation unit.
verify.noDiagnosticsExcept([code.LSP.PluginConfiguration.UnknownProcessGroup]);
