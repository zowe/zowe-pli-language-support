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
////       DCL X FIXED BIN(31);
////       X = 1;
////    END PROC1;
//// // No END PKG - valid (PACKAGE END is always optional)

verify.noParserDiagnostics();
