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

/// <reference path="../../../framework.ts" />

// A null argument in an invocation from input text leaves its parameter unset,
// so PARMSET returns '0'B for it. Only the non-null argument counts as set.

//// %TEST: PROC (X, Y, Z) RETURNS (CHAR);
////   RETURN (PARMSET(X) || " " || PARMSET(Y) || " " || PARMSET(Z));
//// %END;
//// %ACTIVATE TEST;
//// TEST(,B,)

preprocessor.expectTokens(`
  0 1 0
`);
