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
 * Failing test for hover on copybook (include) directive
 */

// @filename: cpy/lib.pli
//// DECLARE LIB_VAR FIXED;

//// %DCL X CHAR;
//// %X = "lib";
//// %<|1>INSCAN X;

hover.expectMarkdownAt(
  1,
  hover.include("%INSCAN", "./cpy/lib.pli", " DECLARE LIB_VAR FIXED;"),
);
