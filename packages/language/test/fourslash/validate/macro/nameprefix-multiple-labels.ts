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

////%PROCESS PP(MACRO('NAMEPREFIX(X)'));
//// %DCL x char;
//// %DCL <|1:Y|> CHAR;
//// %X = "PUT SKIP LIST('Hello, World!');";
////
//// %<|2:TEST|>: <|3:TEST2|>: PROC RETURNS (CHAR);
////   RETURN (X);
//// %END;
////
//// <|4:RGT005|>: PROCEDURE() OPTIONS(MAIN);
////   %Y = TEST();
////   Y
//// END RGT005;

verify.expectDiagnosticsAt(1, code.Error.IBM3518I);
verify.expectDiagnosticsAt(2, code.Error.IBM3518I);
verify.expectDiagnosticsAt(3, code.Error.IBM3518I);
verify.noDiagnostics(4, code.Error.IBM3518I);
