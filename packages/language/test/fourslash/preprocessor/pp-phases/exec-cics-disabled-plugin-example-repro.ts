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

// PP(MACRO("CASE(UPPER)")) fully replaces the defaults, so CICS is genuinely not
// configured here. Both the %DO-nested and the completely bare EXEC CICS statement
// should get the dedicated "requires PP(CICS)" diagnostic.

// @filename: main.pli
////%PROCESS OR('|'), NOT ('^') ;
////%PROCESS PP(MACRO("CASE(UPPER)"));
////
//// %IF TRIM(SYSTEM) ^= 'CICS'
//// %THEN %DO;
////      <|1:EXEC|> CICS ABEND ABCODE('$CAN');
//// %END;
//// %ELSE %DO;
////      SIGNAL ERROR;
//// %END;
////
//// <|2:EXEC|> CICS ABEND ABCODE('$CAN');

verify.expectExclusiveDiagnosticsAt(1, {
  message: code.CompilerOptions.PP.CicsPreprocessorRequired.message(),
});
verify.expectExclusiveDiagnosticsAt(2, {
  message: code.CompilerOptions.PP.CicsPreprocessorRequired.message(),
});
