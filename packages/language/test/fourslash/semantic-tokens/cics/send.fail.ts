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
//// EXEC CICS <|SEND|> <|FROM|>(<|XXX:'XXX'|>) <|LENGTH|>(<|100|>);

semanticTokens.expectAt("SEND", "keyword");
semanticTokens.expectAt("FROM", "modifier");
semanticTokens.expectAt("XXX", "string");
semanticTokens.expectAt("LENGTH", "modifier");
semanticTokens.expectAt("100", "number");
