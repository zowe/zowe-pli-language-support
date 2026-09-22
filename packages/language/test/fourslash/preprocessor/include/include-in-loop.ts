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

// @filename: cpy/lib.pli
//// %DCL N FIXED;
//// %N = N + 1;
//// DCL A%;N FIXED;

// @filename: main.pli
//// %DCL I FIXED;
//// %DO I = 1 TO 10;
////   %INCLUDE LIB;
//// %END;

// Including the same member once per iteration re-executes its instructions, which the
// interpreter charges against its runaway budget - the budget has to be large enough for
// the repeated expansions of a program this size.
preprocessor.containsTokens("A10");
