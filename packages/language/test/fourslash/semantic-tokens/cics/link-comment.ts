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

/// <reference path="../../framework.ts" />

// @wrap: main
//// EXEC CICS <|LINK|> <|ACTIVITY|>("BOOT") <|comment:*> Hallo;|>

// The CICS line comment runs to end of line, so it swallows the `;` on its own line - the
// quote/comment-aware fragment scan (`scanExecFragments`) is the single source of the
// statement's tokens, and it highlights the comment including that `;`.
semanticTokens.expectAt("LINK", "keyword");
semanticTokens.expectAt("ACTIVITY", "keyword");
semanticTokens.expectAt("comment", "comment");
