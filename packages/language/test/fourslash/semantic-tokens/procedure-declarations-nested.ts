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

// @wrap: main
//// <|function:OUTER|>: PROC;
//// <|function:INNER|>: PROC;
////   DCL <|variable:X|> FIXED BIN(31);
////   <|variable:X|> = 5;
//// END <|function:INNER|>;
//// END <|function:OUTER|>;

semanticTokens.expectAt("function");
semanticTokens.expectAt("variable");
