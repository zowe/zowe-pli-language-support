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

// @compiler: true
//// TEST_PCK: PACKAGE;
//// DEFINE STRUCT 1 <|A|>, 2 B FIXED;
//// TEST: PROC OPTIONS(MAIN);
////   DCL <|H|> POINTER;
////   DCL VAR HANDLE(A);
////   VAR = BIND(:<|A>A, <|H>H:);
//// END TEST;

linker.expectLinks();
verify.noParserDiagnostics();
