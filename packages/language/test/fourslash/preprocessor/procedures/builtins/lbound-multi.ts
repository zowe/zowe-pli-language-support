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
//// %X = LBOUND(A, 1);
//// %Y = LBOUND(A, 2);
//// %Z = LBOUND(A, 3);
//// X Y Z

preprocessor.expectTokens("2 3 4");
