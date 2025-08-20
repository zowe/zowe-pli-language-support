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

//// %DCL COUNT FIXED;
//// %DCL SUM FIXED;
//// %SUM = 0;
//// %DO COUNT = 1 TO 20 WHILE(COUNT <= 10) UNTIL(SUM > 13);
////   %SUM = SUM + COUNT;
////   DCL WhileUntilVar%;COUNT FIXED;
////   DCL SumVar%;SUM FIXED;
//// %END;

preprocessor.expectTokens(`
  DCL WhileUntilVar1 FIXED;
  DCL SumVar1 FIXED;
  
  DCL WhileUntilVar2 FIXED;
  DCL SumVar3 FIXED;
  
  DCL WhileUntilVar3 FIXED;
  DCL SumVar6 FIXED;
  
  DCL WhileUntilVar4 FIXED;
  DCL SumVar10 FIXED;
  
  DCL WhileUntilVar5 FIXED;
  DCL SumVar15 FIXED;
`);
