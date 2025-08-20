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

/**
 * Failing test for hover on procedure declaration and call
 */

// @filename: cpy/lib.pli
//// MyProc2: PROC (A) RETURNS(fixed bin(15));
//// dcl A fixed bin(15);
//// END MyProc2;

//// %include "lib.pli";
//// MyProc: PROC (A, B, C) OPTIONS(MAIN, Order)
////    RECURSIVE REORDER RETURNS (fixed bin(31));
//// dcl A fixed bin(31);
//// dcl B fixed bin(15);
//// dcl C fixed bin(7);
//// END <|1>MyProc;
//// CALL <|2>MyProc;
//// CALL <|3>MyProc2;

verify.noDiagnostics();
const expectedMarkdown = hover.codeBlock(
  "MYPROC: PROC(A,B,C) OPTIONS(MAIN, ORDER) RECURSIVE REORDER RETURNS(FIXED BIN(31));",
);
hover.expectMarkdownAt(1, expectedMarkdown);
hover.expectMarkdownAt(2, expectedMarkdown);
hover.expectMarkdownAt(
  3,
  hover.codeBlock("MYPROC2: PROC(A) RETURNS(FIXED BIN(15));"),
);
