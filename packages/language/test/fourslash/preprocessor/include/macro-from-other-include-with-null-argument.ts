/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright (c) 2026 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 */

/// <reference path="../../framework.ts" />

// One include defines a STATEMENT macro, a later include invokes it with `()`.
// The null argument must leave VARS unset (PARMSET = '0'B), so the generated call
// gets the default argument. Otherwise it ends in `,);` and fails to parse.

// @filename: cpy/fwkh.pli
//// %TRACEI: PROC (VARS) STATEMENT;
////   DCL VARS CHAR NOSCAN;
////   DCL TXT CHAR NOSCAN;
////   IF PARMSET(VARS)
////   THEN TXT = VARS;
////   ELSE TXT = "''";
////   ANS("CALL FWK_TRACE('>'," || TXT || ");") SKIP;
//// %END;
//// %ACTIVATE TRACEI;
//// DCL FWK_TRACE ENTRY(CHAR(*), CHAR(*));

// @filename: cpy/user.pli
//// LRU_PROCESSING: PROCEDURE;
////   TRACEI();
//// END LRU_PROCESSING;

// @filename: main.pli
////*PROCESS PP(MACRO SQL);
//// MAIN: PROCEDURE OPTIONS(MAIN);
////   %INCLUDE FWKH;
////   EXEC SQL INCLUDE SQLCA;
////   %INCLUDE USER;
////   CALL LRU_PROCESSING;
//// END MAIN;

verify.noDiagnostics();
