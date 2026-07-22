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

// When only SQL is configured (CICS excluded), an EXEC SQL statement is processed
// normally by the dedicated SQL phase, while an EXEC CICS statement in the same file
// still correctly gets the "requires PP(CICS)" diagnostic.

// @wrap: process
////*PROCESS PP(MACRO SQL);
//// TEST: PROCEDURE OPTIONS (MAIN);
////   EXEC SQL BEGIN DECLARE SECTION;
////     DCL EMPNO CHAR(6);
////   EXEC SQL END DECLARE SECTION;
////   <|1:EXEC|> CICS ABEND ABCODE('$CAN');
//// END TEST;

preprocessor.containsTokens(["DCL", "EMPNO", "CHAR"]);
verify.expectExclusiveDiagnosticsAt(1, {
  message: code.CompilerOptions.PP.CicsPreprocessorRequired.message(),
});
