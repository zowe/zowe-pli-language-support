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

// With CICS excluded from PP(...), an EXEC CICS statement nested inside a %DO block placed
// inside a real PROC body. This test guards against a regression that would make it
// silently succeed, and documents that the "requires PP(CICS)" diagnostic is now uniform
// regardless of whether an enclosing PROC is present.

// @wrap: process
////*PROCESS PP(MACRO);
//// TEST: PROC;
////   %IF TRIM(SYSTEM) ^= 'CICS'
////   %THEN %DO;
////        <|1:EXEC|> CICS ABEND ABCODE('$CAN');
////   %END;
////   %ELSE %DO;
////        SIGNAL ERROR;
////   %END;
//// END;

verify.expectExclusiveDiagnosticsAt(1, {
  message: code.CompilerOptions.PP.CicsPreprocessorRequired.message(),
});
