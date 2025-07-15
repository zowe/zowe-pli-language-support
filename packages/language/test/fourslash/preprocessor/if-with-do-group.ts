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

/// <reference path="../framework.ts" />

//// %A = 1;
//// %IF 1 %THEN %DO;
////   %A = A + 1;
////   %A = A + 2;
//// %END;
//// %ACTIVATE A;
//// dcl X fixed;
//// X = A;

preprocessor.expectTokens(" dcl X fixed; X = 4;");
