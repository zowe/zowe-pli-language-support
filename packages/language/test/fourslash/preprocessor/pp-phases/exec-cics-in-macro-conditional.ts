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

// EXEC CICS embedded inside a macro %IF/%THEN/%DO conditional is handled by the dedicated
// CICS phase only after the MACRO phase decides which branch survives - the MACRO phase's
// own internal walk merely recognizes the EXEC statement to correctly delimit the %DO
// block, without invoking the real CICS engine itself. Here SYSTEM = 'CICS', so the
// condition is false and the %ELSE branch is taken, leaving only the SIGNAL ERROR
// statement; the %THEN branch's EXEC CICS statement is discarded entirely and never
// reaches the CICS phase at all.

//// TEST: PROC;
////   %DECLARE SYSTEM CHARACTER;
////   %SYSTEM = 'CICS';
////   %IF TRIM(SYSTEM) ^= 'CICS'
////   %THEN %DO;
////     EXEC CICS ABEND ABCODE('$CAN');
////   %END;
////   %ELSE %DO;
////     SIGNAL ERROR;
////   %END;
//// END;

preprocessor.containsTokens([
  "TEST",
  ":",
  "PROC",
  ";",
  "SIGNAL",
  "ERROR",
  ";",
  "END",
  ";",
]);
verify.noDiagnostics();
