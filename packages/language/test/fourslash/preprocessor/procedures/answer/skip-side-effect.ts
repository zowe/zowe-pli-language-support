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

// @compiler: true
//// %DCL I FIXED;
//// %I = 1;
////
//// %EFFECT: PROC RETURNS (FIXED);
////   I = 2;
////   RETURN (I);
//// %END;
////
//// %MYMACRO: PROC;
////   ANSWER ('VAR = I;') SKIP (EFFECT());
//// %END;
////
//// %ACTIVATE MYMACRO;
//// MAIN: PROC OPTIONS(MAIN);
//// DCL VAR FIXED;
//// MYMACRO
//// END MAIN;

preprocessor.expectTokens(`
    MAIN: PROC OPTIONS(MAIN);
    DCL VAR FIXED;
    VAR = 2;
    END MAIN;
`);
verify.noDiagnostics();
