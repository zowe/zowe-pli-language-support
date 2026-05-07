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
////*PROCESS RULES(LAXIF);
//// MY_PKG: PACKAGE;
////    P: PROC OPTIONS(MAIN);
////       IF 0 THEN DO;
////          PUT SKIP LIST('IF BODY STATEMENT 1');
//// <|END|> MY_PKG;

verify.noParserErrors();
verify.expectDiagnosticsAt("END", code.Warning.IBM1120I);
