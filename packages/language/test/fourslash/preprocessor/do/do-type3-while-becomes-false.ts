/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright (c) 2026 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 */

/// <reference path="../../framework.ts" />

/**
 * DO Type 3 - WHILE condition starts true then becomes false
 * Tests case where WHILE condition controls loop termination
 */
// @compiler: true
//// %DCL I FIXED;
//// %DO I = 1 TO 10 WHILE(I <= 2);
////   I
//// %END;

preprocessor.expectTokens(`
  1
  2
`);
