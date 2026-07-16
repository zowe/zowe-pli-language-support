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

// With CICS excluded from PP(...), an EXEC CICS statement nested inside a %DO/%IF block
// (even with no enclosing PROC) must NOT be silently processed by the MACRO phase's own internal walk.
// It should be preserved unchanged and, since no dedicated CICS phase exists to process it, reach
// the final grammar parse unresolved - producing the same generic parse error as any other
// unrecognized bare EXEC statement.

// @wrap: process
////*PROCESS PP(MACRO);
////
//// %IF TRIM(SYSTEM) ^= 'CICS'
//// %THEN %DO;
////      <|1:EXEC|> CICS ABEND ABCODE('$CAN');
//// %END;
//// %ELSE %DO;
////      SIGNAL ERROR;
//// %END;

verify.expectDiagnosticsAt(1, code.Parser.unexpectedToken("EXEC"));
