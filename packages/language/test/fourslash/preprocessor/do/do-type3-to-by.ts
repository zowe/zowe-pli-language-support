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
 */

//// %DCL I FIXED;
//// %DCL X FIXED;
//// %X = 4;
//// %Y = 2;
//// %DO I = 2 TO X BY Y;
////   %X = X + 1;
////   %Y = Y + 1;
////   DCL Var%;I FIXED;
//// %END;

preprocessor.expectTokens(`
  DCL Var2 FIXED;
  DCL Var4 FIXED;
`);
