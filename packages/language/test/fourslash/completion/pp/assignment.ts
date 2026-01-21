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

//// DCL X FIXED BIN(31) INIT(1);
//// %DCL A FIXED INIT(10);
//// %A = <|1>20;
//// X = <|2>42;

// Completion at 1 should suggest pp variables only
completion.expectAt(1, {
  includes: ["A"],
  excludes: ["X"],
});
// Completion at 2 should suggest non-pp variables only
completion.expectAt(2, {
  includes: ["X"],
  excludes: ["A"],
});
