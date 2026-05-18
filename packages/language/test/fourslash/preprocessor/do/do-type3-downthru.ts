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

/**
 * DO Type 3 - DO with DOWNTHRU
 */
// The compiler will actually show a parser error on DOWNTHRU and execute the DO body once
// @compiler: skip
//// %DCL I FIXED;
//// %DO I = 3 DOWNTHRU 1;
////   I
//// %END;

// downthru not supported
preprocessor.expectTokens("");
