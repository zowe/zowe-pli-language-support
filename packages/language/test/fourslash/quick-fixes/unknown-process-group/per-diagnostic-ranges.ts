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
 * Two programs referencing the same unknown process group each get their
 * own diagnostic (no value-based de-duplication), and each diagnostic
 * yields its own set of "Change to ..." quick fixes anchored to its own
 * range. Applying a fix rewrites only the offending entry, leaving the
 * other untouched — proving the per-diagnostic range is used and not
 * shared across the generated actions.
 */

// @filename: .pliplugin/pgm_conf.json
//// {
////   "pgms": [
////     { "program": "a.pli", "pgroup": <|first:"ghost"|> },
////     { "program": "b.pli", "pgroup": <|second:"ghost"|> }
////   ]
//// }

// @filename: .pliplugin/proc_grps.json
//// {
////   "pgroups": [
////     { "name": "default", "compiler-options": [], "libs": [] },
////     { "name": "lelola", "compiler-options": [], "libs": [] }
////   ]
//// }

// @filename: main.pli
// @wrap: main
//// DCL A CHAR(8);

await verify.expectCodeActionCountAt("first", 2);
await verify.expectCodeActionCountAt("second", 2);

await verify.expectCodeActionAt(
  "first",
  `Change to "default"`,
  `{
  "pgms": [
    { "program": "a.pli", "pgroup": "default" },
    { "program": "b.pli", "pgroup": "ghost" }
  ]
}`,
);
await verify.expectCodeActionAt(
  "second",
  `Change to "default"`,
  `{
  "pgms": [
    { "program": "a.pli", "pgroup": "ghost" },
    { "program": "b.pli", "pgroup": "default" }
  ]
}`,
);
