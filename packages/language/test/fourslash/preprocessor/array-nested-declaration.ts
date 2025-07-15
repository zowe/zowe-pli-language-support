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

//// %DECLARE A(3, 2) CHARACTER;
//// %A(1, 1) = 'A';
//// %A(2, 1) = 'B';
//// %A(3, 1) = 'C';
//// %A(1, 2) = 'D';
//// %A(2, 2) = 'E';
//// %A(3, 2) = 'F';
//// %DECLARE Y CHAR;
//// %Y = A(1, 1) || A(2, 1) || A(3, 1) || A(1, 2) || A(2, 2) || A(3, 2);
//// X = Y;

preprocessor.expectTokens(" X = ABCDEF;");
