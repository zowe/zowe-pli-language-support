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
////   DCL TEST_SQL SQL TYPE IS BLOB_FILE;
//// END;

preprocessor.expectTokens(`
TEST: PROC;
  DCL
    1 SQL_LOB_FILE BASED,
      2 SQL_LOB_FILE_NAME_LEN FIXED BIN(31),
      2 SQL_LOB_FILE_DATA_LEN FIXED BIN(31),
      2 SQL_LOB_FILE_OPTIONS FIXED BIN(31),
      2 SQL_LOB_FILE_NAME CHAR(256);

  DCL SQL_FILE_READ      FIXED BIN(31) VALUE(2);
  DCL SQL_FILE_CREATE    FIXED BIN(31) VALUE(8);
  DCL SQL_FILE_OVERWRITE FIXED BIN(31) VALUE(16);
  DCL SQL_FILE_APPEND    FIXED BIN(31) VALUE(32);
  DCL TEST_SQL LIKE SQL_LOB_FILE;
END;
`);
