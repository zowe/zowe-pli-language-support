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

/// <reference path="../framework.ts" />

// @compiler: true
//// %IF 1 %THEN DO;
////   %A = 123;
//// %END;
//// %ELSE DO;
////   %A = 456;
//// %END;
//// %ACTIVATE A;
//// A

preprocessor.expectTokens("123");
