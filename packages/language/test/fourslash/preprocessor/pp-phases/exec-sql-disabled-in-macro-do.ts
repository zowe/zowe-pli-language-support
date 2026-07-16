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

// Mirrors exec-cics-disabled-in-macro-do-no-proc.ts for EXEC SQL, confirming the behavior
// is not CICS-specific: with SQL excluded from PP(...), an EXEC SQL statement nested inside a
// %DO/%IF block must not be silently processed by the MACRO phase's own internal walk.

// @wrap: process
////*PROCESS PP(MACRO);
////
//// %IF TRIM(SYSTEM) ^= 'CICS'
//// %THEN %DO;
////      <|1:EXEC|> SQL BEGIN DECLARE SECTION;
////      DCL EMPNO CHAR(6);
////      EXEC SQL END DECLARE SECTION;
//// %END;
//// %ELSE %DO;
////      SIGNAL ERROR;
//// %END;

verify.expectDiagnosticsAt(1, code.Parser.unexpectedToken("EXEC"));
