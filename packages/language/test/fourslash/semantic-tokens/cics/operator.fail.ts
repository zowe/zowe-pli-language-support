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

// This file contains a syntax error since CICS has no operators, especially not times (*).

// @wrap: main
//// EXEC CICS <|DELAY|> <|FOR|> <|HOURS|>(<|1|><|operator:*|>2);

semanticTokens.expectAt("DELAY", "keyword");
semanticTokens.expectAt("FOR", "modifier");
semanticTokens.expectAt("HOURS", "modifier");
semanticTokens.expectAt("1", "number");
verify.expectDiagnosticsAt("operator", code.Error.IBM3550I);
