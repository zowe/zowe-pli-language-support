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
// @compiler: true
//// %DCL NUM FIXED;
//// %DCL PRODUCT FIXED;
//// %PRODUCT = 1;
//// %DO NUM = 1 TO 15 UNTIL(PRODUCT > 50) WHILE(NUM <= 8);
////   %PRODUCT = PRODUCT * NUM;
////   NUM
////   PRODUCT
//// %END;

preprocessor.expectTokens(`
  1
  1
  
  2
  2
  
  3
  6
  
  4
  24
  
  5
  120
`);
