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

// @filename: file1.pli
//// FILE1_MAIN: PROC OPTIONS(MAIN);
////   DCL FILE1_VAR FIXED BIN(31);
////   FILE1_VAR = 100;
////   CALL FILE1_HELPER;
//// END FILE1_MAIN;
////
//// FILE1_HELPER: PROC;
////   PUT SKIP LIST('Helper from file1');
//// END FILE1_HELPER;

// @filename: file2.pli
//// FILE2_MAIN: PROC OPTIONS(MAIN);
////   DCL FILE2_VAR FIXED BIN(31);
////   FILE2_VAR = 200;
////   CALL FILE2_HELPER;
//// END FILE2_MAIN;
////
//// FILE2_HELPER: PROC;
////   PUT SKIP LIST('Helper from file2');
//// END FILE2_HELPER;

// Test 1: Document symbols from file1.pli should only return symbols from that file
await server.documentSymbols.expectSymbols("file1.pli", [
  "FILE1_MAIN",
  "FILE1_HELPER",
]);

// Test 2: Document symbols from file2.pli should only return symbols from that file
await server.documentSymbols.expectSymbols("file2.pli", [
  "FILE2_MAIN",
  "FILE2_HELPER",
]);

// Test 3: Workspace symbols searches across ALL files
await server.workspaceSymbols.expectSymbols("HELPER", [
  "FILE1_HELPER",
  "FILE2_HELPER",
]);

// Test 4: Workspace symbols can find file-specific procedures
await server.workspaceSymbols.expectSymbols("FILE1", [
  "FILE1_MAIN",
  "FILE1_HELPER",
]);

// Test 5: Workspace symbols can find file-specific procedures
await server.workspaceSymbols.expectSymbols("FILE2", [
  "FILE2_MAIN",
  "FILE2_HELPER",
]);
