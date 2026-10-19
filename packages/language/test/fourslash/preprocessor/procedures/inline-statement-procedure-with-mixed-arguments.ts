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

//// %TEST: PROC (A, B, C) STATEMENT RETURNS (CHAR);
////   RETURN (A || B || C);
//// %END;
//// %ACTIVATE TEST;
//// PREFIX TEST(,2) A(1) C(3); SUFFIX

/* Expect output = input */
preprocessor.expectTokens("PREFIX 123 SUFFIX");
