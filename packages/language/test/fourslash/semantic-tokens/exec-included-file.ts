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
 * Semantic tokens are produced for an `EXEC SQL INCLUDE`d file's own text, just like for
 * `%INCLUDE` - the file's registration must hold the final annotated tokens, not the raw
 * tokenization the SQL phase registered it with.
 */

// @filename: cpy/sqlvars.pli
//// DCL <|1:SQL_VAR|> FIXED BIN(31);
//// <|2:SQL_VAR|> = 42;

// @filename: main.pli
//// EXEC SQL INCLUDE sqlvars;
//// SQL_VAR = 1;

semanticTokens.expectAt("1", "variable");
semanticTokens.expectAt("2", "variable");
