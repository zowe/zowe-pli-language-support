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

// @filename: some/lib.pli
//// DECLARE LIB_VAR FIXED;

// @filename: main.pli
//// %INCLUDE <|path:"../some/lib.pli"|>;

// No tokens, the include is outside of the library (cpy/inc)
preprocessor.expectTokens("");
// Expect an unresolved include diagnostic
verify.expectDiagnosticsAt("path", code.Severe.IBM1848I);
