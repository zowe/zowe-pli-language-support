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

// PP(MACRO MACRO) runs the macro preprocessor twice, with the output tokens of the first
// pass becoming the input tokens of the second (Token[] -> MACRO -> Token[] -> MACRO -> ...).
//
// First pass:  TEST  ->  % DCL Y FIXED ; % Y = 7 ; Y
// Second pass: the generated macro code runs  ->  7

////*PROCESS PP(MACRO MACRO);
//// %TEST: PROC RETURNS (CHAR);
////   RETURN ('%DCL Y FIXED; %Y = 7; Y');
//// %END;
//// %ACTIVATE TEST;
//// TEST

preprocessor.expectTokens("7");
