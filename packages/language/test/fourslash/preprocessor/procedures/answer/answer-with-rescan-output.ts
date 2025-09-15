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

//// %DCL VAL FIXED;
//// %VAL = 100;
//// %DEACTIVATE VAL;
//// %MYMACRO: PROC;
////   ANSWER ('VAR = VAL;') RESCAN;
//// %END;
//// %ACTIVATE MYMACRO;
//// ppp: PROC;
////   DCL VAL FIXED;
////   VAL = 200;
////   DCL VAR FIXED;
////   %ACTIVATE VAL;
////   MYMACRO
//// END;

preprocessor.expectTokens(`
    ppp: PROC;
        DCL VAL FIXED;
        VAL = 200;
        DCL VAR FIXED; 
        VAR = 100;
    END;
`);
verify.noDiagnostics();
