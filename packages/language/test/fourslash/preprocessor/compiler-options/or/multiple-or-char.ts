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

/// <reference path="../../../framework.ts" />

// @filename: main.pli
////%process OR("|~");
//// MAIN: PROCEDURE OPTIONS(MAIN);
////   DCL (A, B) CHAR(10);
////   A = "X" | B;
////   B = A ~ B;
//// END MAIN;

verify.noParserDiagnostics();
