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

// @filename: cpy/LIB.xyz
//// DECLARE LIB_VAR FIXED;

// @filename: cpy/lib.abc
//// DECLARE LIB_VAR FIXED;

// @filename: main.pli
//// // check variants of includes that could pull in a bad file
//// %INCLUDE LIB;
//// %INCLUDE lib;
//// %INCLUDE "LIB";
//// %INCLUDE "lib";

preprocessor.expectTokens(``);
