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
//// HELLO: PROCEDURE OPTIONS (MAIN);
////   DCL PROGNAME CHAR(100);
////   EXEC CICS LINK PROGRAM(PROGNAME);
//// END HELLO;

// If EXEC CICS is NOT processed, the EXEC token remains and we get a parser error.
// If it IS processed, EXEC is replaced with DO; END; and DFHEIBLK is declared.
preprocessor.containsTokens(["DFHEIBLK", "DFHEIPTR"]);
verify.noDiagnostics();
