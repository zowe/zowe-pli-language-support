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

////*PROCESS RULES(MULTICLOSE);
//// PKG: PACKAGE;
////    PROC1: PROCEDURE OPTIONS(MAIN);
////       DCL I FIXED BIN(31);
////       DO I = 1 TO 10;
////          BEGIN;
////             PUT SKIP LIST('NESTED');
//// <|END|> PKG;

verify.noParserErrors();
verify.expectDiagnosticsAt("END", code.Warning.IBM1120I);
