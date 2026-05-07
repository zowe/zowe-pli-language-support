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

//// TESTPROG: PROC OPTIONS(MAIN);
////   DCL <|X>X FIXED BIN(31);
////   DCL Y FIXED BIN(31);
////
////   X = 10;
////   <|Y>Y = X + 5;
////   PUT SKIP LIST(X, Y);
////
////   CALL <|SUB>SUB_PROC(X);
//// END TESTPROG;
////
//// SUB_PROC: PROC(PARAM);
////   DCL PARAM FIXED BIN(31);
////   PUT SKIP LIST('Parameter:', PARAM);
//// END SUB_PROC;

// Test 1: References via textDocument/references
// Find all references to variable X
await server.references.expectAt("X", 5); // DCL (2 tokens), assignment, expression, PUT LIST

// Test 2: Document Highlight via textDocument/documentHighlight
await server.documentHighlight.expectAt("Y", 3); // DCL, assignment, PUT LIST

// Test 3: Rename via textDocument/rename
await server.rename.expectAt("SUB", "MY_SUBROUTINE");
