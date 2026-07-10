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

// A macro variable holding the body of an EXEC SQL statement must be expanded by the
// MACRO phase *before* the SQL phase processes it. The mainframe runs MACRO then SQL, so
// `EXEC SQL SOME_SQL_CODE;` becomes `EXEC SQL INCLUDE SQLCA;`, which the SQL phase then
// resolves to the included copybook content.

// @filename: cpy/sqlca.pli
//// DECLARE LIB_VAR FIXED;

// @filename: main.pli
////*PROCESS PP(MACRO SQL);
//// %DCL SOME_SQL_CODE CHAR;
//// %SOME_SQL_CODE = 'INCLUDE SQLCA';
//// EXEC SQL SOME_SQL_CODE;

preprocessor.expectTokens(`
  DECLARE LIB_VAR FIXED;
`);
