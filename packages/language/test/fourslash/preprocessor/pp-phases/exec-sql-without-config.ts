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

// Regression test: EXEC SQL should work without config files or *PROCESS directive.
// The default PP(MACRO SQL CICS) should be applied automatically.

// @noDefaultConfig
//// SQLTEST: PROCEDURE OPTIONS (MAIN);
////   EXEC SQL BEGIN DECLARE SECTION;
////     DCL EMPNO CHAR(6);
////   EXEC SQL END DECLARE SECTION;
//// END SQLTEST;

// If EXEC SQL is NOT processed, the parser fails with "Expected ... but found EXEC"
// If it IS processed, the EXEC SQL statements are replaced with DO; END;
preprocessor.containsTokens([
  "SQLTEST",
  ":",
  "PROCEDURE",
  "OPTIONS",
  "(",
  "MAIN",
  ")",
  ";",
  "DCL",
  "EMPNO",
  "CHAR",
  "DO",
  ";",
  "END",
  ";",
  "END",
  "SQLTEST",
  ";",
]);
verify.noDiagnostics();
