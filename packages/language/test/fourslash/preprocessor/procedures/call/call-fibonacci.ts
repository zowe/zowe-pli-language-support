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

//// %fibonacci: PROC (N);
////   DCL N FIXED;
////   DCL PREVIOUS FIXED;
////   DCL CURRENT FIXED;
////   PREVIOUS = 0;
////   CURRENT = 1;
////   DO I = 1 TO N;
////      DCL TEMP FIXED;
////      TEMP = PREVIOUS;
////      PREVIOUS = CURRENT;
////      CURRENT = TEMP + PREVIOUS;
////   END;
////   ANSWER ('VAR = '||CURRENT||';') SKIP;
//// %END;
//// %something: PROC;
////   CALL fibonacci(4);
////   CALL fibonacci(5);
////   CALL fibonacci(6);
//// %END;
//// %ACTIVATE something;
//// ppp: PROC;
////   DCL VAR FIXED;
////   something
//// END;

preprocessor.expectTokens(`
    ppp: PROC;
        DCL VAR FIXED;
        VAR =        5;
        VAR =        8;
        VAR =       13;
    END;
`);
verify.noDiagnostics();
