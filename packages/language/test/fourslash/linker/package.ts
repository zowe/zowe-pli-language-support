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

/// <reference path="../framework.ts" />

/**
 * A package and procedure should be able to have the same name.
 */

//// <|1:RGT005|>: PACKAGE EXPORTS(<|2>RGT005);
//// <|2:RGT005|>: PROCEDURE() OPTIONS(MAIN);
////
////   DCL SYSNULL BUILTIN;
////   DCL  P1     POINTER;
////   P1 = SYSNULL;
////   DCL (I,J) CHAR(32);
////   I = 'This is a test string';
////   J = SUBSTR(I,1,10);
////   PUT SKIP LIST(I);
////   PUT SKIP LIST(J);
//// END <|2>RGT005;
//// END <|1>RGT005;

verify.noDiagnostics(1);
verify.noDiagnostics(2);
linker.expectLinks();
