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

// With PP(MACRO SQL CICS) all three phases run in order. The SQL phase resolves
// `EXEC SQL INCLUDE SQLCA;` to the included copybook content, and the CICS phase replaces
// `EXEC CICS ABEND ABCODE('$CAN');` with `DO; END;` plus the generated DFHEIBLK declarations.

// @filename: cpy/sqlca.pli
//// DECLARE SQL_VAR FIXED;

// @filename: main.pli
////*PROCESS PP(MACRO SQL CICS);
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
