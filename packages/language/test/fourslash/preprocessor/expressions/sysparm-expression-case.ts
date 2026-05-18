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
//// %DCL POS FIXED;
//// %POS = 26;
//// %X = 34 - POS - 5;
//// X

// This tests the bug scenario associated with #633.
// Left-associative: (34 - 26) - 5 = 8 - 5 = 3
// NOT right-associative: 34 - (26 - 5) = 34 - 21 = 13
preprocessor.expectTokens("3");
