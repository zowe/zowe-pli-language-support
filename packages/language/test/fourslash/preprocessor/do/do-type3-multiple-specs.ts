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
 * DO Type 3 - DO with multiple specifications
 */
// The compiler will show an error on the second specification and execute the DO body once with the first specification
// @compiler: skip
//// %DCL I FIXED;
//// %DO I = 1 TO 2, 4 TO 6 BY 2;
////   I
//// %END;

// multiple specifications not supported
preprocessor.expectTokens("");
