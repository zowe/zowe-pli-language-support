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

//// %DCL <|X|>(999999999) CHAR;
//// %X1 = X(1);
//// %ACT X1;
//// X1

// Array too large, interpreter should still be able to handle it
preprocessor.expectTokens("");
verify.expectDiagnosticsAt("X", code.LspCodes.DimensionsTooLarge);
