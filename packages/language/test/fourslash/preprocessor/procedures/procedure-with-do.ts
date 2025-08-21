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

//// %TEST: PROC (VAR) RETURNS (FIXED);
////   DCL I FIXED;
////   DO WHILE (I < 10);
////    I = I + 1;
////   END;
////   RETURN (I);
//// %END;
//// %DCL X FIXED;
//// %X = TEST(5);
//// X

preprocessor.expectTokens("10");
