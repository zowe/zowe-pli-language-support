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
 * Semantic tokens are produced for the *included* file's own text, not just the main file.
 */

// @filename: cpy/vars.pli
//// DCL <|1:INC_VAR|> FIXED BIN(31);
//// <|2:INC_VAR|> = 42;

// @filename: main.pli
//// %INCLUDE "vars.pli";
//// INC_VAR = 1;

semanticTokens.expectAt("1", "variable");
semanticTokens.expectAt("2", "variable");
