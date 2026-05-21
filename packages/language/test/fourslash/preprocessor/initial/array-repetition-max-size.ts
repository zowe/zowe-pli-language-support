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

//// %DECLARE A(2) FIXED INIT((4)1);
//// %A1 = A(1);
//// %A2 = A(2);
//// %VAL = DIMENSION(A);
//// %ACT A1, A2, VAL;
//// A1 A2 VAL

// Even though the repetition count is larger than the array size
// The DIMENSION call should still return the correct size of the array, not the repetition count
preprocessor.expectTokens("1 1 2");
