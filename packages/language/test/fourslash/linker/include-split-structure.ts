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

// @filename: cpy/lib.pli
////    3 cust CHAR(30),
////    3 addr,
////      5 <|street|> CHAR(20),
////      5 zip CHAR(5);

// @filename: main.pli
//// DCL 1 person ALIGNED,
//// %INCLUDE "lib.pli";
//// PUT LIST (person.addr.<|street>street);

preprocessor.expectTokens(`
  DCL 1 person ALIGNED,
        3 cust CHAR(30), 
        3 addr,
          5 street CHAR(20), 
          5 zip CHAR(5); 
  PUT LIST (person.addr.street);
`);
linker.expectLinks();
