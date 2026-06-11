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
 * Suppression rule: when proc_grps.json declares zero process groups,
 * the set of known names is empty, so every reference is technically
 * unresolved. We deliberately suppress UnknownProcessGroup here rather
 * than flagging every program — the empty proc_grps file is the real,
 * more fundamental problem to fix first.
 */

// @filename: .pliplugin/pgm_conf.json
//// {
////   "pgms": [
////     { "program": "*.pli", "pgroup": "anything" }
////   ]
//// }

// @filename: .pliplugin/proc_grps.json
//// {
////   "pgroups": []
//// }

// @filename: main.pli
// @wrap: main
//// DCL A CHAR(8);

verify.noDiagnostics(
  undefined,
  code.LSP.PluginConfiguration.UnknownProcessGroup,
);
