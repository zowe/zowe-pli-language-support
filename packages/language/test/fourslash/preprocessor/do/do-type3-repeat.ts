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
 * DO Type 3 - DO with REPEAT
 */
// The compiler will actually show a parser error on REPEAT and execute the DO body once
// @compiler: skip
//// %DCL I FIXED;
//// %DO I = 1 REPEAT 2*I UNTIL(I > 6);
////   I
//// %END;

preprocessor.expectTokens(`
  1
  2
  4
  8
`);
