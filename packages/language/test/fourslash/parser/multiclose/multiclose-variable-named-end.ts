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

/**
 * Test that a variable named END can be used in multiclose scenarios.
 * The parser should correctly distinguish between "END = ..." (variable assignment)
 * and "END LABEL;" (END statement for multiclose).
 */

////*PROCESS RULES(MULTICLOSE);
//// TEST: PROC OPTIONS(MAIN);
////    DCL END CHAR(20);
////    OUTER: DO;
////       INNER: DO;
////          END = 'HELLO_WORLD';
////          PUT SKIP LIST(END);
//// <|END|> OUTER;
////    PUT SKIP LIST('AFTER');
//// END TEST;

verify.noParserErrors();
verify.expectDiagnosticsAt("END", code.Warning.IBM1120I);
