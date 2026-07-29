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

////*PROCESS LIST
////MAIN: PROC
//// DCL X FIXED<|1> BIN

// The processor sets range.end = text.length when there is no closing
// semicolon on the *PROCESS directive. Once the cursor is inside ordinary
// PL/I code, no compiler-option completions should leak in.
completion.expectAt(1, {
  excludes: ["LIST", "AGGREGATE", "MARGINS", "RULES", ";"],
});
