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

// @filename: cpy/include.pli
//// DCL <|1:A|> FIXED;

// @filename: cpy/include2.pli
//// A = 123;

// @wrap: main
//// %INCLUDE "include.pli";
//// %INCLUDE "include2.pli";
//// <|1>A = 123;
//// PUT(<|1>A);

verify.noDiagnostics();
linker.expectLinks();
