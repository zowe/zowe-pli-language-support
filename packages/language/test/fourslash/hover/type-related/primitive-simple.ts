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

/**
 * Failing test for hover on regular variable declaration
 */

//// DCL MyVar FIXED DECIMAL(2,5);
//// <|1>MyVar = 12.1234;

hover.expectMarkdownAt(
  1,
  hover.codeBlock("DCL MYVAR FIXED DECIMAL PRECISION(2, 5);"),
);
