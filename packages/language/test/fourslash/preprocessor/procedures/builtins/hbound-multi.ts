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

/// <reference path="../../../framework.ts" />

//// %DCL A(2:4, 3:6, 4:8) CHAR;
//// %DCL (X, Y, Z) CHAR;
//// %X = HBOUND(A, 1);
//// %Y = HBOUND(A, 2);
//// %Z = HBOUND(A, 3);
//// X Y Z

preprocessor.expectTokens("4 6 8");
