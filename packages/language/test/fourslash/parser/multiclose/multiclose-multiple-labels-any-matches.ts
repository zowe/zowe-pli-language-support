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
//// L1: L2: L3: PROC OPTIONS(MAIN);
////    DO;
////       PUT SKIP LIST('HELLO');
//// <|END|> L2;

verify.noParserErrors();
verify.expectDiagnosticsAt("END", code.Warning.IBM1120I);
