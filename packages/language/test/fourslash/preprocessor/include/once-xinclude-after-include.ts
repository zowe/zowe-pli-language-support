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

// @filename: cpy/payroll.pli
//// DECLARE PAYROLL FIXED;

// @filename: main.pli
//// %INCLUDE "payroll.pli";
//// %XINCLUDE "payroll.pli";

preprocessor.expectTokens(`
  DECLARE PAYROLL FIXED;
`);
