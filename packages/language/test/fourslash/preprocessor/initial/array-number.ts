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

/// <reference path="../../framework.ts" />

// @compiler: true
//// %DECLARE A(4) FIXED INIT(10, 20, 30, 40);
//// %A1 = A(1);
//// %A2 = A(2);
//// %A3 = A(3);
//// %A4 = A(4);
//// %ACT A1, A2, A3, A4;
//// A1 A2 A3 A4

preprocessor.expectTokens("10 20 30 40");
