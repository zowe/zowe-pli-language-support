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
 * Failing test for hover on procedure PP synthesized procedure
 */

//// %DCL GENPROC INIT("MyProc: PROC(A,B,C) OPTIONS(MAIN) RETURNS(fixed bin(31));");
//// GENPROC
//// END <|1>MyProc;
//// CALL <|2>MyProc;

verify.noDiagnostics();
const expectedMarkdown2 = hover.codeBlock(
  "MyProc: PROC(A,B,C) OPTIONS(MAIN,ORDER) RECURSIVE REORDER RETURNS(FIXED BIN(31));",
);
hover.expectMarkdownAt(1, expectedMarkdown);
hover.expectMarkdownAt(2, expectedMarkdown);
hover.expectMarkdownAt(
  3,
  hover.codeBlock("MyProc2: PROC(A) RETURNS(FIXED BIN(15));"),
);
