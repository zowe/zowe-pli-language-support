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

// Preprocessor options accumulate across multiple *PROCESS directives: specifying
// PP(SQL CICS) followed by a later PP(MACRO) directive must not discard the SQL and
// CICS entries accumulated so far. All three preprocessor phases must still run.

// @filename: cpy/sqlca.pli
//// DECLARE SQL_VAR FIXED;

// @filename: main.pli
////*PROCESS PP(SQL CICS);
////*PROCESS PP(MACRO);
//// TEST: PROC;
////   EXEC SQL INCLUDE SQLCA;
////   EXEC CICS ABEND ABCODE('$CAN');
//// END;

preprocessor.containsTokens([
  "TEST",
  ":",
  "PROC",
  ";",
  "DECLARE",
  "SQL_VAR",
  "FIXED",
  ";",
  "DCL",
  "DFHEIBLK",
  "DO",
  ";",
  "END",
  ";",
  "END",
  ";",
]);
verify.noDiagnostics();
