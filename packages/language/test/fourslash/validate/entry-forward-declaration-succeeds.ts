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

// @wrap: main
//// DCL <|dcl:TEST_PROC|> ENTRY();
//// <|proc:TEST_PROC|>: PROC;
////   PUT("HELLO WORLD");
//// END TEST_PROC;

// This file contains the `TEST_PROC` definition twice.
// Once as a forward declaration with the ENTRY attribute, and once as a procedure definition.
// This is valid in PL/I, and should not produce a redeclaration error.
verify.noDiagnostics(["dcl", "proc"], code.Error.IBM1306I);
