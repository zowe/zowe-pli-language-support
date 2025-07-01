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
 * Must link on included files
 */

// @filename: cpy/include.pli
//// DCL <|1:X|> FIXED;

// @filename: cpy/include2.pli
//// DCL <|2:Y|> FIXED;

// @filename: main.pli
//// %INCLUDE "include.pli";
//// %INCLUDE "include2.pli";
//// <|1>X = 42;
//// <|2>Y = 43;

linker.expectLinks();
