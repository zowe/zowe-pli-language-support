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

// PP(MACRO MACRO MACRO) runs the macro preprocessor three times, with the output tokens of the first
// pass becoming the input tokens of the second (Token[] -> MACRO -> Token[] -> MACRO -> Token[] -> MACRO -> ...).
//
// First pass:  TEST  ->  % DCL Y FIXED ; % Y = 7 ; Y   (generated macro code, not yet run)
// Second pass: the generated macro code runs  ->  7
// Third pass: the result of the second pass (7) is processed again, but since it's just a literal token with no macros to expand, it remains 7.

////*PROCESS PP(MACRO MACRO MACRO);
//// %TEST: PROC RETURNS (CHAR);
////   RETURN ('%DCL Y FIXED; %Y = 7; Y');
//// %END;
//// %ACTIVATE TEST;
//// TEST

preprocessor.expectTokens("7");
