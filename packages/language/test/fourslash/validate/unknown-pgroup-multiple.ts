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
 * Each program that references an unknown process group gets its own
 * diagnostic — there is no value-based de-duplication, so two programs
 * pointing at the same missing group still produce two squiggles.
 */

// @filename: .pliplugin/pgm_conf.json
//// {
////   "pgms": [
////     { "program": "a.pli", "pgroup": "default" },
////     { "program": "b.pli", "pgroup": <|ghost1:"ghost"|> },
////     { "program": "c.pli", "pgroup": <|ghost2:"ghost"|> },
////     { "program": "d.pli", "pgroup": <|other:"other-ghost"|> }
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

verify.expectExclusiveDiagnosticsAt("ghost1", {
  message: `Unknown process group 'ghost'.`,
});
verify.expectExclusiveDiagnosticsAt("ghost2", {
  message: `Unknown process group 'ghost'.`,
});
verify.expectExclusiveDiagnosticsAt("other", {
  message: `Unknown process group 'other-ghost'.`,
});

verify.noDiagnosticsExcept([code.LSP.PluginConfiguration.UnknownProcessGroup]);
