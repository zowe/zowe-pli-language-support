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
 * A macro procedure can *generate* a whole `EXEC SQL` statement (here via ANSWER); the
 * SQL phase runs after the macro phase over its output text, so it picks the generated
 * statement up and resolves the include - the capability the string-based pipeline was
 * built for (the old token-piping macro phase could not emit EXEC statements).
 */

// @filename: cpy/sqlca.pli
//// DECLARE SQLCODE FIXED;

// @filename: main.pli
////*PROCESS PP(MACRO SQL);
//// %MYMACRO: PROC;
////   ANSWER ('EXEC SQL INCLUDE SQLCA;');
//// %END;
//// %ACTIVATE MYMACRO;
//// MYMACRO

preprocessor.expectTokens(`
  DECLARE SQLCODE FIXED;
`);
