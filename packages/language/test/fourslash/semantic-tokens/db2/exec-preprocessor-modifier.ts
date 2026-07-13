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
//// <|EXEC|> <|SQL|> <|SELECT|> <|name|> <|FROM|> <|tbl|>;

semanticTokens.expectModifierAt("EXEC", "preprocessor");
semanticTokens.expectModifierAt("SQL", "preprocessor");
semanticTokens.expectModifierAt("SELECT", "preprocessor");
semanticTokens.expectModifierAt("name", "preprocessor");
semanticTokens.expectModifierAt("FROM", "preprocessor");
semanticTokens.expectModifierAt("tbl", "preprocessor");

semanticTokens.expectAt("EXEC", "string");
semanticTokens.expectAt("SQL", "string");
