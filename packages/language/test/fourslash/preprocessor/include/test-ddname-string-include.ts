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

// Tests including a ddname(member) directly as a string literal.
// TODO @montymxb this feature may be dropped later on, potential issue since
// ddname(member) shouldn't be importable directly as a file, not the intended use case.

/// <reference path="../../framework.ts" />

// @filename: cpy/MYLIB(member)
//// DECLARE LIB_VAR FIXED;

// @filename: main.pli
//// %INCLUDE "MYLIB(member)";

preprocessor.expectTokens(`
  DECLARE LIB_VAR FIXED;
`);
