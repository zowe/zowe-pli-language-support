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

//// TEST: PROC;
////   DCL TEST_SOME FIXED BIN(31);
////   DCL TEST_SQL SQL TYPE IS BLOB(10);
//// END;

// Expects that the additional SQL_LOB10 declaration for the LOB attribute has been added
// BEFORE the TEST_SOME declaration
preprocessor.expectTokens(`
TEST: PROC;
  DCL
    1 SQL_LOB10 BASED,
      2 SQL_LOB_LEN FIXED BIN(31),
      2 SQL_LOB_BUF(10) CHAR(1);

  DCL TEST_SOME FIXED BIN(31);
  DCL TEST_SQL LIKE SQL_LOB10;
END;
`);
