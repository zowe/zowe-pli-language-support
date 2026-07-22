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

// With CICS excluded from PP(...), the "requires PP(CICS)" diagnostic must still fire
// correctly for an EXEC CICS statement whose fragment contains a macro variable reference.

// @wrap: process
////*PROCESS PP(MACRO);
//// %DCL CODEVAR CHAR;
//// %CODEVAR = '''$CAN''';
//// %DO;
////   <|1:EXEC|> CICS ABEND ABCODE(CODEVAR);
//// %END;

verify.expectExclusiveDiagnosticsAt(1, {
  message: code.CompilerOptions.PP.CicsPreprocessorRequired.message(),
});
