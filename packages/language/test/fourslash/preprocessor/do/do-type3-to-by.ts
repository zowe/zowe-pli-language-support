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
 * DO Type 3 - DO with BY clause
 *
 * This test verifies that the preprocessor correctly implements the DO Type 3
 * specification by ensuring that the TO and BY expressions are evaluated only
 * once at loop entry, not re-evaluated on each iteration.
 */
// @compiler: true
//// %DCL I FIXED;
//// %DCL X FIXED;
//// %X = 4;
//// %Y = 2;
//// %DO I = 2 TO X BY Y;
////   %X = X + 1;
////   %Y = Y + 1;
////   I
//// %END;

preprocessor.expectTokens(`
  2
  4
`);
