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
// @wrap: main
// @wrapTokens
//// %A = 12;
//// %IF A = 12 %THEN DO;
////   PUT LIST('CORRECT');
//// %END;
//// %ELSE DO;
////   PUT LIST('ERROR');
//// %END;

preprocessor.expectTokens("PUT LIST('CORRECT');");
