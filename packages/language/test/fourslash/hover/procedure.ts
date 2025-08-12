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

//// MyProc: PROCEDURE OPTIONS(MAIN) REORDER;
//// END <|1>MyProc;
//// CALL <|2>MyProc;

const expectedMarkdown = hover.codeBlock("MyProc: PROC OPTIONS(MAIN) REORDER;");
hover.expectMarkdownAt(1, expectedMarkdown);
hover.expectMarkdownAt(2, expectedMarkdown);
