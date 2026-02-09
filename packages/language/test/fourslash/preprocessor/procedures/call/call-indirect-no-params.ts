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

//// %done: PROC;
////   ANSWER ('VAR = 123;');
//// %END;
//// %make: PROC;
////   CALL done();
////   ANSWER ('VAR = 456;');
//// %END;
//// %something: PROC;
////   CALL make();
//// %END;
//// %ACTIVATE something;
//// ppp: PROC OPTIONS(MAIN);
////   DCL VAR FIXED;
////   something
//// END;

preprocessor.expectTokens(`
    ppp: PROC OPTIONS(MAIN);
        DCL VAR FIXED;
        VAR = 123;
        VAR = 456;
    END;
`);
verify.noDiagnostics();
