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

// @compiler: skip
//// %DECLARE A(3) CHARACTER;
//// %A(1) = 'A';
//// %A(2) = 'B';
//// %A(3) = 'C';
//// %DECLARE B(3) CHARACTER;
//// // This should assign the whole array
//// %B = A;
//// %DECLARE Y CHAR;
//// %Y = B(1) || B(2) || B(3);
//// X = Y;

preprocessor.expectTokens("X = ABC;");
