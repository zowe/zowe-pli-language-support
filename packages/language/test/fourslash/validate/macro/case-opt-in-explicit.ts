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

////%PROCESS PP(MACRO('CASE(UPPER)'));
//// %DCL <|1:x|> <|2:char|>;
//// %DCL Y CHAR;
//// %X = <|3:"PUT SKIP LIST('Hello, World!');"|>;
////
//// %TEST: PROC RETURNS (CHAR);
////   RETURN (X);
//// %END;
////
//// RGT005: <|3:pROCEDURE|>() OPTIONS(MAIN);
////   %Y = TEST();
////   Y
//// END RGT005;

verify.expectDiagnosticsAt(1, code.LspCodes.UpperCase);
verify.expectDiagnosticsAt(2, code.LspCodes.UpperCase);
verify.expectDiagnosticsAt(3, code.LspCodes.UpperCase);
