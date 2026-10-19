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

//// %TEST: PROC (VAR) RETURNS (CHAR);
////   DCL VAR CHAR; // Should have no impact on the interpreter
////   RETURN (VAR);
//// %END;
//// %DCL X CHAR;
//// %DCL Y CHAR;
//// %X = "HELLO_WORLD";
//// // Test should immediately return with its input variable
//// %Y = TEST(X);
//// Y

preprocessor.expectTokens(`
  HELLO_WORLD
`);
