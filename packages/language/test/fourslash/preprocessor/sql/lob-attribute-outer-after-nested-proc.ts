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

// The declaration sits in OUTER, after a nested procedure already closed - the SQL_LOB10
// block must be inserted into OUTER (whose scope holds the `LIKE`), not into INNER,
// which merely happens to be the nearest preceding PROC keyword.

//// OUTER: PROC;
////   INNER: PROC;
////   END INNER;
////   DCL TEST_SQL SQL TYPE IS BLOB(10);
//// END OUTER;

preprocessor.expectTokens(`
OUTER: PROC;
  DCL
    1 SQL_LOB10 BASED,
      2 SQL_LOB_LEN FIXED BIN(31),
      2 SQL_LOB_BUF(10) CHAR(1);

  INNER: PROC;
  END INNER;
  DCL TEST_SQL LIKE SQL_LOB10;
END OUTER;
`);
