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

//// %TEST: PROC (X, Y, Z) RETURNS (CHAR);
////   // The declaration should have no influence on the output
////   DCL (X, Y, Z) CHAR;
////   RETURN (PARMSET(X) || " " || PARMSET(Y) || " " || PARMSET(Z));
//// %END;
//// %DCL Y CHAR;
//// %Y = TEST("A", "B");
//// Y

preprocessor.expectTokens(`
  1 1 0
`);
