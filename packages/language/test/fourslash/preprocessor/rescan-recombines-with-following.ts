/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

/// <reference path="../framework.ts" />

/**
 * A macro variable expansion that opens a construct (`PUT (A`) is completed by the tokens
 * *following* the variable reference in the original source (`);`) - the expansion glues
 * directly onto them because the reference itself was immediately followed by `)`.
 */
// @compiler: true
//// %DECLARE V CHARACTER;
//// %V = 'PUT (A';
//// V);

preprocessor.expectTokens("PUT (A);");
