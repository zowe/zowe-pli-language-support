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
 * Linking works through two levels of `%INCLUDE`: a variable declared in the innermost
 * include is referenced from the middle include and from the main file.
 */

// @filename: cpy/inner.pli
//// DCL <|1:DEEP_VAR|> FIXED;

// @filename: cpy/outer.pli
//// %INCLUDE "inner.pli";
//// <|1>DEEP_VAR = 2;

// @filename: main.pli
//// %INCLUDE "outer.pli";
//// <|1>DEEP_VAR = 1;

linker.expectLinks();
linker.expectReferences();
