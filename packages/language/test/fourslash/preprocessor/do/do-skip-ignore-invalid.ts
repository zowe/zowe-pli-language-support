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
//// %DCL X FIXED;
//// %X = 1;
//// %DO SKIP;
////   invalid_code;
////   WHILE(X <= 3);
////   %X = X + 1;
//// %END;
//// X

preprocessor.expectTokens("1");
