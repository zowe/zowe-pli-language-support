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
 * DO Type 3 - DO with UNTIL condition followed by WHILE condition
 */

//// %DCL NUM FIXED;
//// %DCL PRODUCT FIXED;
//// %PRODUCT = 1;
//// %DO NUM = 1 TO 15 UNTIL(PRODUCT > 50) WHILE(NUM <= 8);
////   %PRODUCT = PRODUCT * NUM;
////   DCL UntilWhileVar%;NUM FIXED;
////   DCL ProductVar%;PRODUCT FIXED;
//// %END;

preprocessor.expectTokens(`
  DCL UntilWhileVar1 FIXED;
  DCL ProductVar1 FIXED;
  
  DCL UntilWhileVar2 FIXED;
  DCL ProductVar2 FIXED;
  
  DCL UntilWhileVar3 FIXED;
  DCL ProductVar6 FIXED;
  
  DCL UntilWhileVar4 FIXED;
  DCL ProductVar24 FIXED;
  
  DCL UntilWhileVar5 FIXED;
  DCL ProductVar120 FIXED;
`);
