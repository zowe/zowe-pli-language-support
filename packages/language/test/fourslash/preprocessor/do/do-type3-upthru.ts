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
 * DO Type 3 - DO with UPTHRU
 */

//// %DCL I FIXED;
//// %DO I = 1 UPTHRU 3;
////   DCL Var%;I FIXED;
//// %END;

preprocessor.expectTokens(`
  DCL Var1 FIXED;
  DCL Var2 FIXED;
  DCL Var3 FIXED;
`);
