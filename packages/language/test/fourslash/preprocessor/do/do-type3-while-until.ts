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
 * DO Type 3 - DO with WHILE condition followed by UNTIL condition
 */
// @compiler: true
//// %DCL COUNT FIXED;
//// %DCL SUM FIXED;
//// %SUM = 0;
//// %DO COUNT = 1 TO 20 WHILE(COUNT <= 10) UNTIL(SUM > 13);
////   %SUM = SUM + COUNT;
////   COUNT
////   SUM
//// %END;

preprocessor.expectTokens(`
  1
  1
  
  2
  3
  
  3
  6
  
  4
  10
  
  5
  15
`);
