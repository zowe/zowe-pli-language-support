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

// @filename: cpy/lib1.pli
//// DECLARE LIB1_VAR FIXED;

// @filename: cpy/lib2.pli
//// DECLARE LIB2_VAR FIXED;

// @filename: main.pli
////*PROCESS INCAFTER(PROCESS(lib1)) INCAFTER(PROCESS(lib2));
//// DCL TEST FIXED;

preprocessor.expectTokens(`
  DECLARE LIB1_VAR FIXED;
  DECLARE LIB2_VAR FIXED;
  DCL TEST FIXED;
`);
