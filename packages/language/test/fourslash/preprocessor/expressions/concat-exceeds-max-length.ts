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
 * Concatenating a variable with itself doubles its length on every iteration, so the
 * value must be capped - otherwise the interpreter allocates until the process dies.
 */
// @compiler: true
//// %DCL I FIXED;
//// %DCL S CHAR;
//// %DCL L FIXED;
//// %S = 'A';
//// %DO I = 1 TO 20;
////   %<|S|> ||= S;
//// %END;
//// %L = LENGTH(S);
//// %ACT L;
//// L

// The 17th iteration would produce 131072 characters, which exceeds the cap,
// so the concatenation is rejected and the value becomes empty.
preprocessor.expectTokens("0");
verify.expectDiagnosticsAt("S", code.LspCodes.ValueTooLarge);
