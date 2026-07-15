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

//// TEST: PROC;
////   %DECLARE SYSTEM CHARACTER;
////   %SYSTEM = 'CICS';
////   %IF TRIM(SYSTEM) ^= 'CICS'
////   %THEN %DO;
////     <|1:EXEC|> CICS ABEND ABCODE('$CAN');
////   %END;
////   %ELSE %DO;
////     /* This branch is taken */
////     DCL VAR1 FIXED BIN(31);
////   %END;
//// END;

// EXEC CICS inside a %IF/%THEN/%DO block should be recognized and processed.
// Since SYSTEM = 'CICS', the condition is false, so the ELSE branch is taken - the %THEN
// branch's EXEC CICS never reaches the output, so no CICS declarations are generated.
preprocessor.containsTokens([
  "TEST",
  ":",
  "PROC",
  ";",
  "DCL",
  "VAR1",
  "FIXED",
  "BIN",
  "(",
  "31",
  ")",
  ";",
  "END",
  ";",
]);
verify.noDiagnostics(1);
