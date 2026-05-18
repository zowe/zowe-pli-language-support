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
 * DO Type 3 - DO without explicit loop variable declaration
 *
 * This will implicitly declare an incactive loop variable I (and set it to 1).
 * In this test, we don't activate the loop variable such it is not substituted by its value.
 */
// @compiler: true
//// %DO I = 1 TO 2;
////   I
//// %END;

preprocessor.expectTokens(`
  I
  I
`);
