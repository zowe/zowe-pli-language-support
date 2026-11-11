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

/**
 * Select statement multiple conditions.
 */
// @compiler: true
// @wrap: main
// @wrapTokens
//// %SELECT;
//// %WHEN (0, 1, 2) DO; X = 1; %END;
//// %OTHERWISE DO; Y = 1; %END;
//// %END;

preprocessor.expectTokens("X = 1;");
