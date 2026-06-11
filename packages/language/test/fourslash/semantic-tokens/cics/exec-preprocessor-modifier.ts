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
//// <|EXEC|> <|CICS|> <|ABEND|> <|ABCODE|>(<|str:'$CAN'|>);

semanticTokens.expectModifierAt("EXEC", "preprocessor");
semanticTokens.expectModifierAt("CICS", "preprocessor");
semanticTokens.expectModifierAt("ABEND", "preprocessor");
semanticTokens.expectModifierAt("ABCODE", "preprocessor");
semanticTokens.expectModifierAt("str", "preprocessor");
