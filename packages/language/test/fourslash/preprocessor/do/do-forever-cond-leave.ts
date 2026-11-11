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
 * Do forever with conditional leave.
 */
// @compiler: true
// @wrap: main
// @wrapTokens
//// %declare A fixed;
//// %A = 3;
//// %DO FOREVER;
////   PUT LIST(A);
////   %A = A - 1;
////   %IF A = 0 %THEN %LEAVE;
//// %END;

preprocessor.expectTokens("PUT LIST(3); PUT LIST(2); PUT LIST(1);");
