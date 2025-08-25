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

//// %TEST: PROC (VAR) RETURNS (CHAR);
////   DCL TEST_VAR CHAR;
////   TEST_VAR = VAR;
////   RETURN (TEST_VAR);
//// %END;
//// %DCL (X, Y) CHAR;
//// %Y = TEST("HELLO_WORLD");
//// %X = TEST_VAR; // Attempt to grab procedure local variable
//// X

/* Actually expect no tokens here, X is empty due to access to an undefined variable */
preprocessor.expectTokens([]);
