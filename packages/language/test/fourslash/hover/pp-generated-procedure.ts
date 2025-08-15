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

//// %DCL GENPROC FIXED CHAR(64);
//// %GENPROC = "P1: PROC(A,B) OPTIONS(MAIN) RETURNS(fixed bin(15));";
//// GENPROC
//// END <|1>P1;
//// CALL <|2>P1;

verify.noDiagnostics();
const expectedMarkdown2 = hover.codeBlock(
  "P1: PROC(A,B) OPTIONS(MAIN) RETURNS(FIXED BIN(15));",
);
hover.expectMarkdownAt(1, expectedMarkdown2);
hover.expectMarkdownAt(2, expectedMarkdown2);
