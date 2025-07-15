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

//// %DECLARE A(3) CHARACTER;
//// %A(1) = 'A';
//// %A(2) = 'B';
//// %A(3) = 'C';
//// %DECLARE Y CHAR;
//// %Y = A(1) || A(2) || A(3);
//// X = Y;

preprocessor.expectTokens(" X = ABC;");
