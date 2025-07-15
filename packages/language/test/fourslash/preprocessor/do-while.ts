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

//// %DCL X FIXED;
//// %X = 1;
//// %DO
////   %WHILE(X <= 3);
////   DCL Variable%;X FIXED;
////   %X = X + 1;
//// %END;

preprocessor.expectTokens(`
  DCL Variable1 FIXED;
  DCL Variable2 FIXED;
  DCL Variable3 FIXED;  
`);
