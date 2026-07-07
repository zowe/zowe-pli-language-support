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

//// <|comment1:/* a comment that mentions happens and with before the directive|>
////<|comment2:    and a second line of that very same comment here */|>
////*PROCESS <|modifier:MARGINS|>(<|number:2|>,72);
//// MAIN: PROC OPTIONS(MAIN);
//// END MAIN;

semanticTokens.expectAt("comment1", "comment");
semanticTokens.expectAt("comment2", "comment");
semanticTokens.expectAt("modifier");
semanticTokens.expectAt("number");
