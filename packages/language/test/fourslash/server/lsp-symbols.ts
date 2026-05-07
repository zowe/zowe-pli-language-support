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

//// MAINPROG: PROC OPTIONS(MAIN);
////   DCL GLOBAL_VAR FIXED BIN(31);
////   DCL LOCAL_STRING CHAR(50);
////
////   GLOBAL_VAR = 100;
////   LOCAL_STRING = 'Test Program';
////
////   CALL HELPER_PROC(GLOBAL_VAR);
////
////   PUT SKIP LIST('Done:', GLOBAL_VAR);
//// END MAINPROG;
////
//// HELPER_PROC: PROC(INPUT_PARAM);
////   DCL INPUT_PARAM FIXED BIN(31);
////   DCL HELPER_LOCAL FIXED BIN(31);
////
////   HELPER_LOCAL = INPUT_PARAM * 2;
////   PUT SKIP LIST('Helper:', HELPER_LOCAL);
//// END HELPER_PROC;
////
//// UTILITY_FUNC: PROC(X, Y) RETURNS(FIXED BIN(31));
////   DCL X FIXED BIN(31);
////   DCL Y FIXED BIN(31);
////   DCL RESULT FIXED BIN(31);
////
////   RESULT = X + Y;
////   RETURN(RESULT);
//// END UTILITY_FUNC;

// Test 1: Document Symbols - get all symbols in the current document
await server.documentSymbols.expectSymbols([
  "MAINPROG",
  "HELPER_PROC",
  "UTILITY_FUNC",
]);

// Test 2: Document Symbols - explicitly query for a specific file
await server.documentSymbols.expectSymbols("main.pli", [
  "MAINPROG",
  "HELPER_PROC",
  "UTILITY_FUNC",
]);

// Test 3: Workspace Symbols - search for procedure names
await server.workspaceSymbols.expectSymbols("PROC", ["HELPER_PROC"]);

// Test 4: Workspace Symbols - search for specific variable
await server.workspaceSymbols.expectSymbols("GLOBAL_VAR", ["GLOBAL_VAR"]);

// Test 5: Workspace Symbols - search for function names
await server.workspaceSymbols.expectSymbols("FUNC", ["UTILITY_FUNC"]);
