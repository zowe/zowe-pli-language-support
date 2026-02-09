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
////
//// DCL VAR FIXED;
//// MYMACRO

preprocessor.expectTokens(`
 DCL VAR FIXED;
 VAR = 2;
`);
verify.noDiagnostics();
