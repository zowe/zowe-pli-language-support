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

//// DEFINE STRUCT 1 X, 2 Y FIXED BIN(31);
//// DCL A TYPE X;
//// DCL P POINTER;
//// A = BIND(:<|1>X, <|2>P:);

// Expect only types after the '(:' token
completion.expectAt(1, {
  includes: ["X"],
  excludes: ["A", "P", "Y"],
});
// Expect a variable after the ',' token, not a type
completion.expectAt(2, {
  includes: ["P"],
  excludes: ["X"],
});
