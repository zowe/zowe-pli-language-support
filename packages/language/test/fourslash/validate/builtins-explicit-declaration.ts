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

// @filename: main.pli
//// RGT005: PACKAGE EXPORTS(RGT005);
//// DCL SYSNULL BUILTIN;
//// DCL SUBSTR BUILTIN;
//// RGT005: PROCEDURE() OPTIONS(MAIN);
////   DCL  P1     POINTER;
////   P1 = <|1:SYSNULL|>;
////   DCL (I,J) CHAR(32);
////   I = 'This is a test string';
////   J = <|2:SUBSTR|>(I,1,10);
////   PUT SKIP LIST(I);
////   PUT SKIP LIST(J);
//// END RGT005;
//// END RGT005;

verify.noDiagnostics(1);
verify.noDiagnostics(2);
