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
 * Go-to-definition from inside one included file resolves to a variable declared in a
 * *different* included file.
 */

// @filename: cpy/decls.pli
//// DCL <|1:SHARED_VAR|> FIXED BIN(31);

// @filename: cpy/logic.pli
//// <|1>SHARED_VAR = 42;

// @filename: main.pli
//// %INCLUDE "decls.pli";
//// %INCLUDE "logic.pli";

linker.expectLinks();
