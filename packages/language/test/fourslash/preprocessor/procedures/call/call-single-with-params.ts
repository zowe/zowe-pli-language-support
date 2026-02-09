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

//// %make: PROC(LEFT, RIGHT);
////   DCL LEFT FIXED;
////   DCL RIGHT FIXED;
////   ANSWER ('VAR = '||(LEFT+RIGHT)||';');
//// %END;
//// %something: PROC;
////   CALL make(1, 2);
//// %END;
//// %ACTIVATE something;
//// DCL VAR FIXED;
//// something

preprocessor.expectTokens(`
    DCL VAR FIXED;
    VAR = 3;
`);
verify.noDiagnostics();
